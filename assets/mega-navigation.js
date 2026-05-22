/* ============================================================
   MEGA NAVIGATION
   - Desktop: hover-trigger dropdown with smart open/close delay
   - Mobile : Prada-style full-screen drawer + accordion submenus
   - Sticky : nav stuck to top after scrolling past it
   - Theme editor: re-init on shopify:section:load / unload
   ============================================================ */
(function () {
  'use strict';

  var OPEN_DELAY = 120;   // ms after mouseenter before opening
  var CLOSE_DELAY = 220;  // ms after mouseleave before closing
  var DESKTOP_BP = 990;   // matches Dawn breakpoint

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
      timers: new WeakMap(),
      stickyEnabled: root.getAttribute('data-mn-sticky') === 'true',
      stickyPlaceholder: null,
      stickyOriginalTop: 0,
      onScroll: null,
      onResize: null,
      onKeyDown: null
    };

    setupDesktopHover(inst);
    setupMobileDrawer(inst);
    setupMobileAccordion(inst);
    setupSticky(inst);
    setupKeyboard(inst);

    instances.set(root, inst);
  }

  function destroy(root) {
    var inst = instances.get(root);
    if (!inst) return;

    if (inst.onScroll) window.removeEventListener('scroll', inst.onScroll);
    if (inst.onResize) window.removeEventListener('resize', inst.onResize);
    if (inst.onKeyDown) document.removeEventListener('keydown', inst.onKeyDown);

    closeDrawer(inst);

    if (inst.stickyPlaceholder && inst.stickyPlaceholder.parentNode) {
      inst.stickyPlaceholder.parentNode.removeChild(inst.stickyPlaceholder);
    }

    instances.delete(root);
  }

  /* ---------- Desktop hover ---------- */
  function setupDesktopHover(inst) {
    if (!inst.items || inst.items.length === 0) return;

    inst.items.forEach(function (item) {
      var dropdown = item.querySelector('.mega-nav-dropdown');
      if (!dropdown) return;

      item.addEventListener('mouseenter', function () {
        if (window.innerWidth < DESKTOP_BP) return;
        scheduleOpen(inst, item);
      });

      item.addEventListener('mouseleave', function () {
        if (window.innerWidth < DESKTOP_BP) return;
        scheduleClose(inst, item);
      });

      // Keyboard / focus support: open on focus-within, close on blur away
      item.addEventListener('focusin', function () {
        if (window.innerWidth < DESKTOP_BP) return;
        openItem(inst, item);
      });

      item.addEventListener('focusout', function (e) {
        if (window.innerWidth < DESKTOP_BP) return;
        // Close only when focus leaves the entire item (including dropdown)
        if (!item.contains(e.relatedTarget)) {
          scheduleClose(inst, item);
        }
      });
    });
  }

  function scheduleOpen(inst, item) {
    clearTimers(inst, item);
    var t = setTimeout(function () {
      openItem(inst, item);
    }, OPEN_DELAY);
    inst.timers.set(item, { open: t, close: null });
  }

  function scheduleClose(inst, item) {
    clearTimers(inst, item);
    var t = setTimeout(function () {
      closeItem(inst, item);
    }, CLOSE_DELAY);
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
    // Close siblings first
    inst.items.forEach(function (other) {
      if (other !== item) other.classList.remove('is-open');
    });
    item.classList.add('is-open');
  }

  function closeItem(inst, item) {
    item.classList.remove('is-open');
  }

  /* ---------- Mobile drawer ---------- */
  function setupMobileDrawer(inst) {
    if (!inst.hamburger || !inst.drawer) return;

    inst.hamburger.addEventListener('click', function () {
      openDrawer(inst);
    });

    if (inst.drawerClose) {
      inst.drawerClose.addEventListener('click', function () {
        closeDrawer(inst);
      });
    }

    if (inst.drawerOverlay) {
      inst.drawerOverlay.addEventListener('click', function () {
        closeDrawer(inst);
      });
    }
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
    // Collapse all open accordions when drawer closes
    inst.mobileTriggers.forEach(function (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
      var sub = trigger.nextElementSibling;
      if (sub && sub.classList.contains('mega-nav-mobile-submenu')) {
        sub.classList.remove('is-open');
      }
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

        if (isOpen) {
          trigger.setAttribute('aria-expanded', 'false');
          sub.classList.remove('is-open');
        } else {
          trigger.setAttribute('aria-expanded', 'true');
          sub.classList.add('is-open');
        }
      });
    });
  }

  /* ---------- Sticky nav ---------- */
  function setupSticky(inst) {
    if (!inst.stickyEnabled) return;

    // Placeholder reserves space when nav becomes fixed
    var placeholder = document.createElement('div');
    placeholder.className = 'mega-nav-sticky-placeholder';
    placeholder.style.display = 'none';
    inst.root.parentNode.insertBefore(placeholder, inst.root);
    inst.stickyPlaceholder = placeholder;

    function updateOriginalTop() {
      // Measure where the nav sits relative to the document
      if (!inst.root.classList.contains('is-stuck')) {
        var rect = inst.root.getBoundingClientRect();
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        inst.stickyOriginalTop = rect.top + scrollTop;
      }
    }

    updateOriginalTop();

    var ticking = false;
    inst.onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        var isStuck = inst.root.classList.contains('is-stuck');

        if (!isStuck && scrollTop > inst.stickyOriginalTop + 10) {
          // Reserve space, then stick
          placeholder.style.display = 'block';
          placeholder.style.height = inst.root.offsetHeight + 'px';
          inst.root.classList.add('is-stuck');
        } else if (isStuck && scrollTop <= inst.stickyOriginalTop) {
          inst.root.classList.remove('is-stuck');
          placeholder.style.display = 'none';
        }
        ticking = false;
      });
    };

    inst.onResize = function () {
      // On resize, if not currently stuck, recompute original top
      if (!inst.root.classList.contains('is-stuck')) {
        updateOriginalTop();
      }
    };

    window.addEventListener('scroll', inst.onScroll, { passive: true });
    window.addEventListener('resize', inst.onResize);
  }

  /* ---------- Keyboard support ---------- */
  function setupKeyboard(inst) {
    inst.onKeyDown = function (e) {
      if (e.key !== 'Escape' && e.keyCode !== 27) return;

      // Close mobile drawer if open
      if (inst.root.classList.contains('is-drawer-open')) {
        closeDrawer(inst);
        if (inst.hamburger) inst.hamburger.focus();
        return;
      }

      // Close any open desktop dropdown
      inst.items.forEach(function (item) {
        if (item.classList.contains('is-open')) {
          closeItem(inst, item);
          var link = item.querySelector('.mega-nav-link');
          if (link) link.focus();
        }
      });
    };
    document.addEventListener('keydown', inst.onKeyDown);
  }

  /* ---------- Boot ---------- */
  function bootAll() {
    var roots = document.querySelectorAll('.mega-navigation-section');
    roots.forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootAll);
  } else {
    bootAll();
  }

  // Theme editor: re-init when section is reloaded
  document.addEventListener('shopify:section:load', function (e) {
    var root = e.target && e.target.querySelector
      ? e.target.querySelector('.mega-navigation-section')
      : null;
    if (root) init(root);
  });

  document.addEventListener('shopify:section:unload', function (e) {
    var root = e.target && e.target.querySelector
      ? e.target.querySelector('.mega-navigation-section')
      : null;
    if (root) destroy(root);
  });

  document.addEventListener('shopify:block:select', function (e) {
    // When merchant selects a menu_item block in the editor, open its dropdown
    var item = e.target && e.target.closest ? e.target.closest('.mega-nav-item') : null;
    if (!item) return;
    var root = item.closest('.mega-navigation-section');
    if (!root) return;
    var inst = instances.get(root);
    if (inst) openItem(inst, item);
  });

  document.addEventListener('shopify:block:deselect', function (e) {
    var item = e.target && e.target.closest ? e.target.closest('.mega-nav-item') : null;
    if (!item) return;
    var root = item.closest('.mega-navigation-section');
    if (!root) return;
    var inst = instances.get(root);
    if (inst) closeItem(inst, item);
  });
})();
