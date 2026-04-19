// Transaction Details Modal Template

export const TransactionModalTemplate = `
<div class="modal-overlay" id="transactionModal" onclick="closeTransactionModal()">
    <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
            <button id="transactionBackBtn" class="back-btn" onclick="backToHistoryFromTransaction()" style="display: none;">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
            </button>
            <h3 class="modal-title">Transaction Details</h3>
            <button class="modal-close" onclick="closeTransactionModal()">&times;</button>
        </div>
        <div id="transactionDetails"></div>
        <div style="margin-top: 20px;">
            <div class="card" style="background: #f8f9fa; margin-bottom: 16px;">
                <div class="card-title" style="font-size: 14px;">SMS Bill Preview</div>
                <pre id="smsPreview" style="font-size: 12px; white-space: pre-wrap; color: var(--dark); font-family: monospace; background: white; padding: 12px; border-radius: 8px; border: 1px solid var(--border);"></pre>
            </div>
            <div id="transactionSmsSection" style="display: none;">
                <button class="btn btn-primary btn-block" onclick="sendSMSFromTransaction()" style="margin-bottom: 12px;">
                    Send Bill via SMS
                </button>
            </div>
            <div id="addCustomerFromSaleSection" style="display: none; margin-bottom: 12px;">
                <button class="btn btn-outline btn-block" onclick="addCustomerFromSale()" style="border-color: var(--success); color: var(--success);">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                        <circle cx="8.5" cy="7" r="4"/>
                        <line x1="20" y1="8" x2="20" y2="14"/>
                        <line x1="23" y1="11" x2="17" y2="11"/>
                    </svg>
                    Add to Customers List
                </button>
            </div>
            <button class="btn btn-danger btn-block admin-only" onclick="confirmDeleteTransaction()">
                Delete Transaction
            </button>
        </div>
    </div>
</div>
`;
