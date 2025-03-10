import { useEffect, useState } from "react";

export const useProgressInc = (duration : number, incrementBy:number) => {
  const [progress,setProgress] = useState<number>(0);
  const interval = duration / 100;
 
  const calculateProgress = (duration : number, incrementBy:number)=>{
    let value = 0 ;
    if(duration <= 0 || incrementBy <= 0) return;
    const intervalId = setInterval(() => {
        value += incrementBy;
        setProgress(value);
        if(value >= 99) {
            clearInterval(intervalId);
            return;
        }
    }, interval);
    return intervalId;
  }

  useEffect(()=>{
    const intervalId = calculateProgress(duration, incrementBy);
    return () => clearInterval(intervalId); // cleanup
  },[duration,incrementBy]);

  return {progress};
};