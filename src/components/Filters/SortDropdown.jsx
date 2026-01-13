import { memo, useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, Check, ArrowUpDown } from 'lucide-react';
import { SORT_OPTIONS } from '../../constants/invoiceConstants';

/**
 * SortDropdown Component
 * 
 * Custom styled dropdown to sort invoices by different fields and directions.
 * Options:
 * - Amount (High to Low / Low to High)
 * - Invoice Date (Newest / Oldest)
 * - Due Date (Nearest / Farthest)
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Current sort option value
 * @param {Function} props.onChange - Callback when sort changes
 */
function SortDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Find current selected option
  const selectedOption = SORT_OPTIONS.find(opt => opt.value === value) || SORT_OPTIONS[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleSelect = useCallback((optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  }, [onChange]);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="sr-only">Sort invoices</label>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between gap-2
          w-full sm:w-64
          px-3 py-2
          text-sm font-medium text-gray-700 dark:text-gray-200
          bg-white dark:bg-gray-700 
          border border-gray-300 dark:border-gray-600 rounded-lg
          hover:bg-gray-50 dark:hover:bg-gray-600
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-200
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Sort invoices by"
      >
        <div className="flex items-center gap-2 min-w-0">
          <ArrowUpDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span>{selectedOption.label}</span>
        </div>
        <ChevronDown 
          className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 z-20 mt-1 w-full sm:w-64 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1 animate-fade-in"
          role="listbox"
          aria-label="Sort options"
        >
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`
                w-full flex items-center justify-between gap-2
                px-3 py-2 text-sm text-left
                transition-colors duration-150
                ${option.value === value 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                }
              `}
              role="option"
              aria-selected={option.value === value}
            >
              <span>{option.label}</span>
              {option.value === value && (
                <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

SortDropdown.propTypes = {
  /** Current selected sort option value */
  value: PropTypes.string.isRequired,
  /** Callback function when sort option changes */
  onChange: PropTypes.func.isRequired
};

export default memo(SortDropdown);
