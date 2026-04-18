# Manikanta Enterprises

A comprehensive sales and inventory management application designed for retail businesses.

---

## What is Manikanta Enterprises?

Manikanta Enterprises is a web-based point-of-sale (POS) and inventory tracking system built specifically for small to medium retail businesses such as furniture stores, home goods shops, and similar establishments.

---

## Why Use Manikanta Enterprises?

Running a retail business involves juggling multiple tasks simultaneously - processing sales, monitoring stock levels, remembering customer preferences, and understanding business performance. Manikanta Enterprises brings all these functions together in one easy-to-use application.

**Key Benefits:**
- **Simplified Operations** - Process multi-item sales with just a few taps
- **Real-time Inventory** - Always know what's in stock and what needs reordering
- **Customer Insights** - Build relationships by tracking purchase history
- **Business Intelligence** - Make informed decisions with daily and monthly reports
- **Multi-device Access** - Use on phones, tablets, or desktop computers
- **Offline Capable** - Continue working even without internet connectivity
- **Team Collaboration** - Multiple users can work simultaneously with role-based access

---

## Features

### Role-Based Access Control

The application supports two user roles with different permission levels:

| Role | Description |
|------|-------------|
| **Owner** | Full access to all features including profit tracking, cost prices, editing capabilities, and administrative functions |
| **Manager** | Access to sales operations and daily tasks without visibility into sensitive financial data |

This separation ensures that business-critical information remains protected while allowing staff members to perform their daily duties efficiently.

---

### Sales Management

Process sales quickly and efficiently with features designed for real-world retail scenarios:

- **Multi-item Billing** - Add multiple products to a single transaction
- **Category-based Navigation** - Browse products organized by categories
- **Variant Support** - Handle different sizes, colors, or types of the same product
- **Flexible Pricing** - Enter negotiated prices for each item when customers bargain
- **Quantity Adjustment** - Easily modify quantities in the cart before checkout
- **Payment Methods** - Support for Cash and UPI payments
- **Customer Linking** - Associate sales with customer records for future reference

---

### Inventory Management

Maintain accurate stock levels with comprehensive inventory tools:

- **Real-time Stock Tracking** - View current inventory quantities at a glance
- **Automatic Stock Reduction** - Inventory updates automatically when sales are completed
- **Session-based Bulk Entry** - Enter vendor details once, then add multiple items efficiently
- **Invoice Photo Capture** - Take photos of invoices for record-keeping
- **Cost Price Tracking** - Monitor purchase costs (visible to Owner only)
- **Selling Price Reference** - Display suggested prices during sales
- **Low Stock Alerts** - Receive notifications when items fall below custom thresholds
- **Stock Editing** - Modify quantities, prices, and alert levels as needed

---

### Stock Addition Tracking (Owner Only)

Prevent inventory fraud with comprehensive stock logging:

- **Bulk Entry Logging** - All bulk stock entries are logged with vendor details, invoice number, and timestamp
- **During Sale Tracking** - When new variants are added during a sale, stock is automatically logged as "Added during sale"
- **Invoice Photos** - Attach invoice photos to stock entries for verification
- **Stock Log Report** - View complete history of all stock additions in Reports > Stock Log
- **Entry Details** - Each log shows items added, quantities, cost prices, and who added them
- **Photo Viewer** - View attached invoice photos in a full-screen popup

---

### Product Management

Organize your product catalog effectively:

- **Pre-configured Categories** - Comes with common retail categories ready to use
- **Custom Categories** - Add new product categories as your business grows
- **Variant Management** - Create and manage product variations (sizes, types, etc.)
- **Flexible Structure** - Designed to accommodate expanding inventory

**Included Categories:**
Mattress, Cot, TV Stand, Chair, Table, Fan, Pillow, Bed Sheet, Sofa, Dining Table, Shoe Rack

---

### Customer Management

Build lasting customer relationships:

- **Customer Database** - Store names, phone numbers, and email addresses
- **Purchase History** - Track total spending per customer
- **Quick Search** - Find customers instantly during checkout
- **Automatic Saving** - New customers are saved automatically from sales transactions
- **Edit & Update** - Modify customer information as needed

---

### Reports & Analytics

Gain insights into your business performance:

- **Daily Reports** - View sales totals, items sold, and transaction counts for any date
- **Monthly Reports** - Analyze aggregated performance over longer periods
- **Profit Tracking** - Monitor margins and profitability (Owner only)
- **Profit Color Coding** - Profits display in green when positive, red when negative
- **Best Sellers** - Identify top-performing products by quantity sold
- **Stock Log** - View complete history of stock additions (Owner only)
- **Transaction History** - Access detailed records of past sales

---

### Transaction Management

Maintain complete control over your sales records:

- **Transaction Details** - View complete breakdowns of any past sale
- **SMS Billing** - Send itemized bills to customers via text message
- **Bill Preview** - Review bill content before sending
- **Transaction Deletion** - Remove incorrect sales with automatic inventory restoration

---

### Data Synchronization

Keep your data safe and accessible:

- **Cloud Sync** - Real-time synchronization across all devices using Firebase
- **Multi-user Support** - Multiple team members can work simultaneously
- **Offline Mode** - Full functionality without internet, syncs when back online
- **Local Backup** - Data stored in browser for additional redundancy
- **Manual Backup** - Export data as JSON file for safekeeping
- **Data Restore** - Import backup files to recover data
- **Backup Reminders** - Periodic prompts to ensure data safety

---

### SMS Billing

Send professional bills to customers directly from the application:

- **One-tap Sending** - Opens the device's SMS app with pre-filled content
- **Itemized Format** - Clear breakdown of all items, quantities, and prices
- **Send Later** - Bills can be sent from transaction history if not sent immediately

**Sample Bill Format:**
```
MANIKANTA ENTERPRISES
========================
Date: 2026-04-16
Time: 2:30:45 PM
Customer: Customer Name
------------------------
Items:
- Product Name (Variant)
  Quantity x Price = Total
------------------------
Total: Amount
Payment: Method
========================
Thank you for your purchase!
```

---

## Technical Architecture

### Project Structure

```
smart-manager/
├── index.html                    # Main entry point (minimal shell)
├── README.md                     # User documentation
├── CLAUDE.md                     # Developer guide
│
├── css/
│   ├── styles.css                # Main entry (imports all modules)
│   ├── base/
│   │   ├── variables.css         # CSS custom properties
│   │   ├── reset.css             # Base resets
│   │   └── animations.css        # Keyframe animations
│   ├── layout/
│   │   ├── header.css            # App header styles
│   │   ├── navigation.css        # Bottom nav styles
│   │   ├── pages.css             # Page container styles
│   │   └── responsive.css        # Media queries
│   ├── components/
│   │   ├── buttons.css           # Button styles
│   │   ├── cards.css             # Card components
│   │   ├── forms.css             # Form elements
│   │   ├── modals.css            # Modal overlays
│   │   ├── lists.css             # List items
│   │   ├── badges.css            # Badge styles
│   │   ├── tabs.css              # Tab navigation
│   │   ├── loaders.css           # Loading spinners
│   │   ├── toast.css             # Toast notifications
│   │   ├── toggle.css            # Toggle switches
│   │   ├── pinpad.css            # PIN pad styles
│   │   └── alerts.css            # Alert boxes
│   └── features/
│       ├── login.css             # Login screen
│       ├── products.css          # Product grid
│       ├── cart.css              # Cart styles
│       ├── dashboard.css         # Dashboard stats
│       └── roles.css             # Role-based visibility
│
├── html/
│   ├── firebase-setup.html       # Firebase setup guide
│   └── project-setup.html        # Product configuration tool
│
├── json/
│   ├── manifest.json             # PWA manifest
│   └── demo.backup.json          # Demo data for testing
│
└── js/
    ├── app.js                    # Main application entry
    ├── bridges.js                # Global function bridges for HTML onclick
    │
    ├── config/
    │   ├── constants.js          # Currency symbol, storage keys, defaults
    │   ├── firebase.js           # Firebase configuration & initialization
    │   ├── icons.js              # Category icon mappings
    │   └── index.js              # Config exports
    │
    ├── utils/
    │   ├── dom.js                # DOM manipulation helpers
    │   ├── format.js             # Currency, date, time formatting
    │   ├── template.js           # Template rendering engine
    │   ├── toast.js              # Toast notifications
    │   └── index.js              # Utils exports
    │
    ├── state/
    │   ├── state.js              # Centralized application state
    │   └── storage.js            # LocalStorage + Firebase sync
    │
    ├── components/
    │   ├── pinpad.js             # Reusable PIN pad component
    │   └── modal.js              # Modal component utilities
    │
    ├── modules/
    │   ├── auth.js               # Authentication & role management
    │   ├── backup.js             # Backup & restore functionality
    │   ├── customers.js          # Customer management
    │   ├── dashboard.js          # Dashboard rendering
    │   ├── inventory.js          # Inventory management
    │   ├── navigation.js         # Page navigation
    │   ├── products.js           # Product & category management
    │   ├── reports.js            # Daily/monthly reports
    │   ├── sales.js              # Sales processing & cart
    │   └── transactions.js       # Transaction details & deletion
    │
    └── templates/
        ├── index.js              # Template loader & assembler
        ├── components/
        │   ├── header.js         # App header template
        │   ├── login.js          # Login screen template
        │   └── nav.js            # Bottom navigation template
        ├── pages/
        │   ├── dashboard.js      # Dashboard page
        │   ├── sale.js           # Sales page
        │   ├── inventory.js      # Inventory page
        │   ├── customers.js      # Customers page
        │   ├── reports.js        # Reports page
        │   ├── products.js       # Products page
        │   └── settings.js       # Settings page
        ├── modals/
        │   ├── pin.js            # PIN entry modal
        │   ├── cart.js           # Add to cart modal
        │   ├── saleComplete.js   # Sale success modal
        │   ├── addProduct.js     # Add product modal
        │   ├── addCustomer.js    # Add customer modal
        │   ├── addCategory.js    # Add category modal
        │   ├── addVariant.js     # Add variant modal
        │   ├── editStock.js      # Edit stock modal
        │   ├── transaction.js    # Transaction details modal
        │   ├── stockLog.js       # Stock log detail modal
        │   └── photoView.js      # Invoice photo viewer modal
        └── data/
            └── templates.js      # Reusable data templates
```

### Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript | No build step, easy deployment |
| **Modules** | ES6 Modules | Clean separation of concerns |
| **Database** | Firebase Firestore | Real-time cloud sync |
| **Auth** | Firebase Anonymous Auth | No user accounts needed |
| **Offline** | IndexedDB + LocalStorage | Offline persistence |
| **Architecture** | Progressive Web App (PWA) | Installable, offline-capable |

### Design Principles

- **Modular Architecture** - Code organized by feature and responsibility
- **Mobile-first** - Optimized for use on shop counters and mobile devices
- **Tap-based Interface** - Minimal typing required for common operations
- **Responsive Layout** - Adapts seamlessly to any screen size
- **Safe Area Support** - Works properly on devices with notches and rounded corners
- **Cross-browser Compatible** - Functions on all modern browsers

---

## Setup Instructions

### Step 1: Firebase Configuration

1. Open `html/firebase-setup.html` in your browser
2. Follow the step-by-step guide to create a Firebase project
3. Enable Firestore Database and Anonymous Authentication
4. Copy your Firebase configuration values

### Step 2: Application Configuration

1. Open `js/config/firebase.js` in a text editor
2. Replace the `firebaseConfig` values with your Firebase configuration
3. Save the file

### Step 3: Deployment

**For Local Use:**
- Open `index.html` directly in your browser
- Or use a local server: `npx serve .`

**For Team Use:**
- Deploy to any static hosting (Firebase Hosting, Netlify, Vercel, etc.)
- Share the URL with team members
- Each device accesses the same Firebase project

**For Mobile Installation:**
- Open in browser and use "Add to Home Screen" option
- The app will function like a native application

---

## Browser Support

The application is compatible with:

- Google Chrome (recommended)
- Safari
- Mozilla Firefox
- Microsoft Edge
- Samsung Internet
- Opera

**Supported Devices:**
- Android phones and tablets
- iPhones and iPads
- Windows, Mac, and Linux desktops

---

## Development

### Key Files for Developers

| File | Purpose |
|------|---------|
| `js/config/constants.js` | Currency symbol, storage keys, default products |
| `js/config/firebase.js` | Firebase configuration |
| `js/state/state.js` | Application state structure |
| `js/modules/*.js` | Feature logic |
| `js/templates/**/*.js` | HTML templates |
| `claude.md` | Comprehensive developer guide |

### Adding New Features

1. Create module in `js/modules/`
2. Create templates in `js/templates/`
3. Register in `js/app.js`
4. Add global bridges in `js/bridges.js` if needed

---

## Future Enhancements

The following features are planned for future development:

- **Expense Tracking** - Monitor rent, utilities, and other business expenses
- **Vendor Management** - Store supplier information and track purchase orders
- **Installment Payments** - Support for EMI and partial payment tracking

---

## Support

For issues, feature requests, or feedback, please document the details and share with the development team.

---

*Built for small business owners who deserve powerful tools without complexity.*
