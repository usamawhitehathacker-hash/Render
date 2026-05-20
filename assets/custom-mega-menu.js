(function() {
  'use strict';

  if (!customElements.get('custom-mega-menu')) {

    function CustomMegaMenu() {
      return Reflect.construct(HTMLElement, [], CustomMegaMenu);
    }

    CustomMegaMenu.prototype = Object.create(HTMLElement.prototype);
    CustomMegaMenu.prototype.constructor = CustomMegaMenu;

    CustomMegaMenu.prototype.connectedCallback = function() {
      var self = this;

      self._trigger = self.getAttribute('data-trigger') || 'hover';
      self._mobileStyle = self.getAttribute('data-mobile-style') || 'drawer-left';
      self._hoverTimeout = null;
      self._isDesktop = window.matchMedia('(min-width: 990px)');

      self._menuItems = self.querySelectorAll('.cmm__menu-item--has-dropdown');
      self._mobileToggle = self.querySelector('.cmm__mobile-toggle');
      self._mobileDrawer = self.querySelector('.cmm__mobile-drawer');
      self._mobileClose = self.querySelector('.cmm__mobile-close');
      self._mobileSubToggles = self.querySelectorAll('.cmm__mobile-toggle-sub');
      self._backdrop = self.querySelector('.cmm__backdrop');

      self._bindDesktopEvents();
      self._bindMobileEvents();
      self._bindKeyboard();
      self._bindScroll();
      self._updateCartCount();

      if (self._backdrop) {
        self._backdrop.addEventListener('click', function() {
          self._closeAllDropdowns();
          self._closeMobile();
        });
      }
    };

    CustomMegaMenu.prototype.disconnectedCallback = function() {
      if (this._scrollHandler) {
        window.removeEventListener('scroll', this._scrollHandler);
      }
    };

    /* ---------- Desktop Events ---------- */
    CustomMegaMenu.prototype._bindDesktopEvents = function() {
      var self = this;

      for (var i = 0; i < self._menuItems.length; i++) {
        (function(item) {
          var link = item.querySelector('.cmm__menu-link');

          if (self._trigger === 'hover') {
            item.addEventListener('mouseenter', function() {
              clearTimeout(self._hoverTimeout);
              self._openDropdown(item);
            });

            item.addEventListener('mouseleave', function() {
              self._hoverTimeout = setTimeout(function() {
                self._closeDropdown(item);
              }, 150);
            });
          }

          if (self._trigger === 'click' && link) {
            link.addEventListener('click', function(e) {
              if (item.classList.contains('cmm__menu-item--has-dropdown')) {
                e.preventDefault();
                if (item.classList.contains('cmm__menu-item--active')) {
                  self._closeDropdown(item);
                } else {
                  self._closeAllDropdowns();
                  self._openDropdown(item);
                }
              }
            });
          }
        })(self._menuItems[i]);
      }

      document.addEventListener('click', function(e) {
        if (self._trigger === 'click' && !self.contains(e.target)) {
          self._closeAllDropdowns();
        }
      });
    };

    /* ---------- Open / Close Dropdown ---------- */
    CustomMegaMenu.prototype._openDropdown = function(item) {
      item.classList.add('cmm__menu-item--active');
      var link = item.querySelector('.cmm__menu-link');
      if (link) {
        link.setAttribute('aria-expanded', 'true');
      }
      this.classList.add('cmm--dropdown-open');
    };

    CustomMegaMenu.prototype._closeDropdown = function(item) {
      item.classList.remove('cmm__menu-item--active');
      var link = item.querySelector('.cmm__menu-link');
      if (link) {
        link.setAttribute('aria-expanded', 'false');
      }
      var anyActive = this.querySelector('.cmm__menu-item--active');
      if (!anyActive) {
        this.classList.remove('cmm--dropdown-open');
      }
    };

    CustomMegaMenu.prototype._closeAllDropdowns = function() {
      var items = this.querySelectorAll('.cmm__menu-item--active');
      for (var i = 0; i < items.length; i++) {
        items[i].classList.remove('cmm__menu-item--active');
        var link = items[i].querySelector('.cmm__menu-link');
        if (link) {
          link.setAttribute('aria-expanded', 'false');
        }
      }
      this.classList.remove('cmm--dropdown-open');
    };

    /* ---------- Mobile Events ---------- */
    CustomMegaMenu.prototype._bindMobileEvents = function() {
      var self = this;

      if (self._mobileToggle) {
        self._mobileToggle.addEventListener('click', function() {
          if (self.classList.contains('cmm--mobile-open')) {
            self._closeMobile();
          } else {
            self._openMobile();
          }
        });
      }

      if (self._mobileClose) {
        self._mobileClose.addEventListener('click', function() {
          self._closeMobile();
        });
      }

      for (var i = 0; i < self._mobileSubToggles.length; i++) {
        (function(toggle) {
          toggle.addEventListener('click', function() {
            var parentItem = toggle.closest('.cmm__mobile-item');
            if (parentItem) {
              var isOpen = parentItem.classList.contains('cmm__mobile-item--open');
              if (isOpen) {
                parentItem.classList.remove('cmm__mobile-item--open');
                toggle.setAttribute('aria-expanded', 'false');
              } else {
                parentItem.classList.add('cmm__mobile-item--open');
                toggle.setAttribute('aria-expanded', 'true');
              }
            }
          });
        })(self._mobileSubToggles[i]);
      }
    };

    CustomMegaMenu.prototype._openMobile = function() {
      this.classList.add('cmm--mobile-open');
      document.body.classList.add('cmm-no-scroll');
      if (this._mobileToggle) {
        this._mobileToggle.setAttribute('aria-expanded', 'true');
      }
      if (this._mobileDrawer) {
        this._mobileDrawer.setAttribute('aria-hidden', 'false');
      }
    };

    CustomMegaMenu.prototype._closeMobile = function() {
      this.classList.remove('cmm--mobile-open');
      document.body.classList.remove('cmm-no-scroll');
      if (this._mobileToggle) {
        this._mobileToggle.setAttribute('aria-expanded', 'false');
      }
      if (this._mobileDrawer) {
        this._mobileDrawer.setAttribute('aria-hidden', 'true');
      }
    };

    /* ---------- Keyboard ---------- */
    CustomMegaMenu.prototype._bindKeyboard = function() {
      var self = this;

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
          self._closeAllDropdowns();
          self._closeMobile();
        }
      });

      var menuLinks = self.querySelectorAll('.cmm__menu-item--has-dropdown > .cmm__menu-link');
      for (var i = 0; i < menuLinks.length; i++) {
        (function(link) {
          link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ' || e.keyCode === 13 || e.keyCode === 32) {
              var item = link.closest('.cmm__menu-item');
              if (item && item.classList.contains('cmm__menu-item--has-dropdown')) {
                e.preventDefault();
                if (item.classList.contains('cmm__menu-item--active')) {
                  self._closeDropdown(item);
                } else {
                  self._closeAllDropdowns();
                  self._openDropdown(item);
                }
              }
            }
          });
        })(menuLinks[i]);
      }
    };

    /* ---------- Sticky Scroll ---------- */
    CustomMegaMenu.prototype._bindScroll = function() {
      var self = this;

      if (!self.classList.contains('cmm--sticky')) {
        return;
      }

      self._scrollHandler = function() {
        if (window.pageYOffset > 100 || document.documentElement.scrollTop > 100) {
          self.classList.add('cmm--scrolled');
        } else {
          self.classList.remove('cmm--scrolled');
        }
      };

      window.addEventListener('scroll', self._scrollHandler, { passive: true });
    };

    /* ---------- Cart Count ---------- */
    CustomMegaMenu.prototype._updateCartCount = function() {
      var self = this;
      var countEl = self.querySelector('[data-cart-count]');
      if (!countEl) return;

      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/cart.js', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          try {
            var cart = JSON.parse(xhr.responseText);
            countEl.textContent = cart.item_count > 0 ? cart.item_count : '';
          } catch (e) {
            // silently fail
          }
        }
      };
      xhr.send();
    };

    Object.setPrototypeOf(CustomMegaMenu.prototype, HTMLElement.prototype);
    Object.setPrototypeOf(CustomMegaMenu, HTMLElement);

    customElements.define('custom-mega-menu', CustomMegaMenu);
  }
})();
