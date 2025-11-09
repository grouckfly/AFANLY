// ===== AFANLY Website - Dark Mode Handler =====
// Author: AFANLY Team
// Description: Dark mode toggle and persistence

'use strict';

// ===== Dark Mode Configuration =====
const DARK_MODE_KEY = 'afanly-dark-mode';

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
        localStorage.setItem(DARK_MODE_KEY, enabled ? 'enabled' : 'disabled');
    },
    
    // Apply dark mode
    apply(enabled) {
        const body = document.body;
        
        if (enabled) {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
        
        this.setPreference(enabled);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('darkModeChange', {
            detail: { enabled }
        }));
    },
    
    // Toggle dark mode
    toggle() {
        const isCurrentlyDark = document.body.classList.contains('dark-mode');
        this.apply(!isCurrentlyDark);
    },
    
    // Initialize dark mode
    init() {
        // Apply saved preference or system preference
        const isDark = this.getPreference();
        
        // Apply immediately to prevent flash
        if (isDark) {
            document.body.classList.add('dark-mode');
        }
        
        // Setup toggle button
        this.setupToggle();
        
        // Listen for system theme changes
        this.setupSystemListener();
    },
    
    // Setup toggle button
    setupToggle() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        
        if (!darkModeToggle) {
            console.warn('Dark mode toggle button not found');
            return;
        }
        
        darkModeToggle.addEventListener('click', () => {
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
    }
};

// ===== Initialize Dark Mode Immediately =====
// This runs before DOMContentLoaded to prevent flash of wrong theme
(function() {
    const isDark = localStorage.getItem(DARK_MODE_KEY) === 'enabled' ||
                   (localStorage.getItem(DARK_MODE_KEY) === null && 
                    window.matchMedia && 
                    window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
        document.documentElement.classList.add('dark-mode');
        if (document.body) {
            document.body.classList.add('dark-mode');
        }
    }
})();

// ===== Initialize When DOM is Ready =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        DarkModeManager.init();
    });
} else {
    DarkModeManager.init();
}

// ===== Export for use in other modules =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DarkModeManager;
}
