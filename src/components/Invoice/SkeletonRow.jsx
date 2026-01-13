import { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * SkeletonRow Component
 * 
 * Loading skeleton for invoice table rows.
 * Shows animated placeholders while data loads.
 */
function SkeletonRow() {
  return (
    <tr className="bg-white border-b border-gray-100 animate-pulse">
      <td className="px-3 sm:px-4 py-3 sm:py-4">
        <div className="h-4 bg-gray-200 rounded w-16" />
      </td>
      <td className="px-3 sm:px-4 py-3 sm:py-4">
        <div className="h-4 bg-gray-200 rounded w-32" />
      </td>
      <td className="hidden md:table-cell px-4 py-4">
        <div className="h-4 bg-gray-200 rounded w-20" />
      </td>
      <td className="hidden md:table-cell px-4 py-4">
        <div className="h-4 bg-gray-200 rounded w-20" />
      </td>
      <td className="px-3 sm:px-4 py-3 sm:py-4 text-right">
        <div className="h-4 bg-gray-200 rounded w-20 ml-auto" />
      </td>
      <td className="px-3 sm:px-4 py-3 sm:py-4 text-center">
        <div className="h-5 bg-gray-200 rounded-full w-16 mx-auto" />
      </td>
      <td className="hidden lg:table-cell px-4 py-4">
        <div className="h-4 bg-gray-200 rounded w-24" />
      </td>
      <td className="px-3 sm:px-4 py-3 sm:py-4 text-center">
        <div className="h-8 bg-gray-200 rounded w-20 mx-auto" />
      </td>
    </tr>
  );
}

/**
 * SkeletonTable Component
 * 
 * Full loading skeleton for the invoice table.
 * 
 * @param {Object} props - Component props
 * @param {number} props.rows - Number of skeleton rows to show
 */
export function SkeletonTable({ rows = 5 }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, index) => (
        <SkeletonRow key={index} />
      ))}
    </tbody>
  );
}

SkeletonTable.propTypes = {
  /** Number of skeleton rows to display */
  rows: PropTypes.number
};

export default memo(SkeletonRow);
