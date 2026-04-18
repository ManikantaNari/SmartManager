// Add Variant Modal Template

export const AddVariantModalTemplate = `
<div class="modal-overlay" id="addVariantModal" onclick="closeAddVariantModal()">
    <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3 class="modal-title">Add New Variant</h3>
            <button class="modal-close" onclick="closeAddVariantModal()">&times;</button>
        </div>
        <p style="color: var(--gray); margin-bottom: 16px;">Adding to: <strong id="addVariantCategory"></strong></p>
        <div class="form-group">
            <label class="form-label">Variant Name</label>
            <input class="form-input" id="newVariantName" placeholder="e.g., Double Door" type="text">
        </div>
        <div class="form-group">
            <label class="form-label">Cost Price (Optional)</label>
            <input class="form-input" id="newVariantCost" placeholder="0" type="number">
        </div>
        <div class="form-group">
            <label class="form-label">Selling Price (Optional)</label>
            <input class="form-input" id="newVariantPrice" placeholder="0" type="number">
        </div>
        <div class="form-group">
            <label class="form-label">Initial Stock (Optional)</label>
            <input class="form-input" id="newVariantStock" placeholder="0" type="number">
        </div>
        <button class="btn btn-primary btn-block" onclick="saveNewVariant()">Add Variant</button>
    </div>
</div>
`;
