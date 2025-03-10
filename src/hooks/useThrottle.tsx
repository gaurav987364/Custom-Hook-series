/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef } from "react";

interface ThrottleOptions {
    leading?: boolean;
    trailing?: boolean;
}
  
interface ThrottleProps<T extends (...args: any[]) => any> 
    extends ThrottleOptions {
    fn: T;
    delay: number;
}

const useThrottle = <T extends (...args: any[]) => any>({
    fn,
    delay,
    leading = true,
    trailing = true,
  }: ThrottleProps<T>) => {
    const fnRef = useRef(fn);
    const lastExecuted = useRef<number>(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const pendingArgs = useRef<Parameters<T> | undefined>(undefined);
  
    // Update function reference
    useEffect(() => {
      fnRef.current = fn;
    }, [fn]);
  
    // Cleanup
    useEffect(() => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }, []);
  
    const throttled = useCallback((...args: Parameters<T>) => {
      const now = Date.now();
      const elapsed = now - lastExecuted.current;
      
      const execute = (context: unknown, args: Parameters<T>) => {
        fnRef.current.apply(context, args);
        lastExecuted.current = Date.now();
      };
  
      const trailingExecute = () => {
        timeoutRef.current = undefined;
        if (pendingArgs.current && trailing) {
          execute(this, pendingArgs.current);
          pendingArgs.current = undefined;
        }
      };
  
      if (elapsed > delay) {
        // Leading edge execution
        if (leading) execute(this, args);
        else if (trailing) pendingArgs.current = args;
        
        timeoutRef.current = setTimeout(trailingExecute, delay);
      } else {
        // Queue trailing execution
        if (trailing) pendingArgs.current = args;
        
        if (!timeoutRef.current) {
          timeoutRef.current = setTimeout(
            trailingExecute, 
            delay - elapsed
          );
        }
      }
    }, [delay, leading, trailing]);
  
    return throttled;
};

export default useThrottle;

















//? Unlike debounce, which waits until a pause in events, throttling ensures a function is only called at most once every specified period. So the core idea is to limit how often the function can be executed.

//? First, I need to outline the key differences between throttle and debounce. Throttle is useful for scenarios like continuous events (scrolling, resizing) where you want regular updates but not too frequent. Debounce is better for events that should trigger after a pause, like search inputs.

//? Here's the optimized solution for throttle:

// we call the function once at start and then call the function after delay provide by user in b/w during the time period all calls of function would be ignore.

//Handle leading and/or trailing edges. Leading means execute immediately on the first call, trailing means execute at the end of the delay period if there were calls during it.

//!Key difference between throttle and debounce:-
//? Throttle: Ensures a function is only called at most once in a specified period.
//? Debounce: Ensures a function is only called after a pause in events.

// Events:   ---A---B---C---D---E---F---|
// Debounce: ---------------D---------F--| //api calls
// Throttle: ---A-----C-----E-----F------| //api calls