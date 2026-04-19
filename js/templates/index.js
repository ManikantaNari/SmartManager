// Template Index - Assembles all templates into the DOM

// Components
import { LoginTemplate } from './components/login.js';
import { HeaderTemplate } from './components/header.js';
import { NavTemplate } from './components/nav.js';

// Pages
import { DashboardTemplate } from './pages/dashboard.js';
import { SaleTemplate } from './pages/sale.js';
import { InventoryTemplate } from './pages/inventory.js';
import { ReportsTemplate } from './pages/reports.js';
import { CustomersTemplate } from './pages/customers.js';
import { ProductsTemplate } from './pages/products.js';
import { SettingsTemplate } from './pages/settings.js';
import { BookingsTemplate } from './pages/bookings.js';

// Modals
import { PinModalTemplate } from './modals/pin.js';
import { CartModalTemplate } from './modals/cart.js';
import { SaleCompleteModalTemplate } from './modals/saleComplete.js';
import { AddProductModalTemplate } from './modals/addProduct.js';
import { AddCustomerModalTemplate } from './modals/addCustomer.js';
import { AddCategoryModalTemplate, EditCategoryModalTemplate } from './modals/addCategory.js';
import { AddVariantModalTemplate, EditVariantModalTemplate } from './modals/addVariant.js';
import { EditStockModalTemplate } from './modals/editStock.js';
import { TransactionModalTemplate } from './modals/transaction.js';
import { StockLogModalTemplate } from './modals/stockLog.js';
import { PhotoViewModalTemplate } from './modals/photoView.js';
import { BookingDetailsModalTemplate } from './modals/bookingDetails.js';
import { CreateBookingModalTemplate } from './modals/createBooking.js';
import { AddAdvanceModalTemplate, ChangeDateModalTemplate, CompleteBookingModalTemplate, CancelBookingModalTemplate, BookingReceiptModalTemplate } from './modals/addAdvance.js';
import { CustomerHistoryModalTemplate } from './modals/customerHistory.js';

// Data templates
import { DataTemplates } from './data/templates.js';

// Assemble all templates in correct order
export function loadTemplates() {
    const app = document.getElementById('app');

    if (!app) {
        console.error('App container #app not found');
        return;
    }

    // Build the HTML structure
    app.innerHTML = [
        LoginTemplate,
        HeaderTemplate,
        DashboardTemplate,
        SaleTemplate,
        InventoryTemplate,
        ReportsTemplate,
        CustomersTemplate,
        ProductsTemplate,
        SettingsTemplate,
        BookingsTemplate,
        NavTemplate,
        PinModalTemplate,
        CartModalTemplate,
        SaleCompleteModalTemplate,
        AddProductModalTemplate,
        AddCustomerModalTemplate,
        AddCategoryModalTemplate,
        EditCategoryModalTemplate,
        AddVariantModalTemplate,
        EditVariantModalTemplate,
        EditStockModalTemplate,
        TransactionModalTemplate,
        StockLogModalTemplate,
        PhotoViewModalTemplate,
        BookingDetailsModalTemplate,
        CreateBookingModalTemplate,
        AddAdvanceModalTemplate,
        ChangeDateModalTemplate,
        CompleteBookingModalTemplate,
        CancelBookingModalTemplate,
        BookingReceiptModalTemplate,
        CustomerHistoryModalTemplate,
        DataTemplates
    ].join('\n');
}

// Export individual templates for selective use
export {
    LoginTemplate,
    HeaderTemplate,
    NavTemplate,
    DashboardTemplate,
    SaleTemplate,
    InventoryTemplate,
    ReportsTemplate,
    CustomersTemplate,
    ProductsTemplate,
    SettingsTemplate,
    BookingsTemplate,
    PinModalTemplate,
    CartModalTemplate,
    SaleCompleteModalTemplate,
    AddProductModalTemplate,
    AddCustomerModalTemplate,
    AddCategoryModalTemplate,
    EditCategoryModalTemplate,
    AddVariantModalTemplate,
    EditVariantModalTemplate,
    EditStockModalTemplate,
    TransactionModalTemplate,
    StockLogModalTemplate,
    PhotoViewModalTemplate,
    BookingDetailsModalTemplate,
    CreateBookingModalTemplate,
    AddAdvanceModalTemplate,
    ChangeDateModalTemplate,
    CompleteBookingModalTemplate,
    CancelBookingModalTemplate,
    BookingReceiptModalTemplate,
    CustomerHistoryModalTemplate,
    DataTemplates
};
