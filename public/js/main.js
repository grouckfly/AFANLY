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

/* -------------------- VALIDATION -------------------- */
function initValidation() {
    const emailLink = document.getElementById("emailLink");
    const phoneLink = document.getElementById("phoneLink");
    const addressLink = document.getElementById("addressLink");

    if (emailLink) {
        emailLink.addEventListener("click", function (e) {
            const email = "defry.pku@gmail.com";
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert("Email tidak valid!");
                e.preventDefault();
            }
        });
    }

    if (phoneLink) {
        phoneLink.addEventListener("click", function (e) {
            const phone = "081234567890";
            const phonePattern = /^[0-9]{10,15}$/;
            if (!phonePattern.test(phone.replace(/[^0-9]/g, ""))) {
                alert("Nomor telepon tidak valid!");
                e.preventDefault();
            }
        });
    }

    if (addressLink) {
        addressLink.addEventListener("click", function (e) {
            const address = "Jl. Teknologi No. 123, Jakarta";
            if (!address || address.length < 5) {
                alert("Alamat tidak valid!");
                e.preventDefault();
            }
        });
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
    const enterButton = document.getElementById('enter-button');

    let connectionCheckInterval;
    let offlineTimer = 0;
    let timerInterval;
    let randomMessageInterval;
    let isPageFullyLoaded = false;
    let isWelcomeScreenDisplayed = false;
    let hasWelcomeScreenBeenShownOnce = false; // Flag untuk melacak kemunculan welcome screen


    const randomMessages = [
        "Mengoptimalkan pengalaman Anda...",
        "Hampir selesai...",
        "Mencoba menyambungkan kembali..."
    ];

    if (!loadingScreen || !welcomeScreen || !loadingText) {
        console.error("Loading/Welcome screen elements not found. Skipping initialization.");
        return;
    }

    function updateLoadingText(message, sub = "") {
        if (loadingText) {
            loadingText.innerHTML = `<span>${message}</span>${sub ? `<br><small>${sub}</small>` : ''}`;
        }
    }

    // Function to show loading screen with an initial message
    function showLoadingScreen(mainMessage = "Memuat Website", subMessage = "") {
        loadingScreen.classList.remove('hidden');
        welcomeScreen.classList.add('hidden'); // Ensure welcome screen is hidden
        isWelcomeScreenDisplayed = false; // Reset welcome screen flag
        updateLoadingText(mainMessage, subMessage); // Set initial message
        startRandomMessages(); // Start the random messages rotation
        startOfflineTimer();
    }

    function hideLoadingScreen() {
        loadingScreen.classList.add('hidden');
        stopOfflineTimer();
        stopRandomMessages();
    }

    function startOfflineTimer() {
        if (!timerInterval) {
            offlineTimer = 0;
            timerInterval = setInterval(() => {
                offlineTimer++;
                updateLoadingMessages();
            }, 1000);
        }
    }

    function stopOfflineTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        offlineTimer = 0;
    }

    function startRandomMessages() {
        // Clear any existing interval to prevent multiple intervals running
        stopRandomMessages(); 
        
        let i = 0;
        // Display the first random message immediately
        updateLoadingText("Memuat Website", randomMessages[i]);
        i = (i + 1) % randomMessages.length; // Move to the next message

        randomMessageInterval = setInterval(() => {
            // Only update sub-message if loadingText current main message is "Memuat Website"
            // This prevents overwriting specific messages like "Koneksi Bermasalah"
            if (loadingText.querySelector('span').textContent === "Memuat Website") {
                updateLoadingText("Memuat Website", randomMessages[i]);
            }
            i = (i + 1) % randomMessages.length;
        }, 3000);
    }

    function stopRandomMessages() {
        clearInterval(randomMessageInterval);
        randomMessageInterval = null;
        // When stopping, clear the sub-message if it's a random one
        if (loadingText.querySelector('small')) {
            // Check if the current sub-message is one of the random ones
            const currentSubMessage = loadingText.querySelector('small').textContent;
            if (randomMessages.includes(currentSubMessage)) {
                updateLoadingText(loadingText.querySelector('span').textContent, ""); // Clear sub-message
            }
        }
    }

    function updateLoadingMessages() {
        if (!navigator.onLine) {
            showLoadingScreen("Koneksi Internet Anda Bermasalah", "Periksa koneksi Anda.");
            stopRandomMessages(); // Stop random messages if offline
        } else if (offlineTimer >= 30 && offlineTimer < 60) {
            showLoadingScreen("Memuat Website", "Sedang mencoba koneksi yang lebih stabil...");
            startRandomMessages(); // Keep random messages if trying to connect
        } else if (offlineTimer >= 60) {
            showLoadingScreen("Koneksi Internet Lambat", "Harap Tunggu");
            stopRandomMessages(); // Stop random messages if connection is slow
        } else {
            // Back to default random messages if connection is good and not in specific states
            showLoadingScreen("Memuat Website"); 
        }
    }

    function showWelcomeScreen() {
        // Only show welcome screen if:
        // 1. It hasn't been shown before OR
        // 2. It's coming back online after being offline (offlineTimer > 0)
        // AND it's not currently displayed
        if (hasWelcomeScreenBeenShownOnce && offlineTimer === 0) {
            console.log("Welcome screen already shown once, not re-displaying.");
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

        // Set timeout to start the disappearing animation
        setTimeout(() => {
            if (isWelcomeScreenDisplayed) {
                welcomeScreen.classList.remove('swipe-up-animation-start');
                welcomeScreen.classList.add('swipe-up-animation-end'); // Trigger the swipe-up animation to hide
            }
        }, 2000); // Display for 2 seconds before swiping up

        // Listen for the end of the hiding animation to fully hide the element
        welcomeScreen.addEventListener('animationend', function handler() {
            // Ensure this listener only triggers for the 'swipeUpAndFade' animation
            if (welcomeScreen.classList.contains('swipe-up-animation-end')) {
                hideWelcomeScreen();
                welcomeScreen.classList.remove('swipe-up-animation-end'); // Clean up class
                welcomeScreen.removeEventListener('animationend', handler); // Remove listener after execution
            }
        });
    }

    function hideWelcomeScreen() {
        welcomeScreen.classList.add('hidden');
        isWelcomeScreenDisplayed = false;
        // Ensure any animation classes are removed on full hide
        welcomeScreen.classList.remove('swipe-up-animation-start', 'swipe-up-animation-end');
    }

    function checkConnectionAndPageStatus() {
        console.log("Checking connection and page status...");
        if (!navigator.onLine) {
            console.log("Navigator is offline.");
            showLoadingScreen("Koneksi Internet Anda Bermasalah", "Periksa koneksi Anda.");
            if (isWelcomeScreenDisplayed) hideWelcomeScreen(); // Hide welcome screen if offline
        } else {
            fetch('[https://www.google.com/favicon.ico](https://www.google.com/favicon.ico)', { mode: 'no-cors', cache: 'no-store' })
                .then(() => {
                    console.log("Fetch successful. Connection seems good.");
                    stopOfflineTimer(); // Stop offline timer

                    if (isPageFullyLoaded) {
                        console.log("Page fully loaded. Checking welcome screen display condition.");
                        // Show welcome screen if:
                        // 1. Never shown before OR
                        // 2. Just came back from being offline (offlineTimer was > 0)
                        if (!hasWelcomeScreenBeenShownOnce || offlineTimer > 0) {
                            showWelcomeScreen();
                        } else {
                            hideLoadingScreen(); // Just hide loading if welcome screen isn't needed
                            console.log("Welcome screen not needed. Hiding loading screen.");
                        }
                    } else {
                        console.log("Connection good, but page not fully loaded yet. Keeping loading screen.");
                        showLoadingScreen("Memuat Website"); // Show loading with random messages
                    }
                })
                .catch((error) => {
                    console.error("Fetch failed, likely connection issue:", error);
                    showLoadingScreen("Koneksi Internet Lambat", "Harap Tunggu"); // Specific message for slow connection
                    if (isWelcomeScreenDisplayed) hideWelcomeScreen(); // Hide welcome screen if connection issues persist
                });
        }
    }

    // Initial display of loading screen when DOM is ready
    console.log("DOM content loaded. Initializing loading screen.");
    showLoadingScreen("Memuat Website"); // Show loading screen with initial random messages

    // Event listener for when all assets are loaded (images, CSS, etc.)
    window.addEventListener('load', function() {
        console.log('Window (including all assets) has fully loaded.');
        isPageFullyLoaded = true;
        // Clear interval here as checkConnectionAndPageStatus will now be called directly
        clearInterval(connectionCheckInterval); 
        checkConnectionAndPageStatus(); // Re-check status after full load
        // Re-establish the interval after the initial check for fully loaded state
        connectionCheckInterval = setInterval(checkConnectionAndPageStatus, 5000); 
    });

    // Event listener for the "Mulai" button on the welcome screen
    if (enterButton) {
        enterButton.addEventListener('click', () => {
            if (isWelcomeScreenDisplayed) {
                // Instantly trigger the hiding animation
                welcomeScreen.classList.remove('swipe-up-animation-start');
                welcomeScreen.classList.add('swipe-up-animation-end');
            }
        });
    }

    // Monitor browser's online/offline status
    window.addEventListener('online', function() {
        console.log('Online event detected.');
        clearInterval(connectionCheckInterval); // Stop current interval
        checkConnectionAndPageStatus(); // Check status immediately
        connectionCheckInterval = setInterval(checkConnectionAndPageStatus, 5000); // Resume normal interval
    });

    window.addEventListener('offline', function() {
        console.log('Offline event detected.');
        clearInterval(connectionCheckInterval); // Stop current interval
        showLoadingScreen("Koneksi Internet Anda Bermasalah", "Periksa koneksi Anda."); // Display offline message on loading screen
        connectionCheckInterval = setInterval(checkConnectionAndPageStatus, 3000); // Check more frequently when offline
    });

    // Initial connection check when DOM is ready. This interval will be cleared on window.load.
    connectionCheckInterval = setInterval(checkConnectionAndPageStatus, 5000);
}