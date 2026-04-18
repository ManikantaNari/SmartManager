// Dashboard Module

import { DOM, Format, Template, Loader } from '../utils/index.js';
import { State } from '../state/index.js';

// External dependency - will be injected
let showTransactionDetails = null;

export const Dashboard = {
    init(transactionHandler) {
        showTransactionDetails = transactionHandler;

        // Click handler for recent sales
        DOM.on(DOM.get('recentSales'), 'click', '.transaction-row', (e, el) => {
            if (showTransactionDetails) {
                showTransactionDetails(el.dataset.saleId);
            }
        });
    },

    render() {
        // Show loaders first
        Loader.show('recentSales', 'Loading sales...');
        Loader.show('lowStockList', 'Checking stock...');

        // Small delay to show loader, then render
        setTimeout(() => {
            this.renderStats();
            this.renderLowStock();
            this.renderRecentSales();
        }, 100);
    },

    renderStats() {
        const today = Format.today();
        const todaySales = State.sales.filter(s => s.date === today);

        let totalSales = 0, totalProfit = 0, totalItems = 0;
        todaySales.forEach(sale => {
            totalSales += sale.total;
            totalProfit += sale.profit || 0;
            totalItems += sale.items.reduce((sum, item) => sum + item.qty, 0);
        });

        DOM.setText(DOM.get('todaySales'), Format.currency(totalSales));
        DOM.setText(DOM.get('todayItems'), totalItems);

        const profitEl = DOM.get('todayProfit');
        DOM.setText(profitEl, Format.currency(totalProfit));
        if (profitEl) {
            profitEl.style.color = totalProfit >= 0 ? 'var(--success)' : 'var(--danger)';
        }

        DOM.setText(DOM.get('todayTxn'), todaySales.length);
    },

    renderLowStock() {
        const lowStockItems = Object.entries(State.inventory)
            .filter(([key, data]) => data.qty <= (data.alertQty || 0))
            .map(([key, data]) => ({ key, ...data }));

        const alertDiv = DOM.get('lowStockAlert');
        DOM.toggle(alertDiv, lowStockItems.length > 0);

        if (lowStockItems.length > 0) {
            Template.renderListTo('lowStockList', 'tpl-low-stock-item', lowStockItems,
                (item) => ({
                    data: { name: item.key, qty: `${item.qty} left` },
                    options: {}
                })
            );
        }
    },

    renderRecentSales() {
        const today = Format.today();
        const todaySales = State.sales
            .filter(s => s.date === today)
            .slice(-5)
            .reverse();

        Template.renderListTo('recentSales', 'tpl-transaction-row', todaySales,
            (sale) => ({
                data: {
                    customer: sale.customer?.name || 'Walk-in Customer',
                    details: `${sale.items.length} items | ${sale.paymentMethod} | ${sale.time}`,
                    total: Format.currency(sale.total)
                },
                options: { dataAttrs: { saleId: sale.id } }
            }),
            'No sales today'
        );
    }
};
