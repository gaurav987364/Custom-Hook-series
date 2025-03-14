import { useRef, useState } from "react";
import { useOutsideClick } from "./hooks/useOutsideClick";

const App = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isOpen,setIsOpen] = useState(false);
  // Add event listener to close the menu when clicked outside
  useOutsideClick({ref:divRef,onOutsideClick:()=>setIsOpen(false)});

  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div ref={divRef}>
      <button onClick={handleClick}>Toggle Menu</button>
      {isOpen && <div>Menu content</div>}
    </div>
  )
}

export default App;





