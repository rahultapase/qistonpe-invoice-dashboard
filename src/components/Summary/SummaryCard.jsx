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
  const IconComponent = iconMap[icon] || Clock;

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 
        rounded-xl border ${borderClass} dark:border-opacity-50
        shadow-sm hover:shadow-lg hover:-translate-y-1
        p-5 transition-all duration-200
      `}
      role="region"
      aria-label={title}
    >
      {/* Title with icon inline */}
      <div className="flex items-center gap-2 mb-3">
        <IconComponent className={`w-4 h-4 ${colorClass} opacity-70`} aria-hidden="true" />
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {title}
        </span>
      </div>

      {/* Value */}
      <p className={`text-2xl sm:text-3xl font-semibold ${colorClass} tabular-nums`}>
        {value}
      </p>

      {/* Description */}
      {description && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
}

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  description: PropTypes.string,
  icon: PropTypes.oneOf(['clock', 'alert-triangle', 'check-circle', 'trending-up', 'trending-down', 'minus']),
  colorClass: PropTypes.string,
  bgClass: PropTypes.string,
  borderClass: PropTypes.string
};

export default memo(SummaryCard);
