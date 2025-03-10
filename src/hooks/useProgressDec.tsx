import { useEffect, useState } from "react"

export const useProgressDec = (duration:number,steps:number) => {
  const [progress, setProgress] = useState<number>(100);
  const interval = duration / 100;

  const calculateProgress = (duration:number,steps:number) =>{
    if(steps <=0 || duration <= 0) return;
    let value = 100;
    const intervalId = setInterval(()=>{
        value -= steps;
        setProgress(value);
        if(value <= 0){
            clearInterval(intervalId);
            setProgress(0);
        }
    },interval);

    return intervalId;
  };

  useEffect(()=>{
    const intervalId = calculateProgress(duration,steps);
    return ()=>{
      clearInterval(intervalId);
    }
  },[steps,duration,interval]);

  return Math.floor(progress);
}
