// Add Stock Item Modal Template

export const AddStockItemModalTemplate = `
<div class="modal-overlay" id="addStockItemModal" onclick="closeAddStockItemModal()">
    <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3 class="modal-title" data-i18n="inventory.addStock">Add Stock</h3>
            <button class="modal-close" onclick="closeAddStockItemModal()">&times;</button>
        </div>
        <div style="text-align: center; margin-bottom: 20px;">
            <h4 id="addStockItemProduct" style="font-size: 18px; margin-bottom: 4px;"></h4>
            <p id="addStockItemVariant" style="color: var(--gray);"></p>
        </div>
        <div class="form-group">
            <label class="form-label"><span data-i18n="modals.quantityToAdd">Quantity to Add</span> <span class="required">*</span></label>
            <input class="form-input" id="addStockItemQty" min="1" data-i18n-placeholder="modals.enterQuantity" placeholder="Enter quantity" type="number">
        </div>
        <div class="form-group">
            <label class="form-label" data-i18n="modals.costPricePerUnit">Cost Price (per unit)</label>
            <input class="form-input" id="addStockItemCost" data-i18n-placeholder="modals.enterCostPrice" placeholder="Enter cost price" type="number">
        </div>
        <div class="form-group">
            <label class="form-label" data-i18n="modals.sellingPricePerUnit">Selling Price (per unit)</label>
            <input class="form-input" id="addStockItemPrice" data-i18n-placeholder="modals.enterSellingPrice" placeholder="Enter selling price" type="number">
        </div>
        <div class="form-group">
            <label class="form-label" data-i18n="modals.lowStockAlert">Low Stock Alert (warn when below)</label>
            <input class="form-input" id="addStockItemAlert" placeholder="e.g., 5" type="number">
        </div>
        <div style="display: flex; gap: 12px;">
            <button class="btn btn-outline btn-block" onclick="closeAddStockItemModal()" data-i18n="common.cancel">Cancel</button>
            <button class="btn btn-primary btn-block" onclick="addItemToQueue()" data-i18n="modals.addToList">Add to List</button>
        </div>
    </div>
</div>
`;
