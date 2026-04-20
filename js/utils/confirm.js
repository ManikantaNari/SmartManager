// Confirmation Dialog Utility

import { SVG_ICONS } from '../config/icons.js';
import { Keyboard } from './keyboard.js';

export const Confirm = {
    /**
     * Show confirmation dialog
     * @param {Object} options - Confirmation options
     * @returns {Promise<boolean>} True if confirmed, false if cancelled
     */
    show(options = {}) {
        const {
            title = 'Confirm Action',
            message = 'Are you sure you want to proceed?',
            confirmText = 'Confirm',
            cancelText = 'Cancel',
            type = 'danger', // 'danger', 'warning', 'info'
            icon = null
        } = options;

        return new Promise((resolve) => {
            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'confirm-overlay';

            // Create dialog
            const dialog = document.createElement('div');
            dialog.className = `confirm-dialog confirm-${type}`;
            dialog.setAttribute('role', 'alertdialog');
            dialog.setAttribute('aria-labelledby', 'confirm-title');
            dialog.setAttribute('aria-describedby', 'confirm-message');

            // Build dialog HTML
            dialog.innerHTML = `
                <div class="confirm-icon">
                    ${icon || this.getDefaultIcon(type)}
                </div>
                <h3 class="confirm-title" id="confirm-title">${title}</h3>
                <p class="confirm-message" id="confirm-message">${message}</p>
                <div class="confirm-actions">
                    <button class="btn btn-outline confirm-cancel" data-action="cancel">
                        ${cancelText}
                    </button>
                    <button class="btn btn-${type} confirm-confirm" data-action="confirm">
                        ${confirmText}
                    </button>
                </div>
            `;

            // Assemble
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            // Handle actions
            const handleAction = (confirmed) => {
                // Clean up focus trap
                if (cleanup) cleanup();

                // Animate out
                overlay.classList.add('confirm-closing');
                setTimeout(() => {
                    overlay.remove();
                    resolve(confirmed);
                }, 200);
            };

            // Button handlers
            dialog.querySelector('[data-action="confirm"]').onclick = () => handleAction(true);
            dialog.querySelector('[data-action="cancel"]').onclick = () => handleAction(false);

            // Overlay click = cancel
            overlay.onclick = (e) => {
                if (e.target === overlay) handleAction(false);
            };

            // Show with animation
            setTimeout(() => overlay.classList.add('confirm-show'), 10);

            // Enable focus trap with Escape key
            const cleanup = Keyboard.enableFocusTrap(dialog, {
                onEscape: () => handleAction(false)
            });

            // Announce to screen readers
            Keyboard.announce(`Confirmation required: ${title}. ${message}`, 'assertive');
        });
    },

    /**
     * Get default icon for confirmation type
     */
    getDefaultIcon(type) {
        const icons = {
            danger: `<svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>`,
            warning: `<svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>`,
            info: `<svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>`
        };
        return icons[type] || icons.info;
    },

    /**
     * Convenience method for destructive actions
     */
    async delete(itemName, additionalMessage = '') {
        return this.show({
            title: 'Delete ' + itemName + '?',
            message: `This will permanently delete ${itemName}.${additionalMessage ? ' ' + additionalMessage : ''} This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger'
        });
    },

    /**
     * Convenience method for warnings
     */
    async warn(title, message) {
        return this.show({
            title,
            message,
            confirmText: 'Continue',
            cancelText: 'Cancel',
            type: 'warning'
        });
    }
};
