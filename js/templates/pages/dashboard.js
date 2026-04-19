// Dashboard Page Template

export const DashboardTemplate = `
<div class="page active" id="page-dashboard">
    <div class="stats-grid">
        <div class="stat-card primary">
            <div class="stat-label">Today's Sales</div>
            <div class="stat-value" id="todaySales">₹0</div>
        </div>
        <div class="stat-card success">
            <div class="stat-label">Items Sold</div>
            <div class="stat-value" id="todayItems">0</div>
        </div>
        <div class="stat-card admin-only">
            <div class="stat-label">Today's Profit</div>
            <div class="stat-value" id="todayProfit">₹0</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Transactions</div>
            <div class="stat-value" id="todayTxn">0</div>
        </div>
    </div>

    <div class="quick-actions">
        <div class="quick-action" onclick="showPage('sale')">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4"/>
            </svg>
            <span>New Sale</span>
        </div>
        <div class="quick-action" onclick="showPage('inventory')">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <span>Add Stock</span>
        </div>
        <div class="quick-action" onclick="showPage('reports')">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <span>Reports</span>
        </div>
    </div>

    <div class="card" id="pickupsTodayCard" style="display: none;">
        <div class="card-title" style="color: var(--primary);">
            <svg fill="none" height="20" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="20">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Pickups Today (<span id="pickupsTodayCount">0</span>)
        </div>
        <div id="pickupsTodayList"></div>
        <button class="btn btn-outline btn-block" onclick="showPage('bookings')" style="margin-top: 8px;">
            View All Bookings
        </button>
    </div>

    <div class="card" id="lowStockAlert" style="display: none;">
        <div class="card-title" style="color: var(--danger);">
            <svg fill="none" height="20" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="20">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            Low Stock Alert
        </div>
        <div id="lowStockList"></div>
    </div>

    <div class="card">
        <div class="card-title">Recent Sales</div>
        <div id="recentSales">
            <div class="empty-state">
                <p>No sales today</p>
            </div>
        </div>
    </div>
</div>
`;
