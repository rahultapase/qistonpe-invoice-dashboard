import { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Calendar, IndianRupee, ChevronDown, Check } from 'lucide-react';
import { Button } from '../UI';
import { calculateDueDate, formatDate, toISODateString } from '../../utils/dateUtils';
import { validateInvoice } from '../../utils/invoiceUtils';
import { PAYMENT_TERMS_OPTIONS, VALIDATION } from '../../constants/invoiceConstants';

/**
 * Custom Dropdown Component
 * Replaces native select for better styling control
 */
function CustomDropdown({
  options,
  value,
  onChange,
  name,
  error,
  touched,
  onBlur
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        // Trigger blur when closing by clicking outside
        if (isOpen) {
          onBlur({ target: { name, value } });
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef, isOpen, onBlur, name, value]);

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 flex items-center justify-between
          text-base font-medium text-gray-900 dark:text-gray-100
          bg-white dark:bg-gray-700 
          border rounded-xl
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
          hover:border-gray-400 dark:hover:border-gray-500
          transition-all duration-200
          shadow-sm
          ${touched && error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            : 'border-gray-200 dark:border-gray-600'
          }
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">{selectedOption.label}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl max-h-56 overflow-auto focus:outline-none py-1 animate-in fade-in zoom-in-95 duration-100 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <ul role="listbox">
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={value === option.value}
                onClick={() => handleSelect(option.value)}
                className={`
                  relative px-4 py-2 cursor-pointer select-none
                  transition-colors duration-150
                  flex items-center justify-between
                  ${value === option.value
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }
                `}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {touched && error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * AddInvoiceForm Component
 * 
 * Form for adding a new invoice with:
 * - Customer Name (required, 2-100 chars)
 * - Amount (required, positive, max 1 crore)
 * - Invoice Date (required, not future)
 * - Payment Terms (7/15/30/45/60 days)
 * - Auto-calculated Due Date (read-only)
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Callback when form is submitted successfully
 * @param {Function} props.onCancel - Callback when form is cancelled
 * @param {boolean} props.isSubmitting - Whether form is being submitted
 */
function AddInvoiceForm({ onSubmit, onCancel, isSubmitting }) {
  // Get today's date for max date validation
  const today = toISODateString(new Date());

  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    amount: '',
    invoiceDate: today,
    paymentTerms: '30'
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Track which fields have been touched (for showing errors)
  const [touched, setTouched] = useState({});

  /**
   * Calculate due date based on invoice date and payment terms
   */
  const calculatedDueDate = useMemo(() => {
    if (!formData.invoiceDate || !formData.paymentTerms) {
      return '';
    }
    const dueDate = calculateDueDate(formData.invoiceDate, Number(formData.paymentTerms));
    return dueDate || '';
  }, [formData.invoiceDate, formData.paymentTerms]);

  /**
   * Validate a single field
   */
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'customerName':
        if (!value || !value.trim()) {
          return 'Customer name is required';
        }
        if (value.trim().length < VALIDATION.CUSTOMER_NAME.MIN_LENGTH) {
          return `Customer name must be at least ${VALIDATION.CUSTOMER_NAME.MIN_LENGTH} characters`;
        }
        if (value.trim().length > VALIDATION.CUSTOMER_NAME.MAX_LENGTH) {
          return `Customer name must be less than ${VALIDATION.CUSTOMER_NAME.MAX_LENGTH} characters`;
        }
        return '';

      case 'amount':
        if (!value && value !== 0) {
          return 'Amount is required';
        }
        const numAmount = Number(value);
        if (isNaN(numAmount)) {
          return 'Amount must be a valid number';
        }
        if (numAmount <= 0) {
          return 'Amount must be a positive number';
        }
        if (numAmount > VALIDATION.AMOUNT.MAX) {
          return 'Amount cannot exceed ₹1,00,00,000';
        }
        return '';

      case 'invoiceDate':
        if (!value) {
          return 'Invoice date is required';
        }
        if (value > today) {
          return 'Invoice date cannot be in the future';
        }
        return '';

      case 'paymentTerms':
        if (!value) {
          return 'Please select payment terms';
        }
        return '';

      default:
        return '';
    }
  }, [today]);

  /**
   * Handle input change
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  /**
   * Handle input blur (for validation on touch)
   */
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate the field
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [validateField]);

  /**
   * Check if form is valid
   */
  const isFormValid = useMemo(() => {
    const validation = validateInvoice(formData);
    return validation.isValid;
  }, [formData]);

  /**
   * Handle form submit
   */
  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    // Mark all fields as touched
    setTouched({
      customerName: true,
      amount: true,
      invoiceDate: true,
      paymentTerms: true
    });

    // If errors exist, set them and don't submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit the form
    onSubmit({
      customerName: formData.customerName.trim(),
      amount: Number(formData.amount),
      invoiceDate: formData.invoiceDate,
      paymentTerms: Number(formData.paymentTerms)
    });
  }, [formData, validateField, onSubmit]);

  /**
   * Reset form when opened
   */
  useEffect(() => {
    setFormData({
      customerName: '',
      amount: '',
      invoiceDate: today,
      paymentTerms: '30'
    });
    setErrors({});
    setTouched({});
  }, [today]);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-6">
        {/* Customer Name */}
        <div>
          <label
            htmlFor="customerName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Customer Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter customer name"
            className={`
              w-full px-4 py-3
              text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500
              bg-white dark:bg-gray-700
              border rounded-xl
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
              hover:border-gray-400 dark:hover:border-gray-500
              transition-all duration-200
              shadow-sm
              ${touched.customerName && errors.customerName
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-200 dark:border-gray-600'
              }
            `}
            aria-invalid={touched.customerName && errors.customerName ? 'true' : 'false'}
            aria-describedby={errors.customerName ? 'customerName-error' : undefined}
          />
          {touched.customerName && errors.customerName && (
            <p id="customerName-error" className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
              {errors.customerName}
            </p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Invoice Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <IndianRupee className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter amount"
              min="1"
              max={VALIDATION.AMOUNT.MAX}
              className={`
                w-full pl-11 pr-4 py-3
                text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500
                bg-white dark:bg-gray-700
                border rounded-xl
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                hover:border-gray-400 dark:hover:border-gray-500
                transition-all duration-200
                shadow-sm
                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                ${touched.amount && errors.amount
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 dark:border-gray-600'
                }
              `}
              aria-invalid={touched.amount && errors.amount ? 'true' : 'false'}
              aria-describedby={errors.amount ? 'amount-error' : undefined}
            />
          </div>
          {touched.amount && errors.amount && (
            <p id="amount-error" className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
              {errors.amount}
            </p>
          )}
        </div>

        {/* Invoice Date and Payment Terms - Side by Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Invoice Date */}
          <div>
            <label
              htmlFor="invoiceDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Invoice Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                id="invoiceDate"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleChange}
                onBlur={handleBlur}
                max={today}
                className={`
                  w-full px-4 py-3
                  text-base text-gray-900 dark:text-gray-100
                  bg-white dark:bg-gray-700
                  border rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                  hover:border-gray-400 dark:hover:border-gray-500
                  transition-all duration-200
                  shadow-sm
                  ${touched.invoiceDate && errors.invoiceDate
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 dark:border-gray-600'
                  }
                `}
                aria-invalid={touched.invoiceDate && errors.invoiceDate ? 'true' : 'false'}
                aria-describedby={errors.invoiceDate ? 'invoiceDate-error' : undefined}
              />
            </div>
            {touched.invoiceDate && errors.invoiceDate && (
              <p id="invoiceDate-error" className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.invoiceDate}
              </p>
            )}
          </div>

          {/* Payment Terms - Custom Dropdown */}
          <div>
            <label
              htmlFor="paymentTerms"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Payment Terms <span className="text-red-500">*</span>
            </label>
            <CustomDropdown
              name="paymentTerms"
              options={PAYMENT_TERMS_OPTIONS}
              value={formData.paymentTerms}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched.paymentTerms}
              error={errors.paymentTerms}
            />
          </div>
        </div>

        {/* Calculated Due Date (Read-only) */}
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Due Date <span className="text-gray-400 dark:text-gray-500">(auto-calculated)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              id="dueDate"
              value={calculatedDueDate ? formatDate(calculatedDueDate) : '—'}
              readOnly
              disabled
              className="w-full pl-11 pr-4 py-3 text-base text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl cursor-not-allowed shadow-sm"
              aria-label="Calculated due date"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Due date is calculated as Invoice Date + Payment Terms
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-5 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
          aria-label="Cancel and close form"
          className="py-2.5 px-6 text-sm"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={!isFormValid || isSubmitting}
          aria-label="Add invoice"
          className="py-2.5 px-6 text-sm"
        >
          {isSubmitting ? 'Adding...' : 'Add Invoice'}
        </Button>
      </div>
    </form>
  );
}

CustomDropdown.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  touched: PropTypes.bool,
  onBlur: PropTypes.func
};

AddInvoiceForm.propTypes = {
  /** Callback when form is submitted successfully with form data */
  onSubmit: PropTypes.func.isRequired,
  /** Callback when form is cancelled */
  onCancel: PropTypes.func.isRequired,
  /** Whether the form is currently being submitted */
  isSubmitting: PropTypes.bool
};

AddInvoiceForm.defaultProps = {
  isSubmitting: false
};

export default memo(AddInvoiceForm);
