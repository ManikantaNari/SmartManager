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
                <label class="form-label">Quantity (Optional)</label>
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
            <div class="delete-section" id="editVariantDeleteSection">
                <button class="btn btn-danger btn-block" id="deleteVariantBtn" onclick="showDeleteVariantConfirm()">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                    Delete Variant
                </button>
                <p class="delete-warning" id="deleteVariantWarning">This will remove the variant and its inventory data.</p>
                <p class="delete-warning" id="deleteVariantStockInfo" style="display: none; color: var(--warning); font-weight: 500;"></p>
            </div>
        </div>
    </div>
</div>
`;

// Delete Variant Confirmation Modal
export const DeleteVariantModalTemplate = `
<div class="modal-overlay" id="deleteVariantModal" onclick="closeDeleteVariantModal()">
    <div class="modal modal-small" onclick="event.stopPropagation()">
        <div class="modal-header" style="background: linear-gradient(135deg, var(--danger), #dc2626);">
            <h3 class="modal-title" style="color: white;">Delete Variant</h3>
            <button class="modal-close" onclick="closeDeleteVariantModal()" style="color: white;">&times;</button>
        </div>
        <div style="padding: 24px;">
            <div class="delete-confirm-box">
                <svg width="48" height="48" fill="none" stroke="var(--danger)" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <h4>Are you sure?</h4>
                <p>You are about to delete <strong id="deleteVariantName"></strong> from <strong id="deleteVariantCategory"></strong>.</p>
                <p class="delete-impact">This action cannot be undone. Inventory data will be removed.</p>
            </div>
            <div class="cb-actions" style="margin-top: 20px;">
                <button class="btn btn-outline" onclick="closeDeleteVariantModal()">Cancel</button>
                <button class="btn btn-danger" onclick="confirmDeleteVariant()">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                    Yes, Delete
                </button>
            </div>
        </div>
    </div>
</div>
`;
