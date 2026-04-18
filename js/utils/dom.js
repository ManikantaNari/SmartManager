// DOM Utility Functions

export const DOM = {
    // Query helpers
    get: (id) => document.getElementById(id),
    find: (selector) => document.querySelector(selector),
    findAll: (selector) => [...document.querySelectorAll(selector)],

    // Visibility
    show: (el) => { if (el) el.style.display = 'block'; },
    hide: (el) => { if (el) el.style.display = 'none'; },
    toggle: (el, show) => { if (el) el.style.display = show ? 'block' : 'none'; },

    // Class manipulation
    addClass: (el, cls) => { if (el) el.classList.add(cls); },
    removeClass: (el, cls) => { if (el) el.classList.remove(cls); },
    toggleClass: (el, cls, force) => { if (el) el.classList.toggle(cls, force); },
    hasClass: (el, cls) => el && el.classList.contains(cls),

    // Content
    setText: (el, text) => { if (el) el.textContent = text; },
    setHtml: (el, html) => { if (el) el.innerHTML = html; },
    getValue: (el) => el ? el.value : '',
    setValue: (el, val) => { if (el) el.value = val; },
    clear: (el) => { if (el) el.innerHTML = ''; },

    // Event delegation
    on: (el, event, selector, handler) => {
        if (!el) return;
        el.addEventListener(event, (e) => {
            if (selector) {
                const target = e.target.closest(selector);
                if (target && el.contains(target)) handler(e, target);
            } else {
                handler(e, el);
            }
        });
    },

    // Simple click handler
    onClick: (el, handler) => {
        if (el) el.addEventListener('click', handler);
    }
};
