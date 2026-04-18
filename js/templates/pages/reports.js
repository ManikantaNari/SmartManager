// Reports Page Template

export const ReportsTemplate = `
<div class="page" id="page-reports">
    <div class="tabs">
        <button class="tab active" id="rtab-daily" onclick="showReportTab('daily')">Daily</button>
        <button class="tab" id="rtab-monthly" onclick="showReportTab('monthly')">Monthly</button>
        <button class="tab" id="rtab-products" onclick="showReportTab('products')">Products</button>
        <button class="tab admin-only" id="rtab-stocklog" onclick="showReportTab('stocklog')">Stock Log</button>
    </div>

    <!-- Daily Report -->
    <div id="report-daily">
        <div class="form-group">
            <label class="form-label">Select Date</label>
            <input class="form-input" id="reportDate" onchange="loadDailyReport()" type="date">
            <div id="selectedDateDisplay" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 12px 16px; border-radius: 10px; margin-top: 12px; font-size: 18px; font-weight: 600; text-align: center;"></div>
        </div>
        <div id="dailyReportContent"></div>
    </div>

    <!-- Monthly Report -->
    <div id="report-monthly" style="display: none;">
        <div class="form-group">
            <label class="form-label">Select Month</label>
            <input class="form-input" id="reportMonth" onchange="loadMonthlyReport()" type="month">
            <div id="selectedMonthDisplay" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 12px 16px; border-radius: 10px; margin-top: 12px; font-size: 18px; font-weight: 600; text-align: center;"></div>
        </div>
        <div id="monthlyReportContent"></div>
    </div>

    <!-- Products Report -->
    <div id="report-products" style="display: none;">
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <div class="card-title" style="margin-bottom: 0;">Best Selling Products</div>
                <div class="admin-only-flex" style="align-items: center; gap: 8px;">
                    <span style="font-size: 12px; color: var(--gray);">%</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="profitToggle" onchange="toggleProfitDisplay()">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
            <div id="bestSellers"></div>
        </div>
    </div>

    <!-- Stock Log (Admin Only) -->
    <div id="report-stocklog" style="display: none;">
        <div class="form-group">
            <label class="form-label">Filter by Date</label>
            <input class="form-input" id="stockLogDate" onchange="loadStockLog()" type="date">
        </div>
        <div id="stockLogContent"></div>
    </div>
</div>
`;
