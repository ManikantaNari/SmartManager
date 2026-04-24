// Sales Module

import { DOM, Format, GridUtil, Template, Toast, Loader, debounce, DateUtil } from '../utils/index.js';
import { Modal } from '../components/index.js';
import { State, Storage } from '../state/index.js';

// External dependencies - will be injected
let showAddCategoryModal = null;
let showAddVariantModal = null;
let showEditCategoryModal = null;
let showEditVariantModal = null;
let onSaleComplete = null;

export const Sales = {
    init(callbacks) {
        showAddCategoryModal = callbacks.showAddCategoryModal;
        showAddVariantModal = callbacks.showAddVariantModal;
        showEditCategoryModal = callbacks.showEditCategoryModal;
        showEditVariantModal = callbacks.showEditVariantModal;
        onSaleComplete = callbacks.onSaleComplete;

        // Category grid clicks
        DOM.on(DOM.get('categoryGrid'), 'click', '.category-btn', (e, el) => {
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
                this.selectCategory(el.dataset.value);
            }
        });

        // Variant grid clicks
        DOM.on(DOM.get('variantGrid'), 'click', '.variant-btn', (e, el) => {
            // Check if edit button was clicked
            if (e.target.closest('.edit-btn')) {
                e.stopPropagation();
                const variant = el.dataset.value;
                if (showEditVariantModal && variant) showEditVariantModal(State.selectedCategory, variant);
                return;
            }
            if (el.dataset.action === 'add') {
                if (showAddVariantModal) showAddVariantModal('sale');
            } else if (el.dataset.value) {
                this.selectVariantForCart(el.dataset.value);
            }
        });

        // Cart interactions
        DOM.on(DOM.get('cartItems'), 'click', '[data-action]', (e, el) => {
            const cartItem = el.closest('.cart-item');
            const index = parseInt(cartItem.dataset.index);
            const action = el.dataset.action;

            if (action === 'increase') this.updateCartQty(index, 1);
            else if (action === 'decrease') this.updateCartQty(index, -1);
            else if (action === 'remove') this.removeFromCart(index);
        });

        // Customer search
        DOM.on(DOM.get('customerList'), 'click', '.list-item', (e, el) => {
            this.selectCustomerForSale(el.dataset.name, el.dataset.phone);
        });

        Modal.initCloseOnOverlay('addCartModal');
    },

    reset() {
        State.cart = [];
        State.selectedCategory = null;
        State.selectedPayment = null;
        DOM.setValue(DOM.get('customerName'), '');
        DOM.setValue(DOM.get('customerPhone'), '');
        this.renderCart();
        DOM.hide(DOM.get('variantCard'));
        State.selectedPayment = null;
        DOM.removeClass(DOM.get('btnCash'), 'btn-primary');
        DOM.addClass(DOM.get('btnCash'), 'btn-outline');
        DOM.removeClass(DOM.get('btnUPI'), 'btn-primary');
        DOM.addClass(DOM.get('btnUPI'), 'btn-outline');
        const toggle = DOM.get('splitPaymentToggle');
        if (toggle) toggle.checked = false;
        DOM.show(DOM.get('paymentMethodSimple'));
        DOM.hide(DOM.get('paymentMethodSplit'));
        DOM.setValue(DOM.get('paymentCash'), '');
        DOM.setValue(DOM.get('paymentUPI'), '');
        State._paymentTotal = 0;
        const balanceEl = DOM.get('paymentBalance');
        if (balanceEl) balanceEl.innerHTML = '';
    },

    showStep(step) {
        DOM.findAll('#saleTabs .tab').forEach(t => DOM.removeClass(t, 'active'));
        DOM.hide(DOM.get('sale-step-products'));
        DOM.hide(DOM.get('sale-step-customer'));
        DOM.hide(DOM.get('sale-step-payment'));

        if (step === 'products') {
            DOM.addClass(DOM.find('#saleTabs .tab:nth-child(1)'), 'active');
            DOM.show(DOM.get('sale-step-products'));
        } else if (step === 'customer') {
            DOM.addClass(DOM.find('#saleTabs .tab:nth-child(2)'), 'active');
            DOM.show(DOM.get('sale-step-customer'));
        } else if (step === 'payment') {
            DOM.addClass(DOM.find('#saleTabs .tab:nth-child(3)'), 'active');
            DOM.show(DOM.get('sale-step-payment'));
            this.renderPaymentSummary();
        }
    },

    renderCategories() {
        const container = DOM.get('categoryGrid');
        GridUtil.renderCategoryGrid(container, State.products, State.selectedCategory, {
            showEdit: true,
            showAddButton: true,
            onSelect: (category) => this.selectCategory(category),
            onEdit: (category) => showEditCategoryModal && showEditCategoryModal(category),
            onAdd: () => showAddCategoryModal && showAddCategoryModal()
        });
    },

    selectCategory(cat) {
        State.selectedCategory = cat;
        this.renderCategories();
        this.renderVariants();
    },

    renderVariants() {
        const card = DOM.get('variantCard');
        const container = DOM.get('variantGrid');
        const title = DOM.get('variantCardTitle');

        if (!State.selectedCategory) {
            DOM.hide(card);
            return;
        }

        DOM.show(card);
        setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
        DOM.setText(title, State.selectedCategory + ' - Select Variant');

        const variants = State.products[State.selectedCategory] || [];
        GridUtil.renderVariantGrid(container, variants, State.selectedCategory, {
            showEdit: true,
            showStock: true,
            showPrice: true,
            showAddButton: true,
            onSelect: (variant) => this.selectVariantForCart(variant),
            onEdit: (category, variant) => showEditVariantModal && showEditVariantModal(category, variant),
            onAdd: () => showAddVariantModal && showAddVariantModal('sale')
        });
    },

    selectVariantForCart(variant) {
        const key = `${State.selectedCategory}|${variant}`;
        const inv = State.inventory[key] || { qty: 0, price: 0 };

        if (inv.qty <= 0) {
            Toast.show('Out of stock!');
            return;
        }

        State.selectedVariant = { category: State.selectedCategory, variant, key };

        DOM.setText(DOM.get('cartModalProduct'), State.selectedCategory);
        DOM.setText(DOM.get('cartModalVariant'), variant);
        DOM.setValue(DOM.get('cartModalPrice'), inv.price || '');
        DOM.setText(DOM.get('cartModalSuggested'), inv.price?.toLocaleString() || '0');
        DOM.setText(DOM.get('cartModalQty'), '1');

        Modal.show('addCartModal');
    },

    changeCartModalQty(delta) {
        const qtyEl = DOM.get('cartModalQty');
        let qty = parseInt(qtyEl.textContent) + delta;
        const inv = State.inventory[State.selectedVariant.key] || { qty: 0 };
        qty = Math.max(1, Math.min(qty, inv.qty));
        DOM.setText(qtyEl, qty);
    },

    addToCart() {
        const price = parseFloat(DOM.getValue(DOM.get('cartModalPrice'))) || 0;
        const qty = parseInt(DOM.get('cartModalQty').textContent) || 1;
        const inv = State.inventory[State.selectedVariant.key] || {};

        State.cart.push({
            ...State.selectedVariant,
            price,
            qty,
            costPrice: inv.costPrice || 0
        });

        Modal.hide('addCartModal');
        this.renderCart();
        setTimeout(() => DOM.get('cartCard')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);

        // Animate the newly added item
        setTimeout(() => {
            const cartItems = document.querySelectorAll('.cart-item');
            const newItem = cartItems[cartItems.length - 1];
            if (newItem) {
                newItem.classList.add('cart-item-enter');
            }
        }, 10);

        // Badge bounce animation
        const cartBadge = DOM.get('cartCount');
        if (cartBadge) {
            cartBadge.classList.add('badge-bounce');
            setTimeout(() => cartBadge.classList.remove('badge-bounce'), 600);
        }

        Toast.success('Added to cart');
    },

    renderCart() {
        const cartCard = DOM.get('cartCard');
        const container = DOM.get('cartItems');

        if (State.cart.length === 0) {
            DOM.hide(cartCard);
            return;
        }

        DOM.show(cartCard);
        DOM.setText(DOM.get('cartCount'), State.cart.length);

        let subtotal = 0;
        Template.renderListTo('cartItems', 'tpl-cart-item', State.cart,
            (item, i) => {
                const itemTotal = item.price * item.qty;
                subtotal += itemTotal;
                return {
                    data: {
                        category: item.category,
                        variant: item.variant,
                        qty: item.qty,
                        total: Format.currency(itemTotal)
                    },
                    options: { dataAttrs: { index: i } }
                };
            }
        );

        DOM.setText(DOM.get('cartSubtotal'), Format.currency(subtotal));
        DOM.setText(DOM.get('cartTotal'), Format.currency(subtotal));
    },

    updateCartQty(index, delta) {
        const inv = State.inventory[State.cart[index].key] || { qty: 0 };
        State.cart[index].qty = Math.max(1, Math.min(State.cart[index].qty + delta, inv.qty));
        this.renderCart();
    },

    removeFromCart(index) {
        // Animate removal
        const cartItem = document.querySelector(`.cart-item[data-index="${index}"]`);
        if (cartItem) {
            cartItem.classList.add('cart-item-exit');
            setTimeout(() => {
                State.cart.splice(index, 1);
                this.renderCart();
            }, 300); // Match animation duration
        } else {
            // Fallback if element not found
            State.cart.splice(index, 1);
            this.renderCart();
        }
    },

    // Internal search implementation
    _performCustomerSearch() {
        const search = DOM.getValue(DOM.get('customerSearch')).toLowerCase();
        const filtered = State.customers.filter(c =>
            c.name.toLowerCase().includes(search) ||
            c.phone.includes(search)
        ).slice(0, 5);

        if (filtered.length === 0) {
            DOM.setHtml(DOM.get('customerList'),
                '<p style="color: var(--gray); text-align: center; padding: 20px;">No customers found</p>');
            return;
        }

        Template.renderListTo('customerList', 'tpl-customer-search', filtered,
            (c) => ({
                data: { name: c.name, phone: c.phone },
                options: { dataAttrs: { name: c.name, phone: c.phone } }
            })
        );
    },

    // Debounced version for oninput
    searchCustomers: null, // Will be initialized with debounced version

    selectCustomerForSale(name, phone) {
        DOM.setValue(DOM.get('customerName'), name);
        DOM.setValue(DOM.get('customerPhone'), phone);
        DOM.setValue(DOM.get('customerSearch'), '');
        DOM.clear(DOM.get('customerList'));
    },

    selectPayment(method) {
        State.selectedPayment = method;
        DOM.toggleClass(DOM.get('btnCash'), 'btn-primary', method === 'Cash');
        DOM.toggleClass(DOM.get('btnCash'), 'btn-outline', method !== 'Cash');
        DOM.toggleClass(DOM.get('btnUPI'), 'btn-primary', method === 'UPI');
        DOM.toggleClass(DOM.get('btnUPI'), 'btn-outline', method !== 'UPI');
    },

    toggleSplitPayment() {
        const isSplit = DOM.get('splitPaymentToggle')?.checked;
        DOM.toggle(DOM.get('paymentMethodSimple'), !isSplit);
        DOM.toggle(DOM.get('paymentMethodSplit'), isSplit);
        if (isSplit) {
            this.initPaymentSplit(State._paymentTotal || 0);
        }
    },

    initPaymentSplit(total) {
        State._paymentTotal = total;
        DOM.setValue(DOM.get('paymentCash'), total > 0 ? total : '');
        DOM.setValue(DOM.get('paymentUPI'), '');
        this._updatePaymentBalance(total, 0, total);
    },

    onCashInput() {
        const total = State._paymentTotal || 0;
        const cash = parseFloat(DOM.getValue(DOM.get('paymentCash'))) || 0;
        const upi = Math.max(0, total - cash);
        DOM.setValue(DOM.get('paymentUPI'), upi > 0 ? upi : '');
        this._updatePaymentBalance(cash, upi, total);
    },

    onUPIInput() {
        const total = State._paymentTotal || 0;
        const upi = parseFloat(DOM.getValue(DOM.get('paymentUPI'))) || 0;
        const cash = Math.max(0, total - upi);
        DOM.setValue(DOM.get('paymentCash'), cash > 0 ? cash : '');
        this._updatePaymentBalance(cash, upi, total);
    },

    _updatePaymentBalance(cash, upi, total) {
        const el = DOM.get('paymentBalance');
        if (!el) return;
        const diff = total - (cash + upi);
        if (Math.abs(diff) < 0.01) {
            el.innerHTML = `<span style="color: var(--success);">✓ Fully allocated</span>`;
        } else if (diff > 0) {
            el.innerHTML = `<span style="color: var(--danger);">Remaining: ${Format.currency(diff)}</span>`;
        } else {
            el.innerHTML = `<span style="color: var(--danger);">Over by: ${Format.currency(Math.abs(diff))}</span>`;
        }
    },

    renderPaymentSummary() {
        let total = 0;
        Template.renderListTo('paymentSummary', 'tpl-payment-item', State.cart,
            (item) => {
                const itemTotal = item.price * item.qty;
                total += itemTotal;
                return {
                    data: {
                        description: `${item.category} - ${item.variant} x${item.qty}`,
                        amount: Format.currency(itemTotal)
                    },
                    options: {}
                };
            }
        );
        DOM.setText(DOM.get('paymentTotal'), Format.currency(total));
        this.initPaymentSplit(total);
    },

    completeSale() {
        if (State.cart.length === 0) {
            Toast.show('Cart is empty. Add items first.');
            return;
        }
        const isSplit = DOM.get('splitPaymentToggle')?.checked;
        let cashAmount, upiAmount;
        if (isSplit) {
            cashAmount = parseFloat(DOM.getValue(DOM.get('paymentCash'))) || 0;
            upiAmount = parseFloat(DOM.getValue(DOM.get('paymentUPI'))) || 0;
            if (cashAmount <= 0 && upiAmount <= 0) {
                Toast.show('Enter payment amount');
                return;
            }
            const expectedTotal = State._paymentTotal || 0;
            if (expectedTotal > 0 && Math.abs(cashAmount + upiAmount - expectedTotal) > 1) {
                Toast.show(`Payment ${Format.currency(cashAmount + upiAmount)} must equal total ${Format.currency(expectedTotal)}`);
                return;
            }
        } else {
            if (!State.selectedPayment) {
                Toast.show('Please select a payment method (Cash or UPI)');
                return;
            }
        }

        const customerName = DOM.getValue(DOM.get('customerName')).trim();
        const customerPhone = DOM.getValue(DOM.get('customerPhone')).trim();

        let total = 0, profit = 0;
        State.cart.forEach(item => {
            total += item.price * item.qty;
            profit += (item.price - item.costPrice) * item.qty;

            // Use transaction-based update for concurrent safety
            if (State.inventory[item.key]) {
                Storage.updateInventoryQty(item.key, -item.qty);
            }
        });

        // Resolve final payment amounts
        let finalCash, finalUpi, paymentMethod;
        if (isSplit) {
            finalCash = cashAmount;
            finalUpi = upiAmount;
            paymentMethod = finalCash > 0 && finalUpi > 0 ? 'Mixed'
                : finalUpi > 0 ? 'UPI' : 'Cash';
        } else {
            paymentMethod = State.selectedPayment;
            finalCash = paymentMethod === 'Cash' ? total : 0;
            finalUpi = paymentMethod === 'UPI' ? total : 0;
        }

        const sale = {
            id: Date.now().toString(),
            date: Format.today(),
            time: Format.time(),
            items: State.cart.map(c => ({ ...c })),
            total,
            profit,
            paymentMethod,
            payments: { cash: finalCash, upi: finalUpi },
            customer: customerName ? { name: customerName, phone: customerPhone } : null
        };

        State.sales.push(sale);
        Storage.saveSale(sale);

        // Save customer if new (name required, phone optional)
        if (customerName) {
            let existing = null;
            if (customerPhone) {
                existing = State.customers.find(c => c.phone === customerPhone);
            } else {
                // Check by name if no phone
                existing = State.customers.find(c => c.name === customerName && !c.phone);
            }
            if (!existing) {
                const customerId = customerPhone || ('cust_' + Date.now().toString(36));
                const newCustomer = { id: customerId, name: customerName, phone: customerPhone, email: '' };
                State.customers.push(newCustomer);
                Storage.saveCustomer(newCustomer);
            }
        }

        State.currentSaleData = { ...sale, customerPhone };
        DOM.setText(DOM.get('saleCompleteAmount'), 'Total: ' + Format.currency(total));
        DOM.toggle(DOM.get('smsBillSection'), !!customerPhone);
        if (customerPhone) {
            DOM.setText(DOM.get('smsPreviewComplete'), this.generateBillText(sale));
        }

        Modal.show('saleCompleteModal');
        this.reset();
        this.showStep('products');

        if (onSaleComplete) onSaleComplete();
    },

    generateBillText(saleData) {
        let text = `MANIKANTA ENTERPRISES\n`;
        text += `========================\n\n`;
        text += `Date: ${Format.date(saleData.date)}\n`;
        text += `Time: ${DateUtil.formatTime(saleData.time)}\n`;
        if (saleData.customer?.name) {
            text += `Customer: ${saleData.customer.name}\n`;
        }
        text += `\n------------------------\n`;
        text += `Items:\n`;
        saleData.items.forEach(item => {
            text += `- ${item.category} (${item.variant})\n`;
            text += `  ${item.qty} x ${Format.currency(item.price)} = ${Format.currency(item.price * item.qty)}\n`;
        });
        text += `------------------------\n`;
        text += `Total: ${Format.currency(saleData.total)}\n`;
        text += `Payment: ${saleData.paymentMethod}\n`;
        text += `========================\n\n`;
        text += `Thank you for your purchase!`;
        return text;
    },

    sendSMSBill() {
        if (!State.currentSaleData?.customerPhone) return;
        const text = this.generateBillText(State.currentSaleData);
        window.location.href = `sms:${State.currentSaleData.customerPhone}?body=${encodeURIComponent(text)}`;
    },

    closeSaleComplete() {
        Modal.hide('saleCompleteModal');
        State.currentSaleData = null;
    },

    _performProductFilter() {
        const search = DOM.getValue(DOM.get('productSearch')).toLowerCase();
        DOM.findAll('.category-btn').forEach(btn => {
            const matches = btn.textContent.toLowerCase().includes(search);
            btn.style.opacity = search && !matches ? '0.3' : '1';
        });
    },

    filterProducts: null // Will be initialized with debounced version
};

// Initialize debounced search and filter functions (300ms delay)
Sales.searchCustomers = debounce(Sales._performCustomerSearch.bind(Sales), 300);
Sales.filterProducts = debounce(Sales._performProductFilter.bind(Sales), 200);
