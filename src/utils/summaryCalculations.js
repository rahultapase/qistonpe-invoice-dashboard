/**
 * Summary Calculations
 * 
 * Functions for calculating the four summary card metrics:
 * 1. Total Outstanding (Pending + Overdue amounts)
 * 2. Total Overdue (Overdue amounts only)
 * 3. Total Paid This Month (Paid in current calendar month)
 * 4. Average Payment Delay (Average days early/late for paid invoices)
 */

import { isPaymentThisMonth, getPaymentDelay, parseDate } from './dateUtils';
import { calculateStatus } from './invoiceUtils';
import { INVOICE_STATUS } from '../constants/invoiceConstants';

/**
 * Calculate Total Outstanding Amount
 * Sum of all pending + overdue invoice amounts
 * 
 * @param {Array} invoices - Array of invoice objects
 * @returns {number} - Total outstanding amount
 * 
 * @example
 * calculateTotalOutstanding([
 *   { amount: 10000, status: 'pending' },
 *   { amount: 20000, status: 'overdue' },
 *   { amount: 15000, status: 'paid' }
 * ]) // Returns 30000
 */
export function calculateTotalOutstanding(invoices) {
  if (!Array.isArray(invoices) || invoices.length === 0) {
    return 0;
  }
  
  return invoices.reduce((total, invoice) => {
    const status = invoice.status || calculateStatus(invoice);
    
    // Include both pending and overdue
    if (status === INVOICE_STATUS.PENDING || status === INVOICE_STATUS.OVERDUE) {
      const amount = Number(invoice.amount) || 0;
      return total + amount;
    }
    
    return total;
  }, 0);
}

/**
 * Calculate Total Overdue Amount
 * Sum of only overdue invoice amounts
 * 
 * @param {Array} invoices - Array of invoice objects
 * @returns {number} - Total overdue amount
 * 
 * @example
 * calculateTotalOverdue([
 *   { amount: 10000, status: 'pending' },
 *   { amount: 20000, status: 'overdue' },
 *   { amount: 5000, status: 'overdue' }
 * ]) // Returns 25000
 */
export function calculateTotalOverdue(invoices) {
  if (!Array.isArray(invoices) || invoices.length === 0) {
    return 0;
  }
  
  return invoices.reduce((total, invoice) => {
    const status = invoice.status || calculateStatus(invoice);
    
    if (status === INVOICE_STATUS.OVERDUE) {
      const amount = Number(invoice.amount) || 0;
      return total + amount;
    }
    
    return total;
  }, 0);
}

/**
 * Calculate Total Paid This Month
 * Sum of invoice amounts where paymentDate is in current calendar month
 * 
 * @param {Array} invoices - Array of invoice objects
 * @returns {number} - Total paid this month
 * 
 * @example
 * // If current month is January 2024
 * calculateTotalPaidThisMonth([
 *   { amount: 10000, paymentDate: '2024-01-15' },
 *   { amount: 20000, paymentDate: '2024-01-20' },
 *   { amount: 15000, paymentDate: '2023-12-15' }
 * ]) // Returns 30000
 */
export function calculateTotalPaidThisMonth(invoices) {
  if (!Array.isArray(invoices) || invoices.length === 0) {
    return 0;
  }
  
  return invoices.reduce((total, invoice) => {
    // Only count if invoice has a payment date and it's this month
    if (invoice.paymentDate && isPaymentThisMonth(invoice.paymentDate)) {
      const amount = Number(invoice.amount) || 0;
      return total + amount;
    }
    
    return total;
  }, 0);
}

/**
 * Calculate Average Payment Delay
 * 
 * Formula: sum(paymentDate - dueDate) / count(paid invoices)
 * 
 * Result interpretation:
 * - Positive value = average days late
 * - Negative value = average days early
 * - Zero = paid exactly on time (average)
 * - null = no paid invoices (division by zero case)
 * 
 * @param {Array} invoices - Array of invoice objects
 * @returns {number|null} - Average delay in days, or null if no paid invoices
 * 
 * @example
 * calculateAveragePaymentDelay([
 *   { dueDate: '2024-01-15', paymentDate: '2024-01-12' }, // -3 (early)
 *   { dueDate: '2024-01-15', paymentDate: '2024-01-20' }, // +5 (late)
 * ]) // Returns 1 (Math.round((-3 + 5) / 2))
 */
export function calculateAveragePaymentDelay(invoices) {
  if (!Array.isArray(invoices) || invoices.length === 0) {
    return null;
  }
  
  // Filter to only paid invoices with valid dates
  const paidInvoices = invoices.filter(invoice => {
    const status = invoice.status || calculateStatus(invoice);
    return (
      status === INVOICE_STATUS.PAID &&
      invoice.paymentDate &&
      invoice.dueDate &&
      parseDate(invoice.paymentDate) &&
      parseDate(invoice.dueDate)
    );
  });
  
  // Handle division by zero
  if (paidInvoices.length === 0) {
    return null;
  }
  
  // Calculate sum of all delays
  const totalDelay = paidInvoices.reduce((sum, invoice) => {
    const delay = getPaymentDelay(invoice.dueDate, invoice.paymentDate);
    return sum + delay;
  }, 0);
  
  // Calculate and round average
  const average = totalDelay / paidInvoices.length;
  return Math.round(average);
}

/**
 * Calculate all summary statistics at once
 * This is more efficient than calling each function separately
 * when you need all four values.
 * 
 * @param {Array} invoices - Array of invoice objects
 * @returns {Object} - All four summary statistics
 * 
 * @example
 * calculateAllSummaryStats(invoices)
 * // Returns:
 * // {
 * //   totalOutstanding: 150000,
 * //   totalOverdue: 50000,
 * //   totalPaidThisMonth: 75000,
 * //   averagePaymentDelay: 2
 * // }
 */
export function calculateAllSummaryStats(invoices) {
  if (!Array.isArray(invoices) || invoices.length === 0) {
    return {
      totalOutstanding: 0,
      totalOverdue: 0,
      totalPaidThisMonth: 0,
      averagePaymentDelay: null
    };
  }
  
  let totalOutstanding = 0;
  let totalOverdue = 0;
  let totalPaidThisMonth = 0;
  let paymentDelaySum = 0;
  let paidInvoiceCount = 0;
  
  // Single pass through invoices for efficiency
  invoices.forEach(invoice => {
    const status = invoice.status || calculateStatus(invoice);
    const amount = Number(invoice.amount) || 0;
    
    switch (status) {
      case INVOICE_STATUS.PENDING:
        totalOutstanding += amount;
        break;
        
      case INVOICE_STATUS.OVERDUE:
        totalOutstanding += amount;
        totalOverdue += amount;
        break;
        
      case INVOICE_STATUS.PAID:
        // Check if paid this month
        if (invoice.paymentDate && isPaymentThisMonth(invoice.paymentDate)) {
          totalPaidThisMonth += amount;
        }
        
        // Calculate payment delay if dates are valid
        if (invoice.paymentDate && invoice.dueDate) {
          const delay = getPaymentDelay(invoice.dueDate, invoice.paymentDate);
          paymentDelaySum += delay;
          paidInvoiceCount++;
        }
        break;
    }
  });
  
  // Calculate average payment delay
  const averagePaymentDelay = paidInvoiceCount > 0
    ? Math.round(paymentDelaySum / paidInvoiceCount)
    : null;
  
  return {
    totalOutstanding,
    totalOverdue,
    totalPaidThisMonth,
    averagePaymentDelay
  };
}

/**
 * Format average payment delay for display
 * 
 * @param {number|null} averageDelay - Average delay in days
 * @returns {Object} - { text: string, colorClass: string, isPositive: boolean }
 * 
 * @example
 * formatAverageDelay(-3) // { text: '3 days early', colorClass: 'text-green-600', isPositive: true }
 * formatAverageDelay(5) // { text: '5 days late', colorClass: 'text-red-600', isPositive: false }
 * formatAverageDelay(0) // { text: 'On time', colorClass: 'text-green-600', isPositive: true }
 * formatAverageDelay(null) // { text: 'N/A', colorClass: 'text-gray-500', isPositive: null }
 */
export function formatAverageDelay(averageDelay) {
  // Handle no paid invoices case
  if (averageDelay === null || averageDelay === undefined) {
    return {
      text: 'N/A',
      colorClass: 'text-gray-500',
      isPositive: null
    };
  }
  
  // Paid exactly on time
  if (averageDelay === 0) {
    return {
      text: 'On time',
      colorClass: 'text-green-600',
      isPositive: true
    };
  }
  
  // Paid early (negative delay)
  if (averageDelay < 0) {
    return {
      text: `${Math.abs(averageDelay)} day${Math.abs(averageDelay) !== 1 ? 's' : ''} early`,
      colorClass: 'text-green-600',
      isPositive: true
    };
  }
  
  // Paid late (positive delay)
  return {
    text: `${averageDelay} day${averageDelay !== 1 ? 's' : ''} late`,
    colorClass: 'text-red-600',
    isPositive: false
  };
}

/**
 * Get trend indicator for summary card
 * 
 * @param {number} currentValue - Current metric value
 * @param {number} previousValue - Previous metric value (e.g., last month)
 * @returns {Object} - { direction: 'up'|'down'|'same', percentage: number }
 */
export function calculateTrend(currentValue, previousValue) {
  if (previousValue === 0 || previousValue === null || previousValue === undefined) {
    return { direction: 'same', percentage: 0 };
  }
  
  const change = currentValue - previousValue;
  const percentage = Math.round((change / previousValue) * 100);
  
  if (percentage > 0) {
    return { direction: 'up', percentage };
  } else if (percentage < 0) {
    return { direction: 'down', percentage: Math.abs(percentage) };
  }
  
  return { direction: 'same', percentage: 0 };
}
