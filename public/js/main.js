document.addEventListener("DOMContentLoaded", function () {
    // Inisialisasi utama
    initLoadingAndWelcomeScreen(); // Panggil ini paling awal
    initDarkMode();
    initSidebar();
    initDevNotif();
    initYear();
    initValidation();
    initKritikSaranModal();

    // Hanya inisialisasi services jika ada elemen terkait
    if (document.querySelector(".services .card-wrapper")) {
        initServicesSection();
        startAutoScrollCardWrapper();
    }
});

/* -------------------- DARK MODE -------------------- */
function initDarkMode() {
    const toggle = document.getElementById("darkModeToggle");
    const sidebarDarkBtn = document.getElementById("sidebarDarkModeToggle");
    const body = document.body;

    const sunIcon = toggle ? toggle.querySelector(".sun-icon") : null;
    const moonIcon = toggle ? toggle.querySelector(".moon-icon") : null;
    const modeText = toggle ? toggle.querySelector(".mode-text") : null;

    const sidebarSunIcon = sidebarDarkBtn ? sidebarDarkBtn.querySelector(".sun-icon") : null;
    const sidebarMoonIcon = sidebarDarkBtn ? sidebarDarkBtn.querySelector(".moon-icon") : null;
    const sidebarModeText = sidebarDarkBtn ? sidebarDarkBtn.querySelector(".mode-text") : null;

    function applyTheme(theme) {
        const isDarkMode = theme === "dark";
        if (isDarkMode) {
            body.classList.add("dark-mode");
            if (sunIcon) sunIcon.style.opacity = "0";
            if (moonIcon) moonIcon.style.opacity = "1";
            if (modeText) modeText.textContent = "Mode Gelap";

            if (sidebarSunIcon) sidebarSunIcon.style.opacity = "0";
            if (sidebarMoonIcon) sidebarMoonIcon.style.opacity = "1";
            if (sidebarModeText) sidebarModeText.textContent = "Mode Gelap";
        } else {
            body.classList.remove("dark-mode");
            if (sunIcon) sunIcon.style.opacity = "1";
            if (moonIcon) moonIcon.style.opacity = "0";
            if (modeText) modeText.textContent = "Mode Cerah";

            if (sidebarSunIcon) sidebarSunIcon.style.opacity = "1";
            if (sidebarMoonIcon) sidebarMoonIcon.style.opacity = "0";
            if (sidebarModeText) sidebarModeText.textContent = "Mode Cerah";
        }
        localStorage.setItem("theme", theme);
        updateAriaAttributes();
    }

    function updateAriaAttributes() {
        const isDark = body.classList.contains("dark-mode");
        [toggle, sidebarDarkBtn].forEach((btn) => {
            if (btn) {
                btn.setAttribute("aria-checked", isDark.toString());
            }
        });
    }

    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
        applyTheme(storedTheme);
    } else {
        const hour = new Date().getHours();
        const autoTheme = hour >= 18 || hour < 6 ? "dark" : "light";
        applyTheme(autoTheme);
    }

    [toggle, sidebarDarkBtn].forEach((btn) => {
        if (btn) {
            btn.addEventListener("click", () => {
                const isCurrentlyDark = body.classList.contains("dark-mode");
                const newTheme = isCurrentlyDark ? "light" : "dark";
                applyTheme(newTheme);
            });
        }
    });

    updateAriaAttributes();
}

/* -------------------- SIDEBAR -------------------- */
function initSidebar() {
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener("click", () => {
            sidebar.classList.toggle("active");
            document.body.classList.toggle("sidebar-open", sidebar.classList.contains("active"));
        });
    }

    document.addEventListener("click", (e) => {
        if (sidebar && sidebarToggle && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove("active");
            document.body.classList.remove("sidebar-open");
        }
    });

    const sidebarLinks = document.querySelectorAll(".sidebar-links a");
    sidebarLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (sidebar) {
                sidebar.classList.remove("active");
                document.body.classList.remove("sidebar-open");
            }
        });
    });
}

/* -------------------- DEV NOTIF -------------------- */
function initDevNotif() {
    const notif = document.getElementById('dev-notif');
    const closeBtn = document.getElementById('notif-close');
    const footerToggleBtn = document.getElementById('toggle-notif');
    const sidebarToggleBtn = document.getElementById('sidebar-notif-toggle');

    if (!notif) {
        console.warn("Dev notification element not found.");
        return;
    }

    setTimeout(() => {
        notif.classList.add('active');
    }, 1000);

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notif.classList.remove('active');
        });
    }

    if (footerToggleBtn) {
        footerToggleBtn.addEventListener('click', () => {
            notif.classList.toggle('active');
        });
    }

    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', () => {
            notif.classList.toggle('active');
            const sidebar = document.getElementById("sidebar");
            if (sidebar && sidebar.classList.contains("active")) {
                sidebar.classList.remove("active");
                document.body.classList.remove("sidebar-open");
            }
        });
    }

    setTimeout(() => {
        notif.classList.remove('active');
    }, 7000);
}

/* -------------------- FOOTER YEAR -------------------- */
function initYear() {
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/* -------------------- SECTION SERVICES -------------------- */
function initServicesSection() {
    const cardWrapper = document.querySelector(".services .card-wrapper");

    if (!cardWrapper) {
        console.warn("Services section tidak ditemukan, melewati initServicesSection.");
        return;
    }

    console.log("Inisialisasi initServicesSection berhasil.");

    let isDown = false,
        startX,
        scrollLeft;

    cardWrapper.addEventListener("mousedown", (e) => {
        isDown = true;
        cardWrapper.classList.add("dragging");
        startX = e.pageX - cardWrapper.offsetLeft;
        scrollLeft = cardWrapper.scrollLeft;
    });

    cardWrapper.addEventListener("mouseleave", () => {
        isDown = false;
        cardWrapper.classList.remove("dragging");
    });

    cardWrapper.addEventListener("mouseup", () => {
        isDown = false;
        cardWrapper.classList.remove("dragging");
    });

    cardWrapper.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - cardWrapper.offsetLeft;
        const walk = (x - startX) * 1.5;
        cardWrapper.scrollLeft = scrollLeft - walk;
    });
}

/* -------------------- Auto Swipe -------------------- */
function startAutoScrollCardWrapper(
    selector = ".services .card-wrapper",
    intervalMs = 3000
) {
    const cardWrapper = document.querySelector(selector);

    if (!cardWrapper) {
        console.warn("Card wrapper tidak ditemukan, auto-scroll akan dilewati.");
        return;
    }

    console.log("Inisialisasi startAutoScrollCardWrapper berhasil.");

    const cards = cardWrapper.querySelectorAll(".photocard");
    if (!cards.length) return;

    let idx = 0;
    let interval = null;
    let isUserInteracting = false;
    let userInteractedTimeout = null;

    function scrollToCard(i) {
        if (!cards[i]) return;

        const card = cards[i];
        const cardOffset = card.offsetLeft;
        const paddingLeft =
            parseInt(getComputedStyle(cardWrapper).paddingLeft) || 0;

        cardWrapper.scroll({
            left: cardOffset - paddingLeft,
            behavior: "smooth",
        });
    }

    function startAutoScroll() {
        stopAutoScroll();
        interval = setInterval(() => {
            if (!isUserInteracting) {
                idx = (idx + 1) % cards.length;
                scrollToCard(idx);
            }
        }, intervalMs);
    }

    function stopAutoScroll() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    }

    function markInteracting() {
        isUserInteracting = true;
        stopAutoScroll();

        if (userInteractedTimeout) clearTimeout(userInteractedTimeout);
        userInteractedTimeout = setTimeout(() => {
            isUserInteracting = false;
            startAutoScroll();
        }, 3000);
    }

    const interactionEvents = [
        "touchstart",
        "pointerdown",
        "mousedown",
        "wheel",
        "keydown",
    ];
    interactionEvents.forEach((evt) => {
        cardWrapper.addEventListener(evt, markInteracting, { passive: true });
    });

    startAutoScroll();
}

/* -------------------- KRITIK DAN SARAN MODAL -------------------- */
function initKritikSaranModal() {
    const modal = document.getElementById("kritik-saran-modal");
    const closeModal = modal ? modal.querySelector(".modal-close") : null;
    const kritikSaranBtns = document.querySelectorAll(".kritik-saran-btn");
    const sidebar = document.getElementById("sidebar");
    const body = document.body;

    if (!modal) {
        console.warn("Kritik & Saran modal not found.");
        return;
    }

    kritikSaranBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            modal.style.display = "flex";

            if (
                btn.id === "sidebar-kritik-saran" &&
                sidebar && sidebar.classList.contains("active")
            ) {
                sidebar.classList.remove("active");
                body.classList.remove("sidebar-open");
            }
        });
    });

    if (closeModal) {
        closeModal.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}

/* -------------------- LOADING AND WELCOME SCREEN -------------------- */
function initLoadingAndWelcomeScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const welcomeScreen = document.getElementById('welcome-screen');
    const loadingText = document.getElementById('loading-text');

    let connectionCheckInterval;
    let offlineTimer = 0;
    let timerInterval;
    let randomMessageInterval; // Interval for rotating random sub-messages
    let isPageFullyLoaded = false;
    let isWelcomeScreenDisplayed = false;
    let hasWelcomeScreenBeenShownOnce = false; // Flag to track if welcome screen has ever been shown

    const randomMessages = [
        "Mengoptimalkan pengalaman Anda...",
        "Hampir selesai...",
        "Mencoba menyambungkan kembali...",
        "Menyiapkan data terbaru...",
        "Jaringan lagi lambat nih, sabar ya..." 
    ];

    if (!loadingScreen || !welcomeScreen || !loadingText) {
        console.error("Loading/Welcome screen elements not found. Skipping initialization.");
        return;
    }

    /**
     * Updates the text content of the loading screen.
     * @param {string} mainMessage The main message to display.
     * @param {string} [subMessage=""] An optional sub-message to display below the main message.
     */
    function updateLoadingText(mainMessage, subMessage = "") {
        if (loadingText) {
            loadingText.innerHTML = `<span>${mainMessage}</span>${subMessage ? `<br><small>${subMessage}</small>` : ''}`;
        }
    }

    /**
     * Shows the loading screen and starts relevant timers/intervals.
     * @param {string} [mainMessage="Memuat Website"] The main message for the loading screen.
     * @param {string} [subMessage=""] An optional sub-message. If provided, random messages will be stopped.
     * If subMessage is explicitly empty string, random messages start.
     */
    function showLoadingScreen(mainMessage = "Memuat Website", subMessage = "") {
        loadingScreen.classList.remove('hidden');
        welcomeScreen.classList.add('hidden'); // Ensure welcome screen is hidden
        isWelcomeScreenDisplayed = false; // Reset welcome screen flag

        updateLoadingText(mainMessage, subMessage); // Set initial message

        // Logic for random messages:
        // - Start random messages if no specific subMessage is provided AND main message is default
        // - Stop random messages if a specific subMessage is provided
        // - Also, keep random messages running if main message is "Memuat Website"
        //   even if subMessage might be temporarily set by updateLoadingMessages
        if (mainMessage === "Memuat Website" && subMessage === "") {
            startRandomMessages();
        } else {
            stopRandomMessages(); // Stop random messages if a specific subMessage is active
        }
        
        startOfflineTimer();
    }

    /**
     * Hides the loading screen and stops all related timers/intervals.
     */
    function hideLoadingScreen() {
        loadingScreen.classList.add('hidden');
        stopOfflineTimer();
        stopRandomMessages();
    }

    /**
     * Starts the timer to track how long the user has been 'offline' or facing issues.
     */
    function startOfflineTimer() {
        if (!timerInterval) {
            offlineTimer = 0;
            timerInterval = setInterval(() => {
                offlineTimer++;
                // Update messages based on timer, this will control sub-message logic
                updateLoadingMessages(); 
            }, 1000);
        }
    }

    /**
     * Stops the offline timer.
     */
    function stopOfflineTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        offlineTimer = 0; // Reset timer when connection is good
    }

    /**
     * Starts the rotation of random sub-messages on the loading screen.
     */
    function startRandomMessages() {
        // Only start if not already running
        if (randomMessageInterval) return; 

        let i = 0;
        // Display the first random message immediately IF the main message is "Memuat Website"
        // This ensures the sub-message starts from a random point if applicable.
        if (loadingText.querySelector('span').textContent === "Memuat Website") {
            updateLoadingText("Memuat Website", randomMessages[i]);
            i = (i + 1) % randomMessages.length; 
        }

        randomMessageInterval = setInterval(() => {
            // Only update sub-message if the current main message is still "Memuat Website"
            // This allows specific main messages (e.g., "Koneksi Bermasalah") to override.
            if (loadingText.querySelector('span').textContent === "Memuat Website") {
                updateLoadingText("Memuat Website", randomMessages[i]);
                i = (i + 1) % randomMessages.length;
            } else {
                // If main message changed, stop random messages as they are not relevant
                stopRandomMessages();
            }
        }, 3000); // Change message every 3 seconds
    }

    /**
     * Stops the rotation of random sub-messages.
     */
    function stopRandomMessages() {
        clearInterval(randomMessageInterval);
        randomMessageInterval = null;
        // Do NOT clear sub-message here, it might be a specific message from updateLoadingText
        // Clearing it should be handled by updateLoadingText or showLoadingScreen when setting a new message.
    }

    /**
     * Updates loading messages based on offline timer status and network state.
     * This function is crucial for dynamic message changes.
     */
    function updateLoadingMessages() {
        if (!navigator.onLine) {
            // If genuinely offline, always show this specific message
            updateLoadingText("Koneksi Internet Anda Bermasalah", "Periksa koneksi Anda.");
            stopRandomMessages(); // Stop random messages when offline
        } else if (offlineTimer >= 60) { // After 60 seconds of online but slow
            updateLoadingText("Koneksi Internet Lambat", "Harap Tunggu");
            stopRandomMessages(); // Stop random messages if explicitly slow
        } else if (offlineTimer >= 30) { // After 30 seconds of online but slow
            updateLoadingText("Memuat Website", "Sedang mencoba koneksi yang lebih stabil...");
            stopRandomMessages(); // Use specific sub-message, so stop randoms
        } else {
            // Default loading state: show "Memuat Website" with random messages
            updateLoadingText("Memuat Website", loadingText.querySelector('small')?.textContent || ""); // Keep current sub-message if exists
            startRandomMessages(); // Ensure random messages are running
        }
    }

    /**
     * Displays the welcome screen and handles its animation.
     */
    function showWelcomeScreen() {
        // Only show welcome screen if:
        // 1. It hasn't been shown before (first visit) OR
        // 2. It's coming back online after being offline (offlineTimer was > 0)
        // AND it's not currently displayed
        if (hasWelcomeScreenBeenShownOnce && offlineTimer === 0 && !isWelcomeScreenDisplayed) {
            console.log("Welcome screen already shown once and online, not re-displaying.");
            hideLoadingScreen(); // Ensure loading screen is gone
            return;
        }

        if (isWelcomeScreenDisplayed) {
            return; // Prevent re-triggering if already animating/visible
        }

        hideLoadingScreen(); // Hide loading screen
        welcomeScreen.classList.remove('hidden');
        welcomeScreen.classList.remove('swipe-up-animation-end'); // Ensure no lingering end animation
        welcomeScreen.classList.add('swipe-up-animation-start'); // Trigger initial animation (if any)
        isWelcomeScreenDisplayed = true;
        hasWelcomeScreenBeenShownOnce = true; // Mark as shown

        // Set timeout to start the disappearing animation automatically
        setTimeout(() => {
            if (isWelcomeScreenDisplayed) {
                welcomeScreen.classList.remove('swipe-up-animation-start');
                welcomeScreen.classList.add('swipe-up-animation-end'); // Trigger the swipe-up animation to hide
            }
        }, 2000); // Display for 2 seconds before swiping up automatically

        // Listen for the end of the hiding animation to fully hide the element
        welcomeScreen.addEventListener('animationend', function handler(event) {
            // Ensure this listener only triggers for the 'swipeUpAndFade' animation
            if (event.animationName === 'swipeUpAndFade' && welcomeScreen.classList.contains('swipe-up-animation-end')) {
                hideWelcomeScreen();
                welcomeScreen.classList.remove('swipe-up-animation-end'); // Clean up class
                welcomeScreen.removeEventListener('animationend', handler); // Remove listener after execution
            }
        });
    }

    /**
     * Hides the welcome screen.
     */
    function hideWelcomeScreen() {
        welcomeScreen.classList.add('hidden');
        isWelcomeScreenDisplayed = false;
        // Ensure any animation classes are removed on full hide
        welcomeScreen.classList.remove('swipe-up-animation-start', 'swipe-up-animation-end');
    }

    /**
     * Checks the current network connection and page loading status,
     * then updates the UI accordingly.
     */
    function checkConnectionAndPageStatus() {
        console.log("Checking connection and page status...");

        if (!navigator.onLine) {
            console.log("Navigator is offline.");
            showLoadingScreen("Koneksi Internet Anda Bermasalah", "Periksa koneksi Anda.");
            if (isWelcomeScreenDisplayed) hideWelcomeScreen(); // Hide welcome screen if offline
        } else {
            // Attempt a fetch to a known good endpoint to test actual connectivity speed
            fetch('https://www.google.com/favicon.ico', { mode: 'no-cors', cache: 'no-store', signal: AbortSignal.timeout(5000) }) // 5-second timeout for fetch
                .then(() => {
                    console.log("Fetch successful. Connection seems good.");
                    stopOfflineTimer(); // Stop offline timer as connection is good and not slow

                    if (isPageFullyLoaded) {
                        console.log("Page fully loaded. Checking welcome screen display condition.");
                        // Show welcome screen if:
                        // 1. Never shown before OR
                        // 2. Just came back from being offline (offlineTimer was > 0 before stopping)
                        if (!hasWelcomeScreenBeenShownOnce || (offlineTimer > 0 && !isWelcomeScreenDisplayed)) {
                            showWelcomeScreen();
                        } else {
                            hideLoadingScreen(); // Just hide loading if welcome screen isn't needed
                            console.log("Welcome screen not needed. Hiding loading screen.");
                        }
                    } else {
                        console.log("Connection good, but page not fully loaded yet. Keeping loading screen.");
                        // When connection is good and page not fully loaded, show default loading with random messages
                        showLoadingScreen("Memuat Website"); 
                    }
                })
                .catch((error) => {
                    // Check if the error is a timeout specifically
                    if (error.name === 'TimeoutError' || error.name === 'AbortError') { 
                        console.error("Fetch timed out, likely slow connection:", error);
                        // When connection is slow, show "Koneksi Internet Lambat" and let updateLoadingMessages manage sub-message
                        showLoadingScreen("Koneksi Internet Lambat", "Harap Tunggu"); // Explicitly set this message
                    } else {
                        console.error("Fetch failed, likely connection issue:", error);
                        showLoadingScreen("Koneksi Internet Bermasalah", "Periksa koneksi Anda atau coba lagi."); 
                    }
                    if (isWelcomeScreenDisplayed) hideWelcomeScreen(); // Hide welcome screen if connection issues persist
                });
        }
    }

    // --- Event Listeners and Initial Setup ---

    // Initial display of loading screen when DOM is ready
    console.log("DOM content loaded. Initializing loading screen.");
    // Show default loading screen with random messages
    showLoadingScreen("Memuat Website"); 

    // Event listener for when all assets are loaded (images, CSS, etc.)
    window.addEventListener('load', function() {
        console.log('Window (including all assets) has fully loaded.');
        isPageFullyLoaded = true;
        clearInterval(connectionCheckInterval); 
        checkConnectionAndPageStatus(); 
        connectionCheckInterval = setInterval(checkConnectionAndPageStatus, 5000); 
    });

    // Monitor browser's online/offline status
    window.addEventListener('online', function() {
        console.log('Online event detected.');
        clearInterval(connectionCheckInterval); 
        checkConnectionAndPageStatus(); 
        connectionCheckInterval = setInterval(checkConnectionAndPageStatus, 5000); 
    });

    window.addEventListener('offline', function() {
        console.log('Offline event detected.');
        clearInterval(connectionCheckInterval); 
        // When going offline, set explicit message and stop randoms
        showLoadingScreen("Koneksi Internet Anda Bermasalah", "Periksa koneksi Anda."); 
        connectionCheckInterval = setInterval(checkConnectionAndPageStatus, 3000); 
    });

    // Initial connection check when DOM is ready. 
    connectionCheckInterval = setInterval(checkConnectionAndPageStatus, 5000);
}