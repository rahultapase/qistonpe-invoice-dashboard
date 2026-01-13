# QistonPe Invoice Management Dashboard

A responsive MSME Invoice Management Dashboard built with React, Vite, and Tailwind CSS. Helps business owners track invoices, payments, and credit utilization at a glance.

## 🚀 Live Demo

**[View Live Demo](https://qistonpe-invoice-dashboard.vercel.app/)**

## Setup & Run

### Installation

```bash
# Clone the repository
git clone https://github.com/rahultapase/qistonpe-invoice-dashboard.git

# Navigate to project directory
cd qistonpe-invoice-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

---
## Approach

### Component Structure

I broke down the app into small, focused components to keep things maintainable:

- **Layout** - Header, Container for consistent structure
- **Summary** - SummaryCard, SummarySection (for the 4 metric cards at top)
- **Invoice** - InvoiceTable, InvoiceRow, AddInvoiceForm, BulkActions
- **Filters** - FilterBar, SearchBar, StatusFilter, SortDropdown
- **UI** - Button, Badge, Modal, EmptyState (reusable across the app)

Each feature folder has an `index.js` for cleaner imports.

### State Management

I used custom React hooks instead of Redux to keep things simple:

- **useInvoices** - Handles all CRUD operations and localStorage persistence
- **useInvoiceFilters** - Handles filtering, sorting, and search
- **useSummaryStats** - Calculates the 4 dashboard metrics in real-time
- **useLocalStorage** - Wraps localStorage with JSON parsing and error handling
- **useBulkSelection** - Manages multi-select and bulk actions
- **useTheme** - Handles dark mode toggle with system preference detection

### Challenges & Solutions

**1. Date Calculations Were Off**  
Initially, the "Days until due" calculation was wrong because of timezone issues. Fixed by using `startOfDay()` from date-fns for all comparisons.

**2. Performance with 500+ Invoices**  
The table was noticeably slow when filtering/sorting with large datasets. Added `useMemo` for filtered lists and pagination which made it instant.

**3. Status Calculations**  
Had to carefully think through the logic for auto-calculating invoice status (Paid/Pending/Overdue) based on payment date and due date. Created a dedicated utility function with clear conditionals.

---

## Performance Optimizations

### What I Implemented

**React.memo** - Wrapped InvoiceRow, SummaryCard, and Badge components to prevent unnecessary re-renders when parent state changes

**useMemo** - Used for:
- Filtered and sorted invoice lists
- Pagination calculations
- Summary statistics (totals, averages)
- Status counts for filter badges

**useCallback** - Stabilized event handler references for:
- Form submissions
- Filter changes
- Bulk actions
- Mark as paid buttons

**Debounced Search** - Added 300ms delay to search input to avoid filtering on every keystroke

**Pagination** - Implemented 10/20/50 items per page options to limit DOM nodes

### Why These Work

While testing with 500+ mock invoices, I noticed that simple actions like changing filters, sorting, or switching pages were triggering repeated recalculations of the invoice list. By memoizing the derived data and wrapping each row with `React.memo`, only the parts that actually changed were re-rendered. This helped keep the interface smooth and responsive.

### Trade-offs

- **No virtualization** - Pagination was simpler to implement and sufficient for the dataset size
- **No charts** - Focused on getting the core features right instead of adding optional chart library

### Testing Notes

To validate performance and UI behavior, I generated 500+ mock invoices using a small local script and tested filtering, sorting, pagination, and bulk actions under this dataset.


---

## Time Breakdown

| Phase | Time Spent |
|-------|------------|
| Design & Planning | ~2-3 hours |
| Development | ~15-16 hours |
| Testing & Debugging | ~3-4 hours |
| **Total** | **~20-23 hours** |

---
