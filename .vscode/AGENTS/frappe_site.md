# Frappe Web Pages & Templates Guide

## Overview

This guide covers Frappe-specific web features: Jinja2 templating, print formats, web pages, portals, and email templates.

## 📋 Table of Contents

1. [Jinja2 Templating](#jinja2-templating)
2. [Print Formats](#print-formats)
3. [Web Pages](#web-pages)
4. [Portal Pages](#portal-pages)
5. [Email Templates](#email-templates)
6. [Web Forms](#web-forms)

---

## Jinja2 Templating

### Basic Syntax

```jinja2
{# Comment #}
{{ variable }}                 {# Output variable #}
{% if condition %}            {# Control structure #}
{% for item in items %}       {# Loop #}
{{ item.field }}
{% endfor %}
```

### Frappe Context Variables

```jinja2
{# Document fields #}
{{ doc.name }}
{{ doc.customer }}
{{ doc.total }}

{# Child table #}
{% for item in doc.items %}
  {{ item.item_name }} - {{ item.qty }}
{% endfor %}

{# Frappe functions #}
{{ frappe.format_value(doc.posting_date, {'fieldtype': 'Date'}) }}
{{ frappe.format_value(doc.grand_total, {'fieldtype': 'Currency'}) }}
{{ frappe.utils.now() }}
```

### Filters

```jinja2
{{ doc.customer|upper }}
{{ doc.grand_total|round(2) }}
{{ doc.items|length }}
{{ doc.posting_date|default('Today') }}
```

---

## Print Formats

### Creating Custom Print Format

**Location:** `[app]/[module]/print_format/[format_name]/[format_name].html`

**Basic Structure:**

```html
<div class="print-format">
    <h1>{{ doc.name }}</h1>
    
    <table>
        <tr>
            <td>Customer:</td>
            <td>{{ doc.customer }}</td>
        </tr>
        <tr>
            <td>Date:</td>
            <td>{{ frappe.format_value(doc.posting_date, {'fieldtype': 'Date'}) }}</td>
        </tr>
    </table>

    <table class="items">
        <thead>
            <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            {% for item in doc.items %}
            <tr>
                <td>{{ item.item_name }}</td>
                <td>{{ item.qty }}</td>
                <td>{{ frappe.format_value(item.rate, {'fieldtype': 'Currency'}) }}</td>
                <td>{{ frappe.format_value(item.amount, {'fieldtype': 'Currency'}) }}</td>
            </tr>
            {% endfor %}
        </tbody>
    </table>

    <div class="total">
        Grand Total: {{ frappe.format_value(doc.grand_total, {'fieldtype': 'Currency'}) }}
    </div>
</div>

<style>
    .print-format { font-family: Arial; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 8px; }
    .total { text-align: right; font-weight: bold; margin-top: 20px; }
</style>
```

### Print Format with Logo

```html
<div class="letter-head">
    {% if letter_head %}
        {{ letter_head }}
    {% endif %}
</div>

<div class="print-format">
    <!-- Content -->
</div>
```

### Conditional Content

```jinja2
{% if doc.docstatus == 1 %}
    <div class="approved">APPROVED</div>
{% elif doc.docstatus == 0 %}
    <div class="draft">DRAFT</div>
{% else %}
    <div class="cancelled">CANCELLED</div>
{% endif %}
```

---

## Web Pages

### Creating Web Page

**Location:** `[app]/www/[page_name].html` or `[app]/www/[page_name]/index.html`

**Basic HTML Page:**

```html
<!-- www/about.html -->
{% extends "templates/web.html" %}

{% block title %}About Us{% endblock %}

{% block page_content %}
<div class="container">
    <h1>About Our Company</h1>
    <p>{{ frappe.get_doc('Company', 'Your Company').company_description }}</p>
</div>
{% endblock %}
```

### Web Page with Python

**HTML:** `www/products/index.html`
```html
{% extends "templates/web.html" %}

{% block title %}Products{% endblock %}

{% block page_content %}
<div class="container">
    <h1>Our Products</h1>
    <div class="row">
        {% for item in items %}
        <div class="col-md-4">
            <h3>{{ item.item_name }}</h3>
            <p>{{ item.description }}</p>
            <p>Price: {{ frappe.format_value(item.standard_rate, {'fieldtype': 'Currency'}) }}</p>
        </div>
        {% endfor %}
    </div>
</div>
{% endblock %}
```

**Python:** `www/products/index.py`
```python
import frappe

def get_context(context):
    context.items = frappe.get_all(
        "Item",
        filters={"show_in_website": 1},
        fields=["name", "item_name", "description", "standard_rate"]
    )
```

### Route Parameters

**HTML:** `www/product/[item_code].html`
```html
{% extends "templates/web.html" %}

{% block page_content %}
<h1>{{ item.item_name }}</h1>
<p>{{ item.description }}</p>
<p>Price: {{ frappe.format_value(item.standard_rate, {'fieldtype': 'Currency'}) }}</p>
{% endblock %}
```

**Python:** `www/product/[item_code].py`
```python
import frappe

def get_context(context):
    item_code = frappe.form_dict.item_code
    context.item = frappe.get_doc("Item", item_code)
```

---

## Portal Pages

### Customer Portal Page

**Location:** `[app]/templates/pages/my_orders.html`

```html
{% extends "templates/web.html" %}

{% block title %}My Orders{% endblock %}

{% block page_content %}
<div class="container">
    <h1>My Orders</h1>
    
    {% if orders %}
    <table class="table">
        <thead>
            <tr>
                <th>Order No</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            {% for order in orders %}
            <tr>
                <td><a href="/order/{{ order.name }}">{{ order.name }}</a></td>
                <td>{{ frappe.format_value(order.transaction_date, {'fieldtype': 'Date'}) }}</td>
                <td>{{ frappe.format_value(order.grand_total, {'fieldtype': 'Currency'}) }}</td>
                <td>{{ order.status }}</td>
            </tr>
            {% endfor %}
        </tbody>
    </table>
    {% else %}
    <p>No orders found</p>
    {% endif %}
</div>
{% endblock %}
```

**Python:** `[app]/templates/pages/my_orders.py`
```python
import frappe

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.throw('Please login to view orders')
    
    customer = frappe.db.get_value('Customer', {'email_id': frappe.session.user})
    
    context.orders = frappe.get_all(
        'Sales Order',
        filters={'customer': customer},
        fields=['name', 'transaction_date', 'grand_total', 'status'],
        order_by='transaction_date desc'
    )
```

---

## Email Templates

### Creating Email Template

**Via UI:** Desk → Email Template → New

**Programmatically:**

```python
email_template = frappe.get_doc({
    'doctype': 'Email Template',
    'name': 'Sales Invoice Notification',
    'subject': 'Invoice {{ doc.name }} from {{ doc.company }}',
    'response': '''
Dear {{ doc.customer_name }},

Your invoice {{ doc.name }} dated {{ frappe.format_value(doc.posting_date, {'fieldtype': 'Date'}) }} 
is ready.

Invoice Total: {{ frappe.format_value(doc.grand_total, {'fieldtype': 'Currency'}) }}
Outstanding: {{ frappe.format_value(doc.outstanding_amount, {'fieldtype': 'Currency'}) }}

Please find the invoice attached.

Best regards,
{{ doc.company }}
    '''
})
email_template.insert()
```

### Sending Email with Template

```python
frappe.sendmail(
    recipients=['customer@example.com'],
    subject=frappe.render_template(email_template.subject, {'doc': doc}),
    message=frappe.render_template(email_template.response, {'doc': doc}),
    reference_doctype='Sales Invoice',
    reference_name=doc.name,
    attachments=[frappe.attach_print('Sales Invoice', doc.name)]
)
```

### Email with Custom Content

```python
from frappe.utils.email_lib import sendmail_to_system_users

# Render custom template
message = frappe.render_template('''
<h2>Order Confirmation</h2>
<p>Order {{ doc.name }} has been confirmed.</p>
<table>
    <tr><th>Item</th><th>Qty</th></tr>
    {% for item in doc.items %}
    <tr><td>{{ item.item_name }}</td><td>{{ item.qty }}</td></tr>
    {% endfor %}
</table>
''', {'doc': doc})

frappe.sendmail(
    recipients=['manager@company.com'],
    subject=f'Order {doc.name} Confirmed',
    message=message
)
```

---

## Web Forms

### Creating Web Form

**Via UI:** Desk → Web Form → New

**Structure:**
```python
web_form = frappe.get_doc({
    'doctype': 'Web Form',
    'title': 'Customer Feedback',
    'route': 'feedback',
    'doc_type': 'Customer Feedback',
    'is_standard': 1,
    'web_form_fields': [
        {
            'fieldname': 'customer_name',
            'label': 'Name',
            'fieldtype': 'Data',
            'reqd': 1
        },
        {
            'fieldname': 'email',
            'label': 'Email',
            'fieldtype': 'Data',
            'reqd': 1
        },
        {
            'fieldname': 'feedback',
            'label': 'Feedback',
            'fieldtype': 'Text',
            'reqd': 1
        }
    ]
})
web_form.insert()
```

### Custom Web Form Template

**Location:** `[app]/templates/includes/web_form/[doctype].html`

```html
<div class="custom-web-form">
    {{ web_form_html }}
    
    <script>
    frappe.ready(function() {
        // Custom validation
        frappe.web_form.validate = function() {
            var email = frappe.web_form.get_value('email');
            if (!email.includes('@')) {
                frappe.msgprint('Please enter valid email');
                return false;
            }
            return true;
        };
    });
    </script>
</div>
```

---

## Common Patterns

### Render Template in Python

```python
# Simple rendering
html = frappe.render_template('path/to/template.html', {'doc': doc})

# With file
html = frappe.render_template('templates/invoice.html', {
    'doc': doc,
    'company': frappe.get_doc('Company', doc.company)
})

# String template
html = frappe.render_template('''
<h1>{{ title }}</h1>
<p>{{ content }}</p>
''', {'title': 'Hello', 'content': 'World'})
```

### Get Template Files

```python
# From app
template_path = frappe.get_app_path('app_name', 'templates', 'invoice.html')

# Read template
with open(template_path, 'r') as f:
    template_content = f.read()
```

### Custom Jinja Filters

```python
# hooks.py
jinja = {
    "methods": [
        "my_app.utils.custom_format"
    ]
}

# my_app/utils.py
def custom_format(value):
    return f"Custom: {value}"

# Usage in template
{{ doc.name | custom_format }}
```

---

## Quick Reference

**Template Locations:**
- Print Format: `[app]/[module]/print_format/[name]/[name].html`
- Web Page: `[app]/www/[page].html`
- Portal Page: `[app]/templates/pages/[page].html`
- Email Template: Via Desk or API

**Common Functions:**
```jinja2
{{ frappe.format_value(value, {'fieldtype': 'Date'}) }}
{{ frappe.format_value(value, {'fieldtype': 'Currency'}) }}
{{ frappe.utils.now() }}
{{ frappe.utils.now_datetime() }}
{{ frappe.db.get_value('DocType', 'name', 'field') }}
```

**Related Guides:**
- Framework structure → `frappe.md`
- Database queries → `database_commands.md`
- Client scripts → `client_script.md`
- Server logic → `server_script.md`

---

*For general HTML/CSS/JavaScript (non-Frappe sites), see `html.md`*
