import { useCallback, useState } from "react";

interface Props<T> {
    past:T[];
    present:T;
    future:T[];
}

export const useP =<T extends Props<T>>(initialState:T) => {
  const [state,setState] = useState<Props<T>>({
    past:[],
    present:initialState,
    future:[]
  });

  const setValue = useCallback((newValue:T) => {
    setState(({past,present})=>({
        past:[...past,present],
        present:newValue,
        future:[]
    }))
  },[setState]);

  const undo = useCallback(()=>{
    setState(({past,present,future})=>{
        if(past.length === 0) return {past,present,future};

        const previousValue = past[past.length-1];
        return {
            past:past.slice(0,-1),
            present:previousValue,
            future:[present,...future]
        }
    })
  },[setState]);

  const redo = useCallback(()=>{
    setState(({past,present,future})=>{
        if(future.length === 0) return {past,present,future};

        const nextValue = future[0];
        return {
            past:[...past,present],
            present:nextValue,
            future:future.slice(1)
        }
    })
  },[setState]);

  //button enable/disbale;
  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  return{
    state:state.present,
    setValue,
    undo,
    redo,
    canUndo,
    canRedo
  }
}
