// Settings Page Template

export const SettingsTemplate = `
<div class="page" id="page-settings">
    <div class="card admin-only">
        <div class="card-title">Owner PIN</div>
        <p style="color: var(--gray); font-size: 14px; margin-bottom: 16px;">
            Set a 5-digit PIN to protect sensitive information
        </p>
        <button class="btn btn-primary btn-block" onclick="showSetPinModal()">
            Change Owner PIN
        </button>
    </div>

    <div class="card admin-only">
        <div class="card-title">Data Backup</div>
        <p style="color: var(--gray); font-size: 14px; margin-bottom: 16px;">
            Download your data as a backup file
        </p>
        <button class="btn btn-outline btn-block" onclick="downloadBackup()" style="margin-bottom: 12px;">
            Download Backup
        </button>
        <label class="btn btn-outline btn-block" style="cursor: pointer;">
            Restore from Backup
            <input accept=".json" onchange="restoreBackup(event)" style="display: none;" type="file">
        </label>
    </div>

    <div class="card admin-only">
        <div class="card-title">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 8px;">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
                <polyline points="21 3 21 9 15 9"/>
            </svg>
            Auto Sync Status
        </div>
        <p style="color: var(--gray); font-size: 13px; margin-bottom: 16px;">
            Data syncs automatically across all devices in real-time using timestamp-based merging.
        </p>
        <div id="syncStatusInfo">
            <div class="sync-status-row">
                <span>Connection:</span>
                <span id="firebaseStatus">Checking...</span>
            </div>
            <div class="sync-status-row">
                <span>Last Activity:</span>
                <span id="lastSyncTime">-</span>
            </div>
            <div class="sync-status-row">
                <span>Sync Mode:</span>
                <span style="color: var(--success); font-weight: 500;">Real-time</span>
            </div>
            <div id="syncDataCounts" style="margin-top: 12px; padding: 12px; background: var(--light); border-radius: 8px; font-size: 13px;">
                <div style="font-weight: 600; margin-bottom: 8px; color: var(--dark);">Data Counts</div>
                <div class="sync-count-row"><span>Inventory:</span><span id="syncCountInventory">-</span></div>
                <div class="sync-count-row"><span>Sales:</span><span id="syncCountSales">-</span></div>
                <div class="sync-count-row"><span>Customers:</span><span id="syncCountCustomers">-</span></div>
                <div class="sync-count-row"><span>Bookings:</span><span id="syncCountBookings">-</span></div>
                <div class="sync-count-row"><span>Products:</span><span id="syncCountProducts">-</span></div>
            </div>
        </div>
        <button class="btn btn-outline btn-block" onclick="checkSyncStatus()" style="margin-top: 16px;">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 6px;">
                <path d="M23 4v6h-6M1 20v-6h6"/>
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
            </svg>
            Refresh Status
        </button>
        <div id="syncErrors" style="margin-top: 12px; display: none;">
            <div style="color: var(--danger); font-size: 13px; font-weight: 600; margin-bottom: 8px;">Recent Errors:</div>
            <div id="syncErrorsList" style="font-size: 12px; color: var(--gray); max-height: 100px; overflow-y: auto;"></div>
        </div>
    </div>

    <div class="card">
        <div class="card-title">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 8px;">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M12 8v8"/>
                <path d="M8 12h8"/>
            </svg>
            Language / భాష / भाषा
        </div>
        <p style="color: var(--gray); font-size: 14px; margin-bottom: 16px;">
            Select your preferred language for the app
        </p>
        <div class="language-selector">
            <button class="language-option" data-lang="en" onclick="changeLanguage('en')">
                <div class="language-flag">🇬🇧</div>
                <div class="language-info">
                    <div class="language-name">English</div>
                    <div class="language-native">English</div>
                </div>
                <div class="language-check">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                </div>
            </button>
            <button class="language-option" data-lang="te" onclick="changeLanguage('te')">
                <div class="language-flag">🇮🇳</div>
                <div class="language-info">
                    <div class="language-name">Telugu</div>
                    <div class="language-native">తెలుగు</div>
                </div>
                <div class="language-check">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                </div>
            </button>
            <button class="language-option" data-lang="hi" onclick="changeLanguage('hi')">
                <div class="language-flag">🇮🇳</div>
                <div class="language-info">
                    <div class="language-name">Hindi</div>
                    <div class="language-native">हिन्दी</div>
                </div>
                <div class="language-check">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                </div>
            </button>
        </div>
        <p style="color: var(--gray); font-size: 12px; margin-top: 12px; font-style: italic;">
            Note: Translation feature is currently in development. Only common interface elements are translated.
        </p>
    </div>

    <div class="card admin-only">
        <div class="card-title">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 8px;">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            Total Inventory Value
        </div>
        <p style="color: var(--gray); font-size: 14px; margin-bottom: 16px;">
            View the total value of your current stock inventory
        </p>
        <button class="btn btn-primary btn-block" onclick="showInventoryValue()">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 6px;">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            View Inventory Value
        </button>

        <div id="inventoryValueSection" style="display: none; margin-top: 20px; padding-top: 20px; border-top: 2px solid var(--border);">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px;">
                <div class="value-stat-card">
                    <div class="value-stat-label">Total Cost Price</div>
                    <div class="value-stat-amount worker-blur" data-sensitive="cost" id="invTotalCost">₹0</div>
                </div>
                <div class="value-stat-card">
                    <div class="value-stat-label">Total Selling Price</div>
                    <div class="value-stat-amount" id="invTotalSelling">₹0</div>
                </div>
                <div class="value-stat-card">
                    <div class="value-stat-label">Potential Profit</div>
                    <div class="value-stat-amount worker-blur" data-sensitive="profit" id="invPotentialProfit" style="color: var(--success);">₹0</div>
                </div>
                <div class="value-stat-card">
                    <div class="value-stat-label">Total Items</div>
                    <div class="value-stat-amount" id="invItemCount" style="color: var(--primary);">0</div>
                </div>
            </div>
            <div style="background: rgba(102, 126, 234, 0.1); padding: 12px; border-radius: 8px; border-left: 4px solid var(--primary);">
                <div style="font-size: 13px; color: var(--gray); display: flex; justify-content: space-between; align-items: center;">
                    <span>Unique Products in Stock:</span>
                    <strong style="color: var(--dark); font-size: 16px;" id="invUniqueProducts">0</strong>
                </div>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-title">Coming Soon</div>
        <div class="coming-soon-card">
            <h4>Monthly Expense Tracking</h4>
            <p>Track rent, electricity, and other monthly expenses</p>
        </div>
        <div class="coming-soon-card">
            <h4>Vendor/Supplier List</h4>
            <p>Manage your suppliers with contact details</p>
        </div>
        <div class="coming-soon-card">
            <h4>EMI/Installment Tracking</h4>
            <p>Track customer payments in installments</p>
        </div>
    </div>

    <div class="card">
        <div class="card-title">About</div>
        <p style="color: var(--gray); font-size: 14px;">
            Manikanta Enterprises v1.0<br>
            Built for your business
        </p>
    </div>
</div>
`;
