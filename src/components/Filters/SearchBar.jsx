import { useState, useEffect, useRef, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { Search, X } from 'lucide-react';

/**
 * SearchBar Component
 * 
 * Search input with debouncing for invoice search.
 * Searches by invoice number or customer name.
 * 
 * Features:
 * - 300ms debounce to reduce re-renders
 * - Clear button when value exists
 * - Accessible with proper labels
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Current search value (controlled)
 * @param {Function} props.onChange - Callback when search value changes (debounced)
 * @param {string} props.placeholder - Placeholder text
 * @param {number} props.debounceMs - Debounce delay in milliseconds
 */
function SearchBar({ 
  value, 
  onChange, 
  placeholder = 'Search by invoice number or customer name',
  debounceMs = 300 
}) {
  // Local state for immediate input updates
  const [localValue, setLocalValue] = useState(value);
  
  // Ref for debounce timeout
  const debounceRef = useRef(null);
  
  // Ref for input element (for focus management)
  const inputRef = useRef(null);

  /**
   * Sync local value with external value
   * (handles case where value is cleared externally)
   */
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  /**
   * Cleanup debounce timeout on unmount
   */
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  /**
   * Handle input change with debouncing
   */
  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    
    // Update local state immediately for responsive UI
    setLocalValue(newValue);
    
    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Set new timeout for debounced callback
    debounceRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  }, [onChange, debounceMs]);

  /**
   * Clear search and focus input
   */
  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange('');
    
    // Clear any pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Focus the input after clearing
    inputRef.current?.focus();
  }, [onChange]);

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = useCallback((e) => {
    // Clear on Escape
    if (e.key === 'Escape' && localValue) {
      handleClear();
    }
  }, [localValue, handleClear]);

  const hasValue = localValue.length > 0;

  return (
    <div className="relative w-full sm:w-80">
      {/* Search Icon */}
      <div 
        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        aria-hidden="true"
      >
        <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      </div>
      
      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`
          block w-full 
          pl-10 pr-10 py-2
          text-sm text-gray-900 dark:text-gray-100
          bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-colors duration-200
        `}
        aria-label="Search invoices"
        role="searchbox"
        autoComplete="off"
        spellCheck="false"
      />
      
      {/* Clear Button */}
      {hasValue && (
        <button
          type="button"
          onClick={handleClear}
          className={`
            absolute inset-y-0 right-0 pr-3 
            flex items-center
            text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300
            focus:outline-none focus:text-gray-600 dark:focus:text-gray-300
            transition-colors duration-200
          `}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  /** Current search value (controlled) */
  value: PropTypes.string.isRequired,
  /** Callback when search value changes (will be debounced) */
  onChange: PropTypes.func.isRequired,
  /** Placeholder text for the input */
  placeholder: PropTypes.string,
  /** Debounce delay in milliseconds */
  debounceMs: PropTypes.number
};

SearchBar.defaultProps = {
  placeholder: 'Search by invoice number or customer name',
  debounceMs: 300
};

export default memo(SearchBar);
