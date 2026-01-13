import { memo } from 'react';
import PropTypes from 'prop-types';
import { RotateCcw } from 'lucide-react';
import StatusFilter from './StatusFilter';
import SearchBar from './SearchBar';
import SortDropdown from './SortDropdown';
import { Button } from '../UI';

/**
 * FilterBar Component
 * 
 * Combined filter controls for the invoice list.
 * Includes status filter, search bar, and sort dropdown.
 * Responsive layout: stacks on mobile, horizontal on larger screens.
 * 
 * @param {Object} props - Component props
 * @param {string} props.statusFilter - Current status filter value
 * @param {Function} props.onStatusChange - Callback for status filter change
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.onSearchChange - Callback for search change
 * @param {string} props.sortOption - Current sort option value
 * @param {Function} props.onSortChange - Callback for sort change
 * @param {Function} props.onClearFilters - Callback to clear all filters
 * @param {boolean} props.hasActiveFilters - Whether any filters are active
 * @param {Object} props.statusCounts - Counts for each status
 */
function FilterBar({
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
  statusCounts
}) {
  // Calculate counts including 'all'
  const counts = statusCounts ? {
    all: statusCounts.total,
    paid: statusCounts.paid,
    pending: statusCounts.pending,
    overdue: statusCounts.overdue
  } : null;

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4 sm:mb-6 transition-colors duration-200"
      role="search"
      aria-label="Invoice filters"
    >
      {/* Top Row: Status Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <StatusFilter
          activeStatus={statusFilter}
          onStatusChange={onStatusChange}
          counts={counts}
        />
        
        {/* Clear Filters Button (only show when filters active) */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            leftIcon={<RotateCcw className="h-4 w-4" />}
            aria-label="Clear all filters"
          >
            Clear Filters
          </Button>
        )}
      </div>
      
      {/* Bottom Row: Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Bar */}
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>
        
        {/* Sort Dropdown */}
        <div className="flex-shrink-0">
          <SortDropdown
            value={sortOption}
            onChange={onSortChange}
          />
        </div>
      </div>
    </div>
  );
}

FilterBar.propTypes = {
  /** Currently active status filter */
  statusFilter: PropTypes.oneOf(['all', 'paid', 'pending', 'overdue']).isRequired,
  /** Callback when status filter changes */
  onStatusChange: PropTypes.func.isRequired,
  /** Current search query string */
  searchQuery: PropTypes.string.isRequired,
  /** Callback when search query changes */
  onSearchChange: PropTypes.func.isRequired,
  /** Current sort option value */
  sortOption: PropTypes.string.isRequired,
  /** Callback when sort option changes */
  onSortChange: PropTypes.func.isRequired,
  /** Callback to clear all active filters */
  onClearFilters: PropTypes.func,
  /** Whether any filters are currently active */
  hasActiveFilters: PropTypes.bool,
  /** Object containing counts for each status */
  statusCounts: PropTypes.shape({
    total: PropTypes.number,
    paid: PropTypes.number,
    pending: PropTypes.number,
    overdue: PropTypes.number
  })
};

FilterBar.defaultProps = {
  onClearFilters: () => {},
  hasActiveFilters: false,
  statusCounts: null
};

export default memo(FilterBar);
