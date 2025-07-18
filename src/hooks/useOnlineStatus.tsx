import { useEffect, useState } from "react";

export const useOnlineStatus = () => {
  const [isOnline,setIsOnline] = useState<boolean>(navigator.onLine);

  const handleOnline = () => {
    setIsOnline(true);
  };
  const handleOffline = () => {
    setIsOnline(false);
  };

  useEffect(()=>{
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return ()=>{
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    }
  },[]);

  return {isOnline};
};
