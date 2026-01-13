import { useState, useMemo, useCallback } from 'react';
import { 
  filterByStatus, 
  sortInvoices, 
  searchInvoices 
} from '../utils/invoiceUtils';
import { SORT_OPTIONS } from '../constants/invoiceConstants';

/**
 * useInvoiceFilters Hook
 * 
 * Manages filtering, sorting, and searching of invoices.
 * All operations are memoized for performance with large datasets.
 * 
 * Features:
 * - Filter by status (all, paid, pending, overdue)
 * - Sort by field and direction
 * - Search by invoice number or customer name (case-insensitive)
 * - Returns filtered, sorted results
 * 
 * @param {Array} invoices - Array of invoice objects to filter
 * @returns {Object} - Filtered invoices and filter controls
 * 
 * @example
 * const {
 *   filteredInvoices,
 *   statusFilter,
 *   setStatusFilter,
 *   sortOption,
 *   setSortOption,
 *   searchQuery,
 *   setSearchQuery,
 *   clearFilters
 * } = useInvoiceFilters(invoices);
 */
function useInvoiceFilters(invoices = []) {
  // Filter state
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Sort state - default to newest invoices first
  const [sortOption, setSortOption] = useState('invoiceDate-desc');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Parse sort option string into field and direction
   * Memoized to avoid recalculation
   */
  const sortConfig = useMemo(() => {
    const option = SORT_OPTIONS.find(opt => opt.value === sortOption);
    if (option) {
      return { field: option.field, direction: option.direction };
    }
    // Default fallback
    return { field: 'invoiceDate', direction: 'desc' };
  }, [sortOption]);

  /**
   * Step 1: Filter by status
   * Memoized to prevent recalculation when only sort/search changes
   */
  const statusFilteredInvoices = useMemo(() => {
    if (!Array.isArray(invoices)) return [];
    return filterByStatus(invoices, statusFilter);
  }, [invoices, statusFilter]);

  /**
   * Step 2: Apply search filter
   * Memoized and depends on status-filtered results
   */
  const searchedInvoices = useMemo(() => {
    if (!searchQuery.trim()) {
      return statusFilteredInvoices;
    }
    return searchInvoices(statusFilteredInvoices, searchQuery);
  }, [statusFilteredInvoices, searchQuery]);

  /**
   * Step 3: Sort the filtered results
   * This is the final result returned to components
   */
  const filteredInvoices = useMemo(() => {
    return sortInvoices(
      searchedInvoices, 
      sortConfig.field, 
      sortConfig.direction
    );
  }, [searchedInvoices, sortConfig.field, sortConfig.direction]);

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = useMemo(() => {
    return statusFilter !== 'all' || searchQuery.trim() !== '';
  }, [statusFilter, searchQuery]);

  /**
   * Get count of invoices at each filter stage
   * Useful for showing "X of Y invoices"
   */
  const filterCounts = useMemo(() => {
    return {
      total: Array.isArray(invoices) ? invoices.length : 0,
      afterStatusFilter: statusFilteredInvoices.length,
      afterSearch: searchedInvoices.length,
      displayed: filteredInvoices.length
    };
  }, [invoices, statusFilteredInvoices, searchedInvoices, filteredInvoices]);

  /**
   * Handle status filter change
   * useCallback for stable reference (passed to child components)
   */
  const handleStatusFilterChange = useCallback((status) => {
    setStatusFilter(status);
  }, []);

  /**
   * Handle sort option change
   * useCallback for stable reference
   */
  const handleSortChange = useCallback((option) => {
    setSortOption(option);
  }, []);

  /**
   * Handle search query change
   * useCallback for stable reference
   * Trims and normalizes the query
   */
  const handleSearchChange = useCallback((query) => {
    // Accept the raw query - trimming is done in searchInvoices
    setSearchQuery(query);
  }, []);

  /**
   * Clear all filters and reset to default
   * useCallback for stable reference
   */
  const clearFilters = useCallback(() => {
    setStatusFilter('all');
    setSortOption('invoiceDate-desc');
    setSearchQuery('');
  }, []);

  /**
   * Clear only search
   */
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  /**
   * Check if there are no results after filtering
   */
  const isEmpty = filteredInvoices.length === 0;
  
  /**
   * Check if empty state is due to filters (vs no data at all)
   */
  const isEmptyDueToFilters = isEmpty && (hasActiveFilters || searchQuery.trim() !== '');

  return {
    // Filtered results
    filteredInvoices,
    
    // Filter state
    statusFilter,
    sortOption,
    searchQuery,
    sortConfig,
    
    // Filter setters (with useCallback)
    setStatusFilter: handleStatusFilterChange,
    setSortOption: handleSortChange,
    setSearchQuery: handleSearchChange,
    
    // Utility functions
    clearFilters,
    clearSearch,
    
    // State flags
    hasActiveFilters,
    isEmpty,
    isEmptyDueToFilters,
    
    // Counts
    filterCounts,
    totalCount: filterCounts.total,
    displayedCount: filterCounts.displayed
  };
}

export default useInvoiceFilters;
