// Toast Notification Utility

import { DOM } from './dom.js';

export const Toast = {
    show(message) {
        // Remove existing toast if any
        const existing = DOM.find('.toast');
        if (existing) existing.remove();

        // Create new toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Auto-remove after 3 seconds
        setTimeout(() => toast.remove(), 3000);
    }
};
