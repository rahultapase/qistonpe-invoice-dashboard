import { useMemo } from 'react';
import { 
  calculateAllSummaryStats, 
  formatAverageDelay 
} from '../utils/summaryCalculations';
import { getStatusCounts, formatCurrencyINR } from '../utils/invoiceUtils';

/**
 * useSummaryStats Hook
 * 
 * Calculates all 4 summary card metrics from the provided invoices.
 * All calculations are memoized for performance.
 * 
 * Metrics calculated:
 * 1. Total Outstanding (Pending + Overdue amounts)
 * 2. Total Overdue (Overdue amounts only)
 * 3. Total Paid This Month (Payments in current calendar month)
 * 4. Average Payment Delay (Days early/late for paid invoices)
 * 
 * @param {Array} invoices - Array of invoice objects
 * @returns {Object} - Summary statistics and formatted values
 * 
 * @example
 * const {
 *   totalOutstanding,
 *   totalOverdue,
 *   totalPaidThisMonth,
 *   averagePaymentDelay,
 *   formattedStats,
 *   statusCounts
 * } = useSummaryStats(invoices);
 */
function useSummaryStats(invoices = []) {
  /**
   * Calculate raw statistics
   * Memoized to prevent recalculation on every render
   * Uses single-pass calculation for efficiency
   */
  const rawStats = useMemo(() => {
    return calculateAllSummaryStats(invoices);
  }, [invoices]);

  /**
   * Format average delay for display
   * Includes text, color class, and positive/negative indicator
   */
  const averageDelayDisplay = useMemo(() => {
    return formatAverageDelay(rawStats.averagePaymentDelay);
  }, [rawStats.averagePaymentDelay]);

  /**
   * Get status counts for display
   * Useful for showing "X paid, Y pending, Z overdue"
   */
  const statusCounts = useMemo(() => {
    return getStatusCounts(invoices);
  }, [invoices]);

  /**
   * Format all currency values for display
   * Pre-formatted to avoid repeated formatting in components
   */
  const formattedStats = useMemo(() => {
    return {
      totalOutstanding: formatCurrencyINR(rawStats.totalOutstanding),
      totalOverdue: formatCurrencyINR(rawStats.totalOverdue),
      totalPaidThisMonth: formatCurrencyINR(rawStats.totalPaidThisMonth),
      averagePaymentDelay: averageDelayDisplay.text
    };
  }, [rawStats, averageDelayDisplay]);

  /**
   * Determine trend/status indicators for each metric
   * Used for color coding and icons in summary cards
   */
  const indicators = useMemo(() => {
    return {
      // Outstanding - higher is concerning
      outstanding: {
        status: rawStats.totalOutstanding > 0 ? 'warning' : 'neutral',
        colorClass: rawStats.totalOutstanding > 0 ? 'text-blue-600' : 'text-gray-600'
      },
      // Overdue - any overdue is bad
      overdue: {
        status: rawStats.totalOverdue > 0 ? 'danger' : 'success',
        colorClass: rawStats.totalOverdue > 0 ? 'text-red-600' : 'text-green-600'
      },
      // Paid this month - higher is good
      paidThisMonth: {
        status: rawStats.totalPaidThisMonth > 0 ? 'success' : 'neutral',
        colorClass: rawStats.totalPaidThisMonth > 0 ? 'text-green-600' : 'text-gray-600'
      },
      // Average delay - negative (early) is good, positive (late) is bad
      averageDelay: {
        status: averageDelayDisplay.isPositive === null 
          ? 'neutral' 
          : averageDelayDisplay.isPositive 
            ? 'success' 
            : 'danger',
        colorClass: averageDelayDisplay.colorClass,
        isPositive: averageDelayDisplay.isPositive
      }
    };
  }, [rawStats, averageDelayDisplay]);

  /**
   * Summary cards data ready for rendering
   * Each card has all the info needed for SummaryCard component
   */
  const summaryCards = useMemo(() => {
    return [
      {
        id: 'outstanding',
        title: 'Total Outstanding',
        value: formattedStats.totalOutstanding,
        rawValue: rawStats.totalOutstanding,
        description: 'Pending + Overdue invoices',
        icon: 'clock',
        colorClass: 'text-blue-600',
        bgClass: 'bg-blue-50',
        borderClass: 'border-blue-200'
      },
      {
        id: 'overdue',
        title: 'Total Overdue',
        value: formattedStats.totalOverdue,
        rawValue: rawStats.totalOverdue,
        description: `${statusCounts.overdue} overdue invoice${statusCounts.overdue !== 1 ? 's' : ''}`,
        icon: 'alert-triangle',
        colorClass: 'text-red-600',
        bgClass: 'bg-red-50',
        borderClass: 'border-red-200'
      },
      {
        id: 'paidThisMonth',
        title: 'Paid This Month',
        value: formattedStats.totalPaidThisMonth,
        rawValue: rawStats.totalPaidThisMonth,
        description: 'Received this month',
        icon: 'check-circle',
        colorClass: 'text-green-600',
        bgClass: 'bg-green-50',
        borderClass: 'border-green-200'
      },
      {
        id: 'averageDelay',
        title: 'Avg. Payment Delay',
        value: formattedStats.averagePaymentDelay,
        rawValue: rawStats.averagePaymentDelay,
        description: `Based on ${statusCounts.paid} paid invoice${statusCounts.paid !== 1 ? 's' : ''}`,
        icon: rawStats.averagePaymentDelay === null 
          ? 'minus' 
          : rawStats.averagePaymentDelay <= 0 
            ? 'trending-up' 
            : 'trending-down',
        colorClass: indicators.averageDelay.colorClass,
        bgClass: rawStats.averagePaymentDelay === null
          ? 'bg-gray-50'
          : rawStats.averagePaymentDelay <= 0 
            ? 'bg-green-50' 
            : 'bg-red-50',
        borderClass: rawStats.averagePaymentDelay === null
          ? 'border-gray-200'
          : rawStats.averagePaymentDelay <= 0 
            ? 'border-green-200' 
            : 'border-red-200'
      }
    ];
  }, [formattedStats, rawStats, statusCounts, indicators]);

  return {
    // Raw values (for calculations)
    totalOutstanding: rawStats.totalOutstanding,
    totalOverdue: rawStats.totalOverdue,
    totalPaidThisMonth: rawStats.totalPaidThisMonth,
    averagePaymentDelay: rawStats.averagePaymentDelay,
    
    // Formatted values (for display)
    formattedStats,
    
    // Display helpers
    averageDelayDisplay,
    indicators,
    
    // Status counts
    statusCounts,
    
    // Ready-to-render card data
    summaryCards,
    
    // Convenience checks
    hasOutstanding: rawStats.totalOutstanding > 0,
    hasOverdue: rawStats.totalOverdue > 0,
    hasPaidThisMonth: rawStats.totalPaidThisMonth > 0,
    hasPaidInvoices: statusCounts.paid > 0
  };
}

export default useSummaryStats;
