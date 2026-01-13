import { useState, useCallback, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { CheckSquare, Square, XSquare, CheckCircle } from 'lucide-react';
import { Button } from '../UI';

/**
 * BulkActions Component
 * 
 * Provides bulk action controls for selected invoices:
 * - Select all / Deselect all (optional)
 * - Mark selected as paid
 * - Selection count display
 * 
 * @param {Object} props - Component props
 * @param {Array} props.invoices - All invoices in current view
 * @param {Set} props.selectedIds - Set of selected invoice IDs
 * @param {Function} props.onSelectAll - Callback to select all
 * @param {Function} props.onDeselectAll - Callback to deselect all
 * @param {Function} props.onBulkMarkPaid - Callback to mark selected as paid
 * @param {boolean} props.showSelectAll - Whether to show select all button (default true)
 */
function BulkActions({
  invoices,
  selectedIds,
  onSelectAll,
  onDeselectAll,
  onBulkMarkPaid,
  showSelectAll = true
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

  // Don't render if no invoices or no selection
  if (invoices.length === 0 || selectedCount === 0) {
    return null;
  }

  return (
    <div 
      className="flex flex-wrap items-center justify-between gap-3 p-4 mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm animate-in slide-in-from-top-2 duration-200"
      role="toolbar"
      aria-label="Bulk actions"
    >
      {/* Left side: Selection Count */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 px-3 py-2 rounded-lg">
          <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
            {selectedCount} invoice{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>
      </div>

      {/* Right side: Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Mark as Paid Button */}
        {unpaidSelectedCount > 0 && (
          <button
            onClick={handleBulkMarkPaid}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            aria-label={`Mark ${unpaidSelectedCount} invoices as paid`}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" aria-hidden="true" />
                <span>Mark {unpaidSelectedCount} as Paid</span>
              </>
            )}
          </button>
        )}

        {/* Clear Selection Button */}
        <button
          onClick={onDeselectAll}
          disabled={isProcessing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium text-sm rounded-lg border border-gray-300 dark:border-gray-600 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Clear selection"
        >
          <XSquare className="h-4 w-4" aria-hidden="true" />
          <span>Clear</span>
        </button>
      </div>
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
  onBulkMarkPaid: PropTypes.func.isRequired,
  /** Whether to show select all button */
  showSelectAll: PropTypes.bool
};

BulkActions.defaultProps = {
  showSelectAll: true
};

export default memo(BulkActions);
