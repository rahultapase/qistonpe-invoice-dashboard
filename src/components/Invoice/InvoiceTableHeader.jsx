import { memo } from 'react';
import PropTypes from 'prop-types';
import { Check, Minus } from 'lucide-react';

/**
 * InvoiceTableHeader Component
 * 
 * Table header row with column names.
 * Includes "Select All" checkbox (styled as button).
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.hasSelection - Whether selection column should be shown
 * @param {boolean} props.isAllSelected - Whether all visible items are selected
 * @param {boolean} props.isIndeterminate - Whether some but not all items are selected
 * @param {Function} props.onToggleAll - Callback to toggle select all
 */
function InvoiceTableHeader({
  hasSelection = false,
  isAllSelected = false,
  isIndeterminate = false,
  onToggleAll = () => { }
}) {
  // Common header style
  const thClass = "px-3 sm:px-4 py-3 text-left text-[13px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest whitespace-nowrap";
  const thCenterClass = "px-3 sm:px-4 py-3 text-center text-[13px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest whitespace-nowrap";
  const thRightClass = "px-3 sm:px-4 py-3 text-right text-[13px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest whitespace-nowrap";

  return (
    <thead className="bg-gray-50 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
      <tr>
        {/* Checkbox Column */}
        {hasSelection && (
          <th
            scope="col"
            className="w-10 px-2 sm:px-3 py-3 text-center"
          >
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={onToggleAll}
                className={`
                  flex items-center justify-center w-5 h-5 rounded
                  transition-all duration-200 active:scale-90
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                  ${(isAllSelected || isIndeterminate)
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 hover:border-blue-400 dark:hover:border-blue-500'
                  }
                `}
                aria-label={isAllSelected ? "Deselect all" : "Select all"}
              >
                {isAllSelected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                {isIndeterminate && !isAllSelected && <Minus className="h-3.5 w-3.5" strokeWidth={3} />}
              </button>
            </div>
          </th>
        )}

        {/* Invoice Number */}
        <th scope="col" className={thClass}>
          Invoice #
        </th>

        {/* Customer Name */}
        <th scope="col" className={thClass}>
          Customer
        </th>

        {/* Invoice Date - Hidden on mobile */}
        <th scope="col" className={`hidden md:table-cell ${thClass}`}>
          Invoice Date
        </th>

        {/* Due Date - Hidden on mobile */}
        <th scope="col" className={`hidden md:table-cell ${thClass}`}>
          Due Date
        </th>

        {/* Amount */}
        <th scope="col" className={thRightClass}>
          Amount
        </th>

        {/* Status */}
        <th scope="col" className={thCenterClass}>
          Status
        </th>

        {/* Days - Hidden on mobile */}
        <th scope="col" className={`hidden lg:table-cell ${thClass}`}>
          Days
        </th>

        {/* Action */}
        <th scope="col" className={thCenterClass}>
          Action
        </th>
      </tr>
    </thead>
  );
}

InvoiceTableHeader.propTypes = {
  hasSelection: PropTypes.bool,
  isAllSelected: PropTypes.bool,
  isIndeterminate: PropTypes.bool,
  onToggleAll: PropTypes.func
};

export default memo(InvoiceTableHeader);
