// Global Function Bridges for HTML onclick Compatibility
// This file exposes module functions to the global window object
// so they can be called from HTML onclick attributes

import {
    Auth,
    Navigation,
    Sales,
    Transactions,
    Inventory,
    Customers,
    Products,
    Reports,
    Backup,
    Bookings,
    PinPad
} from './app.js';

import { Modal } from './components/index.js';
import { State } from './state/index.js';
import { DOM, Format, Toast } from './utils/index.js';

// ==================== AUTH ====================
window.selectRole = (role) => Auth.selectRole(role);
window.backToRoleSelect = () => Auth.backToRoleSelect();
window.showForgotPin = () => Auth.showForgotPin();
window.backToLoginPin = () => Auth.backToLoginPin();
window.logout = () => Auth.logout();
window.showSetPinModal = () => Auth.showSetPinModal();
window.closePinModal = () => Auth.closePinModal();

// Login PIN pad
window.enterLoginPin = (num) => PinPad.enter('login', num);
window.clearLoginPin = () => PinPad.clear('login');
window.deleteLoginPin = () => PinPad.delete('login');

// Master PIN pad (forgot PIN)
window.enterMasterPin = (num) => PinPad.enter('master', num);
window.clearMasterPin = () => PinPad.clear('master');
window.deleteMasterPin = () => PinPad.delete('master');

// New PIN pad (set new PIN)
window.enterNewPin = (num) => PinPad.enter('newPin', num);
window.clearNewPin = () => PinPad.clear('newPin');
window.deleteNewPin = () => PinPad.delete('newPin');

// Settings PIN pad
window.enterPin = (num) => PinPad.enter('settings', num);
window.clearPin = () => PinPad.clear('settings');
window.deletePin = () => PinPad.delete('settings');

// ==================== NAVIGATION ====================
window.showPage = (pageId) => Navigation.showPage(pageId);
window.showSettings = () => Navigation.showSettings();

// ==================== SALES ====================
window.showSaleStep = (step) => Sales.showStep(step);
window.filterProducts = () => Sales.filterProducts();
window.searchCustomers = () => Sales.searchCustomers();
window.selectPayment = (method) => Sales.selectPayment(method);
window.completeSale = () => Sales.completeSale();
window.changeCartQty = (delta) => Sales.changeCartModalQty(delta);
window.addToCart = () => Sales.addToCart();
window.closeAddCartModal = () => Modal.hide('addCartModal');
window.sendSMSBill = () => Sales.sendSMSBill();
window.closeSaleComplete = () => Sales.closeSaleComplete();

// ==================== TRANSACTIONS ====================
window.showTransactionDetails = (saleId) => Transactions.showDetails(saleId);
window.closeTransactionModal = () => Transactions.close();
window.sendSMSFromTransaction = () => Transactions.sendSMS();
window.confirmDeleteTransaction = () => Transactions.confirmDelete();
window.backToHistoryFromTransaction = () => Transactions.backToHistory();
window.addCustomerFromSale = () => Transactions.addCustomerFromSale();

// ==================== INVENTORY ====================
window.showInventoryTab = (tab) => Inventory.showTab(tab);
window.filterStock = () => Inventory.filterStock();
window.saveStock = () => Inventory.saveStock();
window.closeEditStockModal = () => Inventory.closeEditModal();
window.saveStockEdit = () => Inventory.saveStockEdit();
window.captureInvoicePhoto = (event) => Inventory.captureInvoicePhoto(event);
window.removeInvoicePhoto = () => Inventory.removeInvoicePhoto();
window.selectStockType = (type) => Inventory.selectStockType(type);
window.backToStockType = () => Inventory.backToStockType();
window.startStockSession = () => Inventory.startStockSession();
window.completeStockSession = () => Inventory.completeStockSession();

// ==================== CUSTOMERS ====================
window.filterAllCustomers = () => Customers.filter();
window.showAddCustomerModal = () => Customers.showAddModal();
window.closeAddCustomerModal = () => Customers.closeAddModal();
window.saveNewCustomer = () => Customers.saveNew();
window.closeCustomerHistory = () => Customers.closeHistory();
window.backToCustomerHistory = () => Customers.backToHistory();

// ==================== PRODUCTS ====================
window.showAddProductModal = () => Products.showAddModal();
window.closeAddProductModal = () => Products.closeAddModal();
window.saveNewProduct = () => Products.saveNew();
window.closeAddCategoryModal = () => Products.closeAddCategoryModal();
window.saveNewCategory = () => Products.saveNewCategory();
window.closeAddVariantModal = () => Products.closeAddVariantModal();
window.saveNewVariant = () => Products.saveNewVariant();
// Edit category/variant
window.showEditCategoryModal = (category) => Products.showEditCategoryModal(category);
window.closeEditCategoryModal = () => Products.closeEditCategoryModal();
window.saveEditCategory = () => Products.saveEditCategory();
window.showEditVariantModal = (category, variant) => Products.showEditVariantModal(category, variant);
window.closeEditVariantModal = () => Products.closeEditVariantModal();
window.saveEditVariant = () => Products.saveEditVariant();
// Delete category/variant
window.showDeleteCategoryConfirm = () => Products.showDeleteCategoryConfirm();
window.closeDeleteCategoryModal = () => Products.closeDeleteCategoryModal();
window.confirmDeleteCategory = () => Products.deleteCategory();
window.showDeleteVariantConfirm = () => Products.showDeleteVariantConfirm();
window.closeDeleteVariantModal = () => Products.closeDeleteVariantModal();
window.confirmDeleteVariant = () => Products.deleteVariant();
// Emoji picker
window.selectEmoji = (containerId, hiddenInputId, emoji) => Products.selectEmoji(containerId, hiddenInputId, emoji);

// ==================== REPORTS ====================
window.showReportTab = (tab) => Reports.showTab(tab);
window.loadDailyReport = () => Reports.loadDaily();
window.loadMonthlyReport = () => Reports.loadMonthly();
window.toggleProfitDisplay = () => Reports.toggleProfitDisplay();
window.loadStockLog = () => Reports.loadStockLog();
window.closeStockLogModal = () => Reports.closeStockLogModal();
window.viewStockLogPhoto = (logId) => Reports.viewStockLogPhoto(logId);
window.closePhotoModal = () => Reports.closePhotoModal();

// ==================== BACKUP ====================
window.downloadBackup = () => Backup.download();
window.restoreBackup = (event) => Backup.restore(event);

// ==================== SYNC ====================
// Auto sync status - called when settings page is opened
window.checkSyncStatus = async () => {
    const { Storage } = await import('./state/index.js');
    const { DOM } = await import('./utils/index.js');

    const statusEl = document.getElementById('firebaseStatus');
    if (statusEl) {
        statusEl.textContent = 'Checking...';
        statusEl.className = '';
    }

    const result = await Storage.checkFirebaseConnection();
    const status = Storage.getSyncStatus();

    // Update connection status
    if (statusEl) {
        if (result.connected) {
            statusEl.textContent = 'Connected';
            statusEl.className = 'sync-connected';
        } else {
            statusEl.textContent = result.error || 'Disconnected';
            statusEl.className = 'sync-disconnected';
        }
    }

    // Update last sync time
    const lastSyncEl = document.getElementById('lastSyncTime');
    if (lastSyncEl) {
        if (status.lastSyncTime) {
            const now = new Date();
            const syncTime = new Date(status.lastSyncTime);
            const diffMs = now - syncTime;
            const diffMins = Math.floor(diffMs / 60000);

            if (diffMins < 1) {
                lastSyncEl.textContent = 'Just now';
            } else if (diffMins < 60) {
                lastSyncEl.textContent = `${diffMins} min ago`;
            } else {
                lastSyncEl.textContent = syncTime.toLocaleTimeString();
            }
        } else {
            lastSyncEl.textContent = 'Not yet';
        }
    }

    // Update counts using direct DOM access
    const setCount = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    setCount('syncCountInventory', status.collections.inventory);
    setCount('syncCountSales', status.collections.sales);
    setCount('syncCountCustomers', status.collections.customers);
    setCount('syncCountBookings', status.collections.bookings);
    setCount('syncCountProducts', status.collections.products);

    // Show errors if any
    const errorsEl = document.getElementById('syncErrors');
    const errorsListEl = document.getElementById('syncErrorsList');
    if (errorsEl && errorsListEl) {
        if (status.errors.length > 0) {
            errorsEl.style.display = 'block';
            errorsListEl.innerHTML = status.errors.slice(-5).map(e =>
                `<div style="margin-bottom: 4px;">${e.collection}: ${e.error}</div>`
            ).join('');
        } else {
            errorsEl.style.display = 'none';
        }
    }

    console.log('Sync status checked:', { connected: result.connected, collections: status.collections });
};

// ==================== BOOKINGS ====================
window.showBookingTab = (tab) => Bookings.showTab(tab);
window.closeBookingDetails = () => Bookings.closeDetails();
window.backToHistoryFromBooking = () => Bookings.backToHistory();

// Create booking (from sale page)
window.showCreateBookingModal = () => {
    if (State.cart.length === 0) {
        Toast.show('Cart is empty');
        return;
    }

    let total = State.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    DOM.setText(DOM.get('cbItemCount'), State.cart.length);
    DOM.setText(DOM.get('cbTotal'), Format.currency(total));

    // Pre-fill customer if available
    const customerName = DOM.get('customerName')?.value || '';
    const customerPhone = DOM.get('customerPhone')?.value || '';
    DOM.get('cbCustomerName').value = customerName;
    DOM.get('cbCustomerPhone').value = customerPhone;

    // Set minimum pickup date to today
    const today = new Date().toISOString().split('T')[0];
    const pickupInput = DOM.get('cbPickupDate');
    pickupInput.min = today;
    pickupInput.value = '';

    DOM.get('cbAdvanceAmount').value = '';

    Modal.show('createBookingModal');
};
window.closeCreateBookingModal = () => Modal.hide('createBookingModal');
window.confirmCreateBooking = () => {
    const customerName = DOM.get('cbCustomerName').value.trim();
    const customerPhone = DOM.get('cbCustomerPhone').value.trim();
    const pickupDate = DOM.get('cbPickupDate').value;
    const advanceAmount = parseFloat(DOM.get('cbAdvanceAmount').value) || 0;
    const paymentMethod = document.querySelector('input[name="cbPaymentMethod"]:checked')?.value || 'Cash';

    const booking = Bookings.createFromCart(customerName, customerPhone, pickupDate, advanceAmount, paymentMethod);
    if (booking) {
        Modal.hide('createBookingModal');
        Sales.reset();
        Sales.renderCategories();
        Navigation.showPage('bookings');
    }
};

// Booking details actions
window.showAddAdvanceModal = () => Bookings.showAddAdvanceModal();
window.closeAddAdvanceModal = () => Bookings.closeAddAdvanceModal();
window.confirmAddAdvance = () => Bookings.addAdvance();

window.showChangeDateModal = () => Bookings.showChangeDateModal();
window.closeChangeDateModal = () => Bookings.closeChangeDateModal();
window.confirmChangeDate = () => Bookings.changePickupDate();

window.showCompleteBookingModal = () => Bookings.showCompleteModal();
window.closeCompleteBookingModal = () => Bookings.closeCompleteModal();
window.confirmCompleteBooking = () => Bookings.completeBooking();

window.showCancelBookingModal = () => Bookings.showCancelModal();
window.closeCancelBookingModal = () => Bookings.closeCancelModal();
window.confirmCancelBooking = () => Bookings.cancelBooking(true);

// Booking receipt
window.showBookingReceipt = (bookingId, paymentType, paymentIndex) => Bookings.showPaymentReceipt(bookingId, paymentType, paymentIndex);
window.closeBookingReceipt = () => Bookings.closePaymentReceipt();
window.sendBookingSMSBill = () => Bookings.sendSMSBill();
