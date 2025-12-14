# Andalus Sweets - AI Agent Guidelines

## 0. COMMUNICATION RULES 📢

**CRITICAL: All AI responses must be in SHORT ENGLISH ONLY**

-   Keep responses brief and direct
-   Use simple, clear English
-   Avoid lengthy explanations
-   Number points when listing items
-   End with a summary of changes

**CODE COMMENTS: English only, above every section**

-   All code comments must be in English
-   Place comments above code sections, not inline
-   Use clear, descriptive comments
-   Example:
    ```javascript
    // Handle form submission
    function handleSubmit() {
    	// Form logic here
    }
    ```

## 1. PROJECT STRUCTURE 📁

### 1.1. Flat Directory Organization

The project follows a **flat structure** where all HTML pages are in the root directory, with organized folders for CSS, JavaScript, and assets.

**Project Structure:**

```
/
├── index.html              # Home page
├── food.html               # Food page
├── sweets.html             # Sweets page
├── orders.html             # Shopping cart/orders page
├── special-orders.html     # Special orders page
├── navbar.html             # Navbar component
├── footer.html             # Footer component
│
├── css/
│   └── index.css           # All shared CSS (fonts, navbar, footer, cart, etc.)
│
├── js/
│   ├── index.js            # Shared JavaScript (cart, navbar/footer loading)
│   └── api_mapper.js       # API integration
│
└── assets/
    ├── fonts/
    │   └── dg-kufi.ttf     # Custom Arabic font
    └── images/             # All images (shared and page-specific)
        ├── favicon.ico
        ├── cart.png
        ├── food1.png
        ├── cake.jpg
        └── ... (all images)
```

**File Organization:**

-   **HTML files**: All in root directory (flat structure)
-   **CSS files**: All in `css/` folder (`css/index.css`)
-   **JavaScript files**: All in `js/` folder (`js/index.js`, `js/api_mapper.js`)
-   **Assets**: All in `assets/` folder (`assets/fonts/`, `assets/images/`)

**Important:**

-   All HTML pages are in root directory (not in subfolders)
-   Shared CSS is in `css/index.css`
-   Shared JavaScript is in `js/index.js`
-   All images are in `assets/images/` (no separate page-specific image folders)
-   Navbar and footer are separate HTML files in root (`navbar.html`, `footer.html`)

### 1.2. Path Conventions

**Relative Paths (from root directory):**

Since all HTML files are in the root directory, paths are simpler:

**CSS Files:**

-   Shared CSS: `css/index.css`
-   Example: `<link rel="stylesheet" href="css/index.css" />`

**JavaScript Files:**

-   Shared JS: `js/index.js`
-   API Mapper: `js/api_mapper.js`
-   Example: `<script src="js/index.js"></script>`

**Images:**

-   All images: `assets/images/[filename]`
-   Example: `<img src="assets/images/cake.jpg" alt="..." />`

**HTML Pages:**

-   All pages in root: `food.html`, `sweets.html`, `orders.html`, etc.
-   Example: `<a href="food.html">Food</a>`

**Components:**

-   Navbar: `navbar.html`
-   Footer: `footer.html`

**Path Rules:**

-   All paths are relative to root directory (no `../` needed for shared files)
-   CSS: Always use `css/index.css`
-   JavaScript: Always use `js/index.js`, `js/api_mapper.js`
-   Images: Always use `assets/images/[filename]`
-   Pages: Direct references (e.g., `food.html`, `sweets.html`)

### 1.3. HTML Structure (STRICT)

**All HTML files MUST follow this exact structure:**

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
	<head>
		<!-- 1. Meta charset (REQUIRED) -->
		<meta charset="UTF-8" />

		<!-- 2. Meta viewport (REQUIRED) -->
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />

		<!-- 3. Title (REQUIRED) -->
		<title>Page Title</title>

		<!-- 4. External CSS files (REQUIRED) -->
		<link rel="stylesheet" href="css/index.css" />
		<!-- Additional external CSS files here -->

		<!-- 5. Internal CSS (OPTIONAL - only if page-specific styles needed) -->
		<style>
			/* Page-specific styles only */
		</style>
	</head>
	<body>
		<!-- Visible page content (div, p, section, etc.) -->
		<div id="navbar-container"></div>
		<!-- Page content here -->
		<div id="footer-container"></div>

		<!-- JavaScript (REQUIRED - at the end of body) -->
		<script src="js/index.js"></script>
		<!-- Additional external JS files here -->
		<script>
			/* Page-specific JavaScript */
		</script>
	</body>
</html>
```

**Structure Rules:**

1. **`<head>` section order (STRICT):**

    - `meta charset` → `meta viewport` → `title` → `link` (external CSS) → `style` (internal CSS, optional)

2. **`<body>` section order (STRICT):**

    - Visible content (HTML elements) → `script` tags (at the end)

3. **CSS placement:**

    - External CSS: Use `<link>` tags in `<head>`
    - Internal CSS: Use `<style>` tag in `<head>` (only for page-specific styles)
    - **NEVER** place `<style>` after `</head>` or in `<body>`

4. **JavaScript placement:**

    - **ALWAYS** at the end of `<body>`, before `</body>`
    - External JS files first, then inline `<script>` tags
    - **NEVER** place `<script>` in `<head>` (except for special cases like analytics)

5. **Page components:**
    - Navbar: `<div id="navbar-container"></div>` (loaded dynamically)
    - Footer: `<div id="footer-container"></div>` (loaded dynamically)
    - Page-specific content between navbar and footer

## 2. CODE ANALYSIS PRINCIPLES 🧭

1. **Always read actual files** - Never guess or assume code structure
2. **Understand vanilla JavaScript** - No Vue.js, use plain JavaScript
3. **Check file structure** - Each page is in its own module folder
4. **Verify paths** - All paths are relative, check folder structure
5. **Check localStorage** - Cart and location data stored in localStorage
6. **Module location** - Know which module you're working in
7. **Shared code location** - Cart, location modal, navbar/footer loading are all in `index.js`

## 3. ASSET MANAGEMENT 📦

### 3.1. Image Paths

**All images:**

-   Location: `assets/images/` (all images in one folder)
-   Path in HTML/JS: `assets/images/[filename]`
-   Example: `assets/images/cake.jpg`, `assets/images/food1.png`
-   No separate folders for page-specific images - all images are in `assets/images/`

**Never use absolute paths** - Always use relative paths from the current file location

### 3.2. Video Paths

**Page-specific videos:**

-   Location: `[page]/videos/`
-   Path: `videos/[filename]`
-   Example: `sweets/videos/sweets_slideshow.mp4` → `videos/sweets_slideshow.mp4` in `sweets.html`

**Root-level videos (home page):**

-   Location: `videos/` (root folder, if exists)
-   Path: `videos/[filename]` (from root index.html)

**Cross-page video references:**

-   Use relative paths: `../[page]/videos/[filename]`
-   Example: `../sweets/videos/sweets_slideshow.mp4` from `index.html`

### 3.3. CSS Organization

**Page-specific CSS:**

-   Location: `[page]/[page].css`
-   Linked as: `<link rel="stylesheet" href="[page].css" />`

**Shared CSS:**

-   `index.css` - **All shared styles** (fonts, navbar, footer, cart, location modal, common styles)
-   Linked as: `<link rel="stylesheet" href="../index.css" />` (from page folders)
-   Linked as: `<link rel="stylesheet" href="index.css" />` (from root index.html)

**Responsive breakpoints:**

-   Desktop: `min-width: 769px`
-   Tablet: `max-width: 768px`
-   Mobile: `max-width: 480px`

## 4. JAVASCRIPT BEST PRACTICES ⚡

### 4.1. Module Structure

**Page-specific JavaScript:**

-   Location: Inline `<script>` tags at end of each HTML file
-   Contains page-specific logic (product rendering, form handling, etc.)
-   Placed directly in HTML files (not separate `.js` files)

**Shared JavaScript:**

-   `js/index.js` - **All shared functionality**:
    -   Cart management functions (`loadCart()`, `saveCart()`, `addToCart()`, `removeFromCart()`, `getCartCount()`, `updateCartUI()`, etc.)
    -   Location modal functions (`showLocationModal()`, `hideLocationModal()`, `confirmLocation()`, `initLocationModal()`)
    -   Navbar loader (`loadNavbar()`, `initializeNavbar()`)
    -   Footer loader (`loadFooter()`)
    -   Main initialization (`DOMContentLoaded` handler)
-   Linked as: `<script src="js/index.js"></script>` (from all HTML files)

-   `js/api_mapper.js` - **API integration**:
    -   Frappe/ERPNext API connection
    -   Customer and sales order functions
-   Linked as: `<script src="js/api_mapper.js"></script>` (where needed)

**No ES6 modules** - All scripts are loaded via `<script>` tags, functions are global

### 4.2. JavaScript Placement (STRICT)

**JavaScript MUST be placed at the end of `<body>`:**

```html
<body>
	<!-- HTML content -->

	<!-- External JS files first -->
	<script src="../index.js"></script>
	<script src="../api_mapper.js"></script>

	<!-- Inline JavaScript last -->
	<script>
		// Page-specific JavaScript
		document.addEventListener('DOMContentLoaded', () => {
			// Initialization code
		});
	</script>
</body>
```

**Rules:**

-   **ALWAYS** place `<script>` tags at the end of `<body>`, before `</body>`
-   External JS files first, then inline `<script>` tags
-   **NEVER** place `<script>` in `<head>` (except for special cases like analytics)
-   Use `DOMContentLoaded` event for initialization

### 4.3. Cart Management

-   Cart stored in `localStorage.getItem("cart")`
-   Functions in `index.js`: `addToCart()`, `removeFromCart()`, `getCartCount()`, `updateCartUI()`, etc.
-   Cart updates trigger `window.dispatchEvent(new Event("cartUpdated"))`
-   All pages import `index.js` via relative path

### 4.4. Location Management

-   Location stored in `localStorage.getItem("userLocation")`
-   Location modal functions in `index.js`
-   Public pages (don't require location): Home (index.html), Food, Sweets, Contact, SpecialOrders
-   Location modal HTML is defined in `index.css` (modal styles)

### 4.5. DOM Manipulation

-   Use `document.addEventListener("DOMContentLoaded", ...)` for initialization
-   Use `querySelector()` and `querySelectorAll()` for element selection
-   Use `addEventListener()` for event handling

### 4.6. Image Paths in JavaScript

-   All images: `assets/images/[filename]` (from root directory)
-   Update product data arrays in inline scripts to use correct paths
-   Example: `image: "assets/images/cake.jpg"`

## 5. STYLING GUIDELINES 🎨

### 5.1. CSS Organization

**CSS Placement Rules:**

1. **External CSS files:**

    - Shared CSS: `css/index.css` (linked in `<head>`)
    - Page-specific CSS: Inline in `<style>` tag (no separate CSS files)
    - Use `<link rel="stylesheet" href="css/index.css">` in `<head>`

2. **Internal CSS (inline in HTML):**

    - Use `<style>` tag **inside `<head>`**, before `</head>`
    - Only for page-specific styles
    - **NEVER** place `<style>` after `</head>` or in `<body>`

3. **CSS Structure:**
    - Common styles in `css/index.css`
    - Page-specific styles in inline `<style>` tags within each HTML file
    - No scoped attributes - plain CSS classes
    - Responsive breakpoints:
        - Desktop: `min-width: 769px`
        - Tablet: `max-width: 768px`
        - Mobile: `max-width: 480px`
    - Use RTL (right-to-left) for Arabic content

### 5.2. Color Scheme

-   Primary Orange: `#ff6f00` / `#ff6b35`
-   Text Dark: `#5d4e37`
-   Background: `#fafafa` / `#fff5e6`

### 5.3. Typography

-   Arabic font: `"Aref Ruqaa", serif` / `"DG Kufi"` (custom font from `assets/fonts/dg-kufi.ttf`)
-   English font: `"Cairo", "Segoe UI", sans-serif`

### 5.4. Direct Inline Styles Method

**When requested, replace all `class` attributes with direct inline `style` attributes:**

1. **Convert CSS classes to inline styles:**

    - Read CSS rules from `index.css` or page-specific CSS files
    - Convert each CSS property to inline style format
    - Replace `class="class-name"` with `style="property: value; property: value;"`
    - Example: `class="hero-banner"` → `style="background: linear-gradient(...); padding: 20px 0px; display: flex; ..."`

2. **Style attribute formatting:**

    - Use semicolons to separate properties: `style="property1: value1; property2: value2;"`
    - For long styles, use multi-line format for readability:
        ```html
        <div
        	style="
                background: linear-gradient(...);
                padding: 20px 0px;
                display: flex;
                align-items: center;
            "
        ></div>
        ```
    - Remove trailing semicolons from last property (optional, but consistent)

3. **CSS to inline conversion rules:**

    - Copy all CSS properties from class definition
    - Convert CSS syntax to inline style syntax (same format)
    - Include all properties: `display`, `padding`, `margin`, `background`, `color`, `font-size`, etc.
    - Preserve `!important` flags if present: `font-family: 'DG Kufi' !important;`
    - Convert complex values: gradients, shadows, transforms, etc.

4. **When to use inline styles:**

    - When explicitly requested by user
    - For specific elements that need direct styling
    - When CSS classes are not available or need to be bypassed

5. **Important notes:**
    - Inline styles have higher specificity than CSS classes
    - Inline styles cannot use CSS selectors (no `:hover`, `:before`, etc.)
    - Media queries cannot be applied to inline styles
    - Keep CSS file linked for other styles (navbar, footer, etc.)

## 6. DEVELOPMENT WORKFLOW 🛠️

### 6.1. File Editing Protocol

1. **Read files completely** before editing
2. **Identify module location** - Know which page/module you're working in
3. **Use search tools** to find exact locations
4. **Verify paths** - Check if assets exist and paths are correct (relative paths)
5. **Test changes** - Ensure no breaking changes
6. **Add English comments** above code sections

### 6.2. Adding New Page

1. Create new HTML file in root: `[page-name].html`
2. Add images to `assets/images/` if needed
3. Follow strict HTML structure:
    - `<head>`: meta tags, title, link to `css/index.css`, optional `<style>` tag
    - `<body>`: navbar container, page content, footer container, scripts
4. Link shared CSS: `<link rel="stylesheet" href="css/index.css" />`
5. Link shared JS: `<script src="js/index.js"></script>`
6. Add page-specific JavaScript in inline `<script>` tag at end of body
7. Add navbar/footer containers: `<div id="navbar-container"></div>`, `<div id="footer-container"></div>`
8. Update navbar links in `navbar.html` to include new page
9. **Do NOT modify `index.html`** - it's the home page, not a router

### 6.3. Cache Busting

-   Meta tags in HTML files prevent caching
-   No version parameters needed (static files)
-   Clear browser cache if changes don't appear

### 6.4. Code Formatting

-   JavaScript: camelCase for variables, English comments
-   CSS: Follow existing indentation (tabs, 4 spaces)
-   HTML: Use semantic HTML5 elements
-   Comments: English only, above sections

## 7. COMMON TASKS 🔧

### 7.1. Adding New Product

1. Find product data array in inline `<script>` tag of HTML file (e.g., `sweets.html`)
2. Add product object with: `id`, `name`, `price`, `category`, `image`
3. Use image path: `assets/images/[filename]`
4. Update render function if needed
5. Add product image to `assets/images/` folder

### 7.2. Updating Page Styles

1. Find page-specific CSS in inline `<style>` tag within HTML file
2. Add/modify CSS rules in the `<style>` tag
3. Test responsive breakpoints
4. Add English comments above sections

### 7.3. Updating Shared Component

1. **Navbar/Footer**: Edit `navbar.html` or `footer.html` (in root directory)
2. **Shared CSS**: Edit `css/index.css`
3. **Shared JS**: Edit `js/index.js` (cart, location modal, navbar/footer loading)
4. Changes affect all pages using the component
5. Test across multiple pages

### 7.4. Adding New Image/Video

1. Add file to `assets/images/` folder (all images in one location)
2. Use path in HTML/JS: `assets/images/[filename]`
3. Example: `<img src="assets/images/cake.jpg" alt="..." />`

## 8. DEBUGGING & TROUBLESHOOTING 🐛

### 8.1. Common Issues

-   **Images not loading**: Check relative path from current file location
-   **Styles not applying**: Verify CSS file is linked correctly (check relative path)
-   **JavaScript not working**: Check browser console for errors, verify script paths
-   **Links not working**: Verify path to target page (e.g., `sweets.html`, `food.html`)
-   **Cache issues**: Clear browser cache or use incognito mode
-   **Navbar/Footer not loading**: Check `js/index.js` is loaded and `loadNavbar()`/`loadFooter()` are called
-   **Checkout error "الرجاء اختيار الفرع"**: Ensure branch selection field is present in checkout form and branch is selected or available in localStorage
-   **CORS errors with Google Maps**: These are external embed errors from Google Maps iframe, cannot be fixed in our code

### 8.2. Path Debugging

-   **Relative path calculation**: Count folder levels from current file to target
    -   Same folder: `filename.ext`
    -   Parent folder: `../filename.ext`
    -   Sibling folder: `../sibling/filename.ext`
-   **Check file exists**: Verify file is in expected location
-   **Browser DevTools**: Use Network tab to see failed requests

### 8.3. Browser Cache

-   Meta tags in HTML files prevent caching
-   Clear browser cache if changes don't appear
-   Use browser DevTools to verify file loading

## 9. CODE QUALITY STANDARDS ✨

1. **Syntax Review**: Always check syntax before saving
2. **Consistent Formatting**: Follow existing code style
3. **Comments**: Write English comments above code sections
4. **Naming**: Use descriptive names in English (camelCase for variables)
5. **Error Handling**: Add console.log for debugging, remove before production
6. **English Only**: All code comments and AI responses in English
7. **Path Consistency**: Always use relative paths, never absolute paths

## 10. COMMUNICATION & VERIFICATION ✅

1. **Short English responses** - Keep it brief and direct
2. **Numbered points** - Use numbered lists for clarity
3. **Verify changes** - Always check linter errors after edits
4. **End with summary** - List what was changed
5. **English comments** - All code comments in English, above sections
6. **Path verification** - Verify all paths are relative and correct

---

## Applied Rules Summary

When working on this project, apply these principles:

-   📢 **COMMUNICATION RULES** - Short English only, English comments above sections
-   📁 **PROJECT STRUCTURE** - Flat structure, all HTML in root, CSS in `css/`, JS in `js/`, assets in `assets/`
-   🧭 **CODE ANALYSIS PRINCIPLES** - Read actual files, understand vanilla JavaScript, check module location
-   📦 **ASSET MANAGEMENT** - All images in `assets/images/`, all fonts in `assets/fonts/`
-   ⚡ **JAVASCRIPT BEST PRACTICES** - Page-specific and shared modules, localStorage, DOM manipulation
-   🎨 **STYLING GUIDELINES** - Page-specific CSS in inline `<style>`, shared CSS in `css/index.css`, RTL layout, responsive breakpoints
-   🛠️ **DEVELOPMENT WORKFLOW** - Read before edit, identify module, verify relative paths
-   🔧 **COMMON TASKS** - Follow modular patterns for products, pages, styles, components
-   🐛 **DEBUGGING** - Check relative paths, console errors, cache, file locations
-   ✨ **CODE QUALITY STANDARDS** - Review syntax, English comments, consistent formatting, relative paths
-   ✅ **COMMUNICATION** - Short English responses, numbered points, verify changes, check paths

---

## Module Reference Quick Guide

**HTML Pages (in root directory):**

-   `index.html` - Home page
-   `food.html` - Food restaurant page
-   `sweets.html` - Sweets restaurant page
-   `orders.html` - Shopping cart/orders page
-   `special-orders.html` - Special orders page
-   `navbar.html` - Navigation bar component
-   `footer.html` - Footer component

**Shared Files:**

-   `css/index.css` - All shared CSS
-   `js/index.js` - All shared JavaScript (cart, location modal, navbar/footer loading)
-   `js/api_mapper.js` - API integration

**Assets:**

-   `assets/fonts/` - Custom fonts
-   `assets/images/` - All images (shared and page-specific)

**Path Examples:**

-   From any HTML file to another page: `food.html`, `sweets.html`, `orders.html`
-   From any HTML file to shared CSS: `css/index.css`
-   From any HTML file to shared JS: `js/index.js`, `js/api_mapper.js`
-   From any HTML file to images: `assets/images/cake.jpg`
-   From any HTML file to fonts: `assets/fonts/dg-kufi.ttf`

---

## 11. API INTEGRATION 🔌

### 11.1. API Configuration

**API Mapper:**

-   Location: `js/api_mapper.js`
-   Purpose: Connects frontend to Frappe/ERPNext backend API
-   Functions:
    -   `submitCartAsOrder(customerInfo)` - Submit cart as sales order
    -   `create_customer_if_not_existed(mobile_no, customer_name, email)` - Create customer
    -   `create_sales_order(customer, items, delivery_date, branch)` - Create sales order
    -   `check_customer_if_existed(mobile_no)` - Check if customer exists
    -   `frappeApiRequest(method, data)` - Make API request to Frappe method

### 11.2. API Integration Flow

**Order Submission Process:**

1. User fills checkout form in `orders.html`
2. Checkout form includes:
    - Customer name (required) - `customer_name` field
    - Mobile number (required) - `mobile_no` field
    - Delivery address (optional) - `shipping_address` textarea
    - Delivery date (optional, defaults to tomorrow) - `delivery_date` date input
    - Branch selection (required) - `branch` select dropdown with options:
        - `khudraa` - فرع الخضراء
        - `nawaria` - فرع النوارية
        - `sharai` - فرع الشرائع
        - `sitteen` - فرع الستين
        - `awali` - فرع العوالي
3. Branch field is auto-populated from `localStorage.getItem('userLocation')` when modal opens (if user previously selected location)
4. If branch not selected in form, code falls back to `localStorage.getItem('userLocation')`
5. Form validation ensures branch is selected before submission
6. Inline script calls `submitCartAsOrder(customerInfo)` from `js/api_mapper.js`
7. `js/api_mapper.js`:
    - Checks if customer exists by mobile number
    - Creates customer if not exists (with `customer_group: 'website_customers'`)
    - Creates sales order with cart items
    - Returns success/error result

**Script Loading Order (in HTML files):**

```html
<script src="js/index.js"></script>
<!-- Cart functions -->
<script src="js/api_mapper.js"></script>
<!-- API mapper (includes API config) -->
<script>
	/* Page-specific JavaScript */
</script>
```

### 11.3. API Data Mapping

**Customer Fields:**

-   `customer_name` - Customer full name
-   `mobile_no` - Phone number (used as unique identifier)
-   `email_id` - Email address (optional)
-   `customer_group` - Always set to `'website_customers'`
-   `customer_type` - Set to `'Individual'`

**Sales Order Fields:**

-   `customer` - Customer name (from created/found customer)
-   `delivery_date` - Delivery date
-   `branch` - Branch selection (required) - one of: `khudraa`, `nawaria`, `sharai`, `sitteen`, `awali`
-   `items` - Array of cart items with:
    -   `item_code` - Item identifier
    -   `item_name` - Item name
    -   `qty` - Quantity
    -   `rate` - Price per unit
    -   `uom` - Unit of measure (default: 'Nos')

**Branch Selection:**

-   Branch is required for order submission
-   Branch selection field is a required `<select>` dropdown in checkout form
-   Branch field is auto-populated from `localStorage.getItem('userLocation')` when checkout modal opens (if user previously selected location via location modal)
-   If form field is empty after user interaction, code falls back to `localStorage.getItem('userLocation')` during submission
-   Form validation throws error "الرجاء اختيار الفرع" if branch is not selected
-   Valid branch values: `khudraa`, `nawaria`, `sharai`, `sitteen`, `awali`
-   Branch select element has same styling as other form inputs (padding, border, focus states)

**Checkout Form Structure (orders.html):**

-   Form ID: `checkout-form`
-   Modal ID: `checkout-modal`
-   Form fields:
    -   `customer-name` (input, required) - Customer full name
    -   `customer-phone` (input, required) - Mobile number
    -   `delivery-address` (textarea, optional) - Shipping address
    -   `delivery-date` (date input, optional) - Defaults to tomorrow
    -   `branch-select` (select, required) - Branch dropdown with 5 options
-   Form styling: All inputs, textareas, and selects share consistent styling via `.form-group input`, `.form-group textarea`, `.form-group select`
-   Branch auto-population: `showCheckoutModal()` function sets branch value from localStorage when modal opens
-   Form submission: `handleCheckoutSubmit()` validates all required fields including branch before calling API

**Backend Methods (Frappe):**

-   `sweets_site.create_customer.create_customer` - Create customer
-   `sweets_site.create_sales_order.create_sales_order` - Create sales order
