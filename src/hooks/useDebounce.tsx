/* eslint-disable @typescript-eslint/no-explicit-any */
//? Debounce hook: In debouncing we delay the execution of the function until user performs or interact with input or typing etc. so after typing ends we call the function after delay time; it is useful in search bar, typing etc.Using this we revents the unnecessary api calls.To create a production-level debounce function, especially in a React environment, we need to address several key aspects: proper cleanup, handling of this context, TypeScript generics for type safety, leading/trailing edge execution, and memory management. Here's the optimized solution:

import { useEffect, useRef } from "react";
// Leading is optional because we don't want, but it is main feature of production.
interface DebounceOptions {
    leading?: boolean;
}
  
interface DebounceProps<T extends (...args: any[]) => any> extends DebounceOptions {
    fn: T;
    delay: number;
}
  
const useDebounce = <T extends (...args: any[]) => any>({
    fn,
    delay,
    leading = false
}: DebounceProps<T>) => {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fnRef = useRef(fn);
    const leadingRef = useRef(leading); //optional
  
    // Update refs when dependencies change
    useEffect(() => {
      fnRef.current = fn;
    }, [fn]);
  
    useEffect(() => {
      leadingRef.current = leading;
    }, [leading]);
  
    // Cleanup on unmount (if there is some value in it so perform).
    useEffect(() => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }, []);
  
    return function debounced(this: ThisParameterType<T>, ...args: Parameters<T>) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const context = this;
      const invokeImmediately = leadingRef.current && !timeoutRef.current;
  
      const later = () => {
        timeoutRef.current = null;
        if (!leadingRef.current) {
          fnRef.current.apply(context, args);
        }
      };
  
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
  
      timeoutRef.current = setTimeout(later, delay);

      // Invoke the function immediately if leading is enabled
      if (invokeImmediately) {
        fnRef.current.apply(context, args);
      }
    };
};
  
export default useDebounce;