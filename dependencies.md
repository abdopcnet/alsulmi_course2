# Dependencies

This document lists all dependencies required to run the Edumate Education HTML Template website.

## Frontend Dependencies

### CSS Frameworks & Libraries

1. **Bootstrap 5.3.0**
   - Location: `assets/css/plugins/bootstrap.min.css`
   - Purpose: Responsive grid system and UI components
   - Version: 5.3.0 (updated from 5.0.2)

2. **Font Awesome**
   - Location: `assets/css/plugins/fontawesome.min.css`
   - Purpose: Icon library for UI icons

3. **Animate.css**
   - Location: `assets/css/plugins/animate.min.css`
   - Purpose: CSS animations library

4. **Slick Carousel**
   - Location: `assets/css/plugins/slick.css`
   - Purpose: Carousel/slider functionality

5. **Magnific Popup**
   - Location: `assets/css/plugins/magnific-popup.css`
   - Purpose: Lightbox/popup functionality

6. **Default CSS**
   - Location: `assets/css/plugins/default.css`
   - Purpose: Base styling and resets

### JavaScript Libraries

1. **jQuery 3.6.0**
   - Location: `assets/js/vendor/jquery-3.6.0.min.js`
   - Purpose: DOM manipulation and event handling
   - Version: 3.6.0

2. **Modernizr 3.7.1**
   - Location: `assets/js/vendor/modernizr-3.7.1.min.js`
   - Purpose: Feature detection for HTML5/CSS3

3. **Bootstrap JS 5.3.0**
   - Location: `assets/js/plugins/bootstrap.min.js`
   - Purpose: Bootstrap JavaScript components
   - Dependencies: Popper.js

4. **Popper.js**
   - Location: `assets/js/plugins/popper.min.js`
   - Purpose: Tooltip and popover positioning (required by Bootstrap)

5. **Slick Carousel JS**
   - Location: `assets/js/plugins/slick.min.js`
   - Purpose: Carousel/slider functionality

6. **Magnific Popup JS**
   - Location: `assets/js/plugins/jquery.magnific-popup.min.js`
   - Purpose: Lightbox/popup functionality
   - Dependencies: jQuery

7. **WOW.js**
   - Location: `assets/js/plugins/wow.min.js`
   - Purpose: Scroll animations
   - Dependencies: Animate.css

8. **Isotope**
   - Location: `assets/js/plugins/isotope.pkgd.min.js`
   - Purpose: Filtering and sorting layouts (used in gallery)
   - Dependencies: imagesloaded

9. **ImagesLoaded**
   - Location: `assets/js/plugins/imagesloaded.pkgd.min.js`
   - Purpose: Image loading detection (used with Isotope)

10. **jQuery Appear**
    - Location: `assets/js/plugins/jquery.appear.min.js`
    - Purpose: Trigger callbacks when elements appear in viewport
    - Dependencies: jQuery

11. **AJAX Contact Form**
    - Location: `assets/js/plugins/ajax-contact.js`
    - Purpose: Contact form submission handler
    - Dependencies: jQuery

12. **Main JavaScript**
    - Location: `assets/js/main.js`
    - Purpose: Custom site functionality and initialization
    - Dependencies: All above JavaScript libraries

## Backend Dependencies

### PHP (Optional - for contact form)

1. **PHP 7.0+**
   - Location: `assets/contact.php`
   - Purpose: Contact form email handler
   - Requirements:
     - PHP mail() function enabled
     - Web server with PHP support (Apache/Nginx with PHP-FPM)

## Web Server Requirements

### Minimum Requirements

1. **Web Server**
   - Apache 2.4+ OR
   - Nginx 1.18+ OR
   - Any static file server

2. **PHP (Optional)**
   - PHP 7.0 or higher (only if using contact form)
   - PHP mail() function enabled

### Recommended Setup

- **Web Server**: Nginx or Apache
- **PHP**: PHP 7.4+ or PHP 8.0+ (if using contact form)
- **SSL Certificate**: For HTTPS (recommended for production)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Internet Explorer 11+ (limited support)

## Notes

- All dependencies are included in the template package
- No package manager (npm, yarn, etc.) is required
- The site can run as a static website without PHP
- PHP is only needed if you want the contact form to send emails
- All JavaScript libraries are minified versions included in the template

