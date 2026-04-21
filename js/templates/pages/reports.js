// Reports Page Template

export const ReportsTemplate = `
<div class="page" id="page-reports">
    <div class="tabs">
        <button class="tab active" id="rtab-daily" onclick="showReportTab('daily')" data-i18n="reports.dailyReport">Daily</button>
        <button class="tab" id="rtab-monthly" onclick="showReportTab('monthly')" data-i18n="reports.monthlyReport">Monthly</button>
        <button class="tab" id="rtab-products" onclick="showReportTab('products')" data-i18n="reports.bestSellers">Products</button>
        <button class="tab admin-only" id="rtab-stocklog" onclick="showReportTab('stocklog')" data-i18n="reports.stockLog">Stock Log</button>
    </div>

    <!-- Daily Report -->
    <div id="report-daily">
        <div class="form-group">
            <label class="form-label" data-i18n="reports.selectDate">Select Date</label>
            <div style="position: relative;">
                <div id="selectedDateDisplay" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 12px 16px; border-radius: 10px; font-size: 18px; font-weight: 600; text-align: center; pointer-events: none;"></div>
                <input class="form-input" id="reportDate" onchange="loadDailyReport()" type="date" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; z-index: 10;">
            </div>
        </div>
        <div id="dailyReportContent"></div>
    </div>

    <!-- Monthly Report -->
    <div id="report-monthly" style="display: none;">
        <div class="form-group">
            <label class="form-label" data-i18n="reports.selectMonth">Select Month</label>
            <div style="display: flex; gap: 8px;">
                <select id="reportMonthSelect" onchange="updateMonthValue()" class="form-input" style="flex: 2; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 12px 16px; border-radius: 10px; font-size: 16px; font-weight: 600; border: none; cursor: pointer; appearance: none; -webkit-appearance: none;">
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
                <select id="reportYearSelect" onchange="updateMonthValue()" class="form-input" style="flex: 1; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 12px 16px; border-radius: 10px; font-size: 16px; font-weight: 600; border: none; cursor: pointer; appearance: none; -webkit-appearance: none;">
                </select>
            </div>
            <input type="hidden" id="reportMonth">
        </div>
        <div id="monthlyReportContent"></div>
    </div>

    <!-- Products Report -->
    <div id="report-products" style="display: none;">
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <div class="card-title" style="margin-bottom: 0;" data-i18n="reports.bestSellingProducts">Best Selling Products</div>
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
            <label class="form-label" data-i18n="reports.filterByDate">Filter by Date</label>
            <div style="position: relative;">
                <div id="selectedStockLogDateDisplay" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 12px 16px; border-radius: 10px; font-size: 18px; font-weight: 600; text-align: center; pointer-events: none;" data-i18n="reports.allDates">All Dates</div>
                <input class="form-input" id="stockLogDate" onchange="loadStockLog()" type="date" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; z-index: 10;">
            </div>
        </div>
        <div id="stockLogContent"></div>
    </div>
</div>
`;
