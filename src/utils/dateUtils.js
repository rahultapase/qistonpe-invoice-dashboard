/**
 * Date Utility Functions
 * 
 * All date manipulation and comparison functions for the invoice dashboard.
 * Uses date-fns for reliable, timezone-safe date operations.
 */

import {
  parseISO,
  format,
  addDays,
  differenceInDays,
  isValid,
  isBefore,
  isAfter,
  startOfDay,
  startOfMonth,
  endOfMonth,
  isWithinInterval
} from 'date-fns';

import { DATE_FORMATS } from '../constants/invoiceConstants';

/**
 * Parse a date string to a Date object safely
 * 
 * @param {string|Date} dateInput - ISO date string or Date object
 * @returns {Date|null} - Parsed Date object or null if invalid
 * 
 * @example
 * parseDate('2024-01-15') // Returns Date object
 * parseDate('invalid') // Returns null
 */
export function parseDate(dateInput) {
  if (!dateInput) return null;
  
  try {
    // If already a Date object, validate it
    if (dateInput instanceof Date) {
      return isValid(dateInput) ? dateInput : null;
    }
    
    // Parse ISO string
    const parsed = parseISO(dateInput);
    return isValid(parsed) ? parsed : null;
  } catch (error) {
    console.warn('Date parsing error:', error);
    return null;
  }
}

/**
 * Format a date for display
 * 
 * @param {string|Date} dateInput - Date to format
 * @param {string} formatString - date-fns format string (default: 'dd MMM yyyy')
 * @returns {string} - Formatted date string or 'Invalid Date'
 * 
 * @example
 * formatDate('2024-01-15') // Returns '15 Jan 2024'
 * formatDate('2024-01-15', 'dd/MM/yyyy') // Returns '15/01/2024'
 */
export function formatDate(dateInput, formatString = DATE_FORMATS.DISPLAY) {
  const date = parseDate(dateInput);
  if (!date) return 'Invalid Date';
  
  try {
    return format(date, formatString);
  } catch (error) {
    console.warn('Date formatting error:', error);
    return 'Invalid Date';
  }
}

/**
 * Format a date to ISO string (YYYY-MM-DD)
 * 
 * @param {Date} date - Date object
 * @returns {string} - ISO date string
 */
export function toISODateString(date) {
  if (!date || !isValid(date)) return '';
  return format(date, DATE_FORMATS.ISO);
}

/**
 * Get today's date at start of day (midnight)
 * This ensures consistent comparisons regardless of time
 * 
 * @returns {Date} - Today at 00:00:00
 */
export function getToday() {
  return startOfDay(new Date());
}

/**
 * Calculate due date from invoice date and payment terms
 * 
 * @param {string|Date} invoiceDate - The invoice date
 * @param {number} paymentTerms - Number of days until payment is due
 * @returns {string|null} - ISO date string for due date, or null if invalid
 * 
 * @example
 * calculateDueDate('2024-01-15', 30) // Returns '2024-02-14'
 */
export function calculateDueDate(invoiceDate, paymentTerms) {
  const parsedDate = parseDate(invoiceDate);
  
  if (!parsedDate) {
    console.warn('Invalid invoice date for due date calculation');
    return null;
  }
  
  if (typeof paymentTerms !== 'number' || paymentTerms < 0) {
    console.warn('Invalid payment terms:', paymentTerms);
    return null;
  }
  
  const dueDate = addDays(parsedDate, paymentTerms);
  return toISODateString(dueDate);
}

/**
 * Calculate days until due date (for pending invoices)
 * 
 * @param {string|Date} dueDate - The due date
 * @returns {number} - Positive number of days until due
 * 
 * @example
 * // If today is Jan 10
 * getDaysUntilDue('2024-01-15') // Returns 5
 */
export function getDaysUntilDue(dueDate) {
  const parsedDue = parseDate(dueDate);
  if (!parsedDue) return 0;
  
  const today = getToday();
  const dueDateNormalized = startOfDay(parsedDue);
  
  return differenceInDays(dueDateNormalized, today);
}

/**
 * Calculate days overdue (for overdue invoices)
 * 
 * @param {string|Date} dueDate - The due date
 * @returns {number} - Positive number of days overdue
 * 
 * @example
 * // If today is Jan 20
 * getDaysOverdue('2024-01-15') // Returns 5
 */
export function getDaysOverdue(dueDate) {
  const parsedDue = parseDate(dueDate);
  if (!parsedDue) return 0;
  
  const today = getToday();
  const dueDateNormalized = startOfDay(parsedDue);
  
  // Only return positive value if actually overdue
  const diff = differenceInDays(today, dueDateNormalized);
  return diff > 0 ? diff : 0;
}

/**
 * Calculate payment delay in days
 * Positive = paid late, Negative = paid early, Zero = on time
 * 
 * @param {string|Date} dueDate - The due date
 * @param {string|Date} paymentDate - The actual payment date
 * @returns {number} - Days difference (positive = late, negative = early)
 * 
 * @example
 * getPaymentDelay('2024-01-15', '2024-01-10') // Returns -5 (paid 5 days early)
 * getPaymentDelay('2024-01-15', '2024-01-20') // Returns 5 (paid 5 days late)
 */
export function getPaymentDelay(dueDate, paymentDate) {
  const parsedDue = parseDate(dueDate);
  const parsedPayment = parseDate(paymentDate);
  
  if (!parsedDue || !parsedPayment) return 0;
  
  const dueNormalized = startOfDay(parsedDue);
  const paymentNormalized = startOfDay(parsedPayment);
  
  return differenceInDays(paymentNormalized, dueNormalized);
}

/**
 * Check if a date is overdue (past due date and not paid)
 * 
 * @param {string|Date} dueDate - The due date to check
 * @returns {boolean} - True if the due date is in the past
 */
export function isOverdue(dueDate) {
  const parsedDue = parseDate(dueDate);
  if (!parsedDue) return false;
  
  const today = getToday();
  const dueDateNormalized = startOfDay(parsedDue);
  
  return isBefore(dueDateNormalized, today);
}

/**
 * Check if a date is in the future
 * 
 * @param {string|Date} dateInput - The date to check
 * @returns {boolean} - True if the date is after today
 */
export function isFutureDate(dateInput) {
  const parsed = parseDate(dateInput);
  if (!parsed) return false;
  
  const today = getToday();
  return isAfter(startOfDay(parsed), today);
}

/**
 * Check if a payment date is in the current month
 * 
 * @param {string|Date} paymentDate - The payment date to check
 * @returns {boolean} - True if payment is in current calendar month
 */
export function isPaymentThisMonth(paymentDate) {
  const parsed = parseDate(paymentDate);
  if (!parsed) return false;
  
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  
  return isWithinInterval(parsed, { start: monthStart, end: monthEnd });
}

/**
 * Validate that due date is after invoice date
 * 
 * @param {string|Date} invoiceDate - The invoice date
 * @param {string|Date} dueDate - The due date
 * @returns {boolean} - True if valid (due date >= invoice date)
 */
export function isValidDateRange(invoiceDate, dueDate) {
  const parsedInvoice = parseDate(invoiceDate);
  const parsedDue = parseDate(dueDate);
  
  if (!parsedInvoice || !parsedDue) return false;
  
  return !isBefore(startOfDay(parsedDue), startOfDay(parsedInvoice));
}

/**
 * Get the start of current month as ISO string
 * 
 * @returns {string} - ISO date string for first day of current month
 */
export function getCurrentMonthStart() {
  return toISODateString(startOfMonth(new Date()));
}

/**
 * Get the end of current month as ISO string
 * 
 * @returns {string} - ISO date string for last day of current month
 */
export function getCurrentMonthEnd() {
  return toISODateString(endOfMonth(new Date()));
}

/**
 * Validate an invoice's date fields
 * 
 * @param {Object} invoice - Invoice object with date fields
 * @returns {Object} - Validation result { isValid, errors }
 */
export function validateInvoiceDates(invoice) {
  const errors = [];
  
  const invoiceDate = parseDate(invoice.invoiceDate);
  const dueDate = parseDate(invoice.dueDate);
  
  if (!invoiceDate) {
    errors.push('Invalid invoice date');
  }
  
  if (!dueDate) {
    errors.push('Invalid due date');
  }
  
  if (invoiceDate && dueDate && !isValidDateRange(invoice.invoiceDate, invoice.dueDate)) {
    errors.push('Due date cannot be before invoice date');
  }
  
  if (invoiceDate && isFutureDate(invoice.invoiceDate)) {
    errors.push('Invoice date cannot be in the future');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
