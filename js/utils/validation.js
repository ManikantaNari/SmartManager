// Validation Utility Functions
// Centralized validation logic for consistent error handling

/**
 * Validators provide reusable validation functions
 * Each validator returns { valid: boolean, error?: string, value?: any }
 * This allows consistent error handling across the app
 */
export const Validators = {
    /**
     * Validate required field
     * @param {*} value - Value to validate
     * @param {string} fieldName - Field name for error message
     * @returns {{valid: boolean, error?: string}}
     */
    required(value, fieldName = 'Field') {
        const trimmed = String(value || '').trim();
        if (!trimmed) {
            return { valid: false, error: `${fieldName} is required` };
        }
        return { valid: true };
    },

    /**
     * Validate phone number (10 digits)
     * @param {string} value - Phone number
     * @returns {{valid: boolean, error?: string, value?: string}}
     */
    phone(value) {
        if (!value) {
            return { valid: true }; // Optional field
        }

        const cleaned = String(value).replace(/\D/g, '');

        if (cleaned.length !== 10) {
            return {
                valid: false,
                error: 'Phone number must be 10 digits'
            };
        }

        return { valid: true, value: cleaned };
    },

    /**
     * Validate email format
     * @param {string} value - Email address
     * @returns {{valid: boolean, error?: string}}
     */
    email(value) {
        if (!value) {
            return { valid: true }; // Optional field
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
            return {
                valid: false,
                error: 'Invalid email format'
            };
        }

        return { valid: true };
    },

    /**
     * Validate positive number
     * @param {*} value - Value to validate
     * @param {string} fieldName - Field name for error message
     * @returns {{valid: boolean, error?: string, value?: number}}
     */
    positiveNumber(value, fieldName = 'Value') {
        const num = parseFloat(value);

        if (isNaN(num) || num <= 0) {
            return {
                valid: false,
                error: `${fieldName} must be a positive number`
            };
        }

        return { valid: true, value: num };
    },

    /**
     * Validate non-negative number (0 or positive)
     * @param {*} value - Value to validate
     * @param {string} fieldName - Field name for error message
     * @returns {{valid: boolean, error?: string, value?: number}}
     */
    nonNegativeNumber(value, fieldName = 'Value') {
        const num = parseFloat(value);

        if (isNaN(num) || num < 0) {
            return {
                valid: false,
                error: `${fieldName} cannot be negative`
            };
        }

        return { valid: true, value: num };
    },

    /**
     * Validate positive integer
     * @param {*} value - Value to validate
     * @param {string} fieldName - Field name for error message
     * @returns {{valid: boolean, error?: string, value?: number}}
     */
    positiveInteger(value, fieldName = 'Value') {
        const num = parseInt(value);

        if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
            return {
                valid: false,
                error: `${fieldName} must be a positive whole number`
            };
        }

        return { valid: true, value: num };
    },

    /**
     * Validate minimum value
     * @param {*} value - Value to validate
     * @param {number} min - Minimum value
     * @param {string} fieldName - Field name for error message
     * @returns {{valid: boolean, error?: string, value?: number}}
     */
    minValue(value, min, fieldName = 'Value') {
        const num = parseFloat(value);

        if (isNaN(num) || num < min) {
            return {
                valid: false,
                error: `${fieldName} must be at least ${min}`
            };
        }

        return { valid: true, value: num };
    },

    /**
     * Validate maximum value
     * @param {*} value - Value to validate
     * @param {number} max - Maximum value
     * @param {string} fieldName - Field name for error message
     * @returns {{valid: boolean, error?: string, value?: number}}
     */
    maxValue(value, max, fieldName = 'Value') {
        const num = parseFloat(value);

        if (isNaN(num) || num > max) {
            return {
                valid: false,
                error: `${fieldName} cannot exceed ${max}`
            };
        }

        return { valid: true, value: num };
    },

    /**
     * Validate value is within range
     * @param {*} value - Value to validate
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @param {string} fieldName - Field name for error message
     * @returns {{valid: boolean, error?: string, value?: number}}
     */
    range(value, min, max, fieldName = 'Value') {
        const num = parseFloat(value);

        if (isNaN(num) || num < min || num > max) {
            return {
                valid: false,
                error: `${fieldName} must be between ${min} and ${max}`
            };
        }

        return { valid: true, value: num };
    },

    /**
     * Validate string length
     * @param {string} value - String to validate
     * @param {number} minLength - Minimum length
     * @param {number} maxLength - Maximum length (optional)
     * @param {string} fieldName - Field name for error message
     * @returns {{valid: boolean, error?: string}}
     */
    length(value, minLength, maxLength = Infinity, fieldName = 'Field') {
        const str = String(value || '');

        if (str.length < minLength) {
            return {
                valid: false,
                error: `${fieldName} must be at least ${minLength} characters`
            };
        }

        if (str.length > maxLength) {
            return {
                valid: false,
                error: `${fieldName} cannot exceed ${maxLength} characters`
            };
        }

        return { valid: true };
    },

    /**
     * Validate PIN (5 digits)
     * @param {string} value - PIN value
     * @returns {{valid: boolean, error?: string}}
     */
    pin(value) {
        const cleaned = String(value || '').replace(/\D/g, '');

        if (cleaned.length !== 5) {
            return {
                valid: false,
                error: 'PIN must be exactly 5 digits'
            };
        }

        return { valid: true, value: cleaned };
    },

    /**
     * Validate date format (YYYY-MM-DD)
     * @param {string} value - Date string
     * @returns {{valid: boolean, error?: string}}
     */
    isoDate(value) {
        if (!value) {
            return { valid: false, error: 'Date is required' };
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!dateRegex.test(value)) {
            return {
                valid: false,
                error: 'Invalid date format (expected YYYY-MM-DD)'
            };
        }

        // Check if it's a valid date
        const date = new Date(value + 'T00:00:00');
        if (isNaN(date.getTime())) {
            return {
                valid: false,
                error: 'Invalid date'
            };
        }

        return { valid: true };
    },

    /**
     * Validate date is not in the past
     * @param {string} value - ISO date string
     * @param {string} fieldName - Field name for error message
     * @returns {{valid: boolean, error?: string}}
     */
    futureDate(value, fieldName = 'Date') {
        const dateCheck = this.isoDate(value);
        if (!dateCheck.valid) return dateCheck;

        const today = new Date().toISOString().split('T')[0];

        if (value < today) {
            return {
                valid: false,
                error: `${fieldName} cannot be in the past`
            };
        }

        return { valid: true };
    },

    /**
     * Validate multiple fields at once
     * Returns first error found, or { valid: true } if all pass
     * @param {Array<{validator: Function, args: Array, fieldName: string}>} checks
     * @returns {{valid: boolean, error?: string, field?: string}}
     */
    validateAll(checks) {
        for (const check of checks) {
            const result = check.validator(...check.args);
            if (!result.valid) {
                return {
                    ...result,
                    field: check.fieldName
                };
            }
        }
        return { valid: true };
    }
};

/**
 * Form validation helper
 * Validates form and shows errors
 */
export const FormValidator = {
    /**
     * Validate a form field and show error
     * @param {HTMLElement} inputElement - Input element
     * @param {Function} validator - Validator function
     * @param {...any} args - Validator arguments
     * @returns {{valid: boolean, error?: string, value?: any}}
     */
    validateField(inputElement, validator, ...args) {
        if (!inputElement) {
            return { valid: false, error: 'Input element not found' };
        }

        const result = validator(inputElement.value, ...args);

        // Clear previous error
        this.clearError(inputElement);

        if (!result.valid) {
            this.showError(inputElement, result.error);
        }

        return result;
    },

    /**
     * Show error message on input field
     * @param {HTMLElement} inputElement - Input element
     * @param {string} errorMessage - Error message
     */
    showError(inputElement, errorMessage) {
        if (!inputElement) return;

        // Add error class to input
        inputElement.classList.add('input-error');

        // Create or update error message element
        let errorEl = inputElement.parentElement?.querySelector('.field-error');

        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'field-error';
            inputElement.parentElement?.appendChild(errorEl);
        }

        errorEl.textContent = errorMessage;
        errorEl.style.display = 'block';
    },

    /**
     * Clear error from input field
     * @param {HTMLElement} inputElement - Input element
     */
    clearError(inputElement) {
        if (!inputElement) return;

        inputElement.classList.remove('input-error');

        const errorEl = inputElement.parentElement?.querySelector('.field-error');
        if (errorEl) {
            errorEl.style.display = 'none';
        }
    },

    /**
     * Clear all errors in a form
     * @param {HTMLElement} formElement - Form element
     */
    clearAllErrors(formElement) {
        if (!formElement) return;

        formElement.querySelectorAll('.input-error').forEach(input => {
            input.classList.remove('input-error');
        });

        formElement.querySelectorAll('.field-error').forEach(error => {
            error.style.display = 'none';
        });
    }
};
