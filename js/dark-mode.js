// ===== AFANLY Website - Dark Mode Handler (Vercel Fixed) =====
// Author: AFANLY Team
// Description: Dark mode toggle and persistence with Vercel compatibility

'use strict';

// ===== Dark Mode Configuration =====
const DARK_MODE_KEY = 'afanly-dark-mode';

// ===== Immediate Dark Mode Check (Before DOM Load) =====
(function() {
    // Force clear any stuck dark mode on first load
    if (window.location.search.includes('reset-theme')) {
        localStorage.removeItem(DARK_MODE_KEY);
        // Remove query param
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Check if we should apply dark mode
    function shouldApplyDarkMode() {
        const saved = localStorage.getItem(DARK_MODE_KEY);
        
        // If explicitly set, use that
        if (saved !== null) {
            return saved === 'enabled';
        }
        
        // Otherwise check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return true;
        }
        
        // Default to light mode
        return false;
    }
    
    // Apply immediately to prevent flash
    if (shouldApplyDarkMode()) {
        document.documentElement.classList.add('dark-mode');
        if (document.body) {
            document.body.classList.add('dark-mode');
        }
    } else {
        // Explicitly remove to prevent stuck dark mode
        document.documentElement.classList.remove('dark-mode');
        if (document.body) {
            document.body.classList.remove('dark-mode');
        }
    }
})();

// ===== Dark Mode Manager =====
const DarkModeManager = {
    // Get dark mode preference
    getPreference() {
        const saved = localStorage.getItem(DARK_MODE_KEY);
        
        if (saved !== null) {
            return saved === 'enabled';
        }
        
        // Check system preference
        if (window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        
        return false;
    },
    
    // Set dark mode preference
    setPreference(enabled) {
        try {
            localStorage.setItem(DARK_MODE_KEY, enabled ? 'enabled' : 'disabled');
        } catch (e) {
            console.warn('Could not save dark mode preference:', e);
        }
    },
    
    // Apply dark mode
    apply(enabled) {
        const body = document.body;
        const html = document.documentElement;
        
        if (enabled) {
            body.classList.add('dark-mode');
            html.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
            html.classList.remove('dark-mode');
        }
        
        this.setPreference(enabled);
        
        // Dispatch custom event
        try {
            window.dispatchEvent(new CustomEvent('darkModeChange', {
                detail: { enabled }
            }));
        } catch (e) {
            console.warn('Could not dispatch dark mode event:', e);
        }
    },
    
    // Toggle dark mode
    toggle() {
        const isCurrentlyDark = document.body.classList.contains('dark-mode');
        this.apply(!isCurrentlyDark);
    },
    
    // Initialize dark mode
    init() {
        // Verify current state matches preference
        const shouldBeDark = this.getPreference();
        const isCurrentlyDark = document.body.classList.contains('dark-mode');
        
        // Fix if out of sync
        if (shouldBeDark !== isCurrentlyDark) {
            this.apply(shouldBeDark);
        }
        
        // Setup toggle button
        this.setupToggle();
        
        // Listen for system theme changes
        this.setupSystemListener();
        
        console.log('Dark mode initialized:', shouldBeDark ? 'DARK' : 'LIGHT');
    },
    
    // Setup toggle button
    setupToggle() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        
        if (!darkModeToggle) {
            console.warn('Dark mode toggle button not found');
            return;
        }
        
        darkModeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggle();
        });
        
        // Add keyboard support
        darkModeToggle.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggle();
            }
        });
    },
    
    // Listen for system theme changes
    setupSystemListener() {
        if (!window.matchMedia) return;
        
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Modern browsers
        if (darkModeQuery.addEventListener) {
            darkModeQuery.addEventListener('change', (e) => {
                // Only apply if user hasn't set a manual preference
                const manualPreference = localStorage.getItem(DARK_MODE_KEY);
                if (manualPreference === null) {
                    this.apply(e.matches);
                }
            });
        }
        // Older browsers
        else if (darkModeQuery.addListener) {
            darkModeQuery.addListener((e) => {
                const manualPreference = localStorage.getItem(DARK_MODE_KEY);
                if (manualPreference === null) {
                    this.apply(e.matches);
                }
            });
        }
    },
    
    // Reset dark mode (for debugging)
    reset() {
        localStorage.removeItem(DARK_MODE_KEY);
        this.apply(false);
        console.log('Dark mode reset to light');
    }
};

// ===== Initialize When DOM is Ready =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        DarkModeManager.init();
    });
} else {
    DarkModeManager.init();
}

// ===== Expose for debugging =====
window.DarkModeManager = DarkModeManager;

// ===== Export for use in other modules =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DarkModeManager;
}
