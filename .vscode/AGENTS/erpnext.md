# ERPNext Development Guide

## Overview

ERPNext is a comprehensive ERP built on Frappe Framework. This guide covers ERPNext-specific modules, business logic patterns, and domain customizations.

## 📋 Table of Contents

1. [ERPNext Architecture](#erpnext-architecture)
2. [Core Modules](#core-modules)
3. [Accounting Module](#accounting-module)
4. [Selling Module](#selling-module)
5. [Buying Module](#buying-module)
6. [Stock Module](#stock-module)
7. [Manufacturing](#manufacturing)
8. [HR Module](#hr-module)
9. [Common Patterns](#common-patterns)
10. [Customization Best Practices](#customization-best-practices)

---

## ERPNext Architecture

### Application Structure

```
/home/frappe/frappe-bench/apps/erpnext/erpnext/
├── accounts/           # Financial accounting
├── assets/             # Fixed asset management
├── buying/             # Procurement
├── selling/            # Sales
├── stock/              # Inventory
├── manufacturing/      # Production
├── hr/                 # (Deprecated - moved to HRMS app)
├── crm/                # Customer relationship
├── projects/           # Project management
├── support/            # Customer support
├── quality_management/ # Quality control
├── healthcare/         # Healthcare domain
├── education/          # Education domain
├── non_profit/         # Non-profit domain
├── regional/           # Country-specific features
├── utilities/          # Helper utilities
└── controllers/        # Base controllers
```

### Key Concepts

**1. Transaction Flow:**
```
Quotation → Sales Order → Delivery Note → Sales Invoice → Payment Entry
Purchase Order → Purchase Receipt → Purchase Invoice → Payment Entry
```

**2. Stock Ledger:**
- All stock movements tracked
- FIFO/LIFO/Moving Average valuation
- Batch and serial number tracking

**3. General Ledger:**
- Double-entry accounting
- Automatic GL entries on submit
- Cost centers and profit centers

---

## Core Modules

### Accounts Module

**Location:** `/apps/erpnext/erpnext/accounts/`

**Key DocTypes:**
```
- Sales Invoice
- Purchase Invoice
- Payment Entry
- Journal Entry
- GL Entry
- Account
- Cost Center
- Fiscal Year
- Tax Rule
```

**Common Controllers:**
```python
# Base for all accounting transactions
from erpnext.controllers.accounts_controller import AccountsController

class SalesInvoice(AccountsController):
    def make_gl_entries(self, gl_entries=None):
        # Create accounting entries
        pass
```

---

## Accounting Module

### Sales Invoice Flow

```python
from erpnext.accounts.doctype.sales_invoice.sales_invoice import SalesInvoice

class CustomSalesInvoice(SalesInvoice):
    def validate(self):
        super().validate()
        # Custom validation
        
    def on_submit(self):
        super().on_submit()
        # Custom logic after submit
```

### Payment Entry

```python
# Get payment entry from invoice
from erpnext.accounts.doctype.payment_entry.payment_entry import get_payment_entry

payment = get_payment_entry("Sales Invoice", invoice_name)
payment.posting_date = today()
payment.insert()
payment.submit()
```

### GL Entry Structure

```python
{
    "account": "Debtors - Company",
    "party_type": "Customer",
    "party": "CUST-001",
    "debit": 1000.0,
    "credit": 0.0,
    "debit_in_account_currency": 1000.0,
    "credit_in_account_currency": 0.0,
    "against": "Sales - Company",
    "voucher_type": "Sales Invoice",
    "voucher_no": "SINV-001",
    "posting_date": "2025-01-01",
    "cost_center": "Main - Company"
}
```

### Tax Calculation

```python
# Tax template structure
{
    "charge_type": "On Net Total",  # or "Actual", "On Previous Row Total"
    "account_head": "VAT - Company",
    "rate": 14.0,
    "description": "VAT 14%"
}

# Custom tax calculation
class CustomInvoice(AccountsController):
    def calculate_taxes_and_totals(self):
        super().calculate_taxes_and_totals()
        # Add custom tax logic
```

---

## Selling Module

### Sales Order

```python
from erpnext.selling.doctype.sales_order.sales_order import SalesOrder

class CustomSalesOrder(SalesOrder):
    def validate(self):
        super().validate()
        self.validate_delivery_date()
    
    def validate_delivery_date(self):
        if self.delivery_date < self.transaction_date:
            frappe.throw("Delivery date cannot be before transaction date")
```

### Quotation to Order

```python
# Make sales order from quotation
from erpnext.selling.doctype.quotation.quotation import make_sales_order

so = make_sales_order(quotation_name)
so.delivery_date = add_days(today(), 7)
so.insert()
```

### Customer Management

```python
# Get customer details
customer = frappe.get_doc("Customer", customer_name)

# Customer fields
customer.customer_name
customer.customer_group
customer.territory
customer.tax_id
customer.default_price_list
customer.default_currency

# Get outstanding
outstanding = frappe.db.get_value(
    "Sales Invoice",
    {"customer": customer_name, "docstatus": 1},
    "sum(outstanding_amount)"
)
```

---

## Buying Module

### Purchase Order

```python
from erpnext.buying.doctype.purchase_order.purchase_order import PurchaseOrder

class CustomPurchaseOrder(PurchaseOrder):
    def validate(self):
        super().validate()
        self.validate_budget()
    
    def validate_budget(self):
        # Custom budget validation
        pass
```

### Supplier Quotation

```python
# Create purchase order from supplier quotation
from erpnext.buying.doctype.supplier_quotation.supplier_quotation import make_purchase_order

po = make_purchase_order(supplier_quotation_name)
po.schedule_date = add_days(today(), 14)
po.insert()
```

---

## Stock Module

### Stock Entry

```python
from erpnext.stock.doctype.stock_entry.stock_entry import StockEntry

# Create material transfer
se = frappe.new_doc("Stock Entry")
se.stock_entry_type = "Material Transfer"
se.from_warehouse = "Store - Company"
se.to_warehouse = "Production - Company"

se.append("items", {
    "item_code": "ITEM-001",
    "qty": 10,
    "uom": "Nos",
    "basic_rate": 100
})

se.insert()
se.submit()
```

### Item Pricing

```python
# Get item price
from erpnext.stock.get_item_details import get_item_price

price = get_item_price({
    "item_code": "ITEM-001",
    "price_list": "Standard Selling",
    "customer": "CUST-001",
    "company": "Company",
    "uom": "Nos",
    "qty": 10
})
```

### Stock Ledger Entry

```python
# Stock movement structure
{
    "item_code": "ITEM-001",
    "warehouse": "Store - Company",
    "posting_date": "2025-01-01",
    "posting_time": "10:00:00",
    "voucher_type": "Stock Entry",
    "voucher_no": "MAT-STE-001",
    "actual_qty": 10,  # Positive for IN, Negative for OUT
    "qty_after_transaction": 100,
    "incoming_rate": 150.0,
    "valuation_rate": 145.0,
    "stock_value": 14500.0,
    "batch_no": "BATCH-001",  # If applicable
    "serial_no": "SN-001\nSN-002"  # Newline separated
}
```

### Batch & Serial Numbers

```python
# Batch tracking
class CustomItem(Document):
    def validate(self):
        if self.has_batch_no:
            # Batch validation
            pass

# Serial number tracking
from erpnext.stock.doctype.serial_no.serial_no import get_serial_nos

serial_nos = get_serial_nos("SN-001\nSN-002\nSN-003")
```

---

## Manufacturing

### BOM (Bill of Materials)

```python
from erpnext.manufacturing.doctype.bom.bom import BOM

class CustomBOM(BOM):
    def validate(self):
        super().validate()
        self.calculate_cost()
    
    def calculate_cost(self):
        # Custom cost calculation
        pass
```

### Work Order

```python
# Create work order
wo = frappe.new_doc("Work Order")
wo.production_item = "FG-ITEM-001"
wo.bom_no = "BOM-001"
wo.qty = 100
wo.wip_warehouse = "Work In Progress - Company"
wo.fg_warehouse = "Finished Goods - Company"
wo.insert()
wo.submit()

# Create stock entry from work order
from erpnext.manufacturing.doctype.work_order.work_order import make_stock_entry

se = make_stock_entry(wo.name, "Manufacture")
se.insert()
se.submit()
```

---

## HR Module

**Note:** HR module has been moved to separate HRMS app.

### Employee

```python
# Get employee by user
employee = frappe.db.get_value("Employee", {"user_id": frappe.session.user})

# Employee fields
employee_doc = frappe.get_doc("Employee", employee)
employee_doc.employee_name
employee_doc.department
employee_doc.designation
employee_doc.company
```

### Leave Application

```python
# Create leave application
leave = frappe.new_doc("Leave Application")
leave.employee = employee_name
leave.leave_type = "Casual Leave"
leave.from_date = "2025-01-15"
leave.to_date = "2025-01-17"
leave.total_leave_days = 3
leave.insert()
leave.submit()
```

---

## Common Patterns

### Status Management

```python
class CustomTransaction(Document):
    def on_update(self):
        self.update_status()
    
    def update_status(self):
        if self.docstatus == 0:
            self.status = "Draft"
        elif self.docstatus == 1:
            if self.per_billed == 100:
                self.status = "Completed"
            elif self.per_billed > 0:
                self.status = "Partly Billed"
            else:
                self.status = "To Bill"
        elif self.docstatus == 2:
            self.status = "Cancelled"
```

### Percentage Calculation

```python
# Update percentage fields
def update_billing_percentage(self):
    total_qty = sum(item.qty for item in self.items)
    billed_qty = sum(item.billed_qty for item in self.items)
    
    if total_qty > 0:
        self.per_billed = (billed_qty / total_qty) * 100
```

### Party Balance

```python
# Get party outstanding
from erpnext.accounts.party import get_party_account_balance

balance = get_party_account_balance(
    party_type="Customer",
    party="CUST-001",
    company="Company"
)
```

### Currency Conversion

```python
# Convert currency
from erpnext.setup.utils import get_exchange_rate

exchange_rate = get_exchange_rate(
    from_currency="USD",
    to_currency="EGP",
    transaction_date="2025-01-01"
)

amount_in_egp = amount_in_usd * exchange_rate
```

---

## Customization Best Practices

### Extending Controllers

```python
# ✅ Good: Extend parent class
from erpnext.selling.doctype.sales_invoice.sales_invoice import SalesInvoice

class CustomSalesInvoice(SalesInvoice):
    def validate(self):
        super().validate()
        self.custom_validation()
    
    def custom_validation(self):
        # Custom logic
        pass

# ❌ Bad: Override without super()
class CustomSalesInvoice(SalesInvoice):
    def validate(self):
        # Missing super().validate()
        self.custom_validation()
```

### Using Hooks

```python
# hooks.py
doc_events = {
    "Sales Invoice": {
        "validate": "my_app.custom.sales_invoice_validate",
        "on_submit": "my_app.custom.sales_invoice_submit"
    }
}

# my_app/custom.py
def sales_invoice_validate(doc, method):
    # Custom validation
    if doc.customer_group == "VIP":
        doc.priority = "High"

def sales_invoice_submit(doc, method):
    # Post-submit actions
    send_notification(doc)
```

### Custom Fields

```python
# Add custom fields via fixtures
fixtures = [
    {
        "dt": "Custom Field",
        "filters": [
            ["dt", "in", ["Sales Invoice", "Customer"]]
        ]
    }
]

# Create programmatically
def create_custom_fields():
    if not frappe.db.exists("Custom Field", 
                           {"dt": "Sales Invoice", 
                            "fieldname": "custom_tax_id"}):
        frappe.get_doc({
            "doctype": "Custom Field",
            "dt": "Sales Invoice",
            "fieldname": "custom_tax_id",
            "label": "Tax ID",
            "fieldtype": "Data",
            "insert_after": "customer"
        }).insert()
```

### Overriding Methods

```python
# hooks.py
override_whitelisted_methods = {
    "erpnext.selling.doctype.sales_order.sales_order.make_delivery_note": 
        "my_app.custom.make_custom_delivery_note"
}

# my_app/custom.py
@frappe.whitelist()
def make_custom_delivery_note(source_name):
    from erpnext.selling.doctype.sales_order.sales_order import make_delivery_note
    
    dn = make_delivery_note(source_name)
    
    # Custom modifications
    dn.custom_field = "Custom Value"
    
    return dn
```

---

## Domain-Specific Features

### Regional Compliance

```python
# Regional settings
# apps/erpnext/erpnext/regional/[country]/

# Egypt example
from erpnext.regional.egypt.utils import create_tax_invoice

# India GST
from erpnext.regional.india.utils import get_gst_accounts
```

### Industry Domains

```python
# Healthcare
from erpnext.healthcare.doctype.patient_appointment.patient_appointment import PatientAppointment

# Education
from erpnext.education.doctype.student.student import Student

# Non-profit
from erpnext.non_profit.doctype.member.member import Member
```

---

## Quick Reference

### Common ERPNext APIs

```python
# Party
from erpnext.accounts.party import get_party_account
from erpnext.accounts.party import get_party_bank_account

# Price list
from erpnext.stock.get_item_details import get_item_price
from erpnext.stock.get_item_details import get_item_details

# Tax
from erpnext.controllers.taxes_and_totals import get_itemised_tax

# Currency
from erpnext.setup.utils import get_exchange_rate

# Stock
from erpnext.stock.stock_balance import get_balance_qty_from_sle
from erpnext.stock.utils import get_stock_balance

# Serial/Batch
from erpnext.stock.doctype.serial_no.serial_no import get_serial_nos
from erpnext.stock.doctype.batch.batch import get_batch_qty
```

---

*ERPNext is highly customizable. Always extend rather than modify core code. Use hooks and custom apps for customizations.*
