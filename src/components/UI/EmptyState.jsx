import { memo } from 'react';
import PropTypes from 'prop-types';
import { FileX, Search, RefreshCw } from 'lucide-react';
import { Button } from '../UI';

/**
 * Icon mapping for different empty state types
 */
const iconMap = {
  'no-data': FileX,
  'no-results': Search,
  'error': RefreshCw
};

/**
 * EmptyState Component
 * 
 * Displays a friendly message when there's no data to show.
 * Used for empty invoice lists and no search results.
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Type of empty state: 'no-data', 'no-results', 'error'
 * @param {string} props.title - Main heading text
 * @param {string} props.message - Descriptive message
 * @param {Function} props.onAction - Callback for action button
 * @param {string} props.actionLabel - Label for action button
 */
function EmptyState({ 
  type = 'no-data',
  title,
  message,
  onAction,
  actionLabel
}) {
  const IconComponent = iconMap[type] || FileX;

  // Default content based on type
  const defaults = {
    'no-data': {
      title: 'No invoices yet',
      message: 'Get started by adding your first invoice.',
      actionLabel: 'Add Invoice'
    },
    'no-results': {
      title: 'No results found',
      message: 'Try adjusting your search or filter criteria.',
      actionLabel: 'Clear Filters'
    },
    'error': {
      title: 'Something went wrong',
      message: 'Unable to load invoices. Please try again.',
      actionLabel: 'Retry'
    }
  };

  const displayTitle = title || defaults[type]?.title || 'No data';
  const displayMessage = message || defaults[type]?.message || '';
  const displayActionLabel = actionLabel || defaults[type]?.actionLabel;

  return (
    <div 
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
      role="status"
      aria-label={displayTitle}
    >
      {/* Icon */}
      <div 
        className={`
          flex items-center justify-center
          w-16 h-16 mb-4
          rounded-full
          ${type === 'error' 
            ? 'bg-red-100 dark:bg-red-900/30' 
            : 'bg-gray-100 dark:bg-gray-700'}
        `}
        aria-hidden="true"
      >
        <IconComponent 
          className={`
            w-8 h-8
            ${type === 'error' 
              ? 'text-red-500 dark:text-red-400' 
              : 'text-gray-400 dark:text-gray-500'}
          `}
        />
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
        {displayTitle}
      </h3>
      
      {/* Message */}
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        {displayMessage}
      </p>
      
      {/* Action Button */}
      {onAction && displayActionLabel && (
        <Button
          variant={type === 'error' ? 'danger' : 'primary'}
          onClick={onAction}
          aria-label={displayActionLabel}
        >
          {displayActionLabel}
        </Button>
      )}
    </div>
  );
}

EmptyState.propTypes = {
  /** Type of empty state determining icon and default content */
  type: PropTypes.oneOf(['no-data', 'no-results', 'error']),
  /** Main heading text (overrides default) */
  title: PropTypes.string,
  /** Descriptive message (overrides default) */
  message: PropTypes.string,
  /** Callback function for the action button */
  onAction: PropTypes.func,
  /** Label for the action button (overrides default) */
  actionLabel: PropTypes.string
};

EmptyState.defaultProps = {
  type: 'no-data',
  title: '',
  message: '',
  onAction: null,
  actionLabel: ''
};

export default memo(EmptyState);
