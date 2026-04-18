// Customers Page Template

export const CustomersTemplate = `
<div class="page" id="page-customers">
    <div class="search-box">
        <svg fill="none" height="20" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="20">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
        </svg>
        <input id="allCustomerSearch" oninput="filterAllCustomers()" placeholder="Search customers..." type="text">
    </div>
    <button class="btn btn-primary btn-block" onclick="showAddCustomerModal()" style="margin-bottom: 16px;">
        + Add New Customer
    </button>
    <div id="allCustomersList"></div>
</div>
`;
