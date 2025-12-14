# Frappe Framework Reference Guide

## Overview

This guide provides Frappe Framework structure, file locations, and architectural patterns. For general AI guidelines, see `AGENTS.md`.

---

## Framework Locations

**Frappe Framework:**

-   Location: `/home/frappe/frappe-bench/apps/frappe`
-   Core framework directory: `/home/frappe/frappe-bench/apps/frappe/frappe/`
-   Python-based full-stack web framework
-   Metadata-driven, low-code framework

**ERPNext Application:**

-   Location: `/home/frappe/frappe-bench/apps/erpnext`
-   Core application directory: `/home/frappe/frappe-bench/apps/erpnext/erpnext/`
-   Built on Frappe Framework
-   Enterprise Resource Planning (ERP) system

**Bench Structure:**

-   Bench directory: `/home/frappe/frappe-bench/`
-   Apps installed in: `/home/frappe/frappe-bench/apps/`
-   Sites in: `/home/frappe/frappe-bench/sites/`

## 2. FRAPPE FRAMEWORK STRUCTURE 📁

### 2.1. Core Frappe Modules

**Key Directories in `/home/frappe/frappe-bench/apps/frappe/frappe/`:**

```
api/              # API endpoints and handlers
automation/       # Automation and workflow
change_log/       # Change log system
commands/         # CLI commands
config/           # Configuration management
contacts/         # Contact management
core/             # Core framework functionality
custom/           # Custom code directory
data/             # Data management
database/         # Database abstraction layer
desk/             # Desk UI (forms, lists, reports, pages)
email/            # Email functionality
geo/              # Geolocation features
gettext/          # Internationalization
integrations/     # Third-party integrations
locale/           # Localization files
model/            # Data model and ORM
modules/          # Module system
patches/          # Database migration patches
printing/         # Print format system
public/           # Public assets (CSS, JS, images)
pulse/            # Real-time updates
query_builder/    # SQL query builder
search/           # Search functionality
social/           # Social features
templates/        # Jinja2 templates
tests/            # Test suite
translations/     # Translation files
types/            # Type system
utils/            # Utility functions
website/          # Website builder
workflow/         # Workflow engine
www/              # Web interface
```

### 2.2. Frappe Desk Structure

**Key Components in `/home/frappe/frappe-bench/apps/frappe/frappe/desk/`:**

```
desktop.py        # Desktop/home page
doctype/          # DocType handlers (form, list, report views)
form/             # Form rendering
page/             # Custom pages
report/           # Report builders
```

**DocType Files Pattern:**

-   JSON: `frappe/desk/doctype/[doctype_name]/[doctype_name].json`
-   Python: `frappe/desk/doctype/[doctype_name]/[doctype_name].py`
-   JavaScript: `frappe/desk/doctype/[doctype_name]/[doctype_name].js`

## 3. ERPNEXT APPLICATION STRUCTURE 📦

### 3.1. Core ERPNext Modules

**Key Directories in `/home/frappe/frappe-bench/apps/erpnext/erpnext/`:**

```
accounts/         # Accounting module
assets/           # Asset management
bulk_transaction/ # Bulk transaction processing
buying/           # Procurement module
change_log/       # Change log
commands/         # CLI commands
communication/    # Communication management
config/           # Configuration
controllers/      # Business logic controllers
crm/              # Customer Relationship Management
domains/          # Domain-specific features
edi/              # Electronic Data Interchange
erpnext_integrations/ # Third-party integrations
exceptions.py     # Custom exceptions
hooks.py          # Application hooks
maintenance/      # Maintenance management
manufacturing/    # Manufacturing module
patches/          # Database migration patches
portal/           # Customer portal
projects/         # Project management
public/           # Public assets
quality_management/ # Quality control
regional/         # Regional features
selling/          # Sales module
stock/            # Inventory management
support/          # Support module
subcontracting/   # Subcontracting
templates/        # Templates
telephony/        # Telephony integration
translations/     # Translation files
utilities/        # Utility functions
```

### 3.2. ERPNext Module Structure

Each module typically contains:
-   `doctype/` - DocTypes (data models)
-   `page/` - Custom pages
-   `report/` - Reports
-   `dashboard/` - Dashboards
-   `workspace/` - Workspaces
-   `onboarding/` - Onboarding steps

---

## DocType File Patterns

### Naming Convention

Convert DocType name to lowercase with underscores:
- "Sales Invoice" → `sales_invoice`
- "POS Opening Shift" → `pos_opening_shift`
- "Payment Entry" → `payment_entry`

### File Locations

```bash
# Standard pattern
/apps/[app]/[app]/[module]/doctype/[doctype_name]/

# Files
[doctype_name].json          # DocType definition
[doctype_name].py            # Python controller
[doctype_name].js            # Client script
[doctype_name]_list.js       # List view customization
[doctype_name]_calendar.js   # Calendar view
```

### Finding DocType Files

```bash
# Search by name
find /home/frappe/frappe-bench/apps -type f -iname 'pos_opening_shift.json'

# Search multiple file types
find /home/frappe/frappe-bench/apps -type f \( -iname 'sales_invoice.json' -o -iname 'sales_invoice.py' -o -iname 'sales_invoice.js' \)

# Common locations
/home/frappe/frappe-bench/apps/frappe/frappe/desk/doctype/
/home/frappe/frappe-bench/apps/erpnext/erpnext/accounts/doctype/
/home/frappe/frappe-bench/apps/erpnext/erpnext/stock/doctype/
```

---

## Development Patterns

### DocType Development

**Components:**
1. **JSON** - Fields, permissions, validations
2. **Python Controller** - Business logic, server-side validation
3. **JavaScript** - Client-side behavior, form customization
4. **Print Format** - Custom print layouts
5. **Report** - Custom queries and reports

### Custom App Structure

```
[app_name]/
├── [app_name]/
│   ├── __init__.py
│   ├── modules.txt
│   ├── hooks.py
│   ├── patches.txt
│   └── [module]/
│       ├── __init__.py
│       ├── doctype/
│       │   └── [doctype_name]/
│       │       ├── [doctype_name].json
│       │       ├── [doctype_name].py
│       │       └── [doctype_name].js
│       ├── page/
│       ├── report/
│       └── workspace/
├── setup.py
├── pyproject.toml
└── requirements.txt
```

### Hooks System

**Common hooks in `hooks.py`:**
```python
# JavaScript/CSS
app_include_js = "assets/js/app.js"
app_include_css = "assets/css/app.css"

# DocType overrides
doctype_js = {
    "Sales Invoice": "public/js/sales_invoice.js"
}

# Document events
doc_events = {
    "Sales Invoice": {
        "validate": "app.custom.sales_invoice_validate",
        "on_submit": "app.custom.sales_invoice_submit"
    }
}

# Scheduled tasks
scheduler_events = {
    "daily": ["app.tasks.daily_task"]
}
```

---

## Bench Commands

### App Management

```bash
# Create app
bench new-app [app_name]

# Install app on site
bench --site [site_name] install-app [app_name]

# Uninstall app
bench --site [site_name] uninstall-app [app_name]

# Get app from GitHub
bench get-app https://github.com/user/repo
```

### Development

```bash
# Migrate database
bench --site [site_name] migrate

# Clear cache
bench --site [site_name] clear-cache

# Rebuild assets
bench build

# Restart
bench restart

# Console
bench --site [site_name] console
```

---

## Quick Reference

**Framework Paths:**
- Frappe: `/home/frappe/frappe-bench/apps/frappe/frappe/`
- ERPNext: `/home/frappe/frappe-bench/apps/erpnext/erpnext/`
- Custom Apps: `/home/frappe/frappe-bench/apps/[app_name]/`

**Key Directories:**
- DocTypes: `[app]/[module]/doctype/`
- Pages: `[app]/[module]/page/`
- Reports: `[app]/[module]/report/`
- Public Assets: `[app]/public/`
- Templates: `[app]/templates/`

**Related Guides:**
- Database queries → `database_commands.md`
- DocType creation → `doctype_commands.md`
- Client scripts → `client_script.md`
- Server logic → `server_script.md`
- Site management → `site_commands.md`
