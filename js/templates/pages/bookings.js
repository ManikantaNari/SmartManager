// Bookings Page Template

export const BookingsTemplate = `
<div class="page" id="page-bookings">
    <div class="page-header">
        <h2>Bookings</h2>
    </div>

    <div class="tabs booking-tabs">
        <button class="tab booking-tab active" data-tab="today" onclick="showBookingTab('today')">
            Today
        </button>
        <button class="tab booking-tab" data-tab="overdue" onclick="showBookingTab('overdue')">
            Overdue
        </button>
        <button class="tab booking-tab" data-tab="upcoming" onclick="showBookingTab('upcoming')">
            Upcoming
        </button>
        <button class="tab booking-tab" data-tab="all" onclick="showBookingTab('all')">
            All
        </button>
    </div>

    <div class="bookings-list" id="bookingsList">
        <!-- Bookings rendered here -->
    </div>
</div>
`;
