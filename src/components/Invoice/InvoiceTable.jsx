import { useState, useMemo, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import InvoiceTableHeader from './InvoiceTableHeader';
import InvoiceRow from './InvoiceRow';
import { SkeletonTable } from './SkeletonRow';
import { EmptyState } from '../UI';
import { PAGINATION } from '../../constants/invoiceConstants';

/**
 * InvoiceTable Component
 * 
 * Complete invoice table with:
 * - Table header
 * - Invoice rows with selection support
 * - Pagination controls
 * - Loading state
 * - Empty state
 * 
 * @param {Object} props - Component props
 * @param {Array} props.invoices - Array of invoice objects to display
 * @param {Function} props.onMarkAsPaid - Callback when invoice is marked as paid
 * @param {boolean} props.isLoading - Whether data is loading
 * @param {boolean} props.isEmptyDueToFilters - Whether empty state is due to filters
 * @param {Function} props.onClearFilters - Callback to clear filters
 * @param {Function} props.onAddInvoice - Callback to add new invoice
 * @param {Set} props.selectedIds - Set of selected invoice IDs
 * @param {Function} props.onToggleSelection - Callback to toggle selection
 * @param {Function} props.isSelected - Function to check if invoice is selected
 */
function InvoiceTable({
  invoices,
  onMarkAsPaid,
  isLoading,
  isEmptyDueToFilters,
  onClearFilters,
  onAddInvoice,
  selectedIds,
  onToggleSelection,
  isSelected
}) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE);

  // Check if selection is enabled
  const hasSelection = Boolean(onToggleSelection);

  /**
   * Calculate pagination values
   * Memoized to prevent recalculation on every render
   */
  const pagination = useMemo(() => {
    const totalItems = invoices.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    
    return {
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      currentPage,
      pageSize,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1
    };
  }, [invoices.length, currentPage, pageSize]);

  /**
   * Get paginated data slice
   * Memoized for performance with large datasets
   */
  const paginatedInvoices = useMemo(() => {
    return invoices.slice(pagination.startIndex, pagination.endIndex);
  }, [invoices, pagination.startIndex, pagination.endIndex]);

  /**
   * Reset to page 1 when invoices change (e.g., filter applied)
   */
  useMemo(() => {
    if (currentPage > pagination.totalPages && pagination.totalPages > 0) {
      setCurrentPage(1);
    }
  }, [invoices.length, pagination.totalPages, currentPage]);

  /**
   * Handle page change
   */
  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
      // Scroll to top of table
      document.querySelector('[data-invoice-table]')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [pagination.totalPages]);

  /**
   * Handle page size change
   */
  const handlePageSizeChange = useCallback((e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page
  }, []);

  /**
   * Handle previous page
   */
  const handlePrevPage = useCallback(() => {
    handlePageChange(currentPage - 1);
  }, [currentPage, handlePageChange]);

  /**
   * Handle next page
   */
  const handleNextPage = useCallback(() => {
    handlePageChange(currentPage + 1);
  }, [currentPage, handlePageChange]);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <InvoiceTableHeader hasSelection={hasSelection} />
            <SkeletonTable rows={pageSize} hasSelection={hasSelection} />
          </table>
        </div>
      </div>
    );
  }

  // Empty state
  if (invoices.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        {isEmptyDueToFilters ? (
          <EmptyState
            type="no-results"
            title="No invoices found"
            message="No invoices match your current filters. Try adjusting your search or filter criteria."
            actionLabel="Clear Filters"
            onAction={onClearFilters}
          />
        ) : (
          <EmptyState
            type="no-data"
            title="No invoices yet"
            message="Get started by adding your first invoice to track payments and manage cash flow."
          />
        )}
      </div>
    );
  }

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
      data-invoice-table
    >
      {/* Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <InvoiceTableHeader hasSelection={hasSelection} />
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {paginatedInvoices.map((invoice) => (
              <InvoiceRow
                key={invoice.id}
                invoice={invoice}
                onMarkAsPaid={onMarkAsPaid}
                isSelected={isSelected ? isSelected(invoice.id) : false}
                onToggleSelection={onToggleSelection}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Showing X-Y of Z */}
          <div className="text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
            Showing{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">{pagination.startIndex + 1}</span>
            {' '}–{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">{pagination.endIndex}</span>
            {' '}of{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">{pagination.totalItems}</span>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center gap-3 order-1 sm:order-2">
            {/* Page Size Selector */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-2.5 py-1.5">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Rows</span>
              <select
                id="page-size"
                value={pageSize}
                onChange={handlePageSizeChange}
                className="text-sm font-medium text-gray-700 dark:text-gray-200 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer pr-5 appearance-none"
                aria-label="Rows per page"
                style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, 
                  backgroundRepeat: 'no-repeat', 
                  backgroundPosition: 'right 0 center' 
                }}
              >
                {PAGINATION.PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Page Navigation */}
            <div className="flex items-center gap-1">
              {/* Previous Button */}
              <button
                onClick={handlePrevPage}
                disabled={!pagination.hasPrevPage}
                className={`
                  inline-flex items-center justify-center
                  w-8 h-8 rounded-lg border
                  transition-all duration-200
                  ${pagination.hasPrevPage
                    ? 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 active:scale-95'
                    : 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  }
                `}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {/* Page Indicator */}
              <div className="flex items-center gap-1 px-3 min-w-[60px] justify-center">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{currentPage}</span>
                <span className="text-sm text-gray-400 dark:text-gray-500">/</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{pagination.totalPages}</span>
              </div>
              
              {/* Next Button */}
              <button
                onClick={handleNextPage}
                disabled={!pagination.hasNextPage}
                className={`
                  inline-flex items-center justify-center
                  w-8 h-8 rounded-lg border
                  transition-all duration-200
                  ${pagination.hasNextPage
                    ? 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 active:scale-95'
                    : 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  }
                `}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

InvoiceTable.propTypes = {
  /** Array of invoice objects to display */
  invoices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      customerName: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      invoiceDate: PropTypes.string.isRequired,
      dueDate: PropTypes.string.isRequired,
      paymentDate: PropTypes.string,
      status: PropTypes.oneOf(['paid', 'pending', 'overdue']).isRequired
    })
  ).isRequired,
  /** Callback when an invoice is marked as paid */
  onMarkAsPaid: PropTypes.func.isRequired,
  /** Whether the table is in loading state */
  isLoading: PropTypes.bool,
  /** Whether the empty state is due to active filters */
  isEmptyDueToFilters: PropTypes.bool,
  /** Callback to clear active filters */
  onClearFilters: PropTypes.func,
  /** Callback to add a new invoice */
  onAddInvoice: PropTypes.func,
  /** Set of selected invoice IDs */
  selectedIds: PropTypes.instanceOf(Set),
  /** Callback to toggle selection */
  onToggleSelection: PropTypes.func,
  /** Function to check if invoice is selected */
  isSelected: PropTypes.func
};

InvoiceTable.defaultProps = {
  isLoading: false,
  isEmptyDueToFilters: false,
  onClearFilters: () => {},
  onAddInvoice: () => {},
  selectedIds: new Set(),
  onToggleSelection: null,
  isSelected: null
};

export default memo(InvoiceTable);
