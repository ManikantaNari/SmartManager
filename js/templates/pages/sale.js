// Sale Page Template

export const SaleTemplate = `
<div class="page" id="page-sale">
    <div class="tabs" id="saleTabs">
        <button class="tab active" onclick="showSaleStep('products')" data-i18n="sale.products">1. Products</button>
        <button class="tab" onclick="showSaleStep('customer')" data-i18n="sale.customer">2. Customer</button>
        <button class="tab" onclick="showSaleStep('payment')" data-i18n="sale.payment">3. Payment</button>
    </div>

    <!-- Step 1: Products -->
    <div id="sale-step-products">
        <div class="search-box">
            <svg fill="none" height="20" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="20">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input id="productSearch" oninput="filterProducts()" data-i18n-placeholder="sale.searchProducts" placeholder="Search products..." type="text">
        </div>
        <div class="card">
            <div class="card-title" data-i18n="sale.selectCategory">Select Category</div>
            <div class="category-grid" id="categoryGrid"></div>
        </div>
        <div class="card" id="variantCard" style="display: none;">
            <div class="card-title" id="variantCardTitle" data-i18n="sale.selectVariant">Select Variant</div>
            <div class="variant-grid" id="variantGrid"></div>
        </div>
        <div class="card" id="cartCard" style="display: none;">
            <div class="card-title"><span data-i18n="sale.cart">Cart</span> (<span id="cartCount">0</span> <span data-i18n="common.items">items</span>)</div>
            <div id="cartItems"></div>
            <div class="cart-summary">
                <div class="summary-row">
                    <span data-i18n="sale.subtotal">Subtotal</span>
                    <span id="cartSubtotal">₹0</span>
                </div>
                <div class="summary-row total">
                    <span data-i18n="sale.total">Total</span>
                    <span id="cartTotal">₹0</span>
                </div>
            </div>
            <button class="btn btn-primary btn-block" onclick="showSaleStep('customer')" style="margin-top: 16px;" data-i18n="common.continue">
                Continue
            </button>
        </div>
    </div>

    <!-- Step 2: Customer -->
    <div id="sale-step-customer" style="display: none;">
        <div class="card">
            <div class="card-title" data-i18n="sale.customerDetailsOptional">Customer Details (Optional)</div>
            <div class="form-group">
                <label class="form-label" data-i18n="customers.name">Customer Name</label>
                <input class="form-input" id="customerName" data-i18n-placeholder="customers.enterName" placeholder="Enter name" type="text">
            </div>
            <div class="form-group">
                <label class="form-label" data-i18n="customers.phone">Phone Number</label>
                <input class="form-input" id="customerPhone" data-i18n-placeholder="customers.enterPhone" placeholder="Enter 10-digit number" type="tel">
            </div>
            <p style="color: var(--gray); font-size: 13px; margin-top: 8px;" data-i18n="sale.walkInNote">
                Leave empty for walk-in customer
            </p>
        </div>
        <div class="card">
            <div class="card-title" data-i18n="sale.selectExistingCustomer">Select Existing Customer</div>
            <div class="search-box">
                <svg fill="none" height="20" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="20">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                </svg>
                <input id="customerSearch" oninput="searchCustomers()" data-i18n-placeholder="customers.search" placeholder="Search customers..." type="text">
            </div>
            <div id="customerList"></div>
        </div>
        <div style="display: flex; gap: 12px; margin-top: 16px;">
            <button class="btn btn-outline" onclick="showSaleStep('products')" style="flex: 1;" data-i18n="common.back">Back</button>
            <button class="btn btn-primary" onclick="showSaleStep('payment')" style="flex: 2;" data-i18n="common.continue">Continue</button>
        </div>
    </div>

    <!-- Step 3: Payment -->
    <div id="sale-step-payment" style="display: none;">
        <div class="card">
            <div class="card-title" data-i18n="sale.orderSummary">Order Summary</div>
            <div id="paymentSummary"></div>
            <div class="cart-summary" style="background: var(--light); color: var(--dark);">
                <div class="summary-row total" style="border-top-color: var(--border);">
                    <span data-i18n="sale.totalAmount">Total Amount</span>
                    <span id="paymentTotal">₹0</span>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-title" data-i18n="sale.paymentMethod">Payment Method</div>
            <!-- Simple: Cash or UPI (default) -->
            <div id="paymentMethodSimple">
                <div style="display: flex; gap: 12px;">
                    <button class="btn btn-outline" id="btnCash" onclick="selectPayment('Cash')" style="flex: 1;" data-i18n="sale.cash">Cash</button>
                    <button class="btn btn-outline" id="btnUPI" onclick="selectPayment('UPI')" style="flex: 1;">UPI</button>
                </div>
            </div>
            <!-- Split: Cash + UPI amounts (shown when toggle is on) -->
            <div id="paymentMethodSplit" style="display: none; margin-top: 4px;">
                <div class="payment-split">
                    <div class="payment-split-row">
                        <span class="payment-method-label">💵 Cash</span>
                        <div class="price-input-group" style="flex: 1;">
                            <span class="currency">₹</span>
                            <input id="paymentCash" type="number" placeholder="0" min="0" oninput="onCashInput()">
                        </div>
                    </div>
                    <div class="payment-split-row">
                        <span class="payment-method-label">📱 UPI</span>
                        <div class="price-input-group" style="flex: 1;">
                            <span class="currency">₹</span>
                            <input id="paymentUPI" type="number" placeholder="0" min="0" oninput="onUPIInput()">
                        </div>
                    </div>
                    <div id="paymentBalance" class="payment-balance"></div>
                </div>
            </div>
            <!-- Split toggle -->
            <div style="display: flex; align-items: center; gap: 10px; margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--border);">
                <label class="toggle-switch" style="margin: 0;">
                    <input type="checkbox" id="splitPaymentToggle" onchange="toggleSplitPayment()">
                    <span class="toggle-slider"></span>
                </label>
                <span style="font-size: 14px; color: var(--gray);">Split Payment (Cash + UPI)</span>
            </div>
        </div>
        <div style="margin-top: 16px;">
            <button class="btn btn-primary-outline btn-block" onclick="showCreateBookingModal()" data-i18n="sale.bookWithAdvance">
                Book with Advance
            </button>
        </div>
        <div style="display: flex; gap: 12px; margin-top: 12px;">
            <button class="btn btn-outline" onclick="showSaleStep('customer')" style="flex: 1;" data-i18n="common.back">Back</button>
            <button class="btn btn-success" id="completeSaleBtn" onclick="completeSale()" style="flex: 2;" data-i18n="sale.completeSale">Complete Sale</button>
        </div>
    </div>
</div>
`;
