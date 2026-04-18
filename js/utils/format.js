// Formatting Utility Functions

import { CURRENCY_SYMBOL, getCategoryIcon } from '../config/index.js';

export const Format = {
    // Format currency with symbol
    currency: (amount) => CURRENCY_SYMBOL + (amount || 0).toLocaleString(),

    // Convert YYYY-MM-DD to DD/MM/YYYY
    date: (dateStr) => {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    },

    // Get current time string
    time: () => new Date().toLocaleTimeString(),

    // Get today's date as YYYY-MM-DD
    today: () => new Date().toISOString().split('T')[0],

    // Get month name from number
    monthName: (monthNum) => {
        const names = ['', 'January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        return names[parseInt(monthNum)] || '';
    },

    // Get category icon
    categoryIcon: (category) => getCategoryIcon(category)
};
