import { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Check } from 'lucide-react';
import { Badge, Button } from '../UI';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrencyINR, getDaysDisplay } from '../../utils/invoiceUtils';
import { INVOICE_STATUS } from '../../constants/invoiceConstants';

/**
 * InvoiceRow Component
 * 
 * Single invoice row in the table.
 * Memoized to prevent unnecessary re-renders in large lists.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.invoice - Invoice data object
 * @param {Function} props.onMarkAsPaid - Callback when "Mark as Paid" is clicked
 */
function InvoiceRow({ invoice, onMarkAsPaid }) {
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

  return (
    <tr 
      className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
      data-invoice-id={invoice.id}
    >
      {/* Invoice Number */}
      <td className="px-3 sm:px-4 py-3 sm:py-4">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
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
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
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
            leftIcon={<Check className="h-3.5 w-3.5" />}
            aria-label={`Mark invoice ${invoice.id} as paid`}
          >
            <span className="hidden sm:inline">Mark Paid</span>
            <span className="sm:hidden">Paid</span>
          </Button>
        ) : (
          <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
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
  onMarkAsPaid: PropTypes.func.isRequired
};

// Memoize to prevent re-renders when other invoices change
// This is critical for performance with 500+ invoices
export default memo(InvoiceRow);
