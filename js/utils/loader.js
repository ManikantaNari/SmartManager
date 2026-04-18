// Loader Utility

import { DOM } from './dom.js';

export const Loader = {
    /**
     * Show loader in a container
     * @param {string|HTMLElement} container - Container ID or element
     * @param {string} message - Optional loading message
     */
    show(container, message = 'Loading...') {
        const el = typeof container === 'string' ? DOM.get(container) : container;
        if (!el) return;

        // Store original content
        el.dataset.originalContent = el.innerHTML;

        el.innerHTML = `
            <div class="loader-container">
                <div class="loader-spinner"></div>
                <p class="loader-text">${message}</p>
            </div>
        `;
    },

    /**
     * Hide loader and restore content (if render function not provided)
     * @param {string|HTMLElement} container - Container ID or element
     */
    hide(container) {
        const el = typeof container === 'string' ? DOM.get(container) : container;
        if (!el) return;

        // Restore original content if exists
        if (el.dataset.originalContent !== undefined) {
            el.innerHTML = el.dataset.originalContent;
            delete el.dataset.originalContent;
        }
    },

    /**
     * Show loader, execute async function, then hide loader
     * @param {string|HTMLElement} container - Container ID or element
     * @param {Function} asyncFn - Async function to execute
     * @param {string} message - Optional loading message
     */
    async wrap(container, asyncFn, message = 'Loading...') {
        this.show(container, message);
        try {
            await asyncFn();
        } finally {
            // Don't restore - asyncFn should have rendered new content
        }
    },

    /**
     * Create inline loader (doesn't replace content)
     * @param {string|HTMLElement} container - Container ID or element
     */
    showInline(container) {
        const el = typeof container === 'string' ? DOM.get(container) : container;
        if (!el) return;

        const loader = document.createElement('div');
        loader.className = 'loader-inline';
        loader.innerHTML = '<div class="loader-spinner-small"></div>';
        el.appendChild(loader);
    },

    /**
     * Remove inline loader
     * @param {string|HTMLElement} container - Container ID or element
     */
    hideInline(container) {
        const el = typeof container === 'string' ? DOM.get(container) : container;
        if (!el) return;

        const loader = el.querySelector('.loader-inline');
        if (loader) loader.remove();
    }
};
