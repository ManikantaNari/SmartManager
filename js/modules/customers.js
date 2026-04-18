// Customers Module

import { DOM, Format, Template, Toast, Loader } from '../utils';
import { Modal } from '../components';
import { State, Storage } from '../state';
import { getDb } from '../config';

export const Customers = {
    init() {
        DOM.on(DOM.get('allCustomersList'), 'click', '[data-action]', (e, el) => {
            const card = el.closest('[data-phone]');
            const phone = card.dataset.phone;
            const action = el.dataset.action;

            if (action === 'edit') this.edit(phone);
            else if (action === 'delete') this.delete(phone);
        });

        Modal.initCloseOnOverlay('addCustomerModal');
    },

    renderAll() {
        Loader.show('allCustomersList', 'Loading customers...');
        setTimeout(() => this._renderAll(), 100);
    },

    _renderAll() {
        const validCustomers = State.customers.filter(c => c && c.name && c.phone);

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
            const customerSales = State.sales.filter(s => s.customer?.phone === c.phone);
            const totalSpent = customerSales.reduce((sum, s) => sum + (s.total || 0), 0);

            const fragment = Template.render('tpl-customer-card', {
                name: c.name,
                phone: c.phone,
                email: c.email || '',
                totalSpent: Format.currency(totalSpent),
                orderCount: `${customerSales.length} orders`,
                actions: State.isAdmin() ? { html: `
                    <button data-action="edit" style="padding: 6px 14px; font-size: 12px; font-weight: 500; border: none; border-radius: 6px; cursor: pointer; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">Edit</button>
                    <button data-action="delete" style="padding: 6px 14px; font-size: 12px; font-weight: 500; border: none; border-radius: 6px; cursor: pointer; background: rgba(0,0,0,0.08); color: #666;">Delete</button>
                ` } : ''
            }, { dataAttrs: { phone: c.phone } });

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

    edit(phone) {
        const customer = State.customers.find(c => c.phone === phone);
        if (!customer) return;

        State.editingCustomerPhone = phone;
        DOM.setValue(DOM.get('newCustomerName'), customer.name);
        DOM.setValue(DOM.get('newCustomerPhone'), customer.phone);
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

        if (!name || !phone) {
            Toast.show('Name and phone required');
            return;
        }

        const index = State.customers.findIndex(c => c.phone === State.editingCustomerPhone);
        if (index !== -1) {
            State.customers[index] = { name, phone, email };

            const db = getDb();
            if (db && State.editingCustomerPhone !== phone) {
                Storage.deleteCustomer(State.editingCustomerPhone);
            }
            Storage.saveCustomer(State.customers[index]);

            // Update sales references
            if (State.editingCustomerPhone !== phone) {
                State.sales.forEach(sale => {
                    if (sale.customer?.phone === State.editingCustomerPhone) {
                        sale.customer.phone = phone;
                        sale.customer.name = name;
                    }
                });
            }
        }

        State.editingCustomerPhone = null;
        this.closeAddModal();
        this.renderAll();
        Toast.show('Customer updated');
    },

    delete(phone) {
        if (!confirm('Delete this customer? This cannot be undone.')) return;

        const index = State.customers.findIndex(c => c.phone === phone);
        if (index !== -1) {
            State.customers.splice(index, 1);
            Storage.deleteCustomer(phone);
        }

        this.renderAll();
        Toast.show('Customer deleted');
    }
};
