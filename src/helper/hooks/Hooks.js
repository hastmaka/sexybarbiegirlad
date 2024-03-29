import {useEffect, useState} from 'react';

export const useOnClickOutside = (ref, handler) => {
    useEffect(() => {
            const listener = event => {
                if (!ref.current || ref.current.contains(event.target)) {
                    return;
                }
                handler(event);
            };
            document.addEventListener('mousedown', listener);

            return () => {
                document.removeEventListener('mousedown', listener);
            };
        },
        [ref, handler],
    );
};

export const useIsScroll = () => {
    useEffect(() => {
        const handleScroll = _ => {
            if(Math.floor(window.scrollY) === 1) {
                // window.dispatch(generalSliceActions.setScroll(1))
            }
            if(window.scrollY === 0) {
                // window.dispatch(generalSliceActions.setScroll(0))
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])
};

export const useLocalStorage = (key, initialValue) => {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === "undefined") {
            return initialValue;
        }
        try {
            // Get from local storage by key
            const item = localStorage.getItem(key);
            if(!item) {
                //set ls initial value
                localStorage.setItem(key, JSON.stringify(initialValue))
            }
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            console.log(error);
            return initialValue;
        }
    });
    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value) => {
        try {
            // Allow value to be a function, so we have same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            if (typeof window !== "undefined") {
                localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.log(error);
        }
    };
    return [storedValue, setValue];
};




