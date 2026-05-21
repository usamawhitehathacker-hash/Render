/* ============================================================
   PREMIUM HEADER - Phase 1: Foundation JavaScript
   ============================================================
   This file extends Dawn's default header with premium behavior.
   It only loads when "Enable Premium Header" is turned ON.
   
   Phase 1 includes ONLY:
   - IIFE foundation
   - Shopify section editor event handlers
   - Premium header detection
   
   Future phases will add:
   - Transparent header scroll behavior
   - Mega menu interactions
   - Search predictions
   - Mobile drawer enhancements
   ============================================================ */

(function () {
  'use strict';

  function initPremiumHeader() {
    var headerWrapper = document.querySelector('.header-wrapper--premium');
    if (!headerWrapper) return;

    // Phase 1: Just mark as initialized - foundation only
    headerWrapper.setAttribute('data-hp-initialized', 'true');
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

  // Shopify theme editor: handle section unload cleanup
  document.addEventListener('shopify:section:unload', function (e) {
    if (e.target && e.target.classList && e.target.classList.contains('section-header')) {
      var headerWrapper = e.target.querySelector('.header-wrapper--premium');
      if (headerWrapper) {
        headerWrapper.removeAttribute('data-hp-initialized');
      }
    }
  });
})();
