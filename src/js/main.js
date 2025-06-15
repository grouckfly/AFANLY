document.addEventListener('DOMContentLoaded', function () {
    initDarkMode();
    initDevNotif();
    initFooterYear();
    initValidation();
    initSidebarToggle();
    initKritikSaranModal();

    // Hanya inisialisasi services jika ada elemen terkait
    if (document.querySelector(".services .card-wrapper")) {
        initServicesSection();
        startAutoScrollCardWrapper();
    }
});

/* -------------------- DARK MODE -------------------- */
function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    const sidebarDarkBtn = document.getElementById('sidebarDarkModeToggle');
    const body = document.body;

    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
        localStorage.setItem('theme', theme);
        updateDarkModeButton();
    }

    function updateDarkModeButton() {
        const isDark = body.classList.contains('dark-mode');
        if (toggle) toggle.innerHTML = isDark ? '🌙' : '☀️';
        if (sidebarDarkBtn) sidebarDarkBtn.innerHTML = isDark ? '🌙' : '☀️';
    }

    // Inisialisasi mode berdasarkan localStorage atau waktu
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        applyTheme(storedTheme);
    } else {
        const hour = new Date().getHours();
        const autoTheme = (hour >= 18 || hour < 6) ? 'dark' : 'light';
        applyTheme(autoTheme);
    }

    // Event toggle tombol
    [toggle, sidebarDarkBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
                applyTheme(newTheme);
            });
        }
    });
}

/* -------------------- DEV NOTIF -------------------- */
function initDevNotif() {
    const devNotif = document.getElementById('dev-notif');
    const notifText = document.getElementById('notif-text');
    const notifClose = document.getElementById('notif-close');

    function minimizeNotif() {
        notifText.style.display = 'none';
        notifClose.style.display = 'none';

        if (!devNotif.querySelector('.notif-icon')) {
            const icon = document.createElement('span');
            icon.className = 'notif-icon';
            icon.innerText = '⚠️';
            icon.style.cursor = 'pointer';
            devNotif.appendChild(icon);
            icon.addEventListener('click', restoreNotif);
        }
        devNotif.classList.add('minimized');
    }

    function restoreNotif() {
        notifText.style.display = 'inline';
        notifClose.style.display = 'inline-block';
        const icon = devNotif.querySelector('.notif-icon');
        if (icon) icon.remove();
        devNotif.classList.remove('minimized');
    }

    if (notifClose && devNotif && notifText) {
        notifClose.addEventListener('click', minimizeNotif);
    }
}

/* -------------------- FOOTER YEAR -------------------- */
function initFooterYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* -------------------- VALIDATION -------------------- */
function initValidation() {
    const emailLink = document.getElementById('emailLink');
    const phoneLink = document.getElementById('phoneLink');
    const addressLink = document.getElementById('addressLink');

    if (emailLink) {
        emailLink.addEventListener('click', function (e) {
            const email = "defry.pku@gmail.com";
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert("Email tidak valid!");
                e.preventDefault();
            }
        });
    }

    if (phoneLink) {
        phoneLink.addEventListener('click', function (e) {
            const phone = "081234567890";
            const phonePattern = /^[0-9]{10,15}$/;
            if (!phonePattern.test(phone.replace(/[^0-9]/g, ""))) {
                alert("Nomor telepon tidak valid!");
                e.preventDefault();
            }
        });
    }

    if (addressLink) {
        addressLink.addEventListener('click', function (e) {
            const address = "Jl. Teknologi No. 123, Jakarta";
            if (!address || address.length < 5) {
                alert("Alamat tidak valid!");
                e.preventDefault();
            }
        });
    }
}

/* -------------------- SIDEBAR TOGGLE -------------------- */
function initSidebarToggle() {
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const body = document.body;
    const sidebarLinks = document.querySelectorAll(".sidebar-links a"); // Ambil semua link di sidebar

    // Event toggle sidebar
    sidebarToggle.addEventListener("click", function () {
        sidebar.classList.toggle("active"); // Tampilkan/sembunyikan sidebar
        body.classList.toggle("sidebar-open"); // Efek blur jika diperlukan
    });

    // Tutup sidebar jika klik di luar area
    document.addEventListener("click", function (e) {
        if (
            sidebar.classList.contains("active") &&
            !sidebar.contains(e.target) &&
            e.target !== sidebarToggle
        ) {
            sidebar.classList.remove("active"); // Sembunyikan sidebar
            body.classList.remove("sidebar-open");
        }
    });

    // Tutup sidebar setelah link diklik
    sidebarLinks.forEach((link) => {
        link.addEventListener("click", () => {
            sidebar.classList.remove("active"); // Sembunyikan sidebar
            body.classList.remove("sidebar-open");
        });
    });
}


/* -------------------- SECTION SERVICES -------------------- */
function initServicesSection() {
    const cardWrapper = document.querySelector(".services .card-wrapper");

    // Validasi keberadaan elemen sebelum melanjutkan
    if (!cardWrapper) {
        console.warn("Services section tidak ditemukan, melewati initServicesSection.");
        return; // Keluar dari fungsi
        
    }

    console.log("Inisialisasi initServicesSection berhasil."); // Tambahkan ini

    // Mengatur event listener jika cardWrapper ada
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
function startAutoScrollCardWrapper(selector = ".services .card-wrapper", intervalMs = 5000) {
    const cardWrapper = document.querySelector(selector);

    // Cek keberadaan elemen
    if (!cardWrapper) {
        console.warn("Card wrapper tidak ditemukan, auto-scroll akan dilewati.");
        return; // Keluar dari fungsi
    }

    console.log("Inisialisasi startAutoScrollCardWrapper berhasil."); // Tambahkan ini

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
        const paddingLeft = parseInt(getComputedStyle(cardWrapper).paddingLeft) || 0;

        cardWrapper.scroll({
            left: cardOffset - paddingLeft,
            behavior: "smooth",
        });
    }

    function start() {
        stop(); // Clear interval sebelumnya
        interval = setInterval(() => {
            if (!isUserInteracting) {
                idx = (idx + 1) % cards.length;
                scrollToCard(idx);
            }
        }, intervalMs);
    }

    function stop() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    }

    function markInteracting() {
        isUserInteracting = true;
        stop();

        // Lanjutkan auto-scroll setelah 5 detik tidak ada interaksi
        if (userInteractedTimeout) clearTimeout(userInteractedTimeout);
        userInteractedTimeout = setTimeout(() => {
            isUserInteracting = false;
            start();
        }, 5000);
    }

    // Tangkap interaksi pengguna
    const interactionEvents = ["touchstart", "pointerdown", "mousedown", "wheel", "keydown"];
    interactionEvents.forEach((evt) => {
        cardWrapper.addEventListener(evt, markInteracting, { passive: true });
    });

    // Mulai auto-scroll
    start();
}


/* -------------------- KRITIK DAN SARAN -------------------- */
function initKritikSaranModal() {
    const modal = document.getElementById("kritik-saran-modal");
    const closeModal = modal.querySelector(".modal-close");
    const kritikSaranBtns = document.querySelectorAll(".kritik-saran-btn");
    const sidebar = document.getElementById("sidebar");
    const body = document.body;

    
    kritikSaranBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            modal.style.display = "flex"; // Tampilkan modal

            // Jika tombol berasal dari sidebar, tutup sidebar
            if (
                btn.id === "sidebar-kritik-saran" && 
                sidebar.classList.contains("active")
            ) {
                sidebar.classList.remove("active"); // Sembunyikan sidebar
                body.classList.remove("sidebar-open");
            }
        });
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none"; // Sembunyikan modal
    });

    // Tutup modal jika klik di luar konten
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}

/* -------------------- END OF SCRIPT -------------------- */
