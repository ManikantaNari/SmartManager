// Navigation Module

import { DOM } from '../utils';

// Page render callbacks - will be set by app.js
let pageCallbacks = {};

export const Navigation = {
    pageMap: { 'dashboard': 0, 'sale': 1, 'inventory': 2, 'customers': 3, 'reports': 4 },

    init() {
        // Bottom nav clicks handled via HTML onclick
    },

    // Register page render callbacks
    setPageCallbacks(callbacks) {
        pageCallbacks = callbacks;
    },

    showPage(pageId) {
        // Hide all pages and deactivate nav items
        DOM.findAll('.page').forEach(p => DOM.removeClass(p, 'active'));
        DOM.findAll('.nav-item').forEach(n => DOM.removeClass(n, 'active'));

        // Show selected page
        DOM.addClass(DOM.get('page-' + pageId), 'active');

        // Activate nav item
        const navIndex = this.pageMap[pageId];
        if (navIndex !== undefined) {
            DOM.addClass(DOM.findAll('.nav-item')[navIndex], 'active');
        }

        // Trigger page-specific render
        if (pageCallbacks[pageId]) {
            pageCallbacks[pageId]();
        }
    },

    showSettings() {
        DOM.findAll('.page').forEach(p => DOM.removeClass(p, 'active'));
        DOM.addClass(DOM.get('page-settings'), 'active');
    }
};
