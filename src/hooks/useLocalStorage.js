import { useState, useEffect, useCallback } from 'react';

/**
 * useLocalStorage Hook
 * 
 * A custom hook that syncs state with localStorage, providing:
 * - Automatic persistence across page refreshes
 * - Error handling for quota exceeded and unavailable localStorage
 * - JSON parse error handling with fallback
 * - SSR-safe implementation
 * 
 * @param {string} key - The localStorage key to use
 * @param {*} initialValue - Default value if key doesn't exist
 * @returns {[*, Function, Object]} - [storedValue, setValue, { error, isLoading }]
 * 
 * @example
 * const [invoices, setInvoices, { error }] = useLocalStorage('invoices', []);
 */
function useLocalStorage(key, initialValue) {
  // Track loading state for initial read
  const [isLoading, setIsLoading] = useState(true);
  
  // Track any errors that occur
  const [error, setError] = useState(null);

  /**
   * Get initial value from localStorage or use fallback
   * Wrapped in a function for lazy initialization
   */
  const getStoredValue = useCallback(() => {
    // Check if localStorage is available (SSR safety)
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      
      // Return initialValue if no stored value exists
      if (item === null || item === undefined) {
        return initialValue;
      }

      // Parse stored JSON
      const parsed = JSON.parse(item);
      return parsed;
    } catch (err) {
      // Handle JSON parse errors
      console.warn(`Error reading localStorage key "${key}":`, err);
      setError({
        type: 'READ_ERROR',
        message: `Failed to read data from storage: ${err.message}`
      });
      return initialValue;
    }
  }, [key, initialValue]);

  // State to hold the current value
  const [storedValue, setStoredValue] = useState(getStoredValue);

  /**
   * Update loading state after initial render
   */
  useEffect(() => {
    setIsLoading(false);
  }, []);

  /**
   * Sync with localStorage when key changes
   * This handles the case where the key prop changes
   */
  useEffect(() => {
    const newValue = getStoredValue();
    setStoredValue(newValue);
  }, [key, getStoredValue]);

  /**
   * Listen for storage events from other tabs/windows
   * This keeps the state in sync across browser tabs
   */
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key && event.newValue !== null) {
        try {
          const newValue = JSON.parse(event.newValue);
          setStoredValue(newValue);
          setError(null);
        } catch (err) {
          console.warn('Error parsing storage event:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  /**
   * Set value both in state and localStorage
   * Supports functional updates like useState
   * 
   * @param {*|Function} value - New value or updater function
   */
  const setValue = useCallback((value) => {
    try {
      // Clear any previous errors
      setError(null);

      // Handle functional updates
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;

      // Update React state
      setStoredValue(valueToStore);

      // Check if localStorage is available
      if (typeof window === 'undefined') {
        setError({
          type: 'UNAVAILABLE',
          message: 'localStorage is not available'
        });
        return;
      }

      // Attempt to save to localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      // Handle quota exceeded error
      if (err.name === 'QuotaExceededError' || 
          err.code === 22 || 
          err.code === 1014) {
        setError({
          type: 'QUOTA_EXCEEDED',
          message: 'Storage quota exceeded. Please clear some data.'
        });
        console.error('localStorage quota exceeded:', err);
      } else {
        // Handle other errors
        setError({
          type: 'WRITE_ERROR',
          message: `Failed to save data: ${err.message}`
        });
        console.error(`Error setting localStorage key "${key}":`, err);
      }
    }
  }, [key, storedValue]);

  /**
   * Remove item from localStorage
   */
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      setError(null);
    } catch (err) {
      console.error(`Error removing localStorage key "${key}":`, err);
      setError({
        type: 'REMOVE_ERROR',
        message: `Failed to remove data: ${err.message}`
      });
    }
  }, [key, initialValue]);

  return [
    storedValue, 
    setValue, 
    { 
      error, 
      isLoading, 
      removeValue,
      // Expose method to manually refresh from localStorage
      refresh: () => setStoredValue(getStoredValue())
    }
  ];
}

export default useLocalStorage;
