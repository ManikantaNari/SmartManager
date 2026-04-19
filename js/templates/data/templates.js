// Data Templates (for dynamic rendering with Template engine)

export const DataTemplates = `
<!-- Empty State Template -->
<template id="tpl-empty">
    <div class="empty-state">
        <h3 data-field="title"></h3>
        <p data-field="message"></p>
    </div>
</template>

<!-- Stat Card Template -->
<template id="tpl-stat-card">
    <div class="stat-card">
        <div class="stat-label" data-field="label"></div>
        <div class="stat-value" data-field="value"></div>
    </div>
</template>

<!-- Category Button Template -->
<template id="tpl-category-btn">
    <div class="category-btn" data-value="">
        <div class="icon" data-field="icon"></div>
        <span data-field="name"></span>
    </div>
</template>

<!-- Variant Button Template -->
<template id="tpl-variant-btn">
    <div class="variant-btn" data-value="">
        <div class="name" data-field="name"></div>
        <div class="price" data-field="price"></div>
        <div class="stock" data-field="stock"></div>
    </div>
</template>

<!-- Cart Item Template -->
<template id="tpl-cart-item">
    <div class="cart-item" data-index="">
        <div class="cart-item-info">
            <h4 data-field="category"></h4>
            <p data-field="variant"></p>
            <div class="cart-item-actions">
                <button class="qty-btn" data-action="decrease">-</button>
                <span class="qty-value" data-field="qty"></span>
                <button class="qty-btn" data-action="increase">+</button>
            </div>
        </div>
        <div class="cart-item-price">
            <div class="price" data-field="total"></div>
            <button class="remove-btn" data-action="remove">Remove</button>
        </div>
    </div>
</template>

<!-- Transaction Row Template -->
<template id="tpl-transaction-row">
    <div class="list-item transaction-row" data-sale-id="" style="cursor: pointer;">
        <div class="list-item-info">
            <h4 data-field="customer"></h4>
            <p data-field="details"></p>
        </div>
        <div style="text-align: right;">
            <strong data-field="total"></strong>
            <p style="font-size: 11px; color: var(--primary);">Tap to view</p>
        </div>
    </div>
</template>

<!-- Low Stock Item Template -->
<template id="tpl-low-stock-item">
    <div class="list-item">
        <div class="list-item-info">
            <h4 data-field="name"></h4>
            <p data-field="qty"></p>
        </div>
        <span class="badge badge-danger">Low Stock</span>
    </div>
</template>

<!-- Stock Card Template -->
<template id="tpl-stock-card">
    <div class="card" data-key="" style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>
                <h4 style="font-size: 16px; margin-bottom: 4px;" data-field="category"></h4>
                <p style="color: var(--gray); font-size: 14px;" data-field="variant"></p>
            </div>
            <span class="badge" data-field="stockBadge"></span>
        </div>
        <div style="display: flex; gap: 20px; margin-top: 12px; font-size: 14px; color: var(--gray);" data-field="details"></div>
        <button class="btn btn-outline btn-sm admin-only" style="margin-top: 12px;" data-action="edit">
            Edit Stock
        </button>
    </div>
</template>

<!-- Customer Card Template -->
<template id="tpl-customer-card">
    <div class="card" data-phone="" style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>
                <h4 style="font-size: 16px; margin-bottom: 4px;" data-field="name"></h4>
                <p style="color: var(--gray); font-size: 14px;" data-field="phone"></p>
                <p style="color: var(--gray); font-size: 13px;" data-field="email"></p>
            </div>
            <div style="text-align: right;">
                <p style="font-weight: 600;" data-field="totalSpent"></p>
                <p style="font-size: 12px; color: var(--gray);" data-field="orderCount"></p>
                <div class="customer-actions" style="margin-top: 10px; display: flex; gap: 6px; justify-content: flex-end;" data-field="actions"></div>
            </div>
        </div>
    </div>
</template>

<!-- Customer Search Result Template -->
<template id="tpl-customer-search">
    <div class="list-item" data-name="" data-phone="" style="cursor: pointer;">
        <div class="list-item-info">
            <h4 data-field="name"></h4>
            <p data-field="phone"></p>
        </div>
    </div>
</template>

<!-- Product Card Template -->
<template id="tpl-product-card">
    <div class="card" style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <h4 style="font-size: 16px;" data-field="name"></h4>
            <span class="badge badge-success" data-field="variantCount"></span>
        </div>
        <p style="color: var(--gray); font-size: 13px; margin-top: 8px;" data-field="variants"></p>
    </div>
</template>

<!-- Best Seller Row Template -->
<template id="tpl-bestseller-row">
    <div class="list-item" style="display: flex; justify-content: space-between; align-items: center;">
        <div class="list-item-info">
            <h4 data-field="rank"></h4>
            <p data-field="stats"></p>
        </div>
        <div style="text-align: right; font-size: 13px;">
            <div style="color: var(--gray);">Revenue: <span style="font-weight: 600; color: var(--dark);" data-field="revenue"></span></div>
            <div class="profit-display profit-amount" style="color: var(--gray);">Profit: <span style="font-weight: 600; color: var(--success);" data-field="profit"></span></div>
            <div class="profit-display profit-percent" style="color: var(--gray);">Margin: <span style="font-weight: 600; color: var(--success);" data-field="profitPercent"></span></div>
        </div>
    </div>
</template>

<!-- Payment Summary Item Template -->
<template id="tpl-payment-item">
    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);">
        <span data-field="description"></span>
        <strong data-field="amount"></strong>
    </div>
</template>

<!-- Transaction Detail Row Template -->
<template id="tpl-detail-row">
    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
        <span style="color: var(--gray);" data-field="label"></span>
        <strong data-field="value"></strong>
    </div>
</template>

<!-- Transaction Item Template -->
<template id="tpl-transaction-item">
    <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border);">
        <div>
            <strong data-field="category"></strong>
            <p style="font-size: 13px; color: var(--gray);" data-field="details"></p>
        </div>
        <strong data-field="total"></strong>
    </div>
</template>

<!-- Add New Button Template -->
<template id="tpl-add-btn">
    <div class="category-btn add-new" data-action="add">
        <div class="icon">+</div>
        <span data-field="text">Add New</span>
    </div>
</template>

<!-- Variant Add Button Template -->
<template id="tpl-variant-add-btn">
    <div class="variant-btn add-new" data-action="add">
        <div class="name" data-field="text">+ Add New</div>
    </div>
</template>
`;
