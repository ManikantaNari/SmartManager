// Reports Module

import { DOM, Format, Template, Loader, DateUtil } from '../utils/index.js';
import { State } from '../state/index.js';
import { Bookings } from './bookings.js';

// External dependencies
let showTransactionDetails = null;

export const Reports = {
    init(callbacks) {
        showTransactionDetails = callbacks?.showTransactionDetails;

        // Click handler for direct sales
        DOM.on(DOM.get('dailyReportContent'), 'click', '.transaction-row', (e, el) => {
            if (showTransactionDetails) {
                showTransactionDetails(el.dataset.saleId);
            }
        });

        // Click handler for booking transactions
        DOM.on(DOM.get('dailyReportContent'), 'click', '.booking-transaction-row', (e, el) => {
            const bookingId = el.dataset.bookingId;
            const paymentType = el.dataset.paymentType;
            const paymentIndex = parseInt(el.dataset.paymentIndex) || 0;
            Bookings.showPaymentReceipt(bookingId, paymentType, paymentIndex);
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
                DOM.setText(dateDisplay, date ? DateUtil.formatDateReadable(date) : '');
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

            // Get booking revenue for this date
            const bookingRevenue = Bookings.getDateRevenue(date);
            const totalProfit = profit + bookingRevenue.profit;
            const totalRevenue = total + bookingRevenue.totalRevenue;
            const hasBookingActivity = bookingRevenue.advancesIn > 0 || bookingRevenue.pickupPayments > 0 || bookingRevenue.refunds > 0;

            // Stats grid
            const profitColor = totalProfit >= 0 ? 'var(--success)' : 'var(--danger)';
            let statsHtml = '<div class="stats-grid" style="grid-template-columns: repeat(2, 1fr);">';
            statsHtml += `<div class="stat-card"><div class="stat-label">Total Revenue</div><div class="stat-value">${Format.currency(totalRevenue)}</div></div>`;
            statsHtml += `<div class="stat-card"><div class="stat-label">Items Sold</div><div class="stat-value">${items}</div></div>`;
            if (State.isAdmin()) {
                statsHtml += `<div class="stat-card"><div class="stat-label">Total Profit</div><div class="stat-value" style="color: ${profitColor}">${Format.currency(totalProfit)}</div></div>`;
            }
            statsHtml += `<div class="stat-card"><div class="stat-label">Transactions</div><div class="stat-value">${daySales.length}</div></div>`;
            statsHtml += '</div>';

            // Revenue breakdown card
            statsHtml += '<div class="card"><div class="card-title">Revenue Breakdown</div>';
            statsHtml += `<div class="list-item" style="border-bottom: 1px solid var(--border);">
                <span>Direct Sales</span>
                <strong>${Format.currency(total)}</strong>
            </div>`;

            if (hasBookingActivity) {
                if (bookingRevenue.advancesIn > 0) {
                    statsHtml += `<div class="list-item" style="border-bottom: 1px solid var(--border);">
                        <span>Booking Advances</span>
                        <strong style="color: var(--primary);">${Format.currency(bookingRevenue.advancesIn)}</strong>
                    </div>`;
                }
                if (bookingRevenue.pickupPayments > 0) {
                    statsHtml += `<div class="list-item" style="border-bottom: 1px solid var(--border);">
                        <span>Pickup Payments</span>
                        <strong style="color: var(--success);">${Format.currency(bookingRevenue.pickupPayments)}</strong>
                    </div>`;
                }
                if (bookingRevenue.refunds > 0) {
                    statsHtml += `<div class="list-item" style="border-bottom: 1px solid var(--border);">
                        <span>Refunds</span>
                        <strong style="color: var(--danger);">-${Format.currency(bookingRevenue.refunds)}</strong>
                    </div>`;
                }
            }
            statsHtml += '</div>';

            // Get booking transactions for this date
            const bookingTransactions = Bookings.getDateTransactions(date);

            // Combine all transactions and sort by time
            const allTransactions = [];

            // Add sales
            daySales.forEach(s => {
                allTransactions.push({
                    type: 'sale',
                    time: s.time || '',
                    data: s
                });
            });

            // Add booking transactions
            bookingTransactions.forEach(t => {
                allTransactions.push({
                    type: 'booking',
                    time: t.time || '',
                    data: t
                });
            });

            // Sort by time (descending - most recent first)
            allTransactions.sort((a, b) => (b.time || '').localeCompare(a.time || ''));

            // Transactions list
            statsHtml += '<div class="card"><div class="card-title">Transactions (tap to view details)</div>';

            if (allTransactions.length === 0) {
                statsHtml += '<p style="color: var(--gray);">No transactions on this date</p>';
            } else {
                allTransactions.forEach(txn => {
                    if (txn.type === 'sale') {
                        const s = txn.data;
                        const saleItems = s.items || [];
                        statsHtml += `<div class="list-item transaction-row" data-sale-id="${s.id}" style="cursor: pointer;">
                            <div class="list-item-info">
                                <h4>${s.customer?.name || 'Walk-in'}</h4>
                                <p>${s.time ? DateUtil.formatTime(s.time) : ''} | ${saleItems.length} items | ${s.paymentMethod || 'Cash'}</p>
                            </div>
                            <div style="text-align: right;">
                                <strong>${Format.currency(s.total || 0)}</strong>
                                <p style="font-size: 11px; color: var(--primary);">View</p>
                            </div>
                        </div>`;
                    } else {
                        const t = txn.data;
                        let label, badgeColor, amountColor;
                        if (t.type === 'booking_advance') {
                            label = t.isFirstAdvance ? 'Booking Advance' : 'Additional Advance';
                            badgeColor = 'var(--primary)';
                            amountColor = 'var(--primary)';
                        } else if (t.type === 'booking_pickup') {
                            label = 'Pickup Payment';
                            badgeColor = 'var(--success)';
                            amountColor = 'var(--success)';
                        } else if (t.type === 'booking_refund') {
                            label = 'Refund';
                            badgeColor = 'var(--danger)';
                            amountColor = 'var(--danger)';
                        }

                        const paymentIndex = t.paymentIndex || 0;
                        statsHtml += `<div class="list-item booking-transaction-row"
                            data-booking-id="${t.bookingId}"
                            data-payment-type="${t.type.replace('booking_', '')}"
                            data-payment-index="${paymentIndex}"
                            style="cursor: pointer;">
                            <div class="list-item-info">
                                <h4>${t.customer?.name || 'Customer'}</h4>
                                <p>${t.time ? DateUtil.formatTime(t.time) : ''} | ${t.itemCount} items | ${t.method || ''}</p>
                                <span class="badge" style="background: ${badgeColor}; color: white; font-size: 10px; padding: 2px 6px;">${label}</span>
                            </div>
                            <div style="text-align: right;">
                                <strong style="color: ${amountColor};">${t.type === 'booking_refund' ? '-' : ''}${Format.currency(t.amount || 0)}</strong>
                                <p style="font-size: 11px; color: var(--primary);">View</p>
                            </div>
                        </div>`;
                    }
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

            // Get booking revenue for this month
            const bookingRevenue = this.getMonthlyBookingRevenue(month);
            const totalProfit = profit + bookingRevenue.profit;
            const totalRevenue = total + bookingRevenue.totalRevenue;

            const profitColor = totalProfit >= 0 ? 'var(--success)' : 'var(--danger)';
            let html = '<div class="stats-grid" style="grid-template-columns: repeat(2, 1fr);">';
            html += `<div class="stat-card primary"><div class="stat-label">Total Revenue</div><div class="stat-value">${Format.currency(totalRevenue)}</div></div>`;
            html += `<div class="stat-card success"><div class="stat-label">Items Sold</div><div class="stat-value">${items}</div></div>`;
            if (State.isAdmin()) {
                html += `<div class="stat-card"><div class="stat-label">Total Profit</div><div class="stat-value" style="color: ${profitColor}">${Format.currency(totalProfit)}</div></div>`;
            }
            html += `<div class="stat-card"><div class="stat-label">Transactions</div><div class="stat-value">${monthSales.length}</div></div>`;
            html += '</div>';

            // Revenue breakdown card
            const hasBookingActivity = bookingRevenue.advancesIn > 0 || bookingRevenue.pickupPayments > 0 || bookingRevenue.refunds > 0;
            html += '<div class="card"><div class="card-title">Revenue Breakdown</div>';
            html += `<div class="list-item" style="border-bottom: 1px solid var(--border);">
                <span>Direct Sales</span>
                <strong>${Format.currency(total)}</strong>
            </div>`;

            if (hasBookingActivity) {
                if (bookingRevenue.advancesIn > 0) {
                    html += `<div class="list-item" style="border-bottom: 1px solid var(--border);">
                        <span>Booking Advances</span>
                        <strong style="color: var(--primary);">${Format.currency(bookingRevenue.advancesIn)}</strong>
                    </div>`;
                }
                if (bookingRevenue.pickupPayments > 0) {
                    html += `<div class="list-item" style="border-bottom: 1px solid var(--border);">
                        <span>Pickup Payments</span>
                        <strong style="color: var(--success);">${Format.currency(bookingRevenue.pickupPayments)}</strong>
                    </div>`;
                }
                if (bookingRevenue.refunds > 0) {
                    html += `<div class="list-item" style="border-bottom: 1px solid var(--border);">
                        <span>Refunds</span>
                        <strong style="color: var(--danger);">-${Format.currency(bookingRevenue.refunds)}</strong>
                    </div>`;
                }
            }
            html += '</div>';

            DOM.setHtml(container, html);
        } catch (err) {
            console.error('Error loading monthly report:', err);
            DOM.setHtml(container, '<div class="card"><p style="color: var(--danger);">Error loading report</p></div>');
        }
    },

    // Helper to get booking revenue for a month
    getMonthlyBookingRevenue(month) {
        let advancesIn = 0;
        let pickupPayments = 0;
        let refunds = 0;
        let profit = 0;

        State.bookings.forEach(b => {
            // Advances received in this month
            b.advancePayments.forEach(p => {
                if (p.date && p.date.startsWith(month)) {
                    advancesIn += p.amount;
                }
            });

            // Booking created in this month = profit recorded
            if (b.createdDate && b.createdDate.startsWith(month) && b.status !== 'cancelled') {
                profit += b.profit;
            }

            // Final payment in this month
            if (b.finalPayment && b.finalPayment.date && b.finalPayment.date.startsWith(month)) {
                pickupPayments += b.finalPayment.amount;
            }

            // Refund in this month
            if (b.refunded && b.refundDate && b.refundDate.startsWith(month)) {
                refunds += b.refundAmount || 0;
            }

            // Cancelled booking = negative profit in cancel month
            if (b.status === 'cancelled' && b.cancelledDate && b.cancelledDate.startsWith(month)) {
                profit -= b.profit;
            }
        });

        return {
            advancesIn,
            pickupPayments,
            refunds,
            profit,
            totalRevenue: advancesIn + pickupPayments - refunds
        };
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

            // Handle profit display visibility
            if (State.isAdmin()) {
                // Get current toggle state
                const toggle = DOM.get('profitToggle');
                const showPercent = toggle && toggle.checked;

                // Apply correct visibility based on toggle state
                DOM.findAll('#bestSellers .profit-amount').forEach(el => {
                    el.style.display = showPercent ? 'none' : 'block';
                });
                DOM.findAll('#bestSellers .profit-percent').forEach(el => {
                    el.style.display = showPercent ? 'block' : 'none';
                });

                // Apply profit color based on value (red for negative, green for positive)
                const rows = DOM.findAll('#bestSellers .list-item');
                sorted.forEach(([name, data], i) => {
                    if (rows[i]) {
                        const profitColor = data.profit >= 0 ? 'var(--success)' : 'var(--danger)';
                        const profitSpans = rows[i].querySelectorAll('.profit-display span[data-field]');
                        profitSpans.forEach(span => span.style.color = profitColor);
                    }
                });
            } else {
                // Hide all profit displays for non-admin
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

                const isAdjustment = log.type === 'adjustment';
                const totalItems = isAdjustment
                    ? items.length
                    : items.reduce((sum, item) => sum + (item?.qty || 0), 0);
                const totalCost = items.reduce((sum, item) => sum + ((item?.costPrice || 0) * (item?.qty || 0)), 0);
                const badgeColor = isAdjustment ? '#f59e0b' : '#10b981';

                html += `
                    <div class="card stock-log-card" data-log-id="${log.id}" style="cursor: pointer; margin-bottom: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div>
                                <h4 style="margin: 0; font-size: 16px;">${vendor}</h4>
                                <p style="color: var(--gray); font-size: 13px; margin: 4px 0;">
                                    ${Format.date(logDate)} ${logTime ? 'at ' + logTime : ''}
                                </p>
                                ${log.invoice ? `<p style="font-size: 12px; color: var(--primary);">Invoice: ${log.invoice}</p>` : ''}
                                ${log.reason ? `<p style="font-size: 12px; color: var(--warning);">Reason: ${log.reason}</p>` : ''}
                            </div>
                            <div style="text-align: right;">
                                <div style="font-weight: 600; color: ${badgeColor};">${totalItems} ${isAdjustment ? 'adjusted' : 'items'}</div>
                                ${!isAdjustment ? `<div style="font-size: 13px; color: var(--gray);">${Format.currency(totalCost)}</div>` : ''}
                                ${log.photo ? '<div style="font-size: 11px; color: var(--primary); margin-top: 4px;">Has Photo</div>' : ''}
                            </div>
                        </div>
                        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border);">
                            <div style="font-size: 12px; color: var(--gray);">${isAdjustment ? 'Adjustments:' : 'Items:'}</div>
                            ${items.slice(0, 3).map(item => {
                                if (isAdjustment) {
                                    const changeColor = item.qtyChange > 0 ? 'var(--success)' : 'var(--danger)';
                                    const changeSign = item.qtyChange > 0 ? '+' : '';
                                    return `
                                        <div style="font-size: 13px; margin-top: 4px;">
                                            ${item?.category || 'Unknown'} - ${item?.variant || 'Unknown'}:
                                            <span style="color: var(--gray);">${item.oldQty}</span> →
                                            <span style="font-weight: 600;">${item.newQty}</span>
                                            <span style="color: ${changeColor}; margin-left: 4px;">(${changeSign}${item.qtyChange})</span>
                                        </div>
                                    `;
                                } else {
                                    return `
                                        <div style="font-size: 13px; margin-top: 4px;">
                                            ${item?.category || 'Unknown'} - ${item?.variant || 'Unknown'}: +${item?.qty || 0} @ ${Format.currency(item?.costPrice || 0)}
                                        </div>
                                    `;
                                }
                            }).join('')}
                            ${items.length > 3 ? `<div style="font-size: 12px; color: var(--primary); margin-top: 4px;">+${items.length - 3} more items...</div>` : ''}
                        </div>
                        <div style="font-size: 11px; color: var(--gray); margin-top: 8px;">
                            ${isAdjustment ? 'Adjusted by:' : 'Added by:'} ${addedBy}
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
            const isAdjustment = log.type === 'adjustment';

            const totalItems = isAdjustment
                ? items.length
                : items.reduce((sum, item) => sum + (item?.qty || 0), 0);
            const totalCost = items.reduce((sum, item) => sum + ((item?.costPrice || 0) * (item?.qty || 0)), 0);

            let itemsHtml = items.map(item => {
                const category = item?.category || 'Unknown';
                const variant = item?.variant || 'Unknown';

                if (isAdjustment) {
                    const changeColor = item.qtyChange > 0 ? 'var(--success)' : 'var(--danger)';
                    const changeSign = item.qtyChange > 0 ? '+' : '';
                    return `
                        <div class="list-item" style="border-bottom: 1px solid var(--border);">
                            <div class="list-item-info">
                                <h4>${category} - ${variant}</h4>
                                <p>
                                    <span style="color: var(--gray);">Old: ${item.oldQty}</span>
                                    <span style="margin: 0 8px;">→</span>
                                    <span style="font-weight: 600;">New: ${item.newQty}</span>
                                </p>
                            </div>
                            <div style="font-weight: 600; color: ${changeColor}; font-size: 18px;">
                                ${changeSign}${item.qtyChange}
                            </div>
                        </div>
                    `;
                } else {
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
                }
            }).join('');

            // Build gradient to avoid CSS validation errors with template literals
            const gradient = isAdjustment
                ? 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

            const modalContent = `
                <div class="modal-header">
                    <h3 class="modal-title">${isAdjustment ? 'Stock Adjustment Details' : 'Stock Entry Details'}</h3>
                    <button class="modal-close" onclick="closeStockLogModal()">&times;</button>
                </div>
                <div style="padding: 16px;">
                    <div class="card" style="background: ${gradient}; color: white; margin-bottom: 16px;">
                        <h4 style="margin: 0;">${vendor}</h4>
                        <p style="opacity: 0.9; margin: 4px 0;">${Format.date(logDate)} ${logTime ? 'at ' + logTime : ''}</p>
                        ${log.invoice ? `<p style="opacity: 0.8; font-size: 13px;">Invoice: ${log.invoice}</p>` : ''}
                        ${log.reason ? `<p style="opacity: 0.9; font-size: 13px; margin-top: 8px; background: rgba(255,255,255,0.2); padding: 8px; border-radius: 6px;">Reason: ${log.reason}</p>` : ''}
                    </div>

                    ${!isAdjustment ? `
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
                    ` : ''}

                    ${log.photo ? `
                        <button class="btn btn-outline btn-block" onclick="viewStockLogPhoto('${logId}')" style="margin-bottom: 16px;">
                            View Invoice Photo
                        </button>
                    ` : ''}

                    <div class="card">
                        <div class="card-title">${isAdjustment ? 'Items Adjusted' : 'Items Added'} (${items.length})</div>
                        ${itemsHtml || '<p style="color: var(--gray);">No items recorded</p>'}
                    </div>

                    <p style="text-align: center; color: var(--gray); font-size: 12px; margin-top: 16px;">
                        ${isAdjustment ? 'Adjusted by:' : 'Added by:'} ${addedBy}
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
