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
        await this.loadCustomers();
        await this.loadSales();
        await this.loadStockLogs();
        await this.loadPin();
    },

    // Load products from localStorage
    async loadProducts() {
        const saved = this.getLocal(STORAGE_KEYS.products);
        if (saved) State.products = saved;
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

    // Save customer
    async saveCustomer(customer) {
        this.setLocal(STORAGE_KEYS.customers, State.customers);
        const db = getDb();
        if (db && customer.phone) {
            try {
                await db.collection('customers').doc(customer.phone).set(customer);
            } catch (e) {
                console.log('Sync error:', e);
            }
        }
    },

    // Delete customer
    async deleteCustomer(phone) {
        this.setLocal(STORAGE_KEYS.customers, State.customers);
        const db = getDb();
        if (db) {
            try {
                await db.collection('customers').doc(phone).delete();
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

    // Save products catalog
    saveProducts() {
        this.setLocal(STORAGE_KEYS.products, State.products);
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
    }
};
