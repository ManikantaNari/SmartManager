// Add Advance Payment Modal Template

export const AddAdvanceModalTemplate = `
<div class="modal-overlay" id="addAdvanceModal" onclick="closeAddAdvanceModal()">
    <div class="modal modal-small" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3 class="modal-title" data-i18n="bookings.addAdvance">Add Advance</h3>
            <button class="modal-close" onclick="closeAddAdvanceModal()">&times;</button>
        </div>

        <div style="padding: 0 24px 24px;">
            <!-- Balance Display -->
            <div class="balance-card">
                <span class="balance-label" data-i18n="bookings.balanceRemaining">Balance Remaining</span>
                <span id="addAdvanceBalance" class="balance-value">-</span>
            </div>

            <div class="form-group">
                <label class="form-label"><span data-i18n="bookings.advanceAmount">Advance Amount</span> <span class="required">*</span></label>
                <input type="number" id="addAdvanceAmount" data-i18n-placeholder="bookings.enterAmount" placeholder="Enter amount" class="form-input">
            </div>

            <div class="form-group">
                <label class="form-label" data-i18n="sale.paymentMethod">Payment Method</label>
                <div class="payment-options">
                    <label class="payment-option">
                        <input type="radio" name="addAdvanceMethod" value="Cash" checked>
                        <span class="payment-btn">
                            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <rect x="2" y="6" width="20" height="12" rx="2"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                            <span data-i18n="sale.cash">Cash</span>
                        </span>
                    </label>
                    <label class="payment-option">
                        <input type="radio" name="addAdvanceMethod" value="UPI">
                        <span class="payment-btn">
                            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                            UPI
                        </span>
                    </label>
                </div>
            </div>

            <div class="cb-actions">
                <button class="btn btn-outline" onclick="closeAddAdvanceModal()" data-i18n="common.cancel">Cancel</button>
                <button class="btn btn-primary" onclick="confirmAddAdvance()" data-i18n="bookings.addAdvance">Add Advance</button>
            </div>
        </div>
    </div>
</div>
`;

// Change Date Modal Template
export const ChangeDateModalTemplate = `
<div class="modal-overlay" id="changeDateModal" onclick="closeChangeDateModal()">
    <div class="modal modal-small" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3 class="modal-title" data-i18n="bookings.changePickupDate">Change Pickup Date</h3>
            <button class="modal-close" onclick="closeChangeDateModal()">&times;</button>
        </div>

        <div style="padding: 0 24px 24px;">
            <div class="form-group">
                <label class="form-label"><span data-i18n="bookings.newPickupDate">New Pickup Date</span> <span class="required">*</span></label>
                <input type="date" id="changeDateInput" class="form-input">
            </div>

            <div class="cb-actions">
                <button class="btn btn-outline" onclick="closeChangeDateModal()" data-i18n="common.cancel">Cancel</button>
                <button class="btn btn-primary" onclick="confirmChangeDate()">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span data-i18n="bookings.updateDate">Update Date</span>
                </button>
            </div>
        </div>
    </div>
</div>
`;

// Complete Booking Modal Template
export const CompleteBookingModalTemplate = `
<div class="modal-overlay" id="completeBookingModal" onclick="closeCompleteBookingModal()">
    <div class="modal modal-small" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3 class="modal-title" data-i18n="bookings.completePickup">Complete Pickup</h3>
            <button class="modal-close" onclick="closeCompleteBookingModal()">&times;</button>
        </div>

        <div style="padding: 0 24px 24px;">
            <!-- Balance Display -->
            <div class="balance-card success">
                <span class="balance-label" data-i18n="bookings.balanceToCollect">Balance to Collect</span>
                <span id="completeBalance" class="balance-value">-</span>
            </div>

            <div class="form-group">
                <label class="form-label"><span data-i18n="bookings.amountReceived">Amount Received</span> <span class="required">*</span></label>
                <input type="number" id="completeAmount" class="form-input">
            </div>

            <div class="form-group">
                <label class="form-label" data-i18n="sale.paymentMethod">Payment Method</label>
                <div class="payment-options">
                    <label class="payment-option">
                        <input type="radio" name="completeMethod" value="Cash" checked>
                        <span class="payment-btn">
                            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <rect x="2" y="6" width="20" height="12" rx="2"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                            <span data-i18n="sale.cash">Cash</span>
                        </span>
                    </label>
                    <label class="payment-option">
                        <input type="radio" name="completeMethod" value="UPI">
                        <span class="payment-btn">
                            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                            UPI
                        </span>
                    </label>
                </div>
            </div>

            <div class="cb-actions">
                <button class="btn btn-outline" onclick="closeCompleteBookingModal()" data-i18n="common.cancel">Cancel</button>
                <button class="btn btn-success" onclick="confirmCompleteBooking()">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span data-i18n="bookings.completePickup">Complete Pickup</span>
                </button>
            </div>
        </div>
    </div>
</div>
`;

// Cancel Booking Modal Template
export const CancelBookingModalTemplate = `
<div class="modal-overlay" id="cancelBookingModal" onclick="closeCancelBookingModal()">
    <div class="modal modal-small" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3 class="modal-title" data-i18n="bookings.cancelBooking">Cancel Booking</h3>
            <button class="modal-close" onclick="closeCancelBookingModal()">&times;</button>
        </div>

        <div style="padding: 0 24px 24px;">
            <div class="cancel-warning-box">
                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <div>
                    <p class="warning-title" data-i18n="bookings.areYouSure">Are you sure?</p>
                    <p class="warning-desc" data-i18n="bookings.cancelWarning">This action cannot be undone. Inventory will be restored.</p>
                </div>
            </div>

            <div class="refund-card">
                <span class="refund-label" data-i18n="bookings.advanceToRefund">Advance to Refund</span>
                <span id="cancelRefundAmount" class="refund-amount">-</span>
            </div>

            <div class="cb-actions">
                <button class="btn btn-outline" onclick="closeCancelBookingModal()" data-i18n="bookings.keepBooking">Keep Booking</button>
                <button class="btn btn-danger" onclick="confirmCancelBooking()">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    <span data-i18n="bookings.cancelAndRefund">Cancel & Refund</span>
                </button>
            </div>
        </div>
    </div>
</div>
`;

// Booking Receipt Modal Template
export const BookingReceiptModalTemplate = `
<div class="modal-overlay" id="bookingReceiptModal" onclick="closeBookingReceipt()">
    <div class="modal modal-large" onclick="event.stopPropagation()">
        <div class="modal-header">
            <button id="receiptBackBtn" class="back-btn" onclick="closeBookingReceipt()" style="display: none;">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
            </button>
            <h3 class="modal-title" id="brTitle" data-i18n="bookings.bookingReceipt">Booking Receipt</h3>
            <button class="modal-close" onclick="closeBookingReceipt()">&times;</button>
        </div>

        <!-- Success Header -->
        <div class="receipt-header" id="brHeader">
            <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"/>
            </svg>
            <span id="brHeaderText" data-i18n="bookings.paymentReceived">Payment Received</span>
        </div>

        <div style="padding: 0 24px 24px;">
            <!-- Customer Info -->
            <div class="bd-section">
                <h4 data-i18n="sale.customerDetails">Customer Details</h4>
                <div class="bd-row">
                    <span class="bd-label" data-i18n="customers.name">Name</span>
                    <span class="bd-value" id="brCustomerName">-</span>
                </div>
                <div class="bd-row">
                    <span class="bd-label" data-i18n="customers.phone">Phone</span>
                    <span class="bd-value" id="brCustomerPhone">-</span>
                </div>
                <div class="bd-row">
                    <span class="bd-label" data-i18n="bookings.transactionDate">Transaction Date</span>
                    <span class="bd-value" id="brDate">-</span>
                </div>
                <div class="bd-row">
                    <span class="bd-label" data-i18n="bookings.pickupDate">Pickup Date</span>
                    <span class="bd-value" id="brPickupDate">-</span>
                </div>
            </div>

            <!-- Items -->
            <div class="bd-section">
                <h4 data-i18n="common.items">Items</h4>
                <div id="brItems" class="bd-items-list"></div>
            </div>

            <!-- Totals -->
            <div class="bd-section">
                <div class="bd-totals">
                    <div class="bd-row">
                        <span class="bd-label" data-i18n="bookings.orderTotal">Order Total</span>
                        <span class="bd-value" id="brTotal">-</span>
                    </div>
                    <div class="bd-row" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">
                        <span class="bd-label" data-i18n="bookings.thisPayment">This Payment</span>
                        <span class="bd-value" style="color: var(--primary); font-size: 18px;" id="brThisPayment">-</span>
                    </div>
                    <div class="bd-row">
                        <span class="bd-label" data-i18n="sale.paymentMethod">Payment Method</span>
                        <span class="bd-value" id="brPaymentMethod">-</span>
                    </div>
                </div>
            </div>

            <!-- Payment History -->
            <div class="bd-section">
                <h4 data-i18n="bookings.allPayments">All Payments</h4>
                <div id="brPaymentHistory" class="bd-payments-list"></div>
            </div>

            <!-- Balance -->
            <div id="brBalanceSection" class="balance-card" style="margin-bottom: 16px;">
                <span class="balance-label" data-i18n="bookings.balanceRemaining">Balance Remaining</span>
                <span id="brBalance" class="balance-value">-</span>
            </div>

            <!-- SMS Section -->
            <div id="brSmsSection">
                <button class="btn btn-outline btn-block" onclick="sendBookingSMSBill()">
                    <svg fill="none" height="18" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="18">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                    <span data-i18n="bookings.sendSmsReceipt">Send SMS Receipt</span>
                </button>
            </div>

            <button class="btn btn-primary btn-block" style="margin-top: 12px;" onclick="closeBookingReceipt()" data-i18n="common.done">Done</button>
        </div>
    </div>
</div>
`;
