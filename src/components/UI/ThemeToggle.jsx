import { memo } from 'react';
import PropTypes from 'prop-types';
import { Sun, Moon } from 'lucide-react';

/**
 * ThemeToggle Component
 * 
 * Button to toggle between light and dark mode.
 * Shows sun icon in dark mode, moon icon in light mode.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isDarkMode - Current theme state
 * @param {Function} props.onToggle - Callback to toggle theme
 */
function ThemeToggle({ isDarkMode, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        p-2 rounded-lg transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isDarkMode 
          ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600 focus:ring-offset-gray-800' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 focus:ring-offset-white'
        }
      `}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}

ThemeToggle.propTypes = {
  /** Whether dark mode is currently active */
  isDarkMode: PropTypes.bool.isRequired,
  /** Callback function to toggle theme */
  onToggle: PropTypes.func.isRequired
};

export default memo(ThemeToggle);
