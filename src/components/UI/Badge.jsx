import { memo } from 'react';
import PropTypes from 'prop-types';
import { INVOICE_STATUS } from '../../constants/invoiceConstants';

/**
 * Status badge style configurations
 */
const badgeStyles = {
  [INVOICE_STATUS.PAID]: {
    className: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700',
    label: 'Paid'
  },
  [INVOICE_STATUS.PENDING]: {
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700',
    label: 'Pending'
  },
  [INVOICE_STATUS.OVERDUE]: {
    className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700',
    label: 'Overdue'
  }
};

/**
 * Badge Component
 * 
 * Displays a status badge with appropriate colors.
 * Memoized to prevent unnecessary re-renders.
 * 
 * @param {Object} props - Component props
 * @param {string} props.status - Invoice status: 'paid', 'pending', 'overdue'
 * @param {string} props.size - Badge size: 'sm', 'md', 'lg'
 * @param {string} props.className - Additional CSS classes
 */
function Badge({ status, size = 'md', className = '' }) {
  // Get style config for this status
  const style = badgeStyles[status] || badgeStyles[INVOICE_STATUS.PENDING];
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  return (
    <span 
      className={`
        inline-flex items-center justify-center
        font-medium rounded-full border
        ${style.className}
        ${sizeClasses[size]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      role="status"
      aria-label={`Status: ${style.label}`}
    >
      {style.label}
    </span>
  );
}

Badge.propTypes = {
  /** Invoice status determining the badge color */
  status: PropTypes.oneOf(['paid', 'pending', 'overdue']).isRequired,
  /** Size variant of the badge */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Additional CSS classes */
  className: PropTypes.string
};

Badge.defaultProps = {
  size: 'md',
  className: ''
};

// Memoize to prevent re-renders when parent state changes
export default memo(Badge);
