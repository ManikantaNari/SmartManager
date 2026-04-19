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
                <label class="form-label">Select Icon</label>
                <div class="emoji-picker" id="newCategoryEmojiPicker">
                    <!-- Emoji options will be rendered by JS -->
                </div>
                <input type="hidden" id="newCategoryEmoji" value="📦">
            </div>
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
            <div class="form-group">
                <label class="form-label">Category Icon</label>
                <div class="emoji-picker" id="editCategoryEmojiPicker">
                    <!-- Emoji options will be rendered by JS -->
                </div>
                <input type="hidden" id="editCategoryEmoji" value="📦">
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
            <div class="delete-section" id="editCategoryDeleteSection">
                <button class="btn btn-danger btn-block" id="deleteCategoryBtn" onclick="showDeleteCategoryConfirm()">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                    Delete Category
                </button>
                <p class="delete-warning" id="deleteCategoryWarning">This will remove all variants and inventory under this category.</p>
                <p class="delete-warning" id="deleteCategoryStockInfo" style="display: none; color: var(--warning); font-weight: 500;"></p>
            </div>
        </div>
    </div>
</div>
`;

// Delete Category Confirmation Modal
export const DeleteCategoryModalTemplate = `
<div class="modal-overlay" id="deleteCategoryModal" onclick="closeDeleteCategoryModal()">
    <div class="modal modal-small" onclick="event.stopPropagation()">
        <div class="modal-header" style="background: linear-gradient(135deg, var(--danger), #dc2626);">
            <h3 class="modal-title" style="color: white;">Delete Category</h3>
            <button class="modal-close" onclick="closeDeleteCategoryModal()" style="color: white;">&times;</button>
        </div>
        <div style="padding: 24px;">
            <div class="delete-confirm-box">
                <svg width="48" height="48" fill="none" stroke="var(--danger)" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <h4>Are you sure?</h4>
                <p>You are about to delete <strong id="deleteCategoryName"></strong> and all its variants.</p>
                <p class="delete-impact">This action cannot be undone. Inventory data will be removed.</p>
            </div>
            <div class="cb-actions" style="margin-top: 20px;">
                <button class="btn btn-outline" onclick="closeDeleteCategoryModal()">Cancel</button>
                <button class="btn btn-danger" onclick="confirmDeleteCategory()">
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
