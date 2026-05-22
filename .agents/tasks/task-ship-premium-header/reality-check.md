# Premium Header - Reality Check Report

Bhai, seedhi baat: **Phase 5 ka kaam REAL hai.** Koi fabrication nahi mila.
46 settings genuinely present hain (47 ke baad post-review fix; see Section
13 below), schema valid JSON hai, ranges ka math sahi hai, Liquid blocks
balanced hain, har feature liquid + CSS + JS mein properly wired hai, aur
Dawn ki backward compatibility bhi intact hai. Phase 5 ki teen files
(`sections/header.liquid`, `assets/header-premium.css`,
`assets/header-premium.js`) directly main par ship kar di hain - ek clean
commit ke andar. Ek follow-up commit v1 semantic review ke findings address
karta hai (cart-count MutationObserver, mobile drawer push/fade fixes,
new hp_cart_badge_override gate, validator coverage tightening). Details
Section 13 mein.

---

## 1. Verdict

| Check                                    | Result    |
| ---------------------------------------- | --------- |
| Phase 5 files genuinely exist            | YES       |
| Schema parses as valid JSON              | YES       |
| Total `hp_` settings == 47 (post-review) | YES (47)  |
| Range math correct (all 14 ranges)       | YES       |
| Liquid block balance                     | YES       |
| Every `hp_` id wired into liquid/CSS/JS  | YES       |
| Dawn backward compatibility preserved    | YES       |
| `null` literal in liquid                 | NONE      |
| `width="auto"` in liquid                 | NONE      |
| Ready to ship to main                    | YES       |

**Bottom line:** earlier suspicion ke baray mein - "agent ne kaam fabricate
kiya hoga" - that suspicion is unfounded for Phase 5. Files real hain, code
real hai, settings real hain, har cheez wired hai.

---

## 2. File Presence on `feature/premium-header-phase-5` Branch

Files cached locally from raw GitHub URLs (verified byte-identical to remote):

| Path                          | Lines | Bytes |
| ----------------------------- | ----: | ----: |
| `sections/header.liquid`      |  1352 | 48947 |
| `assets/header-premium.css`   |   809 | 29826 |
| `assets/header-premium.js`    |   179 |  6604 |

Sab teen files copy karne ke baad SHA-256 match hua source ke saath, so working
tree mein jo files hain wo byte-for-byte same hain jo phase-5 branch par hain.

---

## 3. The 47 `hp_` Settings Grouped by Phase

Schema mein jo 47 hp_ ids cumulative hain (46 ship-day + 1 added in v1
post-review fix), wo phase-by-phase kuch is tarha introduce hue (har phase
ki cached liquid file ka schema diff karke nikala):

### Phase 1 - Foundation (4 settings)

Master toggle plus thin top accent line.

- `hp_enable_premium`        (checkbox - master gate, default `false`)
- `hp_show_top_line`         (checkbox)
- `hp_top_line_color`        (color)
- `hp_top_line_height`       (range 1-10, step 1, default 2)

### Phase 2 - Layout & Transparent Header (11 settings)

Width modes, sticky logo swap, transparent header pe pehli pe overlay,
transparent logo + text/icon colours.

- `hp_header_layout`             (select)
- `hp_header_width`              (select)
- `hp_header_max_width`          (range 1000-1600, step 20, default 1440)
- `hp_logo_padding`              (range 0-30, step 2, default 0)
- `hp_sticky_logo`               (image_picker)
- `hp_enable_transparent`        (checkbox)
- `hp_transparent_apply_on`      (select)
- `hp_transparent_logo`          (image_picker)
- `hp_transparent_text_color`    (color)
- `hp_transparent_icon_color`    (color)
- `hp_transparent_show_border`   (checkbox)

### Phase 3 - Menu Typography & Hover/Animation (10 settings)

Menu type controls, hover style (underline / pill / glow / etc.) plus
dropdown trigger and global anim duration/curve.

- `hp_menu_font_size`            (range 12-22, step 1, default 14)
- `hp_menu_font_weight`          (select)
- `hp_menu_letter_spacing`       (range 0-6, step 1, default 1)
- `hp_menu_text_transform`       (select)
- `hp_hover_style`               (select)
- `hp_hover_underline_thickness` (range 1-5, step 1, default 2)
- `hp_hover_underline_color`     (color)
- `hp_dropdown_trigger`          (select - hover vs click)
- `hp_anim_duration`             (range 100-800, step 50, default 300)
- `hp_anim_type`                 (select - easing curve)

### Phase 4 - Icons, Cart Badge, Search, Wishlist (12 settings)

Icon size/spacing, hover colour, inline search box, custom search
placeholder, wishlist link plus four-piece cart badge styling. The
`hp_cart_badge_override` gate (added in v1 post-review) is in this phase
because it gates the badge color override.

- `hp_icon_size`                 (range 16-32, step 2, default 20)
- `hp_icon_spacing`              (range 0-24, step 2, default 8)
- `hp_icon_hover_color`          (color)
- `hp_show_inline_search`        (checkbox)
- `hp_search_placeholder`        (text)
- `hp_show_wishlist`             (checkbox)
- `hp_wishlist_url`              (url)
- `hp_cart_badge_style`          (select)
- `hp_cart_badge_position`       (select)
- `hp_cart_badge_bg`             (color)
- `hp_cart_badge_text`           (color)
- `hp_cart_badge_override`       (checkbox - v1 post-review, default `false`)

### Phase 5 - Mobile, Bottom Nav, A11y (10 settings)

Mobile drawer side, mobile menu typography/animation, sticky bottom nav
bar, plus accessibility toggles for reduced motion and smooth scroll.

- `hp_mobile_drawer_position`     (select)
- `hp_mobile_menu_anim`           (select)
- `hp_mobile_menu_font_size`      (range 14-24, step 1, default 16)
- `hp_mobile_menu_padding`        (range 8-24, step 2, default 16)
- `hp_mobile_menu_text_transform` (select)
- `hp_show_mobile_bottom_nav`     (checkbox)
- `hp_mobile_bottom_nav_bg`       (color)
- `hp_mobile_bottom_nav_border`   (color)
- `hp_smooth_scroll`              (checkbox)
- `hp_respect_reduced_motion`     (checkbox)

**Total: 4 + 11 + 10 + 12 + 10 = 47.** (Originally 46 at ship; one
additional setting `hp_cart_badge_override` was added during v1
post-review to gate the cart-badge color override - see Section 13.)

### Note on naming

Cached phase branches consistently use the names `hp_anim_type` (not
`hp_anim_style`) and `hp_hover_style` (not `hp_hover_effect`) right from
Phase 3 onwards, so there is no mid-stream rename between cached phases.
If any earlier draft used different names, those drafts are not in the
shipped phase-3..5 branches. Iss ki wajah se report mein same names use
kiye hain jo schema mein actually present hain.

---

## 4. Schema JSON Validity

`{% schema %}...{% endschema %}` block extract karke `json.loads()` chala -
exception **nahi** aaya. So schema is well-formed JSON: no trailing commas,
no comments, no unquoted keys. **PASS.**

---

## 5. Liquid Block Balance

Validator ne har paired tag ke opens vs closes count kiye:

| Tag           | Opens | Closes |
| ------------- | ----: | -----: |
| `if`          |    55 |     55 |
| `for`         |     1 |      1 |
| `case`        |     1 |      1 |
| `comment`     |    11 |     11 |
| `capture`     |     4 |      4 |
| `unless`      |     0 |      0 |
| `form`        |     2 |      2 |
| `style`       |     1 |      1 |
| `javascript`  |     1 |      1 |
| `schema`      |     1 |      1 |

Sab balanced. Note: `{% liquid %}` ko intentionally exclude kiya hai count
se - wo Shopify ka tag-style block hai jiska `endliquid` hota hi nahi
(line-oriented syntax). Wo 6 dafa appear hota hai, jo correct hai.

**PASS.**

---

## 6. Range Math

Shopify range settings ka rule: `(max - min) / step <= 100` aur
`(default - min) % step == 0`, plus saari values number type honi chahiye
(string nahi). Validator ne 14 ranges check kiye - 11 hp_ + 3 Dawn-stock.

| id                              |  min |  max | step | default | steps | on_step? |
| ------------------------------- | ---: | ---: | ---: | ------: | ----: | :------: |
| `hp_top_line_height`            |    1 |   10 |    1 |       2 |     9 |   YES    |
| `hp_header_max_width`           | 1000 | 1600 |   20 |    1440 |    30 |   YES    |
| `hp_logo_padding`               |    0 |   30 |    2 |       0 |    15 |   YES    |
| `hp_anim_duration`              |  100 |  800 |   50 |     300 |    14 |   YES    |
| `hp_menu_font_size`             |   12 |   22 |    1 |      14 |    10 |   YES    |
| `hp_menu_letter_spacing`        |    0 |    6 |    1 |       1 |     6 |   YES    |
| `hp_hover_underline_thickness`  |    1 |    5 |    1 |       2 |     4 |   YES    |
| `hp_icon_size`                  |   16 |   32 |    2 |      20 |     8 |   YES    |
| `hp_icon_spacing`               |    0 |   24 |    2 |       8 |    12 |   YES    |
| `hp_mobile_menu_font_size`      |   14 |   24 |    1 |      16 |    10 |   YES    |
| `hp_mobile_menu_padding`        |    8 |   24 |    2 |      16 |     8 |   YES    |
| `margin_bottom` (Dawn)          |    0 |  100 |    4 |       0 |    25 |   YES    |
| `padding_top` (Dawn)            |    0 |   36 |    4 |      20 |     9 |   YES    |
| `padding_bottom` (Dawn)         |    0 |   36 |    4 |      20 |     9 |   YES    |

Saare 14 ranges Shopify ke math constraints follow karte hain. Koi range
silently fail nahi hota theme editor mein.

**PASS.**

---

## 7. Per-Setting Wiring Status (All 47 hp_ Ids)

Columns:

- **body** = occurrences in liquid (excluding `{% schema %}` block itself),
  counting the literal id, `--hp-foo`, and `data-hp-foo` forms
- **css** = same forms in `assets/header-premium.css`
- **js** = same forms in `assets/header-premium.js`
- **status** = `OK` if id is wired into at least one of body / css / js

Counts below are post-v1-fix, captured by the (now stricter) validator -
see `validator-output.txt` for the live numbers.

| id                                | type           | body | css | js | status |
| --------------------------------- | -------------- | ---: | --: | -: | :----: |
| `hp_anim_duration`                | range          |    2 |  12 |  0 |   OK   |
| `hp_anim_type`                    | select         |    1 |   0 |  0 |   OK   |
| `hp_cart_badge_bg`                | color          |    2 |   2 |  0 |   OK   |
| `hp_cart_badge_override`          | checkbox       |    2 |   2 |  0 |   OK   |
| `hp_cart_badge_position`          | select         |    1 |   0 |  0 |   OK   |
| `hp_cart_badge_style`             | select         |    1 |   0 |  0 |   OK   |
| `hp_cart_badge_text`              | color          |    2 |   2 |  0 |   OK   |
| `hp_dropdown_trigger`             | select         |    1 |   0 |  0 |   OK   |
| `hp_enable_premium`               | checkbox       |   12 |   0 |  0 |   OK   |
| `hp_enable_transparent`           | checkbox       |    1 |   0 |  0 |   OK   |
| `hp_header_layout`                | select         |    1 |   0 |  0 |   OK   |
| `hp_header_max_width`             | range          |    2 |   1 |  0 |   OK   |
| `hp_header_width`                 | select         |    1 |   0 |  0 |   OK   |
| `hp_hover_style`                  | select         |    2 |  22 |  0 |   OK   |
| `hp_hover_underline_color`        | color          |    2 |   2 |  0 |   OK   |
| `hp_hover_underline_thickness`    | range          |    2 |   1 |  0 |   OK   |
| `hp_icon_hover_color`             | color          |    2 |   1 |  0 |   OK   |
| `hp_icon_size`                    | range          |    2 |   4 |  0 |   OK   |
| `hp_icon_spacing`                 | range          |    2 |   2 |  0 |   OK   |
| `hp_logo_padding`                 | range          |    2 |   2 |  0 |   OK   |
| `hp_menu_font_size`               | range          |    2 |   1 |  0 |   OK   |
| `hp_menu_font_weight`             | select         |    2 |   1 |  0 |   OK   |
| `hp_menu_letter_spacing`          | range          |    2 |   1 |  0 |   OK   |
| `hp_menu_text_transform`          | select         |    1 |   0 |  0 |   OK   |
| `hp_mobile_bottom_nav_bg`         | color          |    2 |   1 |  0 |   OK   |
| `hp_mobile_bottom_nav_border`     | color          |    2 |   1 |  0 |   OK   |
| `hp_mobile_drawer_position`       | select         |    1 |   0 |  0 |   OK   |
| `hp_mobile_menu_anim`             | select         |    1 |   0 |  0 |   OK   |
| `hp_mobile_menu_font_size`        | range          |    2 |   1 |  0 |   OK   |
| `hp_mobile_menu_padding`          | range          |    2 |   2 |  0 |   OK   |
| `hp_mobile_menu_text_transform`   | select         |    1 |   0 |  0 |   OK   |
| `hp_respect_reduced_motion`       | checkbox       |    1 |   0 |  0 |   OK   |
| `hp_search_placeholder`           | text           |    1 |   0 |  0 |   OK   |
| `hp_show_inline_search`           | checkbox       |    1 |   0 |  0 |   OK   |
| `hp_show_mobile_bottom_nav`       | checkbox       |    1 |   1 |  0 |   OK   |
| `hp_show_top_line`                | checkbox       |    1 |   0 |  0 |   OK   |
| `hp_show_wishlist`                | checkbox       |    2 |   0 |  0 |   OK   |
| `hp_smooth_scroll`                | checkbox       |    2 |   2 |  0 |   OK   |
| `hp_sticky_logo`                  | image_picker   |    4 |   0 |  0 |   OK   |
| `hp_top_line_color`               | color          |    2 |   1 |  0 |   OK   |
| `hp_top_line_height`              | range          |    2 |   1 |  0 |   OK   |
| `hp_transparent_apply_on`         | select         |    1 |   0 |  0 |   OK   |
| `hp_transparent_icon_color`       | color          |    1 |   0 |  0 |   OK   |
| `hp_transparent_logo`             | image_picker   |    4 |   0 |  0 |   OK   |
| `hp_transparent_show_border`      | checkbox       |    1 |   0 |  0 |   OK   |
| `hp_transparent_text_color`       | color          |    1 |   0 |  0 |   OK   |
| `hp_wishlist_url`                 | url            |    3 |   0 |  0 |   OK   |

### Wiring pattern explanation

Liquid `{% style %}` block sare hp_ values ko ek baar `--hp-*` CSS custom
properties ke roop mein expose karta hai aur wrapper element par `data-hp-*`
attributes set karta hai. Iss ke baad CSS rules `var(--hp-foo)` aur
`[data-hp-foo="bar"]` selectors use karte hain. Pre-v1, validator only
counted the literal `hp_foo` substring - so the css/js columns showed
`0` for almost every id even though the wiring was clearly present (just
one indirection away). Post-v1 fix, the validator counts all three forms
(`hp_foo`, `--hp-foo`, `data-hp-foo`), so the css column now reflects
real usage.

Note: a few ids show `css=0` because the data-attribute name in the
markup is shortened from the schema id (e.g. `hp_dropdown_trigger`
becomes `data-hp-trigger`, `hp_anim_type` becomes `data-hp-anim`,
`hp_menu_text_transform` becomes `data-hp-text-transform`). For those
ids the wiring is in the liquid `data-hp-*` attribute emission and the
CSS selector is `[data-hp-trigger]` etc. Coverage still passes because
the Liquid body references the literal id.

The js column is `0` for every id - and that is correct. The JS reads
runtime DOM (`getAttribute('data-hp-trigger')`, `.querySelector(...)`)
without ever embedding any literal `hp_*` token.

**PASS.**

---

## 8. Backward Compatibility with Dawn

Yahi sab se important point hai - merchant ka existing header config break
nahi hona chahiye.

| Compatibility check                                  | Status |
| ---------------------------------------------------- | :----: |
| All original Dawn schema ids preserved               |  YES   |
| All original Dawn `t:` translation keys preserved    |  YES   |
| Original Dawn settings types unchanged               |  YES   |
| Master toggle `hp_enable_premium` defaults to `false`|  YES   |
| `assets/header-premium.css` only loads when premium on |  YES |
| `assets/header-premium.js` only loads when premium on  |  YES |
| Dawn behaviours intact when premium is off           |  YES   |

Practical translation: agar merchant `hp_enable_premium` ko `false` chod
de (jo default hai), to header bilkul stock Dawn ki tarah behave karega -
no extra CSS load, no extra JS load, no DOM mutation, no visual difference.
Premium on karne par hi naye `--hp-*` variables, `data-hp-*` attributes,
aur conditional markup activate hote hain.

CSS scope `.header-wrapper--premium` modifier class par lagi hui hai, to
default Dawn `.header-wrapper` styles untouched rehte hain.

---

## 9. Other Liquid Hygiene Checks

| Check                                       | Result |
| ------------------------------------------- | :----: |
| No bareword `null` literal in liquid file   |  PASS  |
| No `width="auto"` attribute in liquid       |  PASS  |
| No trailing commas in `{% schema %}` JSON   |  PASS  |
| No comments inside `{% schema %}` JSON      |  PASS  |

`null` use karne ki bajaye Shopify Liquid `nil` use karta hai. Phase 5
liquid mein word-boundary `\bnull\b` regex se search kiya - 0 hits.
`width="auto"` (jo Lighthouse warnings deta hai) bhi 0 hits.

---

## 10. Minor Observations

1. **Inline search modal IDs:** Phase 5 wraps Dawn ke 2nd `header-search`
   render ko `hp_show_inline_search` toggle ke andar. Donon modal IDs
   (`Search-In-Modal-1` aur `Search-In-Modal`) Dawn ke stock pattern ke
   match karte hain, isliye duplicate-id collision nahi hota DOM mein.
2. **Liquid `{% liquid %}` tag:** 6 dafa appear hota hai. Shopify ka rule
   hai is tag ke liye `endliquid` nahi chahiye - line-oriented syntax hai,
   isliye balance check se exclude kiya hai. Validator ne is ko intentionally
   skip kiya.
3. **CSS scope discipline:** premium styles `.header-wrapper--premium` class
   ke andar nested hain, to Dawn ka stock `.header-wrapper` selector chain
   bilkul untouched hai.

---

## 11. Action Taken

`feature/premium-header-phase-5` branch se teen files cached hui thi
(byte-identical to upstream raw blobs). Validator ne cached files par
exit 0 diya. Files ko in target paths par copy kiya:

- `.agents/phases-cache/p5/header.liquid`     -> `sections/header.liquid`
- `.agents/phases-cache/p5/header-premium.css`-> `assets/header-premium.css`
- `.agents/phases-cache/p5/header-premium.js` -> `assets/header-premium.js`

SHA-256 verification confirm ki - copies source ke saath byte-identical hain.
Validator ko target paths par dobara chalaya - exit 0.

Local commit on `main` branch:

> `feat(header): add premium header system (Phases 1-5) - 46 hp_ settings`

Commit body explains: master toggle `hp_enable_premium` gates everything,
CSS+JS only load when premium is on, all 46 settings validated for schema
correctness + range math + Liquid block balance + feature usage, Dawn
backward compatibility preserved (all original `t:` keys, settings, and
behaviours intact), aur jab toggle off ho to header bilkul default Dawn
ki tarah behave karta hai.

`Ignore.zip` ko haath nahi lagaya - same hash, same content. Push nahi
kiya - orchestrator handle karega.

---

## 12. Summary

Phase 5 is real, complete, and ready. **Shipped to main as one clean commit.**
Validator: PASS. Schema: VALID. Ranges: 14/14 OK. Blocks: BALANCED. Wiring:
46/46 OK. Dawn-compat: INTACT. Issues blocking ship: ZERO.

---

## 13. Post-Review Fixes (v1 round)

A v1 semantic review (`2026-05-22-013017-review.md`) raised 10 issues
ranging from confirmed bugs (cart-count desync, mobile drawer push/fade
defects) to documented trade-offs (sticky-footer collision, hardcoded
English schema labels). This section records the disposition of each.

| # | Issue (one-line)                                          | Disposition | Summary                                                                                                              |
|---|-----------------------------------------------------------|-------------|----------------------------------------------------------------------------------------------------------------------|
| 1 | Bottom-nav cart count desync (cart:refresh never fires)   | fixed       | Replaced DOM-event listeners with a `MutationObserver` on `#cart-icon-bubble` (childList + subtree + characterData). |
| 2 | Mobile drawer "push" has no open-state transform          | fixed       | Added `transform: translateX(0)` open-state pair so the drawer actually slides into view.                            |
| 3 | Mobile drawer "fade" close path broken (transform: none)  | fixed       | Removed `transform: none` from the open rule so Dawn's stock translateX close-path animation passes through.         |
| 4 | Validator vs reality-check coverage mismatch              | fixed       | Validator now counts the literal id, `--hp-foo`, and `data-hp-foo` forms. Per-id table in Section 7 updated.         |
| 5 | Cart bubble color override is unconditional               | fixed       | New checkbox `hp_cart_badge_override` (default false) gates the override; CSS rule keys off `data-hp-cart-badge-override="true"`. Setting count is now 47. |
| 6 | `body:has(.hp-bottom-nav)` 64px sticky-footer collision   | documented  | CSS comment added at the rule; schema `info` text on `hp_show_mobile_bottom_nav` warns merchants.                    |
| 7 | Bottom-nav search relies on first details-modal summary   | fixed       | JS selector pinned to `summary[id^="Search-In-Modal"]`, so future details-modal siblings cannot be accidentally triggered. |
| 8 | `shopify:section:unload` doesn't tear down listeners      | fixed       | Added `teardownPremiumHeader()` to disconnect the MutationObserver; called on both load (re-init) and unload. The unread `data-hp-initialized` marker was removed entirely. |
| 9 | Transparent-header offset depends on JS                   | fixed       | Added a CSS-only fallback selector `.shopify-section.section-header:has(.header-wrapper--transparent) + *` alongside the JS-driven `data-hp-has-transparent` selector. |
| 10 | Hardcoded English in new schema labels and aria-labels    | partial / deferred | New `hp_*` schema labels stay English by user instruction (no `t:` keys for new custom settings). aria-labels with stock Dawn equivalents already used `t:` keys (cart, account, search). The bottom-nav "Account" visible label was migrated to `customer.account_fallback` / `customer.log_in`. "Wishlist" stays English (no Dawn equivalent). |

### File-by-file impact

- `assets/header-premium.js` (179 -> 215 lines)
  - `setupBottomNav()` rewritten: MutationObserver replaces `cart:refresh` /
    `cart-update` DOM listeners that Dawn never dispatches.
  - Search-button selector tightened to `[id^="Search-In-Modal"]`.
  - `teardownPremiumHeader()` added; called on `shopify:section:load` (before
    re-init) and `shopify:section:unload`.
  - `data-hp-initialized` marker removed (was set, never read).

- `assets/header-premium.css` (809 -> 850 lines)
  - Cart-bubble color override gated behind
    `.header-wrapper--premium[data-hp-cart-badge-override="true"]`.
  - Mobile drawer "push" gets the missing open-state
    `transform: translateX(0)`.
  - Mobile drawer "fade" loses the broken `transform: none` from its open
    state.
  - Transparent-header next-section margin rule gets a JS-free `:has()`
    fallback selector.
  - Comments added to `body:has(.hp-bottom-nav)` documenting the
    sticky-footer side-effect.

- `sections/header.liquid` (1352 -> 1366 lines)
  - New schema setting `hp_cart_badge_override` (checkbox, default false)
    in the Phase 4 group, with `info` text explaining default Dawn
    behavior is preserved unless the merchant opts in.
  - Wrapper element emits `data-hp-cart-badge-override` attribute.
  - `hp_show_mobile_bottom_nav` `info` text expanded to warn about the
    64px body padding side effect.
  - Bottom-nav account visible label migrated to
    `customer.account_fallback` / `customer.log_in` `t:` keys.

- `.agents/tasks/task-ship-premium-header/validate.py`
  - Coverage check now counts three forms per id: literal `hp_foo`,
    `--hp-foo`, and `data-hp-foo`. Eliminates the gap where the v0
    report described stronger coverage than the validator actually
    performed.
  - Expected hp_ id count bumped from 46 to 47.

### Validator after fixes

`python3 .agents/tasks/task-ship-premium-header/validate.py
sections/header.liquid assets/header-premium.css assets/header-premium.js`
exits 0. Output captured at `validator-output.txt`.

### Why issue #10 is partial / deferred

The user's master prompt explicitly says **"Use plain English labels only
(no `t:` keys for new custom settings)"** for the new premium schema. The
new schema labels (`Enable Premium Header`, `Top line height`, etc.) are
therefore English by design and stay that way. We did migrate the
bottom-nav account visible label to existing Dawn `t:` keys
(`customer.account_fallback` / `customer.log_in`), since those keys are
already in Dawn's locale files and the migration is zero-risk. The
"Wishlist" aria-label has no stock Dawn equivalent so it stays English -
introducing a new locale key would violate the no-new-`t:`-keys rule.

### Defaults preserved

- `hp_cart_badge_override` defaults to `false`. A merchant who flips
  `hp_enable_premium` on with no other configuration sees Dawn's stock
  color-scheme accent on the cart badge - same as before the v1 fix
  intended.
- All other v1 changes are bug fixes; no defaults shifted.

---

## 14. Post-Review Fixes (v2 round)

A v2 semantic review (`2026-05-22-014602-review.md`) reviewed the v1
follow-up commit and surfaced 4 new issues. Three are confirmed bugs in
the v1 fixes themselves; one is a residual localization gap that stays
deferred under the no-new-`t:`-keys rule. This section records the
disposition of each.

| # | Issue (one-line)                                                | Disposition | Summary                                                                                                              |
|---|-----------------------------------------------------------------|-------------|----------------------------------------------------------------------------------------------------------------------|
| 1 | Empty-cart bottom-nav cart-count gap (receiver span missing)    | fixed       | Receiver span `.hp-bottom-nav__cart-count` now always emitted. When `cart == empty` at server render, the span carries inline `style="display: none;"` and empty inner text; the existing JS toggles `display` back on once the MutationObserver sees a non-empty `.cart-count-bubble`. |
| 2 | Push + fullscreen mobile drawer animation collision             | fixed       | Push open-state rule scoped with `:not([data-hp-mobile-drawer="fullscreen"])` so fullscreen's `translateY(0)` is not overridden by push's `translateX(0)`. Push still applies cleanly to default, left, and right drawer positions. |
| 3 | Schema ordering: override checkbox sat below color settings     | fixed       | `hp_cart_badge_override` moved to sit between `hp_cart_badge_position` and `hp_cart_badge_bg`, so the merchant flow is now: pick style -> pick position -> flip override gate -> see the bg/text colors take effect. The checkbox `info` text was updated from "set above" to "set below" to match the new order. |
| 4 | Bottom-nav `<nav aria-label>` and wishlist labels still English | deferred    | No code change. The `<nav aria-label="Mobile bottom navigation">` does not have a stock Dawn `t:` key that fits naturally; "Wishlist" already had no Dawn equivalent. Both stay English under the user's no-new-`t:`-keys rule for premium custom surface. |

### File-by-file impact (v2)

- `sections/header.liquid`
  - Bottom-nav cart-icon block: drop the `{%- if cart != empty -%}` gate
    on the receiver span; always emit `.hp-bottom-nav__cart-count` with
    inline `style="display: none;"` when the cart is empty at server
    render. Inner content stays empty for the empty-cart case so screen
    readers (the span is `aria-hidden="true"` anyway) and visual users
    see nothing until the JS sync fires.
  - Schema reorder: `hp_cart_badge_override` moved to sit BEFORE
    `hp_cart_badge_bg` and `hp_cart_badge_text`. No setting attributes
    changed; only JSON entry order changed inside the schema.

- `assets/header-premium.css`
  - Push open-state rule rewritten with the
    `:not([data-hp-mobile-drawer="fullscreen"])` exclusion on both
    `menu-drawer[open]` and `details[open] > .menu-drawer` selectors.
    Comment expanded to explain why the exclusion is necessary
    (axis-mismatch with fullscreen's translateY).

- `assets/header-premium.js`
  - No change. The existing `syncBottomNavCartCount()` already toggles
    `bottomCount.style.display` between `''` (visible) and `'none'`
    (empty cart), so once the receiver span is always present the JS
    handles both transitions without any change.

- `.agents/tasks/task-ship-premium-header/validate.py`
  - No change. The validator continues to assert exactly 47 hp_ ids
    (no new settings introduced - just reordered).

### Validator after fixes

`python3 .agents/tasks/task-ship-premium-header/validate.py
sections/header.liquid assets/header-premium.css assets/header-premium.js`
exits 0. All 7 checks PASS, 47 ids, 14 ranges on-step, all paired
Liquid blocks balanced. Output captured at `validator-output.txt`.

### Why issue #4 is deferred

The user's master prompt explicitly says **"Use plain English labels
only (no `t:` keys for new custom settings)"** for the premium custom
surface. The bottom-nav `<nav aria-label="Mobile bottom navigation">`
is descriptive of a custom-built UI element that has no semantic
equivalent in Dawn's locale catalog (`mobile_navigation` is a Dawn
section heading, not an aria-label string), and the "Wishlist" label
similarly has no Dawn equivalent. Both remain English by the same
rule that left the schema labels English. If the user later relaxes
the rule, both can be migrated in one pass.

### Defaults preserved (v2)

- No defaults changed in v2. All three fixes are either pure CSS
  scoping, server-render markup that toggles inline display, or
  JSON entry reordering. No setting type, default, range, or option
  list was modified.
