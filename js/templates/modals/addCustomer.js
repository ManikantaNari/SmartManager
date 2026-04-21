// Add Customer Modal Template

export const AddCustomerModalTemplate = `
<div class="modal-overlay" id="addCustomerModal" onclick="closeAddCustomerModal()">
    <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3 class="modal-title" data-i18n="modals.addNewCustomer">Add New Customer</h3>
            <button class="modal-close" onclick="closeAddCustomerModal()">&times;</button>
        </div>
        <div class="form-group">
            <label class="form-label" data-i18n="customers.name">Customer Name</label>
            <input class="form-input" id="newCustomerName" data-i18n-placeholder="customers.enterName" placeholder="Enter name" type="text">
        </div>
        <div class="form-group">
            <label class="form-label" data-i18n="customers.phone">Phone Number</label>
            <input class="form-input" id="newCustomerPhone" data-i18n-placeholder="customers.enterPhone" placeholder="10-digit number" type="tel">
        </div>
        <div class="form-group">
            <label class="form-label"><span data-i18n="customers.email">Email</span> (<span data-i18n="common.optional">Optional</span>)</label>
            <input class="form-input" id="newCustomerEmail" placeholder="email@example.com" type="email">
        </div>
        <button class="btn btn-primary btn-block" onclick="saveNewCustomer()" data-i18n="customers.addCustomer">Add Customer</button>
    </div>
</div>
`;
