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
        <!-- Start Session Form (shown when no active session) -->
        <div class="card" id="startSessionForm">
            <div class="card-title">Start New Stock Entry</div>
            <p style="color: var(--gray); font-size: 14px; margin-bottom: 16px;">
                Enter vendor details once, then add multiple items
            </p>
            <div class="form-group">
                <label class="form-label">Vendor Name *</label>
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
                        Take Photo
                        <input accept="image/*" capture="environment" id="sessionPhotoInput" onchange="captureInvoicePhoto(event)" style="display: none;" type="file">
                    </label>
                    <label class="btn btn-outline" style="flex: 1; cursor: pointer;">
                        Choose File
                        <input accept="image/*" id="sessionPhotoFile" onchange="captureInvoicePhoto(event)" style="display: none;" type="file">
                    </label>
                </div>
                <div id="photoPreview" style="display: none; margin-top: 12px;">
                    <img id="invoicePhotoThumb" style="width: 100%; max-height: 150px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border);">
                    <button class="btn btn-sm" onclick="removeInvoicePhoto()" style="margin-top: 8px; width: 100%;">Remove Photo</button>
                </div>
            </div>
            <button class="btn btn-primary btn-block" onclick="startStockSession()">Start Adding Items</button>
        </div>

        <!-- Active Session View (shown when session is active) -->
        <div id="activeSessionView" style="display: none;">
            <div class="card" style="background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); color: white;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 14px; opacity: 0.9;">Adding stock from</div>
                        <div style="font-size: 18px; font-weight: 600;" id="sessionVendorDisplay"></div>
                        <div style="font-size: 13px; opacity: 0.8;" id="sessionInvoiceDisplay"></div>
                    </div>
                    <button class="btn btn-sm" style="background: rgba(255,255,255,0.2); color: white; border: none;" onclick="completeStockSession()">
                        ✓ Complete
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
