/* ============================================================
   PREMIUM HEADER - Phase 1 + Phase 2 JavaScript
   ============================================================
   This file extends Dawn's default header with premium behavior.
   It only loads when "Enable Premium Header" is turned ON.
   
   Phase 1: Foundation IIFE + Shopify editor events
   Phase 2: Transparent header content offset, sticky logo handling
   ============================================================ */

(function () {
  'use strict';

  function initPremiumHeader() {
    var headerWrapper = document.querySelector('.header-wrapper--premium');
    if (!headerWrapper) return;

    headerWrapper.setAttribute('data-hp-initialized', 'true');

    // Phase 2: Transparent header content offset
    handleTransparentHeader();
  }

  /**
   * Phase 2: When transparent header is active, the next section
   * (usually a hero/image-banner) needs to start at top of page,
   * not below the header. We mark the section-header so adjacent
   * sections can know via CSS sibling selector.
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
      e.target.removeAttribute('data-hp-has-transparent');
    }
  });
})();
