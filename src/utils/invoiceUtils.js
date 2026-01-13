/**
 * Invoice Utility Functions
 * 
 * Functions for invoice status calculation, filtering, sorting,
 * searching, and formatting.
 */

import {
  isOverdue,
  getDaysUntilDue,
  getDaysOverdue,
  getPaymentDelay,
  parseDate
} from './dateUtils';

import {
  INVOICE_STATUS,
  CURRENCY,
  ID_CONFIG
} from '../constants/invoiceConstants';

/**
 * Calculate the status of an invoice
 * 
 * Status logic:
 * - Paid: paymentDate exists
 * - Overdue: no paymentDate AND dueDate < today
 * - Pending: no paymentDate AND dueDate >= today
 * 
 * @param {Object} invoice - Invoice object with paymentDate and dueDate
 * @returns {string} - One of: 'paid', 'pending', 'overdue'
 * 
 * @example
 * calculateStatus({ paymentDate: '2024-01-10', dueDate: '2024-01-15' }) // 'paid'
 * calculateStatus({ paymentDate: null, dueDate: '2024-01-01' }) // 'overdue' (if today > Jan 1)
 */
export function calculateStatus(invoice) {
  if (!invoice) return INVOICE_STATUS.PENDING;
  
  // If payment date exists, invoice is paid
  if (invoice.paymentDate) {
    return INVOICE_STATUS.PAID;
  }
  
  // Check if overdue (due date is in the past)
  if (isOverdue(invoice.dueDate)) {
    return INVOICE_STATUS.OVERDUE;
  }
  
  // Otherwise, it's pending
  return INVOICE_STATUS.PENDING;
}

/**
 * Get display information for the "Days" column
 * 
 * @param {Object} invoice - Invoice object
 * @returns {Object} - { text: string, colorClass: string }
 * 
 * @example
 * getDaysDisplay({ status: 'pending', dueDate: '2024-01-20' })
 * // { text: 'Due in 5 days', colorClass: 'text-blue-600' }
 */
export function getDaysDisplay(invoice) {
  if (!invoice) {
    return { text: '-', colorClass: 'text-gray-500' };
  }
  
  const status = invoice.status || calculateStatus(invoice);
  
  switch (status) {
    case INVOICE_STATUS.PAID: {
      const delay = getPaymentDelay(invoice.dueDate, invoice.paymentDate);
      
      if (delay === 0) {
        return { text: 'Paid on time', colorClass: 'text-green-600' };
      } else if (delay < 0) {
        return { 
          text: `Paid ${Math.abs(delay)} days early`, 
          colorClass: 'text-green-600' 
        };
      } else {
        return { 
          text: `Paid ${delay} days late`, 
          colorClass: 'text-orange-600' 
        };
      }
    }
    
    case INVOICE_STATUS.OVERDUE: {
      const daysOverdue = getDaysOverdue(invoice.dueDate);
      return { 
        text: `Overdue by ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''}`, 
        colorClass: 'text-red-600' 
      };
    }
    
    case INVOICE_STATUS.PENDING: {
      const daysUntil = getDaysUntilDue(invoice.dueDate);
      
      if (daysUntil === 0) {
        return { text: 'Due today', colorClass: 'text-yellow-600' };
      }
      
      return { 
        text: `Due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`, 
        colorClass: 'text-blue-600' 
      };
    }
    
    default:
      return { text: '-', colorClass: 'text-gray-500' };
  }
}

/**
 * Format currency in Indian Rupee format
 * 
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string (e.g., '₹1,23,456')
 * 
 * @example
 * formatCurrencyINR(12345678) // '₹1,23,45,678'
 * formatCurrencyINR(0) // '₹0'
 * formatCurrencyINR(null) // '₹0'
 */
export function formatCurrencyINR(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${CURRENCY.SYMBOL}0`;
  }
  
  try {
    const formatter = new Intl.NumberFormat(CURRENCY.LOCALE, {
      style: 'currency',
      currency: CURRENCY.CODE,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    return formatter.format(amount);
  } catch (error) {
    // Fallback formatting
    return `${CURRENCY.SYMBOL}${Math.round(amount).toLocaleString('en-IN')}`;
  }
}

/**
 * Filter invoices by status
 * 
 * @param {Array} invoices - Array of invoice objects
 * @param {string} status - Status to filter by ('all', 'paid', 'pending', 'overdue')
 * @returns {Array} - Filtered array of invoices
 */
export function filterByStatus(invoices, status) {
  if (!Array.isArray(invoices)) return [];
  if (!status || status === 'all') return invoices;
  
  return invoices.filter(invoice => {
    const invoiceStatus = invoice.status || calculateStatus(invoice);
    return invoiceStatus === status;
  });
}

/**
 * Sort invoices by field and direction
 * 
 * @param {Array} invoices - Array of invoice objects
 * @param {string} field - Field to sort by ('amount', 'invoiceDate', 'dueDate')
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} - Sorted array of invoices (new array, doesn't mutate original)
 */
export function sortInvoices(invoices, field, direction = 'desc') {
  if (!Array.isArray(invoices) || invoices.length === 0) return [];
  
  const sorted = [...invoices].sort((a, b) => {
    let valueA, valueB;
    
    switch (field) {
      case 'amount':
        valueA = Number(a.amount) || 0;
        valueB = Number(b.amount) || 0;
        break;
        
      case 'invoiceDate':
      case 'dueDate':
      case 'paymentDate':
        valueA = parseDate(a[field])?.getTime() || 0;
        valueB = parseDate(b[field])?.getTime() || 0;
        break;
        
      case 'customerName':
        valueA = (a.customerName || '').toLowerCase();
        valueB = (b.customerName || '').toLowerCase();
        return direction === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
        
      case 'id':
        // Extract numeric part for proper sorting
        valueA = extractNumericId(a.id);
        valueB = extractNumericId(b.id);
        break;
        
      default:
        return 0;
    }
    
    if (direction === 'asc') {
      return valueA - valueB;
    }
    return valueB - valueA;
  });
  
  return sorted;
}

/**
 * Search invoices by query string
 * Searches in invoice number and customer name
 * 
 * @param {Array} invoices - Array of invoice objects
 * @param {string} query - Search query
 * @returns {Array} - Matching invoices
 */
export function searchInvoices(invoices, query) {
  if (!Array.isArray(invoices)) return [];
  if (!query || typeof query !== 'string') return invoices;
  
  // Normalize query: trim, lowercase, and remove extra spaces
  const normalizedQuery = query.trim().toLowerCase().replace(/\s+/g, ' ');
  
  if (!normalizedQuery) return invoices;
  
  return invoices.filter(invoice => {
    // Normalize invoice ID (handle both INV-001 and inv-001)
    const invoiceId = (invoice.id || '').toLowerCase().replace(/\s+/g, '');
    // Also check without hyphen for loose matching
    const invoiceIdNoHyphen = invoiceId.replace(/-/g, '');
    
    // Normalize customer name
    const customerName = (invoice.customerName || '').toLowerCase();
    
    // Normalize query without hyphen for matching
    const queryNoHyphen = normalizedQuery.replace(/-/g, '').replace(/\s+/g, '');
    
    return (
      invoiceId.includes(normalizedQuery) ||
      invoiceIdNoHyphen.includes(queryNoHyphen) ||
      customerName.includes(normalizedQuery)
    );
  });
}

/**
 * Extract numeric part from invoice ID
 * 
 * @param {string} id - Invoice ID (e.g., 'INV-001')
 * @returns {number} - Numeric value (e.g., 1)
 */
export function extractNumericId(id) {
  if (!id || typeof id !== 'string') return 0;
  const match = id.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

/**
 * Generate next invoice ID
 * Format: INV-XXX (zero-padded to 3 digits)
 * 
 * @param {Array} existingInvoices - Array of existing invoices
 * @returns {string} - New unique invoice ID
 * 
 * @example
 * generateInvoiceId([{ id: 'INV-001' }, { id: 'INV-002' }]) // 'INV-003'
 * generateInvoiceId([]) // 'INV-001'
 */
export function generateInvoiceId(existingInvoices) {
  if (!Array.isArray(existingInvoices) || existingInvoices.length === 0) {
    return `${ID_CONFIG.PREFIX}001`;
  }
  
  // Find the maximum numeric ID
  const maxId = existingInvoices.reduce((max, invoice) => {
    const numericId = extractNumericId(invoice.id);
    return numericId > max ? numericId : max;
  }, 0);
  
  // Increment and pad
  const nextId = maxId + 1;
  const paddedId = String(nextId).padStart(ID_CONFIG.PAD_LENGTH, '0');
  
  return `${ID_CONFIG.PREFIX}${paddedId}`;
}

/**
 * Validate invoice data
 * 
 * @param {Object} invoice - Invoice object to validate
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export function validateInvoice(invoice) {
  const errors = {};
  
  // Customer name validation
  if (!invoice.customerName || typeof invoice.customerName !== 'string') {
    errors.customerName = 'Customer name is required';
  } else if (invoice.customerName.trim().length < 2) {
    errors.customerName = 'Customer name must be at least 2 characters';
  } else if (invoice.customerName.trim().length > 100) {
    errors.customerName = 'Customer name must be less than 100 characters';
  }
  
  // Amount validation
  if (invoice.amount === undefined || invoice.amount === null || invoice.amount === '') {
    errors.amount = 'Amount is required';
  } else if (isNaN(Number(invoice.amount))) {
    errors.amount = 'Amount must be a number';
  } else if (Number(invoice.amount) <= 0) {
    errors.amount = 'Amount must be a positive number';
  } else if (Number(invoice.amount) > 10000000) {
    errors.amount = 'Amount cannot exceed ₹1,00,00,000';
  }
  
  // Invoice date validation
  if (!invoice.invoiceDate) {
    errors.invoiceDate = 'Invoice date is required';
  } else {
    const invoiceDateObj = parseDate(invoice.invoiceDate);
    if (!invoiceDateObj) {
      errors.invoiceDate = 'Invalid invoice date';
    } else if (invoiceDateObj > new Date()) {
      errors.invoiceDate = 'Invoice date cannot be in the future';
    }
  }
  
  // Payment terms validation
  const validTerms = [7, 15, 30, 45, 60];
  if (!invoice.paymentTerms) {
    errors.paymentTerms = 'Please select payment terms';
  } else if (!validTerms.includes(Number(invoice.paymentTerms))) {
    errors.paymentTerms = 'Invalid payment terms selected';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Prepare invoice for saving
 * Ensures all computed fields are set correctly
 * 
 * @param {Object} invoice - Raw invoice data
 * @param {Array} existingInvoices - Existing invoices (for ID generation)
 * @returns {Object} - Complete invoice object ready for saving
 */
export function prepareInvoiceForSave(invoice, existingInvoices = []) {
  const { calculateDueDate, toISODateString } = require('./dateUtils');
  
  const dueDate = calculateDueDate(invoice.invoiceDate, Number(invoice.paymentTerms));
  
  return {
    id: invoice.id || generateInvoiceId(existingInvoices),
    customerName: invoice.customerName.trim(),
    amount: Number(invoice.amount),
    invoiceDate: invoice.invoiceDate,
    paymentTerms: Number(invoice.paymentTerms),
    dueDate: dueDate,
    paymentDate: invoice.paymentDate || null,
    status: invoice.paymentDate ? INVOICE_STATUS.PAID : 
            (dueDate && new Date(dueDate) < new Date() ? INVOICE_STATUS.OVERDUE : INVOICE_STATUS.PENDING)
  };
}

/**
 * Mark invoice as paid
 * 
 * @param {Object} invoice - Invoice to mark as paid
 * @param {string} paymentDate - Payment date (defaults to today)
 * @returns {Object} - Updated invoice object
 */
export function markInvoiceAsPaid(invoice, paymentDate = null) {
  const { toISODateString } = require('./dateUtils');
  
  const actualPaymentDate = paymentDate || toISODateString(new Date());
  
  return {
    ...invoice,
    paymentDate: actualPaymentDate,
    status: INVOICE_STATUS.PAID
  };
}

/**
 * Get counts of invoices by status
 * 
 * @param {Array} invoices - Array of invoices
 * @returns {Object} - { paid: number, pending: number, overdue: number, total: number }
 */
export function getStatusCounts(invoices) {
  if (!Array.isArray(invoices)) {
    return { paid: 0, pending: 0, overdue: 0, total: 0 };
  }
  
  return invoices.reduce((counts, invoice) => {
    const status = invoice.status || calculateStatus(invoice);
    counts[status] = (counts[status] || 0) + 1;
    counts.total++;
    return counts;
  }, { paid: 0, pending: 0, overdue: 0, total: 0 });
}
