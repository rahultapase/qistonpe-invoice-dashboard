import { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Check, CheckCircle } from 'lucide-react';
import { Badge, Button } from '../UI';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrencyINR, getDaysDisplay } from '../../utils/invoiceUtils';
import { INVOICE_STATUS } from '../../constants/invoiceConstants';

/**
 * InvoiceRow Component
 * 
 * Single invoice row in the table.
 * Memoized to prevent unnecessary re-renders in large lists.
 * Features micro-interactions for hover and selection states.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.invoice - Invoice data object
 * @param {Function} props.onMarkAsPaid - Callback when "Mark as Paid" is clicked
 * @param {boolean} props.isSelected - Whether the row is selected
 * @param {Function} props.onToggleSelection - Callback to toggle selection
 */
function InvoiceRow({ invoice, onMarkAsPaid, isSelected = false, onToggleSelection }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get display info for the Days column
  const daysDisplay = getDaysDisplay(invoice);
  
  // Check if invoice can be marked as paid
  const canMarkAsPaid = invoice.status !== INVOICE_STATUS.PAID;
  
  /**
   * Handle mark as paid click
   * Uses useCallback for stable reference
   */
  const handleMarkAsPaid = useCallback(() => {
    if (canMarkAsPaid && onMarkAsPaid) {
      onMarkAsPaid(invoice.id);
    }
  }, [invoice.id, canMarkAsPaid, onMarkAsPaid]);

  /**
   * Handle row selection toggle
   */
  const handleToggleSelection = useCallback(() => {
    if (onToggleSelection) {
      onToggleSelection(invoice.id);
    }
  }, [invoice.id, onToggleSelection]);

  return (
    <tr 
      className={`
        border-b border-gray-100 dark:border-gray-700 
        transition-all duration-200 ease-out
        ${isSelected 
          ? 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30' 
          : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'
        }
        ${isHovered ? 'shadow-sm' : ''}
      `}
      data-invoice-id={invoice.id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Checkbox for Selection */}
      {onToggleSelection && (
        <td className="w-10 px-2 sm:px-3 py-3 sm:py-4">
          <button
            type="button"
            onClick={handleToggleSelection}
            className={`
              flex items-center justify-center w-5 h-5 rounded
              transition-all duration-200 active:scale-90
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
              ${isSelected 
                ? 'bg-blue-600 text-white' 
                : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 hover:border-blue-400 dark:hover:border-blue-500'
              }
            `}
            aria-label={isSelected ? `Deselect invoice ${invoice.id}` : `Select invoice ${invoice.id}`}
          >
            {isSelected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
          </button>
        </td>
      )}
      
      {/* Invoice Number */}
      <td className="px-3 sm:px-4 py-3 sm:py-4">
        <span className={`text-sm font-medium transition-colors duration-200 ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'}`}>
          {invoice.id}
        </span>
      </td>
      
      {/* Customer Name */}
      <td className="px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex flex-col">
          <span 
            className="text-sm text-gray-900 dark:text-gray-100 truncate max-w-[150px] sm:max-w-[200px]"
            title={invoice.customerName}
          >
            {invoice.customerName}
          </span>
          {/* Show dates on mobile (since columns are hidden) */}
          <span className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
            Due: {formatDate(invoice.dueDate)}
          </span>
        </div>
      </td>
      
      {/* Invoice Date - Hidden on mobile */}
      <td className="hidden md:table-cell px-4 py-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(invoice.invoiceDate)}
        </span>
      </td>
      
      {/* Due Date - Hidden on mobile */}
      <td className="hidden md:table-cell px-4 py-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(invoice.dueDate)}
        </span>
      </td>
      
      {/* Amount */}
      <td className="px-3 sm:px-4 py-3 sm:py-4 text-right">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {formatCurrencyINR(invoice.amount)}
        </span>
      </td>
      
      {/* Status Badge */}
      <td className="px-3 sm:px-4 py-3 sm:py-4 text-center">
        <Badge status={invoice.status} />
      </td>
      
      {/* Days Display - Hidden on mobile */}
      <td className="hidden lg:table-cell px-4 py-4">
        <span className={`text-sm font-medium ${daysDisplay.colorClass}`}>
          {daysDisplay.text}
        </span>
      </td>
      
      {/* Action Button */}
      <td className="px-3 sm:px-4 py-3 sm:py-4 text-center">
        {canMarkAsPaid ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAsPaid}
            leftIcon={<CheckCircle className="h-3.5 w-3.5" />}
            aria-label={`Mark invoice ${invoice.id} as paid`}
            className="active:scale-95 transition-transform"
          >
            <span className="hidden sm:inline">Mark Paid</span>
            <span className="sm:hidden">Paid</span>
          </Button>
        ) : (
          <span className="inline-flex items-center text-sm text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Paid</span>
          </span>
        )}
      </td>
    </tr>
  );
}

InvoiceRow.propTypes = {
  /** Invoice data object */
  invoice: PropTypes.shape({
    id: PropTypes.string.isRequired,
    customerName: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    invoiceDate: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    paymentDate: PropTypes.string,
    status: PropTypes.oneOf(['paid', 'pending', 'overdue']).isRequired
  }).isRequired,
  /** Callback when "Mark as Paid" button is clicked */
  onMarkAsPaid: PropTypes.func.isRequired,
  /** Whether the row is selected */
  isSelected: PropTypes.bool,
  /** Callback to toggle selection */
  onToggleSelection: PropTypes.func
};

InvoiceRow.defaultProps = {
  isSelected: false,
  onToggleSelection: null
};

// Memoize to prevent re-renders when other invoices change
// This is critical for performance with 500+ invoices
export default memo(InvoiceRow);
