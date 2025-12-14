# Website Structure

This document describes the structure and organization of the Edumate Education HTML Template.

## Directory Structure

```
/var/www/
├── edumate/                    # Main website directory
│   ├── assets/                 # All static assets
│   │   ├── css/               # Stylesheets
│   │   │   ├── plugins/       # Third-party CSS libraries
│   │   │   ├── style.css      # Main stylesheet (uncompressed)
│   │   │   ├── style.min.css  # Minified main stylesheet
│   │   │   └── style.css.map  # Source map for SCSS
│   │   ├── js/                # JavaScript files
│   │   │   ├── vendor/        # Core JavaScript libraries
│   │   │   ├── plugins/       # Third-party JavaScript plugins
│   │   │   └── main.js        # Main JavaScript file
│   │   ├── images/            # Image assets
│   │   ├── fonts/             # Web fonts
│   │   ├── scss/              # SCSS source files (for customization)
│   │   └── contact.php        # PHP contact form handler
│   ├── index.html             # Homepage (variant 1)
│   ├── index-2.html           # Homepage (variant 2)
│   ├── index-3.html           # Homepage (variant 3)
│   ├── about-us.html          # About page
│   ├── contact.html            # Contact page
│   ├── courses-details.html    # Course detail page
│   ├── our-courses.html        # Courses listing (grid 1)
│   ├── our-courses-2.html      # Courses listing (grid 2)
│   ├── our-courses-3.html      # Courses listing (grid 3)
│   ├── our-courses-left-sidebar.html    # Courses with left sidebar
│   ├── our-courses-right-sidebar.html   # Courses with right sidebar
│   ├── our-courses-list.html            # Courses list view
│   ├── our-courses-list-left-sidebar.html   # Courses list with left sidebar
│   ├── our-courses-list-right-sidebar.html  # Courses list with right sidebar
│   ├── event.html              # Events page (variant 1)
│   ├── event-2.html            # Events page (variant 2)
│   ├── event-details.html      # Event detail page
│   ├── teachers.html           # Teachers listing
│   ├── teacher-details.html    # Teacher detail page
│   ├── gallery.html            # Gallery page
│   ├── gallery-masonry.html    # Gallery masonry layout
│   ├── blog.html               # Blog listing
│   ├── blog-left-sidebar.html  # Blog with left sidebar
│   ├── blog-right-sideba.html  # Blog with right sidebar
│   ├── blog-details.html       # Blog post detail
│   ├── shop.html               # Shop page
│   ├── shop-left-sidebar.html  # Shop with left sidebar
│   ├── shop-right-sidebar.html # Shop with right sidebar
│   ├── product-details.html     # Product detail page
│   ├── login.html              # Login page
│   ├── register.html           # Registration page
│   ├── faq.html                # FAQ page
│   ├── notice.html             # Notice board
│   ├── testimonial.html        # Testimonials page
│   └── prepros.config          # Prepros configuration (build tool)
├── documentation/              # Template documentation
│   ├── index.html              # Documentation homepage
│   └── assets/                 # Documentation assets
└── changelog.txt               # Version changelog
```

## Page Types

### Home Pages
- **index.html**: Main homepage with slider, courses, events, testimonials
- **index-2.html**: Alternative homepage layout
- **index-3.html**: Third homepage variant

### Course Pages
- **our-courses.html**: Grid layout for courses
- **our-courses-2.html**: Alternative grid layout
- **our-courses-3.html**: Third grid variant
- **our-courses-left-sidebar.html**: Grid with left sidebar
- **our-courses-right-sidebar.html**: Grid with right sidebar
- **our-courses-list.html**: List view layout
- **our-courses-list-left-sidebar.html**: List with left sidebar
- **our-courses-list-right-sidebar.html**: List with right sidebar
- **courses-details.html**: Individual course detail page

### Event Pages
- **event.html**: Events listing (variant 1)
- **event-2.html**: Events listing (variant 2)
- **event-details.html**: Individual event detail page

### Teacher Pages
- **teachers.html**: Teachers/faculty listing
- **teacher-details.html**: Individual teacher profile page

### Gallery Pages
- **gallery.html**: Standard gallery grid
- **gallery-masonry.html**: Masonry/pinterest-style gallery layout

### Blog Pages
- **blog.html**: Blog post listing
- **blog-left-sidebar.html**: Blog with left sidebar
- **blog-right-sideba.html**: Blog with right sidebar
- **blog-details.html**: Individual blog post page

### Shop Pages
- **shop.html**: Product listing
- **shop-left-sidebar.html**: Shop with left sidebar
- **shop-right-sidebar.html**: Shop with right sidebar
- **product-details.html**: Individual product page

### Utility Pages
- **about-us.html**: About the institution
- **contact.html**: Contact form and information
- **login.html**: User login page
- **register.html**: User registration page
- **faq.html**: Frequently asked questions
- **notice.html**: Notice board/announcements
- **testimonial.html**: Student testimonials

## Asset Organization

### CSS Structure
- **plugins/**: Third-party CSS libraries (Bootstrap, Font Awesome, etc.)
- **style.css**: Main custom stylesheet
- **style.min.css**: Minified version for production
- **style.css.map**: Source map linking to SCSS files

### JavaScript Structure
- **vendor/**: Core libraries (jQuery, Modernizr)
- **plugins/**: Third-party plugins (Bootstrap, Slick, etc.)
- **main.js**: Custom JavaScript and initialization

### Images
- Located in `assets/images/`
- Includes: logos, banners, sliders, course images, gallery images, etc.
- Format: WebP format for optimization

### Fonts
- Located in `assets/fonts/`
- Custom web fonts used throughout the site

## Key Features

1. **Responsive Design**: Mobile-first, works on all devices
2. **Multiple Layouts**: Various page layouts and sidebar options
3. **Interactive Elements**: Sliders, galleries, popups, animations
4. **Contact Form**: PHP-based contact form (optional)
5. **SEO Friendly**: Semantic HTML structure
6. **Modern UI**: Clean, professional education-focused design

## Navigation Structure

The main navigation includes:
- Home (with 3 variants)
- Courses (with multiple layouts)
- Events
- Pages (About, Teachers, Gallery, etc.)
- Shop
- Blog
- Contact

## Common Components

All pages share:
- Header with navigation
- Footer with links and contact info
- Responsive mobile menu
- Back-to-top button
- Preloader (optional)

