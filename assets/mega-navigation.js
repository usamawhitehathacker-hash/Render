/* ============================================================
   MEGA NAVIGATION - Independent Section JavaScript
   ============================================================
   IIFE pattern - no global pollution.
   Handles: desktop hover dropdowns, mobile drawer, accordion,
   sticky nav, keyboard accessibility, Shopify editor events.
   ============================================================ */

(function () {
  'use strict';

  var HOVER_OPEN_DELAY = 80;
  var HOVER_CLOSE_DELAY = 200;
  var hoverTimers = new WeakMap();

  function initMegaNavigation() {
    var section = document.querySelector('.mega-navigation-section');
    if (!section) return;

    setupDesktopHover(section);
    setupMobileDrawer(section);
    setupMobileAccordion(section);
    setupStickyNav(section);
    setupKeyboard(section);
    setupClickOutside(section);
  }

  /* ============================================================
     DESKTOP HOVER
     ============================================================ */
  function setupDesktopHover(section) {
    var items = section.querySelectorAll('.mega-nav-item');
    if (!items || items.length === 0) return;

    items.forEach(function (item) {
      var timers = { openTimer: undefined, closeTimer: undefined };
      hoverTimers.set(item, timers);

      item.addEventListener('mouseenter', function () {
        if (window.innerWidth < 990) return;
        var t = hoverTimers.get(item);
        clearTimeout(t.closeTimer);
        t.openTimer = setTimeout(function () {
          closeAllDropdowns(section);
          item.classList.add('is-active');
        }, HOVER_OPEN_DELAY);
      });

      item.addEventListener('mouseleave', function () {
        if (window.innerWidth < 990) return;
        var t = hoverTimers.get(item);
        clearTimeout(t.openTimer);
        t.closeTimer = setTimeout(function () {
          item.classList.remove('is-active');
        }, HOVER_CLOSE_DELAY);
      });
    });
  }

  /* ============================================================
     CLOSE ALL DROPDOWNS
     ============================================================ */
  function closeAllDropdowns(section) {
    var activeItems = section.querySelectorAll('.mega-nav-item.is-active');
    activeItems.forEach(function (item) {
      item.classList.remove('is-active');
    });
  }

  /* ============================================================
     MOBILE DRAWER
     ============================================================ */
  function setupMobileDrawer(section) {
    var hamburger = section.querySelector('.mega-nav-hamburger');
    var drawer = section.querySelector('.mega-nav-drawer');
    var overlay = section.querySelector('.mega-nav-drawer-overlay');
    var closeBtn = section.querySelector('.mega-nav-drawer__close');

    if (!hamburger || !drawer) return;

    hamburger.addEventListener('click', function () {
      drawer.classList.add('is-open');
      if (overlay) overlay.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
      hamburger.setAttribute('aria-expanded', 'true');
      setupFocusTrap(drawer, hamburger);
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        closeMobileDrawer(drawer, overlay, hamburger);
      });
    }

    if (overlay) {
      overlay.addEventListener('click', function () {
        closeMobileDrawer(drawer, overlay, hamburger);
      });
    }
  }

  function closeMobileDrawer(drawer, overlay, hamburger) {
    if (drawer) {
      drawer.classList.remove('is-open');
      removeFocusTrap(drawer);
    }
    if (overlay) overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.focus();
    }
  }

  /* ============================================================
     FOCUS TRAP
     ============================================================ */
  function getFocusableElements(container) {
    var selector = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.prototype.slice.call(container.querySelectorAll(selector));
  }

  function setupFocusTrap(drawer) {
    var focusHandler = function (e) {
      if (e.key !== 'Tab') return;

      var focusable = getFocusableElements(drawer);
      if (focusable.length === 0) return;

      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    drawer._mnFocusTrapHandler = focusHandler;
    drawer.addEventListener('keydown', focusHandler);

    /* Move focus into the drawer */
    var focusable = getFocusableElements(drawer);
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  }

  function removeFocusTrap(drawer) {
    if (drawer._mnFocusTrapHandler) {
      drawer.removeEventListener('keydown', drawer._mnFocusTrapHandler);
      delete drawer._mnFocusTrapHandler;
    }
  }

  /* ============================================================
     MOBILE ACCORDION
     ============================================================ */
  function setupMobileAccordion(section) {
    var triggers = section.querySelectorAll('.mega-nav-mobile-link[data-has-submenu="true"]');
    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        var parentItem = trigger.closest('.mega-nav-mobile-item');
        if (!parentItem) return;

        var isExpanded = parentItem.classList.contains('is-expanded');
        /* Close all other accordions at same level */
        var siblings = parentItem.parentElement.querySelectorAll('.mega-nav-mobile-item.is-expanded');
        siblings.forEach(function (sib) {
          sib.classList.remove('is-expanded');
          var sibTrigger = sib.querySelector('.mega-nav-mobile-link[data-has-submenu="true"]');
          if (sibTrigger) sibTrigger.setAttribute('aria-expanded', 'false');
        });

        if (!isExpanded) {
          parentItem.classList.add('is-expanded');
          trigger.setAttribute('aria-expanded', 'true');
        } else {
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* ============================================================
     STICKY NAV
     ============================================================ */
  function setupStickyNav(section) {
    var isSticky = section.getAttribute('data-mn-sticky') === 'true';
    if (!isSticky) return;

    var navBar = section.querySelector('.mega-nav-bar');
    if (!navBar) return;

    function getOffsetTop() {
      return section.getBoundingClientRect().top + window.pageYOffset;
    }

    function onScroll() {
      var offsetTop = getOffsetTop();
      if (window.pageYOffset > offsetTop) {
        section.classList.add('is-sticky');
      } else {
        section.classList.remove('is-sticky');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     KEYBOARD ACCESSIBILITY
     ============================================================ */
  function setupKeyboard(section) {
    section.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeAllDropdowns(section);
        var drawer = section.querySelector('.mega-nav-drawer');
        var overlay = section.querySelector('.mega-nav-drawer-overlay');
        var hamburger = section.querySelector('.mega-nav-hamburger');
        closeMobileDrawer(drawer, overlay, hamburger);
      }

      /* Arrow-key navigation for top-level nav items */
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        var navLinks = Array.prototype.slice.call(section.querySelectorAll('.mega-nav-menu > .mega-nav-item > .mega-nav-link'));
        var currentIndex = navLinks.indexOf(document.activeElement);
        if (currentIndex === -1) return;

        e.preventDefault();
        var nextIndex;
        if (e.key === 'ArrowRight') {
          nextIndex = (currentIndex + 1) % navLinks.length;
        } else {
          nextIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
        }
        navLinks[nextIndex].focus();
      }

      /* ArrowDown moves focus into the first link of an open dropdown */
      if (e.key === 'ArrowDown') {
        var activeItem = section.querySelector('.mega-nav-item.is-active');
        if (activeItem) {
          var firstDropdownLink = activeItem.querySelector('.mega-nav-dropdown a');
          if (firstDropdownLink) {
            e.preventDefault();
            firstDropdownLink.focus();
          }
        }
      }
    });
  }

  /* ============================================================
     CLICK OUTSIDE
     ============================================================ */
  function setupClickOutside(section) {
    document.addEventListener('click', function (e) {
      if (!section.contains(e.target)) {
        closeAllDropdowns(section);
      }
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMegaNavigation);
  } else {
    initMegaNavigation();
  }

  /* ============================================================
     SHOPIFY EDITOR EVENTS
     ============================================================ */
  document.addEventListener('shopify:section:load', function (e) {
    if (e.target && e.target.querySelector('.mega-navigation-section')) {
      initMegaNavigation();
    }
  });

  document.addEventListener('shopify:section:unload', function (e) {
    if (e.target && e.target.querySelector('.mega-navigation-section')) {
      var section = e.target.querySelector('.mega-navigation-section');
      section.classList.remove('is-sticky');
      closeAllDropdowns(section);
    }
  });

  document.addEventListener('shopify:block:select', function (e) {
    var section = document.querySelector('.mega-navigation-section');
    if (!section) return;
    var block = e.target;
    if (!block) return;
    var navItem = section.querySelector('[data-block-id="' + block.getAttribute('data-shopify-editor-block') + '"]');
    if (navItem) {
      closeAllDropdowns(section);
      navItem.classList.add('is-active');
    }
  });

  document.addEventListener('shopify:block:deselect', function (e) {
    var section = document.querySelector('.mega-navigation-section');
    if (!section) return;
    closeAllDropdowns(section);
  });
})();
