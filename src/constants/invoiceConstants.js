/**
 * Invoice Constants
 * 
 * Central location for all invoice-related constants, enums, and configuration.
 * This ensures consistency across the application and makes updates easier.
 */

/**
 * Invoice Status Types
 * Used for filtering and display
 */
export const INVOICE_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  OVERDUE: 'overdue'
};

/**
 * Filter options for status filter buttons
 * Includes 'all' for showing all invoices
 */
export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: INVOICE_STATUS.PAID, label: 'Paid' },
  { value: INVOICE_STATUS.PENDING, label: 'Pending' },
  { value: INVOICE_STATUS.OVERDUE, label: 'Overdue' }
];

/**
 * Payment Terms Options (in days)
 * Used in the Add Invoice form dropdown
 */
export const PAYMENT_TERMS_OPTIONS = [
  { value: 7, label: '7 days' },
  { value: 15, label: '15 days' },
  { value: 30, label: '30 days' },
  { value: 45, label: '45 days' },
  { value: 60, label: '60 days' }
];

/**
 * Sort Options for Invoice List
 * Each option includes field, direction, and display label
 */
export const SORT_OPTIONS = [
  { value: 'amount-desc', field: 'amount', direction: 'desc', label: 'Amount (High to Low)' },
  { value: 'amount-asc', field: 'amount', direction: 'asc', label: 'Amount (Low to High)' },
  { value: 'invoiceDate-desc', field: 'invoiceDate', direction: 'desc', label: 'Invoice Date (Newest)' },
  { value: 'invoiceDate-asc', field: 'invoiceDate', direction: 'asc', label: 'Invoice Date (Oldest)' },
  { value: 'dueDate-asc', field: 'dueDate', direction: 'asc', label: 'Due Date (Nearest)' },
  { value: 'dueDate-desc', field: 'dueDate', direction: 'desc', label: 'Due Date (Farthest)' }
];

/**
 * Pagination Configuration
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50]
};

/**
 * LocalStorage Keys
 */
export const STORAGE_KEYS = {
  INVOICES: 'qistonpe_invoices',
  THEME: 'qistonpe_theme',
  PAGE_SIZE: 'qistonpe_page_size'
};

/**
 * Validation Constraints
 */
export const VALIDATION = {
  CUSTOMER_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100
  },
  AMOUNT: {
    MIN: 1,
    MAX: 10000000 // 1 Crore
  }
};

/**
 * Date Formats used in the application
 * Using date-fns format strings
 */
export const DATE_FORMATS = {
  DISPLAY: 'dd MMM yyyy',      // 15 Jan 2024
  DISPLAY_SHORT: 'dd/MM/yyyy', // 15/01/2024
  ISO: 'yyyy-MM-dd',           // 2024-01-15
  MONTH_YEAR: 'MMM yyyy'       // Jan 2024
};

/**
 * Currency Configuration
 */
export const CURRENCY = {
  CODE: 'INR',
  SYMBOL: '₹',
  LOCALE: 'en-IN'
};

/**
 * Status Colors for Tailwind CSS classes
 * These map to the classes defined in index.css
 */
export const STATUS_COLORS = {
  [INVOICE_STATUS.PAID]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    badge: 'badge-paid'
  },
  [INVOICE_STATUS.PENDING]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    badge: 'badge-pending'
  },
  [INVOICE_STATUS.OVERDUE]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    badge: 'badge-overdue'
  }
};

/**
 * Days Display Colors
 * Colors for the "Days" column based on status
 */
export const DAYS_COLORS = {
  DUE_SOON: 'text-blue-600',     // Pending: "Due in X days"
  OVERDUE: 'text-red-600',       // Overdue: "Overdue by X days"
  PAID_EARLY: 'text-green-600',  // Paid early
  PAID_LATE: 'text-orange-600',  // Paid late
  PAID_ON_TIME: 'text-green-600' // Paid on time
};

/**
 * ID Generation Configuration
 */
export const ID_CONFIG = {
  PREFIX: 'INV-',
  PAD_LENGTH: 3 // INV-001, INV-002, etc.
};
