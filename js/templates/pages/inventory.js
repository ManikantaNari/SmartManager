// Inventory Page Template

export const InventoryTemplate = `
<div class="page" id="page-inventory">
    <div class="tabs">
        <button class="tab active" id="tab-stock" onclick="showInventoryTab('stock')" data-i18n="inventory.currentStock">Current Stock</button>
        <button class="tab" id="tab-add" onclick="showInventoryTab('add')" data-i18n="inventory.addStock">Add Stock</button>
    </div>

    <!-- Current Stock View -->
    <div id="inventory-stock">
        <div class="search-box">
            <svg fill="none" height="20" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="20">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input id="stockSearch" oninput="filterStock()" data-i18n-placeholder="inventory.searchInventory" placeholder="Search inventory..." type="text">
        </div>
        <div id="stockList"></div>
    </div>

    <!-- Add Stock View -->
    <div id="inventory-add" style="display: none;">
        <!-- Unified Stock Entry Form -->
        <div class="card" id="startSessionForm">
            <div class="card-title" data-i18n="inventory.addStock">Add Stock</div>
            <p style="color: var(--gray); font-size: 14px; margin-bottom: 20px;" data-i18n="inventory.addStockDesc">
                Add items to your inventory. Track vendor details for new purchases or skip for existing stock.
            </p>

            <!-- Stock Type Toggle -->
            <div class="form-group">
                <label style="display: flex; align-items: center; justify-content: space-between; padding: 16px; background: var(--light); border-radius: 8px; cursor: pointer; margin-bottom: 20px;">
                    <div>
                        <div style="font-weight: 600; font-size: 15px; color: var(--dark);" data-i18n="inventory.newPurchase">New Purchase</div>
                        <div style="font-size: 13px; color: var(--gray); margin-top: 2px;" data-i18n="inventory.trackVendorDetails">Track vendor details and invoice</div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="isNewPurchase" onchange="toggleVendorFields()">
                        <span class="toggle-slider"></span>
                    </label>
                </label>
            </div>

            <!-- Vendor Details (shown only for new purchases) -->
            <div id="vendorDetailsSection" style="display: none;">
                <div style="border-left: 3px solid var(--primary); padding-left: 16px; margin-bottom: 20px;">
                    <div class="form-group">
                        <label class="form-label"><span data-i18n="inventory.vendorName">Vendor Name</span> <span class="required">*</span></label>
                        <input class="form-input" id="sessionVendor" data-i18n-placeholder="inventory.enterVendor" placeholder="Enter vendor/supplier name" type="text">
                    </div>
                    <div class="form-group">
                        <label class="form-label"><span data-i18n="inventory.invoiceNumber">Invoice Number</span> (<span data-i18n="common.optional">Optional</span>)</label>
                        <input class="form-input" id="sessionInvoice" placeholder="e.g., INV-2024-001" type="text">
                    </div>
                    <div class="form-group">
                        <label class="form-label"><span data-i18n="inventory.invoicePhoto">Invoice Photo</span> (<span data-i18n="common.optional">Optional</span>)</label>
                        <div style="display: flex; gap: 12px;">
                            <label class="btn btn-outline" style="flex: 1; cursor: pointer;">
                                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                                    <circle cx="12" cy="13" r="4"/>
                                </svg>
                                <span data-i18n="inventory.camera">Camera</span>
                                <input accept="image/*" capture="environment" id="sessionPhotoInput" onchange="captureInvoicePhoto(event)" style="display: none;" type="file">
                            </label>
                            <label class="btn btn-outline" style="flex: 1; cursor: pointer;">
                                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                                    <polyline points="17,8 12,3 7,8"/>
                                    <line x1="12" y1="3" x2="12" y2="15"/>
                                </svg>
                                <span data-i18n="inventory.file">File</span>
                                <input accept="image/*" id="sessionPhotoFile" onchange="captureInvoicePhoto(event)" style="display: none;" type="file">
                            </label>
                        </div>
                        <div id="photoPreview" style="display: none; margin-top: 12px;">
                            <img id="invoicePhotoThumb" style="width: 100%; max-height: 150px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border);">
                            <button class="btn btn-sm btn-outline btn-block" onclick="removeInvoicePhoto()" style="margin-top: 8px;" data-i18n="inventory.removePhoto">Remove Photo</button>
                        </div>
                    </div>
                </div>
            </div>

            <button class="btn btn-primary btn-block" onclick="startStockSession()">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                <span data-i18n="inventory.startAddingItems">Start Adding Items</span>
            </button>
        </div>

        <!-- Active Session View (shown when session is active) -->
        <div id="activeSessionView" style="display: none;">
            <div class="card" style="background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); color: white;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 14px; opacity: 0.9;" id="sessionVendorLabel" data-i18n="inventory.addingStockFrom">Adding stock from</div>
                        <div style="font-size: 18px; font-weight: 600;" id="sessionVendorDisplay"></div>
                        <div style="font-size: 13px; opacity: 0.8;" id="sessionInvoiceDisplay"></div>
                    </div>
                    <button class="btn btn-sm" style="background: rgba(255,255,255,0.2); color: white; border: none;" onclick="completeStockSession()">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 4px;">
                            <path d="M20 6L9 17l-5-5"/>
                        </svg>
                        <span data-i18n="common.complete">Complete</span>
                    </button>
                </div>
            </div>

            <!-- Items added in this session -->
            <div class="card" id="sessionItemsCard" style="display: none;">
                <div class="card-title"><span data-i18n="inventory.itemsAdded">Items Added</span> (<span id="sessionItemCount">0</span>)</div>
                <div id="sessionItemsList"></div>
            </div>

            <!-- Category/Variant Selection -->
            <div class="card">
                <div class="card-title" data-i18n="inventory.selectProduct">Select Product</div>
                <div class="category-grid" id="stockCategoryGrid"></div>
            </div>
            <div class="card" id="stockVariantCard" style="display: none;">
                <div class="card-title" id="stockVariantTitle" data-i18n="sale.selectVariant">Select Variant</div>
                <div class="variant-grid" id="stockVariantGrid"></div>
            </div>
        </div>
    </div>
</div>
`;
