import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../constants/invoiceConstants';

/**
 * useTheme Hook
 * 
 * Manages dark mode state with:
 * - LocalStorage persistence
 * - System preference detection
 * - Smooth transitions
 * - Cross-tab synchronization
 * 
 * @returns {Object} - Theme state and toggle function
 * 
 * @example
 * const { isDarkMode, toggleTheme, setTheme } = useTheme();
 */
function useTheme() {
  /**
   * Initialize theme from:
   * 1. localStorage (if previously set)
   * 2. System preference (prefers-color-scheme)
   * 3. Default to light mode
   */
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    if (stored !== null) {
      return stored === 'dark';
    }
    
    // Default to light mode for better first impression
    return false;
  });

  /**
   * Apply theme to document
   * Adds/removes 'dark' class on <html> element
   */
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Persist to localStorage
    localStorage.setItem(STORAGE_KEYS.THEME, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  /**
   * Listen for system preference changes
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set preference
      const stored = localStorage.getItem(STORAGE_KEYS.THEME);
      if (stored === null) {
        setIsDarkMode(e.matches);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    
    // Legacy browsers
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  /**
   * Listen for storage changes (cross-tab sync)
   */
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEYS.THEME) {
        setIsDarkMode(e.newValue === 'dark');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Toggle between light and dark mode
   */
  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  /**
   * Set specific theme
   * @param {'light' | 'dark'} theme - Theme to set
   */
  const setTheme = useCallback((theme) => {
    setIsDarkMode(theme === 'dark');
  }, []);

  /**
   * Reset to system preference
   */
  const resetToSystem = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.THEME);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  return {
    isDarkMode,
    toggleTheme,
    setTheme,
    resetToSystem,
    theme: isDarkMode ? 'dark' : 'light'
  };
}

export default useTheme;
