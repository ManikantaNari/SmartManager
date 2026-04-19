// Storage Service (LocalStorage + Firebase)

import { STORAGE_KEYS, getDb } from '../config/index.js';
import { State } from './state.js';

export const Storage = {
    // LocalStorage helpers
    getLocal(key, defaultVal = null) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultVal;
    },

    setLocal(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
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

    // Load products from localStorage only (Firebase sync happens via inventory)
    async loadProducts() {
        const saved = this.getLocal(STORAGE_KEYS.products);
        if (saved) State.products = saved;
        // Note: Missing categories are recovered from inventory via syncProductsWithInventory()
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

    // Save inventory item
    async saveInventoryItem(key, data) {
        this.setLocal(STORAGE_KEYS.inventory, State.inventory);
        const db = getDb();
        if (db) {
            try {
                await db.collection('inventory').doc(key).set(data);
            } catch (e) {
                console.log('Sync error:', e);
            }
        }
    },

    // Delete inventory item
    async deleteInventoryItem(key) {
        this.setLocal(STORAGE_KEYS.inventory, State.inventory);
        const db = getDb();
        if (db) {
            try {
                await db.collection('inventory').doc(key).delete();
            } catch (e) {
                console.log('Sync error:', e);
            }
        }
    },

    // Save customer
    async saveCustomer(customer) {
        this.setLocal(STORAGE_KEYS.customers, State.customers);
        const db = getDb();
        const docId = customer.phone || customer.id;
        if (db && docId) {
            try {
                await db.collection('customers').doc(docId).set(customer);
            } catch (e) {
                console.log('Sync error:', e);
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
                console.log('Sync error:', e);
            }
        }
    },

    // Save sale
    async saveSale(sale) {
        this.setLocal(STORAGE_KEYS.sales, State.sales);
        const db = getDb();
        if (db) {
            try {
                await db.collection('sales').doc(sale.id).set(sale);
            } catch (e) {
                console.log('Sync error:', e);
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
                console.log('Sync error:', e);
            }
        }
    },

    // Save admin PIN
    async savePin(pin) {
        State.adminPin = pin;
        this.setLocal(STORAGE_KEYS.adminPin, pin);
        const db = getDb();
        if (db) {
            try {
                await db.collection('settings').doc('adminPin').set({
                    pin: pin,
                    updatedAt: new Date().toISOString()
                });
            } catch (e) {
                console.log('Error saving PIN:', e);
            }
        }
    },

    // Save products catalog (localStorage + Firebase)
    saveProducts() {
        this.setLocal(STORAGE_KEYS.products, State.products);
        this.saveProductsToFirebase();
    },

    // Save products to Firebase for cross-device sync (non-blocking)
    saveProductsToFirebase() {
        const db = getDb();
        if (!db) return;

        db.collection('settings').doc('products').set({
            catalog: State.products,
            updatedAt: new Date().toISOString()
        }).catch(e => console.log('Products sync error:', e.message));
    },

    // Save stock log entry
    async saveStockLog(log) {
        this.setLocal(STORAGE_KEYS.stockLogs, State.stockLogs);
        const db = getDb();
        if (db) {
            try {
                await db.collection('stockLogs').doc(log.id).set(log);
            } catch (e) {
                console.log('Sync error:', e);
            }
        }
    },

    // Save booking
    async saveBooking(booking) {
        this.setLocal(STORAGE_KEYS.bookings, State.bookings);
        const db = getDb();
        if (db) {
            try {
                await db.collection('bookings').doc(booking.id).set(booking);
            } catch (e) {
                console.log('Sync error:', e);
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
                console.log('Sync error:', e);
            }
        }
    }
};
