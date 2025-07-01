document.addEventListener("DOMContentLoaded", function () {
    // Inisialisasi utama
    initLoadingAndWelcomeScreen(); // Panggil ini paling awal
    initDarkMode();
    initSmartScrollToCenter();
    initSidebar();
    initAboutCarousel();
    initDevNotif();
    initYear();
    initKritikSaranModal();
    initNotificationCenter(); // <-- PANGGIL FUNGSI BARU DI SINI

    // Hanya inisialisasi services jika ada elemen terkait
    if (document.querySelector(".services .card-wrapper")) {
        initServicesSection();
        startAutoScrollCardWrapper();
    }
});

// === VARIABEL GLOBAL BARU UNTUK MANAJEMEN NOTIFIKASI ===
let activeNotifications = [];

/**
 * Menambahkan notifikasi ke daftar dan memperbarui UI.
 * @param {string} id - ID unik untuk notifikasi (e.g., 'dev-warning', 'connection-issue').
 * @param {string} message - Pesan notifikasi yang akan ditampilkan.
 */
function addNotification(id, message) {
    // Hindari duplikat
    if (!activeNotifications.find(n => n.id === id)) {
        activeNotifications.push({ id, message });
        updateNotificationUI();
    }
}

/**
 * Menghapus notifikasi dari daftar dan memperbarui UI.
 * @param {string} id - ID notifikasi yang akan dihapus.
 */
function removeNotification(id) {
    activeNotifications = activeNotifications.filter(n => n.id !== id);
    updateNotificationUI();
}

/**
 * Memperbarui semua elemen UI yang terkait dengan notifikasi.
 * (Counter lonceng dan daftar di modal).
 */
function updateNotificationUI() {
    const list = document.getElementById('notification-list');
    const counters = document.querySelectorAll('.notification-counter');

    // Perbarui daftar di modal
    if (list) {
        list.innerHTML = ''; // Kosongkan daftar
        if (activeNotifications.length > 0) {
            activeNotifications.forEach(notif => {
                const item = document.createElement('li');
                item.textContent = notif.message;
                list.appendChild(item);
            });
        } else {
            const item = document.createElement('li');
            item.textContent = 'Tidak ada peringatan saat ini.';
            item.style.borderLeftColor = '#25d366'; // Warna hijau untuk status "aman"
            list.appendChild(item);
        }
    }

    // Perbarui counter
    counters.forEach(counter => {
        if (activeNotifications.length > 0) {
            counter.textContent = activeNotifications.length;
            counter.classList.add('visible');
        } else {
            counter.classList.remove('visible');
        }
    });
}

/* -------------------- PUSAT NOTIFIKASI MODAL -------------------- */
function initNotificationCenter() {
    const modal = document.getElementById("notification-center-modal");
    const closeModalBtn = document.getElementById("notification-center-close");
    const openModalBtns = document.querySelectorAll(".dev-notif-toggle");

    if (!modal) {
        console.warn("Notification Center modal not found.");
        return;
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            modal.style.display = "flex";
        });
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}

/* -------------------- SMOOTH CENTER SCROLL -------------------- */
function initSmartScrollToCenter() {
    // 1. Pilih semua link navigasi yang valid di navbar dan sidebar
    const scrollLinks = document.querySelectorAll('.nav-links a[href^="#"], .sidebar-links a[href^="#"]');

    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Mencegah perilaku default dari link (lompat langsung)
            e.preventDefault();

            const href = this.getAttribute('href');
            // Abaikan jika link hanya "#" (biasanya untuk tombol placeholder)
            if (href === '#') {
                // Jika link adalah #, scroll ke paling atas halaman
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const targetElement = document.querySelector(href);

            // 2. Pastikan elemen tujuan benar-benar ada
            if (targetElement) {
                // 3. Deteksi header yang sedang aktif (navbar desktop atau floating bar mobile)
                const headerDesktop = document.querySelector('header .navbar');
                const headerMobile = document.querySelector('.floating-bar');
                let headerOffset = 0;

                // Cek mana header yang terlihat dan ambil tingginya
                if (window.getComputedStyle(headerDesktop).display !== 'none') {
                    headerOffset = headerDesktop.offsetHeight;
                } else if (window.getComputedStyle(headerMobile).display !== 'none') {
                    headerOffset = headerMobile.offsetHeight;
                }

                // 4. Hitung posisi scroll yang ideal
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - (window.innerHeight / 2) + (targetElement.offsetHeight / 2);

                // 5. Lakukan scroll dengan mulus ke posisi yang telah dihitung
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Jika menggunakan sidebar, tutup sidebar setelah link diklik
                const sidebar = document.getElementById('sidebar');
                if (sidebar && sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                }
            }
        });
    });
}

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
    const notifMessage = "Website Masih Dalam Proses Pengembangan!!!";

    if (!notif) {
        console.warn("Dev notification element not found.");
        return;
    }

    function showDevNotif() {
        notif.classList.add('active');
        addNotification('dev-warning', notifMessage);
    }

    function hideDevNotif() {
        notif.classList.remove('active');
        removeNotification('dev-warning');
    }

    // Tampilkan notifikasi setelah beberapa saat
    setTimeout(showDevNotif, 1000);

    // Otomatis sembunyikan setelah beberapa detik
    setTimeout(hideDevNotif, 7000);

    if (closeBtn) {
        closeBtn.addEventListener('click', hideDevNotif);
    }
    
    // Hapus logika event listener untuk toggle lonceng dari sini
    // karena sudah ditangani oleh initNotificationCenter()
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
    
    // --- PENANGANAN EVENT MOUSE (SUDAH ADA) ---
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
        e.preventDefault(); // Penting untuk mencegah seleksi teks saat dragging mouse
        const x = e.pageX - cardWrapper.offsetLeft;
        const walk = (x - startX) * 1.5;
        cardWrapper.scrollLeft = scrollLeft - walk;
    });

    // --- PENAMBAHAN UNTUK TOUCH EVENTS ---

    cardWrapper.addEventListener("touchstart", (e) => {
        // e.preventDefault(); // HINDARI INI DI SINI, bisa mengganggu scroll vertikal jika touch-action tidak cukup
        isDown = true;
        cardWrapper.classList.add("dragging");
        // Gunakan touches[0] untuk mendapatkan posisi jari pertama
        startX = e.touches[0].pageX - cardWrapper.offsetLeft;
        scrollLeft = cardWrapper.scrollLeft;
    }, { passive: false }); // Penting: { passive: false } agar preventDefault() bisa bekerja

    cardWrapper.addEventListener("touchend", () => {
        isDown = false;
        cardWrapper.classList.remove("dragging");
    });

    cardWrapper.addEventListener("touchmove", (e) => {
        if (!isDown) return;
        // e.preventDefault(); // PENTING: Mencegah scroll halaman saat swipe horizontal
        // Gunakan touches[0] untuk mendapatkan posisi jari pertama
        const x = e.touches[0].pageX - cardWrapper.offsetLeft;
        const walk = (x - startX) * 1.5;
        cardWrapper.scrollLeft = scrollLeft - walk;
    }, { passive: false }); // Penting: { passive: false }
}

/* -------------------- Auto About -------------------- */
function initAboutCarousel() {
    const carousel = document.querySelector('.about-image-carousel');
    if (!carousel) return;

    const images = carousel.querySelectorAll('.carousel-img');
    const indicatorsContainer = carousel.querySelector('.carousel-indicators');
    let currentIndex = 0;
    let slideInterval;

    if (images.length === 0) return;

    // 1. Hapus indikator yang mungkin ada dari HTML
    indicatorsContainer.innerHTML = '';

    // 2. Buat indikator (bulat-bulat) secara dinamis
    images.forEach((_, index) => {
        const indicator = document.createElement('span');
        indicator.classList.add('indicator');
        if (index === 0) {
            indicator.classList.add('active');
        }
        indicator.dataset.slideTo = index;
        indicatorsContainer.appendChild(indicator);
    });

    const indicators = indicatorsContainer.querySelectorAll('.indicator');

    function showSlide(index) {
        images.forEach(img => img.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        currentIndex = index;

        images[currentIndex].classList.add('active');
        indicators[currentIndex].classList.add('active');
    }

    function nextSlide() {
        const newIndex = (currentIndex + 1) % images.length;
        showSlide(newIndex);
    }

    function startSlideshow() {
        stopSlideshow(); // Hentikan dulu jika ada
        slideInterval = setInterval(nextSlide, 4000); // Ganti gambar setiap 4 detik
    }

    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    // 3. Fungsi saat indikator diklik
    indicators.forEach(indicator => {
        indicator.addEventListener('click', (e) => {
            const newIndex = parseInt(e.target.dataset.slideTo);
            stopSlideshow();
            showSlide(newIndex);
            startSlideshow();
        });
    });

    // Mulai slideshow
    startSlideshow();
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
    const connectionNotif = document.getElementById('connection-status-notif');
    const connectionNotifClose = document.getElementById('connection-notif-close');

    // --- LOGIKA BARU: Cek apakah sudah pernah dimuat dalam sesi ini ---
    if (sessionStorage.getItem('hasLoadedOnce')) {
        // Jika sudah, sembunyikan semuanya dan jangan lanjutkan
        loadingScreen.classList.add('hidden');
        welcomeScreen.classList.add('hidden');
        
        // Tetap jalankan pengecekan koneksi secara berkala
        setInterval(checkConnection, 5000);
        
        // Tambahkan event listener untuk tombol tutup notifikasi koneksi
        if (connectionNotifClose) {
            connectionNotifClose.addEventListener('click', () => {
                connectionNotif.classList.remove('active');
            });
        }
        return; // Hentikan eksekusi fungsi
    }

    // Jika ini adalah muatan pertama, lanjutkan dengan logika asli...
    // (Kode di bawah ini adalah versi modifikasi dari kode Anda)

    const loadingText = document.getElementById('loading-text');

    if (!loadingScreen || !welcomeScreen || !loadingText) {
        console.error("Loading/Welcome screen elements not found. Skipping initialization.");
        return;
    }

    function showLoadingScreen() {
        loadingScreen.classList.remove('hidden');
        welcomeScreen.classList.add('hidden');
        loadingText.textContent = "Memuat...";
    }
    
    function hideLoadingScreen() {
        loadingScreen.classList.add('hidden');
    }
    
    function showWelcomeScreen() {
        hideLoadingScreen();
        welcomeScreen.classList.remove('hidden', 'swipe-up-animation-end');
        
        // Tandai bahwa loading/welcome sudah pernah tampil di sesi ini
        sessionStorage.setItem('hasLoadedOnce', 'true');

        setTimeout(() => {
            welcomeScreen.classList.add('swipe-up-animation-end');
        }, 2000);

        welcomeScreen.addEventListener('animationend', function handler(event) {
            if (event.animationName === 'swipeUpAndFade') {
                welcomeScreen.classList.add('hidden');
                welcomeScreen.classList.remove('swipe-up-animation-end');
                welcomeScreen.removeEventListener('animationend', handler);
            }
        });
    }

    // Fungsi untuk cek koneksi
    function checkConnection() {
        if (!navigator.onLine) {
            connectionNotif.classList.add('active');
            addNotification('connection-issue', 'Koneksi internet terputus.');
        } else {
            // Jika online, kita bisa hapus notifikasi koneksi
            connectionNotif.classList.remove('active');
            removeNotification('connection-issue');
        }
    }

    // Tampilkan loading screen saat DOM siap
    showLoadingScreen();

    // Event listener saat semua aset (gambar, dll) selesai dimuat
    window.addEventListener('load', function() {
        // Setelah semua dimuat, tunjukkan welcome screen
        showWelcomeScreen();
        // Mulai pengecekan koneksi secara berkala
        setInterval(checkConnection, 5000);
    });

    // Monitor status online/offline browser
    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);

    // Tambahkan event listener untuk tombol tutup notifikasi koneksi
    if (connectionNotifClose) {
        connectionNotifClose.addEventListener('click', () => {
            connectionNotif.classList.remove('active');
        });
    }
}