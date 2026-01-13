import { memo } from 'react';
import PropTypes from 'prop-types';
import { FilterBar } from '../Filters';
import InvoiceTable from './InvoiceTable';

/**
 * InvoiceList Component
 * 
 * Main component that combines FilterBar and InvoiceTable.
 * Handles the complete invoice list view with filtering and pagination.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.invoices - Filtered and sorted invoices to display
 * @param {boolean} props.isLoading - Whether data is loading
 * @param {string} props.statusFilter - Current status filter value
 * @param {Function} props.onStatusFilterChange - Callback for status filter change
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.onSearchChange - Callback for search change
 * @param {string} props.sortOption - Current sort option
 * @param {Function} props.onSortChange - Callback for sort change
 * @param {Object} props.statusCounts - Status counts for filter badges
 * @param {Function} props.onMarkAsPaid - Callback when invoice marked as paid
 * @param {Set} props.selectedIds - Set of selected invoice IDs (optional)
 * @param {Function} props.onToggleSelection - Callback to toggle selection (optional)
 * @param {Function} props.isSelected - Function to check if an invoice is selected (optional)
 */
function InvoiceList({
  invoices,
  isLoading,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  statusCounts,
  onMarkAsPaid,
  selectedIds,
  onToggleSelection,
  isSelected
}) {
  // Determine if filters are active
  const hasActiveFilters = statusFilter !== 'all' || searchQuery.trim() !== '';
  
  // Handle clearing filters
  const handleClearFilters = () => {
    onStatusFilterChange('all');
    onSearchChange('');
  };

  return (
    <section aria-label="Invoice List">
      {/* Filter Bar */}
      <FilterBar
        statusFilter={statusFilter}
        onStatusChange={onStatusFilterChange}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        sortOption={sortOption}
        onSortChange={onSortChange}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        statusCounts={statusCounts}
      />
      
      {/* Invoice Table */}
      <InvoiceTable
        invoices={invoices}
        onMarkAsPaid={onMarkAsPaid}
        isLoading={isLoading}
        isEmptyDueToFilters={hasActiveFilters && invoices.length === 0}
        onClearFilters={handleClearFilters}
        selectedIds={selectedIds}
        onToggleSelection={onToggleSelection}
        isSelected={isSelected}
      />
    </section>
  );
}

InvoiceList.propTypes = {
  /** Array of filtered and sorted invoices */
  invoices: PropTypes.array.isRequired,
  /** Whether data is currently loading */
  isLoading: PropTypes.bool,
  /** Current status filter value */
  statusFilter: PropTypes.string.isRequired,
  /** Callback when status filter changes */
  onStatusFilterChange: PropTypes.func.isRequired,
  /** Current search query string */
  searchQuery: PropTypes.string.isRequired,
  /** Callback when search query changes */
  onSearchChange: PropTypes.func.isRequired,
  /** Current sort option value */
  sortOption: PropTypes.string.isRequired,
  /** Callback when sort option changes */
  onSortChange: PropTypes.func.isRequired,
  /** Object with counts for each status */
  statusCounts: PropTypes.object,
  /** Callback when invoice is marked as paid */
  onMarkAsPaid: PropTypes.func.isRequired,
  /** Set of selected invoice IDs */
  selectedIds: PropTypes.instanceOf(Set),
  /** Callback to toggle selection */
  onToggleSelection: PropTypes.func,
  /** Function to check if invoice is selected */
  isSelected: PropTypes.func
};

InvoiceList.defaultProps = {
  isLoading: false,
  statusCounts: null,
  selectedIds: new Set(),
  onToggleSelection: null,
  isSelected: null
};

export default memo(InvoiceList);
