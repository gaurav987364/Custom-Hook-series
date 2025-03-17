import { useInfiniteScroll } from "./hooks/useInfiniteScroll"


const App = () => {
  const {page,loading, showScrollToTop,ScrollToTop,reset} = useInfiniteScroll();
  return (
    <div className=" w-full h-[150vh] flex flex-col items-center justify-center">
      {loading && <div>Loading...</div>}
      <h1>{page}</h1>
      {showScrollToTop && (
        <button onClick={()=>ScrollToTop()}>
          Scroll to top
        </button>
      )}
      <button onClick={reset}>
        Reset
      </button>
    </div>
  )
}

export default App