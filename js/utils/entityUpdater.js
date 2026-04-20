// Entity Updater Utility
// Centralized logic for updating categories/variants across all entities

import { State, Storage } from '../state/index.js';
import { STORAGE_KEYS } from '../config/index.js';

/**
 * EntityUpdater handles complex cross-entity updates
 * Used when renaming/deleting categories or variants
 * Ensures data consistency across inventory, sales, bookings, and stock logs
 */
export const EntityUpdater = {
    /**
     * Rename a category across all entities
     * Returns object describing all updates to be made
     * @param {string} oldName - Current category name
     * @param {string} newName - New category name
     * @returns {Object} Updates object with inventory, sales, bookings, stockLogs arrays
     */
    planCategoryRename(oldName, newName) {
        const updates = {
            inventory: [],
            sales: [],
            bookings: [],
            stockLogs: []
        };

        // 1. Collect inventory updates
        Object.keys(State.inventory).forEach(key => {
            if (key.startsWith(oldName + '|')) {
                const variant = key.split('|')[1];
                const newKey = `${newName}|${variant}`;
                updates.inventory.push({
                    oldKey: key,
                    newKey,
                    data: State.inventory[key]
                });
            }
        });

        // 2. Collect sales updates
        State.sales.forEach(sale => {
            let hasUpdate = false;
            sale.items?.forEach(item => {
                if (item.category === oldName) {
                    hasUpdate = true;
                }
            });
            if (hasUpdate) {
                updates.sales.push(sale);
            }
        });

        // 3. Collect booking updates
        State.bookings.forEach(booking => {
            let hasUpdate = false;
            booking.items?.forEach(item => {
                if (item.category === oldName) {
                    hasUpdate = true;
                }
            });
            if (hasUpdate) {
                updates.bookings.push(booking);
            }
        });

        // 4. Collect stock log updates
        State.stockLogs.forEach(log => {
            let hasUpdate = false;
            log.items?.forEach(item => {
                if (item.category === oldName) {
                    hasUpdate = true;
                }
            });
            if (hasUpdate) {
                updates.stockLogs.push(log);
            }
        });

        return updates;
    },

    /**
     * Apply category rename to all entities
     * @param {string} oldName - Old category name
     * @param {string} newName - New category name
     * @param {Object} updates - Updates object from planCategoryRename()
     */
    applyCategoryRename(oldName, newName, updates) {
        // 1. Update inventory keys
        updates.inventory.forEach(({ oldKey, newKey, data }) => {
            delete State.inventory[oldKey];
            State.inventory[newKey] = data;
            Storage.deleteInventoryItem(oldKey);
            Storage.saveInventoryItem(newKey, data);
        });
        if (updates.inventory.length > 0) {
            Storage.setLocal(STORAGE_KEYS.inventory, State.inventory);
        }

        // 2. Update sales items
        updates.sales.forEach(sale => {
            sale.items?.forEach(item => {
                if (item.category === oldName) {
                    item.category = newName;
                    if (item.key) {
                        item.key = `${newName}|${item.variant}`;
                    }
                }
            });
            Storage.saveSale(sale);
        });
        if (updates.sales.length > 0) {
            Storage.setLocal(STORAGE_KEYS.sales, State.sales);
        }

        // 3. Update booking items
        updates.bookings.forEach(booking => {
            booking.items?.forEach(item => {
                if (item.category === oldName) {
                    item.category = newName;
                    if (item.key) {
                        item.key = `${newName}|${item.variant}`;
                    }
                }
            });
            Storage.saveBooking(booking);
        });
        if (updates.bookings.length > 0) {
            Storage.setLocal(STORAGE_KEYS.bookings, State.bookings);
        }

        // 4. Update stock log items
        updates.stockLogs.forEach(log => {
            log.items?.forEach(item => {
                if (item.category === oldName) {
                    item.category = newName;
                    if (item.key) {
                        item.key = `${newName}|${item.variant}`;
                    }
                }
            });
            Storage.saveStockLog(log);
        });
        if (updates.stockLogs.length > 0) {
            Storage.setLocal(STORAGE_KEYS.stockLogs, State.stockLogs);
        }

        console.log(`Category renamed: ${oldName} → ${newName}`, {
            inventory: updates.inventory.length,
            sales: updates.sales.length,
            bookings: updates.bookings.length,
            stockLogs: updates.stockLogs.length
        });
    },

    /**
     * Rename a variant across all entities
     * Returns object describing all updates to be made
     * @param {string} category - Category name
     * @param {string} oldVariant - Current variant name
     * @param {string} newVariant - New variant name
     * @returns {Object} Updates object
     */
    planVariantRename(category, oldVariant, newVariant) {
        const updates = {
            inventory: null,
            sales: [],
            bookings: [],
            stockLogs: []
        };

        const oldKey = `${category}|${oldVariant}`;
        const newKey = `${category}|${newVariant}`;

        // 1. Inventory update
        if (State.inventory[oldKey]) {
            updates.inventory = {
                oldKey,
                newKey,
                data: State.inventory[oldKey]
            };
        }

        // 2. Sales updates
        State.sales.forEach(sale => {
            let hasUpdate = false;
            sale.items?.forEach(item => {
                if (item.category === category && item.variant === oldVariant) {
                    hasUpdate = true;
                }
            });
            if (hasUpdate) {
                updates.sales.push(sale);
            }
        });

        // 3. Booking updates
        State.bookings.forEach(booking => {
            let hasUpdate = false;
            booking.items?.forEach(item => {
                if (item.category === category && item.variant === oldVariant) {
                    hasUpdate = true;
                }
            });
            if (hasUpdate) {
                updates.bookings.push(booking);
            }
        });

        // 4. Stock log updates
        State.stockLogs.forEach(log => {
            let hasUpdate = false;
            log.items?.forEach(item => {
                if (item.category === category && item.variant === oldVariant) {
                    hasUpdate = true;
                }
            });
            if (hasUpdate) {
                updates.stockLogs.push(log);
            }
        });

        return updates;
    },

    /**
     * Apply variant rename to all entities
     * @param {string} category - Category name
     * @param {string} oldVariant - Old variant name
     * @param {string} newVariant - New variant name
     * @param {Object} updates - Updates object from planVariantRename()
     */
    applyVariantRename(category, oldVariant, newVariant, updates) {
        const newKey = `${category}|${newVariant}`;

        // 1. Update inventory
        if (updates.inventory) {
            const { oldKey, data } = updates.inventory;
            delete State.inventory[oldKey];
            State.inventory[newKey] = data;
            Storage.deleteInventoryItem(oldKey);
            Storage.saveInventoryItem(newKey, data);
            Storage.setLocal(STORAGE_KEYS.inventory, State.inventory);
        }

        // 2. Update sales items
        updates.sales.forEach(sale => {
            sale.items?.forEach(item => {
                if (item.category === category && item.variant === oldVariant) {
                    item.variant = newVariant;
                    item.key = newKey;
                }
            });
            Storage.saveSale(sale);
        });
        if (updates.sales.length > 0) {
            Storage.setLocal(STORAGE_KEYS.sales, State.sales);
        }

        // 3. Update booking items
        updates.bookings.forEach(booking => {
            booking.items?.forEach(item => {
                if (item.category === category && item.variant === oldVariant) {
                    item.variant = newVariant;
                    item.key = newKey;
                }
            });
            Storage.saveBooking(booking);
        });
        if (updates.bookings.length > 0) {
            Storage.setLocal(STORAGE_KEYS.bookings, State.bookings);
        }

        // 4. Update stock log items
        updates.stockLogs.forEach(log => {
            log.items?.forEach(item => {
                if (item.category === category && item.variant === oldVariant) {
                    item.variant = newVariant;
                    item.key = newKey;
                }
            });
            Storage.saveStockLog(log);
        });
        if (updates.stockLogs.length > 0) {
            Storage.setLocal(STORAGE_KEYS.stockLogs, State.stockLogs);
        }

        console.log(`Variant renamed: ${category}|${oldVariant} → ${newVariant}`, {
            inventory: updates.inventory ? 1 : 0,
            sales: updates.sales.length,
            bookings: updates.bookings.length,
            stockLogs: updates.stockLogs.length
        });
    },

    /**
     * Delete a category and all its data
     * @param {string} category - Category to delete
     * @returns {Object} Deletion summary
     */
    deleteCategory(category) {
        const summary = {
            inventoryDeleted: 0,
            variantsRemoved: 0
        };

        // 1. Delete all inventory items for this category
        const keysToDelete = Object.keys(State.inventory).filter(key =>
            key.startsWith(category + '|')
        );

        keysToDelete.forEach(key => {
            delete State.inventory[key];
            Storage.deleteInventoryItem(key);
            summary.inventoryDeleted++;
        });

        if (keysToDelete.length > 0) {
            Storage.setLocal(STORAGE_KEYS.inventory, State.inventory);
        }

        // 2. Delete from products
        summary.variantsRemoved = State.products[category]?.length || 0;
        delete State.products[category];
        Storage.setLocal(STORAGE_KEYS.products, State.products);
        Storage.deleteProductCategory(category);

        console.log(`Category deleted: ${category}`, summary);
        return summary;
    },

    /**
     * Delete a variant and its data
     * @param {string} category - Category name
     * @param {string} variant - Variant to delete
     * @returns {Object} Deletion summary
     */
    deleteVariant(category, variant) {
        const summary = {
            inventoryDeleted: false
        };

        const key = `${category}|${variant}`;

        // 1. Delete inventory item
        if (State.inventory[key]) {
            delete State.inventory[key];
            Storage.deleteInventoryItem(key);
            Storage.setLocal(STORAGE_KEYS.inventory, State.inventory);
            summary.inventoryDeleted = true;
        }

        // 2. Remove from products
        const variantIndex = State.products[category]?.indexOf(variant);
        if (variantIndex > -1) {
            State.products[category].splice(variantIndex, 1);
            Storage.setLocal(STORAGE_KEYS.products, State.products);
            Storage.saveProductCategory(category, State.products[category]);
        }

        console.log(`Variant deleted: ${key}`, summary);
        return summary;
    },

    /**
     * Check if category has any stock
     * Used to prevent deletion of categories with inventory
     * @param {string} category - Category name
     * @returns {{totalQty: number, variantCount: number}}
     */
    getCategoryStock(category) {
        let totalQty = 0;
        let variantCount = 0;

        Object.keys(State.inventory).forEach(key => {
            if (key.startsWith(category + '|')) {
                const qty = State.inventory[key]?.qty || 0;
                if (qty > 0) {
                    totalQty += qty;
                    variantCount++;
                }
            }
        });

        return { totalQty, variantCount };
    },

    /**
     * Check if variant has any stock
     * Used to prevent deletion of variants with inventory
     * @param {string} category - Category name
     * @param {string} variant - Variant name
     * @returns {number} Stock quantity
     */
    getVariantStock(category, variant) {
        const key = `${category}|${variant}`;
        return State.inventory[key]?.qty || 0;
    }
};
