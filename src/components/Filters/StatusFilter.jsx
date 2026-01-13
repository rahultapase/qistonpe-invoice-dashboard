import { memo } from 'react';
import PropTypes from 'prop-types';
import { STATUS_FILTER_OPTIONS } from '../../constants/invoiceConstants';

/**
 * StatusFilter Component
 * 
 * Filter buttons for invoice status (All, Paid, Pending, Overdue).
 * Uses button group pattern with active state styling.
 * 
 * @param {Object} props - Component props
 * @param {string} props.activeStatus - Currently selected status filter
 * @param {Function} props.onStatusChange - Callback when status changes
 * @param {Object} props.counts - Optional counts for each status
 */
function StatusFilter({ activeStatus, onStatusChange, counts = null }) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter invoices by status"
    >
      {STATUS_FILTER_OPTIONS.map((option) => {
        const isActive = activeStatus === option.value;
        const count = counts?.[option.value];

        return (
          <button
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            className={`
              inline-flex items-center gap-1.5
              px-3 py-1.5 sm:px-4 sm:py-2
              text-sm font-medium rounded-lg
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800
              ${isActive
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }
            `}
            aria-pressed={isActive}
            aria-label={`Filter by ${option.label}${count !== undefined ? `, ${count} invoices` : ''}`}
          >
            {option.label}

            {/* Count badge */}
            {count !== undefined && (
              <span
                className={`
                  inline-flex items-center justify-center
                  min-w-[1.25rem] h-5 px-1.5
                  text-xs font-medium rounded-full
                  ${isActive
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }
                `}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

StatusFilter.propTypes = {
  /** Currently active status filter value */
  activeStatus: PropTypes.oneOf(['all', 'paid', 'pending', 'overdue']).isRequired,
  /** Callback function when status filter changes */
  onStatusChange: PropTypes.func.isRequired,
  /** Optional object with counts for each status */
  counts: PropTypes.shape({
    all: PropTypes.number,
    paid: PropTypes.number,
    pending: PropTypes.number,
    overdue: PropTypes.number
  })
};

export default memo(StatusFilter);
