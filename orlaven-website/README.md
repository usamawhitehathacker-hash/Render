# 🎯 ORLAVEN — Website Code (Phase 1)

Production-ready code for **Announcement Bar + Header/Navigation** based on:
- **Idea #6** (Hybrid Conversion) → Announcement Bar (3 rotating messages)
- **Idea #4** (Split-Screen) → Header layout (NEW | MEN | WOMEN ← LOGO → CUSTOMIZE | SALE | BRAND)

---

## 📁 File Structure

```
orlaven-website/
├── index.html          → Main HTML structure
├── css/
│   └── style.css       → All styling (responsive, design tokens)
├── js/
│   └── script.js       → Interactions (rotation, sticky, mobile menu)
└── README.md           → This file
```

---

## 🚀 How to Run

### Option 1: Simple Open in Browser
1. Download all files
2. Double-click `index.html` → opens in browser
3. Done!

### Option 2: Local Server (Recommended for proper testing)
```bash
# Using Python (if installed)
cd orlaven-website
python -m http.server 8000

# Then open: http://localhost:8000
```

```bash
# Using Node.js (npx serve)
cd orlaven-website
npx serve

# Then open the URL it shows
```

---

## ✨ Features

### Announcement Bar
- ✅ 3 messages auto-rotating every 5 seconds
- ✅ Pauses when user hovers (UX-friendly)
- ✅ Closeable (X button) — remembers preference in session
- ✅ Gold accent on key words (ORLAVEN15, 67% SOLD)
- ✅ Mobile responsive (single line, separators hidden on small screens)

### Header / Navigation
- ✅ Logo CENTERED (split-screen Idea #4 style)
- ✅ Left nav: NEW (with pulsing gold dot) | MEN | WOMEN
- ✅ Right nav: CUSTOMIZE | SALE (red) | BRAND
- ✅ 4 icons: Search, Wishlist, Account, Cart (with count)
- ✅ Sticky on scroll (background changes to white with subtle shadow)
- ✅ Smooth animated underline on nav hover
- ✅ Mobile hamburger menu (full-screen overlay)
- ✅ Cart counter badge

---

## 🎨 Design Tokens (CSS Variables)

All colors, fonts, spacing are centralized in `:root` of `style.css`.
Easy to customize:

```css
--color-black:    #0A0A0A;   /* Logo, text, primary */
--color-gold:     #C9A96E;   /* Highlights, premium */
--color-cognac:   #8B4513;   /* Warm accent */
--color-cream:    #FAFAF5;   /* Background */
--color-red:      #C9302C;   /* SALE only */

--font-serif:     'Cormorant Garamond';
--font-sans:      'Inter';
--font-accent:    'Oswald';

--header-height:  70px;
--announcement-height: 40px;
```

---

## 📱 Responsive Breakpoints

- **Desktop:** 1025px+ (full nav)
- **Tablet:** 768px-1024px (smaller fonts, tighter spacing)
- **Mobile:** 480px-767px (hamburger menu, single message)
- **Small mobile:** <480px (icon set reduced, only cart visible)

---

## 🧪 Test Checklist

- [ ] Open `index.html` in browser
- [ ] Watch announcement bar rotate every 5 seconds
- [ ] Hover over announcement bar — should pause rotation
- [ ] Click X on announcement — should close it
- [ ] Refresh page — announcement should stay closed (this session)
- [ ] Scroll down — header background should turn white with shadow
- [ ] Hover any nav link — underline animates
- [ ] Resize browser to 600px wide — hamburger appears
- [ ] Click hamburger — full-screen menu opens
- [ ] Click any link in mobile menu — it closes
- [ ] Look for "NEW" with pulsing gold dot ●
- [ ] "SALE" should appear in red

---

## 🛠 Customization Tips

### Change announcement messages:
Edit in `index.html`:
```html
<div class="announcement-message active">
    Your custom message here
</div>
```
Add more `<div class="announcement-message">` for more rotations.

### Change rotation speed:
Edit `js/script.js`:
```javascript
const ROTATION_INTERVAL = 5000; // change to 3000 for 3 seconds, etc.
```

### Add real cart count:
In your code:
```javascript
window.OrlavenCart.updateCount(3); // Will show "3" in cart badge
```

### Change colors:
Edit `:root` block at the top of `css/style.css`.

---

## 🎯 What's Next?

This is **Phase 1**: Announcement bar + Header ✅

**Phase 2** (next file to build):
- Hero Section (Idea #6 — video/image background with split layout)
- Trust bar (press logos)
- Category grid

Just say the word and I'll build the next sections!

---

*Built based on analysis of 200+ premium leather brand websites.*
