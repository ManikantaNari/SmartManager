// Main Application Entry Point

import { initializeFirebase, getDb, isOnline, setOnlineStatus, STORAGE_KEYS } from './config/index.js';
import { DOM } from './utils/index.js';
import { PinPad } from './components/index.js';
import { State, Storage } from './state/index.js';
import {
    Auth, Navigation, Dashboard, Sales, Transactions,
    Inventory, Customers, Products, Reports, Backup
} from './modules/index.js';
import { loadTemplates } from './templates/index.js';

// Initialize the application
const App = {
    async init() {
        // Load HTML templates first
        loadTemplates();
        // Initialize Firebase
        initializeFirebase();

        // Load all data
        await Storage.loadAll();
        Auth.pinLoaded = true;

        // Hide loading, show login options
        const loginLoading = DOM.get('loginLoading');
        const loginOptions = DOM.get('loginOptions');
        const loginSubtitle = DOM.get('loginSubtitle');

        if (loginLoading) DOM.hide(loginLoading);
        if (loginOptions) DOM.show(loginOptions);
        if (loginSubtitle) DOM.setText(loginSubtitle, 'Select your role to continue');

        // Listen for PIN changes from other devices
        this.listenForPinChanges();

        // Initialize auth (before login)
        Auth.init(() => this.initAfterLogin());
    },

    initAfterLogin() {
        // Setup page callbacks for navigation
        Navigation.setPageCallbacks({
            dashboard: () => Dashboard.render(),
            sale: () => { Sales.reset(); Sales.renderCategories(); },
            inventory: () => Inventory.renderStockList(),
            customers: () => Customers.renderAll(),
            reports: () => Reports.showTab('daily')
        });

        // Initialize all modules with their dependencies
        Navigation.init();

        Dashboard.init((saleId) => Transactions.showDetails(saleId));

        Sales.init({
            showAddCategoryModal: () => Products.showAddCategoryModal(),
            showAddVariantModal: (ctx) => Products.showAddVariantModal(ctx),
            onSaleComplete: () => Dashboard.render()
        });

        Transactions.init({
            onTransactionDeleted: () => {
                Dashboard.render();
                if (DOM.hasClass(DOM.get('page-reports'), 'active')) {
                    Reports.loadDaily();
                }
            },
            requestAdminAccess: (action, onSuccess) => Auth.showSettingsPinModal(action, onSuccess)
        });

        Inventory.init({
            showAddCategoryModal: () => Products.showAddCategoryModal(),
            showAddVariantModal: (ctx) => Products.showAddVariantModal(ctx),
            onStockUpdated: () => Dashboard.render()
        });

        Customers.init();

        Products.init({
            onProductsUpdated: () => {
                Sales.renderCategories();
                Sales.renderVariants();
                Inventory.renderStockCategories();
                Inventory.renderStockVariants();
            }
        });

        Reports.init({
            showTransactionDetails: (saleId) => Transactions.showDetails(saleId)
        });

        // Initial render
        Sales.renderCategories();
        Inventory.renderStockCategories();
        Products.renderList();
        Dashboard.render();
        Reports.setDefaultDates();

        // Update sync status
        this.updateSyncStatus();

        // Network detection
        window.addEventListener('online', () => {
            setOnlineStatus(true);
            this.updateSyncStatus();
        });
        window.addEventListener('offline', () => {
            setOnlineStatus(false);
            this.updateSyncStatus();
        });

        // Backup reminder
        Backup.checkReminder();
    },

    updateSyncStatus() {
        const dot = DOM.get('syncDot');
        const text = DOM.get('syncText');

        DOM.toggleClass(dot, 'offline', !isOnline);
        DOM.setText(text, isOnline ? 'Synced' : 'Offline');
    },

    listenForPinChanges() {
        const db = getDb();
        if (!db) return;
        db.collection('settings').doc('adminPin').onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                if (data.pin && data.pin !== State.adminPin) {
                    State.adminPin = data.pin;
                    Storage.setLocal(STORAGE_KEYS.adminPin, State.adminPin);
                    console.log('PIN updated from another device');
                }
            }
        }, (error) => {
            console.log('PIN listener error:', error);
        });
    }
};

// Export modules for global function bridges
export {
    Auth,
    Navigation,
    Dashboard,
    Sales,
    Transactions,
    Inventory,
    Customers,
    Products,
    Reports,
    Backup,
    PinPad
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
