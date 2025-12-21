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
      trailing: true // Capture Final
    });

    function getCalls(message: string){
        console.log(message, "called...");
    };
    const Callthis = useThrottle({fn:getCalls,delay:400,leading:true});
    console.log(Callthis("hello"));
    console.log(Callthis("hi kes ho"))
    console.log(Callthis("me bahdiya hu tum btaaoa"))
    console.log(Callthis("chal chutuyee khatam ho gya"))
    console.log(Callthis("okokoko chal bye...."))
  
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