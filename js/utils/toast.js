// Toast Notification Utility

import { DOM } from './dom.js';
import { SVG_ICONS } from '../config/icons.js';

export const Toast = {
    /**
     * Calculate duration based on message length
     * Short messages: 2s, Medium: 3s, Long: 4s, Very long: 5s
     */
    calculateDuration(message) {
        const length = message.length;
        if (length < 20) return 2000;
        if (length < 40) return 3000;
        if (length < 60) return 4000;
        return 5000;
    },

    /**
     * Show a toast notification
     * @param {string} message - Message to display
     * @param {Object} options - Toast options
     */
    show(message, options = {}) {
        const {
            type = 'default', // 'default', 'success', 'error', 'warning', 'info'
            duration = this.calculateDuration(message),
            dismissible = true
        } = options;

        // Remove existing toast if any
        const existing = DOM.find('.toast');
        if (existing) existing.remove();

        // Create new toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        // Add icon based on type
        const icon = this.getIcon(type);
        if (icon) {
            const iconEl = document.createElement('span');
            iconEl.className = 'toast-icon';
            iconEl.innerHTML = icon;
            toast.appendChild(iconEl);
        }

        // Add message
        const messageEl = document.createElement('span');
        messageEl.className = 'toast-message';
        messageEl.textContent = message;
        toast.appendChild(messageEl);

        // Add dismiss button
        if (dismissible) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'toast-close';
            closeBtn.innerHTML = SVG_ICONS.CLOSE;
            closeBtn.setAttribute('aria-label', 'Dismiss notification');
            closeBtn.onclick = () => this.dismiss(toast);
            toast.appendChild(closeBtn);
        }

        // Add to page
        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('toast-show'), 10);

        // Auto-remove
        const timeoutId = setTimeout(() => this.dismiss(toast), duration);

        // Store timeout ID for manual dismiss
        toast.dataset.timeoutId = timeoutId;
    },

    /**
     * Dismiss a toast
     */
    dismiss(toast) {
        if (!toast) return;

        // Clear auto-dismiss timeout
        if (toast.dataset.timeoutId) {
            clearTimeout(parseInt(toast.dataset.timeoutId));
        }

        // Animate out
        toast.classList.remove('toast-show');
        toast.classList.add('toast-hide');

        // Remove after animation
        setTimeout(() => toast.remove(), 300);
    },

    /**
     * Get icon SVG for toast type
     */
    getIcon(type) {
        const icons = {
            success: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>`,
            error: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>`,
            warning: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>`,
            info: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>`
        };
        return icons[type] || null;
    },

    // Convenience methods
    success(message, options = {}) {
        this.show(message, { ...options, type: 'success' });
    },

    error(message, options = {}) {
        this.show(message, { ...options, type: 'error' });
    },

    warning(message, options = {}) {
        this.show(message, { ...options, type: 'warning' });
    },

    info(message, options = {}) {
        this.show(message, { ...options, type: 'info' });
    }
};
