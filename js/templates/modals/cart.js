// Add to Cart Modal Template

export const CartModalTemplate = `
<div class="modal-overlay" id="addCartModal" onclick="closeAddCartModal()">
    <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3 class="modal-title">Add to Cart</h3>
            <button class="modal-close" onclick="closeAddCartModal()">&times;</button>
        </div>
        <div style="text-align: center; margin-bottom: 20px;">
            <h4 id="cartModalProduct" style="font-size: 18px; margin-bottom: 8px;"></h4>
            <p id="cartModalVariant" style="color: var(--gray);"></p>
        </div>
        <div class="form-group">
            <label class="form-label">Selling Price</label>
            <div class="price-input-group">
                <span class="currency">₹</span>
                <input id="cartModalPrice" placeholder="0" type="number">
            </div>
            <p style="color: var(--gray); font-size: 13px; margin-top: 8px;">
                Suggested: ₹<span id="cartModalSuggested">0</span>
            </p>
        </div>
        <div class="form-group">
            <label class="form-label">Quantity</label>
            <div style="display: flex; align-items: center; gap: 16px;">
                <button class="qty-btn" onclick="changeCartQty(-1)">-</button>
                <span id="cartModalQty" style="font-size: 24px; font-weight: 700;">1</span>
                <button class="qty-btn" onclick="changeCartQty(1)">+</button>
            </div>
        </div>
        <button class="btn btn-primary btn-block" onclick="addToCart()">Add to Cart</button>
    </div>
</div>
`;
