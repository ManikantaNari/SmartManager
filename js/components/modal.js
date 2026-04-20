// Modal Component

import { DOM, Keyboard } from '../utils/index.js';

// Store active focus traps
const activeFocusTraps = new Map();

export const Modal = {
    show(id) {
        const el = DOM.get(id);
        if (!el) return;

        DOM.addClass(el, 'show');

        // Enable focus trap
        const modalContent = el.querySelector('.modal');
        if (modalContent) {
            const cleanup = Keyboard.enableFocusTrap(modalContent, {
                onEscape: () => this.hide(id)
            });
            activeFocusTraps.set(id, cleanup);
        }

        // Announce to screen readers
        Keyboard.announce(`Modal opened: ${id.replace(/Modal$/, '')}`);
    },

    hide(id) {
        const el = DOM.get(id);
        if (!el) return;

        DOM.removeClass(el, 'show');

        // Clean up focus trap
        const cleanup = activeFocusTraps.get(id);
        if (cleanup) {
            cleanup();
            activeFocusTraps.delete(id);
        }

        // Announce to screen readers
        Keyboard.announce(`Modal closed`);
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
