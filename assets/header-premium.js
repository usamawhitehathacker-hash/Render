/* ============================================================
   PREMIUM HEADER - Phase 1 + Phase 2 + Phase 3 + Phase 4 + Phase 5 JavaScript
   ============================================================
   This file extends Dawn's default header with premium behavior.
   It only loads when "Enable Premium Header" is turned ON.
   
   Phase 1: Foundation IIFE + Shopify editor events
   Phase 2: Transparent header content offset
   Phase 3: Hover-trigger dropdowns (Dawn's dropdown is click-only by default)
   Phase 4: Icons & Actions (CSS-driven, no JS needed)
   Phase 5: Mobile bottom nav search trigger + cart count sync
   ============================================================ */

(function () {
  'use strict';

  var hoverState = new WeakMap();
  var HOVER_OPEN_DELAY = 80;
  var HOVER_CLOSE_DELAY = 200;

  function initPremiumHeader() {
    var headerWrapper = document.querySelector('.header-wrapper--premium');
    if (!headerWrapper) return;

    headerWrapper.setAttribute('data-hp-initialized', 'true');

    handleTransparentHeader();
    setupDropdownTrigger(headerWrapper);
    setupBottomNav();
  }

  /**
   * Phase 2: When transparent header is active, mark section-header
   * so adjacent sections can offset via CSS sibling selector.
   */
  function handleTransparentHeader() {
    var sectionHeader = document.querySelector('.section-header');
    if (!sectionHeader) return;

    var transparentWrapper = sectionHeader.querySelector('.header-wrapper--transparent');
    if (transparentWrapper) {
      sectionHeader.setAttribute('data-hp-has-transparent', 'true');
    } else {
      sectionHeader.removeAttribute('data-hp-has-transparent');
    }
  }

  /**
   * Phase 3: Add hover-to-open behavior when trigger="hover".
   * Dawn's dropdowns use <details>/<summary>, which are click-toggle.
   * We add a hover layer on top - when user hovers a parent menu item,
   * we open it; when they leave, we close after a delay.
   */
  function setupDropdownTrigger(headerWrapper) {
    var trigger = headerWrapper.getAttribute('data-hp-trigger') || 'hover';

    // Only attach hover handlers on devices that actually hover
    // (skip on touch where hover is unreliable)
    if (trigger !== 'hover') return;
    if (!window.matchMedia || !window.matchMedia('(hover: hover)').matches) return;

    // Find all dropdown <details> elements within the header
    var detailsList = headerWrapper.querySelectorAll('header-menu details, .mega-menu details');
    if (!detailsList || detailsList.length === 0) return;

    detailsList.forEach(function (details) {
      // Only on desktop sizes
      var parentLi = details.closest('.header__menu-item') || details.parentElement;
      if (!parentLi) return;

      attachHoverHandlers(parentLi, details);
    });
  }

  function attachHoverHandlers(parentLi, details) {
    // Avoid double-binding
    if (hoverState.has(parentLi)) return;
    var state = { openTimer: null, closeTimer: null };
    hoverState.set(parentLi, state);

    parentLi.addEventListener('mouseenter', function () {
      if (window.innerWidth < 990) return;
      clearTimeout(state.closeTimer);
      state.openTimer = setTimeout(function () {
        if (!details.open) {
          details.setAttribute('open', '');
          // Close any other open siblings
          closeOtherDropdowns(parentLi);
        }
      }, HOVER_OPEN_DELAY);
    });

    parentLi.addEventListener('mouseleave', function () {
      if (window.innerWidth < 990) return;
      clearTimeout(state.openTimer);
      state.closeTimer = setTimeout(function () {
        if (details.open) {
          details.removeAttribute('open');
        }
      }, HOVER_CLOSE_DELAY);
    });
  }

  function closeOtherDropdowns(currentParent) {
    var allDetails = document.querySelectorAll('.header-wrapper--premium header-menu details[open], .header-wrapper--premium .mega-menu details[open]');
    allDetails.forEach(function (d) {
      var otherParent = d.closest('.header__menu-item');
      if (otherParent && otherParent !== currentParent) {
        d.removeAttribute('open');
      }
    });
  }

  /**
   * Phase 5: Bottom Navigation Bar
   * The search button in the bottom nav opens Dawn's existing search modal.
   * Cart count is auto-synced from cart icon bubble (Dawn updates it on cart events).
   */
  function setupBottomNav() {
    var bottomNav = document.querySelector('.hp-bottom-nav');
    if (!bottomNav) return;

    // Wire up the search button to trigger Dawn's search modal
    var searchBtn = bottomNav.querySelector('[data-hp-bottom-action="search"]');
    if (searchBtn) {
      searchBtn.addEventListener('click', function () {
        // Dawn's search modal trigger - find the existing search summary
        var searchSummary = document.querySelector('.section-header details-modal summary');
        if (searchSummary) {
          searchSummary.click();
        }
      });
    }

    // Sync cart count: listen for Shopify cart change events that Dawn dispatches
    syncBottomNavCartCount();
    document.addEventListener('cart:refresh', syncBottomNavCartCount);
    document.addEventListener('cart-update', syncBottomNavCartCount);
  }

  function syncBottomNavCartCount() {
    var bottomCount = document.querySelector('.hp-bottom-nav__cart-count');
    var cartIconBubble = document.getElementById('cart-icon-bubble');
    if (!bottomCount || !cartIconBubble) return;

    var bubble = cartIconBubble.querySelector('.cart-count-bubble span[aria-hidden="true"]');
    if (bubble && bubble.textContent) {
      bottomCount.textContent = bubble.textContent.trim();
      bottomCount.style.display = '';
    } else {
      bottomCount.style.display = 'none';
    }
  }

  // Initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPremiumHeader);
  } else {
    initPremiumHeader();
  }

  // Shopify theme editor: re-init when section is reloaded
  document.addEventListener('shopify:section:load', function (e) {
    if (e.target && e.target.classList && e.target.classList.contains('section-header')) {
      initPremiumHeader();
    }
  });

  // Shopify theme editor: cleanup
  document.addEventListener('shopify:section:unload', function (e) {
    if (e.target && e.target.classList && e.target.classList.contains('section-header')) {
      var headerWrapper = e.target.querySelector('.header-wrapper--premium');
      if (headerWrapper) {
        headerWrapper.removeAttribute('data-hp-initialized');
      }
      e.target.removeAttribute('data-hp-has-transparent');
    }
  });
})();
