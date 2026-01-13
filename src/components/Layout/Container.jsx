import PropTypes from 'prop-types';

/**
 * Container Component
 * 
 * Main content container with responsive padding and max-width constraints.
 * Provides consistent layout across the application.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.narrow - Use narrower max-width
 * @param {boolean} props.noPadding - Remove padding (for full-width sections)
 */
function Container({ 
  children, 
  className = '', 
  narrow = false,
  noPadding = false 
}) {
  const maxWidthClass = narrow ? 'max-w-5xl' : 'max-w-7xl';
  const paddingClass = noPadding ? '' : 'px-4 sm:px-6 lg:px-8 py-6 sm:py-8';

  return (
    <div 
      className={`
        mx-auto 
        ${maxWidthClass} 
        ${paddingClass}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </div>
  );
}

Container.propTypes = {
  /** Child components to render inside the container */
  children: PropTypes.node.isRequired,
  /** Additional CSS classes to apply */
  className: PropTypes.string,
  /** Use narrower max-width (max-w-5xl instead of max-w-7xl) */
  narrow: PropTypes.bool,
  /** Remove default padding */
  noPadding: PropTypes.bool
};

Container.defaultProps = {
  className: '',
  narrow: false,
  noPadding: false
};

export default Container;
