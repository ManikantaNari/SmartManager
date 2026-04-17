// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAGASAgCn9WFzXz7aBYqXTKe6Fuys7kjVI",
    authDomain: "mani-smart-manager.firebaseapp.com",
    projectId: "mani-smart-manager",
    storageBucket: "mani-smart-manager.firebasestorage.app",
    messagingSenderId: "665918801337",
    appId: "1:665918801337:web:ab8470a7a9e0247fe72268"
};

// Initialize Firebase
let db;
let isOnline = true;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    db.enablePersistence().catch(err => console.log('Persistence error:', err));
    // Auth
    firebase.auth().signInAnonymously().catch(err => console.log('Auth error:', err));
} catch (e) {
    console.log('Firebase init error:', e);
}
// ==================== DATA ====================
let products = {
    'Mattress': ['Single (3x6)', 'Double (4x6)', 'Queen (5x6)', 'King (6x6)', '6x6.5', '5x6.5'],
    'Cot': ['Single', 'Double', 'Queen', 'King', 'Wooden', 'Metal'],
    'TV Stand': ['Small', 'Medium', 'Large', 'Wall Mount', 'Corner'],
    'Chair': ['Plastic', 'Office Chair', 'Dining Chair', 'Recliner'],
    'Table': ['Study Table', 'Computer Table'],
    'Fan': ['Ceiling Fan', 'Table Fan', 'Pedestal Fan', 'Wall Fan', 'Exhaust Fan'],
    'Pillow': ['Standard', 'Memory Foam'],
    'Bed Sheet': ['Single', 'Double', 'King', 'Cotton'],
    'Sofa': ['2 Seater', '3 Seater', 'L Shape', 'Recliner Sofa'],
    'Dining Table': ['4 Seater', '6 Seater', '8 Seater'],
    'Shoe Rack': ['3 Layer', '4 Layer', '5 Layer']
};
let inventory = {};
let customers = [];
let sales = [];
let cart = [];
let adminPin = '11111';
let isAdminUnlocked = false;
let currentPinAction = '';
let enteredPin = '';
let selectedCategory = null;
let selectedVariant = null;
let selectedPayment = null;
let currentSaleData = null;
// Role management
let userRole = null; // 'admin' or 'worker'
let loginPin = '';
// Master PIN for recovery (hardcoded, not changeable)
const MASTER_PIN = '181866';
let masterPin = '';
let newPin = '';
// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    loadLocalData();
    // Don't init app yet - wait for login
});
// ==================== LOGIN ====================
function selectRole(role) {
    if (role === 'admin') {
        // Show PIN entry
        document.getElementById('loginOptions').style.display = 'none';
        document.getElementById('loginPinSection').classList.add('show');
        loginPin = '';
        updateLoginPinDisplay();
    } else {
        // Worker - no PIN needed
        completeLogin('worker');
    }
}
function enterLoginPin(num) {
    if (loginPin.length >= 5) return;
    loginPin += num;
    updateLoginPinDisplay();
    if (loginPin.length === 5) {
        setTimeout(checkLoginPin, 200);
    }
}
function deleteLoginPin() {
    loginPin = loginPin.slice(0, -1);
    updateLoginPinDisplay();
}
function clearLoginPin() {
    loginPin = '';
    updateLoginPinDisplay();
    document.getElementById('loginError').textContent = '';
}
function updateLoginPinDisplay() {
    const dots = document.querySelectorAll('#loginPinDisplay .login-pin-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('filled', i < loginPin.length);
    });
}
function checkLoginPin() {
    if (loginPin === adminPin) {
        completeLogin('admin');
    } else {
        document.getElementById('loginError').textContent = 'Incorrect PIN. Try again.';
        loginPin = '';
        updateLoginPinDisplay();
    }
}
function backToRoleSelect() {
    document.getElementById('loginOptions').style.display = 'flex';
    document.getElementById('loginPinSection').classList.remove('show');
    document.getElementById('forgotPinSection').classList.remove('show');
    document.getElementById('newPinSection').classList.remove('show');
    loginPin = '';
    masterPin = '';
    newPin = '';
    document.getElementById('loginError').textContent = '';
}
function completeLogin(role) {
    userRole = role;
    isAdminUnlocked = (role === 'admin');
    // Update body class for CSS-based access control
    document.body.classList.remove('is-admin', 'is-worker');
    document.body.classList.add('is-' + role);
    // Update role badge
    const badge = document.getElementById('roleBadge');
    badge.textContent = role === 'admin' ? 'Owner' : 'Manager';
    badge.classList.toggle('worker', role === 'worker');
    // Hide login screen
    document.getElementById('loginScreen').classList.add('hidden');
    // Now initialize the app
    initApp();
    setDefaultDates();
    checkBackupReminder();
}
function logout() {
    if (confirm('Switch to a different user?')) {
        userRole = null;
        isAdminUnlocked = false;
        loginPin = '';
        masterPin = '';
        newPin = '';
        document.body.classList.remove('is-admin', 'is-worker');
        // Reset login screen
        document.getElementById('loginOptions').style.display = 'flex';
        document.getElementById('loginPinSection').classList.remove('show');
        document.getElementById('forgotPinSection').classList.remove('show');
        document.getElementById('newPinSection').classList.remove('show');
        document.getElementById('loginError').textContent = '';
        updateLoginPinDisplay();
        // Show login screen
        document.getElementById('loginScreen').classList.remove('hidden');
        // Go back to dashboard
        showPage('dashboard');
    }
}
// ==================== FORGOT PIN ====================
function showForgotPin() {
    document.getElementById('loginPinSection').classList.remove('show');
    document.getElementById('forgotPinSection').classList.add('show');
    masterPin = '';
    updateMasterPinDisplay();
    document.getElementById('masterPinError').textContent = '';
}
function backToLoginPin() {
    document.getElementById('forgotPinSection').classList.remove('show');
    document.getElementById('loginPinSection').classList.add('show');
    masterPin = '';
    loginPin = '';
    updateLoginPinDisplay();
}
function enterMasterPin(num) {
    if (masterPin.length >= 6) return;
    masterPin += num;
    updateMasterPinDisplay();
    if (masterPin.length === 6) {
        setTimeout(checkMasterPin, 200);
    }
}
function deleteMasterPin() {
    masterPin = masterPin.slice(0, -1);
    updateMasterPinDisplay();
}
function clearMasterPin() {
    masterPin = '';
    updateMasterPinDisplay();
    document.getElementById('masterPinError').textContent = '';
}
function updateMasterPinDisplay() {
    const dots = document.querySelectorAll('#masterPinDisplay .login-pin-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('filled', i < masterPin.length);
    });
}
function checkMasterPin() {
    if (masterPin === MASTER_PIN) {
        // Master PIN correct - show new PIN entry
        document.getElementById('forgotPinSection').classList.remove('show');
        document.getElementById('newPinSection').classList.add('show');
        newPin = '';
        updateNewPinDisplay();
        document.getElementById('newPinError').textContent = '';
    } else {
        document.getElementById('masterPinError').textContent = 'Incorrect Master PIN. Try again.';
        masterPin = '';
        updateMasterPinDisplay();
    }
}
function enterNewPin(num) {
    if (newPin.length >= 5) return;
    newPin += num;
    updateNewPinDisplay();
    if (newPin.length === 5) {
        setTimeout(saveNewOwnerPin, 200);
    }
}
function deleteNewPin() {
    newPin = newPin.slice(0, -1);
    updateNewPinDisplay();
}
function clearNewPin() {
    newPin = '';
    updateNewPinDisplay();
}
function updateNewPinDisplay() {
    const dots = document.querySelectorAll('#newPinDisplay .login-pin-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('filled', i < newPin.length);
    });
}
function saveNewOwnerPin() {
    adminPin = newPin;
    localStorage.setItem('sm_admin_pin', adminPin);
    // Reset and go back to login
    document.getElementById('newPinSection').classList.remove('show');
    document.getElementById('loginPinSection').classList.add('show');
    loginPin = '';
    newPin = '';
    masterPin = '';
    updateLoginPinDisplay();
    document.getElementById('loginError').textContent = '';
    alert('PIN updated successfully! Please login with your new PIN.');
}
function initApp() {
    renderCategoryGrid();
    renderStockCategoryGrid();
    renderProductsList();
    loadInventory();
    loadCustomers();
    loadSales();
    updateDashboard();
    updateSyncStatus();
    // Online/offline detection
    window.addEventListener('online', () => { isOnline = true; updateSyncStatus(); });
    window.addEventListener('offline', () => { isOnline = false; updateSyncStatus(); });
}
function loadLocalData() {
    const savedProducts = localStorage.getItem('sm_products');
    const savedPin = localStorage.getItem('sm_admin_pin');
    if (savedProducts) products = JSON.parse(savedProducts);
    if (savedPin) adminPin = savedPin;
}
function updateSyncStatus() {
    const dot = document.getElementById('syncDot');
    const text = document.getElementById('syncText');
    if (isOnline) {
        dot.classList.remove('offline');
        text.textContent = 'Synced';
    } else {
        dot.classList.add('offline');
        text.textContent = 'Offline';
    }
}
// ==================== NAVIGATION ====================
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
    document.querySelectorAll('.nav-item')[getNavIndex(pageId)].classList.add('active');
    if (pageId === 'dashboard') updateDashboard();
    if (pageId === 'inventory') renderStockList();
    if (pageId === 'customers') renderAllCustomers();
    if (pageId === 'reports') loadDailyReport();
    if (pageId === 'sale') { resetCart(); renderCategoryGrid(); }
}
function getNavIndex(pageId) {
    const map = { 'dashboard': 0, 'sale': 1, 'inventory': 2, 'customers': 3, 'reports': 4 };
    return map[pageId] || 0;
}
function showSettings() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-settings').classList.add('active');
}
// ==================== DASHBOARD ====================
function updateDashboard() {
    const today = new Date().toISOString().split('T')[0];
    const todaySales = sales.filter(s => s.date === today);
    let totalSales = 0;
    let totalProfit = 0;
    let totalItems = 0;
    todaySales.forEach(sale => {
        totalSales += sale.total;
        totalProfit += sale.profit || 0;
        totalItems += sale.items.reduce((sum, item) => sum + item.qty, 0);
    });
    document.getElementById('todaySales').textContent = '₹' + totalSales.toLocaleString();
    document.getElementById('todayItems').textContent = totalItems;
    document.getElementById('todayProfit').textContent = '₹' + totalProfit.toLocaleString();
    document.getElementById('todayTxn').textContent = todaySales.length;
    // Low stock alerts
    checkLowStock();
    // Recent sales
    renderRecentSales(todaySales);
}
function checkLowStock() {
    const lowStockItems = [];
    for (const [key, data] of Object.entries(inventory)) {
        if (data.qty <= (data.alertQty || 0)) {
            lowStockItems.push({ key, ...data });
        }
    }
    const alertDiv = document.getElementById('lowStockAlert');
    const listDiv = document.getElementById('lowStockList');
    if (lowStockItems.length > 0) {
        alertDiv.style.display = 'block';
        listDiv.innerHTML = lowStockItems.map(item => `
 <div class="list-item">
 <div class="list-item-info">
 <h4>${item.key}</h4>
 <p>${item.qty} left</p>
 </div>
 <span class="badge badge-danger">Low Stock</span>
 </div>
 `).join('');
    } else {
        alertDiv.style.display = 'none';
    }
}
function renderRecentSales(todaySales) {
    const container = document.getElementById('recentSales');
    if (todaySales.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No sales today</p></div>';
        return;
    }
    container.innerHTML = todaySales.slice(-5).reverse().map(sale => `
 <div class="list-item" onclick="showTransactionDetails('${sale.id}')" style="cursor: pointer;">
 <div class="list-item-info">
 <h4>${sale.customer?.name || 'Walk-in Customer'}</h4>
 <p>${sale.items.length} items | ${sale.paymentMethod} | ${sale.time}</p>
 </div>
 <div style="text-align: right;">
 <strong>₹${sale.total.toLocaleString()}</strong>
 <p style="font-size: 11px; color: var(--primary);">Tap to view</p>
 </div>
 </div>
 `).join('');
}
// ==================== SALE ====================
function showSaleStep(step) {
    document.querySelectorAll('#saleTabs .tab').forEach(t => t.classList.remove('active'));
    document.getElementById('sale-step-products').style.display = step === 'products' ? 'block' : 'none';
    document.getElementById('sale-step-customer').style.display = step === 'customer' ? 'block' : 'none';
    document.getElementById('sale-step-payment').style.display = step === 'payment' ? 'block' : 'none';
    if (step === 'products') document.querySelector('#saleTabs .tab:nth-child(1)').classList.add('active');
    if (step === 'customer') document.querySelector('#saleTabs .tab:nth-child(2)').classList.add('active');
    if (step === 'payment') {
        document.querySelector('#saleTabs .tab:nth-child(3)').classList.add('active');
        renderPaymentSummary();
    }
}
function renderCategoryGrid() {
    const grid = document.getElementById('categoryGrid');
    const icons = {
        'Mattress': '🛏️', 'Cot': '🛏️', 'TV Stand': '📺', 'Chair': '🪑',
        'Table': '🪵', 'Fan': '☢️', 'Pillow': '☁️', 'Bed Sheet': '🧺',
        'Sofa': '🛋️', 'Dining Table': '🍽️', 'Shoe Rack': '👟'
    };
    let html = Object.keys(products).map(cat => `
 <div class="category-btn ${selectedCategory === cat ? 'active' : ''}" onclick="selectCategory('${cat}')">
 <div class="icon">${icons[cat] || ''}</div>
 ${cat}
 </div>
 `).join('');
    // Add "+" button for new category
    html += `
 <div class="category-btn add-new" onclick="showAddCategoryModal()">
 <div class="icon"></div>
 Add New
 </div>
 `;
    grid.innerHTML = html;
}
function selectCategory(cat) {
    selectedCategory = cat;
    renderCategoryGrid();
    renderVariantGrid();
}
function renderVariantGrid() {
    const card = document.getElementById('variantCard');
    const grid = document.getElementById('variantGrid');
    const title = document.getElementById('variantCardTitle');
    if (!selectedCategory) {
        card.style.display = 'none';
        return;
    }
    card.style.display = 'block';
    title.textContent = selectedCategory + ' - Select Variant';
    const variants = products[selectedCategory] || [];
    let html = variants.map(v => {
        const key = `${selectedCategory}|${v}`;
        const inv = inventory[key] || { qty: 0, price: 0 };
        const isLow = inv.qty <= (inv.alertQty || 0);
        return `
 <div class="variant-btn" onclick="selectVariantForCart('${selectedCategory}', '${v}')">
 <div class="name">${v}</div>
 <div class="price">₹${inv.price?.toLocaleString() || '0'}</div>
 <div class="stock ${isLow ? 'low' : ''}">Stock: ${inv.qty}</div>
 </div>
 `;
    }).join('');
    // Add "+" button for new variant
    html += `
 <div class="variant-btn add-new" onclick="showAddVariantModal()">
 <div class="name"> Add New</div>
 </div>
 `;
    grid.innerHTML = html;
}
function filterProducts() {
    const search = document.getElementById('productSearch').value.toLowerCase();
    // Simple filter - just highlight matching categories
    document.querySelectorAll('.category-btn').forEach(btn => {
        const matches = btn.textContent.toLowerCase().includes(search);
        btn.style.opacity = search && !matches ? '0.3' : '1';
    });
}
function selectVariantForCart(category, variant) {
    const key = `${category}|${variant}`;
    const inv = inventory[key] || { qty: 0, price: 0 };
    if (inv.qty <= 0) {
        showToast('Out of stock!');
        return;
    }
    selectedVariant = { category, variant, key };
    document.getElementById('cartModalProduct').textContent = category;
    document.getElementById('cartModalVariant').textContent = variant;
    document.getElementById('cartModalPrice').value = inv.price || '';
    document.getElementById('cartModalSuggested').textContent = inv.price?.toLocaleString() || '0';
    document.getElementById('cartModalQty').textContent = '1';
    document.getElementById('addCartModal').classList.add('show');
}
function closeAddCartModal() {
    document.getElementById('addCartModal').classList.remove('show');
}
function changeCartQty(delta) {
    const qtyEl = document.getElementById('cartModalQty');
    let qty = parseInt(qtyEl.textContent) + delta;
    const inv = inventory[selectedVariant.key] || { qty: 0 };
    qty = Math.max(1, Math.min(qty, inv.qty));
    qtyEl.textContent = qty;
}
function addToCart() {
    const price = parseFloat(document.getElementById('cartModalPrice').value) || 0;
    const qty = parseInt(document.getElementById('cartModalQty').textContent) || 1;
    const inv = inventory[selectedVariant.key] || {};
    cart.push({
        ...selectedVariant,
        price,
        qty,
        costPrice: inv.costPrice || 0
    });
    closeAddCartModal();
    renderCart();
    showToast('Added to cart');
}
function renderCart() {
    const cartCard = document.getElementById('cartCard');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    if (cart.length === 0) {
        cartCard.style.display = 'none';
        return;
    }
    cartCard.style.display = 'block';
    cartCount.textContent = cart.length;
    let subtotal = 0;
    cartItems.innerHTML = cart.map((item, i) => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        return `
 <div class="cart-item">
 <div class="cart-item-info">
 <h4>${item.category}</h4>
 <p>${item.variant}</p>
 <div class="cart-item-actions">
 <button class="qty-btn" onclick="updateCartQty(${i}, -1)">-</button>
 <span class="qty-value">${item.qty}</span>
 <button class="qty-btn" onclick="updateCartQty(${i}, 1)">+</button>
 </div>
 </div>
 <div class="cart-item-price">
 <div class="price">₹${itemTotal.toLocaleString()}</div>
 <button class="remove-btn" onclick="removeFromCart(${i})">Remove</button>
 </div>
 </div>
 `;
    }).join('');
    document.getElementById('cartSubtotal').textContent = '₹' + subtotal.toLocaleString();
    document.getElementById('cartTotal').textContent = '₹' + subtotal.toLocaleString();
}
function updateCartQty(index, delta) {
    const inv = inventory[cart[index].key] || { qty: 0 };
    cart[index].qty = Math.max(1, Math.min(cart[index].qty + delta, inv.qty));
    renderCart();
}
function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}
function resetCart() {
    cart = [];
    selectedCategory = null;
    selectedPayment = null;
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    renderCart();
    renderCategoryGrid();
    document.getElementById('variantCard').style.display = 'none';
    // Reset payment buttons to unselected state
    document.getElementById('btnCash').classList.remove('btn-primary');
    document.getElementById('btnCash').classList.add('btn-outline');
    document.getElementById('btnUPI').classList.remove('btn-primary');
    document.getElementById('btnUPI').classList.add('btn-outline');
}
// Customer selection for sale
function searchCustomers() {
    const search = document.getElementById('customerSearch').value.toLowerCase();
    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(search) ||
        c.phone.includes(search)
    );
    const container = document.getElementById('customerList');
    if (filtered.length === 0) {
        container.innerHTML = '<p style="color: var(--gray); text-align: center; padding: 20px;">No customers found</p>';
        return;
    }
    container.innerHTML = filtered.slice(0, 5).map(c => `
 <div class="list-item" onclick="selectCustomerForSale('${c.name}', '${c.phone}')" style="cursor: pointer;">
 <div class="list-item-info">
 <h4>${c.name}</h4>
 <p>${c.phone}</p>
 </div>
 </div>
 `).join('');
}
function selectCustomerForSale(name, phone) {
    document.getElementById('customerName').value = name;
    document.getElementById('customerPhone').value = phone;
    document.getElementById('customerSearch').value = '';
    document.getElementById('customerList').innerHTML = '';
}
// Payment
function renderPaymentSummary() {
    const container = document.getElementById('paymentSummary');
    let total = 0;
    container.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        return `
 <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);">
 <span>${item.category} - ${item.variant} x${item.qty}</span>
 <strong>₹${itemTotal.toLocaleString()}</strong>
 </div>
 `;
    }).join('');
    document.getElementById('paymentTotal').textContent = '₹' + total.toLocaleString();
}
function selectPayment(method) {
    selectedPayment = method;
    document.getElementById('btnCash').classList.toggle('btn-primary', method === 'Cash');
    document.getElementById('btnCash').classList.toggle('btn-outline', method !== 'Cash');
    document.getElementById('btnUPI').classList.toggle('btn-primary', method === 'UPI');
    document.getElementById('btnUPI').classList.toggle('btn-outline', method !== 'UPI');
}
function completeSale() {
    if (cart.length === 0) {
        showToast('Cart is empty. Add items first.');
        return;
    }
    if (!selectedPayment) {
        showToast('Please select a payment method (Cash or UPI)');
        return;
    }
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    let total = 0;
    let profit = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
        profit += (item.price - item.costPrice) * item.qty;
        // Update inventory
        if (inventory[item.key]) {
            inventory[item.key].qty -= item.qty;
            saveInventoryItem(item.key, inventory[item.key]);
        }
    });
    const sale = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
        items: cart.map(c => ({ ...c })),
        total,
        profit,
        paymentMethod: selectedPayment,
        customer: customerName ? { name: customerName, phone: customerPhone } : null
    };
    sales.push(sale);
    saveSale(sale);
    // Save customer if new
    if (customerName && customerPhone) {
        const existing = customers.find(c => c.phone === customerPhone);
        if (!existing) {
            const newCustomer = { name: customerName, phone: customerPhone, email: '' };
            customers.push(newCustomer);
            saveCustomer(newCustomer);
        }
    }
    currentSaleData = { ...sale, customerPhone };
    document.getElementById('saleCompleteAmount').textContent = 'Total: ₹' + total.toLocaleString();
    document.getElementById('smsBillSection').style.display = customerPhone ? 'block' : 'none';
    if (customerPhone) {
        document.getElementById('smsPreviewComplete').textContent = generateBillText(sale);
    }
    document.getElementById('saleCompleteModal').classList.add('show');
    resetCart();
    showSaleStep('products');
}
function generateBillText(saleData) {
    let billText = `SMART MANAGER BILL\n`;
    billText += `========================\n\n`;
    billText += `Date: ${saleData.date}\n`;
    billText += `Time: ${saleData.time}\n`;
    if (saleData.customer?.name) {
        billText += `Customer: ${saleData.customer.name}\n`;
    }
    billText += `\n------------------------\n`;
    billText += `Items:\n`;
    saleData.items.forEach(item => {
        billText += `- ${item.category} (${item.variant})\n`;
        billText += ` ${item.qty} x ₹${item.price.toLocaleString()} = ₹${(item.price * item.qty).toLocaleString()}\n`;
    });
    billText += `------------------------\n`;
    billText += `Total: ₹${saleData.total.toLocaleString()}\n`;
    billText += `Payment: ${saleData.paymentMethod}\n`;
    billText += `========================\n\n`;
    billText += `Thank you for your purchase!`;
    return billText;
}
function sendSMSBill() {
    if (!currentSaleData || !currentSaleData.customerPhone) return;
    const billText = generateBillText(currentSaleData);
    // Open SMS app with pre-filled message
    window.location.href = `sms:${currentSaleData.customerPhone}?body=${encodeURIComponent(billText)}`;
}
function closeSaleComplete() {
    document.getElementById('saleCompleteModal').classList.remove('show');
    currentSaleData = null;
    updateDashboard();
    showPage('dashboard');
}
// ==================== TRANSACTION DETAILS ====================
let selectedTransactionId = null;
function showTransactionDetails(saleId) {
    const sale = sales.find(s => s.id === saleId);
    if (!sale) {
        showToast('Transaction not found');
        return;
    }
    selectedTransactionId = saleId;
    const detailsHtml = `
 <div style="background: var(--light); border-radius: 12px; padding: 16px; margin-bottom: 16px;">
 <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
 <span style="color: var(--gray);">Date</span>
 <strong>${sale.date}</strong>
 </div>
 <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
 <span style="color: var(--gray);">Time</span>
 <strong>${sale.time}</strong>
 </div>
 <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
 <span style="color: var(--gray);">Customer</span>
 <strong>${sale.customer?.name || 'Walk-in'}</strong>
 </div>
 ${sale.customer?.phone ? `
 <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
 <span style="color: var(--gray);">Phone</span>
 <strong>${sale.customer.phone}</strong>
 </div>
 ` : ''}
 <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
 <span style="color: var(--gray);">Payment</span>
 <strong>${sale.paymentMethod}</strong>
 </div>
 </div>
 <div class="card-title">Items</div>
 ${sale.items.map(item => `
 <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border);">
 <div>
 <strong>${item.category}</strong>
 <p style="font-size: 13px; color: var(--gray);">${item.variant} x ${item.qty}</p>
 </div>
 <strong>₹${(item.price * item.qty).toLocaleString()}</strong>
 </div>
 `).join('')}
 <div style="display: flex; justify-content: space-between; padding: 16px 0; font-size: 18px;">
 <strong>Total</strong>
 <strong style="color: var(--success);">₹${sale.total.toLocaleString()}</strong>
 </div>
 `;
    document.getElementById('transactionDetails').innerHTML = detailsHtml;
    document.getElementById('smsPreview').textContent = generateBillText(sale);
    document.getElementById('transactionSmsSection').style.display = sale.customer?.phone ? 'block' : 'none';
    document.getElementById('transactionModal').classList.add('show');
}
function closeTransactionModal() {
    document.getElementById('transactionModal').classList.remove('show');
    selectedTransactionId = null;
}
function sendSMSFromTransaction() {
    const sale = sales.find(s => s.id === selectedTransactionId);
    if (!sale || !sale.customer?.phone) {
        showToast('No phone number available');
        return;
    }
    const billText = generateBillText(sale);
    window.location.href = `sms:${sale.customer.phone}?body=${encodeURIComponent(billText)}`;
}
function confirmDeleteTransaction() {
    if (!confirm('Are you sure you want to delete this transaction? Stock will be restored.')) {
        return;
    }
    if (isAdminUnlocked) {
        executeDeleteTransaction();
    } else {
        currentPinAction = 'deleteTransaction';
        enteredPin = '';
        updatePinDisplay();
        document.getElementById('pinModalTitle').textContent = 'Enter Owner PIN to Delete';
        document.getElementById('pinModal').classList.add('show');
    }
}
function executeDeleteTransaction() {
    if (!selectedTransactionId) {
        showToast('No transaction selected');
        return;
    }
    const saleId = selectedTransactionId;
    const saleIndex = sales.findIndex(s => s.id === saleId);
    if (saleIndex === -1) {
        showToast('Transaction not found');
        document.getElementById('transactionModal').classList.remove('show');
        selectedTransactionId = null;
        updateDashboard();
        return;
    }
    const sale = sales[saleIndex];
    // Restore inventory
    sale.items.forEach(item => {
        if (inventory[item.key]) {
            inventory[item.key].qty += item.qty;
            saveInventoryItem(item.key, inventory[item.key]);
        }
    });
    // Remove from sales array
    sales.splice(saleIndex, 1);
    // Update local storage immediately
    localStorage.setItem('sm_sales', JSON.stringify(sales));
    // Delete from Firebase (async, don't wait)
    if (db) {
        db.collection('sales').doc(saleId).delete().catch(e => {
            console.log('Delete sync error:', e);
        });
    }
    // Close modal
    document.getElementById('transactionModal').classList.remove('show');
    selectedTransactionId = null;
    // Refresh UI
    updateDashboard();
    // Also refresh reports if on that page
    if (document.getElementById('page-reports').classList.contains('active')) {
        loadDailyReport();
    }
    showToast('Transaction deleted successfully');
}
// ==================== INVENTORY ====================
function showInventoryTab(tab) {
    document.getElementById('tab-stock').classList.toggle('active', tab === 'stock');
    document.getElementById('tab-add').classList.toggle('active', tab === 'add');
    document.getElementById('inventory-stock').style.display = tab === 'stock' ? 'block' : 'none';
    document.getElementById('inventory-add').style.display = tab === 'add' ? 'block' : 'none';
    if (tab === 'stock') renderStockList();
}
function renderStockList() {
    const container = document.getElementById('stockList');
    const items = Object.entries(inventory);
    if (items.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No inventory yet</h3><p>Add stock to get started</p></div>';
        return;
    }
    container.innerHTML = items.map(([key, data]) => {
        const [cat, variant] = key.split('|');
        const isLow = data.qty <= (data.alertQty || 0);
        return `
 <div class="card" style="margin-bottom: 12px;">
 <div style="display: flex; justify-content: space-between; align-items: start;">
 <div>
 <h4 style="font-size: 16px; margin-bottom: 4px;">${cat}</h4>
 <p style="color: var(--gray); font-size: 14px;">${variant}</p>
 </div>
 <span class="badge ${isLow ? 'badge-danger' : 'badge-success'}">${data.qty} in stock</span>
 </div>
 <div style="display: flex; gap: 20px; margin-top: 12px; font-size: 14px; color: var(--gray);">
 <span class="${userRole === 'admin' ? '' : 'worker-hidden'}">Cost: ₹${data.costPrice || 0}</span>
 <span>Price: ₹${data.price || 0}</span>
 <span>Alert: ${data.alertQty || 0}</span>
 </div>
 ${userRole === 'admin' ? `
 <button class="btn btn-outline btn-sm" style="margin-top: 12px;" onclick="editStock('${key}')">
 Edit Stock
 </button>
 ` : ''}
 </div>
 `;
    }).join('');
}
function filterStock() {
    const search = document.getElementById('stockSearch').value.toLowerCase();
    document.querySelectorAll('#stockList .card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(search) ? 'block' : 'none';
    });
}
function renderStockCategoryGrid() {
    const grid = document.getElementById('stockCategoryGrid');
    const icons = {
        'Mattress': '🛏️', 'Cot': '🛏️', 'TV Stand': '📺', 'Chair': '🪑',
        'Table': '🪵', 'Fan': '☢️', 'Pillow': '☁️', 'Bed Sheet': '🧺',
        'Sofa': '🛋️', 'Dining Table': '🍽️', 'Shoe Rack': '👟'
    };
    let html = Object.keys(products).map(cat => `
 <div class="category-btn ${selectedStockCategory === cat ? 'active' : ''}" onclick="selectStockCategory('${cat}')">
 <div class="icon">${icons[cat] || '📦'}</div>
 ${cat}
 </div>
 `).join('');
    // Add "+" button for new category
    html += `
 <div class="category-btn add-new" onclick="showAddCategoryModalForStock()">
 <div class="icon"></div>
 Add New
 </div>
 `;
    grid.innerHTML = html;
}
let selectedStockCategory = null;
let selectedStockVariant = null;
function selectStockCategory(cat) {
    selectedStockCategory = cat;
    renderStockCategoryGrid();
    renderStockVariantGrid();
}
function renderStockVariantGrid() {
    const card = document.getElementById('stockVariantCard');
    const grid = document.getElementById('stockVariantGrid');
    const title = document.getElementById('stockVariantTitle');
    if (!selectedStockCategory) {
        card.style.display = 'none';
        return;
    }
    card.style.display = 'block';
    title.textContent = selectedStockCategory + ' - Select Variant';
    const variants = products[selectedStockCategory] || [];
    let html = variants.map(v => `
 <div class="variant-btn" onclick="selectStockVariant('${v}')">
 <div class="name">${v}</div>
 </div>
 `).join('');
    // Add "+" button for new variant
    html += `
 <div class="variant-btn add-new" onclick="showAddVariantModalForStock()">
 <div class="name"> Add New</div>
 </div>
 `;
    grid.innerHTML = html;
}
function selectStockVariant(variant) {
    selectedStockVariant = variant;
    const key = `${selectedStockCategory}|${variant}`;
    const existing = inventory[key] || {};
    document.getElementById('addStockProduct').textContent = `${selectedStockCategory} - ${variant}`;
    document.getElementById('addStockQty').value = '';
    document.getElementById('addStockCost').value = existing.costPrice || '';
    document.getElementById('addStockPrice').value = existing.price || '';
    document.getElementById('addStockAlert').value = existing.alertQty || '';
    document.getElementById('addStockForm').style.display = 'block';
}
function saveStock() {
    const qty = parseInt(document.getElementById('addStockQty').value) || 0;
    const costPrice = parseFloat(document.getElementById('addStockCost').value) || 0;
    const price = parseFloat(document.getElementById('addStockPrice').value) || 0;
    const alertQty = parseInt(document.getElementById('addStockAlert').value) || 0;
    if (qty <= 0) {
        showToast('Enter valid quantity');
        return;
    }
    const key = `${selectedStockCategory}|${selectedStockVariant}`;
    const existing = inventory[key] || { qty: 0 };
    inventory[key] = {
        qty: existing.qty + qty,
        costPrice,
        price,
        alertQty
    };
    saveInventoryItem(key, inventory[key]);
    showToast('Stock added successfully');
    document.getElementById('addStockForm').style.display = 'none';
    selectedStockCategory = null;
    selectedStockVariant = null;
    document.querySelectorAll('#stockCategoryGrid .category-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('stockVariantCard').style.display = 'none';
}
// Edit Stock
let editingStockKey = null;
function editStock(key) {
    const data = inventory[key];
    if (!data) {
        showToast('Item not found');
        return;
    }
    editingStockKey = key;
    const [cat, variant] = key.split('|');
    document.getElementById('editStockProduct').textContent = cat;
    document.getElementById('editStockVariant').textContent = variant;
    document.getElementById('editStockQty').value = data.qty || 0;
    document.getElementById('editStockCost').value = data.costPrice || '';
    document.getElementById('editStockPrice').value = data.price || '';
    document.getElementById('editStockAlert').value = data.alertQty || '';
    document.getElementById('editStockModal').classList.add('show');
}
function closeEditStockModal() {
    document.getElementById('editStockModal').classList.remove('show');
    editingStockKey = null;
}
function saveStockEdit() {
    if (!editingStockKey) return;
    const qty = parseInt(document.getElementById('editStockQty').value) || 0;
    const costPrice = parseFloat(document.getElementById('editStockCost').value) || 0;
    const price = parseFloat(document.getElementById('editStockPrice').value) || 0;
    const alertQty = parseInt(document.getElementById('editStockAlert').value) || 0;
    if (qty < 0) {
        showToast('Quantity cannot be negative');
        return;
    }
    inventory[editingStockKey] = {
        qty,
        costPrice,
        price,
        alertQty
    };
    saveInventoryItem(editingStockKey, inventory[editingStockKey]);
    closeEditStockModal();
    renderStockList();
    updateDashboard();
    showToast('Stock updated successfully');
}
// ==================== CUSTOMERS ====================
function renderAllCustomers() {
    const container = document.getElementById('allCustomersList');
    if (!container) return;
    // Filter out any invalid customers
    const validCustomers = customers.filter(c => c && c.name && c.phone);
    if (validCustomers.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No customers yet</h3><p>Add customers manually or they will appear after sales</p></div>';
        return;
    }
    let html = '';
    for (const c of validCustomers) {
        const customerSales = sales.filter(s => s.customer && s.customer.phone === c.phone);
        const totalSpent = customerSales.reduce((sum, s) => sum + (s.total || 0), 0);
        const phone = c.phone.replace(/'/g, "\\'");
        html += `
 <div class="card" style="margin-bottom: 12px;">
 <div style="display: flex; justify-content: space-between; align-items: start;">
 <div>
 <h4 style="font-size: 16px; margin-bottom: 4px;">${c.name}</h4>
 <p style="color: var(--gray); font-size: 14px;">${c.phone}</p>
 ${c.email ? `<p style="color: var(--gray); font-size: 13px;">${c.email}</p>` : ''}
 </div>
 <div style="text-align: right;">
 <p style="font-weight: 600;">₹${totalSpent.toLocaleString()}</p>
 <p style="font-size: 12px; color: var(--gray);">${customerSales.length} orders</p>
 ${isAdminUnlocked ? `
 <div style="margin-top: 10px; display: flex; gap: 6px; justify-content: flex-end;">
 <button onclick="editCustomer('${phone}')" style="padding: 6px 14px; font-size: 12px; font-weight: 500; border: none; border-radius: 6px; cursor: pointer; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">Edit</button>
 <button onclick="deleteCustomer('${phone}')" style="padding: 6px 14px; font-size: 12px; font-weight: 500; border: none; border-radius: 6px; cursor: pointer; background: rgba(0,0,0,0.08); color: #666;">Delete</button>
 </div>
 ` : ''}
 </div>
 </div>
 </div>
 `;
    }
    container.innerHTML = html;
}
function filterAllCustomers() {
    const search = document.getElementById('allCustomerSearch').value.toLowerCase();
    document.querySelectorAll('#allCustomersList .card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(search) ? 'block' : 'none';
    });
}
function showAddCustomerModal() {
    document.getElementById('newCustomerName').value = '';
    document.getElementById('newCustomerPhone').value = '';
    document.getElementById('newCustomerEmail').value = '';
    document.getElementById('addCustomerModal').classList.add('show');
}
function closeAddCustomerModal() {
    document.getElementById('addCustomerModal').classList.remove('show');
    editingCustomerPhone = null;
    resetAddCustomerModal();
}
function saveNewCustomer() {
    const name = document.getElementById('newCustomerName').value.trim();
    const phone = document.getElementById('newCustomerPhone').value.trim();
    const email = document.getElementById('newCustomerEmail').value.trim();
    if (!name || !phone) {
        showToast('Name and phone required');
        return;
    }
    const customer = { name, phone, email };
    customers.push(customer);
    saveCustomer(customer);
    closeAddCustomerModal();
    renderAllCustomers();
    showToast('Customer added');
}
let editingCustomerPhone = null;
function editCustomer(phone) {
    const customer = customers.find(c => c.phone === phone);
    if (!customer) return;
    editingCustomerPhone = phone;
    document.getElementById('newCustomerName').value = customer.name;
    document.getElementById('newCustomerPhone').value = customer.phone;
    document.getElementById('newCustomerEmail').value = customer.email || '';
    document.querySelector('#addCustomerModal .modal-title').textContent = 'Edit Customer';
    document.querySelector('#addCustomerModal .btn-primary').textContent = 'Save Changes';
    document.querySelector('#addCustomerModal .btn-primary').onclick = saveEditedCustomer;
    document.getElementById('addCustomerModal').classList.add('show');
}
function saveEditedCustomer() {
    const name = document.getElementById('newCustomerName').value.trim();
    const phone = document.getElementById('newCustomerPhone').value.trim();
    const email = document.getElementById('newCustomerEmail').value.trim();
    if (!name || !phone) {
        showToast('Name and phone required');
        return;
    }
    const index = customers.findIndex(c => c.phone === editingCustomerPhone);
    if (index !== -1) {
        // Update customer in local array
        customers[index] = { name, phone, email };
        // Update in Firebase
        if (db) {
            if (editingCustomerPhone !== phone) {
                db.collection('customers').doc(editingCustomerPhone).delete().catch(() => {});
            }
            db.collection('customers').doc(phone).set(customers[index]).catch(() => {});
        }
        // Update customer reference in sales if phone changed
        if (editingCustomerPhone !== phone) {
            sales.forEach(sale => {
                if (sale.customer?.phone === editingCustomerPhone) {
                    sale.customer.phone = phone;
                    sale.customer.name = name;
                }
            });
        }
    }
    editingCustomerPhone = null;
    closeAddCustomerModal();
    resetAddCustomerModal();
    renderAllCustomers();
    showToast('Customer updated');
}
function deleteCustomer(phone) {
    if (!confirm('Delete this customer? This cannot be undone.')) return;
    const index = customers.findIndex(c => c.phone === phone);
    if (index !== -1) {
        customers.splice(index, 1);
        // Delete from Firebase
        if (db) {
            db.collection('customers').doc(phone).delete().catch(() => {});
        }
    }
    renderAllCustomers();
    showToast('Customer deleted');
}
function resetAddCustomerModal() {
    document.querySelector('#addCustomerModal .modal-title').textContent = 'Add New Customer';
    document.querySelector('#addCustomerModal .btn-primary').textContent = 'Add Customer';
    document.querySelector('#addCustomerModal .btn-primary').onclick = saveNewCustomer;
}
// ==================== PRODUCTS ====================
function renderProductsList() {
    const container = document.getElementById('productsList');
    container.innerHTML = Object.entries(products).map(([cat, variants]) => `
 <div class="card" style="margin-bottom: 12px;">
 <div style="display: flex; justify-content: space-between; align-items: center;">
 <h4 style="font-size: 16px;">${cat}</h4>
 <span class="badge badge-success">${variants.length} variants</span>
 </div>
 <p style="color: var(--gray); font-size: 13px; margin-top: 8px;">${variants.join(', ')}</p>
 </div>
 `).join('');
}
function showAddProductModal() {
    document.getElementById('newProductName').value = '';
    document.getElementById('newProductVariants').value = '';
    document.getElementById('addProductModal').classList.add('show');
}
function closeAddProductModal() {
    document.getElementById('addProductModal').classList.remove('show');
}
function saveNewProduct() {
    const name = document.getElementById('newProductName').value.trim();
    const variantsText = document.getElementById('newProductVariants').value.trim();
    if (!name) {
        showToast('Product name required');
        return;
    }
    const variants = variantsText.split('\n').map(v => v.trim()).filter(v => v);
    if (variants.length === 0) {
        showToast('Add at least one variant');
        return;
    }
    products[name] = variants;
    localStorage.setItem('sm_products', JSON.stringify(products));
    closeAddProductModal();
    renderProductsList();
    renderCategoryGrid();
    renderStockCategoryGrid();
    showToast('Product added');
}
// ==================== ADD CATEGORY/VARIANT FROM SALES ====================
function showAddCategoryModal() {
    document.getElementById('newCategoryName').value = '';
    document.getElementById('addCategoryModal').classList.add('show');
}
function closeAddCategoryModal() {
    document.getElementById('addCategoryModal').classList.remove('show');
}
function saveNewCategory() {
    const name = document.getElementById('newCategoryName').value.trim();
    if (!name) {
        showToast('Category name required');
        return;
    }
    if (products[name]) {
        showToast('Category already exists');
        return;
    }
    products[name] = [];
    localStorage.setItem('sm_products', JSON.stringify(products));
    closeAddCategoryModal();
    renderCategoryGrid();
    renderStockCategoryGrid();
    renderProductsList();
    // Auto-select the new category in the appropriate context
    const isOnStockPage = document.getElementById('page-inventory').classList.contains('active');
    if (isOnStockPage) {
        selectStockCategory(name);
    } else {
        selectCategory(name);
    }
    showToast('Category added');
}
function showAddVariantModal() {
    if (!selectedCategory) {
        showToast('Select a category first');
        return;
    }
    variantModalContext = 'sale';
    document.getElementById('addVariantCategory').textContent = selectedCategory;
    document.getElementById('newVariantName').value = '';
    document.getElementById('newVariantPrice').value = '';
    document.getElementById('newVariantCost').value = '';
    document.getElementById('newVariantStock').value = '';
    document.getElementById('addVariantModal').classList.add('show');
}
function closeAddVariantModal() {
    document.getElementById('addVariantModal').classList.remove('show');
}
// Track which context the variant modal is being used in
let variantModalContext = 'sale'; // 'sale' or 'stock'
function saveNewVariant() {
    const name = document.getElementById('newVariantName').value.trim();
    const price = parseFloat(document.getElementById('newVariantPrice').value) || 0;
    const costPrice = parseFloat(document.getElementById('newVariantCost').value) || 0;
    const stock = parseInt(document.getElementById('newVariantStock').value) || 0;
    // Determine which category to use based on context
    const targetCategory = variantModalContext === 'stock' ? selectedStockCategory : selectedCategory;
    if (!name) {
        showToast('Variant name required');
        return;
    }
    if (!targetCategory) {
        showToast('No category selected');
        return;
    }
    if (products[targetCategory].includes(name)) {
        showToast('Variant already exists');
        return;
    }
    // Add to products
    products[targetCategory].push(name);
    localStorage.setItem('sm_products', JSON.stringify(products));
    // Create inventory entry if any values provided
    if (price || costPrice || stock) {
        const key = `${targetCategory}|${name}`;
        inventory[key] = {
            qty: stock,
            costPrice: costPrice,
            price: price,
            alertQty: 0
        };
        saveInventoryItem(key, inventory[key]);
    }
    closeAddVariantModal();
    renderVariantGrid();
    renderStockVariantGrid();
    renderStockCategoryGrid();
    renderProductsList();
    showToast('Variant added');
}
// Stock page specific functions
function showAddCategoryModalForStock() {
    document.getElementById('newCategoryName').value = '';
    document.getElementById('addCategoryModal').classList.add('show');
    // Category modal doesn't need context - it just adds to products
}
function showAddVariantModalForStock() {
    if (!selectedStockCategory) {
        showToast('Select a category first');
        return;
    }
    variantModalContext = 'stock';
    document.getElementById('addVariantCategory').textContent = selectedStockCategory;
    document.getElementById('newVariantName').value = '';
    document.getElementById('newVariantPrice').value = '';
    document.getElementById('newVariantCost').value = '';
    document.getElementById('newVariantStock').value = '';
    document.getElementById('addVariantModal').classList.add('show');
}
// ==================== REPORTS ====================
function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    const month = today.substring(0, 7);
    document.getElementById('reportDate').value = today;
    document.getElementById('reportMonth').value = month;
}
function showReportTab(tab) {
    ['daily', 'monthly', 'products'].forEach(t => {
        document.getElementById('rtab-' + t).classList.toggle('active', t === tab);
        document.getElementById('report-' + t).style.display = t === tab ? 'block' : 'none';
    });
    if (tab === 'daily') loadDailyReport();
    if (tab === 'monthly') loadMonthlyReport();
    if (tab === 'products') loadProductsReport();
}
function loadDailyReport() {
    const date = document.getElementById('reportDate').value;
    const daySales = sales.filter(s => s.date === date);
    let total = 0, profit = 0, items = 0;
    daySales.forEach(s => {
        total += s.total;
        profit += s.profit || 0;
        items += s.items.reduce((sum, i) => sum + i.qty, 0);
    });
    const container = document.getElementById('dailyReportContent');
    container.innerHTML = `
 <div class="stats-grid" style="grid-template-columns: repeat(2, 1fr);">
 <div class="stat-card">
 <div class="stat-label">Total Sales</div>
 <div class="stat-value">₹${total.toLocaleString()}</div>
 </div>
 <div class="stat-card">
 <div class="stat-label">Items Sold</div>
 <div class="stat-value">${items}</div>
 </div>
 ${userRole === 'admin' ? `
 <div class="stat-card">
 <div class="stat-label">Profit</div>
 <div class="stat-value">₹${profit.toLocaleString()}</div>
 </div>
 ` : ''}
 <div class="stat-card">
 <div class="stat-label">Transactions</div>
 <div class="stat-value">${daySales.length}</div>
 </div>
 </div>
 <div class="card">
 <div class="card-title">Transactions (tap to view details)</div>
 ${daySales.length === 0 ? '<p style="color: var(--gray);">No sales on this date</p>' :
        daySales.map(s => `
 <div class="list-item" onclick="showTransactionDetails('${s.id}')" style="cursor: pointer;">
 <div class="list-item-info">
 <h4>${s.customer?.name || 'Walk-in'}</h4>
 <p>${s.time} | ${s.items.length} items | ${s.paymentMethod}</p>
 </div>
 <div style="text-align: right;">
 <strong>₹${s.total.toLocaleString()}</strong>
 <p style="font-size: 11px; color: var(--primary);">View</p>
 </div>
 </div>
 `).join('')
    }
 </div>
 `;
}
function loadMonthlyReport() {
    const month = document.getElementById('reportMonth').value;
    const monthSales = sales.filter(s => s.date.startsWith(month));
    let total = 0, profit = 0, items = 0;
    monthSales.forEach(s => {
        total += s.total;
        profit += s.profit || 0;
        items += s.items.reduce((sum, i) => sum + i.qty, 0);
    });
    const container = document.getElementById('monthlyReportContent');
    container.innerHTML = `
 <div class="stats-grid" style="grid-template-columns: repeat(2, 1fr);">
 <div class="stat-card primary">
 <div class="stat-label">Total Sales</div>
 <div class="stat-value">₹${total.toLocaleString()}</div>
 </div>
 <div class="stat-card success">
 <div class="stat-label">Items Sold</div>
 <div class="stat-value">${items}</div>
 </div>
 ${userRole === 'admin' ? `
 <div class="stat-card">
 <div class="stat-label">Total Profit</div>
 <div class="stat-value">₹${profit.toLocaleString()}</div>
 </div>
 ` : ''}
 <div class="stat-card">
 <div class="stat-label">Transactions</div>
 <div class="stat-value">${monthSales.length}</div>
 </div>
 </div>
 `;
}
function loadProductsReport() {
    const productStats = {};
    sales.forEach(sale => {
        sale.items.forEach(item => {
            const key = item.category;
            if (!productStats[key]) {
                productStats[key] = { qty: 0, revenue: 0 };
            }
            productStats[key].qty += item.qty;
            productStats[key].revenue += item.price * item.qty;
        });
    });
    const sorted = Object.entries(productStats)
        .sort((a, b) => b[1].qty - a[1].qty)
        .slice(0, 10);
    const container = document.getElementById('bestSellers');
    if (sorted.length === 0) {
        container.innerHTML = '<p style="color: var(--gray);">No sales data yet</p>';
        return;
    }
    container.innerHTML = sorted.map(([name, data], i) => `
 <div class="list-item">
 <div class="list-item-info">
 <h4>${i + 1}. ${name}</h4>
 <p>${data.qty} sold | ₹${data.revenue.toLocaleString()} revenue</p>
 </div>
 </div>
 `).join('');
}
// ==================== PIN ====================
function showPinModal(action) {
    if (isAdminUnlocked) {
        // Already unlocked, just show
        document.querySelectorAll('.blur').forEach(el => el.classList.remove('blur'));
        return;
    }
    currentPinAction = action;
    enteredPin = '';
    updatePinDisplay();
    document.getElementById('pinModalTitle').textContent = 'Enter Owner PIN';
    document.getElementById('pinModal').classList.add('show');
}
function showSetPinModal() {
    currentPinAction = 'setPin';
    enteredPin = '';
    updatePinDisplay();
    document.getElementById('pinModalTitle').textContent = 'Set New Owner PIN';
    document.getElementById('pinModal').classList.add('show');
}
function closePinModal() {
    document.getElementById('pinModal').classList.remove('show');
    enteredPin = '';
}
function enterPin(num) {
    if (enteredPin.length >= 5) return;
    enteredPin += num;
    updatePinDisplay();
    if (enteredPin.length === 5) {
        setTimeout(checkPin, 200);
    }
}
function deletePin() {
    enteredPin = enteredPin.slice(0, -1);
    updatePinDisplay();
}
function clearPin() {
    enteredPin = '';
    updatePinDisplay();
}
function updatePinDisplay() {
    const dots = document.querySelectorAll('#pinDisplay .pin-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('filled', i < enteredPin.length);
    });
}
function checkPin() {
    if (currentPinAction === 'setPin') {
        adminPin = enteredPin;
        localStorage.setItem('sm_admin_pin', adminPin);
        closePinModal();
        showToast('PIN updated successfully');
        return;
    }
    if (enteredPin === adminPin) {
        isAdminUnlocked = true;
        closePinModal();
        document.querySelectorAll('.blur').forEach(el => el.classList.remove('blur'));
        // Handle delete transaction action
        if (currentPinAction === 'deleteTransaction') {
            executeDeleteTransaction();
            return;
        }
        showToast('Owner access granted');
    } else {
        showToast('Incorrect PIN');
        enteredPin = '';
        updatePinDisplay();
    }
}
// ==================== FIREBASE SYNC ====================
async function loadInventory() {
    if (!db) {
        inventory = JSON.parse(localStorage.getItem('sm_inventory') || '{}');
        return;
    }
    try {
        const snapshot = await db.collection('inventory').get();
        snapshot.forEach(doc => {
            inventory[doc.id] = doc.data();
        });
        localStorage.setItem('sm_inventory', JSON.stringify(inventory));
    } catch (e) {
        inventory = JSON.parse(localStorage.getItem('sm_inventory') || '{}');
    }
}
async function saveInventoryItem(key, data) {
    localStorage.setItem('sm_inventory', JSON.stringify(inventory));
    if (db) {
        try {
            await db.collection('inventory').doc(key).set(data);
        } catch (e) {
            console.log('Sync error:', e);
        }
    }
}
async function loadCustomers() {
    if (!db) {
        customers = JSON.parse(localStorage.getItem('sm_customers') || '[]');
        renderAllCustomers();
        return;
    }
    try {
        const snapshot = await db.collection('customers').get();
        customers = [];
        snapshot.forEach(doc => {
            customers.push({ id: doc.id, ...doc.data() });
        });
        localStorage.setItem('sm_customers', JSON.stringify(customers));
    } catch (e) {
        customers = JSON.parse(localStorage.getItem('sm_customers') || '[]');
    }
    renderAllCustomers();
}
async function saveCustomer(customer) {
    localStorage.setItem('sm_customers', JSON.stringify(customers));
    if (db && customer.phone) {
        try {
            await db.collection('customers').doc(customer.phone).set(customer);
        } catch (e) {
            console.log('Sync error:', e);
        }
    }
}
async function loadSales() {
    if (!db) {
        sales = JSON.parse(localStorage.getItem('sm_sales') || '[]');
        return;
    }
    try {
        const snapshot = await db.collection('sales').orderBy('date', 'desc').limit(500).get();
        sales = [];
        snapshot.forEach(doc => {
            sales.push({ id: doc.id, ...doc.data() });
        });
        localStorage.setItem('sm_sales', JSON.stringify(sales));
    } catch (e) {
        sales = JSON.parse(localStorage.getItem('sm_sales') || '[]');
    }
}
async function saveSale(sale) {
    localStorage.setItem('sm_sales', JSON.stringify(sales));
    if (db) {
        try {
            await db.collection('sales').doc(sale.id).set(sale);
        } catch (e) {
            console.log('Sync error:', e);
        }
    }
}
// ==================== BACKUP ====================
function downloadBackup() {
    const backup = {
        version: 1,
        date: new Date().toISOString(),
        products,
        inventory,
        customers,
        sales,
        adminPin
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    localStorage.setItem('sm_last_backup', new Date().toISOString());
    showToast('Backup downloaded');
}
function restoreBackup(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const backup = JSON.parse(e.target.result);
            if (!backup.version) {
                showToast('Invalid backup file');
                return;
            }
            products = backup.products || products;
            inventory = backup.inventory || {};
            customers = backup.customers || [];
            sales = backup.sales || [];
            adminPin = backup.adminPin || '11111';
            localStorage.setItem('sm_products', JSON.stringify(products));
            localStorage.setItem('sm_inventory', JSON.stringify(inventory));
            localStorage.setItem('sm_customers', JSON.stringify(customers));
            localStorage.setItem('sm_sales', JSON.stringify(sales));
            localStorage.setItem('sm_admin_pin', adminPin);
            // Sync to Firebase if available
            if (db) {
                for (const [key, data] of Object.entries(inventory)) {
                    await db.collection('inventory').doc(key).set(data);
                }
                for (const customer of customers) {
                    await db.collection('customers').add(customer);
                }
                for (const sale of sales) {
                    await db.collection('sales').doc(sale.id).set(sale);
                }
            }
            showToast('Backup restored successfully');
            location.reload();
        } catch (e) {
            showToast('Error reading backup file');
        }
    };
    reader.readAsText(file);
}
function checkBackupReminder() {
    const lastBackup = localStorage.getItem('sm_last_backup');
    if (!lastBackup) return;
    const daysSinceBackup = Math.floor((Date.now() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceBackup >= 7) {
        setTimeout(() => {
            if (confirm('It\'s been ' + daysSinceBackup + ' days since your last backup. Would you like to backup now?')) {
                downloadBackup();
            }
        }, 3000);
    }
}
// ==================== UTILITIES ====================
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}