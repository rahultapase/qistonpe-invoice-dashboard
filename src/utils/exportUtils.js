/**
 * CSV Export Utility
 * 
 * Functions for exporting invoice data to CSV format.
 * Handles proper escaping and formatting for Excel compatibility.
 */

import { formatDate } from './dateUtils';
import { calculateStatus, formatCurrencyINR } from './invoiceUtils';

/**
 * Escape a value for CSV (handle commas, quotes, newlines)
 * 
 * @param {any} value - Value to escape
 * @returns {string} - Escaped CSV value
 */
function escapeCSVValue(value) {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // If contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Convert invoices array to CSV string
 * 
 * @param {Array} invoices - Array of invoice objects
 * @param {Object} options - Export options
 * @param {boolean} options.includeStatus - Include calculated status column
 * @param {boolean} options.formatCurrency - Format amounts as currency strings
 * @returns {string} - CSV formatted string
 */
export function invoicesToCSV(invoices, options = {}) {
  const { includeStatus = true, formatCurrency = false } = options;
  
  if (!invoices || invoices.length === 0) {
    return '';
  }

  // Define headers
  const headers = [
    'Invoice ID',
    'Customer Name',
    'Amount',
    'Invoice Date',
    'Due Date',
    'Payment Terms (Days)',
    ...(includeStatus ? ['Status'] : []),
    'Paid',
    'Payment Date'
  ];

  // Create header row
  const headerRow = headers.map(escapeCSVValue).join(',');

  // Create data rows
  const dataRows = invoices.map(invoice => {
    const status = calculateStatus(invoice);
    const isPaid = status === 'paid'; // Determine paid status from calculated status
    const amount = formatCurrency 
      ? formatCurrencyINR(invoice.amount)
      : invoice.amount;
    
    const row = [
      invoice.id,
      invoice.customerName,
      amount,
      formatDate(invoice.invoiceDate),
      formatDate(invoice.dueDate),
      invoice.paymentTerms,
      ...(includeStatus ? [status.charAt(0).toUpperCase() + status.slice(1)] : []),
      isPaid ? 'Yes' : 'No',
      invoice.paymentDate ? formatDate(invoice.paymentDate) : ''
    ];

    return row.map(escapeCSVValue).join(',');
  });

  // Combine header and data rows
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Download data as a CSV file
 * 
 * @param {string} csvContent - CSV formatted string
 * @param {string} filename - Name for the downloaded file
 */
export function downloadCSV(csvContent, filename = 'invoices.csv') {
  // Add BOM for Excel UTF-8 compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Export invoices to CSV file
 * 
 * @param {Array} invoices - Array of invoice objects to export
 * @param {string} filename - Optional custom filename
 * @param {Object} options - Export options
 * @returns {boolean} - True if export was successful
 */
export function exportInvoicesToCSV(invoices, filename, options = {}) {
  try {
    if (!invoices || invoices.length === 0) {
      console.warn('No invoices to export');
      return false;
    }

    const csvContent = invoicesToCSV(invoices, options);
    
    // Generate filename with date if not provided
    const defaultFilename = `invoices_${new Date().toISOString().split('T')[0]}.csv`;
    
    downloadCSV(csvContent, filename || defaultFilename);
    
    return true;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return false;
  }
}

/**
 * Get export summary for user confirmation
 * 
 * @param {Array} invoices - Invoices to be exported
 * @returns {Object} - Summary of what will be exported
 */
export function getExportSummary(invoices) {
  if (!invoices || invoices.length === 0) {
    return {
      total: 0,
      paid: 0,
      pending: 0,
      overdue: 0
    };
  }

  return invoices.reduce((acc, invoice) => {
    const status = calculateStatus(invoice);
    acc.total++;
    acc[status]++;
    return acc;
  }, { total: 0, paid: 0, pending: 0, overdue: 0 });
}
