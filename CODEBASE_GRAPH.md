# CODEBASE KNOWLEDGE GRAPH: SmartManager (Manikanta Enterprises)

> PWA Point-of-Sale & Inventory Management System  
> Built with Vanilla JS + Firebase Firestore

---

## Quick Navigation Index

### Entry Points

| File | Purpose | Connects To |
|------|---------|-------------|
| `index.html` | App shell, loads Firebase SDK + bridges.js | `js/bridges.js` |
| `js/bridges.js` | Global function bridges for HTML onclick | `js/app.js` |
| `js/app.js` | Main application initialization | All modules, state, templates |

### Core Modules

| Module | Location | Responsibility | Dependencies |
|--------|----------|----------------|--------------|
| Auth | `js/modules/auth.js` | Role-based login (Owner/Manager), PIN management | PinPad, State, Storage |
| Navigation | `js/modules/navigation.js` | Page routing, tab switching | DOM utils |
| Sales | `js/modules/sales.js` | Cart, checkout, sale processing | State, Storage, Products |
| Inventory | `js/modules/inventory.js` | Stock management, bulk entry sessions | State, Storage, Products |
| Customers | `js/modules/customers.js` | Customer CRUD, transaction history | State, Storage, Bookings |
| Bookings | `js/modules/bookings.js` | Advance payments, pickup tracking | State, Storage |
| Reports | `js/modules/reports.js` | Daily/monthly analytics, stock logs | State, Bookings |
| Transactions | `js/modules/transactions.js` | Sale details, deletion, SMS | Sales, Storage |
| Products | `js/modules/products.js` | Category/variant management | State, Storage |
| Backup | `js/modules/backup.js` | Data export/import, i18n, settings | State, Storage |
| Dashboard | `js/modules/dashboard.js` | Today's stats, alerts, recent sales | State, Bookings |

---

## Dependency Graph

```
                    ┌─────────────────┐
                    │   index.html    │
                    │  (Entry Shell)  │
                    └────────┬────────┘
                             │ loads
                    ┌────────▼────────┐
                    │   bridges.js    │
                    │ (Global Funcs)  │
                    └────────┬────────┘
                             │ imports
                    ┌────────▼────────┐
                    │     app.js      │
                    │  (Orchestrator) │
                    └────────┬────────┘
           ┌─────────────────┼─────────────────┐
           │                 │                 │
    ┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐
    │   config/   │   │   state/    │   │  modules/   │
    │ (Firebase,  │   │ (State,     │   │ (Business   │
    │  Constants) │   │  Storage)   │   │  Logic)     │
    └──────┬──────┘   └──────┬──────┘   └──────┬──────┘
           │                 │                 │
           └────────────┬────┴─────────────────┘
                        │
              ┌─────────▼─────────┐
              │      utils/       │
              │ (DOM, Format,     │
              │  Template, Toast) │
              └─────────┬─────────┘
                        │
              ┌─────────▼─────────┐
              │   components/     │
              │ (Modal, PinPad)   │
              └─────────┬─────────┘
                        │
              ┌─────────▼─────────┐
              │    templates/     │
              │  (HTML Strings)   │
              └───────────────────┘
```

---

## Directory Purpose Map

```
SmartManager/
├── index.html                # App shell - minimal HTML, loads scripts
├── CLAUDE.md                 # Developer guide (this project's instructions)
├── README.md                 # User documentation
│
├── css/
│   ├── styles.css            # Main entry - imports all modules via @import
│   ├── base/
│   │   ├── variables.css     # CSS custom properties (colors, spacing)
│   │   ├── reset.css         # Browser normalization
│   │   ├── animations.css    # Keyframe animations
│   │   └── accessibility.css # Focus states, screen reader utilities
│   ├── layout/
│   │   ├── header.css        # Top bar with sync status
│   │   ├── navigation.css    # Bottom nav (mobile) / top nav (desktop)
│   │   ├── pages.css         # Page container show/hide
│   │   └── responsive.css    # Media queries for breakpoints
│   ├── components/
│   │   ├── buttons.css       # .btn, .btn-primary, .btn-outline
│   │   ├── cards.css         # .card, .stat-card
│   │   ├── forms.css         # Inputs, labels, groups
│   │   ├── modals.css        # .modal-overlay, .modal
│   │   ├── lists.css         # .list-item
│   │   ├── badges.css        # .badge, .badge-success, etc.
│   │   ├── tabs.css          # Tab navigation
│   │   ├── loaders.css       # Loading spinners
│   │   ├── toast.css         # Toast notifications
│   │   ├── toggle.css        # Toggle switches
│   │   ├── pinpad.css        # PIN entry grid
│   │   ├── alerts.css        # Alert boxes
│   │   └── confirm.css       # Confirmation dialogs
│   └── features/
│       ├── login.css         # Login screen
│       ├── products.css      # Category/variant grids
│       ├── cart.css          # Shopping cart
│       ├── dashboard.css     # Dashboard stat cards
│       ├── roles.css         # .admin-only, .worker-hidden, .worker-blur
│       ├── bookings.css      # Booking cards and details
│       ├── settings.css      # Settings page
│       └── inventory.css     # Stock list and forms
│
├── js/
│   ├── app.js                # Application orchestrator & init
│   ├── bridges.js            # window.* function bindings for HTML onclick
│   │
│   ├── config/
│   │   ├── index.js          # Re-exports all config
│   │   ├── constants.js      # CURRENCY_SYMBOL, STORAGE_KEYS, DEFAULT_PRODUCTS
│   │   ├── firebase.js       # Firebase config & initialization
│   │   └── icons.js          # Category emoji mappings
│   │
│   ├── state/
│   │   ├── index.js          # Re-exports State, Storage
│   │   ├── state.js          # Centralized application state object
│   │   └── storage.js        # LocalStorage + Firebase sync layer
│   │
│   ├── utils/
│   │   ├── index.js          # Re-exports all utilities
│   │   ├── dom.js            # DOM manipulation helpers
│   │   ├── format.js         # Currency, date formatting
│   │   ├── date.js           # Date utilities
│   │   ├── template.js       # Template rendering engine
│   │   ├── toast.js          # Toast notifications
│   │   ├── loader.js         # Loading indicators
│   │   ├── confirm.js        # Confirmation dialogs
│   │   ├── validation.js     # Form validators
│   │   ├── grid.js           # Category/variant grid rendering
│   │   ├── keyboard.js       # Keyboard navigation & a11y
│   │   ├── i18n.js           # Internationalization (en, te, hi)
│   │   ├── unsaved.js        # Unsaved changes tracking
│   │   ├── performance.js    # Debounce, throttle, memoize
│   │   └── entityUpdater.js  # Batch entity updates
│   │
│   ├── components/
│   │   ├── index.js          # Re-exports Modal, PinPad
│   │   ├── modal.js          # Modal show/hide utilities
│   │   └── pinpad.js         # Reusable PIN entry component
│   │
│   ├── modules/
│   │   ├── index.js          # Re-exports all modules
│   │   ├── auth.js           # Authentication & role management
│   │   ├── navigation.js     # Page routing
│   │   ├── dashboard.js      # Dashboard rendering
│   │   ├── sales.js          # Sales processing & cart
│   │   ├── inventory.js      # Stock management
│   │   ├── customers.js      # Customer CRUD
│   │   ├── products.js       # Product/category management
│   │   ├── reports.js        # Reports & analytics
│   │   ├── transactions.js   # Transaction details
│   │   ├── bookings.js       # Advance bookings system
│   │   └── backup.js         # Backup/restore & settings
│   │
│   └── templates/
│       ├── index.js          # Template assembler (loadTemplates())
│       ├── components/
│       │   ├── header.js     # App header template
│       │   ├── login.js      # Login screen template
│       │   └── nav.js        # Bottom navigation template
│       ├── pages/
│       │   ├── dashboard.js  # Dashboard page
│       │   ├── sale.js       # Sales page
│       │   ├── inventory.js  # Inventory page
│       │   ├── customers.js  # Customers page
│       │   ├── products.js   # Products page
│       │   ├── reports.js    # Reports page
│       │   ├── bookings.js   # Bookings page
│       │   └── settings.js   # Settings page
│       ├── modals/
│       │   ├── pin.js        # PIN entry modal
│       │   ├── cart.js       # Add to cart modal
│       │   ├── saleComplete.js # Sale success modal
│       │   ├── addProduct.js # Add product modal
│       │   ├── addCustomer.js # Add customer modal
│       │   ├── addCategory.js # Add/edit/delete category modals
│       │   ├── addVariant.js # Add/edit/delete variant modals
│       │   ├── editStock.js  # Edit stock modal
│       │   ├── addStockItem.js # Add stock item modal
│       │   ├── transaction.js # Transaction details modal
│       │   ├── stockLog.js   # Stock log detail modal
│       │   ├── photoView.js  # Invoice photo viewer
│       │   ├── bookingDetails.js # Booking details modal
│       │   ├── createBooking.js # Create booking modal
│       │   ├── addAdvance.js # Advance/date/complete/cancel modals
│       │   └── customerHistory.js # Customer history modal
│       └── data/
│           └── templates.js  # Reusable data templates
│
├── html/
│   ├── firebase-setup.html   # Firebase setup guide (standalone)
│   └── project-setup.html    # Product configuration tool (standalone)
│
├── json/
│   └── manifest.json         # PWA manifest
│
└── .github/
    └── workflows/
        └── static.yml        # GitHub Pages deployment
```

---

## Data Flow Diagrams

### Application Bootstrap Flow

```
DOMContentLoaded
       │
       ▼
┌─────────────────┐
│ loadTemplates() │ ── Inject all HTML templates into #app
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│initializeFirebase│ ── Init Firebase, enable persistence
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Storage.loadAll │ ── Load products, inventory, customers,
└────────┬────────┘    sales, stockLogs, bookings, PIN
         │
         ▼
┌─────────────────┐
│   Auth.init()   │ ── Setup PIN pads, show login screen
└────────┬────────┘
         │
    [User Login]
         │
         ▼
┌─────────────────┐
│initAfterLogin() │ ── Wire up page callbacks, init all modules
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│setupRealtimeListeners│ ── Firebase real-time sync listeners
└─────────────────┘
```

### Sale Transaction Flow

```
[User adds item to cart]
         │
         ▼
┌─────────────────────┐
│ Sales.selectVariantForCart │ ── Check stock, open modal
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Sales.addToCart   │ ── Push to State.cart array
└──────────┬──────────┘
           │
    [User clicks Complete]
           │
           ▼
┌─────────────────────┐
│  Sales.completeSale │
│  ├── Validate cart & payment
│  ├── Calculate total, profit
│  ├── Storage.updateInventoryQty() ── Atomic qty update
│  ├── Create sale object
│  ├── State.sales.push()
│  ├── Storage.saveSale() ── localStorage + Firebase
│  ├── Save customer if new
│  └── Show success modal
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Dashboard.render() │ ── Update today's stats
└─────────────────────┘
```

### Stock Addition Flow (Bulk Entry)

```
[Inventory > Add Stock Tab]
         │
         ▼
┌─────────────────────┐
│ startStockSession() │ ── Create session with vendor/invoice
└──────────┬──────────┘
         │
         ▼
[Select category/variant]
         │
         ▼
┌─────────────────────┐
│  addItemToQueue()   │ ── Add to session.items (NOT saved yet)
└──────────┬──────────┘
         │
  [Repeat or Complete]
         │
         ▼
┌─────────────────────┐
│completeStockSession │
│  ├── Confirm dialog
│  ├── For each item: Storage.updateInventoryQty()
│  ├── Create stock log entry
│  ├── State.stockLogs.unshift()
│  └── Storage.saveStockLog()
└─────────────────────┘
```

### Data Sync Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    On Any Data Change                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  1. Update State object (immediate)                            │
│  2. Update localStorage (immediate)                            │
│  3. Update Firebase Firestore (async, may fail offline)        │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                    On Firebase Snapshot                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  1. Receive remote data                                        │
│  2. Merge with local using timestamps (newer wins)             │
│  3. Handle deletions (items removed from remote)               │
│  4. Update State and localStorage                              │
│  5. Re-render affected UI components                           │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Component Registry

### Modules (Business Logic)

| Module | File | Key Methods | Depends On |
|--------|------|-------------|------------|
| Auth | `modules/auth.js` | `init()`, `selectRole()`, `checkLoginPin()`, `completeLogin()`, `logout()`, `showSettingsPinModal()` | PinPad, State, Storage |
| Navigation | `modules/navigation.js` | `init()`, `showPage()`, `showSettings()`, `setPageCallbacks()` | DOM |
| Sales | `modules/sales.js` | `init()`, `renderCategories()`, `addToCart()`, `completeSale()`, `generateBillText()` | State, Storage, GridUtil |
| Inventory | `modules/inventory.js` | `init()`, `renderStockList()`, `startStockSession()`, `addItemToQueue()`, `completeStockSession()`, `editStock()` | State, Storage, GridUtil |
| Customers | `modules/customers.js` | `init()`, `renderAll()`, `showAddModal()`, `saveNew()`, `edit()`, `delete()`, `showHistory()` | State, Storage |
| Bookings | `modules/bookings.js` | `init()`, `renderList()`, `createFromCart()`, `showDetails()`, `addAdvance()`, `completeBooking()`, `cancelBooking()` | State, Storage |
| Reports | `modules/reports.js` | `init()`, `showTab()`, `loadDaily()`, `loadMonthly()`, `loadProducts()`, `loadStockLog()` | State, Bookings |
| Transactions | `modules/transactions.js` | `init()`, `showDetails()`, `sendSMS()`, `confirmDelete()`, `executeDelete()` | Sales, Storage |
| Products | `modules/products.js` | `init()`, `renderList()`, `showAddCategoryModal()`, `showAddVariantModal()`, `saveNewCategory()`, `saveNewVariant()` | State, Storage |
| Dashboard | `modules/dashboard.js` | `init()`, `render()`, `renderStats()`, `renderLowStock()`, `renderRecentSales()`, `renderPickupsToday()` | State, Bookings |
| Backup | `modules/backup.js` | `download()`, `restore()`, `checkReminder()`, `changeLanguage()`, `showInventoryValue()` | State, Storage, i18n |

### State Object Structure

```javascript
State = {
    // Data Collections
    products: { 'Category': ['Variant1', 'Variant2', ...] },
    categoryEmojis: { 'Category': 'emoji' },
    inventory: { 'Category|Variant': { qty, costPrice, price, alertQty, updatedAt } },
    customers: [{ id, name, phone, email, createdAt, updatedAt }],
    sales: [{ id, date, time, items, total, profit, customer, paymentMethod, createdAt }],
    stockLogs: [{ id, date, time, vendor, invoice, photo, items, addedBy, type }],
    bookings: [{ id, createdDate, customer, items, total, profit, advancePayments, pickupDate, status }],
    cart: [{ category, variant, key, price, qty, costPrice }],
    
    // Stock Entry Session
    stockSession: { id, vendor, invoice, photo, items, startTime, addedBy, stockType },
    
    // Auth State
    adminPin: '11111',     // Default
    userRole: null,        // 'admin' | 'worker'
    isAdminUnlocked: false,
    
    // UI State
    selectedCategory: null,
    selectedVariant: null,
    selectedPayment: null,
    selectedStockCategory: null,
    selectedStockVariant: null,
    selectedTransactionId: null,
    selectedBookingId: null,
    editingStockKey: null,
    editingCustomerId: null,
    cameFromHistory: false,
    variantModalContext: 'sale' | 'stock',
    
    // Methods
    isAdmin(): boolean,
    resetSale(): void,
    reset(): void
}
```

### Firebase Collections

| Collection | Document ID | Fields |
|------------|-------------|--------|
| `inventory` | `Category|Variant` | qty, costPrice, price, alertQty, updatedAt |
| `sales` | `{saleId}` | id, date, time, items[], total, profit, customer, paymentMethod, createdAt, updatedAt |
| `customers` | `{phone}` or `{customerId}` | id, name, phone, email, createdAt, updatedAt |
| `bookings` | `{bookingId}` | id, createdDate, customer, items[], total, profit, advancePayments[], status, pickupDate, createdAt, updatedAt |
| `stockLogs` | `{logId}` | id, date, time, vendor, invoice, photo, items[], addedBy, type, createdAt |
| `products` | `{CategoryName}` | variants[], emoji, updatedAt |
| `settings` | `adminPin` | pin, updatedAt |
| `settings` | `_ping` | lastPing, device |

### UI Components

| Component | File | Purpose |
|-----------|------|---------|
| Modal | `components/modal.js` | `show()`, `hide()`, `initCloseOnOverlay()` |
| PinPad | `components/pinpad.js` | `create()`, `enter()`, `delete()`, `clear()`, `reset()` |

### Utility Functions

| Utility | File | Key Functions |
|---------|------|---------------|
| DOM | `utils/dom.js` | `get()`, `setText()`, `setHtml()`, `show()`, `hide()`, `toggle()`, `on()`, `findAll()` |
| Format | `utils/format.js` | `currency()`, `date()`, `today()`, `time()` |
| DateUtil | `utils/date.js` | `today()`, `time()`, `now()`, `formatTime()`, `formatDateReadable()` |
| Template | `utils/template.js` | `render()`, `renderTo()`, `renderListTo()` |
| Toast | `utils/toast.js` | `show()`, `success()`, `error()` |
| Loader | `utils/loader.js` | `show()`, `hide()` |
| Confirm | `utils/confirm.js` | `show()`, `delete()` |
| GridUtil | `utils/grid.js` | `renderCategoryGrid()`, `renderVariantGrid()` |
| i18n | `utils/i18n.js` | `t()`, `setLocale()`, `getLocale()`, `hasLocale()` |
| debounce | `utils/performance.js` | Debounce function for search inputs |

---

## Critical Paths

### 1. User Authentication Flow

**Files:** `modules/auth.js`, `components/pinpad.js`, `state/state.js`

```
1. User clicks "Owner" or "Manager" button
2. If Owner:
   a. Show PIN entry screen
   b. User enters 5-digit PIN via PinPad component
   c. Compare with State.adminPin
   d. If match: completeLogin('admin')
3. If Manager:
   a. Directly call completeLogin('worker')
4. completeLogin():
   a. Set State.userRole and State.isAdminUnlocked
   b. Add body class (is-admin or is-worker)
   c. Update role badge
   d. Hide login screen
   e. Call initAfterLogin() callback
```

### 2. Complete Sale Transaction

**Files:** `modules/sales.js`, `state/storage.js`, `modules/dashboard.js`

```
1. Validate: cart not empty, payment method selected
2. Get customer info from form
3. For each cart item:
   a. Calculate total and profit
   b. Call Storage.updateInventoryQty(key, -qty) [uses Firebase transaction]
4. Create sale object with unique ID
5. Push to State.sales
6. Call Storage.saveSale() [localStorage + Firebase]
7. If customer name provided:
   a. Check if customer exists
   b. If new, add to State.customers and save
8. Set currentSaleData for SMS
9. Show success modal
10. Reset cart and UI
11. Call Dashboard.render() to update stats
```

### 3. Bulk Stock Entry Session

**Files:** `modules/inventory.js`, `state/storage.js`

```
1. User clicks "Start Session"
2. Validate: vendor name required (if new purchase)
3. Create State.stockSession object
4. For each item:
   a. Select category, variant
   b. Enter qty, cost, price, alert
   c. Click "Add to Queue" - adds to session.items (NOT saved)
5. User clicks "Complete Session"
6. Show confirmation dialog
7. For each session.items:
   a. Call Storage.updateInventoryQty() [atomic Firebase transaction]
8. Create stock log entry
9. Push to State.stockLogs
10. Call Storage.saveStockLog()
11. Reset session and UI
```

### 4. Booking Lifecycle

**Files:** `modules/bookings.js`, `state/storage.js`

```
1. Create booking from cart:
   a. Validate customer, pickup date, advance amount
   b. Calculate totals, profit
   c. Reduce inventory (atomic)
   d. Create booking object with advancePayments[]
   e. Save customer if new
   f. Save booking
   g. Show receipt

2. Add advance payment:
   a. Add to advancePayments[]
   b. Update totalAdvance, balanceRemaining
   c. Save booking

3. Complete booking (pickup):
   a. Record finalPayment
   b. Set status = 'completed'
   c. Save booking

4. Cancel booking:
   a. Restore inventory (atomic)
   b. Set status = 'cancelled'
   c. Record refund if applicable
   d. Save booking
```

---

## Key Files Reference

| Category | Files | Why Important |
|----------|-------|---------------|
| Entry | `index.html`, `js/bridges.js`, `js/app.js` | Application bootstrap and initialization |
| Config | `js/config/constants.js`, `js/config/firebase.js` | App settings, Firebase connection |
| State | `js/state/state.js`, `js/state/storage.js` | All app data and persistence logic |
| Core Logic | `js/modules/sales.js`, `js/modules/inventory.js`, `js/modules/bookings.js` | Main business operations |
| Templates | `js/templates/index.js`, `js/templates/**/*.js` | All HTML structure |
| Styles | `css/styles.css`, `css/base/variables.css` | Visual styling and theming |
| Auth | `js/modules/auth.js`, `js/components/pinpad.js` | Login and role management |

---

## Patterns & Conventions

### Naming

- **Functions:** camelCase, verb-first (`renderStockList`, `saveCustomer`, `showAddModal`)
- **Variables:** camelCase (`selectedCategory`, `isAdminUnlocked`)
- **Constants:** camelCase (`firebaseConfig`, `STORAGE_KEYS`)
- **DOM IDs:** camelCase (`todaySales`, `addCartModal`)
- **CSS Classes:** kebab-case (`.stat-card`, `.btn-primary`, `.modal-overlay`)

### Module Pattern

```javascript
// Each module exports a single object with methods
export const ModuleName = {
    init(callbacks) { /* setup dependencies */ },
    methodOne() { /* ... */ },
    methodTwo() { /* ... */ }
};

// Private functions via debounce pattern
ModuleName._performSearch = function() { /* ... */ };
ModuleName.search = debounce(ModuleName._performSearch.bind(ModuleName), 300);
```

### Event Handling

HTML onclick attributes call global functions (via bridges.js):
```html
<button onclick="showPage('sale')">Sale</button>
```

bridges.js maps to modules:
```javascript
window.showPage = (pageId) => Navigation.showPage(pageId);
```

Delegated event handlers in modules:
```javascript
DOM.on(DOM.get('cartItems'), 'click', '[data-action]', (e, el) => {
    const action = el.dataset.action;
    if (action === 'remove') this.removeFromCart(index);
});
```

### State Updates

```javascript
// Always update in this order:
1. State.dataArray.push(item);          // Update state
2. Storage.setLocal(KEY, State.dataArray); // Update localStorage
3. await db.collection('name').doc(id).set(item); // Update Firebase
```

### Error Handling

```javascript
async function loadData() {
    const db = getDb();
    if (!db) {
        // Fallback to localStorage
        State.data = this.getLocal(STORAGE_KEYS.data, []);
        return;
    }
    try {
        const snapshot = await db.collection('data').get();
        // Process snapshot
        this.setLocal(STORAGE_KEYS.data, State.data);
    } catch (e) {
        // Fallback to localStorage on error
        State.data = this.getLocal(STORAGE_KEYS.data, []);
    }
}
```

### Role-Based UI

```css
/* Hidden from workers entirely */
.admin-only { display: none; }
body.is-admin .admin-only { display: block; }

/* Hidden from workers */
body.is-worker .worker-hidden { display: none !important; }

/* Blurred for workers (sensitive data) */
body.is-worker .worker-blur { filter: blur(8px); }
```

---

## Quick Start Commands

| Action | Command |
|--------|---------|
| Local Dev | `npx serve .` or open `index.html` directly |
| Deploy | Push to `main` branch (GitHub Pages via static.yml) |

---

## Where To Find Things

| If you need... | Look in... |
|----------------|------------|
| Add new API endpoint | N/A (client-side only, uses Firebase) |
| Add new page | 1. `templates/pages/`, 2. `modules/`, 3. `bridges.js`, 4. `app.js` |
| Add new modal | 1. `templates/modals/`, 2. `templates/index.js`, 3. `bridges.js` |
| Modify business logic | `js/modules/` (sales, inventory, bookings, etc.) |
| Change styling | `css/` (components, features, base) |
| Add new data entity | 1. `state/state.js`, 2. `state/storage.js`, 3. `config/constants.js` |
| Modify Firebase | `config/firebase.js`, `state/storage.js` |
| Add i18n translations | `utils/i18n.js` |
| Debug state | Browser console: `State`, `State.sales`, `State.inventory` |

---

## Technical Debt & Notes

1. **No Build System** - Vanilla JS, no bundling. All imports are ES6 modules.
2. **Firebase in HTML** - Firebase SDK loaded via CDN in index.html before modules.
3. **Global Functions** - bridges.js exposes 100+ window functions for HTML onclick.
4. **Timestamp-based Sync** - Conflict resolution uses `updatedAt` field.
5. **Stock Photo Storage** - Invoice photos stored as base64 in Firestore (size limits).
6. **PIN Storage** - Admin PIN in both localStorage and Firestore (synced across devices).
7. **Master PIN** - Hardcoded recovery PIN: `181866` (in constants.js).

---

*Last updated: 2026-04-21*
