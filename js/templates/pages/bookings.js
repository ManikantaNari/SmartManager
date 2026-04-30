// Bookings Page Template

export const BookingsTemplate = `
<div class="page" id="page-bookings">
    <div class="tabs booking-tabs">
        <button class="tab booking-tab active" data-tab="today" onclick="showBookingTab('today')" data-i18n="bookings.today">
            Today
        </button>
        <button class="tab booking-tab" data-tab="overdue" onclick="showBookingTab('overdue')" data-i18n="bookings.overdue">
            Overdue
        </button>
        <button class="tab booking-tab" data-tab="upcoming" onclick="showBookingTab('upcoming')" data-i18n="bookings.upcoming">
            Upcoming
        </button>
        <button class="tab booking-tab" data-tab="all" onclick="showBookingTab('all')" data-i18n="bookings.all">
            All
        </button>
    </div>

    <div class="bookings-list" id="bookingsList">
        <!-- Bookings rendered here -->
    </div>
</div>
`;
