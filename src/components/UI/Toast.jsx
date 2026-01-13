import { memo, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

/**
 * Toast icons mapping
 */
const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info
};

/**
 * Toast color classes
 */
const colorClasses = {
  success: 'toast-success',
  error: 'toast-error',
  info: 'toast-info'
};

/**
 * Single Toast Component
 */
const ToastItem = memo(function ToastItem({ toast, onRemove }) {
  const [isExiting, setIsExiting] = useState(false);
  const Icon = iconMap[toast.type] || Info;

  const handleRemove = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 200);
  }, [toast.id, onRemove]);

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(handleRemove, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, handleRemove]);

  return (
    <div
      className={`toast ${colorClasses[toast.type]} ${isExiting ? 'animate-slide-out' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className="flex-1 text-sm font-medium">{toast.message}</span>
      <button
        onClick={handleRemove}
        className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
});

ToastItem.propTypes = {
  toast: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'info']).isRequired,
    message: PropTypes.string.isRequired,
    duration: PropTypes.number
  }).isRequired,
  onRemove: PropTypes.func.isRequired
};

/**
 * Toast Container Component
 * Renders all active toasts
 */
function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  return createPortal(
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>,
    document.body
  );
}

ToastContainer.propTypes = {
  toasts: PropTypes.array.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default memo(ToastContainer);
