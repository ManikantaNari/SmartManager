// Storage Service (LocalStorage + Firebase)
// Uses timestamp-based conflict resolution for automatic sync

import { STORAGE_KEYS, getDb } from '../config/index.js';
import { DateUtil } from '../utils/date.js';
import { State } from './state.js';

export const Storage = {
    // Track sync errors
    syncErrors: [],
    lastSyncTime: null,

    // LocalStorage helpers
    getLocal(key, defaultVal = null) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultVal;
    },

    setLocal(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    // Generate current timestamp
    now() {
        return DateUtil.now();
    },

    // Compare timestamps - returns true if time1 is newer than time2
    isNewer(time1, time2) {
        if (!time1) return false;
        if (!time2) return true;
        return new Date(time1).getTime() > new Date(time2).getTime();
    },

    // Log sync error
    logSyncError(collection, error) {
        const errorMsg = `${collection}: ${error.message || error}`;
        console.error('Firebase sync error -', errorMsg);
        this.syncErrors.push({
            collection,
            error: error.message || String(error),
            time: this.now()
        });
        // Keep only last 20 errors
        if (this.syncErrors.length > 20) {
            this.syncErrors.shift();
        }
    },

    // Check Firebase connectivity
    async checkFirebaseConnection() {
        const db = getDb();
        if (!db) {
            return { connected: false, error: 'Firebase not initialized' };
        }
        try {
            // Try to read a simple document
            await db.collection('settings').doc('_ping').set({
                lastPing: this.now(),
                device: navigator.userAgent.substring(0, 50)
            });
            this.lastSyncTime = this.now();
            return { connected: true, lastSync: this.lastSyncTime };
        } catch (e) {
            return { connected: false, error: e.message };
        }
    },

    // Get sync status for debugging
    getSyncStatus() {
        return {
            lastSyncTime: this.lastSyncTime,
            errors: this.syncErrors,
            dbInitialized: !!getDb(),
            collections: {
                inventory: Object.keys(State.inventory).length,
                customers: State.customers.length,
                sales: State.sales.length,
                bookings: State.bookings.length,
                stockLogs: State.stockLogs.length,
                products: Object.keys(State.products).length
            }
        };
    },

    // Load all data on startup
    async loadAll() {
        await this.loadProducts();
        await this.loadInventory();
        this.syncProductsWithInventory();
        await this.loadCustomers();
        await this.loadSales();
        await this.loadStockLogs();
        await this.loadBookings();
        await this.loadPin();
    },

    // Load products from Firebase (separate collection) with localStorage fallback
    async loadProducts() {
        const db = getDb();
        if (!db) {
            const saved = this.getLocal(STORAGE_KEYS.products);
            if (saved) State.products = saved;
            const savedEmojis = this.getLocal('sm_category_emojis');
            if (savedEmojis) State.categoryEmojis = savedEmojis;
            return;
        }
        try {
            const snapshot = await db.collection('products').get();
            if (!snapshot.empty) {
                State.products = {};
                State.categoryEmojis = {};
                snapshot.forEach(doc => {
                    const data = doc.data();
                    State.products[doc.id] = data.variants || [];
                    // Load emoji if exists
                    if (data.emoji) {
                        State.categoryEmojis[doc.id] = data.emoji;
                    }
                });
                this.setLocal(STORAGE_KEYS.products, State.products);
                this.setLocal('sm_category_emojis', State.categoryEmojis);
            } else {
                // Try migrating from old settings/products format
                const oldDoc = await db.collection('settings').doc('products').get();
                if (oldDoc.exists && oldDoc.data().catalog) {
                    State.products = oldDoc.data().catalog;
                    // Migrate to new format
                    await this.migrateProductsToCollection();
                } else {
                    // Fallback to localStorage
                    const saved = this.getLocal(STORAGE_KEYS.products);
                    if (saved) State.products = saved;
                    const savedEmojis = this.getLocal('sm_category_emojis');
                    if (savedEmojis) State.categoryEmojis = savedEmojis;
                }
            }
        } catch (e) {
            console.log('Error loading products:', e);
            const saved = this.getLocal(STORAGE_KEYS.products);
            if (saved) State.products = saved;
            const savedEmojis = this.getLocal('sm_category_emojis');
            if (savedEmojis) State.categoryEmojis = savedEmojis;
        }
        // Note: Missing categories are recovered from inventory via syncProductsWithInventory()
    },

    // Migrate products from old settings/products format to new collection
    async migrateProductsToCollection() {
        const db = getDb();
        if (!db || !State.products) return;

        console.log('Migrating products to new collection format...');
        const batch = db.batch();
        const timestamp = this.now();

        for (const [category, variants] of Object.entries(State.products)) {
            const docRef = db.collection('products').doc(category);
            batch.set(docRef, {
                variants: variants,
                updatedAt: timestamp
            });
        }

        try {
            await batch.commit();
            // Delete old format
            await db.collection('settings').doc('products').delete();
            console.log('Products migration complete');
        } catch (e) {
            console.log('Products migration error:', e);
        }
    },

    // Sync products with inventory - extract missing categories/variants from inventory
    syncProductsWithInventory() {
        let updated = false;
        for (const key of Object.keys(State.inventory)) {
            const [category, variant] = key.split('|');
            if (!category || !variant) continue;

            // Add category if missing
            if (!State.products[category]) {
                State.products[category] = [];
                updated = true;
            }

            // Add variant if missing
            if (!State.products[category].includes(variant)) {
                State.products[category].push(variant);
                updated = true;
            }
        }

        if (updated) {
            this.setLocal(STORAGE_KEYS.products, State.products);
            this.saveProductsToFirebase();
        }
    },

    // Load inventory from Firebase with localStorage fallback
    async loadInventory() {
        const db = getDb();
        if (!db) {
            State.inventory = this.getLocal(STORAGE_KEYS.inventory, {});
            return;
        }
        try {
            const snapshot = await db.collection('inventory').get();
            State.inventory = {};
            snapshot.forEach(doc => {
                State.inventory[doc.id] = doc.data();
            });
            this.setLocal(STORAGE_KEYS.inventory, State.inventory);
        } catch (e) {
            State.inventory = this.getLocal(STORAGE_KEYS.inventory, {});
        }
    },

    // Load customers from Firebase with localStorage fallback
    async loadCustomers() {
        const db = getDb();
        if (!db) {
            State.customers = this.getLocal(STORAGE_KEYS.customers, []);
            // Backfill id for old customers without it
            this.backfillCustomerIds();
            return;
        }
        try {
            const snapshot = await db.collection('customers').get();
            State.customers = [];
            snapshot.forEach(doc => {
                State.customers.push({ id: doc.id, ...doc.data() });
            });
            this.setLocal(STORAGE_KEYS.customers, State.customers);
        } catch (e) {
            State.customers = this.getLocal(STORAGE_KEYS.customers, []);
            this.backfillCustomerIds();
        }
    },

    // Backfill id field for old customers (backward compatibility)
    backfillCustomerIds() {
        let updated = false;
        State.customers.forEach(c => {
            if (!c.id) {
                c.id = c.phone || ('cust_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4));
                updated = true;
            }
        });
        if (updated) {
            this.setLocal(STORAGE_KEYS.customers, State.customers);
        }
    },

    // Load sales from Firebase with localStorage fallback
    async loadSales() {
        const db = getDb();
        if (!db) {
            State.sales = this.getLocal(STORAGE_KEYS.sales, []);
            return;
        }
        try {
            const snapshot = await db.collection('sales').orderBy('date', 'desc').limit(500).get();
            State.sales = [];
            snapshot.forEach(doc => {
                State.sales.push({ id: doc.id, ...doc.data() });
            });
            this.setLocal(STORAGE_KEYS.sales, State.sales);
        } catch (e) {
            State.sales = this.getLocal(STORAGE_KEYS.sales, []);
        }
    },

    // Load stock logs from Firebase with localStorage fallback
    async loadStockLogs() {
        const db = getDb();
        if (!db) {
            State.stockLogs = this.getLocal(STORAGE_KEYS.stockLogs, []);
            return;
        }
        try {
            const snapshot = await db.collection('stockLogs').orderBy('date', 'desc').limit(500).get();
            State.stockLogs = [];
            snapshot.forEach(doc => {
                State.stockLogs.push({ id: doc.id, ...doc.data() });
            });
            this.setLocal(STORAGE_KEYS.stockLogs, State.stockLogs);
        } catch (e) {
            State.stockLogs = this.getLocal(STORAGE_KEYS.stockLogs, []);
        }
    },

    // Load bookings from Firebase with localStorage fallback
    async loadBookings() {
        const db = getDb();
        if (!db) {
            State.bookings = this.getLocal(STORAGE_KEYS.bookings, []);
            return;
        }
        try {
            const snapshot = await db.collection('bookings').orderBy('createdDate', 'desc').limit(500).get();
            State.bookings = [];
            snapshot.forEach(doc => {
                State.bookings.push({ id: doc.id, ...doc.data() });
            });
            this.setLocal(STORAGE_KEYS.bookings, State.bookings);
        } catch (e) {
            State.bookings = this.getLocal(STORAGE_KEYS.bookings, []);
        }
    },

    // Load admin PIN
    async loadPin() {
        const localPin = this.getLocal(STORAGE_KEYS.adminPin);
        if (localPin) State.adminPin = localPin;

        const db = getDb();
        if (!db) return;
        try {
            const doc = await db.collection('settings').doc('adminPin').get();
            if (doc.exists && doc.data().pin) {
                State.adminPin = doc.data().pin;
                this.setLocal(STORAGE_KEYS.adminPin, State.adminPin);
            }
        } catch (e) {
            console.log('Error loading PIN:', e);
        }
    },

    // Save inventory item with timestamp
    async saveInventoryItem(key, data) {
        // Add timestamp to local data
        const timestamp = this.now();
        data.updatedAt = timestamp;
        State.inventory[key] = data;
        this.setLocal(STORAGE_KEYS.inventory, State.inventory);

        const db = getDb();
        if (db) {
            try {
                await db.collection('inventory').doc(key).set(data);
                this.lastSyncTime = timestamp;
            } catch (e) {
                this.logSyncError('inventory', e);
            }
        }
    },

    // Update inventory quantity using transaction (atomic operation for concurrent updates)
    async updateInventoryQty(key, qtyDelta, updateData = null) {
        const timestamp = this.now();

        // Update local state first
        if (!State.inventory[key]) {
            State.inventory[key] = { qty: 0, costPrice: 0, price: 0, alertQty: 0 };
        }
        State.inventory[key].qty = Math.max(0, (State.inventory[key].qty || 0) + qtyDelta);
        if (updateData) {
            Object.assign(State.inventory[key], updateData);
        }
        State.inventory[key].updatedAt = timestamp;
        this.setLocal(STORAGE_KEYS.inventory, State.inventory);

        const db = getDb();
        if (!db) return;

        try {
            // Use Firebase transaction for atomic quantity update
            const docRef = db.collection('inventory').doc(key);
            await db.runTransaction(async (transaction) => {
                const doc = await transaction.get(docRef);
                const current = doc.exists ? doc.data() : { qty: 0, costPrice: 0, price: 0, alertQty: 0 };

                const newData = {
                    qty: Math.max(0, (current.qty || 0) + qtyDelta),
                    costPrice: updateData?.costPrice ?? current.costPrice ?? 0,
                    price: updateData?.price ?? current.price ?? 0,
                    alertQty: updateData?.alertQty ?? current.alertQty ?? 0,
                    updatedAt: timestamp
                };

                transaction.set(docRef, newData);
            });
            this.lastSyncTime = timestamp;
        } catch (e) {
            this.logSyncError('inventory', e);
        }
    },

    // Delete inventory item
    async deleteInventoryItem(key) {
        delete State.inventory[key];
        this.setLocal(STORAGE_KEYS.inventory, State.inventory);
        const db = getDb();
        if (db) {
            try {
                await db.collection('inventory').doc(key).delete();
            } catch (e) {
                this.logSyncError('inventory', e);
            }
        }
    },

    // Save customer with timestamp
    async saveCustomer(customer) {
        const timestamp = this.now();
        customer.updatedAt = timestamp;
        if (!customer.createdAt) {
            customer.createdAt = timestamp;
        }
        this.setLocal(STORAGE_KEYS.customers, State.customers);

        const db = getDb();
        const docId = customer.phone || customer.id;
        if (db && docId) {
            try {
                await db.collection('customers').doc(docId).set(customer);
                this.lastSyncTime = timestamp;
            } catch (e) {
                this.logSyncError('customers', e);
            }
        }
    },

    // Delete customer (accepts phone or id)
    async deleteCustomer(phoneOrId) {
        this.setLocal(STORAGE_KEYS.customers, State.customers);
        const db = getDb();
        if (db && phoneOrId) {
            try {
                await db.collection('customers').doc(phoneOrId).delete();
            } catch (e) {
                this.logSyncError('customers', e);
            }
        }
    },

    // Save sale with timestamp
    async saveSale(sale) {
        const timestamp = this.now();
        sale.updatedAt = timestamp;
        if (!sale.createdAt) {
            sale.createdAt = timestamp;
        }
        this.setLocal(STORAGE_KEYS.sales, State.sales);

        const db = getDb();
        if (db) {
            try {
                await db.collection('sales').doc(sale.id).set(sale);
                this.lastSyncTime = timestamp;
            } catch (e) {
                this.logSyncError('sales', e);
            }
        }
    },

    // Delete sale
    async deleteSale(saleId) {
        this.setLocal(STORAGE_KEYS.sales, State.sales);
        const db = getDb();
        if (db) {
            try {
                await db.collection('sales').doc(saleId).delete();
            } catch (e) {
                this.logSyncError('sales', e);
            }
        }
    },

    // Save admin PIN
    async savePin(pin) {
        const timestamp = this.now();
        State.adminPin = pin;
        this.setLocal(STORAGE_KEYS.adminPin, pin);
        const db = getDb();
        if (db) {
            try {
                await db.collection('settings').doc('adminPin').set({
                    pin: pin,
                    updatedAt: timestamp
                });
                this.lastSyncTime = timestamp;
            } catch (e) {
                this.logSyncError('settings', e);
            }
        }
    },

    // Save products catalog (localStorage + Firebase) with timestamp
    saveProducts() {
        this.setLocal(STORAGE_KEYS.products, State.products);
        this.saveProductsToFirebase();
    },

    // Save a single category to Firebase (with optional emoji)
    async saveProductCategory(category, variants, emoji = null) {
        // Save emoji to local state
        if (emoji) {
            State.categoryEmojis[category] = emoji;
            this.setLocal('sm_category_emojis', State.categoryEmojis);
        }

        const db = getDb();
        if (!db) return;

        const timestamp = this.now();
        const docData = {
            variants: variants,
            updatedAt: timestamp
        };
        // Include emoji if provided or exists
        const categoryEmoji = emoji || State.categoryEmojis[category];
        if (categoryEmoji) {
            docData.emoji = categoryEmoji;
        }

        try {
            await db.collection('products').doc(category).set(docData);
            this.lastSyncTime = timestamp;
        } catch (e) {
            this.logSyncError('products', e);
        }
    },

    // Delete a category from Firebase
    async deleteProductCategory(category) {
        // Remove emoji from local state
        if (State.categoryEmojis[category]) {
            delete State.categoryEmojis[category];
            this.setLocal('sm_category_emojis', State.categoryEmojis);
        }

        const db = getDb();
        if (!db) return;

        try {
            await db.collection('products').doc(category).delete();
        } catch (e) {
            this.logSyncError('products', e);
        }
    },

    // Save all products to Firebase (for bulk operations)
    saveProductsToFirebase() {
        const db = getDb();
        if (!db) return;

        const timestamp = this.now();

        // Save each category as a separate document (with emoji if exists)
        Object.entries(State.products).forEach(([category, variants]) => {
            const docData = {
                variants: variants,
                updatedAt: timestamp
            };
            // Include emoji if exists
            if (State.categoryEmojis[category]) {
                docData.emoji = State.categoryEmojis[category];
            }
            db.collection('products').doc(category).set(docData)
                .catch(e => this.logSyncError('products', e));
        });

        this.lastSyncTime = timestamp;
    },

    // Save stock log entry with timestamp (immutable - only createdAt)
    async saveStockLog(log) {
        const timestamp = this.now();
        if (!log.createdAt) {
            log.createdAt = timestamp;
        }
        this.setLocal(STORAGE_KEYS.stockLogs, State.stockLogs);

        const db = getDb();
        if (db) {
            try {
                await db.collection('stockLogs').doc(log.id).set(log);
                this.lastSyncTime = timestamp;
            } catch (e) {
                this.logSyncError('stockLogs', e);
            }
        }
    },

    // Save booking with timestamp
    async saveBooking(booking) {
        const timestamp = this.now();
        booking.updatedAt = timestamp;
        if (!booking.createdAt) {
            booking.createdAt = timestamp;
        }
        this.setLocal(STORAGE_KEYS.bookings, State.bookings);

        const db = getDb();
        if (db) {
            try {
                await db.collection('bookings').doc(booking.id).set(booking);
                this.lastSyncTime = timestamp;
            } catch (e) {
                this.logSyncError('bookings', e);
            }
        }
    },

    // Delete booking
    async deleteBooking(bookingId) {
        this.setLocal(STORAGE_KEYS.bookings, State.bookings);
        const db = getDb();
        if (db) {
            try {
                await db.collection('bookings').doc(bookingId).delete();
            } catch (e) {
                this.logSyncError('bookings', e);
            }
        }
    },

    // Merge remote data with local data using timestamps
    // Returns merged array with newer records taking precedence
    mergeByTimestamp(localArray, remoteArray, idField = 'id') {
        const merged = new Map();

        // Add all local items
        localArray.forEach(item => {
            merged.set(item[idField], item);
        });

        // Merge remote items - newer wins
        remoteArray.forEach(remoteItem => {
            const id = remoteItem[idField];
            const localItem = merged.get(id);

            if (!localItem) {
                // New item from remote - add it
                merged.set(id, remoteItem);
            } else if (this.isNewer(remoteItem.updatedAt, localItem.updatedAt)) {
                // Remote is newer - use it
                merged.set(id, remoteItem);
            }
            // If local is newer or equal, keep local (already in map)
        });

        return Array.from(merged.values());
    },

    // Merge remote inventory with local inventory using timestamps
    mergeInventoryByTimestamp(localInventory, remoteInventory) {
        const merged = { ...localInventory };

        Object.keys(remoteInventory).forEach(key => {
            const remoteItem = remoteInventory[key];
            const localItem = merged[key];

            if (!localItem) {
                // New item from remote
                merged[key] = remoteItem;
            } else if (this.isNewer(remoteItem.updatedAt, localItem.updatedAt)) {
                // Remote is newer
                merged[key] = remoteItem;
            }
            // If local is newer or equal, keep local
        });

        return merged;
    }
};
