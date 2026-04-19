// Customer History Modal Template

export const CustomerHistoryModalTemplate = `
<div class="modal-overlay" id="customerHistoryModal" onclick="closeCustomerHistory()">
    <div class="modal modal-large" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3 class="modal-title">Transaction History</h3>
            <button class="modal-close" onclick="closeCustomerHistory()">&times;</button>
        </div>

        <div class="modal-body">
            <!-- Customer Info -->
            <div class="card" style="background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); color: white; margin-bottom: 16px;">
                <h4 id="chCustomerName" style="margin: 0;">Customer Name</h4>
                <p id="chCustomerPhone" style="opacity: 0.9; margin: 4px 0 0 0;">-</p>
            </div>

            <!-- Transactions List -->
            <div class="card">
                <div class="card-title">All Transactions</div>
                <div id="chTransactionsList" style="max-height: 400px; overflow-y: auto;"></div>
            </div>
        </div>

        <div class="modal-footer">
            <button class="btn btn-primary btn-block" onclick="closeCustomerHistory()">Close</button>
        </div>
    </div>
</div>
`;
