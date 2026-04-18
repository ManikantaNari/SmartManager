// Add Category Modal Template

export const AddCategoryModalTemplate = `
<div class="modal-overlay" id="addCategoryModal" onclick="closeAddCategoryModal()">
    <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3 class="modal-title">Add New Category</h3>
            <button class="modal-close" onclick="closeAddCategoryModal()">&times;</button>
        </div>
        <div class="form-group">
            <label class="form-label">Category Name</label>
            <input class="form-input" id="newCategoryName" placeholder="e.g., Almara" type="text">
        </div>
        <button class="btn btn-primary btn-block" onclick="saveNewCategory()">Add Category</button>
    </div>
</div>
`;
