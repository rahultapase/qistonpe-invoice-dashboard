import { memo } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';
import { SORT_OPTIONS } from '../../constants/invoiceConstants';

/**
 * SortDropdown Component
 * 
 * Dropdown to sort invoices by different fields and directions.
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
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <label htmlFor="sort-select" className="sr-only">
        Sort invoices
      </label>
      
      <select
        id="sort-select"
        value={value}
        onChange={handleChange}
        className={`
          appearance-none
          w-full sm:w-48
          pl-3 pr-10 py-2
          text-sm text-gray-700 dark:text-gray-200
          bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg
          cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-colors duration-200
        `}
        aria-label="Sort invoices by"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow */}
      <div 
        className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
        aria-hidden="true"
      >
        <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      </div>
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
