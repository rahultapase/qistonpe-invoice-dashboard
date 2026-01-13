import { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * SkeletonRow Component
 * 
 * Loading skeleton for invoice table rows.
 * Shows animated placeholders while data loads.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.hasSelection - Whether selection column should be shown
 */
function SkeletonRow({ hasSelection = false }) {
  return (
    <tr className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 animate-pulse">
      {hasSelection && (
        <td className="w-10 px-2 sm:px-3 py-3 sm:py-4">
          <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded" />
        </td>
      )}
      <td className="px-3 sm:px-4 py-3 sm:py-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
      </td>
      <td className="px-3 sm:px-4 py-3 sm:py-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
      </td>
      <td className="hidden md:table-cell px-4 py-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
      </td>
      <td className="hidden md:table-cell px-4 py-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
      </td>
      <td className="px-3 sm:px-4 py-3 sm:py-4 text-right">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 ml-auto" />
      </td>
      <td className="px-3 sm:px-4 py-3 sm:py-4 text-center">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16 mx-auto" />
      </td>
      <td className="hidden lg:table-cell px-4 py-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
      </td>
      <td className="px-3 sm:px-4 py-3 sm:py-4 text-center">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto" />
      </td>
    </tr>
  );
}

SkeletonRow.propTypes = {
  /** Whether selection column should be shown */
  hasSelection: PropTypes.bool
};

/**
 * SkeletonTable Component
 * 
 * Full loading skeleton for the invoice table.
 * 
 * @param {Object} props - Component props
 * @param {number} props.rows - Number of skeleton rows to show
 * @param {boolean} props.hasSelection - Whether selection column should be shown
 */
export function SkeletonTable({ rows = 5, hasSelection = false }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, index) => (
        <SkeletonRow key={index} hasSelection={hasSelection} />
      ))}
    </tbody>
  );
}

SkeletonTable.propTypes = {
  /** Number of skeleton rows to display */
  rows: PropTypes.number,
  /** Whether selection column should be shown */
  hasSelection: PropTypes.bool
};

export default memo(SkeletonRow);
