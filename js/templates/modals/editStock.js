// Edit Stock Modal Template

export const EditStockModalTemplate = `
<div class="modal-overlay" id="editStockModal" onclick="closeEditStockModal()">
    <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3 class="modal-title" data-i18n="modals.editStock">Edit Stock</h3>
            <button class="modal-close" onclick="closeEditStockModal()">&times;</button>
        </div>
        <div style="text-align: center; margin-bottom: 20px;">
            <h4 id="editStockProduct" style="font-size: 18px; margin-bottom: 4px;"></h4>
            <p id="editStockVariant" style="color: var(--gray);"></p>
        </div>
        <div class="form-group">
            <label class="form-label" data-i18n="modals.currentStockQty">Current Stock Quantity</label>
            <input class="form-input" id="editStockQty" min="0" data-i18n-placeholder="modals.enterQuantity" placeholder="Enter quantity" type="number">
        </div>
        <div class="form-group">
            <label class="form-label" data-i18n="modals.costPricePerUnit">Cost Price (per unit)</label>
            <input class="form-input" id="editStockCost" data-i18n-placeholder="modals.enterCostPrice" placeholder="Enter cost price" type="number">
        </div>
        <div class="form-group">
            <label class="form-label" data-i18n="modals.sellingPricePerUnit">Selling Price (per unit)</label>
            <input class="form-input" id="editStockPrice" data-i18n-placeholder="modals.enterSellingPrice" placeholder="Enter selling price" type="number">
        </div>
        <div class="form-group">
            <label class="form-label" data-i18n="modals.lowStockAlert">Low Stock Alert (warn when below)</label>
            <input class="form-input" id="editStockAlert" placeholder="e.g., 5" type="number">
        </div>
        <div class="form-group">
            <label class="form-label"><span data-i18n="modals.reasonForAdjustment">Reason for Adjustment</span> (<span data-i18n="common.optional">Optional</span>)</label>
            <input class="form-input" id="editStockReason" data-i18n-placeholder="modals.adjustmentExample" placeholder="e.g., Physical count, Damaged stock, Error correction" type="text">
            <p style="font-size: 12px; color: var(--gray); margin-top: 4px;" data-i18n="modals.loggedForAudit">This will be logged for audit purposes</p>
        </div>
        <button class="btn btn-success btn-block" onclick="saveStockEdit()" data-i18n="common.saveChanges">Save Changes</button>
    </div>
</div>
`;
