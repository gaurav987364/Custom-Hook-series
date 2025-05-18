import React, { useEffect, useState } from 'react';

interface Props<T>{
    targetRef: React.RefObject<T | null>,
    root?: T | null,
    rootMargin?: string,
    threshold?: number,
};

export const useIntersectionObserver = <T extends Element>({
    targetRef,
    root,
    rootMargin,
    threshold = 0.2,
}: Props<T>) => {
    const [isIntersect,setIsIntersect] = useState<boolean>(false);

    useEffect(()=>{
        const observer = new IntersectionObserver(([entry])=>{
            console.log(entry);
            if(entry.isIntersecting){
                setIsIntersect(true);
                return;
            } else {
                setIsIntersect(false);
            }
        },
        {root, rootMargin, threshold});

        const currentTarget = targetRef.current;
        if(currentTarget){
            observer.observe(currentTarget);
        }

        return ()=>{ 
            if(currentTarget){
                observer.unobserve(currentTarget);
            }
            observer.disconnect();
        }
    },[targetRef, rootMargin, root, threshold]);
  return {isIntersect};
};
