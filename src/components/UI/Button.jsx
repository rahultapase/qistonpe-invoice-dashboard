import { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Button variant styles
 */
const variantStyles = {
  primary: `
    bg-blue-600 text-white 
    hover:bg-blue-700 
    focus:ring-blue-500
    disabled:bg-blue-400
  `,
  secondary: `
    bg-gray-100 text-gray-700 
    hover:bg-gray-200 
    focus:ring-gray-500
    border border-gray-300
    disabled:bg-gray-100 disabled:text-gray-400
  `,
  danger: `
    bg-red-600 text-white 
    hover:bg-red-700 
    focus:ring-red-500
    disabled:bg-red-400
  `,
  ghost: `
    bg-transparent text-gray-600 
    hover:bg-gray-100 hover:text-gray-900
    focus:ring-gray-500
  `,
  outline: `
    bg-transparent text-blue-600 
    border border-blue-600
    hover:bg-blue-50
    focus:ring-blue-500
    disabled:text-blue-300 disabled:border-blue-300
  `
};

/**
 * Button size styles
 */
const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2'
};

/**
 * Button Component
 * 
 * Reusable button with multiple variants and sizes.
 * Supports icons, loading state, and full width option.
 * Uses forwardRef to support refs.
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Button style variant
 * @param {string} props.size - Button size
 * @param {React.ReactNode} props.children - Button content
 * @param {React.ReactNode} props.leftIcon - Icon to show before text
 * @param {React.ReactNode} props.rightIcon - Icon to show after text
 * @param {boolean} props.isLoading - Show loading spinner
 * @param {boolean} props.fullWidth - Take full width of container
 * @param {boolean} props.disabled - Disable button
 * @param {string} props.type - Button type attribute
 * @param {string} props.className - Additional CSS classes
 */
const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    children,
    leftIcon,
    rightIcon,
    isLoading = false,
    fullWidth = false,
    disabled = false,
    type = 'button',
    className = '',
    ...props
  },
  ref
) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center
        font-medium rounded-lg
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-60
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <svg 
          className="animate-spin h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {/* Left Icon */}
      {!isLoading && leftIcon && (
        <span className="flex-shrink-0" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      
      {/* Button Text */}
      {children && (
        <span className={isLoading ? 'opacity-0' : ''}>
          {children}
        </span>
      )}
      
      {/* Right Icon */}
      {!isLoading && rightIcon && (
        <span className="flex-shrink-0" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
});

Button.propTypes = {
  /** Button style variant */
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost', 'outline']),
  /** Button size */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Button content/text */
  children: PropTypes.node,
  /** Icon to display before the text */
  leftIcon: PropTypes.node,
  /** Icon to display after the text */
  rightIcon: PropTypes.node,
  /** Show loading spinner and disable button */
  isLoading: PropTypes.bool,
  /** Make button full width of container */
  fullWidth: PropTypes.bool,
  /** Disable the button */
  disabled: PropTypes.bool,
  /** Button type attribute (button, submit, reset) */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Click handler */
  onClick: PropTypes.func,
  /** Accessible label for the button */
  'aria-label': PropTypes.string
};

Button.defaultProps = {
  variant: 'primary',
  size: 'md',
  isLoading: false,
  fullWidth: false,
  disabled: false,
  type: 'button',
  className: ''
};

// Memoize to prevent re-renders when parent state changes
export default memo(Button);
