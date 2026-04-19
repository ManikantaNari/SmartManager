// Booking Details Modal Template

export const BookingDetailsModalTemplate = `
<div class="modal-overlay" id="bookingDetailsModal" onclick="closeBookingDetails()">
    <div class="modal modal-large" onclick="event.stopPropagation()">
        <div class="modal-header">
            <button id="bookingBackBtn" class="back-btn" onclick="backToHistoryFromBooking()" style="display: none;">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
            </button>
            <h3 class="modal-title">Booking Details</h3>
            <span id="bdStatus" class="badge badge-primary">Pending</span>
            <button class="modal-close" onclick="closeBookingDetails()">&times;</button>
        </div>

        <div class="modal-body">
            <!-- Customer Info -->
            <div class="bd-section">
                <h4>Customer</h4>
                <div class="bd-row">
                    <span class="bd-label">Name:</span>
                    <span id="bdCustomerName">-</span>
                </div>
                <div class="bd-row">
                    <span class="bd-label">Phone:</span>
                    <span id="bdCustomerPhone">-</span>
                </div>
                <div class="bd-row">
                    <span class="bd-label">Pickup Date:</span>
                    <span id="bdPickupDate">-</span>
                </div>
                <div class="bd-row">
                    <span class="bd-label">Booked On:</span>
                    <span id="bdCreatedDate">-</span>
                </div>
            </div>

            <!-- Items -->
            <div class="bd-section">
                <h4>Items</h4>
                <div id="bdItems" class="bd-items-list">
                    <!-- Items rendered here -->
                </div>
            </div>

            <!-- Totals -->
            <div class="bd-section bd-totals">
                <div class="bd-row">
                    <span class="bd-label">Total:</span>
                    <span id="bdTotal" class="bd-value">-</span>
                </div>
                <div class="bd-row admin-only">
                    <span class="bd-label">Profit:</span>
                    <span id="bdProfit" class="bd-value profit-text">-</span>
                </div>
                <div class="bd-row">
                    <span class="bd-label">Advance Paid:</span>
                    <span id="bdTotalAdvance" class="bd-value text-success">-</span>
                </div>
                <div class="bd-row">
                    <span class="bd-label">Balance Due:</span>
                    <span id="bdBalance" class="bd-value text-danger">-</span>
                </div>
            </div>

            <!-- Payment History -->
            <div class="bd-section">
                <h4>Payment History</h4>
                <div id="bdPayments" class="bd-payments-list">
                    <!-- Payments rendered here -->
                </div>
            </div>
        </div>

        <!-- Actions (only for pending bookings) -->
        <div class="modal-footer bd-actions" id="bdActions">
            <button class="btn btn-outline" onclick="showAddAdvanceModal()">
                + Add Advance
            </button>
            <button class="btn btn-outline" onclick="showChangeDateModal()">
                Change Date
            </button>
            <button class="btn btn-danger-outline" onclick="showCancelBookingModal()">
                Cancel
            </button>
            <button class="btn btn-success" onclick="showCompleteBookingModal()">
                Complete Pickup
            </button>
        </div>
    </div>
</div>
`;
