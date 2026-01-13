import { memo } from 'react';
import PropTypes from 'prop-types';
import { Plus } from 'lucide-react';
import { Button } from '../UI';

/**
 * AddInvoiceButton Component
 * 
 * Primary button to open the Add Invoice modal.
 * Used in the header area.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Callback when button is clicked
 */
function AddInvoiceButton({ onClick }) {
  return (
    <Button
      variant="primary"
      onClick={onClick}
      leftIcon={<Plus className="h-4 w-4" />}
      aria-label="Add new invoice"
    >
      <span className="hidden sm:inline">Add Invoice</span>
      <span className="sm:hidden">Add</span>
    </Button>
  );
}

AddInvoiceButton.propTypes = {
  /** Callback function when the button is clicked */
  onClick: PropTypes.func.isRequired
};

export default memo(AddInvoiceButton);
