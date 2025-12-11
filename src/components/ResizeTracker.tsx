import { useEffect, useState } from "react";
import useThrottle from "../hooks/useThrottle";

const ResizeTracker = () => {
    const [dimensions, setDimensions] = useState({ 
      width: window.innerWidth, 
      height: window.innerHeight 
    });
  
    const handleResize = useThrottle({
      fn: () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      },
      delay: 300,
      trailing: true // Capture final state
    });

    function getCalls(message: string){
        console.log(message, "called...");
    };
    const Callthis = useThrottle({fn:getCalls,delay:400,leading:true});
    console.log(callthis("hello"));
    console.log(callthis("hi kes ho"))
    console.log(callthis("me bahdiya hu tum btaaoa"))
    console.log(callthis("chal chutuyee khatam ho gya"))
    console.log(callthis("okokoko chal bye...."))
  
    useEffect(() => {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);
  
    return (
      <div>
        Window Size: {dimensions.width}px x {dimensions.height}px
      </div>
    );
};

export default ResizeTracker;