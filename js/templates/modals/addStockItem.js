// Add Stock Item Modal Template

export const AddStockItemModalTemplate = `
<div class="modal-overlay" id="addStockItemModal" onclick="closeAddStockItemModal()">
    <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3 class="modal-title">Add Stock</h3>
            <button class="modal-close" onclick="closeAddStockItemModal()">&times;</button>
        </div>
        <div style="text-align: center; margin-bottom: 20px;">
            <h4 id="addStockItemProduct" style="font-size: 18px; margin-bottom: 4px;"></h4>
            <p id="addStockItemVariant" style="color: var(--gray);"></p>
        </div>
        <div class="form-group">
            <label class="form-label">Quantity to Add <span class="required">*</span></label>
            <input class="form-input" id="addStockItemQty" min="1" placeholder="Enter quantity" type="number">
        </div>
        <div class="form-group">
            <label class="form-label">Cost Price (per unit)</label>
            <input class="form-input" id="addStockItemCost" placeholder="Enter cost price" type="number">
        </div>
        <div class="form-group">
            <label class="form-label">Selling Price (per unit)</label>
            <input class="form-input" id="addStockItemPrice" placeholder="Enter selling price" type="number">
        </div>
        <div class="form-group">
            <label class="form-label">Low Stock Alert (warn when below)</label>
            <input class="form-input" id="addStockItemAlert" placeholder="e.g., 5" type="number">
        </div>
        <div style="display: flex; gap: 12px;">
            <button class="btn btn-outline btn-block" onclick="closeAddStockItemModal()">Cancel</button>
            <button class="btn btn-primary btn-block" onclick="addItemToQueue()">Add to List</button>
        </div>
    </div>
</div>
`;
