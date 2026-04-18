// Add Customer Modal Template

export const AddCustomerModalTemplate = `
<div class="modal-overlay" id="addCustomerModal" onclick="closeAddCustomerModal()">
    <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3 class="modal-title">Add New Customer</h3>
            <button class="modal-close" onclick="closeAddCustomerModal()">&times;</button>
        </div>
        <div class="form-group">
            <label class="form-label">Customer Name</label>
            <input class="form-input" id="newCustomerName" placeholder="Enter name" type="text">
        </div>
        <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input class="form-input" id="newCustomerPhone" placeholder="10-digit number" type="tel">
        </div>
        <div class="form-group">
            <label class="form-label">Email (Optional)</label>
            <input class="form-input" id="newCustomerEmail" placeholder="email@example.com" type="email">
        </div>
        <button class="btn btn-primary btn-block" onclick="saveNewCustomer()">Add Customer</button>
    </div>
</div>
`;
