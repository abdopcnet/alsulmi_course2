# AI Development Guidelines - Frappe Framework & ERPNext

## Overview

This directory contains specialized AI agent guidelines for Frappe Framework and ERPNext development. Each file addresses a specific aspect of the development workflow.

---

## 🎯 General Principles (Apply to ALL files)

### Communication Rules
- ✅ **English responses ONLY** - All AI responses must be in English (even if user writes in Arabic)
- ✅ **Short and direct** - Keep responses brief and concise
- ✅ **Numbered points** - Use numbered lists when listing items
- ✅ **Code comments in English** - Place comments above code sections
- ✅ **No lengthy explanations** - Avoid unnecessary details

### Development Rules
- ✅ **Verify before use** - Check real field names, file paths
- ✅ **Read actual code** - Base answers on code analysis only
- ✅ **Ask before modifying DB** - Never ALTER/DROP without permission
- ✅ **Follow Frappe patterns** - Reference core apps for examples
- ✅ **Use proper tools** - bench commands, not direct file edits

### Code Quality
- ✅ **Review syntax** - Check code before saving
- ✅ **Consistent formatting** - Follow project style
- ✅ **Handle errors properly** - Use Frappe's exception system

---

## 📚 Documentation Structure

### Core Framework
- **[frappe.md](./frappe.md)** - Frappe Framework architecture, structure, and best practices
- **[erpnext.md](./erpnext.md)** - ERPNext modules, business logic, and domain-specific patterns

### Development Workflows
- **[doctype_commands.md](./doctype_commands.md)** - DocType creation, modification, and management
- **[custom_field.md](./custom_field.md)** - Custom field creation and customization strategies
- **[client_script.md](./client_script.md)** - Client-side JavaScript patterns and form scripting
- **[server_script.md](./server_script.md)** - Server-side Python logic and API development
- **[script_report.md](./script_report.md)** - Script Report development with queries and charts

### System Administration
- **[database_commands.md](./database_commands.md)** - Database queries, schema inspection, and data operations
- **[site_commands.md](./site_commands.md)** - Bench commands, site management, and deployment

### Templates & UI
- **[frappe_site.md](./frappe_site.md)** - Frappe web pages, Jinja2, print formats, email templates
- **[html.md](./html.md)** - General HTML/CSS/JavaScript for static websites (non-Frappe)

## 🎯 File Responsibilities

### Core Guidelines (This File - AGENTS.md)
- ✅ General AI communication rules
- ✅ Response format requirements  
- ✅ Applied rules summary
- ✅ Cross-file navigation
- ❌ NOT for specific technical implementation

### Framework Structure (frappe.md)
- ✅ Frappe/ERPNext directory structure
- ✅ File locations and naming patterns
- ✅ Bench commands reference
- ✅ Hooks system overview
- ❌ NOT for development how-to

### Development Guides (Specialized Files)
- **doctype_commands.md** → DocType creation/management
- **custom_field.md** → Field customization
- **client_script.md** → Browser-side JavaScript
- **server_script.md** → Python controllers/API
- **script_report.md** → Script Reports with SQL/charts
- **database_commands.md** → SQL queries/schema
- **site_commands.md** → Bench operations
- **frappe_site.md** → Frappe web pages/templates/print formats
- **html.md** → General HTML sites (non-Frappe)
- **erpnext.md** → Business logic patterns

---

## 🎯 Usage Guidelines

### For AI Agents
1. **Read AGENTS.md first** for communication rules
2. **Consult frappe.md** for file locations
3. **Use specialized guides** for implementation
4. **Never duplicate rules** between files

### For Developers
1. **Project Setup**: `frappe.md` + `site_commands.md`
2. **Creating Features**: `doctype_commands.md` + `custom_field.md`
3. **Adding Logic**: `client_script.md` + `server_script.md`
4. **Debugging**: `database_commands.md`
5. **Frappe Web/Print**: `frappe_site.md`
6. **General HTML Sites**: `html.md`

## 🏗️ Project Context

**Environment:**
- Bench Directory: `/home/frappe/frappe-bench/`
- Apps Directory: `/home/frappe/frappe-bench/apps/`
- Sites Directory: `/home/frappe/frappe-bench/sites/`

**Installed Apps:**
- Frappe (core framework)
- ERPNext (ERP application)
- Custom apps (in `/apps/` directory)

## ⚡ Quick Reference

### Common Tasks
| Task | Primary File | Secondary Files |
|------|-------------|----------------|
| Create DocType | doctype_commands.md | frappe.md |
| Add Custom Field | custom_field.md | doctype_commands.md |
| Form Validation | client_script.md | server_script.md |
| API Method | server_script.md | frappe.md |
| Database Query | database_commands.md | frappe.md |
| Print Format | html.md | frappe.md |
| Site Management | site_commands.md | - |
| ERPNext Customization | erpnext.md | custom_field.md |

### Command Patterns
```bash
# Site operations
bench --site [site_name] [command]

# Database inspection
bench --site [site_name] mariadb -e "DESCRIBE `tabDocType`;"

# App management
bench new-app [app_name]
bench --site [site_name] install-app [app_name]

# Development
bench migrate
bench build --app [app_name]
bench restart
```

## 📋 Development Principles

### Code Quality
1. **Read before write**: Always inspect existing code patterns
2. **Follow conventions**: Match Frappe/ERPNext coding standards
3. **Use framework APIs**: Leverage built-in methods over custom solutions
4. **Document changes**: Comment complex logic clearly

### Database Safety
1. **Never modify schema directly**: Use migrations and patches
2. **Verify field names**: Check actual database structure before queries
3. **Use framework methods**: Prefer `frappe.db.*` over raw SQL
4. **Test in dev first**: Never experiment in production

### Architecture
1. **Understand the stack**: Framework → App → Module → DocType → Fields
2. **Respect boundaries**: Keep business logic in appropriate layers
3. **Reuse components**: Check for existing DocTypes/methods before creating new ones
4. **Hook properly**: Use `hooks.py` for event registration

## 🔗 Cross-File Dependencies

### Understanding Relationships
```
frappe.md (Framework Core)
├── erpnext.md (Application Layer)
├── doctype_commands.md (Data Model)
│   ├── custom_field.md (Field Extensions)
│   ├── client_script.md (Client Logic)
│   └── server_script.md (Server Logic)
├── database_commands.md (Data Layer)
├── site_commands.md (Operations)
└── html.md (Presentation)
```

### Typical Workflow
1. **Define data model**: `doctype_commands.md` + `custom_field.md`
2. **Add client behavior**: `client_script.md`
3. **Implement server logic**: `server_script.md`
4. **Customize UI**: `html.md`
5. **Deploy**: `site_commands.md`

## 📞 Support Resources

**Official Documentation:**
- Frappe Framework: https://frappeframework.com/docs
- ERPNext: https://docs.erpnext.com
- Frappe GitHub: https://github.com/frappe/frappe
- ERPNext GitHub: https://github.com/frappe/erpnext

**Community:**
- Frappe Forum: https://discuss.frappe.io
- ERPNext Forum: https://discuss.erpnext.com

---

## 🎓 Getting Started

**New to Frappe/ERPNext?**
1. Read `frappe.md` for framework fundamentals
2. Review `site_commands.md` for basic operations
3. Study `doctype_commands.md` to understand data modeling
4. Practice with `client_script.md` and `server_script.md`

**Working on a specific task?**
- Consult the relevant specialized file
- Cross-reference related files for context
- Check code examples in framework source code

**Need to debug?**
1. Use `database_commands.md` to inspect data
2. Check `frappe.md` for framework debugging tools
3. Review `site_commands.md` for log access

---

## 📋 Communication & Verification Protocol

### Response Requirements

1. Start responses with numbered points.
2. Use simple, concise English friendly to Arabic readers.
3. End every response with `Applied rules:` followed by the applied rules list (one line per section in this exact format, no numbers):
    - `📢 COMMUNICATION RULES`
    - `🏛️ FRAMEWORK LOCATIONS`
    - `📁 FRAPPE FRAMEWORK STRUCTURE`
    - `📦 ERPNEXT APPLICATION STRUCTURE`
    - `📌 FIELD NAMING & DATA INTEGRITY`
    - `🧭 CODE ANALYSIS PRINCIPLES`
    - `🏛️ CORE SYSTEM APPLICATIONS REFERENCE`
    - `🔒 DATABASE MODIFICATION PROTOCOL`
    - `🧭 DEVELOPMENT WORKFLOW`
    - `🎯 FRAPPE DEVELOPMENT PATTERNS`
    - `🎛️ CODE QUALITY STANDARDS`
    - `✅ COMMUNICATION & VERIFICATION`

---

## 📋 Applied Rules Summary

**IMPORTANT:** When AI agents respond, they must always state which rules were applied at the end of each response.

When working with Frappe/ERPNext, apply these principles:

-   📢 **COMMUNICATION RULES** - Short English only, English comments above sections
-   🏛️ **FRAMEWORK LOCATIONS** - Know Frappe and ERPNext installation paths
-   📁 **FRAPPE FRAMEWORK STRUCTURE** - Understand core modules and desk structure
-   📦 **ERPNEXT APPLICATION STRUCTURE** - Understand ERPNext modules and organization
-   📌 **FIELD NAMING & DATA INTEGRITY** - Use only real DB field names, verify before use
-   🧭 **CODE ANALYSIS PRINCIPLES** - Read actual files, understand architecture
-   🏛️ **CORE SYSTEM APPLICATIONS REFERENCE** - Reference Frappe/ERPNext for patterns
-   🔒 **DATABASE MODIFICATION PROTOCOL** - Never modify DB without permission, use proper queries
-   🧭 **DEVELOPMENT WORKFLOW** - Read before edit, follow Frappe patterns
-   🎯 **FRAPPE DEVELOPMENT PATTERNS** - Follow DocType and custom app patterns
-   🎛️ **CODE QUALITY STANDARDS** - Review syntax, consistent formatting, English comments
-   ✅ **COMMUNICATION & VERIFICATION** - Short English responses, numbered points

**Response Format:**
Every AI response must end with:
```
Applied rules: [List applicable rules from above]
```

---

*Last Updated: December 2025*
*Framework Version: Frappe 15.x / ERPNext 15.x*