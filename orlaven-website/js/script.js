/* ============================================
   ORLAVEN — JavaScript
   Handles: Announcement rotation, Sticky header, Mobile menu
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // 1. ANNOUNCEMENT BAR — Auto-rotating messages
    // ============================================
    const announcementMessages = document.querySelectorAll('.announcement-message');
    const announcementBar = document.getElementById('announcementBar');
    const announcementClose = document.getElementById('announcementClose');

    let currentMessageIndex = 0;
    const ROTATION_INTERVAL = 5000; // 5 seconds
    let rotationTimer;

    function rotateAnnouncement() {
        if (announcementMessages.length <= 1) return;

        const currentMessage = announcementMessages[currentMessageIndex];
        currentMessage.classList.remove('active');
        currentMessage.classList.add('exiting');

        currentMessageIndex = (currentMessageIndex + 1) % announcementMessages.length;
        const nextMessage = announcementMessages[currentMessageIndex];

        // Reset all messages first
        announcementMessages.forEach((msg, idx) => {
            if (idx !== currentMessageIndex) {
                msg.classList.remove('active');
            }
        });

        // Small delay before showing next
        setTimeout(() => {
            currentMessage.classList.remove('exiting');
            nextMessage.classList.add('active');
        }, 100);
    }

    function startAnnouncementRotation() {
        rotationTimer = setInterval(rotateAnnouncement, ROTATION_INTERVAL);
    }

    function stopAnnouncementRotation() {
        clearInterval(rotationTimer);
    }

    // Pause on hover
    if (announcementBar) {
        announcementBar.addEventListener('mouseenter', stopAnnouncementRotation);
        announcementBar.addEventListener('mouseleave', startAnnouncementRotation);
    }

    // Close button — hide and remember preference
    if (announcementClose) {
        announcementClose.addEventListener('click', function() {
            announcementBar.classList.add('hidden');
            stopAnnouncementRotation();

            // Remember for this session
            try {
                sessionStorage.setItem('orlaven_announcement_closed', 'true');
            } catch (e) {
                // Silently fail if sessionStorage unavailable
            }
        });

        // Check if previously closed in this session
        try {
            if (sessionStorage.getItem('orlaven_announcement_closed') === 'true') {
                announcementBar.classList.add('hidden');
            } else {
                startAnnouncementRotation();
            }
        } catch (e) {
            startAnnouncementRotation();
        }
    } else {
        startAnnouncementRotation();
    }


    // ============================================
    // 2. HEADER — Sticky behavior on scroll
    // ============================================
    const header = document.getElementById('header');
    const SCROLL_THRESHOLD = 50;

    function handleScroll() {
        if (window.scrollY > SCROLL_THRESHOLD) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Throttle scroll events for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                handleScroll();
                scrollTimeout = null;
            }, 16); // ~60fps
        }
    });


    // ============================================
    // 3. MOBILE MENU — Toggle
    // ============================================
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', function() {
            mobileToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (mobileMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close on resize to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                mobileToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }


    // ============================================
    // 4. CART COUNT — Demo functionality
    // ============================================
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        // You can hook this into your real cart system
        // For now it shows 0 by default
        function updateCartCount(count) {
            cartCount.textContent = count;
            if (count > 0) {
                cartCount.style.display = 'flex';
            } else {
                cartCount.style.display = 'none';
            }
        }

        // Initial state
        updateCartCount(0);

        // Expose globally if needed
        window.OrlavenCart = {
            updateCount: updateCartCount
        };
    }

})();
