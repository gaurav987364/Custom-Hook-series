import { useCallback, useState } from 'react';

interface HistoryType<T> {
  past:T[];
  present:T;
  future:T[];
};


const useUndoRedo = <T extends HistoryType<T>>(initialPresentState:T) => {
  const [state, setState] = useState<HistoryType<T>>({
    past:[],
    present:initialPresentState,
    future:[]
  });

  //set value to state; and add to past stack as well;
  const setValue = useCallback((newPresentState:T)=>{
      setState(({past,present})=>({
        past:[...past,present],   //set only past & current value
        present:newPresentState,  //updated new value
        future:[]
      }));
    },
    [setState]
  );

  const undo = useCallback(()=>{
    setState(({past,present,future})=>{
      //if past is empty no undo will work;
      if(past.length === 0) return {past, present, future};

      const previousValue = past[past.length-1]; //last value
      return {
        past:past.slice(0,-1), //array ki last value hatao
        present:previousValue, //jo setValue me last value thi vo
        future:[present, ...future] //set for for redo
      }
    });
  },
   [setState]
  );

  // doing undo ko undo again, so current pe aa sake
  const redo = useCallback(()=>{
    setState(({past,present,future})=>{
      //if there is no future value available
      if(future.length === 0) return {past,present,future};

      const nextValue = future[0]; //bcoz we set present at 1st;
      return {
        past:[...past,present], //current present ko past me push;
        present:nextValue, //jo undo me set ki thi;
        future:future.slice(1), // delete current first item,
      }
    });
  },
   [setState]
  );

  //canUndo & canRedo flags for button disbale/enable;
  //shows or enables button if there are past/future value present;
  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  return {
    state:state.present, //current value
    setValue,
    undo,
    redo,
    canRedo,
    canUndo
  }
};

export default useUndoRedo;



//Thoery;
//? 1. State History Stack (Frontend-side)
// Idea: Jab bhi user koi action leta hai (jaise text type karna, drawing karna, item delete karna), uski current state ko ek stack (LIFO) mein push kar dete hain.

// Implementation:

// React/Angular/Vue mein aap ek array (history) maintain kar sakte ho.

// Har action se pehle history.push(currentState) karo.

// “Undo” pe us array se last state (history.pop()) nikaal ke setState(previousState) karo.

// Tools:

// Redux ke saath redux-undo library use hoti hai, jisme automatically past, present, future states manage ho jaati hain.



//? 2. State Management Libraries
// Redux:

// past[], present, future[]

// Action dispatch pe present ko past mein daale, new state as present set kare

// Undo → last past ko restore kare, aage wale state ko future mein daale

// MobX / Vuex: Similar concepts, but manual implementation ya plugins se hota hai.

// SETUP
// npm install redux redux-undo react-redux

//Wrap your reducer
// import undoable from 'redux-undo';
// Simple counter reducer
// function counter(state = 0, action) {
//   switch (action.type) {
//     case 'INCREMENT': return state + 1;
//     case 'DECREMENT': return state - 1;
//     default: return state;
//   }
// }
// Make it undoable:
// const undoableCounter = undoable(counter);
// export default undoableCounter;

//store setup
// import { createStore } from 'redux';
// import { Provider, useDispatch, useSelector } from 'react-redux';
// import undoableCounter from './reducers';

// const store = createStore(undoableCounter);

// function App() {
//   return (
//     <Provider store={store}>
//       <Counter />
//     </Provider>
//   );
// }

//Component mein use karo
// import { ActionCreators } from 'redux-undo';

// function Counter() {
//   const dispatch = useDispatch();
//   // state.present holds current value
//   const count = useSelector(state => state.present);
//   const canUndo = useSelector(state => state.past.length > 0);
//   const canRedo = useSelector(state => state.future.length > 0);

//   return (
//     <div>
//       <h1>Count: {count}</h1>
//       <button onClick={() => dispatch({ type: 'INCREMENT' })}>
//         Increment
//       </button>
//       <button onClick={() => dispatch({ type: 'DECREMENT' })}>
//         Decrement
//       </button>
//       <button onClick={() => dispatch(ActionCreators.undo())} disabled={!canUndo}>
//         Undo
//       </button>
//       <button onClick={() => dispatch(ActionCreators.redo())} disabled={!canRedo}>
//         Redo
//       </button>
//     </div>
//   );
// }

// Why Redux-Undo?
// past, present, future automatically manage ho jaate.

// Customizable: limit history length, filter which actions to track, etc.

// Global state pe undo/redo across multiple slices (combineReducers ke saath).





//? 3. Real-time & Collaboration (Advanced)
// Operational Transformation (OT) ya CRDTs use hota hai (Google Docs jaise).

// Yahan undo sirf local history nahi, balke remote edits ke saath sync karna padta hai.

// Kaafi complex algorithms involved.