import React from 'react'

export const useLocalStorage = (key:string, initialValue:string) => {
    const [value, setValue] = React.useState(() => {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : initialValue;
    });

    const clearStorage = () => {
        localStorage.clear();
        setValue(initialValue);
    }

    React.useEffect(() => {
       if(value !== null && value !== undefined) {
          localStorage.setItem(key, JSON.stringify(value));
       }
    }, [value,key]);
    return {value, setValue, clearStorage};
}
