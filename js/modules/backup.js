// Backup & Settings Module

import { STORAGE_KEYS, getDb } from '../config/index.js';
import { Format, DateUtil, Toast, i18n, Keyboard } from '../utils/index.js';
import { State, Storage } from '../state/index.js';

export const Backup = {
    inventoryValueTimer: null,

    download() {
        const backup = {
            version: 2,
            date: DateUtil.now(),
            products: State.products,
            categoryEmojis: State.categoryEmojis,
            inventory: State.inventory,
            customers: State.customers,
            sales: State.sales,
            stockLogs: State.stockLogs,
            bookings: State.bookings,
            adminPin: State.adminPin
        };

        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `manikanta-enterprises-backup-${Format.today()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        Storage.setLocal(STORAGE_KEYS.lastBackup, DateUtil.now());
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
                State.categoryEmojis = backup.categoryEmojis || {};
                State.inventory = backup.inventory || {};
                State.customers = backup.customers || [];
                State.sales = backup.sales || [];
                State.stockLogs = backup.stockLogs || [];
                State.bookings = backup.bookings || [];
                State.adminPin = backup.adminPin || '11111';

                Storage.saveProducts();
                Storage.setLocal('sm_category_emojis', State.categoryEmojis);
                Storage.setLocal(STORAGE_KEYS.inventory, State.inventory);
                Storage.setLocal(STORAGE_KEYS.customers, State.customers);
                Storage.setLocal(STORAGE_KEYS.sales, State.sales);
                Storage.setLocal(STORAGE_KEYS.stockLogs, State.stockLogs);
                Storage.setLocal(STORAGE_KEYS.bookings, State.bookings);
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
                    for (const log of State.stockLogs) {
                        await db.collection('stockLogs').doc(log.id).set(log);
                    }
                    for (const booking of State.bookings) {
                        await db.collection('bookings').doc(booking.id).set(booking);
                    }
                    for (const [category, variants] of Object.entries(State.products)) {
                        const emoji = State.categoryEmojis[category];
                        const docData = { variants, updatedAt: new Date().toISOString() };
                        if (emoji) docData.emoji = emoji;
                        await db.collection('products').doc(category).set(docData);
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
    },

    // Language management
    changeLanguage(langCode) {
        // Validate language code
        if (!i18n.hasLocale(langCode)) {
            Toast.show('Language not supported');
            return;
        }

        // Set the new language
        i18n.setLocale(langCode);

        // Update UI to show active language
        this.updateLanguageUI(langCode);

        // Update translations immediately
        this.updateTranslations();

        // Announce change to screen readers
        const langNames = {
            en: 'English',
            te: 'Telugu',
            hi: 'Hindi'
        };
        Keyboard.announce(`Language changed to ${langNames[langCode]}`);

        // Show confirmation
        Toast.show(`Language changed to ${langNames[langCode]}`);
    },

    updateLanguageUI(selectedLang) {
        // Remove active class from all options
        document.querySelectorAll('.language-option').forEach(option => {
            option.classList.remove('active');
        });

        // Add active class to selected option
        const selectedOption = document.querySelector(`.language-option[data-lang="${selectedLang}"]`);
        if (selectedOption) {
            selectedOption.classList.add('active');
        }
    },

    initLanguage() {
        // Load saved language preference
        i18n.loadSavedLocale();

        // Update UI to reflect current language
        const currentLang = i18n.getLocale();
        this.updateLanguageUI(currentLang);

        // Update translatable elements
        this.updateTranslations();
    },

    updateTranslations() {
        // Update navigation labels
        const navItems = document.querySelectorAll('.nav-item span');
        if (navItems.length >= 6) {
            navItems[0].textContent = i18n.t('nav.dashboard');
            navItems[1].textContent = i18n.t('nav.sale');
            navItems[2].textContent = i18n.t('nav.inventory');
            navItems[3].textContent = i18n.t('nav.bookings');
            navItems[4].textContent = i18n.t('nav.customers');
            navItems[5].textContent = i18n.t('nav.reports');
        }

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key) {
                el.textContent = i18n.t(key);
            }
        });

        // Update all elements with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (key) {
                el.placeholder = i18n.t(key);
            }
        });

        // Login screen translations
        const loginTitle = document.querySelector('.login-title');
        if (loginTitle) loginTitle.textContent = i18n.t('login.title');

        const loginSubtitle = document.getElementById('loginSubtitle');
        if (loginSubtitle && loginSubtitle.textContent.includes('Loading')) {
            loginSubtitle.textContent = i18n.t('login.loadingData');
        }

        // Login options
        const ownerBtn = document.querySelector('.login-btn.admin h3');
        if (ownerBtn) ownerBtn.textContent = i18n.t('login.owner');
        const ownerDesc = document.querySelector('.login-btn.admin p');
        if (ownerDesc) ownerDesc.textContent = i18n.t('login.ownerDesc');

        const managerBtn = document.querySelector('.login-btn:not(.admin) h3');
        if (managerBtn) managerBtn.textContent = i18n.t('login.manager');
        const managerDesc = document.querySelector('.login-btn:not(.admin) p');
        if (managerDesc) managerDesc.textContent = i18n.t('login.managerDesc');

        // Settings page card titles
        this.translateCardTitles();

        // Report tabs
        this.translateReportTabs();
    },

    translateCardTitles() {
        const cardTitles = {
            'Owner PIN': 'settings.ownerPin',
            'Data Backup': 'settings.dataBackup',
            'Auto Sync Status': 'settings.autoSync',
            'Total Inventory Value': 'settings.inventoryValue',
            'Coming Soon': 'settings.comingSoon',
            'About': 'settings.about'
        };

        document.querySelectorAll('.card-title').forEach(el => {
            const text = el.textContent.trim();
            // Check if text matches (ignoring SVG content)
            for (const [eng, key] of Object.entries(cardTitles)) {
                if (text.includes(eng)) {
                    // Preserve SVG if present
                    const svg = el.querySelector('svg');
                    if (svg) {
                        el.innerHTML = '';
                        el.appendChild(svg);
                        el.appendChild(document.createTextNode(' ' + i18n.t(key)));
                    } else {
                        el.textContent = i18n.t(key);
                    }
                    break;
                }
            }
        });
    },

    translateReportTabs() {
        const tabs = document.querySelectorAll('.tabs .tab');
        const tabKeys = ['reports.dailyReport', 'reports.monthlyReport', 'reports.bestSellers', 'reports.stockLog'];
        tabs.forEach((tab, index) => {
            if (tabKeys[index]) {
                tab.textContent = i18n.t(tabKeys[index]);
            }
        });
    },

    // Calculate total inventory value
    calculateInventoryValue() {
        let totalCost = 0;
        let totalSelling = 0;
        let itemCount = 0;

        for (const [key, item] of Object.entries(State.inventory)) {
            if (item.qty > 0) {
                totalCost += (item.costPrice || 0) * item.qty;
                totalSelling += (item.price || 0) * item.qty;
                itemCount += item.qty;
            }
        }

        return {
            totalCost,
            totalSelling,
            potentialProfit: totalSelling - totalCost,
            itemCount,
            uniqueProducts: Object.keys(State.inventory).filter(k => State.inventory[k].qty > 0).length
        };
    },

    // Show inventory value (password protected)
    showInventoryValue() {
        if (!State.isAdmin()) {
            Toast.show('Owner access required');
            return;
        }

        const value = this.calculateInventoryValue();

        // Update the UI
        const valueSection = document.getElementById('inventoryValueSection');
        if (valueSection) {
            // Clear any existing timer
            if (this.inventoryValueTimer) {
                clearTimeout(this.inventoryValueTimer);
            }

            valueSection.style.display = 'block';
            document.getElementById('invTotalCost').textContent = Format.currency(value.totalCost);
            document.getElementById('invTotalSelling').textContent = Format.currency(value.totalSelling);
            document.getElementById('invPotentialProfit').textContent = Format.currency(value.potentialProfit);
            document.getElementById('invItemCount').textContent = value.itemCount;
            document.getElementById('invUniqueProducts').textContent = value.uniqueProducts;

            // Announce to screen reader
            Keyboard.announce(`Inventory value loaded. Total selling price: ${Format.currency(value.totalSelling)}`);

            // Auto-hide after 5 seconds
            this.inventoryValueTimer = setTimeout(() => {
                valueSection.style.display = 'none';
                this.inventoryValueTimer = null;
            }, 5000);
        }
    }
};
