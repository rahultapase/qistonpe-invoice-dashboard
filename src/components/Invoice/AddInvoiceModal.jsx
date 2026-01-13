import { useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../Modal';
import AddInvoiceForm from './AddInvoiceForm';

/**
 * AddInvoiceModal Component
 * 
 * Modal wrapper containing the Add Invoice form.
 * Handles form submission and modal state.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Callback to close modal
 * @param {Function} props.onAddInvoice - Callback when invoice is added successfully
 */
function AddInvoiceModal({ isOpen, onClose, onAddInvoice }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle form submission
   * Calls the onAddInvoice prop and handles success/error
   */
  const handleSubmit = useCallback(async (invoiceData) => {
    setIsSubmitting(true);
    
    try {
      // Call the add invoice function
      const result = onAddInvoice(invoiceData);
      
      // Check if successful
      if (result.success) {
        // Close the modal on success
        onClose();
      } else if (result.errors) {
        // Errors are handled by the form component
        console.error('Validation errors:', result.errors);
      }
    } catch (error) {
      console.error('Error adding invoice:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [onAddInvoice, onClose]);

  /**
   * Handle cancel/close
   */
  const handleCancel = useCallback(() => {
    if (!isSubmitting) {
      onClose();
    }
  }, [isSubmitting, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Add New Invoice"
      size="md"
    >
      <AddInvoiceForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
}

AddInvoiceModal.propTypes = {
  /** Whether the modal is visible */
  isOpen: PropTypes.bool.isRequired,
  /** Callback function to close the modal */
  onClose: PropTypes.func.isRequired,
  /** Callback function when a new invoice is added successfully */
  onAddInvoice: PropTypes.func.isRequired
};

export default memo(AddInvoiceModal);
