# Script Report Development Guide

## Overview

Script Reports are Python-based reports in Frappe that provide dynamic data analysis with custom queries, filters, and formatting. This guide covers creation, patterns, and best practices.

## 📋 Table of Contents

1. [Script Report Basics](#script-report-basics)
2. [Report Structure](#report-structure)
3. [Filters](#filters)
4. [Columns Definition](#columns-definition)
5. [Data Fetching](#data-fetching)
6. [Formatting & Charts](#formatting--charts)
7. [Common Patterns](#common-patterns)
8. [Best Practices](#best-practices)

---

## Script Report Basics

### Creating Script Report

**Via UI:** Desk → Report → New Report

- Report Type: Script Report
- Reference DocType: Select base DocType
- Module: Select module

**Via bench:**

```bash
bench --site [site_name] console

# Create report
frappe.get_doc({
    'doctype': 'Report',
    'report_name': 'Sales Analysis',
    'ref_doctype': 'Sales Invoice',
    'report_type': 'Script Report',
    'is_standard': 'Yes',
    'module': 'Accounts'
}).insert()
```

**File Location:**

```
[app]/[module]/report/[report_name]/
├── [report_name].json
├── [report_name].py
└── [report_name].js (optional)
```

---

## Report Structure

### Basic Python File

**File:** `sales_analysis/sales_analysis.py`

```python
import frappe
from frappe import _

def execute(filters=None):
    """
    Main report function
    Returns: columns, data, message, chart, report_summary
    """
    columns = get_columns()
    data = get_data(filters)

    return columns, data

def get_columns():
    """Define report columns"""
    return [
        {
            "fieldname": "invoice_no",
            "label": _("Invoice No"),
            "fieldtype": "Link",
            "options": "Sales Invoice",
            "width": 150
        },
        {
            "fieldname": "customer",
            "label": _("Customer"),
            "fieldtype": "Link",
            "options": "Customer",
            "width": 180
        },
        {
            "fieldname": "posting_date",
            "label": _("Date"),
            "fieldtype": "Date",
            "width": 100
        },
        {
            "fieldname": "total",
            "label": _("Total"),
            "fieldtype": "Currency",
            "width": 120
        }
    ]

def get_data(filters):
    """Fetch report data"""
    conditions = get_conditions(filters)

    return frappe.db.sql(f"""
        SELECT
            name as invoice_no,
            customer,
            posting_date,
            grand_total as total
        FROM `tabSales Invoice`
        WHERE docstatus = 1
        {conditions}
        ORDER BY posting_date DESC
    """, filters, as_dict=1)

def get_conditions(filters):
    """Build WHERE conditions"""
    conditions = ""

    if filters.get("from_date"):
        conditions += " AND posting_date >= %(from_date)s"

    if filters.get("to_date"):
        conditions += " AND posting_date <= %(to_date)s"

    if filters.get("customer"):
        conditions += " AND customer = %(customer)s"

    return conditions
```

---

## Filters

### Filter Types

```python
# JSON file: sales_analysis.json
{
    "filters": [
        {
            "fieldname": "from_date",
            "label": "From Date",
            "fieldtype": "Date",
            "default": "Today",
            "reqd": 1
        },
        {
            "fieldname": "to_date",
            "label": "To Date",
            "fieldtype": "Date",
            "default": "Today",
            "reqd": 1
        },
        {
            "fieldname": "customer",
            "label": "Customer",
            "fieldtype": "Link",
            "options": "Customer"
        },
        {
            "fieldname": "company",
            "label": "Company",
            "fieldtype": "Link",
            "options": "Company",
            "default": "frappe.defaults.get_user_default('Company')"
        },
        {
            "fieldname": "status",
            "label": "Status",
            "fieldtype": "Select",
            "options": ["", "Paid", "Unpaid", "Overdue"]
        }
    ]
}
```

### Dynamic Filters (JavaScript)

**File:** `sales_analysis/sales_analysis.js`

```javascript
frappe.query_reports["Sales Analysis"] = {
  filters: [
    {
      fieldname: "from_date",
      label: __("From Date"),
      fieldtype: "Date",
      default: frappe.datetime.add_months(frappe.datetime.get_today(), -1),
      reqd: 1,
    },
    {
      fieldname: "to_date",
      label: __("To Date"),
      fieldtype: "Date",
      default: frappe.datetime.get_today(),
      reqd: 1,
    },
    {
      fieldname: "customer",
      label: __("Customer"),
      fieldtype: "Link",
      options: "Customer",
      get_query: function () {
        return {
          filters: {
            disabled: 0,
          },
        };
      },
    },
    {
      fieldname: "item_group",
      label: __("Item Group"),
      fieldtype: "Link",
      options: "Item Group",
      get_query: function () {
        var company = frappe.query_report.get_filter_value("company");
        return {
          filters: {
            company: company,
          },
        };
      },
    },
  ],
};
```

---

## Columns Definition

### Column Properties

```python
{
    "fieldname": "column_name",        # Column identifier
    "label": _("Display Label"),       # Translated label
    "fieldtype": "Data",               # Field type
    "options": "DocType",              # For Link fields
    "width": 150,                      # Column width in pixels
    "hidden": 0,                       # Hide column (0=show, 1=hide)
    "editable": 0,                     # Allow inline editing
}
```

### Common Field Types

```python
def get_columns():
    return [
        # Text
        {
            "fieldname": "name",
            "label": _("ID"),
            "fieldtype": "Data",
            "width": 120
        },

        # Link (clickable)
        {
            "fieldname": "customer",
            "label": _("Customer"),
            "fieldtype": "Link",
            "options": "Customer",
            "width": 180
        },

        # Date
        {
            "fieldname": "date",
            "label": _("Date"),
            "fieldtype": "Date",
            "width": 100
        },

        # Currency (formatted with symbol)
        {
            "fieldname": "amount",
            "label": _("Amount"),
            "fieldtype": "Currency",
            "options": "currency",  # Field containing currency code
            "width": 120
        },

        # Float (numeric)
        {
            "fieldname": "qty",
            "label": _("Quantity"),
            "fieldtype": "Float",
            "width": 100
        },

        # Percent
        {
            "fieldname": "margin",
            "label": _("Margin %"),
            "fieldtype": "Percent",
            "width": 100
        },

        # Select (dropdown)
        {
            "fieldname": "status",
            "label": _("Status"),
            "fieldtype": "Select",
            "width": 100
        }
    ]
```

---

## Data Fetching

### SQL Query Pattern

```python
def get_data(filters):
    """Basic query"""
    return frappe.db.sql("""
        SELECT
            si.name,
            si.customer,
            si.posting_date,
            si.grand_total
        FROM `tabSales Invoice` si
        WHERE si.docstatus = 1
        AND si.posting_date BETWEEN %(from_date)s AND %(to_date)s
    """, filters, as_dict=1)
```

### Join Tables

```python
def get_data(filters):
    """Query with joins"""
    return frappe.db.sql("""
        SELECT
            si.name as invoice_no,
            si.customer,
            c.customer_name,
            c.territory,
            si.posting_date,
            si.grand_total,
            si.outstanding_amount
        FROM `tabSales Invoice` si
        INNER JOIN `tabCustomer` c ON c.name = si.customer
        WHERE si.docstatus = 1
        AND si.posting_date BETWEEN %(from_date)s AND %(to_date)s
        ORDER BY si.posting_date DESC
    """, filters, as_dict=1)
```

### Child Table Data

```python
def get_data(filters):
    """Query with child table"""
    return frappe.db.sql("""
        SELECT
            si.name as invoice_no,
            si.customer,
            si.posting_date,
            sii.item_code,
            sii.item_name,
            sii.qty,
            sii.rate,
            sii.amount
        FROM `tabSales Invoice` si
        INNER JOIN `tabSales Invoice Item` sii ON sii.parent = si.name
        WHERE si.docstatus = 1
        AND si.posting_date BETWEEN %(from_date)s AND %(to_date)s
        ORDER BY si.posting_date DESC, sii.idx
    """, filters, as_dict=1)
```

### Using frappe.db Methods

```python
def get_data(filters):
    """Using get_all"""
    return frappe.get_all(
        "Sales Invoice",
        filters={
            "docstatus": 1,
            "posting_date": ["between", [filters.from_date, filters.to_date]],
            "customer": filters.get("customer") if filters.get("customer") else ["!=", ""]
        },
        fields=["name", "customer", "posting_date", "grand_total", "outstanding_amount"],
        order_by="posting_date desc"
    )
```

---

## Formatting & Charts

### Report Summary

```python
def execute(filters=None):
    columns = get_columns()
    data = get_data(filters)

    # Calculate summary
    report_summary = get_report_summary(data)

    return columns, data, None, None, report_summary

def get_report_summary(data):
    """Display summary cards"""
    total_invoices = len(data)
    total_amount = sum(row.get("grand_total", 0) for row in data)
    total_outstanding = sum(row.get("outstanding_amount", 0) for row in data)

    return [
        {
            "value": total_invoices,
            "label": _("Total Invoices"),
            "datatype": "Int"
        },
        {
            "value": total_amount,
            "label": _("Total Amount"),
            "datatype": "Currency",
            "currency": "EGP"
        },
        {
            "value": total_outstanding,
            "label": _("Outstanding"),
            "datatype": "Currency",
            "currency": "EGP"
        }
    ]
```

### Chart Data

```python
def execute(filters=None):
    columns = get_columns()
    data = get_data(filters)
    chart = get_chart_data(data)

    return columns, data, None, chart

def get_chart_data(data):
    """Generate chart"""
    # Group data by month
    from collections import defaultdict
    monthly_data = defaultdict(float)

    for row in data:
        month = row.get("posting_date").strftime("%b %Y")
        monthly_data[month] += row.get("grand_total", 0)

    return {
        "data": {
            "labels": list(monthly_data.keys()),
            "datasets": [
                {
                    "name": _("Sales"),
                    "values": list(monthly_data.values())
                }
            ]
        },
        "type": "bar",  # or "line", "pie", "percentage"
        "colors": ["#7cd6fd"],
        "barOptions": {
            "stacked": 0
        }
    }
```

### Tree Structure

```python
def execute(filters=None):
    columns = get_columns()
    data = get_data(filters)

    # Build tree structure
    tree_data = build_tree(data)

    return columns, tree_data

def build_tree(data):
    """Create hierarchical data"""
    tree = []

    # Group by customer
    from itertools import groupby
    data_sorted = sorted(data, key=lambda x: x.get("customer"))

    for customer, items in groupby(data_sorted, key=lambda x: x.get("customer")):
        items_list = list(items)
        customer_total = sum(item.get("grand_total", 0) for item in items_list)

        # Parent row
        tree.append({
            "customer": customer,
            "grand_total": customer_total,
            "indent": 0,
            "is_group": 1
        })

        # Child rows
        for item in items_list:
            item["indent"] = 1
            tree.append(item)

    return tree
```

---

## Common Patterns

### Aged Report (Aging Analysis)

```python
def execute(filters=None):
    columns = get_aging_columns()
    data = get_aging_data(filters)
    return columns, data

def get_aging_columns():
    return [
        {"fieldname": "customer", "label": _("Customer"), "fieldtype": "Link", "options": "Customer", "width": 180},
        {"fieldname": "age_0_30", "label": _("0-30 Days"), "fieldtype": "Currency", "width": 120},
        {"fieldname": "age_30_60", "label": _("30-60 Days"), "fieldtype": "Currency", "width": 120},
        {"fieldname": "age_60_90", "label": _("60-90 Days"), "fieldtype": "Currency", "width": 120},
        {"fieldname": "age_90_plus", "label": _("> 90 Days"), "fieldtype": "Currency", "width": 120},
        {"fieldname": "total", "label": _("Total"), "fieldtype": "Currency", "width": 120}
    ]

def get_aging_data(filters):
    from frappe.utils import date_diff, getdate

    invoices = frappe.db.sql("""
        SELECT customer, posting_date, outstanding_amount
        FROM `tabSales Invoice`
        WHERE docstatus = 1 AND outstanding_amount > 0
    """, as_dict=1)

    customer_aging = {}
    today = getdate()

    for inv in invoices:
        days_old = date_diff(today, inv.posting_date)
        customer = inv.customer
        amount = inv.outstanding_amount

        if customer not in customer_aging:
            customer_aging[customer] = {"age_0_30": 0, "age_30_60": 0, "age_60_90": 0, "age_90_plus": 0}

        if days_old <= 30:
            customer_aging[customer]["age_0_30"] += amount
        elif days_old <= 60:
            customer_aging[customer]["age_30_60"] += amount
        elif days_old <= 90:
            customer_aging[customer]["age_60_90"] += amount
        else:
            customer_aging[customer]["age_90_plus"] += amount

    data = []
    for customer, aging in customer_aging.items():
        total = sum(aging.values())
        data.append({
            "customer": customer,
            "age_0_30": aging["age_0_30"],
            "age_30_60": aging["age_30_60"],
            "age_60_90": aging["age_60_90"],
            "age_90_plus": aging["age_90_plus"],
            "total": total
        })

    return data
```

### Comparison Report

```python
def get_comparison_data(filters):
    """Compare current vs previous period"""
    from frappe.utils import add_days, date_diff

    date_range = date_diff(filters.to_date, filters.from_date)
    previous_from = add_days(filters.from_date, -date_range - 1)
    previous_to = add_days(filters.from_date, -1)

    current = get_period_data(filters.from_date, filters.to_date)
    previous = get_period_data(previous_from, previous_to)

    comparison = []
    for curr in current:
        prev = next((p for p in previous if p.item_code == curr.item_code), None)

        curr_qty = curr.qty
        prev_qty = prev.qty if prev else 0
        variance = curr_qty - prev_qty
        variance_percent = (variance / prev_qty * 100) if prev_qty else 0

        comparison.append({
            "item_code": curr.item_code,
            "current_qty": curr_qty,
            "previous_qty": prev_qty,
            "variance": variance,
            "variance_percent": variance_percent
        })

    return comparison
```

---

## Best Practices

### Performance Optimization

```python
# ✅ Good: Use specific fields
frappe.db.sql("""
    SELECT name, customer, posting_date, grand_total
    FROM `tabSales Invoice`
    WHERE ...
""")

# ❌ Bad: Select all fields
frappe.db.sql("""
    SELECT *
    FROM `tabSales Invoice`
    WHERE ...
""")

# ✅ Good: Use indexes
frappe.db.sql("""
    SELECT name FROM `tabSales Invoice`
    WHERE posting_date >= %(from_date)s
    AND company = %(company)s
""")

# ✅ Good: Limit results
frappe.db.sql("""
    SELECT name FROM `tabSales Invoice`
    WHERE ...
    LIMIT 5000
""")
```

### Error Handling

```python
def execute(filters=None):
    try:
        validate_filters(filters)
        columns = get_columns()
        data = get_data(filters)
        return columns, data
    except Exception as e:
        frappe.log_error(f"Script Report Error: {str(e)}")
        frappe.throw(_("Error generating report. Please check filters."))

def validate_filters(filters):
    """Validate required filters"""
    if not filters.get("from_date"):
        frappe.throw(_("From Date is required"))

    if not filters.get("to_date"):
        frappe.throw(_("To Date is required"))

    if filters.from_date > filters.to_date:
        frappe.throw(_("From Date cannot be after To Date"))
```

### Translation

```python
from frappe import _

# Use _() for all user-facing strings
{
    "label": _("Customer"),
    "label": _("Total Amount"),
}

# In messages
frappe.msgprint(_("Report generated successfully"))
frappe.throw(_("Invalid date range"))
```

---

## Quick Reference

**File Structure:**

```
[app]/[module]/report/[report_name]/
├── [report_name].json    # Report metadata & filters
├── [report_name].py      # Main logic (execute function)
└── [report_name].js      # Optional: client-side customization
```

**Key Functions:**

```python
execute(filters)           # Main report function
get_columns()             # Define column structure
get_data(filters)         # Fetch report data
get_conditions(filters)   # Build WHERE clause
get_report_summary(data)  # Summary cards
get_chart_data(data)      # Chart visualization
```

**Related Guides:**

- Database queries → `database_commands.md`
- Client scripts → `client_script.md`
- Server logic → `server_script.md`
- ERPNext patterns → `erpnext.md`

---

_Script Reports provide powerful data analysis. Use SQL efficiently and always validate filters._
