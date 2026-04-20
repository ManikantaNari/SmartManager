// Keyboard Navigation Utility
// Provides consistent keyboard navigation patterns across the application

export const Keyboard = {
    /**
     * Enable arrow key navigation in a grid container
     * @param {HTMLElement} container - Grid container element
     * @param {number} columnsPerRow - Number of columns in the grid
     * @param {Object} options - Configuration options
     */
    enableGridNavigation(container, columnsPerRow = 3, options = {}) {
        const {
            itemSelector = '[role="button"]',
            onActivate = null,
            wrapAround = true
        } = options;

        if (!container) return;

        const handleKeyDown = (e) => {
            const items = Array.from(container.querySelectorAll(itemSelector));
            const currentIndex = items.indexOf(document.activeElement);

            if (currentIndex === -1) return;

            let targetIndex = currentIndex;

            switch (e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    targetIndex = currentIndex + 1;
                    if (wrapAround && targetIndex >= items.length) targetIndex = 0;
                    break;

                case 'ArrowLeft':
                    e.preventDefault();
                    targetIndex = currentIndex - 1;
                    if (wrapAround && targetIndex < 0) targetIndex = items.length - 1;
                    break;

                case 'ArrowDown':
                    e.preventDefault();
                    targetIndex = currentIndex + columnsPerRow;
                    if (wrapAround && targetIndex >= items.length) {
                        targetIndex = targetIndex % items.length;
                    }
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    targetIndex = currentIndex - columnsPerRow;
                    if (wrapAround && targetIndex < 0) {
                        targetIndex = items.length + targetIndex;
                    }
                    break;

                case 'Home':
                    e.preventDefault();
                    targetIndex = 0;
                    break;

                case 'End':
                    e.preventDefault();
                    targetIndex = items.length - 1;
                    break;

                case 'Enter':
                case ' ':
                    e.preventDefault();
                    if (onActivate) {
                        onActivate(items[currentIndex]);
                    } else {
                        items[currentIndex].click();
                    }
                    return;

                default:
                    return;
            }

            // Focus the target item if it exists
            if (items[targetIndex]) {
                items[targetIndex].focus();
            }
        };

        container.addEventListener('keydown', handleKeyDown);

        // Return cleanup function
        return () => container.removeEventListener('keydown', handleKeyDown);
    },

    /**
     * Enable list navigation (up/down arrows)
     * @param {HTMLElement} container - List container element
     * @param {Object} options - Configuration options
     */
    enableListNavigation(container, options = {}) {
        const {
            itemSelector = '[role="button"], [role="option"]',
            onActivate = null,
            wrapAround = true
        } = options;

        if (!container) return;

        const handleKeyDown = (e) => {
            const items = Array.from(container.querySelectorAll(itemSelector));
            const currentIndex = items.indexOf(document.activeElement);

            if (currentIndex === -1) return;

            let targetIndex = currentIndex;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    targetIndex = currentIndex + 1;
                    if (wrapAround && targetIndex >= items.length) targetIndex = 0;
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    targetIndex = currentIndex - 1;
                    if (wrapAround && targetIndex < 0) targetIndex = items.length - 1;
                    break;

                case 'Home':
                    e.preventDefault();
                    targetIndex = 0;
                    break;

                case 'End':
                    e.preventDefault();
                    targetIndex = items.length - 1;
                    break;

                case 'Enter':
                case ' ':
                    e.preventDefault();
                    if (onActivate) {
                        onActivate(items[currentIndex]);
                    } else {
                        items[currentIndex].click();
                    }
                    return;

                default:
                    return;
            }

            if (items[targetIndex]) {
                items[targetIndex].focus();
            }
        };

        container.addEventListener('keydown', handleKeyDown);

        return () => container.removeEventListener('keydown', handleKeyDown);
    },

    /**
     * Implement focus trap for modals
     * @param {HTMLElement} modal - Modal element
     * @param {Object} options - Configuration options
     */
    enableFocusTrap(modal, options = {}) {
        const {
            initialFocusSelector = 'input, button, [tabindex]:not([tabindex="-1"])',
            onEscape = null
        } = options;

        if (!modal) return;

        const getFocusableElements = () => {
            return Array.from(modal.querySelectorAll(
                'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
            ));
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && onEscape) {
                e.preventDefault();
                onEscape();
                return;
            }

            if (e.key === 'Tab') {
                const focusableElements = getFocusableElements();

                if (focusableElements.length === 0) {
                    e.preventDefault();
                    return;
                }

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        // Focus first element when trap is enabled
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
            const initialFocus = modal.querySelector(initialFocusSelector) || focusableElements[0];
            if (initialFocus) {
                setTimeout(() => initialFocus.focus(), 100);
            }
        }

        modal.addEventListener('keydown', handleKeyDown);

        return () => modal.removeEventListener('keydown', handleKeyDown);
    },

    /**
     * Make an element keyboard accessible
     * @param {HTMLElement} element - Element to make accessible
     * @param {Function} onClick - Click handler
     * @param {Object} options - Configuration options
     */
    makeAccessible(element, onClick, options = {}) {
        const {
            role = 'button',
            label = null,
            tabindex = 0
        } = options;

        if (!element) return;

        element.setAttribute('role', role);
        element.setAttribute('tabindex', tabindex);
        if (label) element.setAttribute('aria-label', label);

        const handleKeyPress = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (onClick) onClick(e);
            }
        };

        element.addEventListener('keypress', handleKeyPress);

        return () => element.removeEventListener('keypress', handleKeyPress);
    },

    /**
     * Create skip link for keyboard navigation
     * @param {string} targetId - ID of target element to skip to
     * @param {string} text - Skip link text
     */
    createSkipLink(targetId, text = 'Skip to main content') {
        const skipLink = document.createElement('a');
        skipLink.href = `#${targetId}`;
        skipLink.className = 'skip-link';
        skipLink.textContent = text;
        skipLink.setAttribute('tabindex', '0');

        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById(targetId);
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        return skipLink;
    },

    /**
     * Announce message to screen readers
     * @param {string} message - Message to announce
     * @param {string} priority - 'polite' or 'assertive'
     */
    announce(message, priority = 'polite') {
        let announcer = document.getElementById('sr-announcer');

        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'sr-announcer';
            announcer.className = 'sr-only';
            announcer.setAttribute('role', 'status');
            announcer.setAttribute('aria-live', priority);
            announcer.setAttribute('aria-atomic', 'true');
            document.body.appendChild(announcer);
        }

        // Clear and set new message
        announcer.textContent = '';
        setTimeout(() => {
            announcer.textContent = message;
        }, 100);
    }
};
