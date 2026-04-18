// Products Module

import { DOM, Format, Template, Toast, Loader } from '../utils/index.js';
import { Modal } from '../components/index.js';
import { State, Storage } from '../state/index.js';

// External dependencies
let onProductsUpdated = null;

export const Products = {
    init(callbacks) {
        onProductsUpdated = callbacks?.onProductsUpdated;
        Modal.initCloseOnOverlay('addProductModal');
        Modal.initCloseOnOverlay('addCategoryModal');
        Modal.initCloseOnOverlay('addVariantModal');
    },

    renderList() {
        Loader.show('productsList', 'Loading products...');
        setTimeout(() => this._renderList(), 100);
    },

    _renderList() {
        Template.renderListTo('productsList', 'tpl-product-card', Object.entries(State.products),
            ([cat, variants]) => ({
                data: {
                    name: cat,
                    variantCount: `${variants.length} variants`,
                    variants: variants.join(', ')
                },
                options: {}
            }),
            'No products yet'
        );
    },

    showAddModal() {
        DOM.setValue(DOM.get('newProductName'), '');
        DOM.setValue(DOM.get('newProductVariants'), '');
        Modal.show('addProductModal');
    },

    closeAddModal() {
        Modal.hide('addProductModal');
    },

    saveNew() {
        const name = DOM.getValue(DOM.get('newProductName')).trim();
        const variantsText = DOM.getValue(DOM.get('newProductVariants')).trim();

        if (!name) {
            Toast.show('Product name required');
            return;
        }

        const variants = variantsText.split('\n').map(v => v.trim()).filter(v => v);
        if (variants.length === 0) {
            Toast.show('Add at least one variant');
            return;
        }

        State.products[name] = variants;
        Storage.saveProducts();

        this.closeAddModal();
        this.renderList();

        if (onProductsUpdated) onProductsUpdated();

        Toast.show('Product added');
    },

    showAddCategoryModal() {
        DOM.setValue(DOM.get('newCategoryName'), '');
        Modal.show('addCategoryModal');
    },

    closeAddCategoryModal() {
        Modal.hide('addCategoryModal');
    },

    saveNewCategory() {
        const name = DOM.getValue(DOM.get('newCategoryName')).trim();

        if (!name) {
            Toast.show('Category name required');
            return;
        }
        if (State.products[name]) {
            Toast.show('Category already exists');
            return;
        }

        State.products[name] = [];
        Storage.saveProducts();

        this.closeAddCategoryModal();
        this.renderList();

        if (onProductsUpdated) onProductsUpdated();

        Toast.show('Category added');

        // Return the new category name so caller can select it
        return name;
    },

    showAddVariantModal(context) {
        State.variantModalContext = context;
        const category = context === 'stock' ? State.selectedStockCategory : State.selectedCategory;

        if (!category) {
            Toast.show('Select a category first');
            return;
        }

        DOM.setText(DOM.get('addVariantCategory'), category);
        DOM.setValue(DOM.get('newVariantName'), '');
        DOM.setValue(DOM.get('newVariantCost'), '');
        DOM.setValue(DOM.get('newVariantPrice'), '');
        DOM.setValue(DOM.get('newVariantStock'), '');

        Modal.show('addVariantModal');
    },

    closeAddVariantModal() {
        Modal.hide('addVariantModal');
    },

    saveNewVariant() {
        const name = DOM.getValue(DOM.get('newVariantName')).trim();
        const costPrice = parseFloat(DOM.getValue(DOM.get('newVariantCost'))) || 0;
        const price = parseFloat(DOM.getValue(DOM.get('newVariantPrice'))) || 0;
        const stock = parseInt(DOM.getValue(DOM.get('newVariantStock'))) || 0;

        const targetCategory = State.variantModalContext === 'stock'
            ? State.selectedStockCategory
            : State.selectedCategory;

        if (!name) {
            Toast.show('Variant name required');
            return;
        }
        if (!targetCategory) {
            Toast.show('No category selected');
            return;
        }
        if (State.products[targetCategory].includes(name)) {
            Toast.show('Variant already exists');
            return;
        }

        State.products[targetCategory].push(name);
        Storage.saveProducts();

        if (costPrice || price || stock) {
            const key = `${targetCategory}|${name}`;
            State.inventory[key] = { qty: stock, costPrice, price, alertQty: 0 };
            Storage.saveInventoryItem(key, State.inventory[key]);

            // Log stock addition when added during sale
            if (stock > 0 && State.variantModalContext === 'sale') {
                const log = {
                    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                    date: Format.today(),
                    time: Format.time(),
                    vendor: 'Added during sale',
                    invoice: '',
                    photo: null,
                    items: [{
                        category: targetCategory,
                        variant: name,
                        key,
                        qty: stock,
                        costPrice,
                        price,
                        alertQty: 0,
                        addedAt: new Date().toISOString()
                    }],
                    addedBy: State.userRole || 'Unknown',
                    type: 'during_sale'
                };
                State.stockLogs.unshift(log);
                Storage.saveStockLog(log);
            }
        }

        this.closeAddVariantModal();
        this.renderList();

        if (onProductsUpdated) onProductsUpdated();

        Toast.show('Variant added');
    }
};
