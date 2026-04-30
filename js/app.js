// Main Application Entry Point

import { initializeFirebase, getDb, isOnline, setOnlineStatus, STORAGE_KEYS } from './config/index.js';
import { DOM } from './utils/index.js';
import { PinPad } from './components/index.js';
import { State, Storage } from './state/index.js';
import {
    Auth, Navigation, Dashboard, Sales, Transactions,
    Inventory, Customers, Products, Reports, Backup, Bookings
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
            bookings: () => Bookings.renderList(),
            customers: () => Customers.renderAll(),
            reports: () => Reports.showTab('daily'),
            settings: () => {
                if (State.isAdmin() && window.checkSyncStatus) {
                    // Small delay to ensure DOM elements are ready
                    setTimeout(() => window.checkSyncStatus(), 100);
                }
            }
        });

        // Initialize all modules with their dependencies
        Navigation.init();

        Dashboard.init((saleId) => Transactions.showDetails(saleId));

        Sales.init({
            showAddCategoryModal: () => Products.showAddCategoryModal(),
            showAddVariantModal: (ctx) => Products.showAddVariantModal(ctx),
            showEditCategoryModal: (cat) => Products.showEditCategoryModal(cat),
            showEditVariantModal: (cat, variant) => Products.showEditVariantModal(cat, variant),
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
            showEditCategoryModal: (cat) => Products.showEditCategoryModal(cat),
            showEditVariantModal: (cat, variant) => Products.showEditVariantModal(cat, variant),
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

        Bookings.init({
            onBookingCreated: () => Dashboard.render(),
            onBookingCompleted: () => Dashboard.render()
        });

        // Initial render
        Sales.renderCategories();
        Inventory.renderStockCategories();
        Products.renderList();
        Dashboard.render();
        Reports.setDefaultDates();

        // Update sync status
        this.updateSyncStatus();

        // Setup real-time listeners for cross-device sync
        this.setupRealtimeListeners();

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
    },

    // Real-time listeners for cross-device sync with timestamp-based merging
    setupRealtimeListeners() {
        const db = getDb();
        if (!db) return;

        // Listen for inventory changes - merge by timestamp, handle deletions
        db.collection('inventory').onSnapshot((snapshot) => {
            // Handle deletions first
            const deletedKeys = new Set();
            snapshot.docChanges().forEach(change => {
                if (change.type === 'removed') {
                    deletedKeys.add(change.doc.id);
                }
            });

            // Remove deleted items from local state
            if (deletedKeys.size > 0) {
                deletedKeys.forEach(key => {
                    delete State.inventory[key];
                });
            }

            const remoteInventory = {};
            snapshot.forEach(doc => {
                remoteInventory[doc.id] = doc.data();
            });

            // Merge using timestamps - newer wins
            const mergedInventory = Storage.mergeInventoryByTimestamp(State.inventory, remoteInventory);

            // Check if anything changed
            if (JSON.stringify(mergedInventory) !== JSON.stringify(State.inventory)) {
                const hadChanges = Object.keys(mergedInventory).some(key => {
                    const merged = mergedInventory[key];
                    const current = State.inventory[key];
                    return !current || Storage.isNewer(merged.updatedAt, current.updatedAt);
                }) || deletedKeys.size > 0;

                if (hadChanges) {
                    State.inventory = mergedInventory;
                    Storage.setLocal(STORAGE_KEYS.inventory, State.inventory);
                    Storage.syncProductsWithInventory();

                    // Update UI if on relevant pages
                    if (DOM.hasClass(DOM.get('page-inventory'), 'active')) {
                        Inventory.renderStockList();
                    }
                    if (DOM.hasClass(DOM.get('page-sale'), 'active')) {
                        Sales.renderVariants();
                    }
                    Dashboard.render();
                    console.log('Inventory merged from remote (timestamp-based)');
                }
            }
        }, (error) => {
            console.log('Inventory listener error:', error);
        });

        // Listen for sales changes - merge by timestamp, handle deletions
        db.collection('sales').orderBy('date', 'desc').limit(500).onSnapshot((snapshot) => {
            // Handle deletions first
            const deletedIds = new Set();
            snapshot.docChanges().forEach(change => {
                if (change.type === 'removed') {
                    deletedIds.add(change.doc.id);
                }
            });

            // Remove deleted items from local state
            if (deletedIds.size > 0) {
                State.sales = State.sales.filter(s => !deletedIds.has(s.id));
            }

            const remoteSales = [];
            snapshot.forEach(doc => {
                remoteSales.push({ id: doc.id, ...doc.data() });
            });

            // Merge using timestamps
            const mergedSales = Storage.mergeByTimestamp(State.sales, remoteSales, 'id');
            // Sort by date desc
            mergedSales.sort((a, b) => {
                const dateA = a.createdAt || a.date + 'T' + a.time;
                const dateB = b.createdAt || b.date + 'T' + b.time;
                return new Date(dateB) - new Date(dateA);
            });

            if (JSON.stringify(mergedSales) !== JSON.stringify(State.sales)) {
                State.sales = mergedSales;
                Storage.setLocal(STORAGE_KEYS.sales, State.sales);
                Dashboard.render();
                if (DOM.hasClass(DOM.get('page-reports'), 'active')) {
                    Reports.loadDaily();
                }
                console.log('Sales merged from remote (timestamp-based)');
            }
        }, (error) => {
            console.log('Sales listener error:', error);
        });

        // Listen for customers changes - merge by timestamp, handle deletions
        db.collection('customers').onSnapshot((snapshot) => {
            // Handle deletions first
            const deletedIds = new Set();
            snapshot.docChanges().forEach(change => {
                if (change.type === 'removed') {
                    deletedIds.add(change.doc.id);
                }
            });

            // Remove deleted items from local state
            if (deletedIds.size > 0) {
                State.customers = State.customers.filter(c => !deletedIds.has(c.id) && !deletedIds.has(c.phone));
            }

            const remoteCustomers = [];
            snapshot.forEach(doc => {
                remoteCustomers.push({ id: doc.id, ...doc.data() });
            });

            // Merge using timestamps
            const mergedCustomers = Storage.mergeByTimestamp(State.customers, remoteCustomers, 'id');

            if (JSON.stringify(mergedCustomers) !== JSON.stringify(State.customers)) {
                State.customers = mergedCustomers;
                Storage.setLocal(STORAGE_KEYS.customers, State.customers);
                if (DOM.hasClass(DOM.get('page-customers'), 'active')) {
                    Customers.renderAll();
                }
                console.log('Customers merged from remote (timestamp-based)');
            }
        }, (error) => {
            console.log('Customers listener error:', error);
        });

        // Listen for bookings changes - merge by timestamp, handle deletions
        db.collection('bookings').orderBy('createdDate', 'desc').limit(500).onSnapshot((snapshot) => {
            // Handle deletions first
            const deletedIds = new Set();
            snapshot.docChanges().forEach(change => {
                if (change.type === 'removed') {
                    deletedIds.add(change.doc.id);
                }
            });

            // Remove deleted items from local state
            if (deletedIds.size > 0) {
                State.bookings = State.bookings.filter(b => !deletedIds.has(b.id));
            }

            const remoteBookings = [];
            snapshot.forEach(doc => {
                remoteBookings.push({ id: doc.id, ...doc.data() });
            });

            // Merge using timestamps
            const mergedBookings = Storage.mergeByTimestamp(State.bookings, remoteBookings, 'id');
            // Sort by createdAt desc
            mergedBookings.sort((a, b) => {
                const dateA = a.createdAt || a.createdDate + 'T' + a.createdTime;
                const dateB = b.createdAt || b.createdDate + 'T' + b.createdTime;
                return new Date(dateB) - new Date(dateA);
            });

            if (JSON.stringify(mergedBookings) !== JSON.stringify(State.bookings)) {
                State.bookings = mergedBookings;
                Storage.setLocal(STORAGE_KEYS.bookings, State.bookings);
                Dashboard.render();
                if (DOM.hasClass(DOM.get('page-bookings'), 'active')) {
                    Bookings.renderList();
                }
                console.log('Bookings merged from remote (timestamp-based)');
            }
        }, (error) => {
            console.log('Bookings listener error:', error);
        });

        // Listen for stock logs changes - merge by createdAt (immutable logs)
        db.collection('stockLogs').orderBy('date', 'desc').limit(500).onSnapshot((snapshot) => {
            const remoteStockLogs = [];
            snapshot.forEach(doc => {
                remoteStockLogs.push({ id: doc.id, ...doc.data() });
            });

            // For stock logs, just add any missing ones (they're immutable)
            const localIds = new Set(State.stockLogs.map(log => log.id));
            const newLogs = remoteStockLogs.filter(log => !localIds.has(log.id));

            if (newLogs.length > 0) {
                State.stockLogs = [...newLogs, ...State.stockLogs];
                // Sort by date desc
                State.stockLogs.sort((a, b) => {
                    const dateA = a.createdAt || a.date + 'T' + a.time;
                    const dateB = b.createdAt || b.date + 'T' + b.time;
                    return new Date(dateB) - new Date(dateA);
                });
                Storage.setLocal(STORAGE_KEYS.stockLogs, State.stockLogs);
                console.log(`Added ${newLogs.length} new stock logs from remote`);
            }
        }, (error) => {
            console.log('Stock logs listener error:', error);
        });

        // Listen for products collection changes - per-category sync
        db.collection('products').onSnapshot((snapshot) => {
            let hasChanges = false;

            snapshot.docChanges().forEach(change => {
                const category = change.doc.id;
                const data = change.doc.data();

                if (change.type === 'added' || change.type === 'modified') {
                    const remoteVariants = data.variants || [];
                    const localVariants = State.products[category] || [];

                    // Check if remote is newer or category doesn't exist locally
                    if (!State.products[category] ||
                        JSON.stringify(remoteVariants) !== JSON.stringify(localVariants)) {
                        State.products[category] = remoteVariants;
                        hasChanges = true;
                    }

                } else if (change.type === 'removed') {
                    if (State.products[category]) {
                        delete State.products[category];
                        hasChanges = true;
                    }
                }
            });

            if (hasChanges) {
                Storage.setLocal(STORAGE_KEYS.products, State.products);
                // Update UI
                Sales.renderCategories();
                Sales.renderVariants();
                Inventory.renderStockCategories();
                Inventory.renderStockVariants();
                Products.renderList();
                console.log('Products synced from remote (collection)');
            }
        }, (error) => {
            console.log('Products listener error:', error);
        });

        console.log('Real-time sync listeners active (timestamp-based merging)');
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
    Bookings,
    PinPad
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
