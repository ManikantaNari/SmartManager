// Sale Page Template

export const SaleTemplate = `
<div class="page" id="page-sale">
    <div class="tabs" id="saleTabs">
        <button class="tab active" onclick="showSaleStep('products')">1. Products</button>
        <button class="tab" onclick="showSaleStep('customer')">2. Customer</button>
        <button class="tab" onclick="showSaleStep('payment')">3. Payment</button>
    </div>

    <!-- Step 1: Products -->
    <div id="sale-step-products">
        <div class="search-box">
            <svg fill="none" height="20" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="20">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input id="productSearch" oninput="filterProducts()" placeholder="Search products..." type="text">
        </div>
        <div class="card">
            <div class="card-title">Select Category</div>
            <div class="category-grid" id="categoryGrid"></div>
        </div>
        <div class="card" id="variantCard" style="display: none;">
            <div class="card-title" id="variantCardTitle">Select Variant</div>
            <div class="variant-grid" id="variantGrid"></div>
        </div>
        <div class="card" id="cartCard" style="display: none;">
            <div class="card-title">Cart (<span id="cartCount">0</span> items)</div>
            <div id="cartItems"></div>
            <div class="cart-summary">
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span id="cartSubtotal">₹0</span>
                </div>
                <div class="summary-row total">
                    <span>Total</span>
                    <span id="cartTotal">₹0</span>
                </div>
            </div>
            <button class="btn btn-primary btn-block" onclick="showSaleStep('customer')" style="margin-top: 16px;">
                Continue
            </button>
        </div>
    </div>

    <!-- Step 2: Customer -->
    <div id="sale-step-customer" style="display: none;">
        <div class="card">
            <div class="card-title">Customer Details (Optional)</div>
            <div class="form-group">
                <label class="form-label">Customer Name</label>
                <input class="form-input" id="customerName" placeholder="Enter name" type="text">
            </div>
            <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input class="form-input" id="customerPhone" placeholder="Enter 10-digit number" type="tel">
            </div>
            <p style="color: var(--gray); font-size: 13px; margin-top: 8px;">
                Leave empty for walk-in customer
            </p>
        </div>
        <div class="card">
            <div class="card-title">Select Existing Customer</div>
            <div class="search-box">
                <svg fill="none" height="20" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="20">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                </svg>
                <input id="customerSearch" oninput="searchCustomers()" placeholder="Search customers..." type="text">
            </div>
            <div id="customerList"></div>
        </div>
        <div style="display: flex; gap: 12px; margin-top: 16px;">
            <button class="btn btn-outline" onclick="showSaleStep('products')" style="flex: 1;">Back</button>
            <button class="btn btn-primary" onclick="showSaleStep('payment')" style="flex: 2;">Continue</button>
        </div>
    </div>

    <!-- Step 3: Payment -->
    <div id="sale-step-payment" style="display: none;">
        <div class="card">
            <div class="card-title">Order Summary</div>
            <div id="paymentSummary"></div>
            <div class="cart-summary" style="background: var(--light); color: var(--dark);">
                <div class="summary-row total" style="border-top-color: var(--border);">
                    <span>Total Amount</span>
                    <span id="paymentTotal">₹0</span>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-title">Payment Method</div>
            <div style="display: flex; gap: 12px;">
                <button class="btn btn-outline" id="btnCash" onclick="selectPayment('Cash')" style="flex: 1;">Cash</button>
                <button class="btn btn-outline" id="btnUPI" onclick="selectPayment('UPI')" style="flex: 1;">UPI</button>
            </div>
        </div>
        <div style="margin-top: 16px;">
            <button class="btn btn-primary-outline btn-block" onclick="showCreateBookingModal()">
                Book with Advance
            </button>
        </div>
        <div style="display: flex; gap: 12px; margin-top: 12px;">
            <button class="btn btn-outline" onclick="showSaleStep('customer')" style="flex: 1;">Back</button>
            <button class="btn btn-success" id="completeSaleBtn" onclick="completeSale()" style="flex: 2;">Complete Sale</button>
        </div>
    </div>
</div>
`;
