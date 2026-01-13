/**
 * QistonPe MSME Invoice Management Dashboard
 * 
 * Main Application Component
 * 
 * This is the root component that orchestrates all features:
 * - Summary statistics cards (Outstanding, Overdue, Paid This Month, Avg Payment Delay)
 * - Invoice list with filtering, sorting, searching, and pagination
 * - Add new invoice functionality via modal
 * - Mark invoices as paid (single and bulk)
 * - Export to CSV
 * - Dark mode toggle
 * - LocalStorage persistence
 * 
 * Performance Optimizations Applied:
 * - React.memo on all presentational components
 * - useMemo for computed values (filtered lists, summary stats)
 * - useCallback for event handlers passed to children
 * - Debounced search input (300ms)
 * - Virtualization-ready architecture for 500+ invoices
 */

import { useState, useCallback } from 'react';
import ErrorBoundary from './components/ErrorBoundary';

// Layout Components
import { Header, Container } from './components/Layout';

// Summary Components
import { SummarySection } from './components/Summary';

// UI Components
import { ThemeToggle } from './components/UI';

// Invoice Components
import { 
  InvoiceList, 
  AddInvoiceButton, 
  AddInvoiceModal,
  ExportButton,
  BulkActions
} from './components/Invoice';

// Custom Hooks
import { 
  useInvoices, 
  useInvoiceFilters, 
  useSummaryStats, 
  useTheme,
  useBulkSelection 
} from './hooks';

/**
 * Main Dashboard Component
 * Contains all state management and component orchestration
 */
function Dashboard() {
  // ============================================
  // STATE MANAGEMENT VIA CUSTOM HOOKS
  // ============================================
  
  /**
   * Invoice CRUD operations hook
   * Provides: invoices, addInvoice, markAsPaid, bulkMarkAsPaid, isLoading
   */
  const { 
    invoices, 
    addInvoice, 
    markAsPaid,
    bulkMarkAsPaid,
    isLoading: isLoadingInvoices 
  } = useInvoices();

  /**
   * Filtering, sorting, and search hook
   * Provides: filtered invoices and filter controls
   */
  const {
    filteredInvoices,
    statusFilter,
    setStatusFilter,
    sortOption,
    setSortOption,
    searchQuery,
    setSearchQuery,
    statusCounts
  } = useInvoiceFilters(invoices);

  /**
   * Summary statistics hook
   * Provides: summaryCards array for SummarySection
   */
  const { summaryCards } = useSummaryStats(invoices);

  /**
   * Theme hook
   * Provides: dark mode state and toggle
   */
  const { isDarkMode, toggleTheme } = useTheme();

  /**
   * Bulk selection hook
   * Provides: selection state and methods
   */
  const {
    selectedIds,
    selectAll,
    deselectAll,
    toggleSelection,
    isSelected
  } = useBulkSelection(filteredInvoices);

  // ============================================
  // LOCAL UI STATE
  // ============================================
  
  /**
   * Modal open/close state
   */
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // ============================================
  // EVENT HANDLERS (Memoized with useCallback)
  // ============================================

  /**
   * Open the Add Invoice modal
   */
  const handleOpenAddModal = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  /**
   * Close the Add Invoice modal
   */
  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  /**
   * Handle adding a new invoice
   * Wraps the addInvoice function from useInvoices hook
   */
  const handleAddInvoice = useCallback((invoiceData) => {
    const result = addInvoice(invoiceData);
    return result;
  }, [addInvoice]);

  /**
   * Handle marking an invoice as paid
   * Wraps the markAsPaid function from useInvoices hook
   */
  const handleMarkAsPaid = useCallback((invoiceId) => {
    markAsPaid(invoiceId);
  }, [markAsPaid]);

  /**
   * Handle bulk mark as paid
   * Marks all selected unpaid invoices as paid
   */
  const handleBulkMarkPaid = useCallback(() => {
    const selectedArray = Array.from(selectedIds);
    const unpaidSelected = filteredInvoices
      .filter(inv => selectedArray.includes(inv.id) && !inv.isPaid)
      .map(inv => inv.id);
    
    if (unpaidSelected.length > 0) {
      bulkMarkAsPaid(unpaidSelected);
      deselectAll();
    }
  }, [selectedIds, filteredInvoices, bulkMarkAsPaid, deselectAll]);

  // ============================================
  // DERIVED STATE
  // ============================================

  /**
   * Overall loading state
   */
  const isLoading = isLoadingInvoices;

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header with Actions */}
      <Header 
        actions={
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
            <ExportButton invoices={filteredInvoices} />
            <AddInvoiceButton onClick={handleOpenAddModal} />
          </div>
        } 
      />

      {/* Main Content */}
      <main className="pb-12">
        <Container>
          {/* Summary Statistics Section */}
          <section aria-label="Invoice Summary Statistics">
            <SummarySection 
              summaryCards={summaryCards} 
              isLoading={isLoading} 
            />
          </section>

          {/* Bulk Actions Bar */}
          {filteredInvoices.length > 0 && (
            <section aria-label="Bulk Actions" className="mt-6">
              <BulkActions
                invoices={filteredInvoices}
                selectedIds={selectedIds}
                onSelectAll={selectAll}
                onDeselectAll={deselectAll}
                onBulkMarkPaid={handleBulkMarkPaid}
              />
            </section>
          )}

          {/* Invoice List Section */}
          <section aria-label="Invoice List" className="mt-4">
            <InvoiceList
              invoices={filteredInvoices}
              isLoading={isLoading}
              onMarkAsPaid={handleMarkAsPaid}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              sortOption={sortOption}
              onSortChange={setSortOption}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusCounts={statusCounts}
              selectedIds={selectedIds}
              onToggleSelection={toggleSelection}
              isSelected={isSelected}
            />
          </section>
        </Container>
      </main>

      {/* Add Invoice Modal */}
      <AddInvoiceModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAddInvoice={handleAddInvoice}
      />
    </div>
  );
}

/**
 * App Component
 * Wraps Dashboard in ErrorBoundary for error handling
 */
function App() {
  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  );
}

export default App;
