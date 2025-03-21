import { useRef } from "react"
import { useIntersectionObserver } from "./hooks/useIntersectionObserver";
import { useGetFileSize } from "./hooks/useGetFileSize";

const App = () => {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const {fileSize} = useGetFileSize(162555);
  const {isIntersect} = useIntersectionObserver({
    targetRef:nameRef,
    threshold:0.1,
  });
  console.log(isIntersect)
  return (
    <div className=" w-full h-[200vh] flex flex-col items-center justify-center">
      <div className=" w-full h-[100vh] bg-red-950 text-white flex items-center justify-center">
        scroll
        <p>{fileSize}</p>
      </div>
      <div className="w-full h-[100vh] bg-slate-950 text-white flex items-center justify-center">
        <h1 ref={nameRef}>Gaurav</h1>
      </div>
    </div>
  )
}

export default App