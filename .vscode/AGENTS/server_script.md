# Server Script Development Guide

## Overview

Server Scripts contain Python business logic, data processing, and API endpoints in Frappe. This guide covers controller patterns, API methods, hooks, and server-side development.

## 📋 Table of Contents

1. [Server Script Basics](#server-script-basics)
2. [DocType Controllers](#doctype-controllers)
3. [Whitelisted Methods](#whitelisted-methods)
4. [Hooks System](#hooks-system)
5. [Database Operations](#database-operations)
6. [Background Jobs](#background-jobs)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)

---

## Server Script Basics

### File Locations

```
DocType Controller:
/apps/[app]/[app]/[module]/doctype/[doctype]/[doctype].py

Custom Methods:
/apps/[app]/[app]/[module]/api.py
/apps/[app]/[app]/api.py

Hooks:
/apps/[app]/[app]/hooks.py

Patches:
/apps/[app]/[app]/patches/[version]/[patch_name].py
```

### Basic Controller Structure

```python
# Copyright (c) 2025, Company and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class SalesInvoice(Document):
    # Lifecycle Methods
    def validate(self):
        """Called before save"""
        self.calculate_totals()
        self.validate_items()
    
    def before_save(self):
        """Called before document is saved"""
        pass
    
    def on_update(self):
        """Called after save"""
        pass
    
    def before_submit(self):
        """Called before submit"""
        pass
    
    def on_submit(self):
        """Called after submit"""
        self.create_gl_entries()
    
    def on_cancel(self):
        """Called on cancel"""
        self.cancel_gl_entries()
    
    def before_update_after_submit(self):
        """Called before update after submit"""
        pass
    
    def on_update_after_submit(self):
        """Called after update after submit"""
        pass
    
    def on_trash(self):
        """Called before delete"""
        pass
    
    # Custom Methods
    def calculate_totals(self):
        """Calculate invoice totals"""
        total = 0
        for item in self.items:
            total += item.amount
        self.total = total
    
    def validate_items(self):
        """Validate items table"""
        if not self.items:
            frappe.throw("Please add at least one item")
```

---

## DocType Controllers

### Lifecycle Hook Order

**Save Flow:**
```
1. validate()
2. before_save()
3. [Database Save]
4. on_update()
```

**Submit Flow:**
```
1. validate()
2. before_submit()
3. [Database Submit]
4. on_submit()
```

**Cancel Flow:**
```
1. before_cancel()
2. [Database Cancel]
3. on_cancel()
```

### Common Patterns

#### Validation

```python
class PaymentEntry(Document):
    def validate(self):
        # Validate required fields
        if not self.party:
            frappe.throw("Party is required")
        
        # Validate amounts
        if self.paid_amount <= 0:
            frappe.throw("Paid amount must be greater than zero")
        
        # Validate dates
        if getdate(self.posting_date) > getdate():
            frappe.throw("Posting date cannot be in future")
        
        # Custom validation
        self.validate_party_balance()
    
    def validate_party_balance(self):
        """Check party outstanding balance"""
        outstanding = frappe.db.get_value(
            self.party_type,
            self.party,
            "outstanding_amount"
        )
        
        if outstanding < self.paid_amount:
            frappe.msgprint(
                f"Outstanding balance is {outstanding}",
                alert=True
            )
```

#### Auto-Naming

```python
class SalesInvoice(Document):
    def autoname(self):
        # Custom naming
        if self.is_return:
            self.name = f"RET-{self.return_against}"
        else:
            # Use naming series
            from frappe.model.naming import make_autoname
            self.name = make_autoname('SINV-.YY.-.####')
```

#### Before Save

```python
class SalesInvoice(Document):
    def before_save(self):
        # Update calculated fields
        self.set_missing_values()
        
        # Set default values
        if not self.posting_time:
            self.posting_time = nowtime()
        
        # Update status
        self.update_status()
```

#### After Save

```python
class SalesInvoice(Document):
    def on_update(self):
        # Create linked documents
        if not self.payment_schedule:
            self.create_payment_schedule()
        
        # Update related documents
        self.update_sales_order()
        
        # Send notifications
        if self.is_new():
            self.send_notification()
```

#### Submit/Cancel

```python
class SalesInvoice(Document):
    def on_submit(self):
        # Create accounting entries
        self.make_gl_entries()
        
        # Update stock
        self.update_stock_ledger()
        
        # Update linked docs
        self.update_delivery_note_status()
    
    def on_cancel(self):
        # Reverse accounting entries
        self.cancel_gl_entries()
        
        # Reverse stock
        self.cancel_stock_ledger()
        
        # Update linked docs
        self.update_delivery_note_status()
```

---

## Whitelisted Methods

### Creating API Methods

```python
import frappe

@frappe.whitelist()
def get_customer_balance(customer, company):
    """Get customer outstanding balance"""
    
    balance = frappe.db.sql("""
        SELECT SUM(outstanding_amount)
        FROM `tabSales Invoice`
        WHERE customer = %s
        AND company = %s
        AND docstatus = 1
    """, (customer, company))[0][0] or 0
    
    return balance

@frappe.whitelist()
def create_sales_invoice(customer, items):
    """Create sales invoice from items"""
    import json
    
    # Parse JSON if string
    if isinstance(items, str):
        items = json.loads(items)
    
    # Create document
    doc = frappe.new_doc('Sales Invoice')
    doc.customer = customer
    doc.posting_date = frappe.utils.today()
    
    # Add items
    for item in items:
        doc.append('items', {
            'item_code': item['item_code'],
            'qty': item['qty'],
            'rate': item['rate']
        })
    
    # Save and return
    doc.insert()
    frappe.db.commit()
    
    return doc.name

@frappe.whitelist(allow_guest=True)
def public_api_method():
    """Method accessible without login"""
    return {"message": "Hello World"}
```

### Calling from Client

```javascript
frappe.call({
    method: 'my_app.api.get_customer_balance',
    args: {
        customer: 'CUST-001',
        company: 'Company A'
    },
    callback: function(r) {
        console.log(r.message);
    }
});
```

### DocType-Specific Methods

```python
class SalesInvoice(Document):
    @frappe.whitelist()
    def make_payment_entry(self):
        """Create payment entry for this invoice"""
        from erpnext.accounts.doctype.payment_entry.payment_entry import get_payment_entry
        
        pe = get_payment_entry(self.doctype, self.name)
        pe.insert()
        
        return pe.name

# Call from client:
# frappe.call({
#     method: 'make_payment_entry',
#     doc: frm.doc,
#     callback: function(r) {
#         frappe.set_route('Form', 'Payment Entry', r.message);
#     }
# });
```

---

## Hooks System

### Document Events

**In hooks.py:**

```python
doc_events = {
    "Sales Invoice": {
        "validate": "my_app.custom.sales_invoice_validate",
        "on_submit": "my_app.custom.sales_invoice_submit",
        "on_cancel": "my_app.custom.sales_invoice_cancel",
        "before_save": "my_app.custom.sales_invoice_before_save",
        "after_insert": "my_app.custom.sales_invoice_after_insert",
    },
    "*": {
        # Apply to all DocTypes
        "validate": "my_app.custom.global_validate",
    }
}
```

**Handler function:**

```python
# my_app/custom.py
import frappe

def sales_invoice_validate(doc, method):
    """Custom validation for Sales Invoice"""
    if doc.customer == "Banned Customer":
        frappe.throw("This customer is banned")

def sales_invoice_submit(doc, method):
    """After sales invoice submit"""
    # Send email notification
    frappe.sendmail(
        recipients=doc.contact_email,
        subject=f"Invoice {doc.name}",
        message="Your invoice is ready"
    )

def global_validate(doc, method):
    """Validate all documents"""
    # Add audit trail
    doc.last_modified_by = frappe.session.user
```

### Scheduler Events

```python
scheduler_events = {
    "daily": [
        "my_app.tasks.daily_cleanup"
    ],
    "hourly": [
        "my_app.tasks.send_reminders"
    ],
    "cron": {
        "0 0 * * *": [
            # Midnight
            "my_app.tasks.generate_reports"
        ],
        "*/15 * * * *": [
            # Every 15 minutes
            "my_app.tasks.sync_data"
        ]
    }
}
```

### Other Hooks

```python
# Override methods
override_whitelisted_methods = {
    "frappe.desk.form.save.savedocs": "my_app.override.custom_save"
}

# Fixtures (export data)
fixtures = [
    "Custom Field",
    {"dt": "Property Setter", "filters": [["name", "in", ["Item-allow_rename"]]]}
]

# Boot session
app_include_js = "/assets/my_app/js/my_app.js"
app_include_css = "/assets/my_app/css/my_app.css"

# Website
website_route_rules = [
    {"from_route": "/shop/<path:app_path>", "to_route": "shop"},
]
```

---

## Database Operations

### frappe.db Methods

```python
import frappe

# Get single value
customer_name = frappe.db.get_value(
    'Customer',
    'CUST-001',
    'customer_name'
)

# Get multiple fields
values = frappe.db.get_value(
    'Customer',
    'CUST-001',
    ['customer_name', 'customer_group', 'territory'],
    as_dict=True
)

# Get list
invoices = frappe.db.get_list(
    'Sales Invoice',
    filters={
        'customer': 'CUST-001',
        'docstatus': 1
    },
    fields=['name', 'grand_total', 'posting_date'],
    order_by='posting_date desc',
    limit=10
)

# Get all
all_invoices = frappe.db.get_all(
    'Sales Invoice',
    filters={'customer': 'CUST-001'},
    fields=['*']
)

# Count
count = frappe.db.count(
    'Sales Invoice',
    filters={'customer': 'CUST-001'}
)

# Exists
if frappe.db.exists('Customer', 'CUST-001'):
    print("Customer exists")

# Set value
frappe.db.set_value(
    'Sales Invoice',
    'SINV-001',
    'remarks',
    'Updated remarks'
)

# Set multiple values
frappe.db.set_value(
    'Sales Invoice',
    'SINV-001',
    {
        'remarks': 'Updated',
        'status': 'Paid'
    }
)

# Delete
frappe.db.delete('Sales Invoice', {'name': 'SINV-001'})

# SQL query
result = frappe.db.sql("""
    SELECT customer, SUM(grand_total) as total
    FROM `tabSales Invoice`
    WHERE docstatus = 1
    GROUP BY customer
""", as_dict=True)

# SQL with parameters
result = frappe.db.sql("""
    SELECT * FROM `tabSales Invoice`
    WHERE customer = %s AND posting_date >= %s
""", (customer, from_date), as_dict=True)

# Commit
frappe.db.commit()

# Rollback
frappe.db.rollback()
```

### Document CRUD

```python
# Get document
doc = frappe.get_doc('Sales Invoice', 'SINV-001')

# Create new
doc = frappe.new_doc('Sales Invoice')
doc.customer = 'CUST-001'
doc.posting_date = frappe.utils.today()
doc.append('items', {
    'item_code': 'ITEM-001',
    'qty': 1,
    'rate': 100
})
doc.insert()

# Update
doc = frappe.get_doc('Sales Invoice', 'SINV-001')
doc.remarks = 'Updated'
doc.save()

# Submit
doc.submit()

# Cancel
doc.cancel()

# Delete
frappe.delete_doc('Sales Invoice', 'SINV-001')

# Get cached
doc = frappe.get_cached_doc('Customer', 'CUST-001')
```

---

## Background Jobs

### Enqueue Job

```python
import frappe

def process_invoice(invoice_name):
    """Long-running process"""
    doc = frappe.get_doc('Sales Invoice', invoice_name)
    # Heavy processing...
    doc.save()

# Enqueue
frappe.enqueue(
    'my_app.tasks.process_invoice',
    invoice_name='SINV-001',
    queue='default',  # default, short, long
    timeout=300,
    is_async=True,
    now=False  # Execute immediately if False
)
```

### Progress Tracking

```python
def bulk_process(items):
    """Process with progress"""
    total = len(items)
    
    for i, item in enumerate(items):
        # Process item
        process_item(item)
        
        # Update progress
        frappe.publish_progress(
            percent=(i+1)/total*100,
            title="Processing Items",
            description=f"Processing {i+1} of {total}"
        )
```

---

## Error Handling

### Throwing Errors

```python
import frappe
from frappe import _

# Simple error
frappe.throw("Error message")

# Translated error
frappe.throw(_("Error message"))

# With title
frappe.throw(
    msg="Error message",
    title="Validation Error"
)

# Custom exception
from frappe.exceptions import ValidationError

raise ValidationError("Custom validation failed")

# Message types
frappe.msgprint("Info message")
frappe.msgprint("Warning", indicator='orange', alert=True)
frappe.throw("Error")  # Red error
```

### Try-Catch

```python
try:
    doc = frappe.get_doc('Sales Invoice', name)
    doc.submit()
    frappe.db.commit()
except frappe.DoesNotExistError:
    frappe.msgprint(f"Invoice {name} not found")
except frappe.ValidationError as e:
    frappe.log_error(f"Validation failed: {str(e)}")
    frappe.throw("Could not submit invoice")
except Exception as e:
    frappe.log_error(frappe.get_traceback())
    frappe.db.rollback()
    frappe.throw("An error occurred")
finally:
    # Cleanup
    pass
```

### Logging

```python
# Log error
frappe.log_error(
    message=frappe.get_traceback(),
    title="Invoice Processing Error"
)

# Print to console
frappe.logger().debug("Debug message")
frappe.logger().info("Info message")
frappe.logger().warning("Warning message")
frappe.logger().error("Error message")
```

---

## Best Practices

### Performance

```python
# ✅ Good: Batch operations
for invoice in invoices:
    frappe.db.set_value('Sales Invoice', invoice, 'status', 'Paid')
frappe.db.commit()  # Commit once

# ❌ Bad: Commit in loop
for invoice in invoices:
    frappe.db.set_value('Sales Invoice', invoice, 'status', 'Paid')
    frappe.db.commit()  # Don't commit in loop

# ✅ Good: Use get_all for large datasets
invoices = frappe.db.get_all(
    'Sales Invoice',
    filters={'customer': customer},
    fields=['name', 'grand_total'],
    limit=1000
)

# ❌ Bad: Load full documents
invoices = frappe.get_all('Sales Invoice', filters={'customer': customer})
for inv in invoices:
    doc = frappe.get_doc('Sales Invoice', inv.name)  # Expensive
```

### Permissions

```python
@frappe.whitelist()
def update_invoice(invoice_name, remarks):
    # Check permissions
    if not frappe.has_permission('Sales Invoice', 'write', invoice_name):
        frappe.throw("No permission to update invoice")
    
    # Ignore permissions (admin only)
    doc = frappe.get_doc('Sales Invoice', invoice_name)
    doc.remarks = remarks
    doc.flags.ignore_permissions = True
    doc.save()
```

### Transactions

```python
def complex_operation():
    try:
        # Multiple operations
        doc1 = frappe.get_doc('DocType1', 'DOC-001')
        doc1.status = 'Processed'
        doc1.save()
        
        doc2 = frappe.new_doc('DocType2')
        doc2.reference = doc1.name
        doc2.insert()
        
        # Commit all or nothing
        frappe.db.commit()
    except Exception as e:
        frappe.db.rollback()
        frappe.log_error(frappe.get_traceback())
        raise
```

### Code Organization

```python
# Separate business logic
class SalesInvoice(Document):
    def validate(self):
        self.validate_items()
        self.calculate_totals()
        self.validate_amounts()
    
    def validate_items(self):
        """Item validation logic"""
        pass
    
    def calculate_totals(self):
        """Calculation logic"""
        pass
    
    def validate_amounts(self):
        """Amount validation"""
        pass

# Utility functions in separate file
# my_app/utils.py
def calculate_tax(amount, tax_rate):
    return amount * tax_rate / 100

def format_address(address_doc):
    return f"{address_doc.address_line1}, {address_doc.city}"
```

---

## Common Patterns

### Master-Detail

```python
class SalesInvoice(Document):
    def validate(self):
        # Fetch from master
        customer = frappe.get_cached_doc('Customer', self.customer)
        self.customer_name = customer.customer_name
        self.tax_id = customer.tax_id
        
        # Update detail totals
        for item in self.items:
            item.amount = item.qty * item.rate
```

### Status Management

```python
class SalesOrder(Document):
    def on_update(self):
        self.update_status()
    
    def update_status(self):
        if self.docstatus == 0:
            self.status = 'Draft'
        elif self.docstatus == 1:
            if self.per_delivered == 100:
                self.status = 'Completed'
            elif self.per_delivered > 0:
                self.status = 'Partially Delivered'
            else:
                self.status = 'To Deliver'
        elif self.docstatus == 2:
            self.status = 'Cancelled'
```

### Linked Documents

```python
class DeliveryNote(Document):
    def on_submit(self):
        # Update source documents
        for item in self.items:
            if item.against_sales_order:
                self.update_sales_order(item)
    
    def update_sales_order(self, item):
        so = frappe.get_doc('Sales Order', item.against_sales_order)
        so.update_delivery_status()
        so.save()
```

---

*This guide covers server-side development patterns. For database queries, see database_commands.md. For hooks details, see frappe.md.*