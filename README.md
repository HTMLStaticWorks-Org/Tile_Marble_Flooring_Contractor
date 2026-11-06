# Pietra Vera — Architectural Tile & Stone Flooring Website Template

A premium, luxury editorial-style contractor website template crafted for high-end flooring installation companies, marble specialists, custom tile artisans, and granite flooring contractors.

---

## 🌟 Key Features & Updates

1. **RTL Direction Switcher in Navbar & Mobile Menu**
   - Clean, minimal toggle button containing **only** text (`RTL` / `LTR`).
   - Shared design specifications with the theme toggle button (42×42px, architectural border, smooth hover transitions).
   - In all mobile and tablet viewports (up to 1024px), buttons are moved from the header into the mobile menu page for a decluttered header bar.
   - Instant bi-directional layout adaptation (`dir="rtl"`) with `localStorage` persistence.

2. **Refined Footer & Theme Integration**
   - Footer background is pure white (`#FFFFFF`) in light mode with refined stone-tinted borders and dark text.
   - Retains deep architectural charcoal (`#141312`) in dark mode.
   - Brand name and typography styles are unified across both header and footer.

3. **Unified Brand Identity**
   - Exact same font (`Cormorant Garamond`), size (`1.45rem`), weight (`700`), uppercase styling, and dynamic theme color (`var(--text-primary)`) across navbar and footer on all 6 pages.
   - Exact vector brand icon created as site favicon (`assets/images/favicon.svg`).

4. **Sticky / Fixed Navbar on Scroll**
   - Fixed header (`position: fixed; top: 0`) that remains visible while scrolling down the page.
   - Glassmorphism backdrop blur (`12px`) and subtle drop-shadow activation upon scrolling.
   - Hero sections dynamically offset with `padding-top: var(--navbar-height)`.

5. **Tablet & 1024px Card Alignment (2-Column Grid + Centered Odd Card)**
   - Between `768px` and `1024px` viewports across all pages and sections, cards automatically render 2 per row.
   - Any last odd-numbered card is centered with `margin-inline: auto`.
   - Includes dynamic JavaScript integration for the project gallery category filter.

6. **1024px Hamburger Menu Breakpoint**
   - At screen widths up to `1024px` (tablet landscape included), navigation transitions into the responsive full-height sliding mobile drawer menu.
   - Desktop hover dropdowns activate exclusively above `1024px` (`min-width: 1025px`).

---

## 📁 Project Structure

```
├── index.html          # Home 1: Architectural Editorial Experience
├── home-2.html         # Home 2: Stone Atelier & Live Flooring Cost Estimator
├── services.html       # Porcelain Tile, Natural Marble & Granite Installation
├── gallery.html        # Interactive Filtered Project Gallery with Lightbox
├── about.html          # Heritage, Quarry Curation & TCNA Standards
├── contact.html        # Comprehensive Quotation Request Form & Atelier Map
└── assets/
    ├── css/
    │   └── style.css   # Luxury architectural design system & responsive rules
    ├── js/
    │   └── main.js     # Light/Dark toggle, RTL toggle, gallery filters, lightbox, form validation
    └── images/
        └── favicon.svg # Exact SVG brand icon favicon
```

---

## 🚀 Running the Project

Open any HTML file (such as `index.html`) directly in any modern browser, or serve using any local static file server:

```bash
# Python 3
python -m http.server 8000

# or npx serve
npx serve .
```

