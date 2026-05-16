# 🛍️ ORLAVEN — Complete Shopify Upload Guide
## Section-by-Section, No-Mixup Approach

> **Goal:** Add each section (Announcement Bar, Header, Hero) **separately** to Shopify
> **Approach:** Use Shopify's native **Sections** system — each piece is independent

---

# 📚 IMPORTANT — UNDERSTAND FIRST

## How Shopify Themes Work:

```
Your Shopify Theme (folder structure):
├── layout/
│   └── theme.liquid        ← Main wrapper (loads everything)
├── sections/               ← INDIVIDUAL sections (each is independent ✓)
│   ├── announcement-bar.liquid
│   ├── header.liquid
│   ├── hero.liquid
│   └── ...
├── snippets/              ← Reusable mini-components
├── templates/             ← Page templates (index.json, product.json, etc.)
├── assets/                ← CSS, JS, images
├── config/                ← Theme settings
└── locales/               ← Translations
```

**KEY INSIGHT:** Har section ek **separate file** hai jo aap independently edit kar sakte ho.
Ek file mein change karne se dusri file affect nahi hoti. ✅

---

# 🎯 3 WAYS TO ADD CODE TO SHOPIFY (Pick One)

## ✅ METHOD 1: Direct Edit in Shopify Admin (EASIEST — Recommended for You)
- No software install
- Edit directly in browser
- Add one section at a time
- **Best for:** Beginners, single-store

## ⚙️ METHOD 2: Shopify CLI (Pro developers)
- Local development
- Need to install Shopify CLI
- Better for big projects

## 📦 METHOD 3: Theme ZIP Upload
- Build everything locally → ZIP → upload
- Risky if not tested
- **Don't recommend for first time**

---

# 🚀 METHOD 1: STEP-BY-STEP (RECOMMENDED)

## **PREP: Before You Start**

### Step 0.1 — Login to Shopify
1. Go to: `https://admin.shopify.com`
2. Login with your store credentials

### Step 0.2 — Backup Current Theme (CRITICAL!)
1. Go to: **Online Store → Themes**
2. Find your current theme
3. Click **Actions → Duplicate** (creates a copy)
4. Rename copy to: "Backup - Before Orlaven Changes"
5. ✅ Now you have a backup. If anything breaks, restore from this.

### Step 0.3 — Create Working Theme
1. Click **Add theme → Add from Shopify Theme Store** (free theme)
2. Recommended: **"Dawn"** (Shopify's default — great base)
3. Click **Try theme**
4. Customize the new theme name to: "Orlaven Theme"

### Step 0.4 — Open Code Editor
1. On your working theme → **Actions → Edit code**
2. This opens Shopify's code editor
3. You'll see folder structure on left side
4. ✅ This is where you'll add your sections

---

# 📝 PHASE 1: ADD ANNOUNCEMENT BAR (Standalone)

## Step 1.1 — Create Announcement Section File

In Shopify Code Editor:
1. Find **`sections/`** folder on left
2. Click **`Add a new section`**
3. Name it: `orlaven-announcement-bar`
4. Click **Create section**
5. ✅ A new file opens: `sections/orlaven-announcement-bar.liquid`

## Step 1.2 — Paste Announcement Bar Code

**Delete the default content** in the new file, then paste this:

📄 **File:** `sections/orlaven-announcement-bar.liquid`

```liquid
{%- comment -%}
  ORLAVEN — Announcement Bar Section
  Auto-rotating messages with close button
{%- endcomment -%}

<div class="orlaven-announcement-bar" id="orlavenAnnouncementBar"
     data-rotation-speed="{{ section.settings.rotation_speed | default: 5000 }}">
  <div class="orlaven-announcement-container">
    <div class="orlaven-announcement-slider">
      {%- for block in section.blocks -%}
        <div class="orlaven-announcement-message {% if forloop.first %}active{% endif %}"
             {{ block.shopify_attributes }}>
          {{ block.settings.message }}
        </div>
      {%- endfor -%}
    </div>
    {%- if section.settings.show_close_button -%}
      <button class="orlaven-announcement-close" id="orlavenAnnouncementClose"
              aria-label="Close announcement">×</button>
    {%- endif -%}
  </div>
</div>

<style>
  .orlaven-announcement-bar {
    background-color: {{ section.settings.bg_color }};
    color: {{ section.settings.text_color }};
    padding: 0;
    height: {{ section.settings.bar_height }}px;
    overflow: hidden;
    position: relative;
    z-index: 1001;
    transition: height 0.3s ease;
  }

  .orlaven-announcement-bar.hidden { height: 0; }

  .orlaven-announcement-container {
    max-width: 1440px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 0 64px;
  }

  .orlaven-announcement-slider {
    flex: 1;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .orlaven-announcement-message {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: {{ section.settings.font_size }}px;
    font-weight: 400;
    letter-spacing: 0.5px;
    text-align: center;
    opacity: 0;
    transform: translateY(100%);
    transition: opacity 0.6s ease, transform 0.6s ease;
    white-space: nowrap;
    padding: 0 20px;
  }

  .orlaven-announcement-message.active {
    opacity: 1;
    transform: translateY(0);
  }

  .orlaven-announcement-message strong {
    color: {{ section.settings.accent_color }};
    font-weight: 600;
  }

  .orlaven-announcement-message a {
    color: {{ section.settings.accent_color }};
    text-decoration: underline;
    text-underline-offset: 2px;
    margin-left: 4px;
  }

  .orlaven-announcement-close {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: {{ section.settings.text_color }};
    font-size: 20px;
    cursor: pointer;
    opacity: 0.6;
    width: 24px;
    height: 24px;
  }

  .orlaven-announcement-close:hover { opacity: 1; }

  @media (max-width: 768px) {
    .orlaven-announcement-message {
      font-size: 11px;
      white-space: normal;
      line-height: 1.3;
    }
    .orlaven-announcement-container {
      padding: 0 40px;
    }
  }
</style>

<script>
  (function() {
    const messages = document.querySelectorAll('#orlavenAnnouncementBar .orlaven-announcement-message');
    const bar = document.getElementById('orlavenAnnouncementBar');
    const closeBtn = document.getElementById('orlavenAnnouncementClose');
    const speed = parseInt(bar.dataset.rotationSpeed, 10) || 5000;

    let current = 0;
    let timer;

    function rotate() {
      if (messages.length <= 1) return;
      messages[current].classList.remove('active');
      current = (current + 1) % messages.length;
      messages[current].classList.add('active');
    }

    function startRotation() { timer = setInterval(rotate, speed); }
    function stopRotation() { clearInterval(timer); }

    if (messages.length > 1) {
      startRotation();
      bar.addEventListener('mouseenter', stopRotation);
      bar.addEventListener('mouseleave', startRotation);
    }

    if (closeBtn) {
      try {
        if (sessionStorage.getItem('orlaven_announcement_closed') === 'true') {
          bar.classList.add('hidden');
          stopRotation();
        }
      } catch(e) {}

      closeBtn.addEventListener('click', function() {
        bar.classList.add('hidden');
        stopRotation();
        try { sessionStorage.setItem('orlaven_announcement_closed', 'true'); } catch(e) {}
      });
    }
  })();
</script>

{% schema %}
{
  "name": "Orlaven Announcement Bar",
  "tag": "section",
  "class": "orlaven-announcement-section",
  "settings": [
    {
      "type": "header",
      "content": "Appearance"
    },
    {
      "type": "color",
      "id": "bg_color",
      "label": "Background color",
      "default": "#0A0A0A"
    },
    {
      "type": "color",
      "id": "text_color",
      "label": "Text color",
      "default": "#FFFFFF"
    },
    {
      "type": "color",
      "id": "accent_color",
      "label": "Accent color (highlights)",
      "default": "#C9A96E"
    },
    {
      "type": "range",
      "id": "bar_height",
      "label": "Bar height (px)",
      "min": 30,
      "max": 60,
      "step": 2,
      "default": 40
    },
    {
      "type": "range",
      "id": "font_size",
      "label": "Font size (px)",
      "min": 11,
      "max": 16,
      "step": 1,
      "default": 13
    },
    {
      "type": "header",
      "content": "Behavior"
    },
    {
      "type": "range",
      "id": "rotation_speed",
      "label": "Rotation speed (ms)",
      "min": 3000,
      "max": 10000,
      "step": 500,
      "default": 5000
    },
    {
      "type": "checkbox",
      "id": "show_close_button",
      "label": "Show close button",
      "default": true
    }
  ],
  "blocks": [
    {
      "type": "message",
      "name": "Announcement message",
      "settings": [
        {
          "type": "richtext",
          "id": "message",
          "label": "Message",
          "default": "<p>🚚 FREE SHIPPING ON ORDERS $100+</p>"
        }
      ]
    }
  ],
  "max_blocks": 5,
  "presets": [
    {
      "name": "Orlaven Announcement Bar",
      "blocks": [
        {
          "type": "message",
          "settings": {
            "message": "<p>🚚 FREE SHIPPING ON ORDERS $100+ | 🔄 60-DAY RETURNS | 🎁 USE CODE: <strong>ORLAVEN15</strong> — 15% OFF</p>"
          }
        },
        {
          "type": "message",
          "settings": {
            "message": "<p>⚡ NEW DROP: \"Midnight Series\" — Only 200 made | <strong>67% SOLD</strong> | <a href=\"/collections/new\">SHOP NOW →</a></p>"
          }
        },
        {
          "type": "message",
          "settings": {
            "message": "<p>🏆 LIFETIME WARRANTY on all leather pieces | ⭐ Rated 4.9/5 by 12,847 customers</p>"
          }
        }
      ]
    }
  ],
  "enabled_on": {
    "groups": ["header"]
  }
}
{% endschema %}
```

## Step 1.3 — Save the File
1. Click **Save** button (top right)
2. ✅ File saved

## Step 1.4 — Add Section to Your Theme
1. Click **Customize** button (top right) OR go to **Online Store → Themes → Customize**
2. You'll see live theme editor
3. On left side, find **header** group
4. Click **Add section** → search **"Orlaven Announcement Bar"**
5. ✅ Click it — appears at top of page!

## Step 1.5 — Configure It
1. Click on the section in left panel
2. You'll see settings:
   - Background color → Change if needed
   - Text color → White by default
   - Accent color → Gold (#C9A96E)
   - Rotation speed → 5000ms (5 seconds)
   - Add/Remove messages from blocks
3. Click **Save** at top right
4. ✅ Done! Visit your store — announcement bar is live!

---

# 📝 PHASE 2: ADD HEADER (Separately)

## ⚠️ IMPORTANT WARNING
Shopify themes already have a header. You have **2 options**:

### Option A: REPLACE the existing header (Easier)
- Disable existing header in customizer
- Add Orlaven header instead

### Option B: CUSTOMIZE the existing header (Advanced)
- Edit `sections/header.liquid` file directly
- Higher risk of breaking things

**RECOMMENDATION: Use Option A** — cleaner and safer.

## Step 2.1 — Create Header Section File

1. In code editor → **`sections/`** folder
2. Click **Add a new section**
3. Name: `orlaven-header`
4. Click **Create section**

## Step 2.2 — Paste Header Code

📄 **File:** `sections/orlaven-header.liquid`

```liquid
{%- comment -%}
  ORLAVEN — Header / Navigation Section
  Split-screen style: Logo center, nav left+right, sticky on scroll
{%- endcomment -%}

<header class="orlaven-header" id="orlavenHeader">
  <div class="orlaven-header-container">

    {%- comment -%} LEFT NAV {%- endcomment -%}
    <nav class="orlaven-nav-left">
      {%- for block in section.blocks -%}
        {%- if block.settings.position == 'left' -%}
          <a href="{{ block.settings.link }}"
             class="orlaven-nav-link {% if block.settings.highlight_style == 'new' %}orlaven-nav-highlight{% elsif block.settings.highlight_style == 'sale' %}orlaven-nav-sale{% endif %}"
             {{ block.shopify_attributes }}>
            {{ block.settings.label }}
          </a>
        {%- endif -%}
      {%- endfor -%}
    </nav>

    {%- comment -%} LOGO (Center) {%- endcomment -%}
    <a href="/" class="orlaven-logo">
      {%- if section.settings.logo != blank -%}
        <img src="{{ section.settings.logo | image_url: width: 200 }}"
             alt="{{ shop.name }}"
             width="200"
             height="auto"
             style="max-height: 50px; width: auto;">
      {%- else -%}
        <span class="orlaven-logo-text">{{ section.settings.logo_text | default: shop.name | upcase }}</span>
        {%- if section.settings.logo_tagline != blank -%}
          <span class="orlaven-logo-tagline">{{ section.settings.logo_tagline }}</span>
        {%- endif -%}
      {%- endif -%}
    </a>

    {%- comment -%} RIGHT NAV {%- endcomment -%}
    <nav class="orlaven-nav-right">
      {%- for block in section.blocks -%}
        {%- if block.settings.position == 'right' -%}
          <a href="{{ block.settings.link }}"
             class="orlaven-nav-link {% if block.settings.highlight_style == 'new' %}orlaven-nav-highlight{% elsif block.settings.highlight_style == 'sale' %}orlaven-nav-sale{% endif %}"
             {{ block.shopify_attributes }}>
            {{ block.settings.label }}
          </a>
        {%- endif -%}
      {%- endfor -%}

      <div class="orlaven-nav-icons">
        {%- if section.settings.show_search -%}
          <a href="/search" class="orlaven-icon-btn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </a>
        {%- endif -%}

        {%- if section.settings.show_wishlist -%}
          <a href="/pages/wishlist" class="orlaven-icon-btn" aria-label="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </a>
        {%- endif -%}

        {%- if section.settings.show_account -%}
          <a href="{% if customer %}/account{% else %}/account/login{% endif %}" class="orlaven-icon-btn" aria-label="Account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </a>
        {%- endif -%}

        <a href="/cart" class="orlaven-icon-btn orlaven-cart-btn" aria-label="Cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span class="orlaven-cart-count">{{ cart.item_count }}</span>
        </a>
      </div>

      {%- comment -%} Mobile hamburger {%- endcomment -%}
      <button class="orlaven-mobile-toggle" id="orlavenMobileToggle" aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>

  </div>

  {%- comment -%} MOBILE MENU {%- endcomment -%}
  <div class="orlaven-mobile-menu" id="orlavenMobileMenu">
    <div class="orlaven-mobile-menu-content">
      {%- for block in section.blocks -%}
        <a href="{{ block.settings.link }}">{{ block.settings.label }}</a>
      {%- endfor -%}
    </div>
  </div>
</header>

<style>
  :root {
    --orlaven-header-height: {{ section.settings.header_height }}px;
  }

  .orlaven-header {
    position: {% if section.settings.sticky %}sticky{% else %}relative{% endif %};
    top: 0;
    z-index: 1000;
    background-color: {{ section.settings.bg_color }};
    border-bottom: 1px solid rgba(0,0,0,0.06);
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
  }

  .orlaven-header.scrolled {
    background-color: rgba(255,255,255,0.98);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }

  .orlaven-header-container {
    max-width: 1440px;
    margin: 0 auto;
    height: var(--orlaven-header-height);
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 0 24px;
    gap: 16px;
  }

  .orlaven-nav-left {
    display: flex;
    align-items: center;
    gap: 40px;
    justify-self: start;
  }

  .orlaven-nav-right {
    display: flex;
    align-items: center;
    gap: 40px;
    justify-self: end;
  }

  .orlaven-nav-link {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: {{ section.settings.text_color }};
    text-decoration: none;
    position: relative;
    padding: 8px 0;
    transition: color 0.2s ease;
  }

  .orlaven-nav-link::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 4px;
    width: 0;
    height: 1px;
    background-color: {{ section.settings.text_color }};
    transition: width 0.3s ease;
  }

  .orlaven-nav-link:hover::after { width: 100%; }

  .orlaven-nav-highlight {
    color: {{ section.settings.accent_color }};
    font-weight: 600;
    position: relative;
  }

  .orlaven-nav-highlight::before {
    content: '';
    position: absolute;
    top: 6px;
    right: -10px;
    width: 6px;
    height: 6px;
    background-color: {{ section.settings.accent_color }};
    border-radius: 50%;
    animation: orlavenPulse 2s infinite;
  }

  @keyframes orlavenPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.3); }
  }

  .orlaven-nav-sale {
    color: #C9302C;
    font-weight: 600;
  }

  .orlaven-nav-sale::after {
    background-color: #C9302C;
  }

  .orlaven-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    justify-self: center;
  }

  .orlaven-logo-text {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: {{ section.settings.logo_size }}px;
    font-weight: 500;
    letter-spacing: 6px;
    color: {{ section.settings.text_color }};
    line-height: 1;
  }

  .orlaven-logo-tagline {
    font-family: 'Oswald', sans-serif;
    font-size: 9px;
    font-weight: 300;
    letter-spacing: 3px;
    color: #999;
    margin-top: 4px;
  }

  .orlaven-nav-icons {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .orlaven-icon-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: {{ section.settings.text_color }};
    text-decoration: none;
    position: relative;
    transition: background-color 0.2s ease;
  }

  .orlaven-icon-btn:hover { background-color: rgba(0,0,0,0.05); }

  .orlaven-cart-count {
    position: absolute;
    top: 2px;
    right: 2px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    background-color: {{ section.settings.text_color }};
    color: {{ section.settings.bg_color }};
    font-size: 10px;
    font-weight: 600;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  .orlaven-mobile-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    width: 24px;
    height: 18px;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 16px;
    padding: 0;
  }

  .orlaven-mobile-toggle span {
    display: block;
    width: 100%;
    height: 2px;
    background-color: {{ section.settings.text_color }};
    transition: all 0.3s ease;
  }

  .orlaven-mobile-toggle.active span:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }
  .orlaven-mobile-toggle.active span:nth-child(2) { opacity: 0; }
  .orlaven-mobile-toggle.active span:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }

  .orlaven-mobile-menu {
    position: fixed;
    top: var(--orlaven-header-height);
    left: 0;
    width: 100%;
    height: calc(100vh - var(--orlaven-header-height));
    background-color: {{ section.settings.bg_color }};
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 999;
    overflow-y: auto;
  }

  .orlaven-mobile-menu.active { transform: translateX(0); }

  .orlaven-mobile-menu-content {
    padding: 64px 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .orlaven-mobile-menu-content a {
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: {{ section.settings.text_color }};
    text-decoration: none;
    padding: 16px 0;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }

  @media (max-width: 1024px) {
    .orlaven-nav-left, .orlaven-nav-right .orlaven-nav-link { gap: 24px; }
    .orlaven-nav-link { font-size: 12px; letter-spacing: 1px; }
    .orlaven-logo-text { font-size: 24px; letter-spacing: 5px; }
  }

  @media (max-width: 768px) {
    :root { --orlaven-header-height: 60px; }
    .orlaven-header-container {
      grid-template-columns: auto 1fr auto;
      padding: 0 16px;
    }
    .orlaven-nav-left, .orlaven-nav-right .orlaven-nav-link { display: none; }
    .orlaven-nav-right { gap: 8px; }
    .orlaven-mobile-toggle { display: flex; }
    .orlaven-logo-text { font-size: 20px; letter-spacing: 4px; }
  }
</style>

<script>
  (function() {
    const header = document.getElementById('orlavenHeader');
    const mobileToggle = document.getElementById('orlavenMobileToggle');
    const mobileMenu = document.getElementById('orlavenMobileMenu');

    // Sticky scroll effect
    let scrollTimeout;
    window.addEventListener('scroll', function() {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(function() {
          if (window.scrollY > 50) header.classList.add('scrolled');
          else header.classList.remove('scrolled');
          scrollTimeout = null;
        }, 16);
      }
    });

    // Mobile menu
    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', function() {
        mobileToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
      });

      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
          mobileToggle.classList.remove('active');
          mobileMenu.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    }
  })();
</script>

{% schema %}
{
  "name": "Orlaven Header",
  "tag": "section",
  "class": "orlaven-header-section",
  "settings": [
    {
      "type": "header",
      "content": "Logo"
    },
    {
      "type": "image_picker",
      "id": "logo",
      "label": "Logo image (optional — overrides text)"
    },
    {
      "type": "text",
      "id": "logo_text",
      "label": "Logo text",
      "default": "ORLAVEN"
    },
    {
      "type": "text",
      "id": "logo_tagline",
      "label": "Logo tagline",
      "default": "PREMIUM LEATHER"
    },
    {
      "type": "range",
      "id": "logo_size",
      "label": "Logo text size (px)",
      "min": 16,
      "max": 36,
      "step": 1,
      "default": 28
    },
    {
      "type": "header",
      "content": "Appearance"
    },
    {
      "type": "color",
      "id": "bg_color",
      "label": "Background color",
      "default": "#FAFAF5"
    },
    {
      "type": "color",
      "id": "text_color",
      "label": "Text & icon color",
      "default": "#1A1A1A"
    },
    {
      "type": "color",
      "id": "accent_color",
      "label": "Accent color (NEW highlight)",
      "default": "#C9A96E"
    },
    {
      "type": "range",
      "id": "header_height",
      "label": "Header height (px)",
      "min": 60,
      "max": 100,
      "step": 5,
      "default": 70
    },
    {
      "type": "header",
      "content": "Behavior"
    },
    {
      "type": "checkbox",
      "id": "sticky",
      "label": "Sticky on scroll",
      "default": true
    },
    {
      "type": "header",
      "content": "Icons"
    },
    {
      "type": "checkbox",
      "id": "show_search",
      "label": "Show search icon",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "show_wishlist",
      "label": "Show wishlist icon",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "show_account",
      "label": "Show account icon",
      "default": true
    }
  ],
  "blocks": [
    {
      "type": "nav_link",
      "name": "Navigation link",
      "settings": [
        {
          "type": "text",
          "id": "label",
          "label": "Label",
          "default": "MEN"
        },
        {
          "type": "url",
          "id": "link",
          "label": "Link"
        },
        {
          "type": "select",
          "id": "position",
          "label": "Position",
          "options": [
            { "value": "left", "label": "Left of logo" },
            { "value": "right", "label": "Right of logo" }
          ],
          "default": "left"
        },
        {
          "type": "select",
          "id": "highlight_style",
          "label": "Highlight style",
          "options": [
            { "value": "none", "label": "Normal" },
            { "value": "new", "label": "NEW (gold dot)" },
            { "value": "sale", "label": "SALE (red)" }
          ],
          "default": "none"
        }
      ]
    }
  ],
  "max_blocks": 8,
  "presets": [
    {
      "name": "Orlaven Header",
      "blocks": [
        { "type": "nav_link", "settings": { "label": "NEW", "position": "left", "highlight_style": "new" } },
        { "type": "nav_link", "settings": { "label": "MEN", "position": "left", "highlight_style": "none" } },
        { "type": "nav_link", "settings": { "label": "WOMEN", "position": "left", "highlight_style": "none" } },
        { "type": "nav_link", "settings": { "label": "CUSTOMIZE", "position": "right", "highlight_style": "none" } },
        { "type": "nav_link", "settings": { "label": "SALE", "position": "right", "highlight_style": "sale" } },
        { "type": "nav_link", "settings": { "label": "BRAND", "position": "right", "highlight_style": "none" } }
      ]
    }
  ],
  "enabled_on": {
    "groups": ["header"]
  }
}
{% endschema %}
```

## Step 2.3 — Save & Add to Theme

1. Click **Save**
2. Go to **Customize**
3. Find existing **Header** section → Click eye icon to **hide** it (don't delete!)
4. Click **Add section** → search **"Orlaven Header"**
5. Add it
6. Configure colors, links, etc. in left panel
7. Add navigation links by clicking **Add block → Navigation link**
8. Save

---

# 🛡 SAFETY RULES (NO MIXUP!)

## ✅ DO:
- **One section at a time** — add, test, then move to next
- **Save after each change** — don't lose work
- **Preview before publishing** — test on staging first
- **Take screenshots** before/after each change
- **Use unique class names** — all classes prefixed with `orlaven-` to avoid conflicts

## ❌ DON'T:
- Don't edit theme.liquid (main wrapper) directly
- Don't delete original Shopify sections — just hide them
- Don't publish theme until everything tested
- Don't skip backup step
- Don't use generic class names like `.header` or `.button`

---

# 🔍 TESTING EACH SECTION

After adding each section:

1. **Preview** — Click "View" or "Preview" in customizer
2. **Test mobile** — Click phone icon in customizer top bar
3. **Test functions:**
   - Announcement bar rotating?
   - Header sticky on scroll?
   - Mobile menu opens?
   - Cart count showing correctly?
4. **Check different pages:**
   - Homepage
   - Product page
   - Collection page
   - Cart page
5. **Browser test:** Chrome, Safari, Firefox

---

# 🎯 ORDER OF DEVELOPMENT (RECOMMENDED)

```
Phase 1: Announcement Bar  ✅ (this guide)
   ↓ test, save, screenshot
Phase 2: Header             ✅ (this guide)
   ↓ test, save, screenshot
Phase 3: Hero Section       (next file)
   ↓
Phase 4: Trust Bar
   ↓
Phase 5: Category Grid
   ↓
... continue
```

**Each phase:**
1. Build → 2. Test → 3. Save → 4. Screenshot → 5. Move to next

---

# 🆘 IF SOMETHING BREAKS

## Quick Recovery:
1. Go to **Online Store → Themes**
2. Find your **backup theme** (the one we duplicated at start)
3. Click **Actions → Publish**
4. ✅ Site restored to before changes

## If section not showing:
1. Check Customizer → is it added?
2. Check schema syntax — JSON must be valid
3. Check browser console for errors (F12 → Console tab)

## Common errors:
- **"Liquid error"** → Syntax issue in code
- **Section not appearing in customizer** → Schema JSON invalid (use jsonlint.com to validate)
- **Styles not applying** → Class names conflict — use prefixed classes

---

# 📊 DEVELOPMENT TRACKER

Copy this and check off as you go:

```
□ Step 0.1 — Logged into Shopify
□ Step 0.2 — Backup theme created
□ Step 0.3 — Working theme (Dawn) installed
□ Step 0.4 — Code editor opened
□ Phase 1 — Announcement Bar created
   □ Section file created
   □ Code pasted
   □ Saved
   □ Added in customizer
   □ Configured colors/messages
   □ Tested rotation
   □ Tested mobile
   □ Screenshot taken ✓
□ Phase 2 — Header created
   □ Section file created
   □ Code pasted
   □ Saved
   □ Old header hidden
   □ New header added in customizer
   □ Logo text set
   □ Nav links added (NEW, MEN, WOMEN, CUSTOMIZE, SALE, BRAND)
   □ Tested sticky scroll
   □ Tested mobile menu
   □ Screenshot taken ✓
□ Phase 3 — Hero (waiting)
```

---

# 💡 PRO TIPS

1. **Theme Settings → Typography**: Set fonts globally so all sections inherit
2. **Theme Settings → Colors**: Define brand colors once, reuse across sections
3. **Sections > Templates**: Sections are reusable, templates use them
4. **Use `{% schema %}`**: All settings in customizer come from this JSON
5. **Test in incognito**: To see how guests see your store

---

# ❓ FAQ

**Q: Will my existing products/data be affected?**
A: NO. Theme code only affects design/layout. Products, customers, orders are separate.

**Q: Can I edit later?**
A: YES. All settings are in customizer — edit anytime without touching code.

**Q: What if I want to change layout completely later?**
A: Just disable Orlaven sections, enable others. Code stays in files.

**Q: Will it work on free Shopify trial?**
A: YES. All Shopify plans support custom themes.

**Q: How to make it live?**
A: Once tested, click **Actions → Publish** on Orlaven theme.

---

## 🚀 You're Ready!

Follow this guide step-by-step. Each section is **independent** — no mixup possible.

Need help with **Phase 3 (Hero Section)**? Just ask! 🎯
