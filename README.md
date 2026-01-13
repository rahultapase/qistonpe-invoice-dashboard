# QistonPe Invoice Management Dashboard

A responsive MSME Invoice Management Dashboard built with React, Vite, and Tailwind CSS. This application helps business owners track invoices, payments, and credit utilization at a glance.

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
npm i

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

---

## Approach

### How I Structured Components

I followed a modular approach, breaking the app into small, focused components:

- **Layout Components** - Header, Container for consistent structure
- **Summary Components** - SummaryCard, SummarySection for dashboard metrics
- **Invoice Components** - InvoiceTable, InvoiceRow, AddInvoiceForm for core functionality
- **UI Components** - Button, Badge, Modal as reusable building blocks
- **Filter Components** - FilterBar, SearchBar, StatusFilter for data manipulation

Each folder has an `index.js` barrel file for cleaner imports.

### State Management

Instead of complex libraries like Redux, I used custom hooks to keep things simple:

- `useInvoices` - CRUD operations with localStorage persistence
- `useInvoiceFilters` - Handles filtering, sorting, and search
- `useSummaryStats` - Calculates all 4 dashboard metrics
- `useLocalStorage` - Wraps localStorage with error handling

### Challenges I Faced

1. **Date Timezone Issues** - Initially, dates were off by one day due to timezone differences. Fixed by using `startOfDay()` from date-fns for all comparisons.

2. **Performance with Large Data** - The table was slow with 500+ invoices. Added pagination and memoization which solved the lag completely.

3. **Dark Mode Flash** - On page refresh, there was a brief flash of light theme. Solved by adding a blocking script in `index.html` that applies dark mode before React loads.

---

## Performance Optimizations

Here's what I implemented to keep the app fast:

| Technique | Where Used | Why |
|-----------|------------|-----|
| `React.memo` | InvoiceRow, SummaryCard, Badge | Prevents re-render when props don't change |
| `useMemo` | Filtered/sorted lists, pagination, stats | Caches expensive calculations |
| `useCallback` | Event handlers passed to children | Keeps function references stable |
| Debouncing | SearchBar (300ms delay) | Reduces renders while user types |
| Pagination | InvoiceTable (10/20/50 per page) | Limits DOM nodes rendered |

---
### Trade-offs I Made

- **No virtualization** - Pagination was simpler to implement and sufficient for the dataset size
- **Charts not included** - I decided not to include a charting library and instead focused on completing and polishing the core invoice management features

---

## Time Breakdown

| Phase | Time Spent |
|-------|------------|
| Design & Planning | ~2-3 hours |
| Core Development | ~10 hours |
| Styling & Responsiveness | ~4-5 hours |
| Testing & Debugging | ~3-4 hours |
| Documentation | ~1-2 hour |
| **Total** | **~20-24 hours** |

---
