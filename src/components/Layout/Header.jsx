import PropTypes from 'prop-types';
import { FileText } from 'lucide-react';

/**
 * Header Component
 * 
 * Main application header with QistonPe branding and title.
 * Sticky positioned at the top of the page.
 * Supports dark mode.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.actions - Optional action buttons (e.g., Add Invoice)
 */
function Header({ actions = null }) {
  return (
    <header 
      className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            {/* Logo Icon */}
            <div 
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white"
              aria-hidden="true"
            >
              <FileText className="w-5 h-5" />
            </div>
            
            {/* Brand Text */}
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 leading-tight">
                QistonPe
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                Invoice Management Dashboard
              </p>
            </div>
          </div>

          {/* Action Buttons Area */}
          {actions && (
            <div className="flex items-center gap-2 sm:gap-4">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  /** Optional action buttons to display in the header (e.g., Add Invoice button) */
  actions: PropTypes.node
};

export default Header;
