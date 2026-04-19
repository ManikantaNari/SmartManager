// Transactions Module

import { DOM, Format, Toast } from '../utils/index.js';
import { Modal } from '../components/index.js';
import { State, Storage } from '../state/index.js';
import { Sales } from './sales.js';

// External dependencies
let onTransactionDeleted = null;
let requestAdminAccess = null;

export const Transactions = {
    init(callbacks) {
        onTransactionDeleted = callbacks.onTransactionDeleted;
        requestAdminAccess = callbacks.requestAdminAccess;
        Modal.initCloseOnOverlay('transactionModal');
    },

    showDetails(saleId) {
        const sale = State.sales.find(s => s.id === saleId);
        if (!sale) {
            Toast.show('Transaction not found');
            return;
        }

        State.selectedTransactionId = saleId;
        const container = DOM.get('transactionDetails');

        // Build details HTML
        let html = '<div style="background: var(--light); border-radius: 12px; padding: 16px; margin-bottom: 16px;">';

        const details = [
            { label: 'Date', value: Format.date(sale.date) },
            { label: 'Time', value: sale.time },
            { label: 'Customer', value: sale.customer?.name || 'Walk-in' }
        ];
        if (sale.customer?.phone) {
            details.push({ label: 'Phone', value: sale.customer.phone });
        }
        details.push({ label: 'Payment', value: sale.paymentMethod });

        details.forEach(d => {
            html += `<div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: var(--gray);">${d.label}</span>
                <strong>${d.value}</strong>
            </div>`;
        });
        html += '</div>';

        html += '<div class="card-title">Items</div>';
        sale.items.forEach(item => {
            html += `<div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border);">
                <div>
                    <strong>${item.category}</strong>
                    <p style="font-size: 13px; color: var(--gray);">${item.variant} x ${item.qty}</p>
                </div>
                <strong>${Format.currency(item.price * item.qty)}</strong>
            </div>`;
        });

        html += `<div style="display: flex; justify-content: space-between; padding: 16px 0; font-size: 18px;">
            <strong>Total</strong>
            <strong style="color: var(--success);">${Format.currency(sale.total)}</strong>
        </div>`;

        DOM.setHtml(container, html);
        DOM.setText(DOM.get('smsPreview'), Sales.generateBillText(sale));
        DOM.toggle(DOM.get('transactionSmsSection'), !!sale.customer?.phone);

        // Show/hide back button based on navigation source
        const backBtn = DOM.get('transactionBackBtn');
        if (backBtn) {
            DOM.toggle(backBtn, State.cameFromHistory);
        }

        Modal.show('transactionModal');
    },

    close() {
        Modal.hide('transactionModal');
        State.selectedTransactionId = null;
        State.cameFromHistory = false;
    },

    backToHistory() {
        Modal.hide('transactionModal');
        State.selectedTransactionId = null;
        if (window.backToCustomerHistory) {
            window.backToCustomerHistory();
        }
    },

    sendSMS() {
        const sale = State.sales.find(s => s.id === State.selectedTransactionId);
        if (!sale?.customer?.phone) {
            Toast.show('No phone number available');
            return;
        }
        const text = Sales.generateBillText(sale);
        window.location.href = `sms:${sale.customer.phone}?body=${encodeURIComponent(text)}`;
    },

    confirmDelete() {
        if (!confirm('Are you sure you want to delete this transaction? Stock will be restored.')) {
            return;
        }
        if (State.isAdminUnlocked) {
            this.executeDelete();
        } else if (requestAdminAccess) {
            requestAdminAccess('deleteTransaction', () => this.executeDelete());
        }
    },

    executeDelete() {
        if (!State.selectedTransactionId) {
            Toast.show('No transaction selected');
            return;
        }

        const saleIndex = State.sales.findIndex(s => s.id === State.selectedTransactionId);
        if (saleIndex === -1) {
            Toast.show('Transaction not found');
            this.close();
            return;
        }

        const sale = State.sales[saleIndex];

        // Restore inventory
        sale.items.forEach(item => {
            if (State.inventory[item.key]) {
                State.inventory[item.key].qty += item.qty;
                Storage.saveInventoryItem(item.key, State.inventory[item.key]);
            }
        });

        State.sales.splice(saleIndex, 1);
        Storage.deleteSale(State.selectedTransactionId);

        this.close();

        if (onTransactionDeleted) {
            onTransactionDeleted();
        }

        Toast.show('Transaction deleted successfully');
    }
};
