// Template Rendering Engine

import { DOM } from './dom.js';

export const Template = {
    cache: {},

    // Get and cache template element
    get(id) {
        if (!this.cache[id]) {
            const tpl = DOM.get(id);
            if (!tpl) {
                console.error(`Template not found: ${id}`);
                return null;
            }
            this.cache[id] = tpl;
        }
        return this.cache[id];
    },

    // Clone template content
    clone(id) {
        const tpl = this.get(id);
        return tpl ? tpl.content.cloneNode(true) : null;
    },

    // Render template with data
    render(id, data, options = {}) {
        const fragment = this.clone(id);
        if (!fragment) return document.createDocumentFragment();

        // Fill data-field elements
        Object.entries(data).forEach(([key, value]) => {
            const el = fragment.querySelector(`[data-field="${key}"]`);
            if (el) {
                if (value === null || value === undefined) {
                    el.textContent = '';
                } else if (typeof value === 'object' && value.html) {
                    el.innerHTML = value.html;
                } else {
                    el.textContent = value;
                }
            }
        });

        // Set data attributes on root element
        if (options.dataAttrs) {
            const root = fragment.querySelector('[data-value], [data-key], [data-index], [data-phone], [data-sale-id], [data-name]')
                        || fragment.firstElementChild;
            if (root) {
                Object.entries(options.dataAttrs).forEach(([key, val]) => {
                    root.dataset[key] = val;
                });
            }
        }

        // Add CSS classes
        if (options.classes) {
            const root = fragment.firstElementChild;
            if (root) {
                options.classes.forEach(cls => root.classList.add(cls));
            }
        }

        return fragment;
    },

    // Render list of items
    renderList(id, items, mapper) {
        const fragment = document.createDocumentFragment();
        items.forEach((item, index) => {
            const { data, options } = mapper(item, index);
            fragment.appendChild(this.render(id, data, options));
        });
        return fragment;
    },

    // Render template into container
    renderTo(containerId, templateId, data, options) {
        const container = DOM.get(containerId);
        if (!container) return;
        DOM.clear(container);
        container.appendChild(this.render(templateId, data, options));
    },

    // Render list into container with empty state fallback
    renderListTo(containerId, templateId, items, mapper, emptyMessage = 'No items') {
        const container = DOM.get(containerId);
        if (!container) return;
        DOM.clear(container);

        if (!items || items.length === 0) {
            container.appendChild(this.render('tpl-empty', {
                title: '',
                message: emptyMessage
            }));
            return;
        }
        container.appendChild(this.renderList(templateId, items, mapper));
    }
};
