// Date Utility Functions
// Centralized date/time handling for consistent behavior across the app

/**
 * DateUtil provides standardized date and time operations
 * All dates are stored as ISO 8601 format (YYYY-MM-DD or full ISO string)
 * All comparisons and calculations use these standard formats
 */
export const DateUtil = {
    /**
     * Get today's date in ISO format (YYYY-MM-DD)
     * @returns {string} ISO date string
     */
    today() {
        return new Date().toISOString().split('T')[0];
    },

    /**
     * Get current datetime in full ISO 8601 format (with timezone)
     * Used for timestamps and precise time tracking
     * @returns {string} ISO datetime string
     */
    now() {
        return new Date().toISOString();
    },

    /**
     * Get current time in 12-hour format with AM/PM (no seconds)
     * @returns {string} Time string in h:MM AM/PM format
     */
    time() {
        return new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    },

    /**
     * Format ISO date (YYYY-MM-DD) to readable format (DD/MM/YYYY)
     * @param {string} isoDate - ISO date string
     * @returns {string} Formatted date string
     */
    formatDate(isoDate) {
        if (!isoDate) return '';
        const parts = isoDate.split('-');
        if (parts.length !== 3) return isoDate;
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    },

    /**
     * Format ISO date to readable format with month name (DD Mon YYYY)
     * @param {string} isoDate - ISO date string
     * @returns {string} Formatted date string (e.g., "19 Apr 2026")
     */
    formatDateLong(isoDate) {
        if (!isoDate) return '';
        const d = new Date(isoDate + 'T00:00:00');
        return d.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    },

    /**
     * Format ISO date to readable format with full month name and full year
     * @param {string} isoDate - ISO date string
     * @returns {string} Formatted date string (e.g., "April 20, 2026")
     */
    formatDateReadable(isoDate) {
        if (!isoDate) return '';
        const [year, month, day] = isoDate.split('-');
        const monthNames = [
            '', 'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const monthName = monthNames[parseInt(month)];
        return `${monthName} ${parseInt(day)}, ${year}`;
    },

    /**
     * Format ISO datetime to readable format with 12-hour time (no seconds)
     * @param {string} isoDateTime - ISO datetime string
     * @returns {string} Formatted datetime string
     */
    formatDateTime(isoDateTime) {
        if (!isoDateTime) return '';
        const d = new Date(isoDateTime);
        return d.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    },

    /**
     * Format time from ISO datetime or time string to 12-hour format with AM/PM (no seconds)
     * @param {string} timeOrDatetime - Time string or ISO datetime
     * @returns {string} Formatted time string in h:MM AM/PM format
     */
    formatTime(timeOrDatetime) {
        if (!timeOrDatetime) return '';

        // If it's a time string (HH:MM:SS), parse it
        if (timeOrDatetime.match(/^\d{2}:\d{2}:\d{2}$/)) {
            const [hours, minutes] = timeOrDatetime.split(':');
            const d = new Date();
            d.setHours(parseInt(hours), parseInt(minutes), 0);
            return d.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }

        // Otherwise parse as datetime
        const d = new Date(timeOrDatetime);
        return d.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    },

    /**
     * Check if two dates are the same day
     * @param {string} date1 - ISO date string
     * @param {string} date2 - ISO date string
     * @returns {boolean} True if same day
     */
    isSameDay(date1, date2) {
        if (!date1 || !date2) return false;
        const d1 = date1.split('T')[0];
        const d2 = date2.split('T')[0];
        return d1 === d2;
    },

    /**
     * Check if date1 is after date2
     * @param {string} date1 - ISO date string
     * @param {string} date2 - ISO date string
     * @returns {boolean} True if date1 > date2
     */
    isAfter(date1, date2) {
        if (!date1 || !date2) return false;
        return date1 > date2;
    },

    /**
     * Check if date1 is before date2
     * @param {string} date1 - ISO date string
     * @param {string} date2 - ISO date string
     * @returns {boolean} True if date1 < date2
     */
    isBefore(date1, date2) {
        if (!date1 || !date2) return false;
        return date1 < date2;
    },

    /**
     * Check if date1 is same or after date2
     * @param {string} date1 - ISO date string
     * @param {string} date2 - ISO date string
     * @returns {boolean} True if date1 >= date2
     */
    isSameOrAfter(date1, date2) {
        if (!date1 || !date2) return false;
        return date1 >= date2;
    },

    /**
     * Check if date1 is same or before date2
     * @param {string} date1 - ISO date string
     * @param {string} date2 - ISO date string
     * @returns {boolean} True if date1 <= date2
     */
    isSameOrBefore(date1, date2) {
        if (!date1 || !date2) return false;
        return date1 <= date2;
    },

    /**
     * Add days to a date
     * @param {string} isoDate - ISO date string
     * @param {number} days - Number of days to add (can be negative)
     * @returns {string} New ISO date string
     */
    addDays(isoDate, days) {
        const d = new Date(isoDate + 'T00:00:00');
        d.setDate(d.getDate() + days);
        return d.toISOString().split('T')[0];
    },

    /**
     * Calculate difference in days between two dates
     * @param {string} date1 - ISO date string (earlier date)
     * @param {string} date2 - ISO date string (later date)
     * @returns {number} Number of days difference (positive if date2 > date1)
     */
    daysDiff(date1, date2) {
        const d1 = new Date(date1 + 'T00:00:00');
        const d2 = new Date(date2 + 'T00:00:00');
        const diffMs = d2 - d1;
        return Math.floor(diffMs / (1000 * 60 * 60 * 24));
    },

    /**
     * Get month name from date or month number
     * @param {string|number} dateOrMonth - ISO date string or month number (1-12)
     * @returns {string} Month name
     */
    monthName(dateOrMonth) {
        const monthNames = [
            '', 'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        if (typeof dateOrMonth === 'string' && dateOrMonth.includes('-')) {
            // It's a date string
            const monthNum = parseInt(dateOrMonth.split('-')[1]);
            return monthNames[monthNum] || '';
        } else {
            // It's a month number
            return monthNames[parseInt(dateOrMonth)] || '';
        }
    },

    /**
     * Parse date and time into ISO datetime
     * @param {string} isoDate - ISO date string (YYYY-MM-DD)
     * @param {string} timeStr - Time string (HH:MM:SS)
     * @returns {string} ISO datetime string
     */
    combineDateTime(isoDate, timeStr) {
        if (!isoDate) return null;
        if (!timeStr) return isoDate + 'T00:00:00.000Z';
        return isoDate + 'T' + timeStr + '.000Z';
    },

    /**
     * Extract date from ISO datetime
     * @param {string} isoDateTime - ISO datetime string
     * @returns {string} ISO date string (YYYY-MM-DD)
     */
    extractDate(isoDateTime) {
        if (!isoDateTime) return '';
        return isoDateTime.split('T')[0];
    },

    /**
     * Extract time from ISO datetime
     * @param {string} isoDateTime - ISO datetime string
     * @returns {string} Time string (HH:MM:SS)
     */
    extractTime(isoDateTime) {
        if (!isoDateTime) return '';
        const timePart = isoDateTime.split('T')[1];
        if (!timePart) return '';
        return timePart.split('.')[0]; // Remove milliseconds and timezone
    },

    /**
     * Check if a date is today
     * @param {string} isoDate - ISO date string
     * @returns {boolean} True if date is today
     */
    isToday(isoDate) {
        return this.isSameDay(isoDate, this.today());
    },

    /**
     * Check if a date is in the past
     * @param {string} isoDate - ISO date string
     * @returns {boolean} True if date is before today
     */
    isPast(isoDate) {
        return this.isBefore(isoDate, this.today());
    },

    /**
     * Check if a date is in the future
     * @param {string} isoDate - ISO date string
     * @returns {boolean} True if date is after today
     */
    isFuture(isoDate) {
        return this.isAfter(isoDate, this.today());
    },

    /**
     * Get relative time description (e.g., "2 days ago", "in 3 days")
     * @param {string} isoDate - ISO date string
     * @returns {string} Relative time description
     */
    relative(isoDate) {
        if (!isoDate) return '';

        const today = this.today();
        const diff = this.daysDiff(today, isoDate);

        if (diff === 0) return 'Today';
        if (diff === 1) return 'Tomorrow';
        if (diff === -1) return 'Yesterday';
        if (diff > 1) return `In ${diff} days`;
        if (diff < -1) return `${Math.abs(diff)} days ago`;

        return isoDate;
    }
};
