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
    PinPad
} from './app.js';

import { Modal } from './components';

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
window.closeTransactionModal = () => Transactions.close();
window.sendSMSFromTransaction = () => Transactions.sendSMS();
window.confirmDeleteTransaction = () => Transactions.confirmDelete();

// ==================== INVENTORY ====================
window.showInventoryTab = (tab) => Inventory.showTab(tab);
window.filterStock = () => Inventory.filterStock();
window.saveStock = () => Inventory.saveStock();
window.closeEditStockModal = () => Inventory.closeEditModal();
window.saveStockEdit = () => Inventory.saveStockEdit();
window.captureInvoicePhoto = (event) => Inventory.captureInvoicePhoto(event);
window.removeInvoicePhoto = () => Inventory.removeInvoicePhoto();
window.startStockSession = () => Inventory.startStockSession();
window.completeStockSession = () => Inventory.completeStockSession();

// ==================== CUSTOMERS ====================
window.filterAllCustomers = () => Customers.filter();
window.showAddCustomerModal = () => Customers.showAddModal();
window.closeAddCustomerModal = () => Customers.closeAddModal();
window.saveNewCustomer = () => Customers.saveNew();

// ==================== PRODUCTS ====================
window.showAddProductModal = () => Products.showAddModal();
window.closeAddProductModal = () => Products.closeAddModal();
window.saveNewProduct = () => Products.saveNew();
window.closeAddCategoryModal = () => Products.closeAddCategoryModal();
window.saveNewCategory = () => Products.saveNewCategory();
window.closeAddVariantModal = () => Products.closeAddVariantModal();
window.saveNewVariant = () => Products.saveNewVariant();

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
