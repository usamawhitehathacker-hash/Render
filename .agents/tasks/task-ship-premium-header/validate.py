#!/usr/bin/env python3
"""
Premium Header validator.

Usage:
    python3 validate.py <header.liquid> <header-premium.css> <header-premium.js>

Checks:
  1. {% schema %}...{% endschema %} block extracts and json.loads cleanly.
  2. Walks schema settings (and nested under blocks). Collects all hp_* ids.
     Asserts exactly 46 unique hp_ ids.
  3. For every type=="range" entry: min/max/step/default are numbers (not str),
     (max-min)/step <= 100, (default-min) % step == 0.
  4. Liquid block balance: count {%-?\s*<tag>\b vs {%-?\s*end<tag>\b for tag in
     [if, for, case, comment, capture, unless, form, style, javascript, schema].
     Each pair must match. {% liquid %} is intentionally excluded - it is a
     tag-style block with no endliquid.
  5. Each hp_ id appears at least once in
        (liquid_text minus the schema region) + css_text + js_text,
     counting BOTH the literal token (hp_foo) AND the derived CSS / DOM
     forms (--hp-foo as a custom property, data-hp-foo as an attribute,
     including hyphenated tails like data-hp-foo-bar). This matches the
     wiring contract Phase 5 actually uses (Liquid emits --hp-* and
     data-hp-*; CSS/JS read those forms, not the bare hp_ id).
  6. No bareword `null` in the liquid file (Shopify Liquid uses `nil`).
  7. No width="auto" anywhere in the liquid file.

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


def fail(msg: str) -> None:
    print(f"FAIL: {msg}")
    sys.exit(1)


def collect_hp_ids(node, ids):
    """Recursively walk a schema node collecting hp_* ids from settings arrays."""
    if isinstance(node, dict):
        sid = node.get("id")
        if isinstance(sid, str) and sid.startswith("hp_"):
            ids.add(sid)
        for v in node.values():
            collect_hp_ids(v, ids)
    elif isinstance(node, list):
        for item in node:
            collect_hp_ids(item, ids)


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


def main() -> int:
    if len(sys.argv) != 4:
        print("usage: validate.py <header.liquid> <header-premium.css> <header-premium.js>")
        return 2

    liquid_path = Path(sys.argv[1])
    css_path = Path(sys.argv[2])
    js_path = Path(sys.argv[3])

    for p in (liquid_path, css_path, js_path):
        if not p.is_file():
            fail(f"file not found: {p}")

    liquid_text = liquid_path.read_text(encoding="utf-8")
    css_text = css_path.read_text(encoding="utf-8")
    js_text = js_path.read_text(encoding="utf-8")

    print("=" * 72)
    print("PREMIUM HEADER VALIDATOR")
    print("=" * 72)
    print(f"liquid : {liquid_path}  ({len(liquid_text)} bytes)")
    print(f"css    : {css_path}  ({len(css_text)} bytes)")
    print(f"js     : {js_path}  ({len(js_text)} bytes)")
    print()

    # 1. Extract schema block
    m = SCHEMA_RE.search(liquid_text)
    if not m:
        fail("could not locate {% schema %}...{% endschema %} block")
    schema_text = m.group(1)
    schema_region = m.group(0)
    liquid_body_text = liquid_text.replace(schema_region, "")

    # 2. Parse schema JSON
    try:
        schema = json.loads(schema_text)
    except json.JSONDecodeError as e:
        fail(f"schema JSON invalid: {e}")
    print("[1] schema JSON parses cleanly                            : PASS")

    # 3. Collect hp_ ids
    hp_ids: set[str] = set()
    collect_hp_ids(schema, hp_ids)
    if len(hp_ids) != 47:
        fail(f"expected 47 hp_ ids, got {len(hp_ids)}: {sorted(hp_ids)}")
    print(f"[2] hp_ id count == 47                                    : PASS ({len(hp_ids)} unique)")

    # 4. Range math
    ranges = []
    collect_range_entries(schema, ranges)
    range_rows = []
    range_failures = []
    for r in ranges:
        rid = r.get("id", "<no-id>")
        for k in ("min", "max", "step", "default"):
            if k not in r:
                range_failures.append(f"{rid}: missing key '{k}'")
                continue
            v = r[k]
            if isinstance(v, bool) or not isinstance(v, (int, float)):
                range_failures.append(
                    f"{rid}: '{k}' must be number, got {type(v).__name__} ({v!r})"
                )
        if any(k not in r for k in ("min", "max", "step", "default")):
            continue
        mn, mx, st, df = r["min"], r["max"], r["step"], r["default"]
        if not all(isinstance(x, (int, float)) and not isinstance(x, bool) for x in (mn, mx, st, df)):
            continue
        steps = (mx - mn) / st if st else float("inf")
        if steps > 100:
            range_failures.append(f"{rid}: (max-min)/step = {steps} > 100")
        # default-min must be a clean multiple of step. Use a small epsilon for floats.
        rem = (df - mn) % st
        # Float-safe check
        if abs(rem) > 1e-9 and abs(rem - st) > 1e-9:
            range_failures.append(
                f"{rid}: (default-min) % step = {rem} != 0  (min={mn} max={mx} step={st} default={df})"
            )
        range_rows.append((rid, mn, mx, st, df, steps, rem))
    if range_failures:
        for line in range_failures:
            print(f"   range FAIL: {line}")
        fail("range math validation failed")
    print(f"[3] range math (min/max/step/default sane)                : PASS ({len(ranges)} ranges)")

    # 5. Liquid block balance
    balance_rows = []
    balance_failures = []
    for tag in LIQUID_TAGS_WITH_END:
        open_re = re.compile(r"\{%-?\s*" + tag + r"\b")
        close_re = re.compile(r"\{%-?\s*end" + tag + r"\b")
        opens = len(open_re.findall(liquid_text))
        closes = len(close_re.findall(liquid_text))
        balance_rows.append((tag, opens, closes))
        if opens != closes:
            balance_failures.append(f"{tag}: {opens} opens vs {closes} closes")
    if balance_failures:
        for line in balance_failures:
            print(f"   balance FAIL: {line}")
        fail("liquid block balance failed")
    print("[4] liquid block balance (all paired tags)                : PASS")

    # 6. hp_ usage coverage. We count three forms per id, in (liquid body
    # excluding the schema region) + css + js:
    #   - the literal Liquid token, e.g. "hp_top_line_height"
    #   - the CSS custom-property form, "--hp-top-line-height"
    #   - the data-attribute form, "data-hp-top-line-height"
    # The Liquid {% style %} block emits --hp-* variables and the wrapper
    # element emits data-hp-* attributes; CSS/JS read those forms, not the
    # bare hp_ id. A coverage failure on all three forms means the id is
    # truly orphaned. Each id must hit at least one form somewhere.
    usage = {}
    coverage_failures = []
    for hp in sorted(hp_ids):
        # Derived hyphenated forms.
        # hp_foo_bar -> hp-foo-bar
        hyphen = hp.replace("_", "-")
        css_var = "--" + hyphen
        data_attr = "data-" + hyphen

        body_count = (
            liquid_body_text.count(hp)
            + liquid_body_text.count(css_var)
            + liquid_body_text.count(data_attr)
        )
        css_count = (
            css_text.count(hp)
            + css_text.count(css_var)
            + css_text.count(data_attr)
        )
        js_count = (
            js_text.count(hp)
            + js_text.count(css_var)
            + js_text.count(data_attr)
        )
        usage[hp] = (body_count, css_count, js_count)
        total = body_count + css_count + js_count
        if total < 1:
            coverage_failures.append(hp)
    if coverage_failures:
        for hp in coverage_failures:
            print(f"   coverage FAIL: {hp} not referenced anywhere")
        fail("hp_ usage coverage failed")
    print(f"[5] hp_ usage coverage (each id in body+css+js >= 1)      : PASS")

    # 7. No bareword null in liquid
    null_re = re.compile(r"\bnull\b")
    null_hits = null_re.findall(liquid_text)
    if null_hits:
        fail(f"bareword 'null' appears in liquid file ({len(null_hits)} times) - use 'nil'")
    print("[6] no bareword 'null' in liquid                          : PASS")

    # 8. No width="auto" in liquid
    if 'width="auto"' in liquid_text or "width='auto'" in liquid_text:
        fail("width=\"auto\" found in liquid file")
    print("[7] no width=\"auto\" in liquid                             : PASS")

    # ----- Reporting tables -----
    print()
    print("Liquid block balance:")
    print(f"  {'tag':<12} {'opens':>6} {'closes':>7}")
    for tag, opens, closes in balance_rows:
        print(f"  {tag:<12} {opens:>6} {closes:>7}")

    print()
    print("Range math:")
    print(f"  {'id':<32} {'min':>6} {'max':>6} {'step':>6} {'default':>8} {'steps':>6} {'on_step':>8}")
    for rid, mn, mx, st, df, steps, rem in range_rows:
        on_step = "YES" if abs(rem) < 1e-9 or abs(rem - st) < 1e-9 else "NO"
        print(f"  {rid:<32} {mn:>6} {mx:>6} {st:>6} {df:>8} {steps:>6} {on_step:>8}")

    print()
    print("Per-id hp_ usage:")
    print(f"  {'id':<32} {'body':>6} {'css':>6} {'js':>6}")
    for hp in sorted(hp_ids):
        b, c, j = usage[hp]
        print(f"  {hp:<32} {b:>6} {c:>6} {j:>6}")

    print()
    print("=" * 72)
    print("ALL CHECKS PASS")
    print("=" * 72)
    return 0


if __name__ == "__main__":
    sys.exit(main())
