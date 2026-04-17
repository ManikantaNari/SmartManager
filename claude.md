# Developer Agent Guide
This document serves as a comprehensive technical guide for developers and AI agents working on the Smart Manager application. Read this file first to understand the complete architecture, codebase...
> **For basic product overview, features, and setup instructions, refer to [README.md](./README.md)**
---
## Table of Contents
1. [Project Understanding](#project-understanding)
2. [Problem Statement](#problem-statement)
3. [User Perspective](#user-perspective)
4. [Architecture Overview](#architecture-overview)
5. [File Structure & Responsibilities](#file-structure--responsibilities)
6. [Code Organization](#code-organization)
7. [UI/UX Patterns](#uiux-patterns)
8. [State Management](#state-management)
9. [Data Flow](#data-flow)
10. [Firebase Integration](#firebase-integration)
11. [Coding Conventions](#coding-conventions)
12. [Feature Implementation Guide](#feature-implementation-guide)
13. [Common Patterns](#common-patterns)
14. [Testing & Debugging](#testing--debugging)
15. [Do's and Don'ts](#dos-and-donts)
---
## Project Understanding
### What This Application Does
Smart Manager is a Progressive Web App (PWA) that functions as a point-of-sale and inventory management system for retail businesses. It runs entirely in the browser, syncs data to Firebase, and wo...
### Core Concept
The application replaces paper-based or spreadsheet-based tracking with a mobile-friendly interface that:
- Processes sales transactions with multiple items
- Tracks inventory in real-time
- Maintains customer records
- Generates business reports
- Syncs across devices
### Target Users
1. **Business Owners** - Need complete visibility into sales, profits, and inventory
2. **Store Managers/Staff** - Need to process sales and check stock without accessing sensitive data
---
## Problem Statement
### Business Problems Solved
1. **Manual Tracking is Error-Prone**
- Paper records get lost or damaged
- Spreadsheets require manual updates
- Stock counts become inaccurate over time
2. **No Real-time Visibility**
- Owners can't monitor business remotely
- Stock-outs happen without warning
- Sales data is delayed
3. **Customer Data is Scattered**
- No centralized customer records
- Purchase history is hard to track
- Follow-up opportunities are missed
4. **Multi-location/Multi-user Challenges**
- Data doesn't sync between devices
- Multiple staff can't work simultaneously
- Owner needs to be physically present
### Technical Problems Solved
1. **Internet Dependency** - App works offline with local storage
2. **Device Compatibility** - Single codebase works everywhere
3. **Installation Friction** - No app store, just open in browser
4. **Data Security** - Role-based access protects sensitive information
---
## User Perspective
### Owner Journey
```
Login (PIN required)
 ?
Dashboard ? See today's sales, profits, low stock alerts
 ?
Can access ALL features:
- Process sales
- View/edit inventory with cost prices
- See profit margins
- Delete transactions
- Edit customers
- Access all reports
- Change settings
- Backup/restore data
```
### Manager Journey
```
Login (No PIN required)
 ?
Dashboard ? See today's sales (profits hidden)
 ?
Limited access:
- Process sales
- View inventory (cost prices hidden)
- View customers (no edit/delete)
- View reports (profits hidden)
```
### Sales Flow (Both Roles)
```
1. Tap "Sale" in navigation
2. Select product category (e.g., Mattress)
3. Select variant (e.g., King 6x6)
4. Enter selling price (bargained amount)
5. Add to cart
6. Repeat for more items OR proceed
7. Optionally add customer details
8. Select payment method (Cash/UPI)
9. Complete sale
10. Optionally send SMS bill
```
---
## Architecture Overview
### Technology Choices
| Component | Technology | Reason |
|-----------|------------|--------|
| Frontend | Vanilla JS | No build step, easy deployment |
| Styling | CSS3 with Variables | Maintainable, themeable |
| Database | Firebase Firestore | Real-time sync, offline support |
| Auth | Firebase Anonymous | No user accounts needed |
| Storage | LocalStorage + IndexedDB | Offline persistence |
### Application Layers
```
???????????????????????????????????????????
? UI Layer ?
? (smart-manager.html) ?
???????????????????????????????????????????
? Style Layer ?
? (styles.css) ?
???????????????????????????????????????????
? Logic Layer ?
? (app.js) ?
???????????????????????????????????????????
? Data Layer ?
? (Firebase + LocalStorage) ?
???????????????????????????????????????????
```
---
## File Structure & Responsibilities
### Core Application Files
```
/
??? smart-manager.html # HTML structure and UI elements
??? styles.css # All CSS styling
??? app.js # All JavaScript logic
??? manifest.json # PWA configuration
??? README.md # User documentation
```
### Support Files
```
/
??? firebase-setup.html # Firebase setup guide (standalone)
??? product-setup.html # Product configuration tool (standalone)
??? CLAUDE.md # This developer guide
```
### File Responsibilities
#### smart-manager.html
- Contains all HTML markup
- Defines page structure and navigation
- Contains inline event handlers (onclick, oninput)
- Links to external CSS and JS files
- Includes Firebase CDN scripts
#### styles.css
- All visual styling
- CSS custom properties (variables) for theming
- Responsive design rules
- Animation definitions
- Role-based visibility classes
#### app.js
- Firebase configuration and initialization
- Global state variables
- All application functions
- Event handling logic
- Data persistence (load/save)
- Business logic
---
## Code Organization
### app.js Structure
The JavaScript file is organized into logical sections marked with comments:
```javascript
// ==================== FIREBASE CONFIG ====================
// Firebase configuration object
// ==================== DATA ====================
// Global state variables (products, inventory, customers, sales, cart)
// ==================== INITIALIZATION ====================
// DOMContentLoaded handler, initApp(), loadLocalData()
// ==================== LOGIN ====================
// Role selection, PIN entry, login/logout functions
// ==================== NAVIGATION ====================
// Page switching, settings display
// ==================== DASHBOARD ====================
// Stats calculation, low stock alerts, recent sales
// ==================== SALES ====================
// Category/variant selection, cart management, checkout
// ==================== INVENTORY ====================
// Stock display, add/edit stock, category filtering
// ==================== CUSTOMERS ====================
// Customer list, add/edit/delete customers
// ==================== REPORTS ====================
// Daily/monthly reports, best sellers, transaction history
// ==================== PRODUCTS ====================
// Product/variant management
// ==================== SETTINGS ====================
// PIN change, backup/restore
// ==================== FIREBASE SYNC ====================
// Load/save functions for Firestore
// ==================== UTILITIES ====================
// Helper functions (toast, date formatting)
```
### styles.css Structure
```css
/* Reset and Variables */
/* Header */
/* Bottom Navigation */
/* Pages */
/* Cards */
/* Stats Grid */
/* Buttons */
/* Form Elements */
/* Product Selection Grid */
/* Variant Grid */
/* Cart */
/* Modal */
/* PIN Pad */
/* Lists */
/* Tabs */
/* Search */
/* Empty State */
/* Badges */
/* Toast */
/* Loading */
/* Responsive (Media Queries) */
/* Sync Status */
/* Login Screen */
/* Role-based Visibility */
```
---
## UI/UX Patterns
### Design System
#### Color Palette (CSS Variables)
```css
--primary: #667eea /* Purple - primary actions */
--secondary: #764ba2 /* Deep purple - gradients */
--success: #10b981 /* Green - positive states */
--warning: #f59e0b /* Orange - alerts */
--danger: #ef4444 /* Red - destructive actions */
--dark: #1a1a2e /* Dark blue - headers */
--light: #f8fafc /* Off-white - backgrounds */
--gray: #64748b /* Gray - secondary text */
```
#### Component Patterns
1. **Cards** - White background, rounded corners, subtle shadow
2. **Buttons** - Gradient backgrounds, rounded, full-width for primary actions
3. **Modals** - Slide up from bottom, overlay background
4. **Navigation** - Fixed bottom on mobile, top horizontal on desktop
5. **Forms** - Large touch targets, clear labels
### Responsive Behavior
```css
/* Mobile (default) */
- Bottom navigation
- 2-column grids
- Full-width cards
/* Desktop (min-width: 768px) */
- Top navigation (centered, pill-shaped)
- 4-column grids
- Constrained max-width (800px)
```
### Role-based UI
CSS classes control visibility based on user role:
```css
.admin-only { display: none; }
body.is-admin .admin-only { display: block; }
body.is-worker .worker-hidden { display: none !important; }
body.is-worker .worker-blur { filter: blur(8px); }
```
Usage in HTML:
```html
<div class="admin-only">Only owners see this</div>
<div class="worker-hidden">Hidden from managers</div>
<span class="worker-blur">?5,000</span> <!-- Blurred for managers -->
```
---
## State Management
### Global State Variables
```javascript
// Product catalog
let products = { 'Category': ['Variant1', 'Variant2'] };
// Inventory data
let inventory = { 'Category - Variant': { qty, costPrice, sellPrice, alertQty } };
// Customer records
let customers = [{ name, phone, email }];
// Sales transactions
let sales = [{ id, date, time, items, total, profit, customer, payment }];
// Current cart
let cart = [{ category, variant, price, qty }];
// Authentication state
let userRole = null; // 'admin' or 'worker'
let isAdminUnlocked = false;
let adminPin = '11111'; // 5-digit PIN
// UI state
let selectedCategory = null;
let selectedVariant = null;
let selectedPayment = null;
```
### State Persistence
| Data | LocalStorage Key | Firebase Collection |
|------|------------------|---------------------|
| Products | sm_products | - |
| Inventory | sm_inventory | inventory |
| Customers | sm_customers | customers |
| Sales | sm_sales | sales |
| Admin PIN | sm_admin_pin | - |
---
## Data Flow
### Sale Transaction Flow
```
User adds item to cart
 ?
cart.push({ category, variant, price, qty })
 ?
User completes sale
 ?
completeSale()
 ??? Create sale object with ID, timestamp
 ??? Calculate profit (if cost price exists)
 ??? Update inventory (reduce qty)
 ??? Add/update customer record
 ??? Push to sales array
 ??? Save to localStorage
 ??? Save to Firebase
 ??? Update UI (dashboard, inventory)
```
### Data Sync Flow
```
App Initialization
 ?
loadLocalData() ? Load from localStorage (immediate)
 ?
initApp()
 ??? loadInventory() ? Fetch from Firebase, fallback to localStorage
 ??? loadCustomers() ? Fetch from Firebase, fallback to localStorage
 ??? loadSales() ? Fetch from Firebase, fallback to localStorage
 ?
On any data change
 ??? Update localStorage (immediate)
 ??? Update Firebase (async, may fail if offline)
```
---
## Firebase Integration
### Configuration
```javascript
const firebaseConfig = {
 apiKey: "...",
 authDomain: "...",
 projectId: "...",
 storageBucket: "...",
 messagingSenderId: "...",
 appId: "..."
};
```
### Collections Structure
```
Firestore Database
??? inventory/
? ??? {category - variant}/
? ??? qty: number
? ??? costPrice: number
? ??? sellPrice: number
? ??? alertQty: number
??? customers/
? ??? {phone}/
? ??? name: string
? ??? phone: string
? ??? email: string
??? sales/
 ??? {saleId}/
 ??? id: string
 ??? date: string
 ??? time: string
 ??? items: array
 ??? total: number
 ??? profit: number
 ??? customer: object
 ??? payment: string
```
### Offline Handling
```javascript
// Enable persistence for offline support
db.enablePersistence().catch(err => console.log('Persistence error:', err));
// All load functions have try-catch with localStorage fallback
async function loadInventory() {
 if (!db) {
 inventory = JSON.parse(localStorage.getItem('sm_inventory') || '{}');
 return;
 }
 try {
 // Fetch from Firebase
 } catch (e) {
 // Fallback to localStorage
 inventory = JSON.parse(localStorage.getItem('sm_inventory') || '{}');
 }
}
```
---
## Coding Conventions
### Naming Conventions
```javascript
// Functions: camelCase, verb-first
function renderCategoryGrid() {}
function loadCustomers() {}
function showAddCartModal() {}
function closeTransactionModal() {}
// Variables: camelCase
let selectedCategory = null;
let isAdminUnlocked = false;
// Constants: camelCase (not UPPER_CASE in this project)
const firebaseConfig = {};
// DOM IDs: camelCase
document.getElementById('todaySales');
document.getElementById('addCartModal');
// CSS Classes: kebab-case
.stat-card, .btn-primary, .modal-overlay
```
### Function Patterns
```javascript
// Render functions: Update UI based on current state
function renderAllCustomers() {
 const container = document.getElementById('allCustomersList');
 if (!container) return;
 container.innerHTML = customers.map(c => `...`).join('');
}
// Load functions: Async, fetch from Firebase with localStorage fallback
async function loadSales() {
 if (!db) {
 sales = JSON.parse(localStorage.getItem('sm_sales') || '[]');
 return;
 }
 try {
 const snapshot = await db.collection('sales').get();
 // Process snapshot
 } catch (e) {
 sales = JSON.parse(localStorage.getItem('sm_sales') || '[]');
 }
}
// Save functions: Update localStorage and Firebase
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
// Show/Close modal functions
function showAddCartModal(category, variant) {
 // Set state, populate fields
 document.getElementById('addCartModal').classList.add('show');
}
function closeAddCartModal() {
 document.getElementById('addCartModal').classList.remove('show');
}
```
### HTML Event Handling
Events are handled via inline attributes pointing to global functions:
```html
<button onclick="showPage('sale')">Sale</button>
<input oninput="searchCustomers()">
<div class="modal-overlay" onclick="closeModal()">
 <div class="modal" onclick="event.stopPropagation()">
```
---
## Feature Implementation Guide
### Adding a New Page
1. **Add HTML structure** in `smart-manager.html`:
```html
<div class="page" id="page-newpage">
 <!-- Page content -->
</div>
```
2. **Add navigation item** (if needed):
```html
<div class="nav-item" onclick="showPage('newpage')">
 <svg>...</svg>
 <span>New Page</span>
</div>
```
3. **Update navigation mapping** in `app.js`:
```javascript
function getNavIndex(pageId) {
 const map = { 'dashboard': 0, 'sale': 1, ..., 'newpage': 5 };
 return map[pageId] || 0;
}
```
4. **Add render function** if needed:
```javascript
if (pageId === 'newpage') renderNewPage();
```
### Adding a New Modal
1. **Add HTML structure**:
```html
<div class="modal-overlay" id="newModal" onclick="closeNewModal()">
 <div class="modal" onclick="event.stopPropagation()">
 <div class="modal-header">
 <h3 class="modal-title">Modal Title</h3>
 <button class="modal-close" onclick="closeNewModal()">&times;</button>
 </div>
 <!-- Modal content -->
 </div>
</div>
```
2. **Add show/close functions**:
```javascript
function showNewModal() {
 document.getElementById('newModal').classList.add('show');
}
function closeNewModal() {
 document.getElementById('newModal').classList.remove('show');
}
```
### Adding a New Data Entity
1. **Add global state variable**:
```javascript
let newEntities = [];
```
2. **Add load function**:
```javascript
async function loadNewEntities() {
 if (!db) {
 newEntities = JSON.parse(localStorage.getItem('sm_newentities') || '[]');
 return;
 }
 try {
 const snapshot = await db.collection('newentities').get();
 newEntities = [];
 snapshot.forEach(doc => {
 newEntities.push({ id: doc.id, ...doc.data() });
 });
 localStorage.setItem('sm_newentities', JSON.stringify(newEntities));
 } catch (e) {
 newEntities = JSON.parse(localStorage.getItem('sm_newentities') || '[]');
 }
}
```
3. **Add save function**:
```javascript
async function saveNewEntity(entity) {
 localStorage.setItem('sm_newentities', JSON.stringify(newEntities));
 if (db) {
 try {
 await db.collection('newentities').doc(entity.id).set(entity);
 } catch (e) {
 console.log('Sync error:', e);
 }
 }
}
```
4. **Call load in initApp()**:
```javascript
function initApp() {
 // ... existing loads
 loadNewEntities();
}
```
---
## Common Patterns
### Generating Unique IDs
```javascript
const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
```
### Formatting Currency
```javascript
'?' + amount.toLocaleString() // ?1,50,000
```
### Date Handling
```javascript
// Today's date (YYYY-MM-DD)
const today = new Date().toISOString().split('T')[0];
// Format time
const time = new Date().toLocaleTimeString();
// Filter by date
const todaySales = sales.filter(s => s.date === today);
```
### Toast Notifications
```javascript
function showToast(message) {
 const toast = document.createElement('div');
 toast.className = 'toast';
 toast.textContent = message;
 document.body.appendChild(toast);
 setTimeout(() => toast.remove(), 3000);
}
```
### Confirmation Dialogs
```javascript
if (confirm('Are you sure you want to delete this?')) {
 // Proceed with deletion
}
```
---
## Testing & Debugging
### Manual Testing Checklist
1. **Login Flow**
- [ ] Owner login with correct PIN
- [ ] Owner login with incorrect PIN (should show error)
- [ ] Manager login (no PIN required)
- [ ] Logout and switch users
2. **Sales Flow**
- [ ] Add single item to cart
- [ ] Add multiple items
- [ ] Adjust quantities
- [ ] Remove items
- [ ] Complete sale with Cash
- [ ] Complete sale with UPI
- [ ] Add customer to sale
- [ ] Send SMS bill
3. **Inventory**
- [ ] View stock levels
- [ ] Add stock (Owner only)
- [ ] Edit stock details (Owner only)
- [ ] Low stock alert appears
4. **Reports**
- [ ] Daily report shows correct totals
- [ ] Monthly report aggregates correctly
- [ ] Transaction details modal works
5. **Offline Mode**
- [ ] Disable network
- [ ] Complete a sale
- [ ] Re-enable network
- [ ] Verify data syncs
### Browser Console Checks
```javascript
// Check current state
console.log('Products:', products);
console.log('Inventory:', inventory);
console.log('Customers:', customers);
console.log('Sales:', sales);
console.log('Cart:', cart);
// Check user role
console.log('Role:', userRole);
console.log('Is Admin:', isAdminUnlocked);
// Check Firebase connection
console.log('DB:', db);
console.log('Online:', isOnline);
```
### Common Issues
1. **Customers not showing** - Check if `renderAllCustomers()` is called after data loads
2. **Firebase errors** - Verify config values, check Firestore rules
3. **Offline not working** - Enable persistence, check localStorage
4. **Styles not applying** - Verify CSS file is linked, check class names
---
## Do's and Don'ts
### Do's
- **Do** read README.md for feature understanding
- **Do** follow existing naming conventions
- **Do** test on both mobile and desktop
- **Do** test offline functionality after changes
- **Do** update localStorage AND Firebase on data changes
- **Do** add null checks for DOM elements
- **Do** use CSS variables for colors
- **Do** keep functions focused and single-purpose
- **Do** use existing patterns for new features
### Don'ts
- **Don't** modify CSS without checking mobile and desktop views
- **Don't** add external libraries without strong justification
- **Don't** store sensitive data (like PINs) in Firebase
- **Don't** break offline functionality
- **Don't** skip localStorage updates (Firebase alone isn't enough)
- **Don't** use `var` (use `let` or `const`)
- **Don't** leave console.log statements in production code
- **Don't** modify the role-based access logic without full testing
---
## Quick Reference
### Key Functions
| Function | Purpose |
|----------|---------|
| `initApp()` | Initialize application after login |
| `showPage(pageId)` | Navigate between pages |
| `renderCategoryGrid()` | Display product categories |
| `showAddCartModal()` | Open add to cart modal |
| `completeSale()` | Process and save a sale |
| `renderStockList()` | Display inventory |
| `renderAllCustomers()` | Display customer list |
| `loadDailyReport()` | Generate daily report |
| `showToast(message)` | Show notification |
### Key Elements
| Element ID | Purpose |
|------------|---------|
| `loginScreen` | Login overlay |
| `page-dashboard` | Dashboard page |
| `page-sale` | Sales page |
| `page-inventory` | Inventory page |
| `page-customers` | Customers page |
| `page-reports` | Reports page |
| `addCartModal` | Add item modal |
| `saleCompleteModal` | Sale success modal |
### Key CSS Classes
| Class | Purpose |
|-------|---------|
| `.page.active` | Visible page |
| `.modal-overlay.show` | Visible modal |
| `.admin-only` | Owner-only elements |
| `.worker-hidden` | Hidden from managers |
| `.worker-blur` | Blurred for managers |
| `.btn-primary` | Primary action button |
| `.card` | Content container |
---
*This guide should be updated whenever significant changes are made to the application architecture or patterns.*