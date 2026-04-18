// Sale Complete Modal Template

export const SaleCompleteModalTemplate = `
<div class="modal-overlay" id="saleCompleteModal" onclick="closeSaleComplete()">
    <div class="modal" onclick="event.stopPropagation()">
        <div style="text-align: center; padding: 20px 0;">
            <div style="width: 80px; height: 80px; background: var(--success); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                <svg fill="none" height="40" stroke="white" stroke-width="3" viewBox="0 0 24 24" width="40">
                    <path d="M5 13l4 4L19 7"/>
                </svg>
            </div>
            <h2 style="margin-bottom: 8px;">Sale Complete!</h2>
            <p id="saleCompleteAmount" style="color: var(--gray); margin-bottom: 16px;">Total: ₹0</p>
            <div id="smsBillSection" style="display: none;">
                <div class="card" style="background: #f8f9fa; margin-bottom: 16px; text-align: left;">
                    <div class="card-title" style="font-size: 14px;">SMS Bill Preview</div>
                    <pre id="smsPreviewComplete" style="font-size: 11px; white-space: pre-wrap; color: var(--dark); font-family: monospace; background: white; padding: 12px; border-radius: 8px; border: 1px solid var(--border);"></pre>
                </div>
                <button class="btn btn-primary btn-block" onclick="sendSMSBill()" style="margin-bottom: 12px;">
                    Send Bill via SMS
                </button>
            </div>
            <button class="btn btn-outline btn-block" onclick="closeSaleComplete()">Done</button>
        </div>
    </div>
</div>
`;
