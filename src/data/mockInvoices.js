/**
 * Mock Invoice Data
 * 
 * Sample invoices for initial load and testing.
 * Includes a mix of:
 * - Paid invoices (with paymentDate)
 * - Pending invoices (dueDate in future, no paymentDate)
 * - Overdue invoices (dueDate in past, no paymentDate)
 * - Paid early (paymentDate < dueDate)
 * - Paid late (paymentDate > dueDate)
 * 
 * Dates are designed to work with current date (January 2026)
 * to properly test "Total Paid This Month" and other calculations.
 */

/**
 * Generate mock invoices with dates relative to "today"
 * This ensures the mock data always makes sense regardless of when it's loaded
 */
function generateMockInvoices() {
  // Use current date context
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  // Helper to format date as ISO string
  const toISO = (date) => date.toISOString().split('T')[0];
  
  // Helper to create a date relative to today
  const daysAgo = (days) => {
    const d = new Date(today);
    d.setDate(d.getDate() - days);
    return toISO(d);
  };
  
  const daysFromNow = (days) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return toISO(d);
  };
  
  // First day of current month
  const thisMonthStart = new Date(currentYear, currentMonth, 1);
  const thisMonth = (day) => {
    const d = new Date(currentYear, currentMonth, day);
    return toISO(d);
  };
  
  // Last month
  const lastMonth = (day) => {
    const d = new Date(currentYear, currentMonth - 1, day);
    return toISO(d);
  };

  return [
    // ============================================
    // PAID INVOICES (5 total)
    // ============================================
    
    // INV-001: Paid 3 days EARLY (for testing negative average delay)
    // Contributes -3 to average payment delay
    {
      id: 'INV-001',
      customerName: 'Early Payer Technologies Pvt Ltd',
      amount: 50000,
      invoiceDate: daysAgo(40),
      paymentTerms: 30,
      dueDate: daysAgo(10),
      paymentDate: daysAgo(13), // Paid 3 days before due date
      status: 'paid'
    },
    
    // INV-002: Paid 5 days LATE (for testing positive average delay)
    // Contributes +5 to average payment delay
    {
      id: 'INV-002',
      customerName: 'Late Payer Industries',
      amount: 75000,
      invoiceDate: daysAgo(45),
      paymentTerms: 30,
      dueDate: daysAgo(15),
      paymentDate: daysAgo(10), // Paid 5 days after due date
      status: 'paid'
    },
    
    // INV-003: Paid exactly ON TIME
    // Contributes 0 to average payment delay
    {
      id: 'INV-003',
      customerName: 'On Time Enterprises',
      amount: 125000,
      invoiceDate: daysAgo(35),
      paymentTerms: 30,
      dueDate: daysAgo(5),
      paymentDate: daysAgo(5), // Paid exactly on due date
      status: 'paid'
    },
    
    // INV-004: Paid THIS MONTH (recent payment - for "Total Paid This Month")
    // Paid 7 days early
    {
      id: 'INV-004',
      customerName: 'Quick Pay Solutions',
      amount: 45000,
      invoiceDate: thisMonth(1),
      paymentTerms: 15,
      dueDate: thisMonth(16),
      paymentDate: thisMonth(9), // Paid 7 days early, this month
      status: 'paid'
    },
    
    // INV-005: Paid THIS MONTH (for "Total Paid This Month")
    // Paid 2 days late
    {
      id: 'INV-005',
      customerName: 'Reliable Manufacturing Co',
      amount: 88000,
      invoiceDate: lastMonth(20),
      paymentTerms: 15,
      dueDate: thisMonth(5),
      paymentDate: thisMonth(7), // Paid 2 days late, this month
      status: 'paid'
    },

    // ============================================
    // PENDING INVOICES (4 total) - Due in future
    // ============================================
    
    // INV-006: Due in 5 days
    {
      id: 'INV-006',
      customerName: 'Acme Manufacturing Ltd',
      amount: 95000,
      invoiceDate: daysAgo(25),
      paymentTerms: 30,
      dueDate: daysFromNow(5),
      paymentDate: null,
      status: 'pending'
    },
    
    // INV-007: Due in 15 days
    {
      id: 'INV-007',
      customerName: 'Global Trade Partners',
      amount: 150000,
      invoiceDate: daysAgo(15),
      paymentTerms: 30,
      dueDate: daysFromNow(15),
      paymentDate: null,
      status: 'pending'
    },
    
    // INV-008: Due in 25 days
    {
      id: 'INV-008',
      customerName: 'TechStar Innovations',
      amount: 220000,
      invoiceDate: daysAgo(5),
      paymentTerms: 30,
      dueDate: daysFromNow(25),
      paymentDate: null,
      status: 'pending'
    },
    
    // INV-009: Due TODAY (edge case)
    {
      id: 'INV-009',
      customerName: 'Today Due Corp',
      amount: 35000,
      invoiceDate: daysAgo(30),
      paymentTerms: 30,
      dueDate: toISO(today),
      paymentDate: null,
      status: 'pending'
    },

    // ============================================
    // OVERDUE INVOICES (4 total) - Past due date
    // ============================================
    
    // INV-010: Overdue by 3 days
    {
      id: 'INV-010',
      customerName: 'Delayed Payments Inc',
      amount: 67000,
      invoiceDate: daysAgo(33),
      paymentTerms: 30,
      dueDate: daysAgo(3),
      paymentDate: null,
      status: 'overdue'
    },
    
    // INV-011: Overdue by 10 days
    {
      id: 'INV-011',
      customerName: 'Slow Payer Industries',
      amount: 180000,
      invoiceDate: daysAgo(40),
      paymentTerms: 30,
      dueDate: daysAgo(10),
      paymentDate: null,
      status: 'overdue'
    },
    
    // INV-012: Overdue by 20 days (high value)
    {
      id: 'INV-012',
      customerName: 'Credit Risk Associates',
      amount: 320000,
      invoiceDate: daysAgo(50),
      paymentTerms: 30,
      dueDate: daysAgo(20),
      paymentDate: null,
      status: 'overdue'
    },
    
    // INV-013: Overdue by 45 days (long overdue)
    {
      id: 'INV-013',
      customerName: 'Troubled Finances Ltd',
      amount: 95000,
      invoiceDate: daysAgo(75),
      paymentTerms: 30,
      dueDate: daysAgo(45),
      paymentDate: null,
      status: 'overdue'
    },

    // ============================================
    // ADDITIONAL INVOICES (for variety)
    // ============================================
    
    // INV-014: Small amount, paid last month
    {
      id: 'INV-014',
      customerName: 'Small Business Traders',
      amount: 12500,
      invoiceDate: lastMonth(1),
      paymentTerms: 15,
      dueDate: lastMonth(16),
      paymentDate: lastMonth(14), // Paid 2 days early, last month
      status: 'paid'
    },
    
    // INV-015: Large amount, pending with 60-day terms
    {
      id: 'INV-015',
      customerName: 'Enterprise Solutions Pvt Ltd',
      amount: 450000,
      invoiceDate: daysAgo(10),
      paymentTerms: 60,
      dueDate: daysFromNow(50),
      paymentDate: null,
      status: 'pending'
    }
  ];
}

// Export the mock invoices
export const mockInvoices = generateMockInvoices();

/**
 * Get summary statistics for mock data verification
 * Useful for testing calculations
 */
export function getMockDataSummary() {
  const invoices = mockInvoices;
  
  const paid = invoices.filter(i => i.status === 'paid');
  const pending = invoices.filter(i => i.status === 'pending');
  const overdue = invoices.filter(i => i.status === 'overdue');
  
  return {
    total: invoices.length,
    paidCount: paid.length,
    pendingCount: pending.length,
    overdueCount: overdue.length,
    totalAmount: invoices.reduce((sum, i) => sum + i.amount, 0),
    paidAmount: paid.reduce((sum, i) => sum + i.amount, 0),
    pendingAmount: pending.reduce((sum, i) => sum + i.amount, 0),
    overdueAmount: overdue.reduce((sum, i) => sum + i.amount, 0)
  };
}

/**
 * Generate large dataset for performance testing
 * 
 * @param {number} count - Number of invoices to generate
 * @returns {Array} - Array of generated invoices
 */
export function generateLargeDataset(count = 500) {
  const companies = [
    'Acme Corp', 'TechStart', 'Global Industries', 'Prime Solutions',
    'NextGen Systems', 'Alpha Manufacturing', 'Beta Traders', 'Gamma Exports',
    'Delta Imports', 'Sigma Electronics', 'Omega Textiles', 'Zenith Pharma',
    'Apex Constructions', 'Vertex Logistics', 'Pioneer Chemicals'
  ];
  
  const suffixes = ['Ltd', 'Pvt Ltd', 'Inc', 'Corp', 'LLP', 'Co', 'Enterprises'];
  
  const invoices = [...mockInvoices]; // Start with existing mock data
  const today = new Date();
  
  for (let i = 16; i <= count; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const amount = Math.floor(Math.random() * 500000) + 10000;
    const paymentTerms = [7, 15, 30, 45, 60][Math.floor(Math.random() * 5)];
    
    // Random date in past 90 days
    const invoiceDate = new Date(today);
    invoiceDate.setDate(invoiceDate.getDate() - Math.floor(Math.random() * 90));
    
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + paymentTerms);
    
    // Randomly assign status
    const rand = Math.random();
    let status, paymentDate;
    
    if (rand < 0.4) {
      // 40% paid
      status = 'paid';
      const delay = Math.floor(Math.random() * 14) - 7; // -7 to +7 days
      paymentDate = new Date(dueDate);
      paymentDate.setDate(paymentDate.getDate() + delay);
      paymentDate = paymentDate.toISOString().split('T')[0];
    } else if (dueDate < today) {
      // Past due and not paid = overdue
      status = 'overdue';
      paymentDate = null;
    } else {
      // Future due = pending
      status = 'pending';
      paymentDate = null;
    }
    
    invoices.push({
      id: `INV-${String(i).padStart(3, '0')}`,
      customerName: `${company} ${suffix}`,
      amount,
      invoiceDate: invoiceDate.toISOString().split('T')[0],
      paymentTerms,
      dueDate: dueDate.toISOString().split('T')[0],
      paymentDate,
      status
    });
  }
  
  return invoices;
}

export default mockInvoices;
