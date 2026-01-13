import { useState, useMemo, useCallback, memo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight, Check, ChevronDown } from 'lucide-react';
import InvoiceTableHeader from './InvoiceTableHeader';
import InvoiceRow from './InvoiceRow';
import { SkeletonTable } from './SkeletonRow';
import { EmptyState } from '../UI';
import { PAGINATION } from '../../constants/invoiceConstants';

/**
 * Custom Pagination Dropdown
 * Compact dropdown that opens upwards for footer placement
 */
function CustomPaginationDropdown({ value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleSelect = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          appearance-none
          flex items-center gap-2
          text-sm font-medium
          text-gray-900 dark:text-gray-100
          bg-white dark:bg-gray-800
          border border-gray-300 dark:border-gray-600
          rounded-lg
          px-3 py-1.5
          cursor-pointer
          transition-all duration-200
          hover:border-gray-400 dark:hover:border-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
          shadow-sm
        "
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{value}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu - Opens Upwards */}
      {isOpen && (
        <div className="absolute bottom-full mb-1 left-0 z-50 min-w-[80px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-100">
          <ul role="listbox">
            {options.map((option) => (
              <li
                key={option}
                role="option"
                aria-selected={value === option}
                onClick={() => handleSelect(option)}
                className={`
                  px-3 py-2 cursor-pointer select-none
                  text-sm
                  flex items-center justify-between gap-2
                  transition-colors duration-150
                  ${value === option
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }
                `}
              >
                <span>{option}</span>
                {value === option && (
                  <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

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
  isLoading = false,
  isEmptyDueToFilters = false,
  onClearFilters = () => { },
  onAddInvoice = () => { },
  selectedIds = new Set(),
  onToggleSelection = null,
  isSelected = null,
  onSelectAll = null,
  onDeselectAll = null
}) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE);

  // Check if selection is enabled
  const hasSelection = Boolean(onToggleSelection);

  // Calculate selection state
  const totalItems = invoices.length;
  const isAllSelected = totalItems > 0 && selectedIds.size === totalItems;
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < totalItems;

  const handleToggleAll = useCallback(() => {
    if (isAllSelected) {
      onDeselectAll?.();
    } else {
      onSelectAll?.();
    }
  }, [isAllSelected, onDeselectAll, onSelectAll]);

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
    }
  }, [pagination.totalPages]);

  /**
   * Handle page size change
   */
  const handlePageSizeChange = useCallback((e) => {
    // Determine the value source (native event or custom object)
    const newSize = Number(e.target ? e.target.value : e);
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
          <InvoiceTableHeader
            hasSelection={hasSelection}
            isAllSelected={isAllSelected}
            isIndeterminate={isIndeterminate}
            onToggleAll={handleToggleAll}
          />
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
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {pagination.startIndex + 1}
            </span>{" "}
            –{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {pagination.endIndex}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {pagination.totalItems}
            </span>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-3 order-1 sm:order-2">
            {/* Page Size Selector - IMPROVED VERSION */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="page-size"
                className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap"
              >
                Show
              </label>
              <CustomPaginationDropdown
                value={pageSize}
                options={PAGINATION.PAGE_SIZE_OPTIONS}
                onChange={handlePageSizeChange}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                per page
              </span>
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
                    ? "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 active:scale-95"
                    : "border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  }
                `}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Page Indicator */}
              <div className="flex items-center gap-1 px-3 min-w-[60px] justify-center">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {currentPage}
                </span>
                <span className="text-sm text-gray-400 dark:text-gray-500">
                  /
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {pagination.totalPages}
                </span>
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
                    ? "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 active:scale-95"
                    : "border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed"
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
      status: PropTypes.oneOf(['paid', 'pending', 'overdue'])
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
  isSelected: PropTypes.func,
  /** Callback to select all invoices */
  onSelectAll: PropTypes.func,
  /** Callback to deselect all invoices */
  onDeselectAll: PropTypes.func
};

export default memo(InvoiceTable);
