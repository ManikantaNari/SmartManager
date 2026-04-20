// Products Module

import { DOM, Format, DateUtil, EntityUpdater, Template, Toast, Loader } from '../utils/index.js';
import { Modal } from '../components/index.js';
import { State, Storage } from '../state/index.js';
import { STORAGE_KEYS, EMOJI_OPTIONS, DEFAULT_ICON } from '../config/index.js';

// External dependencies
let onProductsUpdated = null;

export const Products = {
    init(callbacks) {
        onProductsUpdated = callbacks?.onProductsUpdated;
        Modal.initCloseOnOverlay('addProductModal');
        Modal.initCloseOnOverlay('addCategoryModal');
        Modal.initCloseOnOverlay('addVariantModal');
        Modal.initCloseOnOverlay('editCategoryModal');
        Modal.initCloseOnOverlay('editVariantModal');
        Modal.initCloseOnOverlay('deleteCategoryModal');
        Modal.initCloseOnOverlay('deleteVariantModal');
    },

    // Render emoji picker options
    renderEmojiPicker(containerId, hiddenInputId, selectedEmoji = DEFAULT_ICON) {
        const container = DOM.get(containerId);
        const hiddenInput = DOM.get(hiddenInputId);
        if (!container) return;

        container.innerHTML = EMOJI_OPTIONS.map(emoji => `
            <div class="emoji-option${emoji === selectedEmoji ? ' selected' : ''}"
                 onclick="selectEmoji('${containerId}', '${hiddenInputId}', '${emoji}')">
                ${emoji}
            </div>
        `).join('');

        if (hiddenInput) {
            hiddenInput.value = selectedEmoji;
        }
    },

    // Select emoji in picker
    selectEmoji(containerId, hiddenInputId, emoji) {
        const container = DOM.get(containerId);
        const hiddenInput = DOM.get(hiddenInputId);

        if (container) {
            // Remove selected class from all options
            container.querySelectorAll('.emoji-option').forEach(el => {
                el.classList.remove('selected');
                if (el.textContent.trim() === emoji) {
                    el.classList.add('selected');
                }
            });
        }

        if (hiddenInput) {
            hiddenInput.value = emoji;
        }
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
        // Render emoji picker with default emoji selected
        this.renderEmojiPicker('newCategoryEmojiPicker', 'newCategoryEmoji', DEFAULT_ICON);
        Modal.show('addCategoryModal');
    },

    closeAddCategoryModal() {
        Modal.hide('addCategoryModal');
    },

    saveNewCategory() {
        const name = DOM.getValue(DOM.get('newCategoryName')).trim();
        const emoji = DOM.getValue(DOM.get('newCategoryEmoji')) || DEFAULT_ICON;

        if (!name) {
            Toast.show('Category name required');
            return;
        }
        if (State.products[name]) {
            Toast.show('Category already exists');
            return;
        }

        State.products[name] = [];
        Storage.setLocal(STORAGE_KEYS.products, State.products);
        Storage.saveProductCategory(name, [], emoji);

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
        Storage.setLocal(STORAGE_KEYS.products, State.products);
        Storage.saveProductCategory(targetCategory, State.products[targetCategory]);

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
                        addedAt: DateUtil.now()
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
    },

    // ==================== EDIT CATEGORY ====================

    showEditCategoryModal(category) {
        if (!State.isAdmin()) {
            Toast.show('Only owner can edit');
            return;
        }

        State.editingCategory = category;
        DOM.setText(DOM.get('editCategoryOldName'), category);
        DOM.setValue(DOM.get('editCategoryNewName'), category);
        // Render emoji picker with current emoji selected
        const currentEmoji = State.categoryEmojis[category] || DEFAULT_ICON;
        this.renderEmojiPicker('editCategoryEmojiPicker', 'editCategoryEmoji', currentEmoji);

        // Calculate total inventory for this category
        const categoryStock = EntityUpdater.getCategoryStock(category);
        const deleteBtn = DOM.get('deleteCategoryBtn');
        const warningEl = DOM.get('deleteCategoryWarning');
        const stockInfoEl = DOM.get('deleteCategoryStockInfo');

        if (categoryStock.totalQty > 0) {
            // Has inventory - disable delete
            if (deleteBtn) {
                deleteBtn.disabled = true;
                deleteBtn.style.opacity = '0.5';
                deleteBtn.style.cursor = 'not-allowed';
            }
            if (warningEl) DOM.hide(warningEl);
            if (stockInfoEl) {
                DOM.show(stockInfoEl);
                DOM.setText(stockInfoEl, `${categoryStock.totalQty} items in stock across ${categoryStock.variantCount} variant(s). Clear inventory first to delete.`);
            }
        } else {
            // No inventory - enable delete
            if (deleteBtn) {
                deleteBtn.disabled = false;
                deleteBtn.style.opacity = '1';
                deleteBtn.style.cursor = 'pointer';
            }
            if (warningEl) DOM.show(warningEl);
            if (stockInfoEl) DOM.hide(stockInfoEl);
        }

        Modal.show('editCategoryModal');
    },

    closeEditCategoryModal() {
        Modal.hide('editCategoryModal');
        State.editingCategory = null;
    },

    saveEditCategory() {
        const oldName = State.editingCategory;
        const newName = DOM.getValue(DOM.get('editCategoryNewName')).trim();
        const emoji = DOM.getValue(DOM.get('editCategoryEmoji')) || DEFAULT_ICON;

        if (!newName) {
            Toast.show('Category name required');
            return;
        }

        // Check if only emoji changed (name is the same)
        const nameChanged = newName !== oldName;
        const oldEmoji = State.categoryEmojis[oldName] || DEFAULT_ICON;
        const emojiChanged = emoji !== oldEmoji;

        if (!nameChanged && !emojiChanged) {
            this.closeEditCategoryModal();
            return;
        }

        // If only emoji changed, just update the emoji
        if (!nameChanged && emojiChanged) {
            Storage.saveProductCategory(oldName, State.products[oldName] || [], emoji);
            this.closeEditCategoryModal();
            if (onProductsUpdated) onProductsUpdated();
            Toast.show('Category updated');
            return;
        }

        // Allow case changes (e.g., "teak" -> "Teak")
        // Only block if a DIFFERENT category has the same name (case-insensitive)
        const existingCategory = Object.keys(State.products).find(
            cat => cat.toLowerCase() === newName.toLowerCase() && cat !== oldName
        );
        if (existingCategory) {
            Toast.show('Category already exists');
            return;
        }

        // Plan and execute category rename using EntityUpdater
        const updates = EntityUpdater.planCategoryRename(oldName, newName);

        // 1. Update products
        const variants = State.products[oldName] || [];
        delete State.products[oldName];
        State.products[newName] = variants;
        Storage.setLocal(STORAGE_KEYS.products, State.products);
        Storage.deleteProductCategory(oldName);
        Storage.saveProductCategory(newName, variants, emoji);

        // 2. Apply all related updates (inventory, sales, bookings, stock logs)
        EntityUpdater.applyCategoryRename(oldName, newName, updates);

        // 3. Update UI state
        if (State.selectedCategory === oldName) State.selectedCategory = newName;
        if (State.selectedStockCategory === oldName) State.selectedStockCategory = newName;

        this.closeEditCategoryModal();
        this.renderList();

        if (onProductsUpdated) onProductsUpdated();

        Toast.show('Category renamed');
    },

    // ==================== EDIT VARIANT ====================

    showEditVariantModal(category, variant) {
        if (!State.isAdmin()) {
            Toast.show('Only owner can edit');
            return;
        }

        State.editingVariantCategory = category;
        State.editingVariant = variant;
        DOM.setText(DOM.get('editVariantCategory'), category);
        DOM.setText(DOM.get('editVariantOldName'), variant);
        DOM.setValue(DOM.get('editVariantNewName'), variant);

        // Check inventory for this variant
        const stockQty = EntityUpdater.getVariantStock(category, variant);
        const deleteBtn = DOM.get('deleteVariantBtn');
        const warningEl = DOM.get('deleteVariantWarning');
        const stockInfoEl = DOM.get('deleteVariantStockInfo');

        if (stockQty > 0) {
            // Has inventory - disable delete
            if (deleteBtn) {
                deleteBtn.disabled = true;
                deleteBtn.style.opacity = '0.5';
                deleteBtn.style.cursor = 'not-allowed';
            }
            if (warningEl) DOM.hide(warningEl);
            if (stockInfoEl) {
                DOM.show(stockInfoEl);
                DOM.setText(stockInfoEl, `${stockQty} items in stock. Clear inventory first to delete.`);
            }
        } else {
            // No inventory - enable delete
            if (deleteBtn) {
                deleteBtn.disabled = false;
                deleteBtn.style.opacity = '1';
                deleteBtn.style.cursor = 'pointer';
            }
            if (warningEl) DOM.show(warningEl);
            if (stockInfoEl) DOM.hide(stockInfoEl);
        }

        Modal.show('editVariantModal');
    },

    closeEditVariantModal() {
        Modal.hide('editVariantModal');
        State.editingVariantCategory = null;
        State.editingVariant = null;
    },

    saveEditVariant() {
        const category = State.editingVariantCategory;
        const oldName = State.editingVariant;
        const newName = DOM.getValue(DOM.get('editVariantNewName')).trim();

        if (!newName) {
            Toast.show('Variant name required');
            return;
        }
        if (newName === oldName) {
            this.closeEditVariantModal();
            return;
        }
        // Allow case changes (e.g., "teak" -> "Teak")
        // Only block if a DIFFERENT variant has the same name (case-insensitive)
        const existingVariant = State.products[category]?.find(
            v => v.toLowerCase() === newName.toLowerCase() && v !== oldName
        );
        if (existingVariant) {
            Toast.show('Variant already exists');
            return;
        }

        // Plan and execute variant rename using EntityUpdater
        const updates = EntityUpdater.planVariantRename(category, oldName, newName);

        // 1. Update products
        const variantIndex = State.products[category]?.indexOf(oldName);
        if (variantIndex > -1) {
            State.products[category][variantIndex] = newName;
            Storage.setLocal(STORAGE_KEYS.products, State.products);
            Storage.saveProductCategory(category, State.products[category]);
        }

        // 2. Apply all related updates (inventory, sales, bookings, stock logs)
        EntityUpdater.applyVariantRename(category, oldName, newName, updates);

        // 3. Update UI state
        if (State.selectedVariant === oldName) State.selectedVariant = newName;
        if (State.selectedStockVariant === oldName) State.selectedStockVariant = newName;

        this.closeEditVariantModal();
        this.renderList();

        if (onProductsUpdated) onProductsUpdated();

        Toast.show('Variant renamed');
    },

    // ==================== DELETE CATEGORY ====================

    showDeleteCategoryConfirm() {
        if (!State.editingCategory) return;

        DOM.setText(DOM.get('deleteCategoryName'), State.editingCategory);
        Modal.hide('editCategoryModal');
        Modal.show('deleteCategoryModal');
    },

    closeDeleteCategoryModal() {
        Modal.hide('deleteCategoryModal');
    },

    deleteCategory() {
        const category = State.editingCategory;
        if (!category || !State.products[category]) {
            Toast.show('Category not found');
            return;
        }

        // Use EntityUpdater to delete category and all related data
        EntityUpdater.deleteCategory(category);

        // Clear selections if this was selected
        if (State.selectedCategory === category) State.selectedCategory = null;
        if (State.selectedStockCategory === category) State.selectedStockCategory = null;
        State.editingCategory = null;

        this.closeDeleteCategoryModal();
        this.renderList();

        if (onProductsUpdated) onProductsUpdated();

        Toast.show('Category deleted');
    },

    // ==================== DELETE VARIANT ====================

    showDeleteVariantConfirm() {
        if (!State.editingVariantCategory || !State.editingVariant) return;

        DOM.setText(DOM.get('deleteVariantCategory'), State.editingVariantCategory);
        DOM.setText(DOM.get('deleteVariantName'), State.editingVariant);
        Modal.hide('editVariantModal');
        Modal.show('deleteVariantModal');
    },

    closeDeleteVariantModal() {
        Modal.hide('deleteVariantModal');
    },

    deleteVariant() {
        const category = State.editingVariantCategory;
        const variant = State.editingVariant;

        if (!category || !variant) {
            Toast.show('Variant not found');
            return;
        }

        // Use EntityUpdater to delete variant and related data
        EntityUpdater.deleteVariant(category, variant);

        // Clear selections if this was selected
        if (State.selectedVariant === variant) State.selectedVariant = null;
        if (State.selectedStockVariant === variant) State.selectedStockVariant = null;
        State.editingVariantCategory = null;
        State.editingVariant = null;

        this.closeDeleteVariantModal();
        this.renderList();

        if (onProductsUpdated) onProductsUpdated();

        Toast.show('Variant deleted');
    }
};
