// Inventory Page Template

export const InventoryTemplate = `
<div class="page" id="page-inventory">
    <div class="tabs">
        <button class="tab active" id="tab-stock" onclick="showInventoryTab('stock')">Current Stock</button>
        <button class="tab" id="tab-add" onclick="showInventoryTab('add')">Add Stock</button>
    </div>

    <!-- Current Stock View -->
    <div id="inventory-stock">
        <div class="search-box">
            <svg fill="none" height="20" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="20">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input id="stockSearch" oninput="filterStock()" placeholder="Search inventory..." type="text">
        </div>
        <div id="stockList"></div>
    </div>

    <!-- Add Stock View -->
    <div id="inventory-add" style="display: none;">
        <!-- Stock Type Selection (shown first) -->
        <div class="card" id="stockTypeSelection">
            <div class="card-title">What type of stock?</div>
            <p style="color: var(--gray); font-size: 14px; margin-bottom: 20px;">
                Select whether you're adding existing inventory or new purchases
            </p>
            <div class="stock-type-options">
                <div class="stock-type-btn" onclick="selectStockType('old')">
                    <div class="stock-type-icon">
                        <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                        </svg>
                    </div>
                    <div class="stock-type-info">
                        <span class="stock-type-title">Old Stock</span>
                        <span class="stock-type-desc">Existing inventory / Opening balance</span>
                    </div>
                </div>
                <div class="stock-type-btn" onclick="selectStockType('new')">
                    <div class="stock-type-icon new">
                        <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                            <line x1="12" y1="12" x2="12" y2="18"/>
                            <line x1="9" y1="15" x2="15" y2="15"/>
                        </svg>
                    </div>
                    <div class="stock-type-info">
                        <span class="stock-type-title">New Stock</span>
                        <span class="stock-type-desc">New purchase with vendor details</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Start Session Form (shown when "New Stock" is selected) -->
        <div class="card" id="startSessionForm" style="display: none;">
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
                <button class="back-btn" onclick="backToStockType()">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </button>
                <div class="card-title" style="margin: 0;">New Stock Entry</div>
            </div>
            <p style="color: var(--gray); font-size: 14px; margin-bottom: 16px;">
                Enter vendor details once, then add multiple items
            </p>
            <div class="form-group">
                <label class="form-label">Vendor Name <span class="required">*</span></label>
                <input class="form-input" id="sessionVendor" placeholder="Enter vendor/supplier name" type="text">
            </div>
            <div class="form-group">
                <label class="form-label">Invoice Number (Optional)</label>
                <input class="form-input" id="sessionInvoice" placeholder="e.g., INV-2024-001" type="text">
            </div>
            <div class="form-group">
                <label class="form-label">Invoice Photo (Optional)</label>
                <div style="display: flex; gap: 12px;">
                    <label class="btn btn-outline" style="flex: 1; cursor: pointer;">
                        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                            <circle cx="12" cy="13" r="4"/>
                        </svg>
                        Camera
                        <input accept="image/*" capture="environment" id="sessionPhotoInput" onchange="captureInvoicePhoto(event)" style="display: none;" type="file">
                    </label>
                    <label class="btn btn-outline" style="flex: 1; cursor: pointer;">
                        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                            <polyline points="17,8 12,3 7,8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        File
                        <input accept="image/*" id="sessionPhotoFile" onchange="captureInvoicePhoto(event)" style="display: none;" type="file">
                    </label>
                </div>
                <div id="photoPreview" style="display: none; margin-top: 12px;">
                    <img id="invoicePhotoThumb" style="width: 100%; max-height: 150px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border);">
                    <button class="btn btn-sm btn-outline btn-block" onclick="removeInvoicePhoto()" style="margin-top: 8px;">Remove Photo</button>
                </div>
            </div>
            <button class="btn btn-primary btn-block" onclick="startStockSession()">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                Start Adding Items
            </button>
        </div>

        <!-- Active Session View (shown when session is active) -->
        <div id="activeSessionView" style="display: none;">
            <div class="card" style="background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); color: white;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 14px; opacity: 0.9;" id="sessionVendorLabel">Adding stock from</div>
                        <div style="font-size: 18px; font-weight: 600;" id="sessionVendorDisplay"></div>
                        <div style="font-size: 13px; opacity: 0.8;" id="sessionInvoiceDisplay"></div>
                    </div>
                    <button class="btn btn-sm" style="background: rgba(255,255,255,0.2); color: white; border: none;" onclick="completeStockSession()">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 4px;">
                            <path d="M20 6L9 17l-5-5"/>
                        </svg>
                        Complete
                    </button>
                </div>
            </div>

            <!-- Items added in this session -->
            <div class="card" id="sessionItemsCard" style="display: none;">
                <div class="card-title">Items Added (<span id="sessionItemCount">0</span>)</div>
                <div id="sessionItemsList"></div>
            </div>

            <!-- Category/Variant Selection -->
            <div class="card">
                <div class="card-title">Select Product</div>
                <div class="category-grid" id="stockCategoryGrid"></div>
            </div>
            <div class="card" id="stockVariantCard" style="display: none;">
                <div class="card-title" id="stockVariantTitle">Select Variant</div>
                <div class="variant-grid" id="stockVariantGrid"></div>
            </div>
            <div class="card" id="addStockForm" style="display: none;">
                <div class="card-title">Add Stock: <span id="addStockProduct"></span></div>
                <div class="form-group">
                    <label class="form-label">Quantity to Add</label>
                    <input class="form-input" id="addStockQty" min="1" placeholder="Enter quantity" type="number">
                </div>
                <div class="form-group">
                    <label class="form-label">Cost Price (per unit)</label>
                    <input class="form-input" id="addStockCost" placeholder="Enter cost price" type="number">
                </div>
                <div class="form-group">
                    <label class="form-label">Selling Price (per unit)</label>
                    <input class="form-input" id="addStockPrice" placeholder="Enter selling price" type="number">
                </div>
                <div class="form-group">
                    <label class="form-label">Low Stock Alert (warn when below)</label>
                    <input class="form-input" id="addStockAlert" placeholder="e.g., 5" type="number">
                </div>
                <button class="btn btn-success btn-block" onclick="saveStock()">Add Item</button>
            </div>
        </div>
    </div>
</div>
`;
