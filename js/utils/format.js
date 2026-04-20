// Formatting Utility Functions

import { CURRENCY_SYMBOL, getCategoryIcon } from '../config/index.js';
import { DateUtil } from './date.js';

export const Format = {
    // Format currency with symbol
    currency: (amount) => CURRENCY_SYMBOL + (amount || 0).toLocaleString(),

    // Convert YYYY-MM-DD to DD/MM/YYYY
    date: (dateStr) => DateUtil.formatDate(dateStr),

    // Get current time string
    time: () => DateUtil.time(),

    // Get today's date as YYYY-MM-DD
    today: () => DateUtil.today(),

    // Get month name from number or date string
    monthName: (monthNumOrDate) => DateUtil.monthName(monthNumOrDate),

    // Get category icon
    categoryIcon: (category) => getCategoryIcon(category)
};
