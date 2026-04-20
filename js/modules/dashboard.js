// Dashboard Module

import { DOM, Format, Template, Loader, DateUtil } from '../utils/index.js';
import { State } from '../state/index.js';
import { Bookings } from './bookings.js';

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
            this.renderPickupsToday();
            this.renderLowStock();
            this.renderRecentSales();
        }, 100);
    },

    renderStats() {
        const today = Format.today();
        const todaySales = State.sales.filter(s => s.date === today);

        let totalSales = 0, salesProfit = 0, totalItems = 0;
        todaySales.forEach(sale => {
            totalSales += sale.total;
            salesProfit += sale.profit || 0;
            totalItems += sale.items.reduce((sum, item) => sum + item.qty, 0);
        });

        // Include booking revenue
        const bookingRevenue = Bookings.getDateRevenue(today);
        const totalRevenue = totalSales + bookingRevenue.totalRevenue;
        const totalProfit = salesProfit + bookingRevenue.profit;

        DOM.setText(DOM.get('todaySales'), Format.currency(totalRevenue));
        DOM.setText(DOM.get('todayItems'), totalItems);

        const profitEl = DOM.get('todayProfit');
        DOM.setText(profitEl, Format.currency(totalProfit));
        if (profitEl) {
            profitEl.style.color = totalProfit >= 0 ? 'var(--success)' : 'var(--danger)';
        }

        DOM.setText(DOM.get('todayTxn'), todaySales.length);
    },

    renderPickupsToday() {
        const today = Format.today();
        const pickupsToday = State.bookings.filter(b =>
            b.status === 'pending' && b.pickupDate === today
        );
        const overduePickups = State.bookings.filter(b =>
            b.status === 'pending' && b.pickupDate < today
        );

        const allPickups = [...pickupsToday, ...overduePickups];
        const card = DOM.get('pickupsTodayCard');
        const countEl = DOM.get('pickupsTodayCount');

        if (countEl) {
            DOM.setText(countEl, allPickups.length);
        }

        DOM.toggle(card, allPickups.length > 0);

        if (allPickups.length > 0) {
            const listEl = DOM.get('pickupsTodayList');
            if (listEl) {
                listEl.innerHTML = allPickups.slice(0, 5).map(b => {
                    const isOverdue = b.pickupDate < today;
                    return `
                        <div class="list-item" onclick="showPage('bookings')" style="cursor: pointer;">
                            <div style="flex: 1;">
                                <div style="font-weight: 600;">${b.customer?.name || 'Unknown'}</div>
                                <div style="font-size: 13px; color: var(--gray);">
                                    ${Format.currency(b.total)} | Due: ${Format.currency(b.balanceRemaining)}
                                    ${isOverdue ? '<span style="color: var(--danger);"> (Overdue)</span>' : ''}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
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
                    details: `${sale.items.length} items | ${sale.paymentMethod} | ${DateUtil.formatTime(sale.time)}`,
                    total: Format.currency(sale.total)
                },
                options: { dataAttrs: { saleId: sale.id } }
            }),
            'No sales today'
        );
    }
};
