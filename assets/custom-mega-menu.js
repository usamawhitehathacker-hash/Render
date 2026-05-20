/* ============================================================
   CUSTOM MEGA MENU - JavaScript
   Web Component Pattern (Modern Standard)
   ============================================================ */

class CustomMegaMenu extends HTMLElement {
  constructor() {
    super();
    
    // Configuration from data attributes
    this.trigger = this.dataset.trigger || 'hover';
    this.mobileStyle = this.dataset.mobileStyle || 'drawer-left';
    
    // Element references
    this.menuItems = this.querySelectorAll('.cmm__menu-item--has-dropdown');
    this.backdrop = this.querySelector('.cmm__backdrop');
    this.mobileToggle = this.querySelector('.cmm__mobile-toggle');
    this.mobileClose = this.querySelector('.cmm__mobile-close');
    this.mobileDrawer = this.querySelector('.cmm__mobile-drawer');
    this.mobileSubToggles = this.querySelectorAll('.cmm__mobile-toggle-sub');
    
    // State
    this.activeItem = null;
    this.hoverTimeout = null;
    this.scrollY = 0;
    
    this.init();
  }
  
  init() {
    this.bindDesktopEvents();
    this.bindMobileEvents();
    this.bindStickyBehavior();
    this.bindKeyboardEvents();
    this.bindCartUpdate();
  }
  
  /* ========== DESKTOP DROPDOWN ========== */
  bindDesktopEvents() {
    this.menuItems.forEach((item) => {
      const link = item.querySelector('.cmm__menu-link');
      
      if (this.trigger === 'hover') {
        item.addEventListener('mouseenter', () => this.openDropdown(item));
        item.addEventListener('mouseleave', () => this.closeDropdownDelayed(item));
      } else {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleDropdown(item);
        });
      }
    });
    
    // Close on backdrop click
    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => this.closeAllDropdowns());
    }
    
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) {
        this.closeAllDropdowns();
      }
    });
  }
  
  openDropdown(item) {
    clearTimeout(this.hoverTimeout);
    
    // Close other open dropdowns
    this.menuItems.forEach((mi) => {
      if (mi !== item) {
        mi.classList.remove('cmm__menu-item--active');
        const link = mi.querySelector('.cmm__menu-link');
        if (link) link.setAttribute('aria-expanded', 'false');
      }
    });
    
    item.classList.add('cmm__menu-item--active');
    const link = item.querySelector('.cmm__menu-link');
    if (link) link.setAttribute('aria-expanded', 'true');
    
    this.classList.add('cmm--dropdown-open');
    this.activeItem = item;
  }
  
  closeDropdownDelayed(item) {
    this.hoverTimeout = setTimeout(() => {
      this.closeDropdown(item);
    }, 150);
  }
  
  closeDropdown(item) {
    item.classList.remove('cmm__menu-item--active');
    const link = item.querySelector('.cmm__menu-link');
    if (link) link.setAttribute('aria-expanded', 'false');
    
    if (this.activeItem === item) {
      this.activeItem = null;
      this.classList.remove('cmm--dropdown-open');
    }
  }
  
  closeAllDropdowns() {
    this.menuItems.forEach((item) => {
      item.classList.remove('cmm__menu-item--active');
      const link = item.querySelector('.cmm__menu-link');
      if (link) link.setAttribute('aria-expanded', 'false');
    });
    this.classList.remove('cmm--dropdown-open');
    this.activeItem = null;
  }
  
  toggleDropdown(item) {
    if (item.classList.contains('cmm__menu-item--active')) {
      this.closeDropdown(item);
    } else {
      this.openDropdown(item);
    }
  }
  
  /* ========== MOBILE DRAWER ========== */
  bindMobileEvents() {
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', () => this.openMobile());
    }
    
    if (this.mobileClose) {
      this.mobileClose.addEventListener('click', () => this.closeMobile());
    }
    
    // Mobile submenu toggles
    this.mobileSubToggles.forEach((toggle) => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const item = toggle.closest('.cmm__mobile-item');
        const isOpen = item.classList.contains('cmm__mobile-item--open');
        
        // Close other open items
        this.querySelectorAll('.cmm__mobile-item--open').forEach((openItem) => {
          if (openItem !== item) {
            openItem.classList.remove('cmm__mobile-item--open');
            const t = openItem.querySelector('.cmm__mobile-toggle-sub');
            if (t) t.setAttribute('aria-expanded', 'false');
          }
        });
        
        item.classList.toggle('cmm__mobile-item--open');
        toggle.setAttribute('aria-expanded', !isOpen);
      });
    });
    
    // Close mobile on backdrop tap (anywhere outside drawer)
    document.addEventListener('click', (e) => {
      if (this.classList.contains('cmm--mobile-open')) {
        if (this.mobileDrawer && !this.mobileDrawer.contains(e.target) 
            && !this.mobileToggle.contains(e.target)) {
          this.closeMobile();
        }
      }
    });
  }
  
  openMobile() {
    this.classList.add('cmm--mobile-open');
    document.body.classList.add('cmm-no-scroll');
    
    if (this.mobileToggle) {
      this.mobileToggle.setAttribute('aria-expanded', 'true');
    }
    if (this.mobileDrawer) {
      this.mobileDrawer.setAttribute('aria-hidden', 'false');
    }
  }
  
  closeMobile() {
    this.classList.remove('cmm--mobile-open');
    document.body.classList.remove('cmm-no-scroll');
    
    if (this.mobileToggle) {
      this.mobileToggle.setAttribute('aria-expanded', 'false');
    }
    if (this.mobileDrawer) {
      this.mobileDrawer.setAttribute('aria-hidden', 'true');
    }
  }
  
  /* ========== STICKY ON SCROLL ========== */
  bindStickyBehavior() {
    if (!this.classList.contains('cmm--sticky')) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }
  
  handleScroll() {
    const currentY = window.scrollY;
    
    if (currentY > 100) {
      this.classList.add('cmm--scrolled');
    } else {
      this.classList.remove('cmm--scrolled');
    }
    
    this.scrollY = currentY;
  }
  
  /* ========== KEYBOARD NAVIGATION ========== */
  bindKeyboardEvents() {
    this.menuItems.forEach((item) => {
      const link = item.querySelector('.cmm__menu-link');
      
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleDropdown(item);
        }
        if (e.key === 'Escape') {
          this.closeDropdown(item);
          link.focus();
        }
      });
    });
    
    // ESC closes mobile menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.classList.contains('cmm--mobile-open')) {
          this.closeMobile();
        }
        if (this.classList.contains('cmm--dropdown-open')) {
          this.closeAllDropdowns();
        }
      }
    });
  }
  
  /* ========== CART UPDATE ========== */
  bindCartUpdate() {
    // Listen to cart updates from Shopify
    document.addEventListener('cart:updated', (e) => {
      this.updateCartCount(e.detail.cart.item_count);
    });
    
    // Also fetch on page load to ensure accuracy
    this.fetchCartCount();
  }
  
  async fetchCartCount() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      this.updateCartCount(cart.item_count);
    } catch (error) {
      console.error('Cart fetch error:', error);
    }
  }
  
  updateCartCount(count) {
    const countEl = this.querySelector('[data-cart-count]');
    if (countEl) {
      countEl.textContent = count;
      countEl.style.display = count > 0 ? 'inline-flex' : 'none';
    }
  }
}

// Register the custom element
if (!customElements.get('custom-mega-menu')) {
  customElements.define('custom-mega-menu', CustomMegaMenu);
}
