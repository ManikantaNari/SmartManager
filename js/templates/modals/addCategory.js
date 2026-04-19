// Add Category Modal Template

export const AddCategoryModalTemplate = `
<div class="modal-overlay" id="addCategoryModal" onclick="closeAddCategoryModal()">
    <div class="modal modal-small" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3 class="modal-title">Add New Category</h3>
            <button class="modal-close" onclick="closeAddCategoryModal()">&times;</button>
        </div>
        <div style="padding: 0 24px 24px;">
            <div class="form-group">
                <label class="form-label">Category Name <span class="required">*</span></label>
                <input class="form-input" id="newCategoryName" placeholder="e.g., Almara" type="text">
            </div>
            <button class="btn btn-primary btn-block" onclick="saveNewCategory()">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Category
            </button>
        </div>
    </div>
</div>
`;

// Edit Category Modal Template
export const EditCategoryModalTemplate = `
<div class="modal-overlay" id="editCategoryModal" onclick="closeEditCategoryModal()">
    <div class="modal modal-small" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3 class="modal-title">Edit Category</h3>
            <button class="modal-close" onclick="closeEditCategoryModal()">&times;</button>
        </div>
        <div style="padding: 0 24px 24px;">
            <div class="edit-info-box">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>This will update the category name across all inventory, sales, and bookings.</span>
            </div>
            <div class="form-group">
                <label class="form-label">Current Name</label>
                <div id="editCategoryOldName" class="current-value"></div>
            </div>
            <div class="form-group">
                <label class="form-label">New Name <span class="required">*</span></label>
                <input class="form-input" id="editCategoryNewName" placeholder="Enter new name" type="text">
            </div>
            <div class="cb-actions">
                <button class="btn btn-outline" onclick="closeEditCategoryModal()">Cancel</button>
                <button class="btn btn-primary" onclick="saveEditCategory()">
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
