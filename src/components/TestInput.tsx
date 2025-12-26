import { useState } from 'react'
import useDebounce from '../hooks/useDebounce';

const TestInput = () => {
  const [query, setQuery] = useState('');
  // Debounce the search function to limit API calls to 300ms after each keystroke
  
  const handleSearch = useDebounce({
    fn: (searchTerm: string) => {
      console.log('Searching for :-> ', searchTerm);
      // API Call Here.
    },
    delay: 300,
    leading: false
  });

  return (
    <>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          handleSearch(e.target.value);
        }}
        className=' px-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none'
        placeholder='Search...'
      />
      {/* Display search results */}
    </>
  );
};

export default TestInput;