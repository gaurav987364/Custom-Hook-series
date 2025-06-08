import React from "react";
import UndoableCardManager from "./components/UndoRedoTest";

const App:React.FC = () => {
  return (
    <div className=" w-full min-h-screen bg-slate-500 border p-4">
      <UndoableCardManager/>
    </div>
  )
}

export default App;