import { useState, useCallback } from 'react';

/**
 * useToast Hook
 * 
 * Custom hook for managing toast notifications.
 * 
 * @returns {Object} Toast state and methods
 */
function useToast() {
  const [toasts, setToasts] = useState([]);
  let toastIdCounter = 0;

  /**
   * Add a new toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type: 'success', 'error', 'info'
   * @param {number} duration - Auto-dismiss duration in ms (default: 4000)
   */
  const addToast = useCallback((message, type = 'info', duration = 2500) => {
    const id = Date.now() + Math.random();

    setToasts(prev => [...prev, {
      id,
      message,
      type,
      duration
    }]);

    return id;
  }, []);

  /**
   * Remove a toast by ID
   */
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  /**
   * Show success toast
   */
  const success = useCallback((message, duration) => {
    return addToast(message, 'success', duration);
  }, [addToast]);

  /**
   * Show error toast
   */
  const error = useCallback((message, duration) => {
    return addToast(message, 'error', duration);
  }, [addToast]);

  /**
   * Show info toast
   */
  const info = useCallback((message, duration) => {
    return addToast(message, 'info', duration);
  }, [addToast]);

  /**
   * Clear all toasts
   */
  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    clearAll
  };
}

export default useToast;
