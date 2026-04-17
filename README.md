# Smart Manager
A comprehensive sales and inventory management application designed for retail businesses.
---
## What is Smart Manager?
Smart Manager is a web-based point-of-sale (POS) and inventory tracking system built specifically for small to medium retail businesses such as furniture stores, home goods shops, and similar estab...
---
## Why Use Smart Manager?
Running a retail business involves juggling multiple tasks simultaneously - processing sales, monitoring stock levels, remembering customer preferences, and understanding business performance. Smar...
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
- **Stock Replenishment** - Record new inventory arrivals with ease
- **Cost Price Tracking** - Monitor purchase costs (visible to Owner only)
- **Selling Price Reference** - Display suggested prices during sales
- **Low Stock Alerts** - Receive notifications when items fall below custom thresholds
- **Stock Editing** - Modify quantities, prices, and alert levels as needed
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
- **Best Sellers** - Identify top-performing products by quantity sold
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
SMART MANAGER BILL
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
### File Structure
```
/
??? smart-manager.html # Main application (HTML structure)
??? styles.css # Application styling
??? app.js # Application logic
??? firebase-setup.html # Firebase configuration guide
??? manifest.json # PWA manifest for installation
??? product-setup.html # Product configuration utility
??? README.md # Documentation
```
### Technology Stack
- **Frontend** - HTML5, CSS3, Vanilla JavaScript
- **Database** - Firebase Firestore (cloud-based)
- **Authentication** - Firebase Anonymous Auth
- **Offline Storage** - IndexedDB and LocalStorage
- **Architecture** - Progressive Web App (PWA)
### Design Principles
- **Mobile-first** - Optimized for use on shop counters and mobile devices
- **Tap-based Interface** - Minimal typing required for common operations
- **Responsive Layout** - Adapts seamlessly to any screen size
- **Safe Area Support** - Works properly on devices with notches and rounded corners
- **Cross-browser Compatible** - Functions on all modern browsers
---
## Setup Instructions
### Step 1: Firebase Configuration
1. Open `firebase-setup.html` in your browser
2. Follow the step-by-step guide to create a Firebase project
3. Enable Firestore Database and Anonymous Authentication
4. Copy your Firebase configuration values
### Step 2: Application Configuration
1. Open `app.js` in a text editor
2. Locate the `firebaseConfig` section at the top
3. Replace placeholder values with your Firebase configuration
4. Save the file
### Step 3: Deployment
**For Local Use:**
- Open `smart-manager.html` directly in your browser
  **For Team Use:**
- Share the configured files with team members
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