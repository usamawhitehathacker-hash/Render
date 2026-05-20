if (!customElements.get('custom-announcement-bar')) {
  customElements.define('custom-announcement-bar', class extends HTMLElement {
    connectedCallback() {
      var self = this;
      self.messages = self.querySelectorAll('.cab__message');
      self.current = 0;
      self.total = self.messages.length;
      self.interval = null;

      var prevBtn = self.querySelector('.cab__arrow--prev');
      var nextBtn = self.querySelector('.cab__arrow--next');
      var closeBtn = self.querySelector('.cab__close');

      if (prevBtn) {
        prevBtn.addEventListener('click', function() {
          self.prev();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function() {
          self.next();
        });
      }

      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          self.dismiss();
        });
      }

      if (self.dataset.autoRotate === 'true' && self.total > 1) {
        self.startAutoRotate();
      }
    }

    goTo(index) {
      var self = this;
      self.messages[self.current].classList.remove('is-active');
      self.current = (index + self.total) % self.total;
      self.messages[self.current].classList.add('is-active');
    }

    next() {
      this.goTo(this.current + 1);
      this.resetAutoRotate();
    }

    prev() {
      this.goTo(this.current - 1);
      this.resetAutoRotate();
    }

    startAutoRotate() {
      var self = this;
      var speed = parseInt(self.dataset.speed, 10) || 5;
      self.interval = setInterval(function() {
        self.goTo(self.current + 1);
      }, speed * 1000);
    }

    resetAutoRotate() {
      var self = this;
      if (self.interval) {
        clearInterval(self.interval);
        self.interval = null;
      }
      if (self.dataset.autoRotate === 'true' && self.total > 1) {
        self.startAutoRotate();
      }
    }

    dismiss() {
      var self = this;
      try {
        sessionStorage.setItem('cab-dismissed-' + self.dataset.sectionId, 'true');
      } catch(e) {}
      self.remove();
    }

    disconnectedCallback() {
      if (this.interval) {
        clearInterval(this.interval);
      }
    }
  });
}
