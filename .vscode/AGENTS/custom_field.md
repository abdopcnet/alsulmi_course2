# Custom Field Development Guide

## Overview

Custom Fields extend DocTypes without modifying core code. This guide covers creation, management, and best practices for custom fields in Frappe.

## 📋 Table of Contents

1. [Custom Field Basics](#custom-field-basics)
2. [Creating Custom Fields](#creating-custom-fields)
3. [Field Types](#field-types)
4. [Field Properties](#field-properties)
5. [Programmatic Creation](#programmatic-creation)
6. [Property Setter](#property-setter)
7. [Migration & Export](#migration--export)
8. [Best Practices](#best-practices)

---

## Custom Field Basics

### What are Custom Fields?

- Extend existing DocTypes without code modification
- Stored in `tabCustom Field` table
- Automatically added to DocType schema
- Can be created via UI or code
- Exportable and migratable
- Prefix with `custom_` for naming

### When to Use Custom Fields

**Use Custom Fields when:**
- Extending standard ERPNext DocTypes
- Adding fields without modifying core
- Need flexibility across versions
- Customizing per-site

**Don't use Custom Fields when:**
- Creating new DocTypes (use standard fields)
- Complex business logic (use custom DocType)
- Need tight integration (fork and modify)

---

## Creating Custom Fields

### Via UI

**Steps:**
1. Go to: **Desk → Customize → Customize Form**
2. Select DocType (e.g., "Sales Invoice")
3. Scroll to "Custom Fields" section
4. Click **Add Row**
5. Fill field properties:
   - Label: Display name
   - Field Type: Data type
   - Fieldname: `custom_field_name`
   - Insert After: Position
6. Click **Update**

**Example:**
```
DocType: Sales Invoice
Label: Tax ID
Fieldname: custom_tax_id
Field Type: Data
Insert After: customer_name
Mandatory: 1
```

### Via Customize Form

**Alternative method:**
1. **Desk → Customize Form**
2. Select DocType
3. Add/Edit fields in grid
4. Set properties
5. **Update** to save

---

## Field Types

### Common Field Types

```python
# Text Fields
'Data'              # Single line text (max 140 chars)
'Small Text'        # Multi-line text (250 chars)
'Text'              # Long text (unlimited)
'Long Text'         # Very long text with editor
'Text Editor'       # Rich text editor

# Number Fields
'Int'               # Integer
'Float'             # Decimal number
'Currency'          # Money (formatted)
'Percent'           # Percentage

# Selection Fields
'Select'            # Dropdown
'Link'              # Link to another DocType
'Dynamic Link'      # Link based on another field
'Table MultiSelect' # Multiple selections

# Date/Time Fields
'Date'              # Date picker
'Datetime'          # Date and time
'Time'              # Time only
'Duration'          # Time duration

# Boolean
'Check'             # Checkbox (0 or 1)

# File Fields
'Attach'            # File upload
'Attach Image'      # Image upload

# Advanced
'Table'             # Child table
'HTML'              # HTML content
'Code'              # Code editor
'Signature'         # Signature pad
'Barcode'           # Barcode field
'Geolocation'       # Map location
```

### Field Type Examples

```python
# Data
custom_tax_id = {
    'fieldtype': 'Data',
    'label': 'Tax ID',
    'fieldname': 'custom_tax_id'
}

# Link
custom_branch = {
    'fieldtype': 'Link',
    'label': 'Branch',
    'fieldname': 'custom_branch',
    'options': 'Branch'  # DocType to link to
}

# Select
custom_priority = {
    'fieldtype': 'Select',
    'label': 'Priority',
    'fieldname': 'custom_priority',
    'options': 'Low\nMedium\nHigh\nUrgent'  # Newline separated
}

# Currency
custom_discount_amount = {
    'fieldtype': 'Currency',
    'label': 'Discount Amount',
    'fieldname': 'custom_discount_amount',
    'options': 'currency'  # Link to currency field
}

# Date
custom_delivery_date = {
    'fieldtype': 'Date',
    'label': 'Expected Delivery',
    'fieldname': 'custom_delivery_date'
}

# Check
custom_is_priority = {
    'fieldtype': 'Check',
    'label': 'Is Priority Order',
    'fieldname': 'custom_is_priority',
    'default': '0'
}

# Table (Child DocType)
custom_additional_items = {
    'fieldtype': 'Table',
    'label': 'Additional Items',
    'fieldname': 'custom_additional_items',
    'options': 'Custom Item Table'  # Child DocType name
}
```

---

## Field Properties

### Essential Properties

```python
{
    # Required
    'fieldname': 'custom_field_name',  # Unique name (use custom_ prefix)
    'label': 'Field Label',            # Display name
    'fieldtype': 'Data',               # Field type
    
    # Positioning
    'insert_after': 'customer',        # Insert after this field
    
    # Validation
    'reqd': 1,                         # Mandatory (0 or 1)
    'unique': 1,                       # Unique values only
    
    # Display
    'read_only': 1,                    # Read-only (0 or 1)
    'hidden': 1,                       # Hidden (0 or 1)
    'bold': 1,                         # Bold label
    'in_list_view': 1,                 # Show in list view
    'in_standard_filter': 1,           # Add to filters
    
    # Options
    'options': 'DocType Name',         # For Link/Select/Table
    'default': 'Default Value',        # Default value
    
    # Permissions
    'permlevel': 0,                    # Permission level
    'ignore_user_permissions': 1,      # Bypass user permissions
    
    # Depends On
    'depends_on': 'eval:doc.customer', # Show/hide based on condition
    
    # Fetch From
    'fetch_from': 'customer.tax_id',   # Auto-fetch from linked doc
    
    # Help
    'description': 'Help text here'    # Help text below field
}
```

### Advanced Properties

```python
{
    # Formatting
    'precision': '2',                  # Decimal places (Float/Currency)
    'length': 100,                     # Max length (Data)
    'width': '50%',                    # Field width
    
    # Validation
    'options': 'Email',                # Validate as email (for Data)
    'options': 'Phone',                # Validate as phone
    'options': 'URL',                  # Validate as URL
    
    # Child Table
    'allow_bulk_edit': 1,              # Enable bulk edit in table
    'cannot_add_rows': 1,              # Prevent adding rows
    'cannot_delete_rows': 1,           # Prevent deleting rows
    
    # Code Field
    'options': 'Python',               # Code syntax (Python/JavaScript/etc)
    
    # Dynamic Link
    'options': 'link_fieldname',       # Field containing DocType name
    
    # Print
    'print_hide': 1,                   # Hide in print format
    'print_hide_if_no_value': 1,       # Hide if empty in print
    
    # Database
    'search_index': 1,                 # Create database index
    'allow_in_quick_entry': 1,         # Show in quick entry
    
    # Translation
    'translatable': 1,                 # Field is translatable
}
```

---

## Programmatic Creation

### Create via Python

```python
import frappe

def create_custom_field():
    # Check if field exists
    if not frappe.db.exists('Custom Field', 
                           {'dt': 'Sales Invoice', 
                            'fieldname': 'custom_tax_id'}):
        
        custom_field = frappe.get_doc({
            'doctype': 'Custom Field',
            'dt': 'Sales Invoice',
            'label': 'Tax ID',
            'fieldname': 'custom_tax_id',
            'fieldtype': 'Data',
            'insert_after': 'customer_name',
            'reqd': 1,
            'in_list_view': 1
        })
        
        custom_field.insert()
        frappe.db.commit()
        
        print(f"Created custom field: {custom_field.name}")
```

### Bulk Creation

```python
def create_multiple_fields():
    fields = [
        {
            'dt': 'Sales Invoice',
            'label': 'Tax ID',
            'fieldname': 'custom_tax_id',
            'fieldtype': 'Data',
            'insert_after': 'customer_name'
        },
        {
            'dt': 'Sales Invoice',
            'label': 'Branch',
            'fieldname': 'custom_branch',
            'fieldtype': 'Link',
            'options': 'Branch',
            'insert_after': 'company'
        },
        {
            'dt': 'Sales Invoice',
            'label': 'Delivery Date',
            'fieldname': 'custom_delivery_date',
            'fieldtype': 'Date',
            'insert_after': 'posting_date'
        }
    ]
    
    for field_props in fields:
        if not frappe.db.exists('Custom Field', 
                               {'dt': field_props['dt'], 
                                'fieldname': field_props['fieldname']}):
            
            field = frappe.get_doc({
                'doctype': 'Custom Field',
                **field_props
            })
            field.insert()
    
    frappe.db.commit()
    print(f"Created {len(fields)} custom fields")
```

### Install Hook

**In hooks.py:**

```python
after_install = "my_app.setup.install.after_install"
```

**In setup/install.py:**

```python
import frappe

def after_install():
    create_custom_fields()

def create_custom_fields():
    custom_fields = {
        'Sales Invoice': [
            {
                'fieldname': 'custom_tax_id',
                'label': 'Tax ID',
                'fieldtype': 'Data',
                'insert_after': 'customer_name'
            }
        ],
        'Customer': [
            {
                'fieldname': 'custom_credit_limit',
                'label': 'Credit Limit',
                'fieldtype': 'Currency',
                'insert_after': 'customer_group'
            }
        ]
    }
    
    for doctype, fields in custom_fields.items():
        for field in fields:
            if not frappe.db.exists('Custom Field', 
                                   {'dt': doctype, 
                                    'fieldname': field['fieldname']}):
                doc = frappe.get_doc({
                    'doctype': 'Custom Field',
                    'dt': doctype,
                    **field
                })
                doc.insert()
    
    frappe.db.commit()
```

---

## Property Setter

### What is Property Setter?

- Modify existing field properties
- Override standard field behavior
- Stored in `tabProperty Setter`
- Can change read_only, hidden, mandatory, etc.

### Create via UI

**Steps:**
1. **Desk → Customize → Customize Form**
2. Select DocType
3. Find existing field
4. Modify property (e.g., make mandatory)
5. **Update**
6. Property Setter created automatically

### Create Programmatically

```python
import frappe

def create_property_setter():
    # Make customer_name mandatory
    if not frappe.db.exists('Property Setter', 
                           {'doc_type': 'Sales Invoice',
                            'field_name': 'customer_name',
                            'property': 'reqd'}):
        
        frappe.make_property_setter({
            'doctype': 'Sales Invoice',
            'fieldname': 'customer_name',
            'property': 'reqd',
            'value': '1',
            'property_type': 'Check'
        })
        
        frappe.db.commit()

def hide_field():
    # Hide posting_time field
    frappe.make_property_setter({
        'doctype': 'Sales Invoice',
        'fieldname': 'posting_time',
        'property': 'hidden',
        'value': '1',
        'property_type': 'Check'
    })

def change_label():
    # Change field label
    frappe.make_property_setter({
        'doctype': 'Sales Invoice',
        'fieldname': 'customer',
        'property': 'label',
        'value': 'Client',
        'property_type': 'Data'
    })
```

---

## Migration & Export

### Export Custom Fields

```bash
# Export fixtures in hooks.py
fixtures = [
    {
        "dt": "Custom Field",
        "filters": [
            ["dt", "in", ["Sales Invoice", "Customer", "Item"]]
        ]
    }
]

# Export command
bench --site [site_name] export-fixtures
```

### Import on New Site

```bash
# Install app (imports fixtures automatically)
bench --site [site_name] install-app my_app

# Or migrate
bench --site [site_name] migrate
```

### Export Individual Field

```bash
# Via bench console
bench --site [site_name] console

>>> import frappe
>>> cf = frappe.get_doc('Custom Field', 'Sales Invoice-custom_tax_id')
>>> import json
>>> print(json.dumps(cf.as_dict(), indent=2))
```

---

## Best Practices

### Naming Convention

```python
# ✅ Good: Prefix with custom_
'custom_tax_id'
'custom_delivery_date'
'custom_branch'

# ❌ Bad: No prefix
'tax_id'
'delivery_date'
'branch'

# ✅ Good: Descriptive names
'custom_expected_delivery_date'
'custom_customer_tax_identification'

# ❌ Bad: Vague names
'custom_date'
'custom_field1'
```

### Field Positioning

```python
# ✅ Good: Logical grouping
custom_tax_id after customer_name
custom_branch after company
custom_discount_reason after discount_amount

# ❌ Bad: Random placement
custom_tax_id after grand_total
```

### Default Values

```python
# ✅ Good: Sensible defaults
{
    'fieldname': 'custom_priority',
    'default': 'Medium'
}

{
    'fieldname': 'custom_is_approved',
    'default': '0'
}

# Date defaults
{
    'fieldname': 'custom_delivery_date',
    'default': 'Today'  # or 'Now' for datetime
}
```

### Performance

```python
# ✅ Good: Add index for frequently filtered fields
{
    'fieldname': 'custom_branch',
    'search_index': 1
}

# ✅ Good: Limit Link options
{
    'fieldname': 'custom_branch',
    'fieldtype': 'Link',
    'options': 'Branch',
    'get_query': '''frappe.query_reports.branch_query'''
}

# ❌ Bad: No indexes on filtered fields
```

### Documentation

```python
# ✅ Good: Add descriptions
{
    'fieldname': 'custom_tax_id',
    'description': 'Tax identification number (8-12 digits)'
}

# ✅ Good: Clear labels
{
    'label': 'Expected Delivery Date',  # Clear
}

# ❌ Bad: Unclear labels
{
    'label': 'Date',  # What date?
}
```

### Validation

```python
# ✅ Good: Use field validation
{
    'fieldtype': 'Data',
    'options': 'Email'  # Validates email format
}

# ✅ Good: Custom validation in controller
class SalesInvoice(Document):
    def validate(self):
        if self.custom_tax_id:
            if len(self.custom_tax_id) not in [8, 10, 12]:
                frappe.throw("Tax ID must be 8, 10, or 12 digits")
```

---

## Common Patterns

### Dependent Fields

```python
{
    'fieldname': 'custom_delivery_required',
    'fieldtype': 'Check',
    'label': 'Delivery Required'
},
{
    'fieldname': 'custom_delivery_date',
    'fieldtype': 'Date',
    'label': 'Delivery Date',
    'depends_on': 'eval:doc.custom_delivery_required',
    'mandatory_depends_on': 'eval:doc.custom_delivery_required'
}
```

### Fetch From Link

```python
{
    'fieldname': 'custom_branch',
    'fieldtype': 'Link',
    'options': 'Branch',
    'label': 'Branch'
},
{
    'fieldname': 'custom_branch_address',
    'fieldtype': 'Small Text',
    'label': 'Branch Address',
    'fetch_from': 'custom_branch.address',
    'read_only': 1
}
```

### Calculated Field

```python
# Add custom field
{
    'fieldname': 'custom_total_weight',
    'fieldtype': 'Float',
    'label': 'Total Weight (kg)',
    'read_only': 1
}

# Calculate in controller
class SalesInvoice(Document):
    def before_save(self):
        total_weight = 0
        for item in self.items:
            total_weight += item.weight_per_unit * item.qty
        self.custom_total_weight = total_weight
```

---

*Custom fields provide flexibility for site-specific requirements. Always use `custom_` prefix and document your fields properly.*