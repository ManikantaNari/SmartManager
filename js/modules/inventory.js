// Inventory Module

import { DOM, Format, DateUtil, GridUtil, Template, Toast, Loader, debounce, Confirm } from '../utils/index.js';
import { Modal } from '../components/index.js';
import { State, Storage } from '../state/index.js';

// External dependencies
let showAddCategoryModal = null;
let showAddVariantModal = null;
let showEditCategoryModal = null;
let showEditVariantModal = null;
let onStockUpdated = null;

export const Inventory = {
    init(callbacks) {
        showAddCategoryModal = callbacks.showAddCategoryModal;
        showAddVariantModal = callbacks.showAddVariantModal;
        showEditCategoryModal = callbacks.showEditCategoryModal;
        showEditVariantModal = callbacks.showEditVariantModal;
        onStockUpdated = callbacks.onStockUpdated;

        // Stock list clicks
        DOM.on(DOM.get('stockList'), 'click', '[data-action="edit"]', (e, el) => {
            const card = el.closest('[data-key]');
            this.editStock(card.dataset.key);
        });

        // Stock category grid
        DOM.on(DOM.get('stockCategoryGrid'), 'click', '.category-btn', (e, el) => {
            // Check if edit button was clicked
            if (e.target.closest('.edit-btn')) {
                e.stopPropagation();
                const category = el.dataset.value;
                if (showEditCategoryModal && category) showEditCategoryModal(category);
                return;
            }
            if (el.dataset.action === 'add') {
                if (showAddCategoryModal) showAddCategoryModal();
            } else if (el.dataset.value) {
                this.selectStockCategory(el.dataset.value);
            }
        });

        // Stock variant grid
        DOM.on(DOM.get('stockVariantGrid'), 'click', '.variant-btn', (e, el) => {
            // Check if edit button was clicked
            if (e.target.closest('.edit-btn')) {
                e.stopPropagation();
                const variant = el.dataset.value;
                if (showEditVariantModal && variant) showEditVariantModal(State.selectedStockCategory, variant);
                return;
            }
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

            // Display based on stock type
            const isOldStock = State.stockSession.stockType === 'old';
            const labelEl = DOM.get('sessionVendorLabel');
            if (labelEl) {
                DOM.setText(labelEl, isOldStock ? 'Adding' : 'Adding stock from');
            }
            DOM.setText(DOM.get('sessionVendorDisplay'), State.stockSession.vendor);
            DOM.setText(DOM.get('sessionInvoiceDisplay'), State.stockSession.invoice ? `Invoice: ${State.stockSession.invoice}` : '');

            this.renderSessionItems();
            this.renderStockCategories();
        } else {
            // No session - show unified form
            DOM.show(DOM.get('startSessionForm'));
            DOM.hide(DOM.get('activeSessionView'));

            // Reset form
            const checkbox = DOM.get('isNewPurchase');
            if (checkbox) checkbox.checked = false;
            DOM.hide(DOM.get('vendorDetailsSection'));
            DOM.setValue(DOM.get('sessionVendor'), '');
            DOM.setValue(DOM.get('sessionInvoice'), '');
            DOM.hide(DOM.get('photoPreview'));
            this.invoicePhotoData = null;
        }
    },

    toggleVendorFields() {
        const checkbox = DOM.get('isNewPurchase');
        const vendorSection = DOM.get('vendorDetailsSection');

        if (checkbox && vendorSection) {
            if (checkbox.checked) {
                DOM.show(vendorSection);
            } else {
                DOM.hide(vendorSection);
                // Clear vendor fields when toggled off
                DOM.setValue(DOM.get('sessionVendor'), '');
                DOM.setValue(DOM.get('sessionInvoice'), '');
                this.removeInvoicePhoto();
            }
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
        const isNewPurchase = DOM.get('isNewPurchase')?.checked || false;

        let vendor, invoice, photo, stockType;

        if (isNewPurchase) {
            // New purchase - require vendor details
            vendor = DOM.getValue(DOM.get('sessionVendor')).trim();
            if (!vendor) {
                Toast.show('Enter vendor name');
                return;
            }
            invoice = DOM.getValue(DOM.get('sessionInvoice')).trim();
            photo = this.invoicePhotoData;
            stockType = 'new';
        } else {
            // Opening stock/existing inventory - skip vendor details
            vendor = 'Opening Stock';
            invoice = '';
            photo = null;
            stockType = 'old';
        }

        State.stockSession = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            vendor,
            invoice,
            photo,
            items: [],
            startTime: new Date().toISOString(),
            addedBy: State.userRole,
            stockType
        };

        this.renderAddStockView();
        Toast.show(isNewPurchase ? 'Session started. Add items now.' : 'Add your existing inventory items');
    },

    renderSessionItems() {
        const items = State.stockSession?.items || [];
        const container = DOM.get('sessionItemsList');
        const card = DOM.get('sessionItemsCard');
        const countEl = DOM.get('sessionItemCount');

        // Calculate session progress stats
        const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
        const totalCost = items.reduce((sum, item) => sum + (item.costPrice * item.qty), 0);

        DOM.setText(countEl, items.length);

        // Update progress indicator if it exists
        const progressEl = DOM.get('sessionProgress');
        if (progressEl) {
            progressEl.innerHTML = `
                <div class="session-stat">
                    <span class="session-stat-label">Products</span>
                    <span class="session-stat-value">${items.length}</span>
                </div>
                <div class="session-stat">
                    <span class="session-stat-label">Total Qty</span>
                    <span class="session-stat-value">${totalQty}</span>
                </div>
                <div class="session-stat admin-only">
                    <span class="session-stat-label">Total Cost</span>
                    <span class="session-stat-value">${Format.currency(totalCost)}</span>
                </div>
            `;
        }

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
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="font-weight: 600; color: var(--success); margin-right: 8px;">
                        ${Format.currency(item.costPrice * item.qty)}
                    </div>
                    <button class="btn btn-sm btn-outline" onclick="editSessionItem(${index})" style="padding: 4px 8px; font-size: 12px;">Edit</button>
                    <button class="btn btn-sm btn-outline" onclick="removeSessionItem(${index})" style="padding: 4px 8px; font-size: 12px; color: var(--danger); border-color: var(--danger);">Remove</button>
                </div>
            `;
            container.appendChild(div);
        });
    },

    editSessionItem(index) {
        const item = State.stockSession?.items[index];
        if (!item) return;

        // Store index for updating later
        State.editingSessionItemIndex = index;

        // Set category and variant
        State.selectedStockCategory = item.category;
        State.selectedStockVariant = item.variant;

        // Open modal with pre-filled values
        DOM.setText(DOM.get('addStockItemProduct'), item.category);
        DOM.setText(DOM.get('addStockItemVariant'), item.variant);
        DOM.setValue(DOM.get('addStockItemQty'), item.qty);
        DOM.setValue(DOM.get('addStockItemCost'), item.costPrice);
        DOM.setValue(DOM.get('addStockItemPrice'), item.price);
        DOM.setValue(DOM.get('addStockItemAlert'), item.alertQty);

        Modal.show('addStockItemModal');
    },

    removeSessionItem(index) {
        if (!State.stockSession) return;

        const item = State.stockSession.items[index];
        if (!item) return;

        if (confirm(`Remove ${item.category} - ${item.variant} from queue?`)) {
            State.stockSession.items.splice(index, 1);
            this.renderSessionItems();
            Toast.show('Item removed from queue');
        }
    },

    async completeStockSession() {
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

        const itemCount = State.stockSession.items.length;

        // Show confirmation dialog
        const confirmed = await Confirm.show({
            title: `Save ${itemCount} item${itemCount > 1 ? 's' : ''} to inventory?`,
            message: 'This will update your stock levels. This action cannot be undone.',
            confirmText: 'Yes, Save All',
            cancelText: 'Cancel',
            type: 'warning'
        });

        if (!confirmed) {
            return;
        }

        // NOW save all items to database
        State.stockSession.items.forEach(item => {
            Storage.updateInventoryQty(item.key, item.qty, {
                costPrice: item.costPrice,
                price: item.price,
                alertQty: item.alertQty
            });
        });

        // Save the stock log
        const log = {
            id: State.stockSession.id,
            date: State.stockSession.startTime.split('T')[0],
            time: DateUtil.formatTime(State.stockSession.startTime),
            vendor: State.stockSession.vendor,
            invoice: State.stockSession.invoice,
            photo: State.stockSession.photo,
            items: State.stockSession.items,
            addedBy: State.stockSession.addedBy,
            type: 'bulk',
            stockType: State.stockSession.stockType || 'new'
        };

        State.stockLogs.unshift(log);
        Storage.saveStockLog(log);

        Toast.show(`${itemCount} item${itemCount > 1 ? 's' : ''} saved successfully!`);

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

    _performStockFilter() {
        const search = DOM.getValue(DOM.get('stockSearch')).toLowerCase();
        DOM.findAll('#stockList .card').forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(search) ? 'block' : 'none';
        });
    },

    filterStock: null, // Will be initialized with debounced version

    renderStockCategories() {
        const container = DOM.get('stockCategoryGrid');
        GridUtil.renderCategoryGrid(container, State.products, State.selectedStockCategory, {
            showEdit: true,
            showAddButton: true,
            onSelect: (category) => this.selectStockCategory(category),
            onEdit: (category) => showEditCategoryModal && showEditCategoryModal(category),
            onAdd: () => showAddCategoryModal && showAddCategoryModal()
        });
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

        const variants = State.products[State.selectedStockCategory] || [];
        GridUtil.renderVariantGrid(container, variants, State.selectedStockCategory, {
            showEdit: true,
            showStock: false,
            showPrice: false,
            showAddButton: true,
            onSelect: (variant) => this.selectStockVariant(variant),
            onEdit: (category, variant) => showEditVariantModal && showEditVariantModal(category, variant),
            onAdd: () => showAddVariantModal && showAddVariantModal('stock')
        });
    },

    selectStockVariant(variant) {
        State.selectedStockVariant = variant;
        State.editingSessionItemIndex = null; // Clear edit mode
        const key = `${State.selectedStockCategory}|${variant}`;
        const existing = State.inventory[key] || {};

        // Open modal instead of showing inline form
        DOM.setText(DOM.get('addStockItemProduct'), State.selectedStockCategory);
        DOM.setText(DOM.get('addStockItemVariant'), variant);
        DOM.setValue(DOM.get('addStockItemQty'), '');
        DOM.setValue(DOM.get('addStockItemCost'), existing.costPrice || '');
        DOM.setValue(DOM.get('addStockItemPrice'), existing.price || '');
        DOM.setValue(DOM.get('addStockItemAlert'), existing.alertQty || '');

        Modal.show('addStockItemModal');
    },

    addItemToQueue() {
        const qty = parseInt(DOM.getValue(DOM.get('addStockItemQty'))) || 0;
        const costPrice = parseFloat(DOM.getValue(DOM.get('addStockItemCost'))) || 0;
        const price = parseFloat(DOM.getValue(DOM.get('addStockItemPrice'))) || 0;
        const alertQty = parseInt(DOM.getValue(DOM.get('addStockItemAlert'))) || 0;

        if (qty <= 0) {
            Toast.show('Enter valid quantity');
            return;
        }

        if (!State.stockSession) {
            Toast.show('Session not active');
            return;
        }

        const key = `${State.selectedStockCategory}|${State.selectedStockVariant}`;

        const item = {
            category: State.selectedStockCategory,
            variant: State.selectedStockVariant,
            key,
            qty,
            costPrice,
            price,
            alertQty,
            addedAt: DateUtil.now()
        };

        // Check if editing existing item in queue
        if (State.editingSessionItemIndex !== null && State.editingSessionItemIndex !== undefined) {
            // Update existing item
            State.stockSession.items[State.editingSessionItemIndex] = item;
            Toast.show('Item updated in queue');
        } else {
            // Add new item to queue (NO DB save yet!)
            State.stockSession.items.push(item);
            const count = State.stockSession.items.length;
            Toast.show(`Item queued (${count} item${count > 1 ? 's' : ''}). Add more or Complete.`);
        }

        // Close modal and render session items
        Modal.hide('addStockItemModal');
        this.renderSessionItems();

        State.selectedStockVariant = null;
        State.editingSessionItemIndex = null;
        // Keep category selected for quick entry of multiple variants
    },

    closeAddStockItemModal() {
        Modal.hide('addStockItemModal');
        State.editingSessionItemIndex = null;
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
        DOM.setValue(DOM.get('editStockReason'), ''); // Clear reason field

        Modal.show('editStockModal');
    },

    closeEditModal() {
        Modal.hide('editStockModal');
        State.editingStockKey = null;
    },

    saveStockEdit() {
        if (!State.editingStockKey) return;

        // Get old data before updating
        const oldData = State.inventory[State.editingStockKey];
        const oldQty = oldData?.qty || 0;

        const qty = parseInt(DOM.getValue(DOM.get('editStockQty'))) || 0;
        const costPrice = parseFloat(DOM.getValue(DOM.get('editStockCost'))) || 0;
        const price = parseFloat(DOM.getValue(DOM.get('editStockPrice'))) || 0;
        const alertQty = parseInt(DOM.getValue(DOM.get('editStockAlert'))) || 0;
        const reason = DOM.getValue(DOM.get('editStockReason')).trim();

        if (qty < 0) {
            Toast.show('Quantity cannot be negative');
            return;
        }

        // Update inventory
        State.inventory[State.editingStockKey] = { qty, costPrice, price, alertQty };
        Storage.saveInventoryItem(State.editingStockKey, State.inventory[State.editingStockKey]);

        // Create stock log if quantity changed
        if (qty !== oldQty) {
            const [category, variant] = State.editingStockKey.split('|');
            const qtyChange = qty - oldQty;

            const log = {
                id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                date: Format.today(),
                time: Format.time(),
                vendor: 'Stock Adjustment',
                invoice: '',
                photo: null,
                items: [{
                    category,
                    variant,
                    key: State.editingStockKey,
                    oldQty,
                    newQty: qty,
                    qtyChange,
                    costPrice,
                    price,
                    alertQty,
                    addedAt: DateUtil.now()
                }],
                addedBy: State.userRole || 'admin',
                type: 'adjustment',
                reason: reason || null
            };

            State.stockLogs.unshift(log);
            Storage.saveStockLog(log);
        }

        this.closeEditModal();
        this.renderStockList();

        if (onStockUpdated) onStockUpdated();

        Toast.show('Stock updated successfully');
    }
};

// Initialize debounced stock filter (200ms delay)
Inventory.filterStock = debounce(Inventory._performStockFilter.bind(Inventory), 200);
