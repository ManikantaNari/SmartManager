// Edit Stock Modal Template

export const EditStockModalTemplate = `
<div class="modal-overlay" id="editStockModal" onclick="closeEditStockModal()">
    <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3 class="modal-title">Edit Stock</h3>
            <button class="modal-close" onclick="closeEditStockModal()">&times;</button>
        </div>
        <div style="text-align: center; margin-bottom: 20px;">
            <h4 id="editStockProduct" style="font-size: 18px; margin-bottom: 4px;"></h4>
            <p id="editStockVariant" style="color: var(--gray);"></p>
        </div>
        <div class="form-group">
            <label class="form-label">Current Stock Quantity</label>
            <input class="form-input" id="editStockQty" min="0" placeholder="Enter quantity" type="number">
        </div>
        <div class="form-group">
            <label class="form-label">Cost Price (per unit)</label>
            <input class="form-input" id="editStockCost" placeholder="Enter cost price" type="number">
        </div>
        <div class="form-group">
            <label class="form-label">Selling Price (per unit)</label>
            <input class="form-input" id="editStockPrice" placeholder="Enter selling price" type="number">
        </div>
        <div class="form-group">
            <label class="form-label">Low Stock Alert (warn when below)</label>
            <input class="form-input" id="editStockAlert" placeholder="e.g., 5" type="number">
        </div>
        <button class="btn btn-success btn-block" onclick="saveStockEdit()">Save Changes</button>
    </div>
</div>
`;
