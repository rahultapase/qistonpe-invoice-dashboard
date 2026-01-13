import { useState, useCallback, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { CheckSquare, Square, XSquare } from 'lucide-react';
import { Button } from '../UI';

/**
 * BulkActions Component
 * 
 * Provides bulk action controls for selected invoices:
 * - Select all / Deselect all
 * - Mark selected as paid
 * - Selection count display
 * 
 * @param {Object} props - Component props
 * @param {Array} props.invoices - All invoices in current view
 * @param {Set} props.selectedIds - Set of selected invoice IDs
 * @param {Function} props.onSelectAll - Callback to select all
 * @param {Function} props.onDeselectAll - Callback to deselect all
 * @param {Function} props.onBulkMarkPaid - Callback to mark selected as paid
 */
function BulkActions({
  invoices,
  selectedIds,
  onSelectAll,
  onDeselectAll,
  onBulkMarkPaid
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Count of selected invoices
   */
  const selectedCount = selectedIds.size;

  /**
   * Count of unpaid invoices in selection (can be marked as paid)
   */
  const unpaidSelectedCount = useMemo(() => {
    return invoices.filter(inv => 
      selectedIds.has(inv.id) && !inv.isPaid
    ).length;
  }, [invoices, selectedIds]);

  /**
   * Check if all invoices are selected
   */
  const allSelected = invoices.length > 0 && selectedCount === invoices.length;

  /**
   * Check if some (but not all) invoices are selected
   */
  const someSelected = selectedCount > 0 && selectedCount < invoices.length;

  /**
   * Handle select/deselect all toggle
   */
  const handleToggleAll = useCallback(() => {
    if (allSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  }, [allSelected, onSelectAll, onDeselectAll]);

  /**
   * Handle bulk mark as paid
   */
  const handleBulkMarkPaid = useCallback(async () => {
    if (unpaidSelectedCount === 0) return;
    
    setIsProcessing(true);
    try {
      await onBulkMarkPaid();
    } finally {
      setIsProcessing(false);
    }
  }, [unpaidSelectedCount, onBulkMarkPaid]);

  // Don't render if no invoices
  if (invoices.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Select All / Deselect All Button */}
      <button
        type="button"
        onClick={handleToggleAll}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${allSelected 
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300' 
            : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }
          border border-gray-300 dark:border-gray-600
        `}
        aria-label={allSelected ? 'Deselect all invoices' : 'Select all invoices'}
      >
        {allSelected ? (
          <XSquare className="h-4 w-4" aria-hidden="true" />
        ) : someSelected ? (
          <CheckSquare className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Square className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">
          {allSelected ? 'Deselect All' : 'Select All'}
        </span>
      </button>

      {/* Selection Count */}
      {selectedCount > 0 && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium text-gray-900 dark:text-gray-100">{selectedCount}</span>
          {' '}selected
        </span>
      )}

      {/* Bulk Actions (shown when items selected) */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-2 ml-auto">
          {/* Mark as Paid Button */}
          {unpaidSelectedCount > 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleBulkMarkPaid}
              isLoading={isProcessing}
              disabled={isProcessing}
              aria-label={`Mark ${unpaidSelectedCount} invoices as paid`}
            >
              Mark {unpaidSelectedCount} as Paid
            </Button>
          )}

          {/* Clear Selection */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onDeselectAll}
            disabled={isProcessing}
            aria-label="Clear selection"
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}

BulkActions.propTypes = {
  /** Array of all invoices in current view */
  invoices: PropTypes.array.isRequired,
  /** Set of selected invoice IDs */
  selectedIds: PropTypes.instanceOf(Set).isRequired,
  /** Callback to select all invoices */
  onSelectAll: PropTypes.func.isRequired,
  /** Callback to deselect all invoices */
  onDeselectAll: PropTypes.func.isRequired,
  /** Callback to mark selected invoices as paid */
  onBulkMarkPaid: PropTypes.func.isRequired
};

export default memo(BulkActions);
