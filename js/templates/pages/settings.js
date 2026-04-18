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
