# 🚨 ORLAVEN — Horizon Theme Fix Guide
## Horizon theme ke liye SAHI tareeka

> **Problem:** Horizon Shopify ka **brand new theme (2024/2025)** hai jo **alag architecture** use karta hai (Blocks-based, not just Sections). Isi liye purana code error de raha tha.

> **Solution:** Horizon ki **built-in features** use karo + **custom blocks/sections** Horizon ke compatible format mein banao.

---

# 🎯 PHELE YEH SAMJHO — HORIZON KAISA HAI?

## Horizon vs Dawn (purana theme):

```
DAWN THEME (purana):
├── sections/        ← Big sections
├── snippets/
└── templates/

HORIZON THEME (naya):
├── sections/        ← Big page sections
├── blocks/          ← ⭐ NEW! Reusable blocks (yahan zyada kaam hota hai)
├── snippets/
└── templates/
```

**Important:**
- Horizon mein **Header, Footer, Announcement bar pehle se MOJOOD hain**
- Inhe **delete/replace nahi karna** — sirf **CUSTOMIZE** karna hai
- Apne extra sections sirf **homepage/page templates** mein add karne hain

---

# ✅ CORRECT APPROACH FOR HORIZON

## Phase 1: ANNOUNCEMENT BAR — Use Horizon's BUILT-IN

Horizon mein **announcement bar pehle se hai**! Bas **customize** karna hai.

### Step-by-Step:

**Step 1:** Shopify Admin mein jao
```
Online Store → Themes → Horizon (your theme) → Customize
```

**Step 2:** Top par announcement bar dikhaayi degi (already mojood)
```
┌──────────────────────────────────────────────┐
│  Welcome to our store                  [<>]  │  ← Yeh announcement bar hai
└──────────────────────────────────────────────┘
```

**Step 3:** Announcement bar par CLICK karo (left side panel mein)
- Aap dekhoge: **"Announcement bar"** section
- Ya **"Header" group** ke andar mil sakti hai

**Step 4:** Customize options mein yeh badlo:

```yaml
Background color:    #0A0A0A   (deep black)
Text color:          #FFFFFF   (white)
Show announcement:   ✅ ON

Announcement message 1:
  🚚 FREE SHIPPING ON ORDERS $100+ | 60-DAY RETURNS | CODE: ORLAVEN15 — 15% OFF

(Add more messages by clicking "Add announcement")

Announcement message 2:
  ⚡ NEW DROP: "Midnight Series" — Only 200 made | 67% SOLD | SHOP NOW

Announcement message 3:
  🏆 LIFETIME WARRANTY | ⭐ Rated 4.9/5 by 12,847 customers
```

**Step 5:** Auto-rotate aur close button enable karo (agar option ho)

**Step 6:** **Save** click karo

✅ **Done!** Announcement bar customized — koi error nahi.

---

## Phase 2: HEADER — Use Horizon's BUILT-IN

Same approach — Horizon ka built-in header **customize** karo.

### Step-by-Step:

**Step 1:** Customize mein **Header** section par click karo
```
Left panel:
  Header ▼
    └── (settings open hoti hain)
```

**Step 2:** Logo set karo:
```yaml
Logo:           Upload your Orlaven logo (or text)
Logo width:     150-200px
Logo position:  Center (best for split-screen look)
```

**Step 3:** Navigation menu set karo:

**FIRST** — Apna menu banao:
```
Online Store → Navigation → Add menu → "Main menu"

Menu items:
  - NEW       → /collections/new
  - MEN       → /collections/men
  - WOMEN     → /collections/women
  - CUSTOMIZE → /pages/custom
  - SALE      → /collections/sale
  - BRAND     → /pages/about
```

**THEN** — Header mein yeh menu select karo:
```yaml
Menu:           Main menu (selected)
Menu type:      Mega menu (or Dropdown)
```

**Step 4:** Color scheme set karo:
```yaml
Color scheme:   Cream background (#FAFAF5)
Text color:     Dark (#1A1A1A)
```

**Step 5:** Sticky header enable karo (scroll par fixed rahe):
```yaml
Sticky header:  ✅ ON
```

**Step 6:** Icons enable karo:
```yaml
Show search:     ✅
Show account:    ✅
Show cart:       ✅
Show wishlist:   ✅ (agar option ho)
```

**Step 7:** **Save** click karo

✅ **Done!** Header customized!

---

# 🎨 PHASE 1 + 2 KE BAAD AAPKA STORE AISA DIKHEGA

```
┌─────────────────────────────────────────────────────────────┐
│ 🚚 FREE SHIPPING $100+ | 60-DAY RETURNS | CODE: ORLAVEN15 │  ← Customized
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ NEW  MEN  WOMEN     [O R L A V E N]    CUSTOMIZE SALE BRAND  🔍 👤 🛒(0) │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 🚀 EXTRA STYLING (Optional — Agar customizer mein options nahi mil rahe)

Agar aapko aur **detailed styling** chahiye (jaise gold accent, pulsing dot on NEW), 
toh **theme.liquid mein custom CSS** add kar sakte hain.

## Step 1: Edit Code mein jao
```
Online Store → Themes → Horizon → Actions (⋮) → Edit code
```

## Step 2: `layout/theme.liquid` file open karo

## Step 3: `</head>` tag dhundo

## Step 4: Uske ABOVE yeh CSS paste karo:

```html
<style>
  /* ================================================
     ORLAVEN — Custom Horizon Styling
     ================================================ */

  /* Announcement Bar - Make text bold/styled */
  .announcement-bar,
  .announcement-bar-section,
  [class*="announcement"] {
    font-family: 'Inter', sans-serif !important;
    letter-spacing: 0.5px !important;
  }

  /* Make "ORLAVEN15" code stand out */
  .announcement-bar strong,
  .announcement-bar b {
    color: #C9A96E !important;
    font-weight: 600 !important;
  }

  /* Header - Make logo more luxurious */
  .header__logo,
  .header__heading-logo {
    font-family: 'Cormorant Garamond', Georgia, serif !important;
    letter-spacing: 6px !important;
    font-weight: 500 !important;
  }

  /* Navigation links - uppercase + spacing */
  .header__menu a,
  .header__inline-menu a,
  nav.header__menu a {
    font-family: 'Inter', sans-serif !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    letter-spacing: 1.5px !important;
    text-transform: uppercase !important;
  }

  /* SALE link in red */
  .header__menu a[href*="sale"],
  .header__inline-menu a[href*="sale"] {
    color: #C9302C !important;
    font-weight: 600 !important;
  }

  /* NEW link with gold pulsing dot */
  .header__menu a[href*="new"],
  .header__inline-menu a[href*="new"] {
    color: #C9A96E !important;
    font-weight: 600 !important;
    position: relative !important;
  }

  .header__menu a[href*="new"]::after,
  .header__inline-menu a[href*="new"]::after {
    content: '' !important;
    position: absolute !important;
    top: 50% !important;
    right: -12px !important;
    width: 6px !important;
    height: 6px !important;
    background-color: #C9A96E !important;
    border-radius: 50% !important;
    animation: orlavenPulse 2s infinite !important;
    transform: translateY(-50%) !important;
  }

  @keyframes orlavenPulse {
    0%, 100% { opacity: 1; transform: translateY(-50%) scale(1); }
    50% { opacity: 0.5; transform: translateY(-50%) scale(1.3); }
  }

  /* Smooth animated underline on nav hover */
  .header__menu a,
  .header__inline-menu a {
    position: relative !important;
    overflow: visible !important;
  }

  .header__menu a::before,
  .header__inline-menu a::before {
    content: '' !important;
    position: absolute !important;
    bottom: -2px !important;
    left: 0 !important;
    width: 0 !important;
    height: 1px !important;
    background-color: currentColor !important;
    transition: width 0.3s ease !important;
  }

  .header__menu a:hover::before,
  .header__inline-menu a:hover::before {
    width: 100% !important;
  }

  /* Cart badge styling */
  .header__icon--cart .cart-count-bubble,
  [class*="cart-count"] {
    background-color: #0A0A0A !important;
    color: #FFFFFF !important;
    font-weight: 600 !important;
  }

</style>
```

## Step 5: **Save** click karo

✅ Now your Horizon theme has Orlaven styling!

---

# 🎯 ORDER OF DEVELOPMENT (UPDATED FOR HORIZON)

```
Phase 1: Customize Horizon's BUILT-IN announcement bar  ✅
   ↓ (only customizer, no code)

Phase 2: Customize Horizon's BUILT-IN header             ✅
   ↓ (only customizer, no code)

Phase 3: Add custom CSS for premium styling              ✅
   ↓ (theme.liquid mein paste)

Phase 4: Hero Section — Custom block banayenge           ⏳
   ↓ (Horizon-compatible blocks/ format)

Phase 5: Trust Bar, Categories, etc.                     ⏳
```

---

# ❌ KYA KYA NAHI KARNA

```
❌ DON'T: Old "section" code paste karne ki koshish
   (Horizon mein "groups": ["header"] error deta hai)

❌ DON'T: theme.liquid ke main structure ko delete
   (Site break ho jayega)

❌ DON'T: Built-in announcement bar/header ko delete
   (Customize karo, replace nahi)

❌ DON'T: Editing without backup
   (Hamesha pehle theme duplicate karo)
```

---

# ✅ KYA KARNA HAI

```
✅ DO: Horizon ke built-in sections customize karo
✅ DO: Apna naya code BLOCKS folder mein add karo (Horizon style)
✅ DO: Custom CSS theme.liquid mein paste karo
✅ DO: Pehle backup banao
✅ DO: Preview mein test karo, phir publish
```

---

# 🆘 ERRORS — COMMON FIXES

## Error 1: "Section is not allowed in this group"
**Reason:** Horizon mein header group restricted hai
**Fix:** Schema mein `"enabled_on": {"groups": ["header"]}` HATA do
ya phir block format use karo (next phase mein dikhayenge)

## Error 2: "Invalid schema"
**Reason:** Horizon different schema syntax expect karta hai
**Fix:** Mera updated code use karo (yeh guide ke step follow karo)

## Error 3: "Section not appearing"
**Reason:** Preset missing
**Fix:** Schema ke end mein `"presets": [...]` ho

## Error 4: Theme break ho gaya
**Fix:**
```
Online Store → Themes → Backup theme → Actions → Publish
✅ Site instantly restored
```

---

# 📸 SCREENSHOTS LO HAR STEP PAR

Phase 1 ke baad: Screenshot
Phase 2 ke baad: Screenshot
CSS add karne ke baad: Screenshot

Aur mujhe bhejna! Main verify kar dunga sab sahi hua ya nahi.

---

# ⏭️ AB AAGE KYA?

1. ✅ Phase 1: Customize built-in announcement bar (15 min ka kaam)
2. ✅ Phase 2: Customize built-in header (15 min ka kaam)
3. ✅ Phase 3: Custom CSS paste karo (5 min)
4. 🚀 Phir bolna "Hero banao" → Main Horizon-compatible Hero section bhejunga

---

**Bhai, yeh approach simple aur error-free hai. Horizon ke built-in features use karo,
phir custom CSS se Orlaven branding add karo. Phir custom hero/sections add karenge step-by-step.**

🎯
