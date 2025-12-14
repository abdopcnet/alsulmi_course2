# DocType Commands Guide

## Overview

DocTypes are the core data models in Frappe. This guide covers creating, modifying, and managing DocTypes through commands and best practices.

## 📋 Table of Contents

1. [DocType Basics](#doctype-basics)
2. [Creating DocTypes](#creating-doctypes)
3. [DocType Structure](#doctype-structure)
4. [Field Management](#field-management)
5. [Permissions](#permissions)
6. [Naming & Autoname](#naming--autoname)
7. [Bench Commands](#bench-commands)
8. [Best Practices](#best-practices)

---

## DocType Basics

### What is a DocType?

- Database table + Metadata definition
- Contains fields, permissions, validation rules
- Stored in JSON files + database
- Can be standard (code) or custom (database)

### DocType Types

```
1. Standard DocTypes
   - Defined in app code
   - Version controlled
   - Migrate across sites

2. Custom DocTypes
   - Created via UI
   - Stored in database
   - Site-specific

3. Virtual DocTypes
   - No database table
   - Used for reports/pages
   - is_virtual = 1

4. Single DocTypes
   - Only one record
   - Used for settings
   - issingle = 1
```

---

## Creating DocTypes

### Via UI

**Steps:**
1. **Desk → Doctype → New**
2. Fill details:
   - **Module**: Select module
   - **Name**: DocType name (e.g., "Custom Order")
   - **Naming**: Auto/Field/Prompt/etc
3. Add Fields in grid
4. Set Permissions
5. **Save**

### Via Command Line

```bash
# Create new app first
bench new-app my_custom_app

# Enter app directory
cd apps/my_custom_app

# Create module
bench create-module MyModule --app my_custom_app

# Create DocType (manual - create JSON file)
# Location: apps/my_custom_app/my_custom_app/my_module/doctype/
```

---

## DocType Structure

### File Layout

```
apps/my_app/my_app/my_module/doctype/custom_order/
├── __init__.py
├── custom_order.py          # Controller
├── custom_order.json        # DocType definition
├── custom_order.js          # Client script
├── test_custom_order.py     # Unit tests
└── custom_order_list.js     # List view (optional)
```

### JSON Structure

**custom_order.json:**

```json
{
 "autoname": "field:order_id",
 "creation": "2025-01-01 10:00:00.000000",
 "doctype": "DocType",
 "document_type": "Document",
 "editable_grid": 1,
 "engine": "InnoDB",
 "field_order": [
  "order_id",
  "customer",
  "order_date",
  "items",
  "total"
 ],
 "fields": [
  {
   "fieldname": "order_id",
   "fieldtype": "Data",
   "label": "Order ID",
   "unique": 1,
   "reqd": 1
  },
  {
   "fieldname": "customer",
   "fieldtype": "Link",
   "label": "Customer",
   "options": "Customer",
   "reqd": 1
  },
  {
   "fieldname": "order_date",
   "fieldtype": "Date",
   "label": "Order Date",
   "default": "Today",
   "reqd": 1
  },
  {
   "fieldname": "items",
   "fieldtype": "Table",
   "label": "Items",
   "options": "Custom Order Item"
  },
  {
   "fieldname": "total",
   "fieldtype": "Currency",
   "label": "Total",
   "read_only": 1
  }
 ],
 "is_submittable": 1,
 "modified": "2025-01-10 12:00:00.000000",
 "module": "My Module",
 "name": "Custom Order",
 "naming_rule": "By fieldname",
 "permissions": [
  {
   "create": 1,
   "delete": 1,
   "email": 1,
   "print": 1,
   "read": 1,
   "role": "Sales User",
   "share": 1,
   "submit": 1,
   "write": 1
  }
 ],
 "sort_field": "modified",
 "sort_order": "DESC",
 "states": []
}
```

### Python Controller

**custom_order.py:**

```python
# Copyright (c) 2025, Company and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class CustomOrder(Document):
    def validate(self):
        self.calculate_total()
    
    def calculate_total(self):
        total = 0
        for item in self.items:
            total += item.amount
        self.total = total
    
    def on_submit(self):
        # Create linked documents
        pass
    
    def on_cancel(self):
        # Reverse operations
        pass
```

---

## Field Management

### Common Field Types

```json
{
  "fieldtype": "Data",           // Single line text
  "fieldtype": "Text",           // Multi-line text
  "fieldtype": "Link",           // Link to DocType
  "fieldtype": "Select",         // Dropdown
  "fieldtype": "Date",           // Date picker
  "fieldtype": "Datetime",       // Date & time
  "fieldtype": "Currency",       // Money field
  "fieldtype": "Float",          // Decimal
  "fieldtype": "Int",            // Integer
  "fieldtype": "Check",          // Checkbox
  "fieldtype": "Table",          // Child table
  "fieldtype": "Attach",         // File upload
  "fieldtype": "Dynamic Link",   // Dynamic DocType link
  "fieldtype": "HTML",           // HTML display
  "fieldtype": "Button"          // Action button
}
```

### Field Properties

```json
{
  "fieldname": "customer",
  "fieldtype": "Link",
  "label": "Customer",
  "options": "Customer",
  "reqd": 1,
  "in_list_view": 1,
  "in_standard_filter": 1,
  "bold": 1,
  "read_only": 0,
  "hidden": 0,
  "default": "",
  "description": "Help text",
  "depends_on": "eval:doc.is_active",
  "fetch_from": "customer.customer_name",
  "permlevel": 0,
  "precision": "2"
}
```

---

## Permissions

### Permission Structure

```json
{
 "permissions": [
  {
   "role": "Sales User",
   "create": 1,
   "read": 1,
   "write": 1,
   "delete": 1,
   "submit": 1,
   "cancel": 1,
   "amend": 1,
   "print": 1,
   "email": 1,
   "share": 1,
   "if_owner": 0,
   "permlevel": 0
  },
  {
   "role": "Sales Manager",
   "create": 1,
   "read": 1,
   "write": 1,
   "delete": 1,
   "submit": 1,
   "cancel": 1,
   "amend": 1
  }
 ]
}
```

### Permission Levels

```json
// Different permissions for different field groups
{
 "fields": [
  {
   "fieldname": "customer",
   "permlevel": 0  // All users with role
  },
  {
   "fieldname": "discount_amount",
   "permlevel": 1  // Only specific permission
  }
 ],
 "permissions": [
  {
   "role": "Sales User",
   "permlevel": 0,
   "read": 1,
   "write": 1
  },
  {
   "role": "Sales Manager",
   "permlevel": 1,
   "read": 1,
   "write": 1
  }
 ]
}
```

---

## Naming & Autoname

### Naming Rules

```json
{
 "autoname": "field:order_id",         // Use field value
 "autoname": "naming_series:",         // Use naming series
 "autoname": "Prompt",                 // Prompt user
 "autoname": "format:ORD-{YYYY}-{####}", // Format string
 "autoname": "hash"                    // Random hash
}
```

### Custom Naming

**In Python:**

```python
class CustomOrder(Document):
    def autoname(self):
        # Custom naming logic
        from frappe.model.naming import make_autoname
        self.name = make_autoname('ORD-.YY.-.####')
        
    # Or manual
    def autoname(self):
        self.name = f"ORD-{self.customer[:3]}-{frappe.utils.nowdate()}"
```

---

## Bench Commands

### Reload DocType

```bash
# Reload single DocType
bench --site [site_name] reload-doctype "Custom Order"

# Reload all DocTypes
bench --site [site_name] migrate
```

### Export DocType

```bash
# Export to fixtures
# Add to hooks.py
fixtures = ["Custom Order"]

# Then export
bench --site [site_name] export-fixtures

# Files created in: apps/[app]/[app]/[module]/doctype/
```

### Clear Cache

```bash
# Clear all cache
bench --site [site_name] clear-cache

# Clear website cache
bench --site [site_name] clear-website-cache
```

### Rebuild

```bash
# Rebuild search index
bench --site [site_name] build-search-index

# Rebuild website
bench --site [site_name] build
```

---

## Best Practices

### Naming Conventions

```
✅ Good:
- "Sales Order"
- "Custom Payment"
- "Delivery Note Item"

❌ Bad:
- "sales_order"
- "customPayment"
- "DNI"
```

### Field Naming

```python
# ✅ Good: Descriptive, snake_case
fieldname: "customer_name"
fieldname: "posting_date"
fieldname: "grand_total"

# ❌ Bad: Unclear, camelCase
fieldname: "name"
fieldname: "date"
fieldname: "total"
```

### Performance

```json
// ✅ Good: Add indexes for filtered fields
{
  "fieldname": "customer",
  "search_index": 1
}

// ✅ Good: Limit child table fields
{
  "fieldtype": "Table",
  "options": "Order Item",  // Keep child simple
}

// ❌ Bad: Too many child tables
// Avoid nested child tables
```

### Validation

```python
# ✅ Good: Validate in controller
class CustomOrder(Document):
    def validate(self):
        if not self.items:
            frappe.throw("Please add items")
        
        if self.total < 0:
            frappe.throw("Total cannot be negative")
```

---

## Common Patterns

### Master-Detail

```python
# Parent DocType
class SalesOrder(Document):
    pass

# Child DocType (table field)
class SalesOrderItem(Document):
    pass

# In sales_order.json
{
  "fieldname": "items",
  "fieldtype": "Table",
  "options": "Sales Order Item"
}
```

### Status Workflow

```python
class SalesOrder(Document):
    def on_update(self):
        self.update_status()
    
    def update_status(self):
        if self.docstatus == 0:
            self.status = "Draft"
        elif self.docstatus == 1:
            if self.per_delivered == 100:
                self.status = "Completed"
            else:
                self.status = "To Deliver"
        elif self.docstatus == 2:
            self.status = "Cancelled"
```

### Linked Documents

```python
# Create linked document
def on_submit(self):
    delivery = frappe.new_doc("Delivery Note")
    delivery.customer = self.customer
    for item in self.items:
        delivery.append("items", {
            "item_code": item.item_code,
            "qty": item.qty
        })
    delivery.insert()
```

---

*DocTypes are the foundation of Frappe applications. Design them carefully and follow naming conventions.*
