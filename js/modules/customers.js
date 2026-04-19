// Customers Module

import { DOM, Format, Template, Toast, Loader } from '../utils/index.js';
import { Modal } from '../components/index.js';
import { State, Storage } from '../state/index.js';
import { getDb } from '../config/index.js';
import { Bookings } from './bookings.js';

export const Customers = {
    init() {
        DOM.on(DOM.get('allCustomersList'), 'click', '[data-action]', (e, el) => {
            const card = el.closest('[data-customer-id]');
            const customerId = card.dataset.customerId;
            const action = el.dataset.action;

            if (action === 'edit') this.edit(customerId);
            else if (action === 'delete') this.delete(customerId);
            else if (action === 'history') this.showHistory(customerId);
        });

        Modal.initCloseOnOverlay('addCustomerModal');
        Modal.initCloseOnOverlay('customerHistoryModal');
    },

    renderAll() {
        Loader.show('allCustomersList', 'Loading customers...');
        setTimeout(() => this._renderAll(), 100);
    },

    _renderAll() {
        // Show customers with name (phone is now optional)
        const validCustomers = State.customers.filter(c => c && c.name);

        if (validCustomers.length === 0) {
            Template.renderTo('allCustomersList', 'tpl-empty', {
                title: 'No customers yet',
                message: 'Add customers manually or they will appear after sales'
            });
            return;
        }

        const container = DOM.get('allCustomersList');
        DOM.clear(container);

        validCustomers.forEach(c => {
            // Match sales by phone (if exists) or by exact name match (for customers without phone)
            const customerSales = State.sales.filter(s => {
                if (c.phone && s.customer?.phone === c.phone) return true;
                if (!c.phone && s.customer?.name === c.name && !s.customer?.phone) return true;
                return false;
            });

            // Match bookings by phone or name
            const customerBookings = (State.bookings || []).filter(b => {
                if (c.phone && b.customer?.phone === c.phone) return true;
                if (!c.phone && b.customer?.name === c.name && !b.customer?.phone) return true;
                return false;
            });

            // Calculate total spent from both sales and bookings
            const salesTotal = customerSales.reduce((sum, s) => sum + (s.total || 0), 0);
            const bookingsTotal = customerBookings.reduce((sum, b) => sum + (b.totalAdvance || 0), 0);
            const totalSpent = salesTotal + bookingsTotal;

            // Count total orders (sales + bookings)
            const totalOrders = customerSales.length + customerBookings.length;

            const fragment = Template.render('tpl-customer-card', {
                name: c.name,
                phone: c.phone || '-',
                email: c.email || '',
                totalSpent: Format.currency(totalSpent),
                orderCount: `${totalOrders} orders`,
                actions: { html: `
                    <button data-action="history" style="padding: 6px 14px; font-size: 12px; font-weight: 500; border: none; border-radius: 6px; cursor: pointer; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">History</button>
                    ${State.isAdmin() ? `
                    <button data-action="edit" style="padding: 6px 14px; font-size: 12px; font-weight: 500; border: none; border-radius: 6px; cursor: pointer; background: rgba(0,0,0,0.08); color: #666;">Edit</button>
                    <button data-action="delete" style="padding: 6px 14px; font-size: 12px; font-weight: 500; border: none; border-radius: 6px; cursor: pointer; background: rgba(239,68,68,0.1); color: #ef4444;">Delete</button>
                    ` : ''}
                ` }
            }, { dataAttrs: { customerId: c.id || c.phone } });

            container.appendChild(fragment);
        });
    },

    filter() {
        const search = DOM.getValue(DOM.get('allCustomerSearch')).toLowerCase();
        DOM.findAll('#allCustomersList .card').forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(search) ? 'block' : 'none';
        });
    },

    showAddModal() {
        DOM.setValue(DOM.get('newCustomerName'), '');
        DOM.setValue(DOM.get('newCustomerPhone'), '');
        DOM.setValue(DOM.get('newCustomerEmail'), '');
        this.resetModalState();
        Modal.show('addCustomerModal');
    },

    closeAddModal() {
        Modal.hide('addCustomerModal');
        State.editingCustomerPhone = null;
        State.editingCustomerId = null;
        this.resetModalState();
    },

    resetModalState() {
        DOM.setText(DOM.find('#addCustomerModal .modal-title'), 'Add New Customer');
        const btn = DOM.find('#addCustomerModal .btn-primary');
        DOM.setText(btn, 'Add Customer');
        btn.onclick = () => Customers.saveNew();
    },

    saveNew() {
        const name = DOM.getValue(DOM.get('newCustomerName')).trim();
        const phone = DOM.getValue(DOM.get('newCustomerPhone')).trim();
        const email = DOM.getValue(DOM.get('newCustomerEmail')).trim();

        if (!name || !phone) {
            Toast.show('Name and phone required');
            return;
        }

        const customer = { name, phone, email };
        State.customers.push(customer);
        Storage.saveCustomer(customer);

        this.closeAddModal();
        this.renderAll();
        Toast.show('Customer added');
    },

    edit(idOrPhone) {
        // Find by id first, then by phone (backward compatibility)
        const customer = State.customers.find(c => c.id === idOrPhone || c.phone === idOrPhone);
        if (!customer) return;

        State.editingCustomerId = customer.id;
        DOM.setValue(DOM.get('newCustomerName'), customer.name);
        DOM.setValue(DOM.get('newCustomerPhone'), customer.phone || '');
        DOM.setValue(DOM.get('newCustomerEmail'), customer.email || '');

        DOM.setText(DOM.find('#addCustomerModal .modal-title'), 'Edit Customer');
        const btn = DOM.find('#addCustomerModal .btn-primary');
        DOM.setText(btn, 'Save Changes');
        btn.onclick = () => Customers.saveEdit();

        Modal.show('addCustomerModal');
    },

    saveEdit() {
        const name = DOM.getValue(DOM.get('newCustomerName')).trim();
        const phone = DOM.getValue(DOM.get('newCustomerPhone')).trim();
        const email = DOM.getValue(DOM.get('newCustomerEmail')).trim();

        if (!name) {
            Toast.show('Name is required');
            return;
        }

        const index = State.customers.findIndex(c => c.id === State.editingCustomerId);
        if (index !== -1) {
            const oldCustomer = State.customers[index];
            const oldDocId = oldCustomer.phone || oldCustomer.id;
            const newDocId = phone || oldCustomer.id;

            // Preserve original id, update other fields
            State.customers[index] = {
                id: oldCustomer.id,
                name,
                phone,
                email
            };

            const db = getDb();
            // If phone changed and was used as doc id, delete old doc
            if (db && oldCustomer.phone && oldCustomer.phone !== phone) {
                Storage.deleteCustomer(oldDocId);
            }
            Storage.saveCustomer(State.customers[index]);

            // Update sales references if phone changed
            if (oldCustomer.phone !== phone) {
                State.sales.forEach(sale => {
                    if (sale.customer?.phone === oldCustomer.phone) {
                        sale.customer.phone = phone;
                        sale.customer.name = name;
                    }
                });
            }
        }

        State.editingCustomerId = null;
        this.closeAddModal();
        this.renderAll();
        Toast.show('Customer updated');
    },

    delete(idOrPhone) {
        if (!confirm('Delete this customer? This cannot be undone.')) return;

        const index = State.customers.findIndex(c => c.id === idOrPhone || c.phone === idOrPhone);
        if (index !== -1) {
            const customer = State.customers[index];
            const docId = customer.phone || customer.id;
            State.customers.splice(index, 1);
            Storage.deleteCustomer(docId);
        }

        this.renderAll();
        Toast.show('Customer deleted');
    },

    // Get all transactions for a customer
    getCustomerTransactions(customer) {
        const transactions = [];

        // Get sales
        State.sales.forEach(s => {
            const isMatch = (customer.phone && s.customer?.phone === customer.phone) ||
                           (!customer.phone && s.customer?.name === customer.name && !s.customer?.phone);
            if (isMatch) {
                transactions.push({
                    type: 'sale',
                    id: s.id,
                    date: s.date,
                    time: s.time,
                    total: s.total,
                    itemCount: s.items?.length || 0,
                    paymentMethod: s.paymentMethod,
                    status: 'completed'
                });
            }
        });

        // Get bookings
        (State.bookings || []).forEach(b => {
            const isMatch = (customer.phone && b.customer?.phone === customer.phone) ||
                           (!customer.phone && b.customer?.name === customer.name && !b.customer?.phone);
            if (isMatch) {
                transactions.push({
                    type: 'booking',
                    id: b.id,
                    date: b.createdDate,
                    time: b.createdTime,
                    total: b.total,
                    totalPaid: b.totalAdvance,
                    balance: b.balanceRemaining,
                    itemCount: b.items?.length || 0,
                    status: b.status,
                    pickupDate: b.pickupDate
                });
            }
        });

        // Sort by date descending
        transactions.sort((a, b) => {
            const dateA = a.date + ' ' + (a.time || '');
            const dateB = b.date + ' ' + (b.time || '');
            return dateB.localeCompare(dateA);
        });

        return transactions;
    },

    // Show customer transaction history
    showHistory(idOrPhone) {
        const customer = State.customers.find(c => c.id === idOrPhone || c.phone === idOrPhone);
        if (!customer) {
            Toast.show('Customer not found');
            return;
        }

        State.viewingCustomerId = idOrPhone;
        const transactions = this.getCustomerTransactions(customer);

        // Populate modal
        DOM.setText(DOM.get('chCustomerName'), customer.name);
        DOM.setText(DOM.get('chCustomerPhone'), customer.phone || '-');

        const listEl = DOM.get('chTransactionsList');
        if (!listEl) return;

        if (transactions.length === 0) {
            listEl.innerHTML = '<p style="color: var(--gray); text-align: center; padding: 20px;">No transactions yet</p>';
        } else {
            listEl.innerHTML = transactions.map(t => {
                if (t.type === 'sale') {
                    return `
                        <div class="list-item ch-transaction-row" data-type="sale" data-id="${t.id}" style="cursor: pointer;">
                            <div class="list-item-info">
                                <h4>${Format.date(t.date)}</h4>
                                <p>${t.time || ''} | ${t.itemCount} items | ${t.paymentMethod || 'Cash'}</p>
                                <span class="badge badge-success" style="font-size: 10px;">Sale</span>
                            </div>
                            <div style="text-align: right;">
                                <strong>${Format.currency(t.total)}</strong>
                                <p style="font-size: 11px; color: var(--primary);">View</p>
                            </div>
                        </div>
                    `;
                } else {
                    const statusBadge = t.status === 'completed' ? 'badge-success' :
                                       t.status === 'cancelled' ? 'badge-danger' : 'badge-warning';
                    const statusText = t.status === 'completed' ? 'Completed' :
                                      t.status === 'cancelled' ? 'Cancelled' : 'Pending';
                    return `
                        <div class="list-item ch-transaction-row" data-type="booking" data-id="${t.id}" style="cursor: pointer;">
                            <div class="list-item-info">
                                <h4>${Format.date(t.date)}</h4>
                                <p>${t.itemCount} items | Pickup: ${Format.date(t.pickupDate)}</p>
                                <span class="badge badge-primary" style="font-size: 10px;">Booking</span>
                                <span class="badge ${statusBadge}" style="font-size: 10px;">${statusText}</span>
                            </div>
                            <div style="text-align: right;">
                                <strong>${Format.currency(t.total)}</strong>
                                ${t.status === 'pending' ? `<p style="font-size: 11px; color: var(--warning);">Due: ${Format.currency(t.balance)}</p>` : ''}
                                <p style="font-size: 11px; color: var(--primary);">View</p>
                            </div>
                        </div>
                    `;
                }
            }).join('');

            // Add click handlers
            DOM.findAll('#chTransactionsList .ch-transaction-row').forEach(row => {
                row.addEventListener('click', () => {
                    const type = row.dataset.type;
                    const id = row.dataset.id;

                    // Close history modal first, but keep viewingCustomerId for back navigation
                    Modal.hide('customerHistoryModal');
                    State.cameFromHistory = true;

                    if (type === 'sale') {
                        // Show sale transaction modal
                        if (window.showTransactionDetails) {
                            window.showTransactionDetails(id);
                        }
                    } else if (type === 'booking') {
                        // Show booking details
                        Bookings.showDetails(id);
                    }
                });
            });
        }

        Modal.show('customerHistoryModal');
    },

    closeHistory() {
        Modal.hide('customerHistoryModal');
        State.viewingCustomerId = null;
        State.cameFromHistory = false;
    },

    // Reopen history modal (called from back button)
    backToHistory() {
        if (State.viewingCustomerId) {
            this.showHistory(State.viewingCustomerId);
        }
        State.cameFromHistory = false;
    }
};
