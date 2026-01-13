import { useEffect, useCallback, useRef, memo } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

/**
 * Modal Component
 * 
 * Reusable modal wrapper with:
 * - Backdrop click to close
 * - Escape key to close
 * - Focus trapping
 * - Scroll lock on body
 * - Accessible (role, aria-modal, aria-labelledby)
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Callback to close modal
 * @param {string} props.title - Modal title for header
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.size - Modal size: 'sm', 'md', 'lg'
 * @param {boolean} props.showCloseButton - Whether to show X button
 */
function Modal({
  isOpen,
  onClose,
  title = '',
  children,
  size = 'md',
  showCloseButton = true
}) {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  /**
   * Size classes for modal width
   */
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  /**
   * Handle escape key press
   */
  const handleEscapeKey = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  /**
   * Handle backdrop click
   */
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  /**
   * Lock body scroll and manage focus when modal opens/closes
   */
  useEffect(() => {
    if (isOpen) {
      // Store current active element
      previousActiveElement.current = document.activeElement;

      // Lock body scroll
      document.body.style.overflow = 'hidden';

      // Add escape key listener
      document.addEventListener('keydown', handleEscapeKey);

      // Focus the modal
      setTimeout(() => {
        modalRef.current?.focus();
      }, 0);
    } else {
      // Unlock body scroll
      document.body.style.overflow = '';

      // Remove escape key listener
      document.removeEventListener('keydown', handleEscapeKey);

      // Restore focus to previous element
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, handleEscapeKey]);

  /**
   * Trap focus within modal
   */
  const handleKeyDown = useCallback((e) => {
    if (e.key !== 'Tab') return;

    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Shift + Tab on first element -> go to last
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement?.focus();
    }
    // Tab on last element -> go to first
    else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement?.focus();
    }
  }, []);

  // Don't render if not open
  if (!isOpen) return null;

  // Use portal to render at document root
  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        onClick={handleBackdropClick}
      />

      {/* Modal Positioning */}
      <div
        className="flex min-h-full items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        {/* Modal Content */}
        <div
          ref={modalRef}
          className={`
            relative w-full ${sizeClasses[size]}
            bg-white dark:bg-gray-800 rounded-xl shadow-xl
            transform transition-all
            animate-fade-in
          `}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-t-xl">
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                >
                  {title}
                </h2>
              )}

              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className={`
                    p-2 rounded-lg text-gray-400 dark:text-gray-500
                    hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    transition-colors duration-200
                    ${!title ? 'absolute top-3 right-3' : ''}
                  `}
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

Modal.propTypes = {
  /** Whether the modal is visible */
  isOpen: PropTypes.bool.isRequired,
  /** Callback function to close the modal */
  onClose: PropTypes.func.isRequired,
  /** Modal title displayed in the header */
  title: PropTypes.string,
  /** Content to render inside the modal */
  children: PropTypes.node.isRequired,
  /** Size of the modal */
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  /** Whether to show the close (X) button */
  showCloseButton: PropTypes.bool
};

export default memo(Modal);
