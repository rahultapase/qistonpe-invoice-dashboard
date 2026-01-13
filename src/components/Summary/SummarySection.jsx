import PropTypes from 'prop-types';
import SummaryCard from './SummaryCard';

/**
 * SummarySection Component
 * 
 * Displays all 4 summary cards in a responsive grid layout.
 * Cards are:
 * 1. Total Outstanding (Pending + Overdue)
 * 2. Total Overdue
 * 3. Total Paid This Month
 * 4. Average Payment Delay
 * 
 * @param {Object} props - Component props
 * @param {Array} props.summaryCards - Array of card data from useSummaryStats
 * @param {boolean} props.isLoading - Show loading skeleton
 */
function SummarySection({ summaryCards, isLoading }) {
  // Loading skeleton
  if (isLoading) {
    return (
      <section 
        className="mb-6 sm:mb-8"
        aria-label="Dashboard Summary"
        aria-busy="true"
      >
        <h2 className="sr-only">Dashboard Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 animate-pulse"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                  <div className="h-8 bg-gray-200 rounded w-32 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-20" />
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section 
      className="mb-6 sm:mb-8"
      aria-label="Dashboard Summary"
    >
      {/* Screen reader heading */}
      <h2 className="sr-only">Dashboard Summary</h2>
      
      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {summaryCards.map((card) => (
          <SummaryCard
            key={card.id}
            title={card.title}
            value={card.value}
            description={card.description}
            icon={card.icon}
            colorClass={card.colorClass}
            bgClass={card.bgClass}
            borderClass={card.borderClass}
          />
        ))}
      </div>
    </section>
  );
}

SummarySection.propTypes = {
  /** Array of summary card data objects from useSummaryStats hook */
  summaryCards: PropTypes.arrayOf(
    PropTypes.shape({
      /** Unique identifier for the card */
      id: PropTypes.string.isRequired,
      /** Card title */
      title: PropTypes.string.isRequired,
      /** Formatted display value */
      value: PropTypes.string.isRequired,
      /** Raw numeric value */
      rawValue: PropTypes.number,
      /** Description text */
      description: PropTypes.string,
      /** Icon name */
      icon: PropTypes.string,
      /** Text color class */
      colorClass: PropTypes.string,
      /** Background color class */
      bgClass: PropTypes.string,
      /** Border color class */
      borderClass: PropTypes.string
    })
  ).isRequired,
  /** Whether to show loading skeleton */
  isLoading: PropTypes.bool
};

SummarySection.defaultProps = {
  isLoading: false
};

export default SummarySection;
