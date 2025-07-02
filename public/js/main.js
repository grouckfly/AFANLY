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
 * @param {string} type - Jenis notifikasi ('pemberitahuan' atau 'peringatan').
 */
function addNotification(id, message, type) {
    // Hindari duplikat
    if (!activeNotifications.find(n => n.id === id)) {
        activeNotifications.push({ id, message, type }); // Tambahkan 'type'
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
 * (Counter lonceng dan daftar di modal yang sudah dikategorikan).
 */
function updateNotificationUI() {
    const pemberitahuanList = document.getElementById('pemberitahuan-list');
    const peringatanList = document.getElementById('peringatan-list');
    const counters = document.querySelectorAll('.notification-counter');

    // Pastikan elemen list ada sebelum melanjutkan
    if (!pemberitahuanList || !peringatanList) return;

    // 1. Kosongkan kedua daftar
    pemberitahuanList.innerHTML = '';
    peringatanList.innerHTML = '';

    // 2. Filter notifikasi berdasarkan tipenya
    const pemberitahuan = activeNotifications.filter(n => n.type === 'pemberitahuan');
    const peringatan = activeNotifications.filter(n => n.type === 'peringatan');

    // 3. Isi daftar Pemberitahuan
    if (pemberitahuan.length > 0) {
        pemberitahuan.forEach(notif => {
            const item = document.createElement('li');
            item.textContent = notif.message;
            pemberitahuanList.appendChild(item);
        });
    } else {
        const item = document.createElement('li');
        item.textContent = 'Tidak ada pemberitahuan baru.';
        item.classList.add('empty-notif');
        pemberitahuanList.appendChild(item);
    }

    // 4. Isi daftar Peringatan
    if (peringatan.length > 0) {
        peringatan.forEach(notif => {
            const item = document.createElement('li');
            item.textContent = notif.message;
            peringatanList.appendChild(item);
        });
    } else {
        const item = document.createElement('li');
        item.textContent = 'Tidak ada peringatan aktif.';
        item.classList.add('empty-notif');
        peringatanList.appendChild(item);
    }

    // 5. Perbarui counter total
    if (activeNotifications.length > 0) {
        counters.forEach(counter => {
            counter.textContent = activeNotifications.length;
            counter.classList.add('visible');
        });
    } else {
        counters.forEach(counter => {
            counter.classList.remove('visible');
        });
    }
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
    const scrollLinks = document.querySelectorAll('.nav-links a[href^="#"], .sidebar-links a[href^="#"]');

    scrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // 1. Mencegah perilaku default browser agar kita bisa mengontrol scroll sepenuhnya.
            e.preventDefault();

            const href = this.getAttribute('href');
            // Jika link hanya '#', scroll ke paling atas halaman.
            if (href === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const targetElement = document.querySelector(href);
            const header = document.querySelector('header'); // Ambil elemen header

            if (targetElement && header) {
                // 2. Mengukur semua komponen yang diperlukan secara dinamis.
                const headerHeight = header.offsetHeight;
                const targetHeight = targetElement.offsetHeight;
                const viewportHeight = window.innerHeight;
                let targetTop;


                // 3. Logika "Pintar": Cek apakah seksi lebih tinggi dari ruang yang terlihat.
                if (targetHeight > viewportHeight - headerHeight) {
                    // KASUS 1: Seksi lebih tinggi dari layar.
                    // Scroll agar bagian atas seksi berada tepat di bawah header.
                    targetTop = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                } else {
                    // KASUS 2: Seksi lebih pendek dari layar.
                    // Kalkulasi untuk menempatkan seksi di tengah ruang vertikal yang tersedia.
                    const availableSpace = viewportHeight - headerHeight;
                    const verticalOffset = (availableSpace - targetHeight) / 2;
                    targetTop = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - verticalOffset;
                }

                // 4. Lakukan scroll ke posisi yang sudah dihitung.
                window.scrollTo({
                    top: targetTop,
                    behavior: 'smooth'
                });

                // 5. Logika untuk menutup sidebar di mobile (tetap dipertahankan).
                const sidebar = document.getElementById('sidebar');
                if (sidebar && sidebar.classList.contains('active')) {
                    setTimeout(() => {
                        sidebar.classList.remove('active');
                        document.body.classList.remove("sidebar-open");
                    }, 300);
                }
            }
        });
    });
}

/* -------------------- DARK MODE -------------------- */
function initDarkMode() {
    const toggle = document.getElementById("darkModeToggle");
    const sidebarDarkBtn = document.getElementById("sidebarDarkModeToggle");
    
    // ================== PERUBAHAN UTAMA DI SINI ==================
    // Jika tidak ada tombol dark mode sama sekali di halaman ini, hentikan fungsi.
    if (!toggle && !sidebarDarkBtn) {
        console.log("Dark mode toggles not found on this page. Skipping initialization.");
        return;
    }
    // ================== AKHIR PERUBAHAN UTAMA ==================

    const body = document.body;

    // Variabel di bawah ini aman karena menggunakan 'ternary operator'
    // yang akan menghasilkan 'null' jika elemen induknya tidak ada, tanpa error.
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
        // Ganti dari localStorage ke sessionStorage agar tema tidak 'terbawa' selamanya
        // Jika Anda ingin tema diingat selamanya, tetap gunakan localStorage
        localStorage.setItem("theme", theme);
        updateAriaAttributes();
    }

    function updateAriaAttributes() {
        const isDark = body.classList.contains("dark-mode");
        [toggle, sidebarDarkBtn].forEach((btn) => {
            // Pengecekan 'if (btn)' memastikan tidak ada error jika salah satu tombol tidak ada
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
        // Pengecekan 'if (btn)' memastikan tidak ada error saat menambahkan event listener
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
    // 1. Ambil semua elemen yang diperlukan
    const notifContainer = document.getElementById('dev-notif');
    const notifTextElement = document.getElementById('notif-text');
    const closeBtn = document.getElementById('notif-close');

    // Pastikan elemen utama ada sebelum melanjutkan
    if (!notifContainer || !notifTextElement) {
        console.warn("Elemen notifikasi pengembangan (#dev-notif atau #notif-text) tidak ditemukan.");
        return;
    }

    // 2. Baca pesan langsung dari HTML dan bersihkan spasi (trim)
    const actualMessage = notifTextElement.textContent.trim();

    // 3. INTI LOGIKA: Hanya jalankan jika ada pesan teks
    if (actualMessage) {
        // Jika ada pesan, tambahkan ke pusat notifikasi
        addNotification('dev-warning', actualMessage, 'pemberitahuan');

        // Fungsi untuk menampilkan pop-up
        function showDevPopup() {
            notifContainer.classList.add('active');
        }

        // Fungsi untuk menyembunyikan pop-up
        function hideDevPopup() {
            notifContainer.classList.remove('active');
        }

        // Tampilkan pop-up setelah beberapa saat
        setTimeout(showDevPopup, 1000);

        // Otomatis sembunyikan pop-up setelah beberapa detik
        setTimeout(hideDevPopup, 7000);

        // Tambahkan event listener untuk tombol tutup jika ada
        if (closeBtn) {
            closeBtn.addEventListener('click', hideDevPopup);
        }
    }
    // Jika 'actualMessage' kosong, maka seluruh blok 'if' ini akan dilewati,
    // dan tidak ada notifikasi atau pop-up yang akan muncul.
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

    // Fungsi untuk cek koneksi (didefinisikan di sini agar bisa diakses semua kondisi)
    function checkConnection() {
        if (connectionNotif) {
            if (!navigator.onLine) {
                connectionNotif.classList.add('active');
                addNotification('connection-issue', 'Koneksi internet terputus atau tidak stabil.', 'peringatan');
            } else {
                connectionNotif.classList.remove('active');
                removeNotification('connection-issue');
            }
        }
    }
    
    // Cek apakah halaman ini MEMILIKI fitur loading & welcome screen.
    if (loadingScreen && welcomeScreen) {
        // JIKA ADA, jalankan semua logika terkait loading & welcome screen.
        
        if (sessionStorage.getItem('hasLoadedOnce')) {
            // Logika untuk muatan berikutnya (bukan yang pertama)
            loadingScreen.classList.add('hidden');
            welcomeScreen.classList.add('hidden');
        } else {
            // Logika untuk muatan pertama kali
            const loadingText = document.getElementById('loading-text');

            if (loadingText) {
                loadingText.textContent = "Memuat...";
            }
            
            loadingScreen.classList.remove('hidden');
            welcomeScreen.classList.add('hidden');

            // Tunggu hingga semua aset (gambar, css, dll) selesai dimuat
            window.addEventListener('load', function() {
                // *** BARIS INI ADALAH PERBAIKANNYA ***
                // Sembunyikan loading screen SEBELUM menampilkan welcome screen
                loadingScreen.classList.add('hidden');
                
                // Tampilkan welcome screen
                welcomeScreen.classList.remove('hidden', 'swipe-up-animation-end');
                sessionStorage.setItem('hasLoadedOnce', 'true');

                // Atur waktu untuk animasi menghilang dari welcome screen
                setTimeout(() => {
                    welcomeScreen.classList.add('swipe-up-animation-end');
                }, 2000);

                // Listener untuk menyembunyikan elemen setelah animasi selesai
                welcomeScreen.addEventListener('animationend', function handler(event) {
                    if (event.animationName === 'swipeUpAndFade') {
                        welcomeScreen.classList.add('hidden');
                        welcomeScreen.classList.remove('swipe-up-animation-end');
                        welcomeScreen.removeEventListener('animationend', handler);
                    }
                });
            });
        }
    } else {
        // JIKA TIDAK ADA, beri pesan di konsol (untuk debugging) dan lanjutkan.
        console.log("Loading/Welcome screen elements not found on this page. Skipping their initialization.");
    }

    // Logika ini akan selalu berjalan di SEMUA halaman
    setInterval(checkConnection, 5000);
    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);

    if (connectionNotifClose) {
        connectionNotifClose.addEventListener('click', () => {
            if(connectionNotif) {
                connectionNotif.classList.remove('active');
            }
        });
    }
}