# Database Commands Guide

## Overview

This guide covers database operations, queries, schema inspection, and data management in Frappe Framework using MariaDB/MySQL.

## 📋 Table of Contents

1. [Database Access](#database-access)
2. [Schema Inspection](#schema-inspection)
3. [Data Queries](#data-queries)
4. [Frappe DB API](#frappe-db-api)
5. [Common Queries](#common-queries)
6. [Migrations & Patches](#migrations--patches)
7. [Backup & Restore](#backup--restore)
8. [Best Practices](#best-practices)

---

## Database Access

### Command Line Access

```bash
# Access database via bench
bench --site [site_name] mariadb

# Execute single query
bench --site [site_name] mariadb -e "SELECT * FROM `tabUser` LIMIT 10;"

# Execute from file
bench --site [site_name] mariadb < query.sql

# Access with root (system admin)
sudo mysql -u root -p
```

### Database Console

```bash
# Enter MariaDB console
bench --site medico.local mariadb

# Inside console:
MariaDB [_abc123]> SHOW TABLES;
MariaDB [_abc123]> SELECT * FROM `tabUser`;
MariaDB [_abc123]> EXIT;
```

### Connection Info

```bash
# Site config location
cat sites/[site_name]/site_config.json

# Database name format
# Site: medico.local → DB: _abc123xyz (hashed)

# Get database name
bench --site medico.local mariadb -e "SELECT DATABASE();"
```

---

## Schema Inspection

### Table Structure

```bash
# List all tables
bench --site [site_name] mariadb -e "SHOW TABLES;"

# Describe table structure
bench --site [site_name] mariadb -e "DESCRIBE \`tabSales Invoice\`;"

# Show create statement
bench --site [site_name] mariadb -e "SHOW CREATE TABLE \`tabSales Invoice\`;"

# List indexes
bench --site [site_name] mariadb -e "SHOW INDEX FROM \`tabSales Invoice\`;"
```

### Table Naming Convention

```
DocType Tables:
- Parent: `tabDocType Name`
- Child:  `tabChild DocType Name`

Examples:
- `tabSales Invoice`
- `tabSales Invoice Item`
- `tabCustomer`
- `tabPayment Entry`

Single DocTypes:
- `tabSingles` (stores all single values)
```

### Common Tables

```bash
# Core tables
DESCRIBE `tabDocType`;        # DocType definitions
DESCRIBE `tabDocField`;       # DocType fields
DESCRIBE `tabCustom Field`;   # Custom fields
DESCRIBE `tabProperty Setter`; # Field customizations
DESCRIBE `tabUser`;           # Users
DESCRIBE `tabRole`;           # Roles
DESCRIBE `tabUser Permission`; # User permissions

# ERPNext tables
DESCRIBE `tabSales Invoice`;  # Sales invoices
DESCRIBE `tabSales Invoice Item`; # Invoice items
DESCRIBE `tabCustomer`;       # Customers
DESCRIBE `tabItem`;           # Items
DESCRIBE `tabPayment Entry`;  # Payments

# System tables
DESCRIBE `tabError Log`;      # Error logs
DESCRIBE `tabActivity Log`;   # Activity logs
DESCRIBE `tabVersion`;        # Document versions
```

### Field Information

```bash
# Get all fields of a DocType
bench --site [site_name] mariadb -e "
SELECT fieldname, fieldtype, label, options
FROM \`tabDocField\`
WHERE parent = 'Sales Invoice'
ORDER BY idx;
"

# Get custom fields
bench --site [site_name] mariadb -e "
SELECT fieldname, fieldtype, label, dt
FROM \`tabCustom Field\`
WHERE dt = 'Sales Invoice';
"

# Check if field exists
bench --site [site_name] mariadb -e "
SHOW COLUMNS FROM \`tabSales Invoice\`
WHERE Field = 'custom_field_name';
"
```

---

## Data Queries

### Basic SELECT

```bash
# Select all
bench --site [site_name] mariadb -e "
SELECT * FROM \`tabSales Invoice\` LIMIT 10;
"

# Select specific fields
bench --site [site_name] mariadb -e "
SELECT name, customer, grand_total, posting_date
FROM \`tabSales Invoice\`
WHERE docstatus = 1
LIMIT 20;
"

# With conditions
bench --site [site_name] mariadb -e "
SELECT name, grand_total
FROM \`tabSales Invoice\`
WHERE customer = 'CUST-001'
AND docstatus = 1
AND posting_date >= '2024-01-01';
"
```

### Aggregations

```bash
# Count
bench --site [site_name] mariadb -e "
SELECT COUNT(*) as total
FROM \`tabSales Invoice\`
WHERE docstatus = 1;
"

# Sum
bench --site [site_name] mariadb -e "
SELECT customer, SUM(grand_total) as total_sales
FROM \`tabSales Invoice\`
WHERE docstatus = 1
GROUP BY customer
ORDER BY total_sales DESC
LIMIT 10;
"

# Average
bench --site [site_name] mariadb -e "
SELECT AVG(grand_total) as avg_invoice
FROM \`tabSales Invoice\`
WHERE docstatus = 1;
"
```

### JOIN Queries

```bash
# Parent-Child join
bench --site [site_name] mariadb -e "
SELECT 
    si.name, si.customer, si.grand_total,
    sii.item_code, sii.qty, sii.rate
FROM \`tabSales Invoice\` si
JOIN \`tabSales Invoice Item\` sii ON sii.parent = si.name
WHERE si.docstatus = 1
LIMIT 20;
"

# Join with master
bench --site [site_name] mariadb -e "
SELECT 
    si.name, si.grand_total,
    c.customer_name, c.customer_group
FROM \`tabSales Invoice\` si
JOIN \`tabCustomer\` c ON c.name = si.customer
WHERE si.docstatus = 1;
"
```

### Date Queries

```bash
# Date range
bench --site [site_name] mariadb -e "
SELECT name, posting_date, grand_total
FROM \`tabSales Invoice\`
WHERE posting_date BETWEEN '2024-01-01' AND '2024-12-31'
AND docstatus = 1;
"

# Current month
bench --site [site_name] mariadb -e "
SELECT COUNT(*) as count, SUM(grand_total) as total
FROM \`tabSales Invoice\`
WHERE MONTH(posting_date) = MONTH(CURDATE())
AND YEAR(posting_date) = YEAR(CURDATE())
AND docstatus = 1;
"
```

---

## Frappe DB API

### In Python Code

```python
import frappe

# Get single value
value = frappe.db.get_value(
    'Sales Invoice',
    'SINV-001',
    'grand_total'
)

# Get multiple fields
values = frappe.db.get_value(
    'Sales Invoice',
    'SINV-001',
    ['customer', 'grand_total', 'posting_date'],
    as_dict=True
)

# Get list
invoices = frappe.db.get_list(
    'Sales Invoice',
    filters={
        'customer': 'CUST-001',
        'docstatus': 1
    },
    fields=['name', 'grand_total'],
    order_by='posting_date desc',
    limit=10
)

# Get all (use with caution)
all_invoices = frappe.db.get_all(
    'Sales Invoice',
    filters={'customer': 'CUST-001'},
    fields=['*']
)

# Count
count = frappe.db.count(
    'Sales Invoice',
    filters={'docstatus': 1}
)

# Exists
if frappe.db.exists('Customer', 'CUST-001'):
    print("Exists")

# SQL query
result = frappe.db.sql("""
    SELECT customer, SUM(grand_total) as total
    FROM `tabSales Invoice`
    WHERE docstatus = 1
    GROUP BY customer
""", as_dict=True)

# SQL with parameters (safe from SQL injection)
result = frappe.db.sql("""
    SELECT * FROM `tabSales Invoice`
    WHERE customer = %s
    AND posting_date >= %s
""", (customer, from_date), as_dict=True)
```

### Set Values

```python
# Set single field
frappe.db.set_value(
    'Sales Invoice',
    'SINV-001',
    'remarks',
    'Updated remarks'
)

# Set multiple fields
frappe.db.set_value(
    'Sales Invoice',
    'SINV-001',
    {
        'remarks': 'Updated',
        'status': 'Paid'
    }
)

# Bulk update
frappe.db.sql("""
    UPDATE `tabSales Invoice`
    SET status = 'Overdue'
    WHERE due_date < CURDATE()
    AND outstanding_amount > 0
    AND docstatus = 1
""")

frappe.db.commit()
```

---

## Common Queries

### DocType Queries

```bash
# List all DocTypes
bench --site [site_name] mariadb -e "
SELECT name, module, is_submittable, custom
FROM \`tabDocType\`
ORDER BY name;
"

# Find DocType by module
bench --site [site_name] mariadb -e "
SELECT name FROM \`tabDocType\`
WHERE module = 'Accounts';
"

# Custom DocTypes only
bench --site [site_name] mariadb -e "
SELECT name FROM \`tabDocType\`
WHERE custom = 1;
"
```

### User Queries

```bash
# List active users
bench --site [site_name] mariadb -e "
SELECT name, full_name, email, enabled
FROM \`tabUser\`
WHERE enabled = 1
AND user_type = 'System User';
"

# User roles
bench --site [site_name] mariadb -e "
SELECT u.name, u.full_name, hr.role
FROM \`tabUser\` u
JOIN \`tabHas Role\` hr ON hr.parent = u.name
WHERE u.name = 'user@example.com';
"
```

### Custom Field Queries

```bash
# List custom fields
bench --site [site_name] mariadb -e "
SELECT dt, fieldname, label, fieldtype
FROM \`tabCustom Field\`
ORDER BY dt, idx;
"

# Custom fields for specific DocType
bench --site [site_name] mariadb -e "
SELECT fieldname, label, fieldtype, insert_after
FROM \`tabCustom Field\`
WHERE dt = 'Sales Invoice'
ORDER BY idx;
"
```

### Error Log Queries

```bash
# Recent errors
bench --site [site_name] mariadb -e "
SELECT creation, error, method
FROM \`tabError Log\`
ORDER BY creation DESC
LIMIT 20;
"

# Errors by method
bench --site [site_name] mariadb -e "
SELECT method, COUNT(*) as count
FROM \`tabError Log\`
GROUP BY method
ORDER BY count DESC;
"
```

### Singles (System Settings)

```bash
# Get system settings
bench --site [site_name] mariadb -e "
SELECT field, value
FROM \`tabSingles\`
WHERE doctype = 'System Settings';
"

# Update single value
bench --site [site_name] mariadb -e "
UPDATE \`tabSingles\`
SET value = 'New Value'
WHERE doctype = 'System Settings'
AND field = 'app_name';
"
```

---

## Migrations & Patches

### Creating Patches

**File:** `/apps/[app]/[app]/patches/v1_0/update_field.py`

```python
import frappe

def execute():
    """Patch to update field values"""
    frappe.db.sql("""
        UPDATE `tabSales Invoice`
        SET custom_field = 'Default Value'
        WHERE custom_field IS NULL
    """)
    
    frappe.db.commit()
```

**Register in patches.txt:**

```
my_app.patches.v1_0.update_field
my_app.patches.v1_0.create_custom_fields
```

### Running Migrations

```bash
# Run all pending migrations
bench --site [site_name] migrate

# Migrate specific app
bench --site [site_name] migrate --app my_app

# Check migration status
bench --site [site_name] migrate --status

# Reload DocTypes
bench --site [site_name] reload-doctype "Sales Invoice"
```

### Schema Sync

```bash
# Synchronize DocType schema
bench --site [site_name] console

>>> frappe.reload_doctype('Sales Invoice')
>>> frappe.db.commit()
```

---

## Backup & Restore

### Backup Commands

```bash
# Full site backup
bench --site [site_name] backup

# Backup with files
bench --site [site_name] backup --with-files

# Backup location
ls sites/[site_name]/private/backups/

# Database only
bench --site [site_name] backup --only-db
```

### Restore Commands

```bash
# Restore from backup
bench --site [site_name] restore /path/to/backup.sql.gz

# Restore database and files
bench --site [site_name] restore \
  --db-path /path/to/backup.sql.gz \
  --files-path /path/to/files.tar
```

### Manual Database Backup

```bash
# Export database
mysqldump -u [user] -p [database_name] > backup.sql

# Export specific tables
mysqldump -u [user] -p [database_name] \
  `tabSales Invoice` \
  `tabSales Invoice Item` > invoice_backup.sql

# Import database
mysql -u [user] -p [database_name] < backup.sql
```

---

## Best Practices

### Safety Rules

```bash
# ✅ Always backup before direct DB operations
bench --site [site_name] backup

# ✅ Use transactions for multiple updates
START TRANSACTION;
UPDATE `tabSales Invoice` SET status = 'Paid' WHERE name = 'SINV-001';
UPDATE `tabPayment Entry` SET status = 'Submitted' WHERE name = 'PE-001';
COMMIT;

# ❌ Never modify core tables directly
# Use Frappe APIs instead

# ✅ Test queries with LIMIT first
SELECT * FROM `tabSales Invoice` LIMIT 10;

# ✅ Use parameters to prevent SQL injection
frappe.db.sql("SELECT * FROM `tabCustomer` WHERE name = %s", (name,))
```

### Performance Tips

```bash
# ✅ Use indexes
CREATE INDEX idx_posting_date ON `tabSales Invoice`(posting_date);

# ✅ Limit results
SELECT * FROM `tabSales Invoice` LIMIT 100;

# ✅ Select only needed fields
SELECT name, customer, grand_total FROM `tabSales Invoice`;

# ❌ Avoid SELECT *
SELECT * FROM `tabSales Invoice`;  # Slow for large tables

# ✅ Use EXPLAIN to analyze queries
EXPLAIN SELECT * FROM `tabSales Invoice` WHERE customer = 'CUST-001';
```

### Debugging Queries

```python
# Enable query logging
import frappe

# Print executed queries
frappe.db.sql("SELECT * FROM `tabCustomer`", debug=True)

# Get last query
print(frappe.db.last_query)

# SQL profiling
frappe.conf.developer_mode = 1
# Queries will be logged in site's error log
```

---

## Quick Reference

### Common Commands

```bash
# Database access
bench --site [site] mariadb

# Table structure
bench --site [site] mariadb -e "DESCRIBE \`tabDocType\`;"

# Select data
bench --site [site] mariadb -e "SELECT * FROM \`tabUser\` LIMIT 10;"

# Count records
bench --site [site] mariadb -e "SELECT COUNT(*) FROM \`tabSales Invoice\`;"

# Migrate
bench --site [site] migrate

# Backup
bench --site [site] backup --with-files
```

### Important Tables

```
`tabDocType`          - DocType definitions
`tabDocField`         - DocType fields
`tabCustom Field`     - Custom fields
`tabUser`             - Users
`tabError Log`        - Error logs
`tabSingles`          - Single DocType values
```

---

*Always test database operations in development before running in production. Use Frappe DB API when possible instead of raw SQL.*