// ===== AFANLY Website - Main JavaScript =====
// Author: AFANLY Team
// Description: Core functionality and utilities

'use strict';

// ===== Security: Input Sanitization =====
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// ===== Mobile Menu Toggle =====
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!mobileMenuToggle || !navMenu) return;
    
    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== Smooth Scroll for Anchor Links =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#" or empty
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ===== Active Navigation Link on Scroll =====
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    function updateActiveNav() {
        let current = '';
        const scrollPosition = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call
}

// ===== Scroll to Top Button =====
function initScrollToTop() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollTopBtn);
    
    function toggleScrollBtn() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    }
    
    window.addEventListener('scroll', toggleScrollBtn);
    toggleScrollBtn(); // Initial call
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== Update Copyright Year =====
function updateCopyrightYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ===== Lazy Load Images (Optional Enhancement) =====
function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== Header Scroll Effect =====
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 20px var(--card-shadow)';
        } else {
            header.style.boxShadow = '0 2px 10px var(--card-shadow)';
        }
        
        lastScroll = currentScroll;
    });
}

// ===== Initialize All Functions =====
function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        return;
    }
    
    initMobileMenu();
    initSmoothScroll();
    initActiveNav();
    initScrollToTop();
    updateCopyrightYear();
    initHeaderScroll();
    
    // Optional: Uncomment if using lazy load
    // initLazyLoad();
    
    console.log('%c🛡️ AFANLY Website', 'color: #2563eb; font-size: 20px; font-weight: bold;');
    console.log('%c⚠️ Peringatan: Jangan paste kode apapun di sini!', 'color: #ef4444; font-size: 14px; font-weight: bold;');
}

// Start initialization
init();

// ===== Export functions for use in other modules =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sanitizeInput
    };
}

// ===== Copy to Clipboard Notifications =====
function enableCopyNotifications() {
    // Add copy functionality to email and phone links
    document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]').forEach(link => {
        link.addEventListener('contextmenu', function(e) {
            // Show custom context menu hint
            if (window.Notify) {
                const text = this.textContent.trim();
                navigator.clipboard.writeText(text).then(() => {
                    window.Notify.success(
                        'Tersalin!',
                        `${text} telah disalin ke clipboard.`
                    );
                }).catch(() => {
                    window.Notify.warning(
                        'Gagal Menyalin',
                        'Silakan salin secara manual.'
                    );
                });
            }
        });
    });
}

// ===== Network Status Notifications =====
function initNetworkNotifications() {
    window.addEventListener('online', function() {
        if (window.Notify) {
            window.Notify.success(
                'Koneksi Kembali',
                'Koneksi internet Anda telah pulih.'
            );
        }
    });
    
    window.addEventListener('offline', function() {
        if (window.Notify) {
            window.Notify.warning(
                'Tidak Ada Koneksi',
                'Koneksi internet terputus. Beberapa fitur mungkin tidak berfungsi.',
                [
                    {
                        label: 'OK',
                        callback: 'dismissNotification'
                    }
                ]
            );
        }
    });
}

// Update fungsi init()
function init() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        return;
    }
    
    initMobileMenu();
    initSmoothScroll();
    initActiveNav();
    initScrollToTop();
    updateCopyrightYear();
    initHeaderScroll();
    
    // NEW: Initialize notification features
    setTimeout(() => {
        enableCopyNotifications();
        initNetworkNotifications();
    }, 1000);
}
