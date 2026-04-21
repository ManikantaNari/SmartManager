// Add Product Modal Template

export const AddProductModalTemplate = `
<div class="modal-overlay" id="addProductModal" onclick="closeAddProductModal()">
    <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3 class="modal-title" data-i18n="products.addProduct">Add New Product</h3>
            <button class="modal-close" onclick="closeAddProductModal()">&times;</button>
        </div>
        <div class="form-group">
            <label class="form-label" data-i18n="products.productName">Product Name</label>
            <input class="form-input" id="newProductName" data-i18n-placeholder="products.productNamePlaceholder" placeholder="e.g., Almara" type="text">
        </div>
        <div class="form-group">
            <label class="form-label" data-i18n="products.variantsPerLine">Variants (one per line)</label>
            <textarea class="form-input" id="newProductVariants" data-i18n-placeholder="products.variantsPlaceholder" placeholder="e.g.,&#10;2 Door&#10;3 Door&#10;4 Door" rows="4"></textarea>
        </div>
        <button class="btn btn-primary btn-block" onclick="saveNewProduct()" data-i18n="products.addProduct">Add Product</button>
    </div>
</div>
`;
