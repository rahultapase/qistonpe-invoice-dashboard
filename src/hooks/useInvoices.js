import { useState, useCallback, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import { mockInvoices } from '../data/mockInvoices';
import { STORAGE_KEYS, INVOICE_STATUS } from '../constants/invoiceConstants';
import { calculateDueDate, toISODateString } from '../utils/dateUtils';
import { 
  generateInvoiceId, 
  calculateStatus,
  validateInvoice 
} from '../utils/invoiceUtils';

/**
 * useInvoices Hook
 * 
 * Main hook for managing invoice data with full CRUD operations.
 * Handles:
 * - Loading invoices from localStorage (with mock data fallback)
 * - Adding new invoices (with auto-generated ID)
 * - Marking invoices as paid
 * - Deleting invoices
 * - Auto-saving to localStorage on changes
 * 
 * @returns {Object} - Invoice state and operations
 * 
 * @example
 * const { 
 *   invoices, 
 *   isLoading, 
 *   error,
 *   addInvoice, 
 *   markAsPaid, 
 *   deleteInvoice 
 * } = useInvoices();
 */
function useInvoices() {
  // Use localStorage hook with mock data as initial value
  const [invoices, setInvoices, { error: storageError, isLoading: storageLoading }] = 
    useLocalStorage(STORAGE_KEYS.INVOICES, mockInvoices);

  // Track loading state for async operations
  const [isLoading, setIsLoading] = useState(true);
  
  // Track operation errors
  const [error, setError] = useState(null);

  /**
   * Initialize invoices on first load
   * If localStorage is empty, populate with mock data
   */
  useEffect(() => {
    // Short delay to ensure localStorage is read
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  /**
   * Recalculate status for all invoices
   * This ensures status is always up-to-date based on current date
   */
  const refreshStatuses = useCallback(() => {
    setInvoices(currentInvoices => {
      if (!Array.isArray(currentInvoices)) return mockInvoices;
      
      return currentInvoices.map(invoice => ({
        ...invoice,
        status: calculateStatus(invoice)
      }));
    });
  }, [setInvoices]);

  /**
   * Refresh statuses when invoices are loaded
   * This handles the case where an invoice becomes overdue since last visit
   */
  useEffect(() => {
    if (!storageLoading && invoices.length > 0) {
      refreshStatuses();
    }
  }, [storageLoading]); // Only run on initial load

  /**
   * Add a new invoice
   * 
   * @param {Object} invoiceData - New invoice data (without id, dueDate, status)
   * @returns {Object} - { success: boolean, invoice?: Object, errors?: Object }
   * 
   * Expected invoiceData:
   * - customerName: string (required)
   * - amount: number (required, positive)
   * - invoiceDate: string ISO date (required)
   * - paymentTerms: number (required, 7/15/30/45/60)
   */
  const addInvoice = useCallback((invoiceData) => {
    setError(null);

    // Validate input
    const validation = validateInvoice(invoiceData);
    if (!validation.isValid) {
      return { 
        success: false, 
        errors: validation.errors 
      };
    }

    try {
      // Calculate due date
      const dueDate = calculateDueDate(
        invoiceData.invoiceDate, 
        Number(invoiceData.paymentTerms)
      );

      if (!dueDate) {
        return {
          success: false,
          errors: { invoiceDate: 'Failed to calculate due date' }
        };
      }

      // Create new invoice object
      let newInvoice;
      
      setInvoices(currentInvoices => {
        const invoicesArray = Array.isArray(currentInvoices) ? currentInvoices : [];
        
        // Generate unique ID based on existing invoices
        const newId = generateInvoiceId(invoicesArray);
        
        newInvoice = {
          id: newId,
          customerName: invoiceData.customerName.trim(),
          amount: Number(invoiceData.amount),
          invoiceDate: invoiceData.invoiceDate,
          paymentTerms: Number(invoiceData.paymentTerms),
          dueDate: dueDate,
          paymentDate: null,
          status: INVOICE_STATUS.PENDING // New invoices are always pending
        };

        // Add to beginning of array (most recent first)
        return [newInvoice, ...invoicesArray];
      });

      return { 
        success: true, 
        invoice: newInvoice 
      };
    } catch (err) {
      console.error('Error adding invoice:', err);
      setError({
        type: 'ADD_ERROR',
        message: 'Failed to add invoice. Please try again.'
      });
      return { 
        success: false, 
        errors: { general: err.message } 
      };
    }
  }, [setInvoices]);

  /**
   * Mark an invoice as paid
   * 
   * @param {string} invoiceId - ID of invoice to mark as paid
   * @param {string} paymentDate - Optional payment date (defaults to today)
   * @returns {Object} - { success: boolean, invoice?: Object }
   */
  const markAsPaid = useCallback((invoiceId, paymentDate = null) => {
    setError(null);

    if (!invoiceId) {
      return { success: false, error: 'Invoice ID is required' };
    }

    try {
      const actualPaymentDate = paymentDate || toISODateString(new Date());
      let updatedInvoice = null;

      setInvoices(currentInvoices => {
        if (!Array.isArray(currentInvoices)) return currentInvoices;

        return currentInvoices.map(invoice => {
          if (invoice.id === invoiceId) {
            updatedInvoice = {
              ...invoice,
              paymentDate: actualPaymentDate,
              status: INVOICE_STATUS.PAID
            };
            return updatedInvoice;
          }
          return invoice;
        });
      });

      if (!updatedInvoice) {
        return { success: false, error: 'Invoice not found' };
      }

      return { success: true, invoice: updatedInvoice };
    } catch (err) {
      console.error('Error marking invoice as paid:', err);
      setError({
        type: 'UPDATE_ERROR',
        message: 'Failed to update invoice. Please try again.'
      });
      return { success: false, error: err.message };
    }
  }, [setInvoices]);

  /**
   * Delete an invoice (Bonus Feature)
   * 
   * @param {string} invoiceId - ID of invoice to delete
   * @returns {Object} - { success: boolean }
   */
  const deleteInvoice = useCallback((invoiceId) => {
    setError(null);

    if (!invoiceId) {
      return { success: false, error: 'Invoice ID is required' };
    }

    try {
      let found = false;

      setInvoices(currentInvoices => {
        if (!Array.isArray(currentInvoices)) return currentInvoices;

        const filtered = currentInvoices.filter(invoice => {
          if (invoice.id === invoiceId) {
            found = true;
            return false;
          }
          return true;
        });

        return filtered;
      });

      if (!found) {
        return { success: false, error: 'Invoice not found' };
      }

      return { success: true };
    } catch (err) {
      console.error('Error deleting invoice:', err);
      setError({
        type: 'DELETE_ERROR',
        message: 'Failed to delete invoice. Please try again.'
      });
      return { success: false, error: err.message };
    }
  }, [setInvoices]);

  /**
   * Get a single invoice by ID
   * 
   * @param {string} invoiceId - ID of invoice to find
   * @returns {Object|null} - Invoice object or null
   */
  const getInvoiceById = useCallback((invoiceId) => {
    if (!Array.isArray(invoices)) return null;
    return invoices.find(invoice => invoice.id === invoiceId) || null;
  }, [invoices]);

  /**
   * Reset to mock data (useful for testing)
   */
  const resetToMockData = useCallback(() => {
    setInvoices(mockInvoices);
    setError(null);
  }, [setInvoices]);

  /**
   * Bulk mark as paid (Bonus Feature)
   * 
   * @param {Array<string>} invoiceIds - Array of invoice IDs to mark as paid
   * @param {string} paymentDate - Optional payment date (defaults to today)
   * @returns {Object} - { success: boolean, count: number }
   */
  const bulkMarkAsPaid = useCallback((invoiceIds, paymentDate = null) => {
    if (!Array.isArray(invoiceIds) || invoiceIds.length === 0) {
      return { success: false, count: 0, error: 'No invoices selected' };
    }

    try {
      const actualPaymentDate = paymentDate || toISODateString(new Date());
      const idsSet = new Set(invoiceIds);
      let count = 0;

      setInvoices(currentInvoices => {
        if (!Array.isArray(currentInvoices)) return currentInvoices;

        return currentInvoices.map(invoice => {
          if (idsSet.has(invoice.id) && invoice.status !== INVOICE_STATUS.PAID) {
            count++;
            return {
              ...invoice,
              paymentDate: actualPaymentDate,
              status: INVOICE_STATUS.PAID
            };
          }
          return invoice;
        });
      });

      return { success: true, count };
    } catch (err) {
      console.error('Error bulk marking as paid:', err);
      return { success: false, count: 0, error: err.message };
    }
  }, [setInvoices]);

  return {
    // State
    invoices: Array.isArray(invoices) ? invoices : [],
    isLoading: isLoading || storageLoading,
    error: error || storageError,
    
    // CRUD Operations
    addInvoice,
    markAsPaid,
    deleteInvoice,
    
    // Utility functions
    getInvoiceById,
    refreshStatuses,
    resetToMockData,
    
    // Bonus features
    bulkMarkAsPaid
  };
}

export default useInvoices;
