// Grid Utility Functions
// Reusable grid rendering logic for categories and variants

import { SVG_ICONS } from '../config/icons.js';
import { Format } from './format.js';
import { State } from '../state/index.js';
import { Keyboard } from './keyboard.js';

/**
 * GridUtil provides reusable grid rendering functions
 * Eliminates duplication between sales and inventory modules
 */
export const GridUtil = {
    /**
     * Create an edit button element
     * @param {string} ariaLabel - Accessible label for the button
     * @returns {HTMLButtonElement} Edit button element
     */
    createEditButton(ariaLabel = 'Edit') {
        const btn = document.createElement('button');
        btn.className = 'edit-btn';
        btn.innerHTML = SVG_ICONS.EDIT;
        btn.setAttribute('aria-label', ariaLabel);
        btn.setAttribute('type', 'button');
        return btn;
    },

    /**
     * Render category grid
     * @param {HTMLElement} container - Container element
     * @param {Object} products - Products object { category: [variants] }
     * @param {string} selectedCategory - Currently selected category
     * @param {Object} options - Rendering options
     * @param {boolean} options.showEdit - Show edit buttons (default: false)
     * @param {boolean} options.showAddButton - Show "Add New" button (default: false)
     * @param {Function} options.onSelect - Callback when category selected
     * @param {Function} options.onEdit - Callback when edit clicked
     * @param {Function} options.onAdd - Callback when add clicked
     */
    renderCategoryGrid(container, products, selectedCategory, options = {}) {
        const {
            showEdit = false,
            showAddButton = false,
            onSelect = null,
            onEdit = null,
            onAdd = null
        } = options;

        if (!container) return;

        // Clear container
        container.innerHTML = '';

        // Render each category
        Object.keys(products).forEach(category => {
            const btn = this.createCategoryButton(category, {
                selected: selectedCategory === category,
                showEdit: showEdit && State.isAdmin(),
                onSelect,
                onEdit
            });

            container.appendChild(btn);
        });

        // Add "Add New" button if needed
        if (showAddButton) {
            const addBtn = this.createAddButton('Add New', onAdd);
            container.appendChild(addBtn);
        }

        // Enable keyboard navigation (3 columns)
        Keyboard.enableGridNavigation(container, 3);
    },

    /**
     * Create a category button element
     * @param {string} category - Category name
     * @param {Object} options - Button options
     * @returns {HTMLElement} Category button element
     */
    createCategoryButton(category, options = {}) {
        const {
            selected = false,
            showEdit = false,
            onSelect = null,
            onEdit = null
        } = options;

        const btn = document.createElement('div');
        btn.className = 'category-btn';
        if (selected) btn.classList.add('active');
        btn.dataset.value = category;
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
        btn.setAttribute('aria-label', `Select ${category} category`);

        // Icon visual and label
        btn.innerHTML = `
            <div class="category-visual" aria-hidden="true">
                <div class="category-icon">${Format.categoryIcon(category)}</div>
                <div class="category-label">${category}</div>
            </div>
        `;

        // Add edit button if needed
        if (showEdit) {
            const editBtn = this.createEditButton(`Edit ${category} category`);
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (onEdit) onEdit(category);
            });
            btn.appendChild(editBtn);
        }

        // Add select handler
        if (onSelect) {
            btn.addEventListener('click', () => onSelect(category));
            btn.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(category);
                }
            });
        }

        return btn;
    },

    /**
     * Render variant grid
     * @param {HTMLElement} container - Container element
     * @param {Array<string>} variants - Array of variant names
     * @param {string} category - Parent category name
     * @param {Object} options - Rendering options
     * @param {boolean} options.showEdit - Show edit buttons (default: false)
     * @param {boolean} options.showStock - Show stock information (default: true)
     * @param {boolean} options.showPrice - Show price information (default: true)
     * @param {boolean} options.showAddButton - Show "Add New" button (default: false)
     * @param {Function} options.onSelect - Callback when variant selected
     * @param {Function} options.onEdit - Callback when edit clicked
     * @param {Function} options.onAdd - Callback when add clicked
     */
    renderVariantGrid(container, variants, category, options = {}) {
        const {
            showEdit = false,
            showStock = true,
            showPrice = true,
            showAddButton = false,
            onSelect = null,
            onEdit = null,
            onAdd = null
        } = options;

        if (!container) return;

        // Clear container
        container.innerHTML = '';

        // Render each variant
        variants.forEach(variant => {
            const btn = this.createVariantButton(variant, category, {
                showEdit: showEdit && State.isAdmin(),
                showStock,
                showPrice,
                onSelect,
                onEdit
            });

            container.appendChild(btn);
        });

        // Add "Add New" button if needed
        if (showAddButton) {
            const addBtn = this.createAddButton('Add New', onAdd);
            container.appendChild(addBtn);
        }

        // Enable keyboard navigation (2 columns)
        Keyboard.enableGridNavigation(container, 2);
    },

    /**
     * Create a variant button element
     * @param {string} variant - Variant name
     * @param {string} category - Parent category name
     * @param {Object} options - Button options
     * @returns {HTMLElement} Variant button element
     */
    createVariantButton(variant, category, options = {}) {
        const {
            showEdit = false,
            showStock = true,
            showPrice = true,
            onSelect = null,
            onEdit = null
        } = options;

        const key = `${category}|${variant}`;
        const inv = State.inventory[key] || { qty: 0, price: 0, alertQty: 0 };
        const isLow = inv.qty <= inv.alertQty;

        const btn = document.createElement('div');
        btn.className = 'variant-btn';
        if (isLow) btn.classList.add('low-stock');
        btn.dataset.value = variant;
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
        btn.setAttribute('aria-label', `Select ${variant} variant`);

        // Build HTML content
        let html = `<div class="name">${variant}</div>`;

        if (showPrice) {
            html += `<div class="price" data-field="price">${Format.currency(inv.price)}</div>`;
        }

        if (showStock) {
            html += `<div class="stock ${isLow ? 'low' : ''}" data-field="stock">Stock: ${inv.qty}</div>`;
        }

        btn.innerHTML = html;

        // Add edit button if needed
        if (showEdit) {
            const editBtn = this.createEditButton(`Edit ${variant} variant`);
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (onEdit) onEdit(category, variant);
            });
            btn.appendChild(editBtn);
        }

        // Add select handler
        if (onSelect) {
            btn.addEventListener('click', () => onSelect(variant));
            btn.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(variant);
                }
            });
        }

        return btn;
    },

    /**
     * Create an "Add New" button
     * @param {string} text - Button text
     * @param {Function} onClick - Click handler
     * @returns {HTMLElement} Add button element
     */
    createAddButton(text = 'Add New', onClick = null) {
        const btn = document.createElement('div');
        btn.className = 'category-btn add-new';
        btn.dataset.action = 'add';
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
        btn.setAttribute('aria-label', text);

        btn.innerHTML = `
            <div class="icon">+</div>
            <div>${text}</div>
        `;

        if (onClick) {
            btn.addEventListener('click', onClick);
            btn.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            });
        }

        return btn;
    },

    /**
     * Enable keyboard navigation for a grid
     * @param {HTMLElement} gridElement - Grid container
     * @param {number} columnsPerRow - Number of columns (default: 4)
     */
    enableKeyboardNavigation(gridElement, columnsPerRow = 4) {
        if (!gridElement) return;

        gridElement.addEventListener('keydown', (e) => {
            const items = [...gridElement.querySelectorAll('[data-value], [data-action]')];
            const currentIndex = items.findIndex(item => item === document.activeElement);

            if (currentIndex === -1) return;

            let nextIndex = currentIndex;

            switch (e.key) {
                case 'ArrowRight':
                    nextIndex = Math.min(currentIndex + 1, items.length - 1);
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    nextIndex = Math.max(currentIndex - 1, 0);
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    nextIndex = Math.min(currentIndex + columnsPerRow, items.length - 1);
                    e.preventDefault();
                    break;
                case 'ArrowUp':
                    nextIndex = Math.max(currentIndex - columnsPerRow, 0);
                    e.preventDefault();
                    break;
            }

            if (nextIndex !== currentIndex && items[nextIndex]) {
                items[nextIndex].focus();
            }
        });
    }
};
