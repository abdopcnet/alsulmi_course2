# Client Script Development Guide

## Overview

Client Scripts run in the browser and control form behavior, field interactions, and UI customization in Frappe. This guide covers patterns, best practices, and common implementations.

## 📋 Table of Contents

1. [Client Script Basics](#client-script-basics)
2. [Script Types & Events](#script-types--events)
3. [Form API Reference](#form-api-reference)
4. [Common Patterns](#common-patterns)
5. [Child Table Operations](#child-table-operations)
6. [Field Operations](#field-operations)
7. [API Calls](#api-calls)
8. [Best Practices](#best-practices)

---

## Client Script Basics

### Creating Client Scripts

**Location:**
- DocType JS file: `/apps/[app]/[app]/[module]/doctype/[doctype]/[doctype].js`
- Client Script DocType: Desk → Customize → Client Script
- Custom App JS: `hooks.py` → `doctype_js`

### Basic Structure

```javascript
frappe.ui.form.on('DocType Name', {
    // Form-level events
    refresh: function(frm) {
        // Runs when form loads or refreshes
    },
    
    onload: function(frm) {
        // Runs once when form first loads
    },
    
    // Field-level events
    field_name: function(frm) {
        // Runs when field value changes
    }
});
```

---

## Script Types & Events

### Form Events

```javascript
frappe.ui.form.on('Sales Invoice', {
    // Load Events
    onload: function(frm) {
        // First load only
    },
    
    refresh: function(frm) {
        // Every refresh (load, save, etc.)
    },
    
    onload_post_render: function(frm) {
        // After form HTML is rendered
    },
    
    // Save Events
    before_save: function(frm) {
        // Before document is saved
    },
    
    after_save: function(frm) {
        // After successful save
    },
    
    validate: function(frm) {
        // Before save validation
    },
    
    // Workflow Events
    before_submit: function(frm) {
        // Before document is submitted
    },
    
    on_submit: function(frm) {
        // After successful submit
    },
    
    before_cancel: function(frm) {
        // Before document is cancelled
    }
});
```

### Field Events

```javascript
frappe.ui.form.on('Sales Invoice', {
    customer: function(frm) {
        // When customer field changes
        if (frm.doc.customer) {
            // Fetch customer details
            frappe.call({
                method: 'frappe.client.get',
                args: {
                    doctype: 'Customer',
                    name: frm.doc.customer
                },
                callback: function(r) {
                    if (r.message) {
                        frm.set_value('customer_name', r.message.customer_name);
                    }
                }
            });
        }
    },
    
    posting_date: function(frm) {
        // Calculate due date
        if (frm.doc.posting_date && frm.doc.payment_terms_template) {
            frm.trigger('payment_terms_template');
        }
    }
});
```

---

## Form API Reference

### Reading Values

```javascript
// Get field value
let customer = frm.doc.customer;
let total = frm.doc.grand_total;

// Check if field has value
if (frm.doc.customer) {
    // Customer is set
}

// Get child table rows
let items = frm.doc.items || [];
```

### Setting Values

```javascript
// Set single field
frm.set_value('customer_name', 'John Doe');

// Set multiple fields
frm.set_value({
    'customer_name': 'John Doe',
    'posting_date': frappe.datetime.get_today()
});

// Set field in child table
frappe.model.set_value(
    'Sales Invoice Item',  // Child DocType
    items[0].name,         // Row name
    'rate',                // Field name
    100                    // Value
);
```

### Field Visibility & Properties

```javascript
// Hide/Show field
frm.set_df_property('field_name', 'hidden', 1);  // Hide
frm.set_df_property('field_name', 'hidden', 0);  // Show

// Make field mandatory
frm.set_df_property('field_name', 'reqd', 1);

// Make field read-only
frm.set_df_property('field_name', 'read_only', 1);

// Set field label
frm.set_df_property('field_name', 'label', 'New Label');

// Toggle field
frm.toggle_display('field_name', true);  // Show
frm.toggle_display('field_name', false); // Hide

// Enable/Disable field
frm.toggle_enable('field_name', true);   // Enable
frm.toggle_enable('field_name', false);  // Disable

// Set field options (for Select/Link)
frm.set_df_property('field_name', 'options', ['Option 1', 'Option 2']);
```

### Form Actions

```javascript
// Save form
frm.save();

// Save with specific action
frm.save('Save');     // Normal save
frm.save('Submit');   // Submit
frm.save('Update');   // Update after submit

// Refresh form
frm.refresh();

// Refresh specific field
frm.refresh_field('field_name');

// Refresh child table
frm.refresh_field('items');

// Reload document
frm.reload_doc();

// Trigger another event
frm.trigger('field_name');
```

### Custom Buttons

```javascript
frappe.ui.form.on('Sales Invoice', {
    refresh: function(frm) {
        // Add button
        frm.add_custom_button('Button Label', function() {
            // Button click handler
            frappe.msgprint('Button clicked!');
        });
        
        // Add button in group
        frm.add_custom_button('Action 1', function() {
            // Action 1
        }, 'Group Name');
        
        // Add primary button
        frm.add_custom_button('Primary Action', function() {
            // Action
        }).addClass('btn-primary');
        
        // Remove button
        frm.remove_custom_button('Button Label');
        
        // Clear all buttons in group
        frm.clear_custom_buttons();
    }
});
```

---

## Common Patterns

### Conditional Field Display

```javascript
frappe.ui.form.on('Payment Entry', {
    payment_type: function(frm) {
        // Show/hide fields based on payment type
        if (frm.doc.payment_type === 'Receive') {
            frm.set_df_property('paid_from', 'hidden', 0);
            frm.set_df_property('paid_to', 'hidden', 1);
        } else {
            frm.set_df_property('paid_from', 'hidden', 1);
            frm.set_df_property('paid_to', 'hidden', 0);
        }
    }
});
```

### Dynamic Filtering

```javascript
frappe.ui.form.on('Sales Invoice', {
    customer: function(frm) {
        // Filter addresses by customer
        frm.set_query('customer_address', function() {
            return {
                filters: {
                    'link_doctype': 'Customer',
                    'link_name': frm.doc.customer
                }
            };
        });
    },
    
    setup: function(frm) {
        // Set filter for Link field
        frm.set_query('item_code', 'items', function(doc, cdt, cdn) {
            // Filter items in child table
            return {
                filters: {
                    'item_group': 'Products'
                }
            };
        });
    }
});
```

### Calculate Totals

```javascript
frappe.ui.form.on('Sales Invoice', {
    calculate_totals: function(frm) {
        let total = 0;
        
        // Sum child table values
        (frm.doc.items || []).forEach(function(item) {
            total += flt(item.amount);
        });
        
        frm.set_value('total', total);
    }
});

// Trigger on child table changes
frappe.ui.form.on('Sales Invoice Item', {
    amount: function(frm, cdt, cdn) {
        frm.trigger('calculate_totals');
    },
    
    items_remove: function(frm) {
        frm.trigger('calculate_totals');
    }
});
```

### Form Validation

```javascript
frappe.ui.form.on('Sales Invoice', {
    validate: function(frm) {
        // Validate before save
        if (!frm.doc.customer) {
            frappe.msgprint('Please select a customer');
            frappe.validated = false;
            return;
        }
        
        // Validate child table
        if (!frm.doc.items || frm.doc.items.length === 0) {
            frappe.msgprint('Please add at least one item');
            frappe.validated = false;
            return;
        }
        
        // Validate amounts
        if (frm.doc.grand_total <= 0) {
            frappe.msgprint('Total amount must be greater than zero');
            frappe.validated = false;
            return;
        }
    }
});
```

---

## Child Table Operations

### Add Row

```javascript
frappe.ui.form.on('Sales Invoice', {
    add_item: function(frm) {
        // Add new row to child table
        let row = frm.add_child('items', {
            item_code: 'ITEM-001',
            qty: 1,
            rate: 100
        });
        
        frm.refresh_field('items');
    }
});
```

### Remove Row

```javascript
frappe.ui.form.on('Sales Invoice', {
    remove_last_item: function(frm) {
        // Remove last row
        if (frm.doc.items && frm.doc.items.length > 0) {
            frm.doc.items.pop();
            frm.refresh_field('items');
        }
    }
});
```

### Clear Table

```javascript
frappe.ui.form.on('Sales Invoice', {
    clear_items: function(frm) {
        // Clear all rows
        frm.clear_table('items');
        frm.refresh_field('items');
    }
});
```

### Loop Through Rows

```javascript
frappe.ui.form.on('Sales Invoice', {
    process_items: function(frm) {
        // Loop through child table
        (frm.doc.items || []).forEach(function(item, index) {
            console.log('Item ' + index + ':', item.item_code);
            
            // Modify row
            item.discount_percentage = 10;
            item.amount = item.qty * item.rate * 0.9;
        });
        
        frm.refresh_field('items');
    }
});
```

### Child Table Events

```javascript
frappe.ui.form.on('Sales Invoice Item', {
    // Row added
    items_add: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        console.log('Row added:', row.name);
    },
    
    // Row removed
    items_remove: function(frm, cdt, cdn) {
        console.log('Row removed');
        frm.trigger('calculate_totals');
    },
    
    // Field changed in row
    qty: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        row.amount = flt(row.qty) * flt(row.rate);
        frm.refresh_field('items');
    },
    
    rate: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        row.amount = flt(row.qty) * flt(row.rate);
        frm.refresh_field('items');
    }
});
```

---

## Field Operations

### Auto-fill from Master

```javascript
frappe.ui.form.on('Sales Invoice', {
    customer: function(frm) {
        if (frm.doc.customer) {
            frappe.call({
                method: 'frappe.client.get',
                args: {
                    doctype: 'Customer',
                    name: frm.doc.customer
                },
                callback: function(r) {
                    if (r.message) {
                        frm.set_value('customer_name', r.message.customer_name);
                        frm.set_value('tax_id', r.message.tax_id);
                        frm.set_value('customer_group', r.message.customer_group);
                    }
                }
            });
        }
    }
});
```

### Calculate Fields

```javascript
frappe.ui.form.on('Sales Invoice Item', {
    qty: function(frm, cdt, cdn) {
        calculate_amount(frm, cdt, cdn);
    },
    
    rate: function(frm, cdt, cdn) {
        calculate_amount(frm, cdt, cdn);
    },
    
    discount_percentage: function(frm, cdt, cdn) {
        calculate_amount(frm, cdt, cdn);
    }
});

function calculate_amount(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    let amount = flt(row.qty) * flt(row.rate);
    let discount = amount * flt(row.discount_percentage) / 100;
    row.amount = amount - discount;
    frm.refresh_field('items');
}
```

### Date Operations

```javascript
frappe.ui.form.on('Sales Invoice', {
    posting_date: function(frm) {
        if (frm.doc.posting_date) {
            // Add 30 days to posting date
            let due_date = frappe.datetime.add_days(
                frm.doc.posting_date, 
                30
            );
            frm.set_value('due_date', due_date);
        }
    }
});
```

---

## API Calls

### Call Server Method

```javascript
frappe.ui.form.on('Sales Invoice', {
    get_customer_balance: function(frm) {
        frappe.call({
            method: 'erpnext.accounts.doctype.sales_invoice.sales_invoice.get_customer_outstanding',
            args: {
                customer: frm.doc.customer,
                company: frm.doc.company
            },
            callback: function(r) {
                if (r.message) {
                    frappe.msgprint('Outstanding: ' + r.message);
                }
            }
        });
    }
});
```

### Call Whitelisted Method

```javascript
frappe.call({
    method: 'my_app.api.custom_method',
    args: {
        doctype: 'Sales Invoice',
        name: frm.doc.name
    },
    freeze: true,
    freeze_message: 'Processing...',
    callback: function(r) {
        if (!r.exc) {
            frappe.show_alert({
                message: 'Success',
                indicator: 'green'
            });
        }
    },
    error: function(r) {
        frappe.msgprint('Error: ' + r.message);
    }
});
```

### Get Document

```javascript
frappe.call({
    method: 'frappe.client.get',
    args: {
        doctype: 'Customer',
        name: customer_name
    },
    callback: function(r) {
        if (r.message) {
            console.log(r.message);
        }
    }
});
```

### Get List

```javascript
frappe.call({
    method: 'frappe.client.get_list',
    args: {
        doctype: 'Sales Invoice',
        filters: {
            customer: frm.doc.customer,
            docstatus: 1
        },
        fields: ['name', 'grand_total', 'posting_date'],
        limit: 10
    },
    callback: function(r) {
        if (r.message) {
            console.log(r.message);
        }
    }
});
```

---

## Best Practices

### Performance

```javascript
// ✅ Good: Batch operations
frappe.ui.form.on('Sales Invoice', {
    recalculate: function(frm) {
        let total = 0;
        frm.doc.items.forEach(item => {
            item.amount = item.qty * item.rate;
            total += item.amount;
        });
        frm.set_value('total', total);
        frm.refresh_field('items');  // Refresh once
    }
});

// ❌ Bad: Refresh in loop
frappe.ui.form.on('Sales Invoice', {
    recalculate: function(frm) {
        frm.doc.items.forEach(item => {
            item.amount = item.qty * item.rate;
            frm.refresh_field('items');  // Don't refresh in loop
        });
    }
});
```

### Error Handling

```javascript
frappe.ui.form.on('Sales Invoice', {
    submit_invoice: function(frm) {
        frappe.call({
            method: 'my_app.api.submit_invoice',
            args: { name: frm.doc.name },
            callback: function(r) {
                if (r.exc) {
                    frappe.msgprint('Error: ' + r.exc);
                    return;
                }
                
                if (!r.message) {
                    frappe.msgprint('No response from server');
                    return;
                }
                
                frappe.msgprint('Success!');
                frm.reload_doc();
            },
            error: function(r) {
                frappe.msgprint('Request failed');
            }
        });
    }
});
```

### Code Organization

```javascript
// Separate functions for reusability
function calculate_totals(frm) {
    let total = 0;
    (frm.doc.items || []).forEach(item => {
        total += flt(item.amount);
    });
    frm.set_value('total', total);
}

function validate_items(frm) {
    if (!frm.doc.items || frm.doc.items.length === 0) {
        frappe.throw('Please add items');
    }
}

frappe.ui.form.on('Sales Invoice', {
    validate: function(frm) {
        validate_items(frm);
        calculate_totals(frm);
    }
});
```

### Debugging

```javascript
frappe.ui.form.on('Sales Invoice', {
    refresh: function(frm) {
        // Log form object
        console.log('Form:', frm);
        console.log('Document:', frm.doc);
        
        // Log field value
        console.log('Customer:', frm.doc.customer);
        
        // Log child table
        console.log('Items:', frm.doc.items);
        
        // Debug API call
        frappe.call({
            method: 'my_app.api.test',
            args: {},
            callback: function(r) {
                console.log('Response:', r);
            }
        });
    }
});
```

---

## Utility Functions

### Frappe Utilities

```javascript
// Type conversion
flt(value)          // Convert to float
flt(value, 2)       // Float with 2 decimals
cint(value)         // Convert to integer

// Date operations
frappe.datetime.get_today()                    // Today's date
frappe.datetime.add_days(date, days)           // Add days
frappe.datetime.add_months(date, months)       // Add months
frappe.datetime.str_to_user(date)              // Format for display
frappe.datetime.user_to_str(date)              // Parse user input

// Format values
format_currency(value, currency)               // Format as currency
frappe.format(value, {fieldtype: 'Currency'})  // Generic format

// Messages
frappe.msgprint('Message')                     // Show message
frappe.throw('Error message')                  // Throw error
frappe.show_alert('Alert message')             // Show alert
frappe.confirm('Confirm?', () => {})           // Confirmation dialog

// Form actions
frappe.set_route('Form', 'Sales Invoice', name) // Navigate to form
frappe.new_doc('Sales Invoice')                 // New document
```

---

*This guide covers common client script patterns. For advanced scenarios, refer to Frappe Framework documentation and source code examples.*