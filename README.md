# QistonPe Invoice Management Dashboard

A modern, responsive MSME Invoice Management Dashboard built with React, Vite, and Tailwind CSS. This application helps business owners track invoices, payments, and credit utilization at a glance.

## 🚀 Live Demo

**[View Live Demo](https://your-deployment-url.vercel.app)** 

---
## 📦 Setup & Run

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

The app will open at `http://localhost:3000`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```
---

## 🎯 Approach

### Component Structure
- **Atomic Design** - Small, reusable UI components (Badge, Button) compose into larger features
- **Single Responsibility** - Each component has one clear purpose
- **Prop Drilling Avoided** - Custom hooks encapsulate shared logic

### State Management
- **Local State** - useState for component-specific state (modal open, form inputs)
- **Custom Hooks** - Centralized logic for invoices, filters, and calculations
- **localStorage** - Persistence layer wrapped in useLocalStorage hook

### Data Flow
```
App.jsx
  ├── useInvoices() → Load/Save invoices to localStorage
  ├── useInvoiceFilters() → Apply filters, sort, search
  ├── useSummaryStats() → Calculate dashboard metrics
  └── Pass data & handlers down to components
```

---

## ⚡ Performance Optimizations

| Optimization | Where Applied | Why |
|--------------|---------------|-----|
| `React.memo` | InvoiceRow, SummaryCard, Badge | Prevent re-renders when props unchanged |
| `useMemo` | Filtered list, Sorted list, Pagination, Summary stats | Avoid recalculating on every render |
| `useCallback` | All event handlers | Stable references for memoized children |
| Debouncing | SearchBar (300ms) | Reduce re-renders during typing |
| Pagination | InvoiceTable (10/20/50 per page) | Limit DOM nodes for large datasets |


## 🚧 Challenges Faced

1. **Date Timezone Issues** - Solved by using `startOfDay()` from date-fns for consistent comparisons
2. **Large Dataset Performance** - Implemented pagination and memoization
3. **localStorage Quota** - Added error handling with graceful fallback

---


