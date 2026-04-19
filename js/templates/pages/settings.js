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
