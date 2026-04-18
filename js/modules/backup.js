// Backup Module

import { STORAGE_KEYS, getDb } from '../config';
import { Format, Toast } from '../utils';
import { State, Storage } from '../state';

export const Backup = {
    download() {
        const backup = {
            version: 1,
            date: new Date().toISOString(),
            products: State.products,
            inventory: State.inventory,
            customers: State.customers,
            sales: State.sales,
            adminPin: State.adminPin
        };

        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `manikanta-enterprises-backup-${Format.today()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        Storage.setLocal(STORAGE_KEYS.lastBackup, new Date().toISOString());
        Toast.show('Backup downloaded');
    },

    async restore(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const backup = JSON.parse(e.target.result);
                if (!backup.version) {
                    Toast.show('Invalid backup file');
                    return;
                }

                State.products = backup.products || State.products;
                State.inventory = backup.inventory || {};
                State.customers = backup.customers || [];
                State.sales = backup.sales || [];
                State.adminPin = backup.adminPin || '11111';

                Storage.saveProducts();
                Storage.setLocal(STORAGE_KEYS.inventory, State.inventory);
                Storage.setLocal(STORAGE_KEYS.customers, State.customers);
                Storage.setLocal(STORAGE_KEYS.sales, State.sales);
                Storage.savePin(State.adminPin);

                // Sync to Firebase
                const db = getDb();
                if (db) {
                    for (const [key, data] of Object.entries(State.inventory)) {
                        await db.collection('inventory').doc(key).set(data);
                    }
                    for (const customer of State.customers) {
                        await db.collection('customers').add(customer);
                    }
                    for (const sale of State.sales) {
                        await db.collection('sales').doc(sale.id).set(sale);
                    }
                }

                Toast.show('Backup restored successfully');
                location.reload();
            } catch (e) {
                Toast.show('Error reading backup file');
            }
        };
        reader.readAsText(file);
    },

    checkReminder() {
        const lastBackup = Storage.getLocal(STORAGE_KEYS.lastBackup);
        if (!lastBackup) return;

        const days = Math.floor((Date.now() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24));
        if (days >= 7) {
            setTimeout(() => {
                if (confirm(`It's been ${days} days since your last backup. Would you like to backup now?`)) {
                    this.download();
                }
            }, 3000);
        }
    }
};
