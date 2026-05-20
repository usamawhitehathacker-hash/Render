/**
 * Custom Announcement Bar - Web Component
 * Handles auto-rotation, navigation, close/dismiss, countdown timer
 */

if (!customElements.get('custom-announcement-bar')) {
  class CustomAnnouncementBar extends HTMLElement {
    constructor() {
      super();
      this.currentIndex = 0;
      this.rotateInterval = null;
      this.countdownInterval = null;
      this.isPaused = false;
      this.isTransitioning = false;
    }

    connectedCallback() {
      this.sectionId = this.dataset.sectionId;
      this.autoRotate = this.dataset.autoRotate === 'true';
      this.rotateSpeed = parseInt(this.dataset.rotateSpeed, 10) * 1000;
      this.pauseOnHover = this.dataset.pauseOnHover === 'true';
      this.closeBehavior = this.dataset.closeBehavior;
      this.showCountdown = this.dataset.showCountdown === 'true';
      this.countdownDate = this.dataset.countdownDate;
      this.countdownEndAction = this.dataset.countdownEndAction;
      this.countdownEndMessage = this.dataset.countdownEndMessage;
      this.messageCount = parseInt(this.dataset.messageCount, 10);

      this.messages = this.querySelectorAll('.announcement-bar__message');
      this.prevBtn = this.querySelector('.announcement-bar__arrow--prev');
      this.nextBtn = this.querySelector('.announcement-bar__arrow--next');
      this.closeBtn = this.querySelector('.announcement-bar__close');

      if (this.isDismissed()) {
        this.setAttribute('aria-hidden', 'true');
        return;
      }

      this.bindEvents();

      if (this.autoRotate && this.messageCount > 1) {
        this.startRotation();
      }

      if (this.showCountdown && this.countdownDate) {
        this.startCountdown();
      }
    }

    disconnectedCallback() {
      this.stopRotation();
      this.stopCountdown();
    }

    bindEvents() {
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', this.handlePrev.bind(this));
        this.prevBtn.addEventListener('keydown', this.handleArrowKey.bind(this, 'prev'));
      }
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', this.handleNext.bind(this));
        this.nextBtn.addEventListener('keydown', this.handleArrowKey.bind(this, 'next'));
      }
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', this.handleClose.bind(this));
      }
      if (this.pauseOnHover) {
        this.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
        this.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
      }
    }

    handleArrowKey(direction, e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (direction === 'prev') {
          this.handlePrev();
        } else {
          this.handleNext();
        }
      }
    }

    handlePrev() {
      if (this.isTransitioning) return;
      var newIndex = this.currentIndex - 1;
      if (newIndex < 0) newIndex = this.messageCount - 1;
      this.goToMessage(newIndex);
      this.resetRotation();
    }

    handleNext() {
      if (this.isTransitioning) return;
      var newIndex = this.currentIndex + 1;
      if (newIndex >= this.messageCount) newIndex = 0;
      this.goToMessage(newIndex);
      this.resetRotation();
    }

    handleClose() {
      this.classList.add('is-closing');
      this.saveDismissal();
      var self = this;
      setTimeout(function() {
        self.setAttribute('aria-hidden', 'true');
        self.classList.remove('is-closing');
        self.stopRotation();
        self.stopCountdown();
      }, 300);
    }

    handleMouseEnter() {
      this.isPaused = true;
      this.stopRotation();
    }

    handleMouseLeave() {
      this.isPaused = false;
      if (this.autoRotate && this.messageCount > 1) {
        this.startRotation();
      }
    }

    goToMessage(index) {
      if (index === this.currentIndex) return;
      this.isTransitioning = true;

      var currentMsg = this.messages[this.currentIndex];
      var nextMsg = this.messages[index];

      currentMsg.classList.add('is-exiting');
      currentMsg.classList.remove('is-active');
      currentMsg.removeAttribute('aria-current');

      nextMsg.classList.add('is-active');
      nextMsg.setAttribute('aria-current', 'true');

      this.currentIndex = index;

      var self = this;
      setTimeout(function() {
        currentMsg.classList.remove('is-exiting');
        self.isTransitioning = false;
      }, 450);
    }

    startRotation() {
      this.stopRotation();
      var self = this;
      this.rotateInterval = setInterval(function() {
        if (!self.isPaused && !self.isTransitioning) {
          var nextIndex = self.currentIndex + 1;
          if (nextIndex >= self.messageCount) nextIndex = 0;
          self.goToMessage(nextIndex);
        }
      }, this.rotateSpeed);
    }

    stopRotation() {
      if (this.rotateInterval) {
        clearInterval(this.rotateInterval);
        this.rotateInterval = null;
      }
    }

    resetRotation() {
      if (this.autoRotate && this.messageCount > 1 && !this.isPaused) {
        this.startRotation();
      }
    }

    startCountdown() {
      this.updateCountdown();
      var self = this;
      this.countdownInterval = setInterval(function() {
        self.updateCountdown();
      }, 1000);
    }

    stopCountdown() {
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
    }

    updateCountdown() {
      var target = new Date(this.countdownDate).getTime();
      var now = new Date().getTime();
      var diff = target - now;

      if (diff <= 0) {
        this.handleCountdownEnd();
        return;
      }

      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var secs = Math.floor((diff % (1000 * 60)) / 1000);

      var daysEls = this.querySelectorAll('[data-countdown-days]');
      var hoursEls = this.querySelectorAll('[data-countdown-hours]');
      var minsEls = this.querySelectorAll('[data-countdown-mins]');
      var secsEls = this.querySelectorAll('[data-countdown-secs]');

      for (var i = 0; i < daysEls.length; i++) {
        daysEls[i].textContent = this.padZero(days);
      }
      for (var i = 0; i < hoursEls.length; i++) {
        hoursEls[i].textContent = this.padZero(hours);
      }
      for (var i = 0; i < minsEls.length; i++) {
        minsEls[i].textContent = this.padZero(mins);
      }
      for (var i = 0; i < secsEls.length; i++) {
        secsEls[i].textContent = this.padZero(secs);
      }
    }

    padZero(num) {
      return num < 10 ? '0' + num : String(num);
    }

    handleCountdownEnd() {
      this.stopCountdown();

      if (this.countdownEndAction === 'hide-bar') {
        this.handleClose();
      } else if (this.countdownEndAction === 'show-message') {
        var textEls = this.querySelectorAll('.announcement-bar__text');
        for (var i = 0; i < textEls.length; i++) {
          textEls[i].textContent = this.countdownEndMessage;
        }
        var countdownEls = this.querySelectorAll('.announcement-bar__countdown');
        for (var i = 0; i < countdownEls.length; i++) {
          countdownEls[i].style.display = 'none';
        }
      }
    }

    isDismissed() {
      var storageKey = 'announcement-bar-dismissed-' + this.sectionId;
      if (this.closeBehavior === 'permanent') {
        return localStorage.getItem(storageKey) === 'true';
      }
      return sessionStorage.getItem(storageKey) === 'true';
    }

    saveDismissal() {
      var storageKey = 'announcement-bar-dismissed-' + this.sectionId;
      if (this.closeBehavior === 'permanent') {
        localStorage.setItem(storageKey, 'true');
      } else {
        sessionStorage.setItem(storageKey, 'true');
      }
    }
  }

  customElements.define('custom-announcement-bar', CustomAnnouncementBar);
}
