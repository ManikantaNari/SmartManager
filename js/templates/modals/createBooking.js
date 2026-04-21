// Create Booking Modal Template

export const CreateBookingModalTemplate = `
<div class="modal-overlay" id="createBookingModal" onclick="closeCreateBookingModal()">
    <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3 class="modal-title" data-i18n="sale.bookWithAdvance">Book with Advance</h3>
            <button class="modal-close" onclick="closeCreateBookingModal()">&times;</button>
        </div>

        <!-- Cart Summary Card -->
        <div class="cb-header-card">
            <div class="cb-header-row">
                <div class="cb-header-item">
                    <span class="cb-header-label" data-i18n="common.items">Items</span>
                    <span class="cb-header-value" id="cbItemCount">0</span>
                </div>
                <div class="cb-header-divider"></div>
                <div class="cb-header-item">
                    <span class="cb-header-label" data-i18n="sale.total">Total</span>
                    <span class="cb-header-value" id="cbTotal">₹0</span>
                </div>
            </div>
        </div>

        <div style="padding: 0 24px 24px;">
            <!-- Customer Details -->
            <div class="form-group">
                <label class="form-label"><span data-i18n="customers.name">Customer Name</span> <span class="required">*</span></label>
                <input type="text" id="cbCustomerName" data-i18n-placeholder="customers.enterName" placeholder="Enter customer name" class="form-input">
            </div>

            <div class="form-group">
                <label class="form-label" data-i18n="customers.phone">Phone Number</label>
                <input type="tel" id="cbCustomerPhone" data-i18n-placeholder="customers.enterPhone" placeholder="Enter phone number" class="form-input">
            </div>

            <!-- Pickup Date -->
            <div class="form-group">
                <label class="form-label"><span data-i18n="bookings.pickupDate">Pickup Date</span> <span class="required">*</span></label>
                <input type="date" id="cbPickupDate" class="form-input">
            </div>

            <!-- Advance Amount -->
            <div class="form-group">
                <label class="form-label"><span data-i18n="bookings.advanceAmount">Advance Amount</span> <span class="required">*</span></label>
                <input type="number" id="cbAdvanceAmount" data-i18n-placeholder="bookings.enterAdvance" placeholder="Enter advance amount" class="form-input">
            </div>

            <!-- Payment Method -->
            <div class="form-group">
                <label class="form-label" data-i18n="sale.paymentMethod">Payment Method</label>
                <div class="payment-options">
                    <label class="payment-option">
                        <input type="radio" name="cbPaymentMethod" value="Cash" checked>
                        <span class="payment-btn">
                            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <rect x="2" y="6" width="20" height="12" rx="2"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                            <span data-i18n="sale.cash">Cash</span>
                        </span>
                    </label>
                    <label class="payment-option">
                        <input type="radio" name="cbPaymentMethod" value="UPI">
                        <span class="payment-btn">
                            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                            UPI
                        </span>
                    </label>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="cb-actions">
                <button class="btn btn-outline" onclick="closeCreateBookingModal()" data-i18n="common.cancel">Cancel</button>
                <button class="btn btn-primary" onclick="confirmCreateBooking()">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        <path d="M9 12l2 2 4-4"/>
                    </svg>
                    <span data-i18n="bookings.createBooking">Create Booking</span>
                </button>
            </div>
        </div>
    </div>
</div>
`;
