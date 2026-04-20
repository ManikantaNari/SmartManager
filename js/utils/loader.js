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
    },

    /**
     * Show skeleton screen
     * @param {string|HTMLElement} container - Container ID or element
     * @param {Object} options - Skeleton options
     */
    showSkeleton(container, options = {}) {
        const {
            type = 'list', // 'list', 'card', 'grid', 'custom'
            count = 3,
            template = null
        } = options;

        const el = typeof container === 'string' ? DOM.get(container) : container;
        if (!el) return;

        // Store original content
        el.dataset.originalContent = el.innerHTML;

        let skeletonHTML = '';

        if (template) {
            // Custom template
            skeletonHTML = template;
        } else if (type === 'list') {
            // List skeleton
            for (let i = 0; i < count; i++) {
                skeletonHTML += `
                    <div class="skeleton-item">
                        <div class="skeleton-avatar"></div>
                        <div class="skeleton-content">
                            <div class="skeleton-line" style="width: 70%;"></div>
                            <div class="skeleton-line" style="width: 50%;"></div>
                        </div>
                    </div>
                `;
            }
        } else if (type === 'card') {
            // Card skeleton
            for (let i = 0; i < count; i++) {
                skeletonHTML += `
                    <div class="skeleton-card">
                        <div class="skeleton-rect" style="height: 120px;"></div>
                        <div class="skeleton-line" style="width: 80%; margin-top: 12px;"></div>
                        <div class="skeleton-line" style="width: 60%;"></div>
                    </div>
                `;
            }
        } else if (type === 'grid') {
            // Grid skeleton
            for (let i = 0; i < count; i++) {
                skeletonHTML += `
                    <div class="skeleton-grid-item">
                        <div class="skeleton-rect" style="height: 80px;"></div>
                        <div class="skeleton-line" style="width: 70%; margin-top: 8px;"></div>
                    </div>
                `;
            }
        }

        el.innerHTML = `<div class="skeleton-container">${skeletonHTML}</div>`;
    },

    /**
     * Hide skeleton and restore content
     * @param {string|HTMLElement} container - Container ID or element
     */
    hideSkeleton(container) {
        this.hide(container); // Same as hide()
    },

    /**
     * Show skeleton, execute async function, then show content
     * @param {string|HTMLElement} container - Container ID or element
     * @param {Function} asyncFn - Async function to execute
     * @param {Object} options - Skeleton options
     */
    async wrapSkeleton(container, asyncFn, options = {}) {
        this.showSkeleton(container, options);
        try {
            await asyncFn();
        } catch (error) {
            // Error handling - restore original content
            this.hideSkeleton(container);
            throw error;
        }
    }
};
