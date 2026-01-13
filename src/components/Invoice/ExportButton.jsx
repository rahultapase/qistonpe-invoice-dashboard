import { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Download } from 'lucide-react';
import { Button } from '../UI';
import { exportInvoicesToCSV } from '../../utils/exportUtils';

/**
 * ExportButton Component
 * 
 * Button to export invoices to CSV file.
 * Disabled when no invoices are available.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.invoices - Invoices to export
 * @param {string} props.filename - Optional custom filename
 * @param {boolean} props.disabled - Whether button is disabled
 */
function ExportButton({ invoices = [], filename = null, disabled = false }) {
  /**
   * Handle export click
   */
  const handleExport = useCallback(() => {
    if (!invoices || invoices.length === 0) {
      return;
    }

    exportInvoicesToCSV(invoices, filename, {
      includeStatus: true,
      formatCurrency: false
    });
  }, [invoices, filename]);

  const isDisabled = disabled || !invoices || invoices.length === 0;

  return (
    <Button
      variant="secondary"
      onClick={handleExport}
      disabled={isDisabled}
      leftIcon={<Download className="h-4 w-4" />}
      aria-label={`Export ${invoices?.length || 0} invoices to CSV`}
      title={isDisabled ? 'No invoices to export' : `Export ${invoices.length} invoices to CSV`}
      className="!px-2.5 sm:!px-4 !gap-0 sm:!gap-2"
    >
      <span className="hidden sm:inline">Export CSV</span>
    </Button>
  );
}

ExportButton.propTypes = {
  /** Array of invoices to export */
  invoices: PropTypes.array,
  /** Optional custom filename for the export */
  filename: PropTypes.string,
  /** Whether the button is disabled */
  disabled: PropTypes.bool
};

export default memo(ExportButton);
