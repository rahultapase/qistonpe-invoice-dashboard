import { memo } from 'react';
import PropTypes from 'prop-types';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  Minus 
} from 'lucide-react';

/**
 * Icon mapping for summary cards
 */
const iconMap = {
  'clock': Clock,
  'alert-triangle': AlertTriangle,
  'check-circle': CheckCircle,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  'minus': Minus
};

/**
 * SummaryCard Component
 * 
 * Displays a single metric card for the dashboard summary section.
 * Memoized to prevent unnecessary re-renders.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Card title (e.g., "Total Outstanding")
 * @param {string} props.value - Formatted value to display (e.g., "₹1,23,456")
 * @param {string} props.description - Optional description text
 * @param {string} props.icon - Icon name from lucide-react
 * @param {string} props.colorClass - Text color class for the value
 * @param {string} props.bgClass - Background color class for the icon
 * @param {string} props.borderClass - Border color class
 */
function SummaryCard({ 
  title, 
  value, 
  description,
  icon = 'clock',
  colorClass = 'text-gray-900',
  bgClass = 'bg-gray-50',
  borderClass = 'border-gray-200'
}) {
  // Get the icon component
  const IconComponent = iconMap[icon] || Clock;

  return (
    <div 
      className={`
        bg-white dark:bg-gray-800 rounded-xl border ${borderClass} dark:border-opacity-50
        p-4 sm:p-5 
        transition-all duration-300 ease-out
        hover:shadow-lg hover:-translate-y-1
        dark:hover:shadow-xl dark:hover:shadow-gray-900/40
        cursor-default group
      `}
      role="region"
      aria-label={title}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          {/* Title */}
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {title}
          </h3>
          
          {/* Value - allow wrapping on small screens */}
          <p className={`mt-2 text-xl sm:text-2xl lg:text-3xl font-bold ${colorClass} break-words leading-tight`}>
            {value}
          </p>
          
          {/* Description */}
          {description && (
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2" title={description}>
              {description}
            </p>
          )}
        </div>
        
        {/* Icon - with subtle animation */}
        <div 
          className={`
            flex-shrink-0
            flex items-center justify-center 
            w-10 h-10 sm:w-12 sm:h-12 
            rounded-lg ${bgClass} dark:bg-opacity-20
            transition-transform duration-300 group-hover:scale-110
          `}
          aria-hidden="true"
        >
          <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${colorClass}`} />
        </div>
      </div>
    </div>
  );
}

SummaryCard.propTypes = {
  /** Card title displayed at the top */
  title: PropTypes.string.isRequired,
  /** Formatted value to display prominently */
  value: PropTypes.string.isRequired,
  /** Optional description text below the value */
  description: PropTypes.string,
  /** Icon name: 'clock', 'alert-triangle', 'check-circle', 'trending-up', 'trending-down', 'minus' */
  icon: PropTypes.oneOf(['clock', 'alert-triangle', 'check-circle', 'trending-up', 'trending-down', 'minus']),
  /** Tailwind text color class for the value (e.g., 'text-blue-600') */
  colorClass: PropTypes.string,
  /** Tailwind background color class for the icon container */
  bgClass: PropTypes.string,
  /** Tailwind border color class for the card */
  borderClass: PropTypes.string
};

SummaryCard.defaultProps = {
  description: '',
  icon: 'clock',
  colorClass: 'text-gray-900',
  bgClass: 'bg-gray-50',
  borderClass: 'border-gray-200'
};

// Memoize to prevent re-renders when parent state changes
// SummaryCard only re-renders when its own props change
export default memo(SummaryCard);
