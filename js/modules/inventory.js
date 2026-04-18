// Inventory Module

import { DOM, Format, Template, Toast, Loader } from '../utils/index.js';
import { Modal } from '../components/index.js';
import { State, Storage } from '../state/index.js';

// External dependencies
let showAddCategoryModal = null;
let showAddVariantModal = null;
let onStockUpdated = null;

export const Inventory = {
    init(callbacks) {
        showAddCategoryModal = callbacks.showAddCategoryModal;
        showAddVariantModal = callbacks.showAddVariantModal;
        onStockUpdated = callbacks.onStockUpdated;

        // Stock list clicks
        DOM.on(DOM.get('stockList'), 'click', '[data-action="edit"]', (e, el) => {
            const card = el.closest('[data-key]');
            this.editStock(card.dataset.key);
        });

        // Stock category grid
        DOM.on(DOM.get('stockCategoryGrid'), 'click', '.category-btn', (e, el) => {
            if (el.dataset.action === 'add') {
                if (showAddCategoryModal) showAddCategoryModal();
            } else if (el.dataset.value) {
                this.selectStockCategory(el.dataset.value);
            }
        });

        // Stock variant grid
        DOM.on(DOM.get('stockVariantGrid'), 'click', '.variant-btn', (e, el) => {
            if (el.dataset.action === 'add') {
                if (showAddVariantModal) showAddVariantModal('stock');
            } else if (el.dataset.value) {
                this.selectStockVariant(el.dataset.value);
            }
        });

        Modal.initCloseOnOverlay('editStockModal');
    },

    showTab(tab) {
        DOM.toggleClass(DOM.get('tab-stock'), 'active', tab === 'stock');
        DOM.toggleClass(DOM.get('tab-add'), 'active', tab === 'add');
        DOM.toggle(DOM.get('inventory-stock'), tab === 'stock');
        DOM.toggle(DOM.get('inventory-add'), tab === 'add');

        if (tab === 'stock') {
            Loader.show('stockList', 'Loading inventory...');
            setTimeout(() => this.renderStockList(), 100);
        }
        if (tab === 'add') {
            this.renderAddStockView();
        }
    },

    renderAddStockView() {
        if (State.stockSession) {
            // Active session - show session view
            DOM.hide(DOM.get('startSessionForm'));
            DOM.show(DOM.get('activeSessionView'));
            DOM.setText(DOM.get('sessionVendorDisplay'), State.stockSession.vendor);
            DOM.setText(DOM.get('sessionInvoiceDisplay'), State.stockSession.invoice ? `Invoice: ${State.stockSession.invoice}` : '');
            this.renderSessionItems();
            this.renderStockCategories();
        } else {
            // No session - show start form
            DOM.show(DOM.get('startSessionForm'));
            DOM.hide(DOM.get('activeSessionView'));
            DOM.setValue(DOM.get('sessionVendor'), '');
            DOM.setValue(DOM.get('sessionInvoice'), '');
            DOM.hide(DOM.get('photoPreview'));
            this.invoicePhotoData = null;
        }
    },

    invoicePhotoData: null,

    captureInvoicePhoto(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.invoicePhotoData = e.target.result;
            DOM.get('invoicePhotoThumb').src = e.target.result;
            DOM.show(DOM.get('photoPreview'));
        };
        reader.readAsDataURL(file);
    },

    removeInvoicePhoto() {
        this.invoicePhotoData = null;
        DOM.hide(DOM.get('photoPreview'));
        DOM.get('sessionPhotoInput').value = '';
        DOM.get('sessionPhotoFile').value = '';
    },

    startStockSession() {
        const vendor = DOM.getValue(DOM.get('sessionVendor')).trim();
        if (!vendor) {
            Toast.show('Enter vendor name');
            return;
        }

        const invoice = DOM.getValue(DOM.get('sessionInvoice')).trim();

        State.stockSession = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            vendor,
            invoice,
            photo: this.invoicePhotoData,
            items: [],
            startTime: new Date().toISOString(),
            addedBy: State.userRole
        };

        this.renderAddStockView();
        Toast.show('Session started. Add items now.');
    },

    renderSessionItems() {
        const items = State.stockSession?.items || [];
        const container = DOM.get('sessionItemsList');
        const card = DOM.get('sessionItemsCard');
        const countEl = DOM.get('sessionItemCount');

        DOM.setText(countEl, items.length);

        if (items.length === 0) {
            DOM.hide(card);
            return;
        }

        DOM.show(card);
        DOM.clear(container);

        items.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `
                <div class="list-item-info">
                    <h4>${item.category} - ${item.variant}</h4>
                    <p>+${item.qty} @ ${Format.currency(item.costPrice)}</p>
                </div>
                <div style="font-weight: 600; color: var(--success);">
                    ${Format.currency(item.price)}
                </div>
            `;
            container.appendChild(div);
        });
    },

    completeStockSession() {
        if (!State.stockSession) {
            this.renderAddStockView();
            return;
        }

        if (State.stockSession.items.length === 0) {
            if (confirm('No items added. Cancel this session?')) {
                State.stockSession = null;
                this.renderAddStockView();
            }
            return;
        }

        // Save the stock log
        const log = {
            id: State.stockSession.id,
            date: State.stockSession.startTime.split('T')[0],
            time: new Date(State.stockSession.startTime).toLocaleTimeString(),
            vendor: State.stockSession.vendor,
            invoice: State.stockSession.invoice,
            photo: State.stockSession.photo,
            items: State.stockSession.items,
            addedBy: State.stockSession.addedBy,
            type: 'bulk'
        };

        State.stockLogs.unshift(log);
        Storage.saveStockLog(log);

        Toast.show(`${State.stockSession.items.length} items logged successfully`);

        // Reset session
        State.stockSession = null;
        State.selectedStockCategory = null;
        State.selectedStockVariant = null;
        this.renderAddStockView();

        if (onStockUpdated) onStockUpdated();
    },

    renderStockList() {
        const items = Object.entries(State.inventory);

        if (items.length === 0) {
            Template.renderTo('stockList', 'tpl-empty', {
                title: 'No inventory yet',
                message: 'Add stock to get started'
            });
            return;
        }

        const container = DOM.get('stockList');
        DOM.clear(container);

        items.forEach(([key, data]) => {
            const [cat, variant] = key.split('|');
            const isLow = data.qty <= (data.alertQty || 0);

            const fragment = Template.render('tpl-stock-card', {
                category: cat,
                variant: variant,
                stockBadge: `${data.qty} in stock`,
                details: { html: `
                    <span class="${State.isAdmin() ? '' : 'worker-hidden'}">Cost: ${Format.currency(data.costPrice)}</span>
                    <span>Price: ${Format.currency(data.price)}</span>
                    <span>Alert: ${data.alertQty || 0}</span>
                ` }
            }, { dataAttrs: { key } });

            const badge = fragment.querySelector('.badge');
            badge.classList.add(isLow ? 'badge-danger' : 'badge-success');

            const editBtn = fragment.querySelector('[data-action="edit"]');
            if (!State.isAdmin()) editBtn.style.display = 'none';

            container.appendChild(fragment);
        });
    },

    filterStock() {
        const search = DOM.getValue(DOM.get('stockSearch')).toLowerCase();
        DOM.findAll('#stockList .card').forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(search) ? 'block' : 'none';
        });
    },

    renderStockCategories() {
        const container = DOM.get('stockCategoryGrid');
        DOM.clear(container);

        Object.keys(State.products).forEach(cat => {
            const fragment = Template.render('tpl-category-btn', {
                icon: Format.categoryIcon(cat),
                name: cat
            }, { dataAttrs: { value: cat } });

            const btn = fragment.querySelector('.category-btn');
            if (State.selectedStockCategory === cat) btn.classList.add('active');
            container.appendChild(fragment);
        });

        container.appendChild(Template.render('tpl-add-btn', { text: 'Add New' }));
    },

    selectStockCategory(cat) {
        State.selectedStockCategory = cat;
        this.renderStockCategories();
        this.renderStockVariants();
    },

    renderStockVariants() {
        const card = DOM.get('stockVariantCard');
        const container = DOM.get('stockVariantGrid');
        const title = DOM.get('stockVariantTitle');

        if (!State.selectedStockCategory) {
            DOM.hide(card);
            return;
        }

        DOM.show(card);
        DOM.setText(title, State.selectedStockCategory + ' - Select Variant');
        DOM.clear(container);

        const variants = State.products[State.selectedStockCategory] || [];
        variants.forEach(v => {
            const fragment = Template.render('tpl-variant-btn', {
                name: v,
                price: '',
                stock: ''
            }, { dataAttrs: { value: v } });

            // Hide price and stock for simple display
            const priceEl = fragment.querySelector('[data-field="price"]');
            const stockEl = fragment.querySelector('[data-field="stock"]');
            if (priceEl) priceEl.style.display = 'none';
            if (stockEl) stockEl.style.display = 'none';

            container.appendChild(fragment);
        });

        container.appendChild(Template.render('tpl-variant-add-btn', { text: '+ Add New' }));
    },

    selectStockVariant(variant) {
        State.selectedStockVariant = variant;
        const key = `${State.selectedStockCategory}|${variant}`;
        const existing = State.inventory[key] || {};

        DOM.setText(DOM.get('addStockProduct'), `${State.selectedStockCategory} - ${variant}`);
        DOM.setValue(DOM.get('addStockQty'), '');
        DOM.setValue(DOM.get('addStockCost'), existing.costPrice || '');
        DOM.setValue(DOM.get('addStockPrice'), existing.price || '');
        DOM.setValue(DOM.get('addStockAlert'), existing.alertQty || '');
        DOM.show(DOM.get('addStockForm'));
    },

    saveStock() {
        const qty = parseInt(DOM.getValue(DOM.get('addStockQty'))) || 0;
        const costPrice = parseFloat(DOM.getValue(DOM.get('addStockCost'))) || 0;
        const price = parseFloat(DOM.getValue(DOM.get('addStockPrice'))) || 0;
        const alertQty = parseInt(DOM.getValue(DOM.get('addStockAlert'))) || 0;

        if (qty <= 0) {
            Toast.show('Enter valid quantity');
            return;
        }

        const key = `${State.selectedStockCategory}|${State.selectedStockVariant}`;
        const existing = State.inventory[key] || { qty: 0 };

        // Update inventory immediately
        State.inventory[key] = {
            qty: existing.qty + qty,
            costPrice,
            price,
            alertQty
        };
        Storage.saveInventoryItem(key, State.inventory[key]);

        // Add to session items for tracking
        if (State.stockSession) {
            State.stockSession.items.push({
                category: State.selectedStockCategory,
                variant: State.selectedStockVariant,
                key,
                qty,
                costPrice,
                price,
                alertQty,
                addedAt: new Date().toISOString()
            });
            this.renderSessionItems();
            Toast.show('Item added. Select next product.');
        } else {
            // "During sale" addition - create standalone log entry
            const log = {
                id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                date: Format.today(),
                time: Format.time(),
                vendor: 'Added during sale',
                invoice: '',
                photo: null,
                items: [{
                    category: State.selectedStockCategory,
                    variant: State.selectedStockVariant,
                    key,
                    qty,
                    costPrice,
                    price,
                    alertQty,
                    addedAt: new Date().toISOString()
                }],
                addedBy: State.userRole || 'Unknown',
                type: 'during_sale'
            };
            State.stockLogs.unshift(log);
            Storage.saveStockLog(log);
            Toast.show('Stock added successfully');
        }

        // Reset form for next item
        DOM.hide(DOM.get('addStockForm'));
        DOM.setValue(DOM.get('addStockQty'), '');
        State.selectedStockVariant = null;
        // Keep category selected for quick entry of multiple variants
    },

    editStock(key) {
        const data = State.inventory[key];
        if (!data) {
            Toast.show('Item not found');
            return;
        }

        State.editingStockKey = key;
        const [cat, variant] = key.split('|');

        DOM.setText(DOM.get('editStockProduct'), cat);
        DOM.setText(DOM.get('editStockVariant'), variant);
        DOM.setValue(DOM.get('editStockQty'), data.qty || 0);
        DOM.setValue(DOM.get('editStockCost'), data.costPrice || '');
        DOM.setValue(DOM.get('editStockPrice'), data.price || '');
        DOM.setValue(DOM.get('editStockAlert'), data.alertQty || '');

        Modal.show('editStockModal');
    },

    closeEditModal() {
        Modal.hide('editStockModal');
        State.editingStockKey = null;
    },

    saveStockEdit() {
        if (!State.editingStockKey) return;

        const qty = parseInt(DOM.getValue(DOM.get('editStockQty'))) || 0;
        const costPrice = parseFloat(DOM.getValue(DOM.get('editStockCost'))) || 0;
        const price = parseFloat(DOM.getValue(DOM.get('editStockPrice'))) || 0;
        const alertQty = parseInt(DOM.getValue(DOM.get('editStockAlert'))) || 0;

        if (qty < 0) {
            Toast.show('Quantity cannot be negative');
            return;
        }

        State.inventory[State.editingStockKey] = { qty, costPrice, price, alertQty };
        Storage.saveInventoryItem(State.editingStockKey, State.inventory[State.editingStockKey]);

        this.closeEditModal();
        this.renderStockList();

        if (onStockUpdated) onStockUpdated();

        Toast.show('Stock updated successfully');
    }
};
