// Reports Module

import { DOM, Format, Template, Loader } from '../utils';
import { State } from '../state';

// External dependencies
let showTransactionDetails = null;

export const Reports = {
    init(callbacks) {
        showTransactionDetails = callbacks?.showTransactionDetails;

        DOM.on(DOM.get('dailyReportContent'), 'click', '.transaction-row', (e, el) => {
            if (showTransactionDetails) {
                showTransactionDetails(el.dataset.saleId);
            }
        });
    },

    showTab(tab) {
        ['daily', 'monthly', 'products', 'stocklog'].forEach(t => {
            const tabEl = DOM.get('rtab-' + t);
            const contentEl = DOM.get('report-' + t);
            if (tabEl) DOM.toggleClass(tabEl, 'active', t === tab);
            if (contentEl) DOM.toggle(contentEl, t === tab);
        });

        // Load data immediately - no artificial delay
        if (tab === 'daily') {
            this.loadDaily();
        } else if (tab === 'monthly') {
            this.loadMonthly();
        } else if (tab === 'products') {
            this.loadProducts();
        } else if (tab === 'stocklog') {
            this.loadStockLog();
        }
    },

    setDefaultDates() {
        const today = Format.today();
        const month = today.substring(0, 7);
        DOM.setValue(DOM.get('reportDate'), today);
        DOM.setValue(DOM.get('reportMonth'), month);
    },

    loadDaily() {
        const container = DOM.get('dailyReportContent');
        try {
            const date = DOM.getValue(DOM.get('reportDate'));

            // Display formatted date
            const dateDisplay = DOM.get('selectedDateDisplay');
            if (dateDisplay) {
                DOM.setText(dateDisplay, date ? Format.date(date) : '');
                DOM.toggle(dateDisplay, !!date);
            }

            const daySales = (State.sales || []).filter(s => s && s.date === date);
            let total = 0, profit = 0, items = 0;

            daySales.forEach(s => {
                total += s.total || 0;
                profit += s.profit || 0;
                const saleItems = s.items || [];
                items += saleItems.reduce((sum, i) => sum + (i?.qty || 0), 0);
            });

            // Stats grid
            const profitColor = profit >= 0 ? 'var(--success)' : 'var(--danger)';
            let statsHtml = '<div class="stats-grid" style="grid-template-columns: repeat(2, 1fr);">';
            statsHtml += `<div class="stat-card"><div class="stat-label">Total Sales</div><div class="stat-value">${Format.currency(total)}</div></div>`;
            statsHtml += `<div class="stat-card"><div class="stat-label">Items Sold</div><div class="stat-value">${items}</div></div>`;
            if (State.isAdmin()) {
                statsHtml += `<div class="stat-card"><div class="stat-label">Profit</div><div class="stat-value" style="color: ${profitColor}">${Format.currency(profit)}</div></div>`;
            }
            statsHtml += `<div class="stat-card"><div class="stat-label">Transactions</div><div class="stat-value">${daySales.length}</div></div>`;
            statsHtml += '</div>';

            // Transactions list
            statsHtml += '<div class="card"><div class="card-title">Transactions (tap to view details)</div>';
            if (daySales.length === 0) {
                statsHtml += '<p style="color: var(--gray);">No sales on this date</p>';
            } else {
                daySales.forEach(s => {
                    const saleItems = s.items || [];
                    statsHtml += `<div class="list-item transaction-row" data-sale-id="${s.id}" style="cursor: pointer;">
                        <div class="list-item-info">
                            <h4>${s.customer?.name || 'Walk-in'}</h4>
                            <p>${s.time || ''} | ${saleItems.length} items | ${s.paymentMethod || 'Cash'}</p>
                        </div>
                        <div style="text-align: right;">
                            <strong>${Format.currency(s.total || 0)}</strong>
                            <p style="font-size: 11px; color: var(--primary);">View</p>
                        </div>
                    </div>`;
                });
            }
            statsHtml += '</div>';

            DOM.setHtml(container, statsHtml);
        } catch (err) {
            console.error('Error loading daily report:', err);
            DOM.setHtml(container, '<div class="card"><p style="color: var(--danger);">Error loading report</p></div>');
        }
    },

    loadMonthly() {
        const container = DOM.get('monthlyReportContent');
        try {
            const month = DOM.getValue(DOM.get('reportMonth'));

            // Display formatted month
            const monthDisplay = DOM.get('selectedMonthDisplay');
            if (monthDisplay && month) {
                const [year, mon] = month.split('-');
                DOM.setText(monthDisplay, `${Format.monthName(mon)} ${year}`);
                DOM.show(monthDisplay);
            }

            const monthSales = (State.sales || []).filter(s => s && s.date && s.date.startsWith(month));
            let total = 0, profit = 0, items = 0;

            monthSales.forEach(s => {
                total += s.total || 0;
                profit += s.profit || 0;
                const saleItems = s.items || [];
                items += saleItems.reduce((sum, i) => sum + (i?.qty || 0), 0);
            });

            const profitColor = profit >= 0 ? 'var(--success)' : 'var(--danger)';
            let html = '<div class="stats-grid" style="grid-template-columns: repeat(2, 1fr);">';
            html += `<div class="stat-card primary"><div class="stat-label">Total Sales</div><div class="stat-value">${Format.currency(total)}</div></div>`;
            html += `<div class="stat-card success"><div class="stat-label">Items Sold</div><div class="stat-value">${items}</div></div>`;
            if (State.isAdmin()) {
                html += `<div class="stat-card"><div class="stat-label">Total Profit</div><div class="stat-value" style="color: ${profitColor}">${Format.currency(profit)}</div></div>`;
            }
            html += `<div class="stat-card"><div class="stat-label">Transactions</div><div class="stat-value">${monthSales.length}</div></div>`;
            html += '</div>';

            DOM.setHtml(container, html);
        } catch (err) {
            console.error('Error loading monthly report:', err);
            DOM.setHtml(container, '<div class="card"><p style="color: var(--danger);">Error loading report</p></div>');
        }
    },

    loadProducts() {
        const container = DOM.get('bestSellers');
        try {
            const productStats = {};

            (State.sales || []).forEach(sale => {
                if (!sale) return;
                const saleItems = sale.items || [];
                saleItems.forEach(item => {
                    if (!item) return;
                    const key = item.category || 'Unknown';
                    if (!productStats[key]) {
                        productStats[key] = { qty: 0, revenue: 0, profit: 0 };
                    }
                    const qty = item.qty || 0;
                    const price = item.price || 0;
                    productStats[key].qty += qty;
                    productStats[key].revenue += price * qty;

                    let costPrice = item.costPrice || 0;
                    if (!costPrice && item.key && State.inventory && State.inventory[item.key]) {
                        costPrice = State.inventory[item.key].costPrice || 0;
                    }
                    productStats[key].profit += (price - costPrice) * qty;
                });
            });

            // Calculate remaining stock
            for (const category of Object.keys(productStats)) {
                let totalStock = 0;
                for (const [key, data] of Object.entries(State.inventory || {})) {
                    if (key.startsWith(category + '|')) {
                        totalStock += data?.qty || 0;
                    }
                }
                productStats[category].remainingStock = totalStock;
            }

            const sorted = Object.entries(productStats)
                .sort((a, b) => b[1].qty - a[1].qty)
                .slice(0, 10);

            if (sorted.length === 0) {
                DOM.setHtml(container, '<p style="color: var(--gray);">No sales data yet</p>');
                return;
            }

            Template.renderListTo('bestSellers', 'tpl-bestseller-row', sorted,
                ([name, data], i) => {
                    const profitPercent = data.revenue > 0 ? ((data.profit / data.revenue) * 100).toFixed(1) : 0;
                    return {
                        data: {
                            rank: `${i + 1}. ${name || 'Unknown'}`,
                            stats: `${data.qty} sold | ${data.remainingStock} remaining`,
                            revenue: Format.currency(data.revenue),
                            profit: State.isAdmin() ? Format.currency(data.profit) : '',
                            profitPercent: State.isAdmin() ? `${profitPercent}%` : '',
                            _profitValue: data.profit // Store raw value for styling
                        },
                        options: {}
                    };
                }
            );

            // Apply profit color based on value (red for negative, green for positive)
            if (State.isAdmin()) {
                const rows = DOM.findAll('#bestSellers .list-item');
                sorted.forEach(([name, data], i) => {
                    if (rows[i]) {
                        const profitColor = data.profit >= 0 ? 'var(--success)' : 'var(--danger)';
                        const profitSpans = rows[i].querySelectorAll('.profit-display span[data-field]');
                        profitSpans.forEach(span => span.style.color = profitColor);
                    }
                });
            } else {
                DOM.findAll('#bestSellers .profit-display').forEach(el => el.style.display = 'none');
            }
        } catch (err) {
            console.error('Error loading products report:', err);
            DOM.setHtml(container, '<p style="color: var(--danger);">Error loading products</p>');
        }
    },

    toggleProfitDisplay() {
        const toggle = DOM.get('profitToggle');
        const showPercent = toggle && toggle.checked;

        DOM.findAll('#bestSellers .profit-amount').forEach(el => {
            el.style.display = showPercent ? 'none' : 'block';
        });
        DOM.findAll('#bestSellers .profit-percent').forEach(el => {
            el.style.display = showPercent ? 'block' : 'none';
        });
    },

    loadStockLog() {
        const container = DOM.get('stockLogContent');
        try {
            const date = DOM.getValue(DOM.get('stockLogDate'));
            let logs = State.stockLogs || [];

            // Filter by date if selected
            if (date) {
                logs = logs.filter(log => log && log.date === date);
            }

            if (logs.length === 0) {
                DOM.setHtml(container, `
                    <div class="card">
                        <p style="color: var(--gray); text-align: center;">
                            ${date ? 'No stock entries on this date' : 'No stock entries yet'}
                        </p>
                    </div>
                `);
                return;
            }

            let html = '';
            logs.forEach(log => {
                if (!log) return;

                // Backfill defaults for missing fields
                const vendor = log.vendor || 'Added during sale';
                const logDate = log.date || 'Unknown date';
                const logTime = log.time || '';
                const items = log.items || [];
                const addedBy = log.addedBy || 'Unknown';

                const totalItems = items.reduce((sum, item) => sum + (item?.qty || 0), 0);
                const totalCost = items.reduce((sum, item) => sum + ((item?.costPrice || 0) * (item?.qty || 0)), 0);

                html += `
                    <div class="card stock-log-card" data-log-id="${log.id}" style="cursor: pointer; margin-bottom: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div>
                                <h4 style="margin: 0; font-size: 16px;">${vendor}</h4>
                                <p style="color: var(--gray); font-size: 13px; margin: 4px 0;">
                                    ${Format.date(logDate)} ${logTime ? 'at ' + logTime : ''}
                                </p>
                                ${log.invoice ? `<p style="font-size: 12px; color: var(--primary);">Invoice: ${log.invoice}</p>` : ''}
                            </div>
                            <div style="text-align: right;">
                                <div style="font-weight: 600; color: var(--success);">${totalItems} items</div>
                                <div style="font-size: 13px; color: var(--gray);">${Format.currency(totalCost)}</div>
                                ${log.photo ? '<div style="font-size: 11px; color: var(--primary); margin-top: 4px;">Has Photo</div>' : ''}
                            </div>
                        </div>
                        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border);">
                            <div style="font-size: 12px; color: var(--gray);">Items:</div>
                            ${items.slice(0, 3).map(item => `
                                <div style="font-size: 13px; margin-top: 4px;">
                                    ${item?.category || 'Unknown'} - ${item?.variant || 'Unknown'}: +${item?.qty || 0} @ ${Format.currency(item?.costPrice || 0)}
                                </div>
                            `).join('')}
                            ${items.length > 3 ? `<div style="font-size: 12px; color: var(--primary); margin-top: 4px;">+${items.length - 3} more items...</div>` : ''}
                        </div>
                        <div style="font-size: 11px; color: var(--gray); margin-top: 8px;">
                            Added by: ${addedBy}
                        </div>
                    </div>
                `;
            });

            DOM.setHtml(container, html);

            // Add click handlers for detail view
            DOM.findAll('#stockLogContent .stock-log-card').forEach(card => {
                card.addEventListener('click', () => {
                    this.showStockLogDetail(card.dataset.logId);
                });
            });
        } catch (err) {
            console.error('Error loading stock log:', err);
            DOM.setHtml(container, '<div class="card"><p style="color: var(--danger);">Error loading stock log</p></div>');
        }
    },

    showStockLogDetail(logId) {
        try {
            const log = (State.stockLogs || []).find(l => l && l.id === logId);
            if (!log) return;

            // Backfill defaults
            const vendor = log.vendor || 'Added during sale';
            const logDate = log.date || 'Unknown date';
            const logTime = log.time || '';
            const items = log.items || [];
            const addedBy = log.addedBy || 'Unknown';

            const totalItems = items.reduce((sum, item) => sum + (item?.qty || 0), 0);
            const totalCost = items.reduce((sum, item) => sum + ((item?.costPrice || 0) * (item?.qty || 0)), 0);

            let itemsHtml = items.map(item => {
                const category = item?.category || 'Unknown';
                const variant = item?.variant || 'Unknown';
                const qty = item?.qty || 0;
                const costPrice = item?.costPrice || 0;
                const price = item?.price || 0;
                return `
                    <div class="list-item" style="border-bottom: 1px solid var(--border);">
                        <div class="list-item-info">
                            <h4>${category} - ${variant}</h4>
                            <p>Qty: +${qty} | Cost: ${Format.currency(costPrice)} | Price: ${Format.currency(price)}</p>
                        </div>
                        <div style="font-weight: 600; color: var(--success);">
                            ${Format.currency(costPrice * qty)}
                        </div>
                    </div>
                `;
            }).join('');

            const modalContent = `
                <div class="modal-header">
                    <h3 class="modal-title">Stock Entry Details</h3>
                    <button class="modal-close" onclick="closeStockLogModal()">&times;</button>
                </div>
                <div style="padding: 16px;">
                    <div class="card" style="background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); color: white; margin-bottom: 16px;">
                        <h4 style="margin: 0;">${vendor}</h4>
                        <p style="opacity: 0.9; margin: 4px 0;">${Format.date(logDate)} ${logTime ? 'at ' + logTime : ''}</p>
                        ${log.invoice ? `<p style="opacity: 0.8; font-size: 13px;">Invoice: ${log.invoice}</p>` : ''}
                    </div>

                    <div class="stats-grid" style="grid-template-columns: repeat(2, 1fr); margin-bottom: 16px;">
                        <div class="stat-card">
                            <div class="stat-label">Total Items</div>
                            <div class="stat-value">${totalItems}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Total Cost</div>
                            <div class="stat-value">${Format.currency(totalCost)}</div>
                        </div>
                    </div>

                    ${log.photo ? `
                        <button class="btn btn-outline btn-block" onclick="viewStockLogPhoto('${logId}')" style="margin-bottom: 16px;">
                            View Invoice Photo
                        </button>
                    ` : ''}

                    <div class="card">
                        <div class="card-title">Items Added (${items.length})</div>
                        ${itemsHtml || '<p style="color: var(--gray);">No items recorded</p>'}
                    </div>

                    <p style="text-align: center; color: var(--gray); font-size: 12px; margin-top: 16px;">
                        Added by: ${addedBy}
                    </p>
                </div>
            `;

            const modal = DOM.get('stockLogModal');
            if (modal) {
                const modalInner = DOM.find('#stockLogModal .modal');
                if (modalInner) {
                    modalInner.innerHTML = modalContent;
                    modal.classList.add('show');
                }
            }
        } catch (err) {
            console.error('Error showing stock log detail:', err);
        }
    },

    closeStockLogModal() {
        const modal = DOM.get('stockLogModal');
        if (modal) modal.classList.remove('show');
    },

    viewStockLogPhoto(logId) {
        try {
            const log = (State.stockLogs || []).find(l => l && l.id === logId);
            if (!log || !log.photo) return;

            const photoModal = DOM.get('photoViewModal');
            const photoImg = DOM.get('photoViewImage');
            if (photoModal && photoImg) {
                photoImg.src = log.photo;
                photoModal.classList.add('show');
            }
        } catch (err) {
            console.error('Error viewing photo:', err);
        }
    },

    closePhotoModal() {
        const modal = DOM.get('photoViewModal');
        if (modal) modal.classList.remove('show');
    }
};
