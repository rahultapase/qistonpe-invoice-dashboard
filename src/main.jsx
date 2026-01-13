import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

/**
 * Main entry point for the QistonPe Invoice Dashboard
 * 
 * - Wraps App in React.StrictMode for development warnings
 * - Wraps in ErrorBoundary to catch and display runtime errors gracefully
 * - Imports global Tailwind CSS styles
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
