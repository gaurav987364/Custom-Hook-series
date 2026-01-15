import React from "react";
import UndoableCardManager from "./components/UndoRedoTest";

const App:React.FC = () => {
  return (
    <div className=" w-full min-h-screen bg-slate-200/15 border p-2">
      <UndoableCardManager/>
    </div>
  );
};

export default App;