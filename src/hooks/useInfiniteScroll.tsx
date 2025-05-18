/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";

interface ThrottleProps<T extends (...args:any[])=> any>{
    fn:T,
    delay:number
}
export const useInfiniteScroll = () => {
  const [page,setPage] = useState<number>(1);
  //custom loading or prevent unnecessary data fetching
  const [loading, setLoading] = useState<boolean>(false);
  //provide a button for scroll to top of page
  const [showScrollToTop, setShowScrollToTop] = useState<boolean>(false);

  const getScrollStats = ()=>{
    //scroll height & scrolltop & client height or inner height;
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = window.innerHeight;

    if(clientHeight + scrollTop + 1 >= scrollHeight){
        setLoading(true);
        setPage(prevPage => prevPage + 1);
    };
  };

  //throttle scroll
  const useThrottle = <T extends (...args: any[])=> any>({
    fn,
    delay
  }:ThrottleProps<T>) => {
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastRan = useRef(0);

    const throttledFn = useCallback((...args:Parameters<T>)=>{
        const now = Date.now();
        const elapsed = now - lastRan.current;

        if(elapsed >= delay){
            if(timeout.current){
                clearTimeout(timeout.current);
                timeout.current = null;
            }
            lastRan.current = now;
            fn(...args);
        } else if(!timeout.current){
            timeout.current = setTimeout(()=>{
                lastRan.current = Date.now();
                fn(...args);
                timeout.current = null;
            }, delay - elapsed);
        }
    },[fn ,delay]);
    return throttledFn;
  };

  //throttle a fuction
  const throttleScroll = useThrottle({fn:getScrollStats,delay:1000});

  //setting the state true when user scroll 30% of page
  const setScrollToTop = ()=>{
    const scrollTop = document.documentElement.scrollTop;
    setShowScrollToTop(scrollTop > 300);
  };
  //function to scroll to top of page when user click on button
  const ScrollToTop = ()=>{
    window.scrollTo({top:0, behavior:'smooth'});
  };
  //reset all things when user want
  const reset = ()=>{
    setPage(1);
    setLoading(false);
    setShowScrollToTop(false);
    document.documentElement.scrollTop = 0;
  };

  useEffect(()=>{
    if(loading){
        setTimeout(()=> setLoading(false), 2000);
    }
    window.addEventListener('scroll', setScrollToTop);
    window.addEventListener('scroll', throttleScroll);
    return ()=>{
        window.removeEventListener('scroll', setScrollToTop);
        window.removeEventListener('scroll', throttleScroll);
    };
  },[page,loading,throttleScroll]);

  return {page, loading, showScrollToTop, ScrollToTop, reset};
};