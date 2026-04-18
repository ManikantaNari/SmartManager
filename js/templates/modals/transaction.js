// Transaction Details Modal Template

export const TransactionModalTemplate = `
<div class="modal-overlay" id="transactionModal" onclick="closeTransactionModal()">
    <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
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
            <button class="btn btn-danger btn-block admin-only" onclick="confirmDeleteTransaction()">
                Delete Transaction
            </button>
        </div>
    </div>
</div>
`;
