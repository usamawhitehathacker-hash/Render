/* ============================================================
   MEGA NAVIGATION — PREMIUM JS (supports 116+ settings)
   Desktop: hover/click trigger, overlay, close-on-scroll
   Mobile: Prada drawer, accordion, scroll lock
   Editor: section:load/unload, block:select/deselect
   ============================================================ */
(function () {
  'use strict';
  var DESKTOP_BP = 990;
  var instances = new WeakMap();

  function init(root) {
    if (!root || instances.has(root)) return;
    var inst = {
      root: root,
      items: root.querySelectorAll('.mega-nav-item'),
      hamburger: root.querySelector('.mega-nav-hamburger'),
      drawer: root.querySelector('.mega-nav-drawer'),
      drawerOverlay: root.querySelector('.mega-nav-drawer-overlay'),
      drawerClose: root.querySelector('.mega-nav-drawer__close'),
      mobileTriggers: root.querySelectorAll('.mega-nav-mobile-link[data-has-submenu="true"]'),
      overlay: root.querySelector('.mega-nav-overlay'),
      openTrigger: root.getAttribute('data-mn-open-trigger') || 'hover-with-delay',
      openDelay: parseInt(getCSS(root, '--mn-open-delay') || '120', 10),
      closeDelay: parseInt(getCSS(root, '--mn-close-delay') || '200', 10),
      closeOnScroll: root.getAttribute('data-mn-close-on-scroll') === 'true',
      stickyEnabled: root.getAttribute('data-mn-sticky') === 'true',
      timers: new WeakMap(),
      stickyPlaceholder: null, stickyOriginalTop: 0,
      onScroll: null, onKeyDown: null
    };
    setupDesktop(inst);
    setupMobileDrawer(inst);
    setupMobileAccordion(inst);
    setupSticky(inst);
    setupKeyboard(inst);
    if (inst.closeOnScroll) setupCloseOnScroll(inst);
    instances.set(root, inst);
  }

  function destroy(root) {
    var inst = instances.get(root);
    if (!inst) return;
    if (inst.onScroll) window.removeEventListener('scroll', inst.onScroll);
    if (inst.onKeyDown) document.removeEventListener('keydown', inst.onKeyDown);
    closeDrawer(inst);
    if (inst.stickyPlaceholder && inst.stickyPlaceholder.parentNode) inst.stickyPlaceholder.parentNode.removeChild(inst.stickyPlaceholder);
    instances.delete(root);
  }

  function getCSS(el, prop) {
    return getComputedStyle(el).getPropertyValue(prop).trim();
  }


  /* ---------- Desktop dropdown ---------- */
  function setupDesktop(inst) {
    if (!inst.items || inst.items.length === 0) return;
    inst.items.forEach(function (item) {
      var dropdown = item.querySelector('.mega-nav-dropdown');
      if (!dropdown) return;

      if (inst.openTrigger === 'click') {
        item.querySelector('.mega-nav-link').addEventListener('click', function (e) {
          if (window.innerWidth < DESKTOP_BP) return;
          e.preventDefault();
          if (item.classList.contains('is-open')) { closeItem(inst, item); } else { openItem(inst, item); }
        });
      } else {
        item.addEventListener('mouseenter', function () {
          if (window.innerWidth < DESKTOP_BP) return;
          scheduleOpen(inst, item);
        });
        item.addEventListener('mouseleave', function () {
          if (window.innerWidth < DESKTOP_BP) return;
          scheduleClose(inst, item);
        });
      }
      item.addEventListener('focusin', function () { if (window.innerWidth >= DESKTOP_BP) openItem(inst, item); });
      item.addEventListener('focusout', function (e) { if (window.innerWidth >= DESKTOP_BP && !item.contains(e.relatedTarget)) scheduleClose(inst, item); });
    });
  }

  function scheduleOpen(inst, item) {
    clearTimers(inst, item);
    var delay = inst.openTrigger === 'hover-instant' ? 0 : inst.openDelay;
    var t = setTimeout(function () { openItem(inst, item); }, delay);
    inst.timers.set(item, { open: t, close: null });
  }
  function scheduleClose(inst, item) {
    clearTimers(inst, item);
    var t = setTimeout(function () { closeItem(inst, item); }, inst.closeDelay);
    var entry = inst.timers.get(item) || {};
    entry.close = t;
    inst.timers.set(item, entry);
  }
  function clearTimers(inst, item) {
    var entry = inst.timers.get(item);
    if (!entry) return;
    if (entry.open) clearTimeout(entry.open);
    if (entry.close) clearTimeout(entry.close);
    inst.timers.set(item, { open: null, close: null });
  }
  function openItem(inst, item) {
    inst.items.forEach(function (o) { if (o !== item) o.classList.remove('is-open'); });
    item.classList.add('is-open');
    inst.root.classList.add('has-open-dropdown');
  }
  function closeItem(inst, item) {
    item.classList.remove('is-open');
    var anyOpen = inst.root.querySelector('.mega-nav-item.is-open');
    if (!anyOpen) inst.root.classList.remove('has-open-dropdown');
  }
  function closeAll(inst) {
    inst.items.forEach(function (item) { item.classList.remove('is-open'); });
    inst.root.classList.remove('has-open-dropdown');
  }


  /* ---------- Close on scroll ---------- */
  function setupCloseOnScroll(inst) {
    var scrollHandler = function () { if (inst.root.classList.contains('has-open-dropdown')) closeAll(inst); };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    inst._closeScrollHandler = scrollHandler;
  }

  /* ---------- Mobile drawer ---------- */
  function setupMobileDrawer(inst) {
    if (!inst.hamburger || !inst.drawer) return;
    inst.hamburger.addEventListener('click', function () { openDrawer(inst); });
    if (inst.drawerClose) inst.drawerClose.addEventListener('click', function () { closeDrawer(inst); });
    if (inst.drawerOverlay) inst.drawerOverlay.addEventListener('click', function () { closeDrawer(inst); });
  }
  function openDrawer(inst) {
    inst.root.classList.add('is-drawer-open');
    if (inst.hamburger) inst.hamburger.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('mn-no-scroll');
    document.body.classList.add('mn-no-scroll');
  }
  function closeDrawer(inst) {
    inst.root.classList.remove('is-drawer-open');
    if (inst.hamburger) inst.hamburger.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('mn-no-scroll');
    document.body.classList.remove('mn-no-scroll');
    inst.mobileTriggers.forEach(function (t) {
      t.setAttribute('aria-expanded', 'false');
      var sub = t.nextElementSibling;
      if (sub && sub.classList.contains('mega-nav-mobile-submenu')) sub.classList.remove('is-open');
    });
  }

  /* ---------- Mobile accordion ---------- */
  function setupMobileAccordion(inst) {
    if (!inst.mobileTriggers || inst.mobileTriggers.length === 0) return;
    inst.mobileTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var sub = trigger.nextElementSibling;
        if (!sub || !sub.classList.contains('mega-nav-mobile-submenu')) return;
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';
        if (isOpen) { trigger.setAttribute('aria-expanded', 'false'); sub.classList.remove('is-open'); }
        else { trigger.setAttribute('aria-expanded', 'true'); sub.classList.add('is-open'); }
      });
    });
  }


  /* ---------- Sticky ---------- */
  function setupSticky(inst) {
    if (!inst.stickyEnabled) return;
    var placeholder = document.createElement('div');
    placeholder.className = 'mega-nav-sticky-placeholder';
    placeholder.style.display = 'none';
    inst.root.parentNode.insertBefore(placeholder, inst.root);
    inst.stickyPlaceholder = placeholder;

    function getTop() {
      if (!inst.root.classList.contains('is-stuck')) {
        var r = inst.root.getBoundingClientRect();
        inst.stickyOriginalTop = r.top + (window.pageYOffset || document.documentElement.scrollTop);
      }
    }
    getTop();
    var ticking = false;
    inst.onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var st = window.pageYOffset || document.documentElement.scrollTop;
        if (!inst.root.classList.contains('is-stuck') && st > inst.stickyOriginalTop + 10) {
          placeholder.style.display = 'block';
          placeholder.style.height = inst.root.offsetHeight + 'px';
          inst.root.classList.add('is-stuck');
        } else if (inst.root.classList.contains('is-stuck') && st <= inst.stickyOriginalTop) {
          inst.root.classList.remove('is-stuck');
          placeholder.style.display = 'none';
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', inst.onScroll, { passive: true });
    window.addEventListener('resize', function () { if (!inst.root.classList.contains('is-stuck')) getTop(); });
  }

  /* ---------- Keyboard ---------- */
  function setupKeyboard(inst) {
    inst.onKeyDown = function (e) {
      if (e.key !== 'Escape' && e.keyCode !== 27) return;
      if (inst.root.classList.contains('is-drawer-open')) { closeDrawer(inst); if (inst.hamburger) inst.hamburger.focus(); return; }
      closeAll(inst);
    };
    document.addEventListener('keydown', inst.onKeyDown);
  }

  /* ---------- Boot ---------- */
  function bootAll() { document.querySelectorAll('.mega-navigation-section').forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootAll);
  else bootAll();

  document.addEventListener('shopify:section:load', function (e) { var r = e.target && e.target.querySelector('.mega-navigation-section'); if (r) init(r); });
  document.addEventListener('shopify:section:unload', function (e) { var r = e.target && e.target.querySelector('.mega-navigation-section'); if (r) destroy(r); });
  document.addEventListener('shopify:block:select', function (e) { var item = e.target && e.target.closest('.mega-nav-item'); if (!item) return; var root = item.closest('.mega-navigation-section'); if (!root) return; var inst = instances.get(root); if (inst) openItem(inst, item); });
  document.addEventListener('shopify:block:deselect', function (e) { var item = e.target && e.target.closest('.mega-nav-item'); if (!item) return; var root = item.closest('.mega-navigation-section'); if (!root) return; var inst = instances.get(root); if (inst) closeItem(inst, item); });
})();
