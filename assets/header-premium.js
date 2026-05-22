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

  // Module-scoped MutationObserver for cart-bubble -> bottom-nav cart-count sync.
  // Re-created on every initPremiumHeader() call; disconnected in unload.
  var cartBubbleObserver = null;

  function initPremiumHeader() {
    var headerWrapper = document.querySelector('.header-wrapper--premium');
    if (!headerWrapper) return;

    handleTransparentHeader();
    setupDropdownTrigger(headerWrapper);
    setupBottomNav();
  }

  /**
   * Phase 2: When transparent header is active, mark section-header
   * so adjacent sections can offset via CSS sibling selector.
   * (CSS also has a JS-free fallback keying off .header-wrapper--transparent.)
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
   * - Search button opens whichever Dawn search modal is rendered in the
   *   section-header (id starts with "Search-In-Modal").
   * - Cart count is mirrored from #cart-icon-bubble via MutationObserver,
   *   so it stays in sync with Dawn's PUB_SUB cartUpdate flow without
   *   needing to import the pubsub broker.
   */
  function setupBottomNav() {
    var bottomNav = document.querySelector('.hp-bottom-nav');
    if (!bottomNav) return;

    // Wire up the search button to trigger Dawn's search modal.
    // Dawn renders the search modal with id "Search-In-Modal-1" (logo top-center
    // or no menu) or "Search-In-Modal" (icons block). Pin the lookup to either
    // form so a future details-modal sibling (localization, account) cannot
    // accidentally be triggered by the bottom-nav search button.
    var searchBtn = bottomNav.querySelector('[data-hp-bottom-action="search"]');
    if (searchBtn) {
      searchBtn.addEventListener('click', function () {
        var searchSummary = document.querySelector(
          '.section-header details-modal > details > summary[id^="Search-In-Modal"], ' +
          '.section-header details-modal summary[id^="Search-In-Modal"]'
        );
        if (searchSummary) {
          searchSummary.click();
        }
      });
    }

    // Sync once on init, then observe the cart-icon-bubble container for any
    // mutation (Dawn replaces the bubble's innerHTML on cart updates and removes
    // the .cart-count-bubble entirely when the cart goes empty - so we observe
    // the icon container itself, not the bubble, with subtree:true).
    syncBottomNavCartCount();

    var cartIconBubble = document.getElementById('cart-icon-bubble');
    if (cartIconBubble && typeof MutationObserver !== 'undefined') {
      // Tear down any prior observer (defensive - unload should have done this).
      if (cartBubbleObserver) {
        cartBubbleObserver.disconnect();
      }
      cartBubbleObserver = new MutationObserver(syncBottomNavCartCount);
      cartBubbleObserver.observe(cartIconBubble, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
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
      // Empty cart -> Dawn removes the .cart-count-bubble entirely.
      bottomCount.style.display = 'none';
    }
  }

  function teardownPremiumHeader() {
    if (cartBubbleObserver) {
      cartBubbleObserver.disconnect();
      cartBubbleObserver = null;
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
      teardownPremiumHeader();
      initPremiumHeader();
    }
  });

  // Shopify theme editor: cleanup
  document.addEventListener('shopify:section:unload', function (e) {
    if (e.target && e.target.classList && e.target.classList.contains('section-header')) {
      teardownPremiumHeader();
      e.target.removeAttribute('data-hp-has-transparent');
    }
  });
})();
