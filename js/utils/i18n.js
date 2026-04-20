// Internationalization (i18n) Utility
// Provides translation support for multiple languages

/**
 * Translation keys and their default English values
 * This serves as the source of truth for all translatable strings
 */
const translations = {
    en: {
        // Common
        common: {
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            add: 'Add',
            search: 'Search',
            close: 'Close',
            back: 'Back',
            next: 'Next',
            yes: 'Yes',
            no: 'No',
            ok: 'OK',
            loading: 'Loading...',
            noData: 'No data available'
        },

        // Navigation
        nav: {
            dashboard: 'Dashboard',
            sale: 'Sale',
            inventory: 'Inventory',
            customers: 'Customers',
            reports: 'Reports',
            settings: 'Settings'
        },

        // Login
        login: {
            selectRole: 'Select Your Role',
            owner: 'Owner',
            manager: 'Manager',
            enterPin: 'Enter PIN',
            wrongPin: 'Wrong PIN',
            loginAs: 'Login as'
        },

        // Dashboard
        dashboard: {
            todaySales: "Today's Sales",
            todayProfit: "Today's Profit",
            lowStockAlerts: 'Low Stock Alerts',
            recentSales: 'Recent Sales',
            noSales: 'No sales yet',
            itemsInStock: 'items in stock'
        },

        // Sales
        sale: {
            selectCategory: 'Select Category',
            selectVariant: 'Select Variant',
            addToCart: 'Add to Cart',
            cart: 'Cart',
            checkout: 'Checkout',
            customerDetails: 'Customer Details',
            paymentMethod: 'Payment Method',
            completeSale: 'Complete Sale',
            saleCompleted: 'Sale Completed!',
            emptyCart: 'Cart is empty',
            outOfStock: 'Out of stock!',
            addedToCart: 'Added to cart'
        },

        // Inventory
        inventory: {
            stock: 'Stock',
            addStock: 'Add Stock',
            editStock: 'Edit Stock',
            stockUpdated: 'Stock updated successfully',
            selectStockType: 'Select Stock Type',
            newStock: 'New Stock',
            oldStock: 'Old Stock',
            newStockDesc: 'Stock from vendor/supplier',
            oldStockDesc: 'Adding existing inventory',
            vendorName: 'Vendor Name',
            invoiceNumber: 'Invoice Number',
            captureInvoice: 'Capture Invoice Photo',
            startSession: 'Start Session',
            completeSession: 'Complete Session',
            sessionStarted: 'Session started. Add items now.',
            itemAdded: 'Item added. Select next product.',
            stockLogged: 'items logged successfully',
            lowStockAlert: 'Low stock alert'
        },

        // Customers
        customers: {
            allCustomers: 'All Customers',
            addCustomer: 'Add Customer',
            editCustomer: 'Edit Customer',
            deleteCustomer: 'Delete Customer',
            customerName: 'Customer Name',
            phoneNumber: 'Phone Number',
            email: 'Email',
            customerAdded: 'Customer added',
            customerUpdated: 'Customer updated',
            customerDeleted: 'Customer deleted',
            noCustomers: 'No customers yet'
        },

        // Reports
        reports: {
            dailyReport: 'Daily Report',
            monthlyReport: 'Monthly Report',
            bestSellers: 'Best Sellers',
            transactions: 'Transactions',
            stockLog: 'Stock Log',
            selectDate: 'Select Date',
            selectMonth: 'Select Month',
            totalSales: 'Total Sales',
            totalProfit: 'Total Profit',
            itemsSold: 'Items Sold',
            noSales: 'No sales on this date',
            vendor: 'Vendor',
            invoice: 'Invoice',
            viewDetails: 'View Details'
        },

        // Products
        products: {
            categories: 'Categories',
            variants: 'Variants',
            addCategory: 'Add Category',
            addVariant: 'Add Variant',
            editCategory: 'Edit Category',
            editVariant: 'Edit Variant',
            deleteCategory: 'Delete Category',
            deleteVariant: 'Delete Variant',
            categoryName: 'Category Name',
            variantName: 'Variant Name',
            selectEmoji: 'Select Emoji',
            categoryAdded: 'Category added',
            categoryUpdated: 'Category updated',
            categoryDeleted: 'Category deleted',
            variantAdded: 'Variant added',
            variantUpdated: 'Variant updated',
            variantDeleted: 'Variant deleted',
            categoryExists: 'Category already exists',
            variantExists: 'Variant already exists',
            cannotDelete: 'Cannot delete - items in stock'
        },

        // Settings
        settings: {
            changePin: 'Change PIN',
            backup: 'Backup & Restore',
            syncStatus: 'Sync Status',
            downloadBackup: 'Download Backup',
            uploadBackup: 'Upload Backup',
            newPin: 'New PIN',
            confirmPin: 'Confirm PIN',
            pinChanged: 'PIN changed successfully',
            pinsDoNotMatch: 'PINs do not match',
            backupDownloaded: 'Backup downloaded',
            dataRestored: 'Data restored successfully'
        },

        // Validation
        validation: {
            required: '{field} is required',
            invalidPhone: 'Invalid phone number',
            invalidEmail: 'Invalid email address',
            mustBePositive: '{field} must be positive',
            mustBeNumber: '{field} must be a number',
            invalidDate: 'Invalid date format',
            minLength: '{field} must be at least {min} characters',
            maxLength: '{field} must be at most {max} characters'
        },

        // Errors
        errors: {
            loadFailed: 'Failed to load data',
            saveFailed: 'Failed to save data',
            syncFailed: 'Sync failed',
            connectionError: 'Connection error',
            notFound: 'Not found',
            accessDenied: 'Access denied'
        },

        // Date/Time
        datetime: {
            today: 'Today',
            yesterday: 'Yesterday',
            tomorrow: 'Tomorrow',
            thisWeek: 'This Week',
            lastWeek: 'Last Week',
            thisMonth: 'This Month',
            lastMonth: 'Last Month',
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        }
    },

    // Telugu translations (placeholder - to be filled)
    te: {
        common: {
            save: 'సేవ్ చేయండి',
            cancel: 'రద్దు చేయండి',
            delete: 'తొలగించు',
            edit: 'సవరించు',
            add: 'జోడించు',
            search: 'వెతకండి',
            close: 'మూసివేయి',
            back: 'వెనుకకు',
            next: 'తదుపరి',
            yes: 'అవును',
            no: 'కాదు',
            ok: 'సరే',
            loading: 'లోడ్ అవుతోంది...',
            noData: 'డేటా లేదు'
        }
        // More Telugu translations can be added as needed
    },

    // Hindi translations (placeholder - to be filled)
    hi: {
        common: {
            save: 'सहेजें',
            cancel: 'रद्द करें',
            delete: 'हटाएं',
            edit: 'संपादित करें',
            add: 'जोड़ें',
            search: 'खोजें',
            close: 'बंद करें',
            back: 'पीछे',
            next: 'आगे',
            yes: 'हाँ',
            no: 'नहीं',
            ok: 'ठीक है',
            loading: 'लोड हो रहा है...',
            noData: 'कोई डेटा उपलब्ध नहीं'
        }
        // More Hindi translations can be added as needed
    }
};

/**
 * i18n class for managing translations
 */
export class I18n {
    constructor() {
        this.currentLocale = 'en';
        this.translations = translations;
        this.fallbackLocale = 'en';
    }

    /**
     * Set the current locale
     * @param {string} locale - Locale code (e.g., 'en', 'te', 'hi')
     */
    setLocale(locale) {
        if (this.translations[locale]) {
            this.currentLocale = locale;
            localStorage.setItem('sm_locale', locale);
            document.documentElement.setAttribute('lang', locale);
            return true;
        }
        console.warn(`Locale '${locale}' not found, using fallback`);
        return false;
    }

    /**
     * Get the current locale
     * @returns {string} Current locale code
     */
    getLocale() {
        return this.currentLocale;
    }

    /**
     * Load saved locale from localStorage
     */
    loadSavedLocale() {
        const saved = localStorage.getItem('sm_locale');
        if (saved) {
            this.setLocale(saved);
        }
    }

    /**
     * Get translation for a key
     * @param {string} key - Translation key (e.g., 'common.save', 'nav.dashboard')
     * @param {Object} params - Parameters to replace in translation
     * @returns {string} Translated string
     */
    t(key, params = {}) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLocale];

        // Navigate through nested keys
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                // Fallback to English
                translation = this.translations[this.fallbackLocale];
                for (const fk of keys) {
                    if (translation && translation[fk]) {
                        translation = translation[fk];
                    } else {
                        return key; // Return key if translation not found
                    }
                }
                break;
            }
        }

        // If translation is still an object, return the key
        if (typeof translation !== 'string') {
            return key;
        }

        // Replace parameters in translation
        let result = translation;
        for (const [param, value] of Object.entries(params)) {
            result = result.replace(`{${param}}`, value);
        }

        return result;
    }

    /**
     * Check if a locale is available
     * @param {string} locale - Locale code to check
     * @returns {boolean} True if locale exists
     */
    hasLocale(locale) {
        return !!this.translations[locale];
    }

    /**
     * Get all available locales
     * @returns {Array} Array of locale codes
     */
    getAvailableLocales() {
        return Object.keys(this.translations);
    }

    /**
     * Add or update translations for a locale
     * @param {string} locale - Locale code
     * @param {Object} newTranslations - Translation object to merge
     */
    addTranslations(locale, newTranslations) {
        if (!this.translations[locale]) {
            this.translations[locale] = {};
        }
        this.translations[locale] = this.deepMerge(this.translations[locale], newTranslations);
    }

    /**
     * Deep merge two objects
     * @param {Object} target - Target object
     * @param {Object} source - Source object
     * @returns {Object} Merged object
     */
    deepMerge(target, source) {
        const result = { ...target };
        for (const key in source) {
            if (source[key] instanceof Object && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        return result;
    }
}

// Create singleton instance
export const i18n = new I18n();

// Convenience function for translations
export const t = (key, params) => i18n.t(key, params);
