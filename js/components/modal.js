// Modal Component

import { DOM } from '../utils/index.js';

export const Modal = {
    show(id) {
        const el = DOM.get(id);
        if (el) DOM.addClass(el, 'show');
    },

    hide(id) {
        const el = DOM.get(id);
        if (el) DOM.removeClass(el, 'show');
    },

    // Setup close on overlay click
    initCloseOnOverlay(id) {
        const overlay = DOM.get(id);
        if (!overlay) return;
        DOM.onClick(overlay, (e) => {
            if (e.target === overlay) this.hide(id);
        });
    }
};
