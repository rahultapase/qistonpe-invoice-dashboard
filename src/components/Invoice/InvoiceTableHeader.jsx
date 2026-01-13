import { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * InvoiceTableHeader Component
 * 
 * Table header row with column names.
 * Some columns are hidden on mobile for better responsiveness.
 * 
 * Columns:
 * - Invoice # (always visible)
 * - Customer (always visible)
 * - Invoice Date (hidden on mobile)
 * - Due Date (hidden on mobile)
 * - Amount (always visible)
 * - Status (always visible)
 * - Days (hidden on mobile)
 * - Action (always visible)
 */
function InvoiceTableHeader() {
  return (
    <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <tr>
        {/* Invoice Number */}
        <th 
          scope="col" 
          className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
        >
          Invoice #
        </th>
        
        {/* Customer Name */}
        <th 
          scope="col" 
          className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
        >
          Customer
        </th>
        
        {/* Invoice Date - Hidden on mobile */}
        <th 
          scope="col" 
          className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
        >
          Invoice Date
        </th>
        
        {/* Due Date - Hidden on mobile */}
        <th 
          scope="col" 
          className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
        >
          Due Date
        </th>
        
        {/* Amount */}
        <th 
          scope="col" 
          className="px-3 sm:px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
        >
          Amount
        </th>
        
        {/* Status */}
        <th 
          scope="col" 
          className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
        >
          Status
        </th>
        
        {/* Days - Hidden on mobile */}
        <th 
          scope="col" 
          className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
        >
          Days
        </th>
        
        {/* Action */}
        <th 
          scope="col" 
          className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
        >
          Action
        </th>
      </tr>
    </thead>
  );
}

InvoiceTableHeader.propTypes = {};

export default memo(InvoiceTableHeader);
