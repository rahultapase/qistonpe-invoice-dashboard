import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { Calendar, IndianRupee } from 'lucide-react';
import { Button } from '../UI';
import { calculateDueDate, formatDate, toISODateString } from '../../utils/dateUtils';
import { validateInvoice } from '../../utils/invoiceUtils';
import { PAYMENT_TERMS_OPTIONS, VALIDATION } from '../../constants/invoiceConstants';

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
      <div className="space-y-5">
        {/* Customer Name */}
        <div>
          <label 
            htmlFor="customerName" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
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
              w-full px-4 py-2.5 
              text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500
              bg-white dark:bg-gray-700
              border rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-colors duration-200
              ${touched.customerName && errors.customerName 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600'
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
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Invoice Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IndianRupee className="h-4 w-4 text-gray-400" />
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
                w-full pl-10 pr-4 py-2.5 
                text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500
                bg-white dark:bg-gray-700
                border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-colors duration-200
                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                ${touched.amount && errors.amount 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Invoice Date */}
          <div>
            <label 
              htmlFor="invoiceDate" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
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
                  w-full px-4 py-2.5 
                  text-gray-900 dark:text-gray-100
                  bg-white dark:bg-gray-700
                  border rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition-colors duration-200
                  ${touched.invoiceDate && errors.invoiceDate 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
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

          {/* Payment Terms */}
          <div>
            <label 
              htmlFor="paymentTerms" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Payment Terms <span className="text-red-500">*</span>
            </label>
            <select
              id="paymentTerms"
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`
                w-full px-4 py-2.5 
                text-gray-900 dark:text-gray-100
                bg-white dark:bg-gray-700 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-colors duration-200
                cursor-pointer
                ${touched.paymentTerms && errors.paymentTerms 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
                }
              `}
              aria-invalid={touched.paymentTerms && errors.paymentTerms ? 'true' : 'false'}
              aria-describedby={errors.paymentTerms ? 'paymentTerms-error' : undefined}
            >
              {PAYMENT_TERMS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {touched.paymentTerms && errors.paymentTerms && (
              <p id="paymentTerms-error" className="mt-1 text-sm text-red-600">
                {errors.paymentTerms}
              </p>
            )}
          </div>
        </div>

        {/* Calculated Due Date (Read-only) */}
        <div>
          <label 
            htmlFor="dueDate" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Due Date <span className="text-gray-400 dark:text-gray-500">(auto-calculated)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              id="dueDate"
              value={calculatedDueDate ? formatDate(calculatedDueDate) : '—'}
              readOnly
              disabled
              className="w-full pl-10 pr-4 py-2.5 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-not-allowed"
              aria-label="Calculated due date"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Due date is calculated as Invoice Date + Payment Terms
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
          aria-label="Cancel and close form"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={!isFormValid || isSubmitting}
          aria-label="Add invoice"
        >
          {isSubmitting ? 'Adding...' : 'Add Invoice'}
        </Button>
      </div>
    </form>
  );
}

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
