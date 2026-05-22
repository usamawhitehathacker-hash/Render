#!/usr/bin/env python3
"""
Mega Navigation validator.

Usage:
    python3 validate-mega-nav.py <mega-navigation.liquid> <mega-navigation.css> <mega-navigation.js> <mega-nav-column.liquid> <mega-nav-promo.liquid>

Checks:
  1. {% schema %}...{% endschema %} block extracts and json.loads cleanly.
  2. Collects all mn_* ids from schema settings + blocks. Asserts count in range 35-50.
  3. For every type=="range" entry: min/max/step/default are numbers (not str),
     step is integer, (max-min)/step <= 100, (default-min) % step == 0.
  4. Liquid block balance in ALL .liquid files: count open vs end tags for
     [if, for, case, comment, capture, unless, form, style, javascript, schema].
  5. Each mn_ id appears at least once in
     (liquid body minus schema) + css + js + snippet files,
     counting literal token (mn_foo) AND CSS var form (--mn-foo) AND
     data attribute form (data-mn-foo).
  6. No bareword 'null' in any liquid file (use 'nil').
  7. No width="auto" in any liquid file.
  8. No trailing commas in schema JSON (checked by attempting parse).
  9. {% render %} calls in main liquid only pass primitives (no object variables
     like linklist, collection, product, etc.)
  10. Snippet files use linklists[...] pattern (not receive linklist object).
  11. No emojis in schema header content values.
  12. No "tag" or "class" keys at schema root level.
  13. SVGs have xmlns attribute.
  14. Schema settings use plain English labels (no t: keys for mn_ settings).
  15. Color override settings gated by checkbox (check that mn_use_custom_color
      exists as a checkbox in block settings).

Exit 0 = ALL CHECKS PASS. Exit 1 on any failure.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


SCHEMA_RE = re.compile(
    r"\{%-?\s*schema\s*-?%\}(.*?)\{%-?\s*endschema\s*-?%\}",
    re.DOTALL,
)

LIQUID_TAGS_WITH_END = [
    "if",
    "for",
    "case",
    "comment",
    "capture",
    "unless",
    "form",
    "style",
    "javascript",
    "schema",
]

# Common Shopify objects that should not be passed to render
SHOPIFY_OBJECTS = [
    "linklist", "linklists", "collection", "collections",
    "product", "products", "cart", "customer", "shop",
    "page", "blog", "article", "section", "block",
]

EMOJI_RE = re.compile(
    "["
    "\U0001F600-\U0001F64F"
    "\U0001F300-\U0001F5FF"
    "\U0001F680-\U0001F6FF"
    "\U0001F1E0-\U0001F1FF"
    "\U00002702-\U000027B0"
    "\U000024C2-\U0001F251"
    "]+",
    flags=re.UNICODE,
)

failures = []


def fail(msg: str) -> None:
    failures.append(msg)


def collect_mn_ids(node, ids):
    """Recursively walk a schema node collecting mn_* ids from settings arrays."""
    if isinstance(node, dict):
        sid = node.get("id")
        if isinstance(sid, str) and sid.startswith("mn_"):
            ids.add(sid)
        for v in node.values():
            collect_mn_ids(v, ids)
    elif isinstance(node, list):
        for item in node:
            collect_mn_ids(item, ids)


def collect_range_entries(node, ranges):
    """Recursively collect every dict whose type == 'range'."""
    if isinstance(node, dict):
        if node.get("type") == "range":
            ranges.append(node)
        for v in node.values():
            collect_range_entries(v, ranges)
    elif isinstance(node, list):
        for item in node:
            collect_range_entries(item, ranges)


def collect_settings_with_labels(node, settings):
    """Collect all settings dicts that have a label."""
    if isinstance(node, dict):
        if "label" in node and "id" in node:
            settings.append(node)
        for v in node.values():
            collect_settings_with_labels(v, settings)
    elif isinstance(node, list):
        for item in node:
            collect_settings_with_labels(item, settings)


def check_render_primitives(liquid_text: str) -> list[str]:
    """Check that render tags only pass primitive values."""
    issues = []
    # Match {% render 'snippet' ... %} or {% render "snippet" ... %}
    render_re = re.compile(r"\{%-?\s*render\s+['\"]([^'\"]+)['\"](.*?)-?%\}", re.DOTALL)
    for m in render_re.finditer(liquid_text):
        snippet_name = m.group(1)
        params = m.group(2)
        # Check for passing known Shopify objects directly
        for obj in SHOPIFY_OBJECTS:
            # Pattern: varname: object_name (where object_name is a known Shopify object)
            obj_pass_re = re.compile(r":\s*\b" + obj + r"\b(?!\[)")
            if obj_pass_re.search(params):
                issues.append(
                    f"render '{snippet_name}' may pass full object '{obj}' - "
                    f"use primitives or linklists[handle] pattern"
                )
    return issues


def main() -> int:
    if len(sys.argv) != 6:
        print("usage: validate-mega-nav.py <mega-navigation.liquid> <mega-navigation.css> <mega-navigation.js> <mega-nav-column.liquid> <mega-nav-promo.liquid>")
        return 2

    liquid_path = Path(sys.argv[1])
    css_path = Path(sys.argv[2])
    js_path = Path(sys.argv[3])
    col_snippet_path = Path(sys.argv[4])
    promo_snippet_path = Path(sys.argv[5])

    all_paths = [liquid_path, css_path, js_path, col_snippet_path, promo_snippet_path]
    for p in all_paths:
        if not p.is_file():
            fail(f"file not found: {p}")

    if failures:
        for f in failures:
            print(f"FAIL: {f}")
        return 1

    liquid_text = liquid_path.read_text(encoding="utf-8")
    css_text = css_path.read_text(encoding="utf-8")
    js_text = js_path.read_text(encoding="utf-8")
    col_text = col_snippet_path.read_text(encoding="utf-8")
    promo_text = promo_snippet_path.read_text(encoding="utf-8")

    all_liquid_texts = [
        (liquid_path.name, liquid_text),
        (col_snippet_path.name, col_text),
        (promo_snippet_path.name, promo_text),
    ]

    print("=" * 72)
    print("MEGA NAVIGATION VALIDATOR")
    print("=" * 72)
    print(f"liquid  : {liquid_path}  ({len(liquid_text)} bytes)")
    print(f"css     : {css_path}  ({len(css_text)} bytes)")
    print(f"js      : {js_path}  ({len(js_text)} bytes)")
    print(f"col snip: {col_snippet_path}  ({len(col_text)} bytes)")
    print(f"promo   : {promo_snippet_path}  ({len(promo_text)} bytes)")
    print()

    # 1. Extract schema block
    m = SCHEMA_RE.search(liquid_text)
    if not m:
        fail("could not locate {% schema %}...{% endschema %} block")
        for f in failures:
            print(f"FAIL: {f}")
        return 1
    schema_text = m.group(1)
    schema_region = m.group(0)
    liquid_body_text = liquid_text.replace(schema_region, "")

    # 2. Parse schema JSON
    try:
        schema = json.loads(schema_text)
    except json.JSONDecodeError as e:
        fail(f"schema JSON invalid: {e}")
        for f in failures:
            print(f"FAIL: {f}")
        return 1
    print("[1] schema JSON parses cleanly                            : PASS")

    # 3. Check no "tag" or "class" at schema root
    if "tag" in schema:
        fail("schema root has 'tag' key - this can cause conflicts")
    if "class" in schema:
        fail("schema root has 'class' key - this can cause conflicts")
    if not failures:
        print("[2] no tag/class at schema root                           : PASS")
    else:
        print("[2] no tag/class at schema root                           : FAIL")

    # 4. Collect mn_ ids
    mn_ids: set[str] = set()
    collect_mn_ids(schema, mn_ids)
    if len(mn_ids) < 35:
        fail(f"expected 35-50 mn_ ids, got {len(mn_ids)} (too few): {sorted(mn_ids)}")
    elif len(mn_ids) > 50:
        fail(f"expected 35-50 mn_ ids, got {len(mn_ids)} (too many): {sorted(mn_ids)}")
    if not any("mn_" in f for f in failures):
        print(f"[3] mn_ id count in range 35-50                          : PASS ({len(mn_ids)} unique)")
    else:
        print(f"[3] mn_ id count in range 35-50                          : FAIL ({len(mn_ids)} unique)")

    # 5. Range math
    ranges = []
    collect_range_entries(schema, ranges)
    range_rows = []
    for r in ranges:
        rid = r.get("id", "<no-id>")
        for k in ("min", "max", "step", "default"):
            if k not in r:
                fail(f"range {rid}: missing key '{k}'")
                continue
            v = r[k]
            if isinstance(v, bool) or not isinstance(v, (int, float)):
                fail(f"range {rid}: '{k}' must be number, got {type(v).__name__} ({v!r})")
        # Check step is integer
        if "step" in r:
            step_val = r["step"]
            if isinstance(step_val, float) and step_val != int(step_val):
                fail(f"range {rid}: step must be integer, got {step_val}")
        if any(k not in r for k in ("min", "max", "step", "default")):
            continue
        mn, mx, st, df = r["min"], r["max"], r["step"], r["default"]
        if not all(isinstance(x, (int, float)) and not isinstance(x, bool) for x in (mn, mx, st, df)):
            continue
        steps = (mx - mn) / st if st else float("inf")
        if steps > 100:
            fail(f"range {rid}: (max-min)/step = {steps} > 100")
        rem = (df - mn) % st
        if abs(rem) > 1e-9 and abs(rem - st) > 1e-9:
            fail(f"range {rid}: (default-min) % step = {rem} != 0  (min={mn} max={mx} step={st} default={df})")
        range_rows.append((rid, mn, mx, st, df, steps, rem))

    if not any("range" in f for f in failures):
        print(f"[4] range math (min/max/step/default sane)                : PASS ({len(ranges)} ranges)")
    else:
        print(f"[4] range math                                            : FAIL")

    # 6. Liquid block balance (ALL liquid files)
    balance_rows = []
    for fname, ltext in all_liquid_texts:
        for tag in LIQUID_TAGS_WITH_END:
            open_re = re.compile(r"\{%-?\s*" + tag + r"\b")
            close_re = re.compile(r"\{%-?\s*end" + tag + r"\b")
            opens = len(open_re.findall(ltext))
            closes = len(close_re.findall(ltext))
            balance_rows.append((fname, tag, opens, closes))
            if opens != closes:
                fail(f"liquid balance ({fname}): {tag}: {opens} opens vs {closes} closes")

    if not any("balance" in f for f in failures):
        print("[5] liquid block balance (all paired tags, all files)      : PASS")
    else:
        print("[5] liquid block balance                                   : FAIL")

    # 7. mn_ usage coverage
    all_searchable = liquid_body_text + css_text + js_text + col_text + promo_text
    usage = {}
    coverage_failures = []
    for mn in sorted(mn_ids):
        hyphen = mn.replace("_", "-")
        css_var = "--" + hyphen
        data_attr = "data-" + hyphen

        count = (
            all_searchable.count(mn)
            + all_searchable.count(css_var)
            + all_searchable.count(data_attr)
        )
        usage[mn] = count
        if count < 1:
            coverage_failures.append(mn)

    if coverage_failures:
        for mn in coverage_failures:
            fail(f"mn_ coverage: {mn} not referenced anywhere")
        print(f"[6] mn_ usage coverage                                    : FAIL ({len(coverage_failures)} missing)")
    else:
        print(f"[6] mn_ usage coverage (each id in body+css+js >= 1)      : PASS")

    # 8. No bareword null in liquid files
    null_re = re.compile(r"\bnull\b")
    for fname, ltext in all_liquid_texts:
        null_hits = null_re.findall(ltext)
        if null_hits:
            fail(f"bareword 'null' in {fname} ({len(null_hits)} times) - use 'nil'")

    if not any("null" in f for f in failures):
        print("[7] no bareword 'null' in liquid files                    : PASS")
    else:
        print("[7] no bareword 'null'                                    : FAIL")

    # 9. No width="auto"
    for fname, ltext in all_liquid_texts:
        if 'width="auto"' in ltext or "width='auto'" in ltext:
            fail(f'width="auto" found in {fname}')

    if not any("width" in f for f in failures):
        print('[8] no width="auto" in liquid files                       : PASS')
    else:
        print('[8] no width="auto"                                       : FAIL')

    # 10. Check render passes primitives only (main liquid file)
    render_issues = check_render_primitives(liquid_text)
    if render_issues:
        for issue in render_issues:
            fail(f"render primitives: {issue}")
        print("[9] render tags pass only primitives                      : FAIL")
    else:
        print("[9] render tags pass only primitives                      : PASS")

    # 11. Snippets use linklists[handle] pattern
    if "linklists[" not in col_text and "linklists[" not in promo_text:
        # Column snippet MUST use linklists[handle]
        if "linklists[" not in col_text:
            fail("mega-nav-column.liquid does not use linklists[handle] pattern")
    if not any("linklists" in f for f in failures):
        print("[10] snippets use linklists[handle] pattern                : PASS")
    else:
        print("[10] snippets use linklists[handle]                        : FAIL")

    # 12. No emojis in schema header content
    headers_content = []
    def find_headers(node):
        if isinstance(node, dict):
            if node.get("type") == "header" and "content" in node:
                headers_content.append(node["content"])
            for v in node.values():
                find_headers(v)
        elif isinstance(node, list):
            for item in node:
                find_headers(item)
    find_headers(schema)
    for hc in headers_content:
        if EMOJI_RE.search(str(hc)):
            fail(f"emoji found in schema header: {hc}")

    if not any("emoji" in f for f in failures):
        print("[11] no emojis in schema headers                           : PASS")
    else:
        print("[11] no emojis in schema headers                           : FAIL")

    # 13. Plain English labels (no t: keys for mn_ settings)
    all_settings = []
    collect_settings_with_labels(schema, all_settings)
    for s in all_settings:
        sid = s.get("id", "")
        label = s.get("label", "")
        if sid.startswith("mn_") and isinstance(label, str) and label.startswith("t:"):
            fail(f"mn_ setting {sid} uses translation key label: {label}")

    if not any("translation" in f for f in failures):
        print("[12] plain English labels (no t: keys for mn_ settings)    : PASS")
    else:
        print("[12] plain English labels                                  : FAIL")

    # 14. Color override gated by checkbox
    # Check that blocks have mn_use_custom_color as a checkbox
    blocks = schema.get("blocks", [])
    has_color_gate = False
    for block in blocks:
        if isinstance(block, dict):
            block_settings = block.get("settings", [])
            for s in block_settings:
                if isinstance(s, dict) and s.get("id") == "mn_use_custom_color" and s.get("type") == "checkbox":
                    has_color_gate = True
                    break
    if not has_color_gate:
        fail("no mn_use_custom_color checkbox found in block settings - color overrides must be gated")
        print("[13] color override gated by checkbox                      : FAIL")
    else:
        print("[13] color override gated by checkbox                      : PASS")

    # 15. SVGs have xmlns
    svg_re = re.compile(r"<svg\b[^>]*>", re.IGNORECASE)
    for fname, ltext in all_liquid_texts:
        for svg_match in svg_re.finditer(ltext):
            svg_tag = svg_match.group(0)
            if "xmlns" not in svg_tag:
                fail(f"SVG without xmlns in {fname}: {svg_tag[:80]}")
    # Also check CSS and JS (unlikely but thorough)
    for svg_match in svg_re.finditer(css_text):
        svg_tag = svg_match.group(0)
        if "xmlns" not in svg_tag:
            fail(f"SVG without xmlns in CSS: {svg_tag[:80]}")

    if not any("xmlns" in f.lower() or "svg" in f.lower() for f in failures):
        print("[14] SVGs have xmlns attribute                             : PASS")
    else:
        print("[14] SVGs have xmlns                                       : FAIL")

    # ----- Summary -----
    print()
    print("=" * 72)
    if failures:
        print(f"VALIDATION FAILED ({len(failures)} issues):")
        print("=" * 72)
        for i, f in enumerate(failures, 1):
            print(f"  {i}. {f}")
        return 1
    else:
        print("ALL CHECKS PASS")
        print("=" * 72)

        # Print details
        print()
        print(f"mn_ settings found ({len(mn_ids)}):")
        for mn in sorted(mn_ids):
            print(f"  {mn} (refs: {usage[mn]})")
        print()
        print(f"Range settings ({len(ranges)}):")
        print(f"  {'id':<35} {'min':>5} {'max':>5} {'step':>5} {'default':>8} {'steps':>6}")
        for rid, mn, mx, st, df, steps, rem in range_rows:
            print(f"  {rid:<35} {mn:>5} {mx:>5} {st:>5} {df:>8} {steps:>6.0f}")
        return 0


if __name__ == "__main__":
    sys.exit(main())
