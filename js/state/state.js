// Centralized State Management

import { DEFAULT_PRODUCTS, DEFAULT_ADMIN_PIN } from '../config/index.js';

export const State = {
    // Data
    products: { ...DEFAULT_PRODUCTS },
    inventory: {},
    customers: [],
    sales: [],
    stockLogs: [],
    bookings: [],
    cart: [],

    // Stock Entry Session
    stockSession: null, // { id, vendor, invoice, photo, items: [], startTime }

    // Auth
    adminPin: DEFAULT_ADMIN_PIN,
    userRole: null,
    isAdminUnlocked: false,

    // UI State
    selectedCategory: null,
    selectedVariant: null,
    selectedPayment: null,
    selectedStockCategory: null,
    selectedStockVariant: null,
    currentSaleData: null,
    selectedTransactionId: null,
    editingStockKey: null,
    editingCustomerPhone: null,  // Deprecated, kept for backward compatibility
    editingCustomerId: null,
    viewingCustomerId: null,
    editingCategory: null,
    editingVariant: null,
    editingVariantCategory: null,
    cameFromHistory: false,
    variantModalContext: 'sale',
    selectedBookingId: null,
    selectedPaymentType: null,
    selectedPaymentIndex: null,
    bookingTab: 'today',

    // Check if current user is admin
    isAdmin() {
        return this.userRole === 'admin';
    },

    // Reset sale-related state
    resetSale() {
        this.cart = [];
        this.selectedCategory = null;
        this.selectedVariant = null;
        this.selectedPayment = null;
    },

    // Reset all state
    reset() {
        this.resetSale();
        this.selectedStockCategory = null;
        this.selectedStockVariant = null;
        this.currentSaleData = null;
        this.selectedTransactionId = null;
        this.editingStockKey = null;
        this.editingCustomerPhone = null;
        this.editingCustomerId = null;
        this.editingCategory = null;
        this.editingVariant = null;
        this.editingVariantCategory = null;
    }
};
