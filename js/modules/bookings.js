// Bookings Module - Advance Payment & Pickup Tracking

import { DOM, Format, Template, Toast, Loader } from '../utils/index.js';
import { Modal } from '../components/index.js';
import { State, Storage } from '../state/index.js';

// External dependencies
let onBookingCreated = null;
let onBookingCompleted = null;

export const Bookings = {
    init(callbacks = {}) {
        onBookingCreated = callbacks.onBookingCreated || null;
        onBookingCompleted = callbacks.onBookingCompleted || null;

        // Setup delegated click handlers for bookings list
        DOM.on(DOM.get('bookingsList'), 'click', '[data-booking-id]', (e, el) => {
            const bookingId = el.dataset.bookingId;
            if (bookingId) this.showDetails(bookingId);
        });
    },

    // Get today's date in YYYY-MM-DD format
    getToday() {
        return new Date().toISOString().split('T')[0];
    },

    // Filter bookings by status and date
    getFilteredBookings(tab = 'today') {
        const today = this.getToday();
        const pending = State.bookings.filter(b => b.status === 'pending');

        switch (tab) {
            case 'today':
                return pending.filter(b => b.pickupDate === today);
            case 'upcoming':
                return pending.filter(b => b.pickupDate > today)
                    .sort((a, b) => a.pickupDate.localeCompare(b.pickupDate));
            case 'overdue':
                return pending.filter(b => b.pickupDate < today)
                    .sort((a, b) => b.pickupDate.localeCompare(a.pickupDate));
            case 'all':
                return State.bookings.sort((a, b) =>
                    b.createdDate.localeCompare(a.createdDate));
            default:
                return pending;
        }
    },

    // Count today's pickups
    getTodayPickupsCount() {
        const today = this.getToday();
        return State.bookings.filter(b =>
            b.status === 'pending' && b.pickupDate === today
        ).length;
    },

    // Count overdue pickups
    getOverdueCount() {
        const today = this.getToday();
        return State.bookings.filter(b =>
            b.status === 'pending' && b.pickupDate < today
        ).length;
    },

    // Show bookings tab
    showTab(tab) {
        State.bookingTab = tab;

        // Update tab buttons
        document.querySelectorAll('.booking-tab').forEach(t => {
            DOM.toggleClass(t, 'active', t.dataset.tab === tab);
        });

        this.renderList();
    },

    // Render bookings list
    renderList() {
        const container = DOM.get('bookingsList');
        if (!container) return;

        const bookings = this.getFilteredBookings(State.bookingTab);
        const today = this.getToday();

        if (bookings.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No bookings found</p>
                </div>
            `;
            return;
        }

        container.innerHTML = bookings.map(b => {
            const isOverdue = b.status === 'pending' && b.pickupDate < today;
            const isToday = b.pickupDate === today;
            const statusClass = b.status === 'completed' ? 'success' :
                               b.status === 'cancelled' ? 'danger' :
                               isOverdue ? 'warning' : 'primary';
            const statusText = b.status === 'completed' ? 'Completed' :
                              b.status === 'cancelled' ? 'Cancelled' :
                              isOverdue ? 'Overdue' :
                              isToday ? 'Today' : 'Upcoming';

            return `
                <div class="list-item booking-item" data-booking-id="${b.id}">
                    <div class="booking-info">
                        <div class="booking-customer">${b.customer?.name || 'Unknown'}</div>
                        <div class="booking-meta">
                            <span>${Format.currency(b.total)}</span>
                            <span class="separator">•</span>
                            <span>Paid: ${Format.currency(b.totalAdvance)}</span>
                            <span class="separator">•</span>
                            <span>Due: ${Format.currency(b.balanceRemaining)}</span>
                        </div>
                        <div class="booking-date">
                            Pickup: ${Format.date(b.pickupDate)}
                        </div>
                    </div>
                    <div class="booking-status">
                        <span class="badge badge-${statusClass}">${statusText}</span>
                    </div>
                </div>
            `;
        }).join('');
    },

    // Create a new booking from cart
    createFromCart(customerName, customerPhone, pickupDate, advanceAmount, paymentMethod) {
        if (State.cart.length === 0) {
            Toast.show('Cart is empty');
            return false;
        }

        if (!customerName || !customerPhone) {
            Toast.show('Customer details required for booking');
            return false;
        }

        if (!pickupDate) {
            Toast.show('Please select pickup date');
            return false;
        }

        if (!advanceAmount || advanceAmount <= 0) {
            Toast.show('Please enter advance amount');
            return false;
        }

        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const time = now.toLocaleTimeString();

        // Calculate totals
        let total = 0;
        let profit = 0;
        const items = State.cart.map(item => {
            const key = `${item.category}|${item.variant}`;
            const inv = State.inventory[key] || {};
            const costPrice = inv.costPrice || 0;
            const itemTotal = item.price * item.qty;
            const itemProfit = (item.price - costPrice) * item.qty;

            total += itemTotal;
            profit += itemProfit;

            return {
                category: item.category,
                variant: item.variant,
                key: key,
                qty: item.qty,
                price: item.price,
                costPrice: costPrice
            };
        });

        if (advanceAmount > total) {
            Toast.show('Advance cannot exceed total amount');
            return false;
        }

        // Create booking object
        const booking = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            createdDate: today,
            createdTime: time,
            customer: {
                name: customerName,
                phone: customerPhone
            },
            items: items,
            total: total,
            profit: profit,
            advancePayments: [{
                amount: advanceAmount,
                date: today,
                time: time,
                method: paymentMethod
            }],
            totalAdvance: advanceAmount,
            balanceRemaining: total - advanceAmount,
            pickupDate: pickupDate,
            status: 'pending',
            completedDate: null,
            completedTime: null,
            finalPayment: null
        };

        // Reduce inventory
        items.forEach(item => {
            if (State.inventory[item.key]) {
                State.inventory[item.key].qty = Math.max(0,
                    (State.inventory[item.key].qty || 0) - item.qty
                );
                Storage.saveInventoryItem(item.key, State.inventory[item.key]);
            }
        });

        // Save customer
        const existingCustomer = State.customers.find(c => c.phone === customerPhone);
        if (!existingCustomer) {
            const newCustomer = {
                id: customerPhone,
                name: customerName,
                phone: customerPhone,
                email: ''
            };
            State.customers.push(newCustomer);
            Storage.saveCustomer(newCustomer);
        }

        // Add booking to state
        State.bookings.unshift(booking);
        Storage.saveBooking(booking);

        // Clear cart
        State.cart = [];

        Toast.show('Booking created successfully!');

        if (onBookingCreated) onBookingCreated(booking);

        // Show receipt for the first advance payment
        setTimeout(() => {
            this.showPaymentReceipt(booking.id, 'advance', 0);
        }, 300);

        return booking;
    },

    // Show booking details modal
    showDetails(bookingId) {
        const booking = State.bookings.find(b => b.id === bookingId);
        if (!booking) {
            Toast.show('Booking not found');
            return;
        }

        State.selectedBookingId = bookingId;
        const today = this.getToday();
        const isOverdue = booking.status === 'pending' && booking.pickupDate < today;
        const isPending = booking.status === 'pending';

        const modal = DOM.get('bookingDetailsModal');
        if (!modal) return;

        // Populate modal content
        DOM.setText(DOM.get('bdCustomerName'), booking.customer?.name || 'Unknown');
        DOM.setText(DOM.get('bdCustomerPhone'), booking.customer?.phone || '-');
        DOM.setText(DOM.get('bdPickupDate'), Format.date(booking.pickupDate));
        DOM.setText(DOM.get('bdCreatedDate'), `${Format.date(booking.createdDate)} ${booking.createdTime}`);

        // Status badge
        const statusEl = DOM.get('bdStatus');
        if (statusEl) {
            const statusClass = booking.status === 'completed' ? 'success' :
                               booking.status === 'cancelled' ? 'danger' :
                               isOverdue ? 'warning' : 'primary';
            const statusText = booking.status === 'completed' ? 'Completed' :
                              booking.status === 'cancelled' ? 'Cancelled' :
                              isOverdue ? 'Overdue' : 'Pending';
            statusEl.className = `badge badge-${statusClass}`;
            statusEl.textContent = statusText;
        }

        // Items list
        const itemsEl = DOM.get('bdItems');
        if (itemsEl) {
            itemsEl.innerHTML = booking.items.map(item => `
                <div class="bd-item">
                    <span>${item.category} - ${item.variant} (x${item.qty})</span>
                    <span>${Format.currency(item.price * item.qty)}</span>
                </div>
            `).join('');
        }

        // Totals
        DOM.setText(DOM.get('bdTotal'), Format.currency(booking.total));
        DOM.setText(DOM.get('bdProfit'), Format.currency(booking.profit));
        DOM.setText(DOM.get('bdTotalAdvance'), Format.currency(booking.totalAdvance));
        DOM.setText(DOM.get('bdBalance'), Format.currency(booking.balanceRemaining));

        // Payment history
        const paymentsEl = DOM.get('bdPayments');
        if (paymentsEl) {
            let paymentsHtml = booking.advancePayments.map(p => `
                <div class="bd-payment">
                    <span>${Format.date(p.date)} - ${p.method}</span>
                    <span>${Format.currency(p.amount)}</span>
                </div>
            `).join('');

            if (booking.finalPayment) {
                paymentsHtml += `
                    <div class="bd-payment final">
                        <span>${Format.date(booking.finalPayment.date)} - ${booking.finalPayment.method} (Final)</span>
                        <span>${Format.currency(booking.finalPayment.amount)}</span>
                    </div>
                `;
            }

            paymentsEl.innerHTML = paymentsHtml;
        }

        // Show/hide action buttons based on status
        const actionsEl = DOM.get('bdActions');
        if (actionsEl) {
            actionsEl.style.display = isPending ? 'flex' : 'none';
        }

        // Show/hide back button based on navigation source
        const backBtn = DOM.get('bookingBackBtn');
        if (backBtn) {
            DOM.toggle(backBtn, State.cameFromHistory);
        }

        Modal.show('bookingDetailsModal');
    },

    closeDetails() {
        State.selectedBookingId = null;
        State.cameFromHistory = false;
        Modal.hide('bookingDetailsModal');
    },

    backToHistory() {
        Modal.hide('bookingDetailsModal');
        State.selectedBookingId = null;
        if (window.backToCustomerHistory) {
            window.backToCustomerHistory();
        }
    },

    // Show add advance modal
    showAddAdvanceModal() {
        if (!State.selectedBookingId) return;

        const booking = State.bookings.find(b => b.id === State.selectedBookingId);
        if (!booking || booking.status !== 'pending') return;

        DOM.get('addAdvanceAmount').value = '';
        DOM.setText(DOM.get('addAdvanceBalance'), Format.currency(booking.balanceRemaining));

        Modal.show('addAdvanceModal');
    },

    closeAddAdvanceModal() {
        Modal.hide('addAdvanceModal');
    },

    // Add advance payment
    addAdvance() {
        const booking = State.bookings.find(b => b.id === State.selectedBookingId);
        if (!booking || booking.status !== 'pending') return;

        const amountInput = DOM.get('addAdvanceAmount');
        const amount = parseFloat(amountInput.value) || 0;
        const method = document.querySelector('input[name="addAdvanceMethod"]:checked')?.value || 'Cash';

        if (amount <= 0) {
            Toast.show('Please enter valid amount');
            return;
        }

        if (amount > booking.balanceRemaining) {
            Toast.show('Amount exceeds balance');
            return;
        }

        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const time = now.toLocaleTimeString();

        // Add payment
        booking.advancePayments.push({
            amount: amount,
            date: today,
            time: time,
            method: method
        });
        booking.totalAdvance += amount;
        booking.balanceRemaining -= amount;

        Storage.saveBooking(booking);

        this.closeAddAdvanceModal();
        this.closeDetails();
        this.renderList();

        Toast.show(`Advance of ${Format.currency(amount)} added`);

        // Show receipt for this advance payment
        const paymentIndex = booking.advancePayments.length - 1;
        setTimeout(() => {
            this.showPaymentReceipt(booking.id, 'advance', paymentIndex);
        }, 300);
    },

    // Show change date modal
    showChangeDateModal() {
        if (!State.selectedBookingId) return;

        const booking = State.bookings.find(b => b.id === State.selectedBookingId);
        if (!booking || booking.status !== 'pending') return;

        DOM.get('changeDateInput').value = booking.pickupDate;
        Modal.show('changeDateModal');
    },

    closeChangeDateModal() {
        Modal.hide('changeDateModal');
    },

    // Change pickup date
    changePickupDate() {
        const booking = State.bookings.find(b => b.id === State.selectedBookingId);
        if (!booking || booking.status !== 'pending') return;

        const newDate = DOM.get('changeDateInput').value;
        if (!newDate) {
            Toast.show('Please select a date');
            return;
        }

        booking.pickupDate = newDate;
        Storage.saveBooking(booking);

        this.closeChangeDateModal();
        this.showDetails(booking.id);
        this.renderList();

        Toast.show('Pickup date updated');
    },

    // Show complete booking modal
    showCompleteModal() {
        if (!State.selectedBookingId) return;

        const booking = State.bookings.find(b => b.id === State.selectedBookingId);
        if (!booking || booking.status !== 'pending') return;

        DOM.setText(DOM.get('completeBalance'), Format.currency(booking.balanceRemaining));
        DOM.get('completeAmount').value = booking.balanceRemaining;

        Modal.show('completeBookingModal');
    },

    closeCompleteModal() {
        Modal.hide('completeBookingModal');
    },

    // Complete booking (final pickup)
    completeBooking() {
        const booking = State.bookings.find(b => b.id === State.selectedBookingId);
        if (!booking || booking.status !== 'pending') return;

        const amountInput = DOM.get('completeAmount');
        const amount = parseFloat(amountInput.value) || 0;
        const method = document.querySelector('input[name="completeMethod"]:checked')?.value || 'Cash';

        // Amount should match balance (but allow flexibility)
        if (amount < booking.balanceRemaining) {
            Toast.show('Amount is less than balance. Add as advance instead.');
            return;
        }

        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const time = now.toLocaleTimeString();

        // Record final payment
        booking.finalPayment = {
            amount: amount,
            date: today,
            time: time,
            method: method
        };
        booking.totalAdvance += amount;
        booking.balanceRemaining = 0;
        booking.status = 'completed';
        booking.completedDate = today;
        booking.completedTime = time;

        Storage.saveBooking(booking);

        this.closeCompleteModal();
        this.closeDetails();
        this.renderList();

        Toast.show('Booking completed successfully!');

        if (onBookingCompleted) onBookingCompleted(booking);

        // Show pickup receipt
        setTimeout(() => {
            this.showPaymentReceipt(booking.id, 'pickup', 0);
        }, 300);
    },

    // Show cancel booking confirmation
    showCancelModal() {
        if (!State.selectedBookingId) return;

        const booking = State.bookings.find(b => b.id === State.selectedBookingId);
        if (!booking || booking.status !== 'pending') return;

        DOM.setText(DOM.get('cancelRefundAmount'), Format.currency(booking.totalAdvance));
        Modal.show('cancelBookingModal');
    },

    closeCancelModal() {
        Modal.hide('cancelBookingModal');
    },

    // Cancel booking and refund
    cancelBooking(refund = true) {
        const booking = State.bookings.find(b => b.id === State.selectedBookingId);
        if (!booking || booking.status !== 'pending') return;

        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const time = now.toLocaleTimeString();

        // Restore inventory
        booking.items.forEach(item => {
            if (State.inventory[item.key]) {
                State.inventory[item.key].qty =
                    (State.inventory[item.key].qty || 0) + item.qty;
                Storage.saveInventoryItem(item.key, State.inventory[item.key]);
            }
        });

        // Mark as cancelled
        booking.status = 'cancelled';
        booking.cancelledDate = today;
        booking.cancelledTime = time;
        booking.refunded = refund;

        if (refund && booking.totalAdvance > 0) {
            // Record refund as negative payment for reporting
            booking.refundAmount = booking.totalAdvance;
            booking.refundDate = today;
        }

        Storage.saveBooking(booking);

        this.closeCancelModal();
        this.closeDetails();
        this.renderList();

        Toast.show(refund ? 'Booking cancelled and refunded' : 'Booking cancelled');
    },

    // Get bookings revenue for a specific date (for reports)
    getDateRevenue(date) {
        let advancesIn = 0;
        let pickupPayments = 0;
        let refunds = 0;
        let profit = 0;

        State.bookings.forEach(b => {
            // Advances received on this date
            b.advancePayments.forEach(p => {
                if (p.date === date) {
                    advancesIn += p.amount;
                }
            });

            // Booking created on this date = profit recorded
            if (b.createdDate === date && b.status !== 'cancelled') {
                profit += b.profit;
            }

            // Final payment on this date
            if (b.finalPayment && b.finalPayment.date === date) {
                pickupPayments += b.finalPayment.amount;
            }

            // Refund on this date
            if (b.refunded && b.refundDate === date) {
                refunds += b.refundAmount || 0;
            }

            // Cancelled booking = negative profit on cancel date
            if (b.status === 'cancelled' && b.cancelledDate === date) {
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

    // Get all booking payment transactions for a date (for reports transaction list)
    getDateTransactions(date) {
        const transactions = [];

        State.bookings.forEach(b => {
            // Advance payments on this date
            b.advancePayments.forEach((p, index) => {
                if (p.date === date) {
                    transactions.push({
                        type: 'booking_advance',
                        bookingId: b.id,
                        paymentIndex: index,
                        customer: b.customer,
                        amount: p.amount,
                        method: p.method,
                        time: p.time,
                        date: p.date,
                        isFirstAdvance: index === 0,
                        bookingTotal: b.total,
                        balanceAfter: b.total - b.advancePayments.slice(0, index + 1).reduce((sum, ap) => sum + ap.amount, 0),
                        itemCount: b.items.length
                    });
                }
            });

            // Final/pickup payment on this date
            if (b.finalPayment && b.finalPayment.date === date) {
                transactions.push({
                    type: 'booking_pickup',
                    bookingId: b.id,
                    customer: b.customer,
                    amount: b.finalPayment.amount,
                    method: b.finalPayment.method,
                    time: b.finalPayment.time,
                    date: b.finalPayment.date,
                    bookingTotal: b.total,
                    totalPaid: b.totalAdvance,
                    itemCount: b.items.length
                });
            }

            // Refund on this date
            if (b.refunded && b.refundDate === date) {
                transactions.push({
                    type: 'booking_refund',
                    bookingId: b.id,
                    customer: b.customer,
                    amount: b.refundAmount,
                    time: b.cancelledTime,
                    date: b.refundDate,
                    bookingTotal: b.total,
                    itemCount: b.items.length
                });
            }
        });

        // Sort by time
        transactions.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
        return transactions;
    },

    // Show payment receipt modal
    showPaymentReceipt(bookingId, paymentType = 'advance', paymentIndex = 0) {
        const booking = State.bookings.find(b => b.id === bookingId);
        if (!booking) {
            Toast.show('Booking not found');
            return;
        }

        State.selectedBookingId = bookingId;
        State.selectedPaymentType = paymentType;
        State.selectedPaymentIndex = paymentIndex;

        const modal = DOM.get('bookingReceiptModal');
        if (!modal) return;

        let payment, title, paidSoFar, balanceRemaining;

        if (paymentType === 'pickup') {
            payment = booking.finalPayment;
            title = 'Pickup Receipt';
            paidSoFar = booking.totalAdvance;
            balanceRemaining = 0;
        } else if (paymentType === 'refund') {
            payment = { amount: booking.refundAmount, date: booking.refundDate, time: booking.cancelledTime, method: 'Refund' };
            title = 'Refund Receipt';
            paidSoFar = 0;
            balanceRemaining = 0;
        } else {
            // Advance payment
            payment = booking.advancePayments[paymentIndex];
            title = paymentIndex === 0 ? 'Booking Receipt' : 'Advance Payment Receipt';
            paidSoFar = booking.advancePayments.slice(0, paymentIndex + 1).reduce((sum, p) => sum + p.amount, 0);
            balanceRemaining = booking.total - paidSoFar;
        }

        if (!payment) return;

        // Populate modal
        DOM.setText(DOM.get('brTitle'), title);
        DOM.setText(DOM.get('brCustomerName'), booking.customer?.name || 'Customer');
        DOM.setText(DOM.get('brCustomerPhone'), booking.customer?.phone || '-');
        DOM.setText(DOM.get('brDate'), `${Format.date(payment.date)} ${payment.time || ''}`);
        DOM.setText(DOM.get('brPickupDate'), Format.date(booking.pickupDate));

        // Items
        const itemsEl = DOM.get('brItems');
        if (itemsEl) {
            itemsEl.innerHTML = booking.items.map(item => `
                <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border);">
                    <span>${item.category} - ${item.variant} (x${item.qty})</span>
                    <span>${Format.currency(item.price * item.qty)}</span>
                </div>
            `).join('');
        }

        // Totals
        DOM.setText(DOM.get('brTotal'), Format.currency(booking.total));
        DOM.setText(DOM.get('brThisPayment'), Format.currency(payment.amount));
        DOM.setText(DOM.get('brPaymentMethod'), payment.method || 'Cash');

        // Payment history
        const historyEl = DOM.get('brPaymentHistory');
        if (historyEl) {
            let historyHtml = '';
            booking.advancePayments.forEach((p, i) => {
                const isCurrent = paymentType === 'advance' && i === paymentIndex;
                historyHtml += `
                    <div style="display: flex; justify-content: space-between; padding: 4px 0; ${isCurrent ? 'font-weight: 600; color: var(--primary);' : ''}">
                        <span>${Format.date(p.date)} - ${p.method}${isCurrent ? ' (This payment)' : ''}</span>
                        <span>${Format.currency(p.amount)}</span>
                    </div>
                `;
            });
            if (booking.finalPayment) {
                const isCurrent = paymentType === 'pickup';
                historyHtml += `
                    <div style="display: flex; justify-content: space-between; padding: 4px 0; color: var(--success); ${isCurrent ? 'font-weight: 600;' : ''}">
                        <span>${Format.date(booking.finalPayment.date)} - ${booking.finalPayment.method} (Pickup)${isCurrent ? ' (This payment)' : ''}</span>
                        <span>${Format.currency(booking.finalPayment.amount)}</span>
                    </div>
                `;
            }
            historyEl.innerHTML = historyHtml || '<p style="color: var(--gray);">No payments yet</p>';
        }

        // Balance
        const balanceEl = DOM.get('brBalance');
        if (balanceEl) {
            if (balanceRemaining > 0) {
                balanceEl.innerHTML = `<span style="color: var(--warning);">Balance Due: ${Format.currency(balanceRemaining)}</span>`;
            } else {
                balanceEl.innerHTML = `<span style="color: var(--success);">Fully Paid ✓</span>`;
            }
        }

        // Show/hide SMS button based on phone
        const smsSection = DOM.get('brSmsSection');
        if (smsSection) {
            DOM.toggle(smsSection, !!booking.customer?.phone);
        }

        Modal.show('bookingReceiptModal');
    },

    closePaymentReceipt() {
        Modal.hide('bookingReceiptModal');
        State.selectedPaymentType = null;
        State.selectedPaymentIndex = null;
    },

    // Generate bill text for SMS
    generateBillText(booking, paymentType = 'advance', paymentIndex = 0) {
        if (!booking) return '';

        let text = `MANIKANTA ENTERPRISES\n`;
        text += `------------------------\n`;
        text += `Customer: ${booking.customer?.name || 'Customer'}\n`;
        text += `Date: ${Format.date(booking.createdDate)}\n`;
        text += `Pickup: ${Format.date(booking.pickupDate)}\n`;
        text += `------------------------\n`;
        text += `ITEMS:\n`;

        booking.items.forEach(item => {
            text += `${item.category} ${item.variant} x${item.qty} = ${Format.currency(item.price * item.qty)}\n`;
        });

        text += `------------------------\n`;
        text += `TOTAL: ${Format.currency(booking.total)}\n`;
        text += `------------------------\n`;
        text += `PAYMENTS:\n`;

        let paidSoFar = 0;
        booking.advancePayments.forEach((p, i) => {
            paidSoFar += p.amount;
            const label = i === 0 ? 'Advance' : `Payment ${i + 1}`;
            text += `${label}: ${Format.currency(p.amount)} (${p.method})\n`;
        });

        if (booking.finalPayment) {
            paidSoFar += booking.finalPayment.amount;
            text += `Pickup: ${Format.currency(booking.finalPayment.amount)} (${booking.finalPayment.method})\n`;
        }

        text += `------------------------\n`;
        text += `PAID: ${Format.currency(paidSoFar)}\n`;

        const balance = booking.total - paidSoFar;
        if (balance > 0) {
            text += `BALANCE DUE: ${Format.currency(balance)}\n`;
        } else {
            text += `STATUS: FULLY PAID ✓\n`;
        }

        text += `------------------------\n`;
        text += `Thank you for your purchase!`;

        return text;
    },

    // Send SMS bill for booking
    sendSMSBill() {
        const booking = State.bookings.find(b => b.id === State.selectedBookingId);
        if (!booking || !booking.customer?.phone) {
            Toast.show('No phone number available');
            return;
        }

        const billText = this.generateBillText(booking, State.selectedPaymentType, State.selectedPaymentIndex);
        const smsUrl = `sms:${booking.customer.phone}?body=${encodeURIComponent(billText)}`;
        window.open(smsUrl);
        Toast.show('Opening SMS app...');
    }
};
