// Unsaved Changes Warning Utility

import { Confirm } from './confirm.js';

export const Unsaved = {
    // Track forms with unsaved changes
    dirtyForms: new Set(),

    /**
     * Mark a form as having unsaved changes
     * @param {string} formId - Form identifier
     */
    markDirty(formId) {
        this.dirtyForms.add(formId);
        this.enableWarning();
    },

    /**
     * Mark a form as saved (clean)
     * @param {string} formId - Form identifier
     */
    markClean(formId) {
        this.dirtyForms.delete(formId);
        if (this.dirtyForms.size === 0) {
            this.disableWarning();
        }
    },

    /**
     * Check if there are any unsaved changes
     * @returns {boolean}
     */
    hasDirty() {
        return this.dirtyForms.size > 0;
    },

    /**
     * Enable browser beforeunload warning
     */
    enableWarning() {
        window.addEventListener('beforeunload', this.handleBeforeUnload);
    },

    /**
     * Disable browser beforeunload warning
     */
    disableWarning() {
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
    },

    /**
     * Handle beforeunload event
     */
    handleBeforeUnload(e) {
        if (Unsaved.hasDirty()) {
            e.preventDefault();
            e.returnValue = ''; // Chrome requires returnValue to be set
            return '';
        }
    },

    /**
     * Track input changes in a form
     * @param {string|HTMLElement} form - Form element or ID
     * @param {string} formId - Unique form identifier
     */
    trackForm(form, formId) {
        const formEl = typeof form === 'string' ? document.getElementById(form) : form;
        if (!formEl) return;

        // Mark as dirty on any input change
        const handleInput = () => {
            this.markDirty(formId);
        };

        // Track all form inputs
        const inputs = formEl.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', handleInput);
            input.addEventListener('change', handleInput);
        });

        // Store cleanup function
        return () => {
            inputs.forEach(input => {
                input.removeEventListener('input', handleInput);
                input.removeEventListener('change', handleInput);
            });
            this.markClean(formId);
        };
    },

    /**
     * Confirm navigation if there are unsaved changes
     * @param {string} message - Custom warning message
     * @returns {Promise<boolean>} True if user confirms navigation
     */
    async confirmNavigation(message = 'You have unsaved changes.') {
        if (!this.hasDirty()) {
            return true;
        }

        return await Confirm.warn(
            'Unsaved Changes',
            `${message} Are you sure you want to leave?`
        );
    },

    /**
     * Wrap an action with unsaved changes check
     * @param {Function} action - Action to perform
     * @param {string} message - Custom warning message
     */
    async wrapAction(action, message) {
        const confirmed = await this.confirmNavigation(message);
        if (confirmed) {
            this.clear();
            await action();
        }
        return confirmed;
    },

    /**
     * Clear all dirty forms
     */
    clear() {
        this.dirtyForms.clear();
        this.disableWarning();
    },

    /**
     * Initialize unsaved changes tracking for the app
     */
    init() {
        // Clean up on page hide (for browser back button)
        window.addEventListener('pagehide', () => {
            this.clear();
        });
    }
};
