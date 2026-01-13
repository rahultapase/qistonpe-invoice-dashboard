import { useState, useCallback, useMemo } from 'react';

/**
 * useBulkSelection Hook
 * 
 * Manages selection state for bulk actions on invoices.
 * Provides methods for selecting, deselecting, and toggling items.
 * 
 * @param {Array} items - Array of items with 'id' property
 * @returns {Object} - Selection state and methods
 * 
 * @example
 * const {
 *   selectedIds,
 *   isSelected,
 *   toggleSelection,
 *   selectAll,
 *   deselectAll,
 *   selectMultiple
 * } = useBulkSelection(invoices);
 */
function useBulkSelection(items = []) {
  /**
   * Set of selected item IDs
   */
  const [selectedIds, setSelectedIds] = useState(new Set());

  /**
   * Check if a specific item is selected
   */
  const isSelected = useCallback((id) => {
    return selectedIds.has(id);
  }, [selectedIds]);

  /**
   * Toggle selection of a single item
   */
  const toggleSelection = useCallback((id) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  /**
   * Select a single item
   */
  const select = useCallback((id) => {
    setSelectedIds(prev => {
      if (prev.has(id)) return prev;
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  }, []);

  /**
   * Deselect a single item
   */
  const deselect = useCallback((id) => {
    setSelectedIds(prev => {
      if (!prev.has(id)) return prev;
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  /**
   * Select all items
   */
  const selectAll = useCallback(() => {
    const allIds = items.map(item => item.id);
    setSelectedIds(new Set(allIds));
  }, [items]);

  /**
   * Deselect all items
   */
  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  /**
   * Select multiple items by their IDs
   */
  const selectMultiple = useCallback((ids) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      ids.forEach(id => newSet.add(id));
      return newSet;
    });
  }, []);

  /**
   * Deselect multiple items by their IDs
   */
  const deselectMultiple = useCallback((ids) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      ids.forEach(id => newSet.delete(id));
      return newSet;
    });
  }, []);

  /**
   * Get array of selected items
   */
  const selectedItems = useMemo(() => {
    return items.filter(item => selectedIds.has(item.id));
  }, [items, selectedIds]);

  /**
   * Check if all items are selected
   */
  const allSelected = useMemo(() => {
    return items.length > 0 && selectedIds.size === items.length;
  }, [items, selectedIds]);

  /**
   * Check if some items are selected
   */
  const someSelected = useMemo(() => {
    return selectedIds.size > 0;
  }, [selectedIds]);

  /**
   * Check if no items are selected
   */
  const noneSelected = useMemo(() => {
    return selectedIds.size === 0;
  }, [selectedIds]);

  return {
    // State
    selectedIds,
    selectedItems,
    selectedCount: selectedIds.size,
    
    // Checks
    isSelected,
    allSelected,
    someSelected,
    noneSelected,
    
    // Actions
    toggleSelection,
    select,
    deselect,
    selectAll,
    deselectAll,
    selectMultiple,
    deselectMultiple,
    
    // Direct setter (for advanced use cases)
    setSelectedIds
  };
}

export default useBulkSelection;
