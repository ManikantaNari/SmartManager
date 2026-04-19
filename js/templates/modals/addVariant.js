// Add Variant Modal Template

export const AddVariantModalTemplate = `
<div class="modal-overlay" id="addVariantModal" onclick="closeAddVariantModal()">
    <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3 class="modal-title">Add New Variant</h3>
            <button class="modal-close" onclick="closeAddVariantModal()">&times;</button>
        </div>
        <div style="padding: 0 24px 24px;">
            <p style="color: var(--gray); margin-bottom: 16px;">Adding to: <strong id="addVariantCategory"></strong></p>
            <div class="form-group">
                <label class="form-label">Variant Name <span class="required">*</span></label>
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
            <button class="btn btn-primary btn-block" onclick="saveNewVariant()">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Variant
            </button>
        </div>
    </div>
</div>
`;

// Edit Variant Modal Template
export const EditVariantModalTemplate = `
<div class="modal-overlay" id="editVariantModal" onclick="closeEditVariantModal()">
    <div class="modal modal-small" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3 class="modal-title">Edit Variant</h3>
            <button class="modal-close" onclick="closeEditVariantModal()">&times;</button>
        </div>
        <div style="padding: 0 24px 24px;">
            <div class="edit-info-box">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>This will update the variant name across all inventory, sales, and bookings.</span>
            </div>
            <div class="form-group">
                <label class="form-label">Category</label>
                <div id="editVariantCategory" class="current-value"></div>
            </div>
            <div class="form-group">
                <label class="form-label">Current Name</label>
                <div id="editVariantOldName" class="current-value"></div>
            </div>
            <div class="form-group">
                <label class="form-label">New Name <span class="required">*</span></label>
                <input class="form-input" id="editVariantNewName" placeholder="Enter new name" type="text">
            </div>
            <div class="cb-actions">
                <button class="btn btn-outline" onclick="closeEditVariantModal()">Cancel</button>
                <button class="btn btn-primary" onclick="saveEditVariant()">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    Save Changes
                </button>
            </div>
        </div>
    </div>
</div>
`;
