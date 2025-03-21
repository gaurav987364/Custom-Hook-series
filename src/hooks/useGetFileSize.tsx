import { useEffect, useState } from "react"

export const useGetFileSize = (size:number) => {
 const [fileSize,setFileSize] = useState<string>("");

 const fn = (s:number)=>{
    if(s < 1024){
        return `${s} B`
    } else if(s < 1024 * 1024){
        return `${(s/1024)} KB`
    } else if(s < 1024 * 1024 * 1024){
        return `${(s/(1024 * 1024)).toFixed(2)} MB`
    } else if(s < 1024 * 1024 * 1024 * 1024) {
        return `${(s/(1024*1024*1024)).toFixed(2)} GB`
    } else {
        return `${(s/(1024*1024*1024*1024)).toFixed(2)} TB`
    }
 }

 useEffect(()=>{
    setFileSize(fn(size))
 },[size]);

 return {fileSize};
}
