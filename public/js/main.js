// js/main.js (Versi Orkestrator Final)

import { loadAllComponents } from './components/component-loader.js';
import { initTokoPage } from './toko.js';
import { semuaLayanan } from './data-layanan.js';
import { initLayananPage } from './pelayanan-jasa.js';
import { initSpesifikasiPage } from './spesifikasi.js';

// --- Fungsi Inisialisasi GLOBAL ---
// (Anda harus menyalin-tempel isi lengkap dari setiap fungsi ini dari file main.js lama Anda)
let activeNotifications = [];
function addNotification(id, message, type) { 
    /**
 * Menambahkan notifikasi ke daftar dan memperbarui UI.
 * @param {string} id - ID unik untuk notifikasi (e.g., 'dev-warning', 'connection-issue').
 * @param {string} message - Pesan notifikasi yang akan ditampilkan.
 * @param {string} type - Jenis notifikasi ('pemberitahuan' atau 'peringatan').
 */
    if (!activeNotifications.find(n => n.id === id)) {
        activeNotifications.push({ id, message, type }); // Tambahkan 'type'
        updateNotificationUI();
    }
}
 
function removeNotification(id) {
    /**
 * Menghapus notifikasi dari daftar dan memperbarui UI.
 * @param {string} id - ID notifikasi yang akan dihapus.
 */
    activeNotifications = activeNotifications.filter(n => n.id !== id);
    updateNotificationUI();
}
 
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

function initLoadingAndWelcomeScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const welcomeScreen = document.getElementById('welcome-screen');

    // Pengaman jika elemen tidak ada di halaman
    if (!loadingScreen || !welcomeScreen) {
        if(loadingScreen) loadingScreen.classList.add('hidden');
        if(welcomeScreen) welcomeScreen.classList.add('hidden');
        return;
    }

    // Fungsi inti yang akan dijalankan setelah semua kondisi terpenuhi
    const transitionToContent = () => {
        // Cek apakah welcome screen sudah pernah tampil di sesi ini
        if (sessionStorage.getItem('hasLoadedOnce')) {
            loadingScreen.classList.add('hidden');
            welcomeScreen.classList.add('hidden');
        } else {
            loadingScreen.classList.add('hidden');
            welcomeScreen.classList.remove('hidden');
            sessionStorage.setItem('hasLoadedOnce', 'true');
            
            setTimeout(() => {
                welcomeScreen.classList.add('swipe-up-animation-end');
            }, 1500);

            welcomeScreen.addEventListener('animationend', function onAnimationEnd() {
                welcomeScreen.classList.add('hidden');
                welcomeScreen.removeEventListener('animationend', onAnimationEnd);
            }, { once: true });
        }
    };

    // 1. Promise untuk waktu tunggu minimum
    const minTimePromise = new Promise(resolve => {
        setTimeout(resolve, 1000); // Anda bisa mengubah durasi ini (dalam milidetik)
    });

    // 2. Promise untuk event 'load' halaman yang sudah diperbaiki
    const pageLoadPromise = new Promise(resolve => {
        // PERBAIKANNYA DI SINI:
        // Cek dulu apakah halaman sudah selesai dimuat.
        if (document.readyState === 'complete') {
            // Jika sudah, langsung selesaikan promise ini.
            resolve();
        } else {
            // Jika belum, baru tambahkan listener untuk menunggu.
            window.addEventListener('load', resolve, { once: true });
        }
    });

    // 3. Jalankan transisi HANYA SETELAH KEDUA kondisi terpenuhi
    Promise.all([minTimePromise, pageLoadPromise]).then(() => {
        console.log("Durasi minimum & pemuatan halaman selesai. Memulai transisi...");
        transitionToContent();
    });
    
    // Logika untuk notifikasi koneksi tetap berjalan seperti biasa
    // ... (kode checkConnection Anda tidak perlu diubah) ...
    const connectionNotif = document.getElementById('connection-status-notif');
    const connectionNotifClose = document.getElementById('connection-notif-close');
    
    function checkConnection() {
        if (connectionNotif) {
            if (!navigator.onLine) {
                connectionNotif.classList.add('active');
                if(typeof addNotification === 'function') {
                    addNotification('connection-issue', 'Koneksi internet terputus atau tidak stabil.', 'peringatan');
                }
            } else {
                connectionNotif.classList.remove('active');
                if(typeof removeNotification === 'function') {
                    removeNotification('connection-issue');
                }
            }
        }
    }
    setInterval(checkConnection, 5000);
    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);
    if (connectionNotifClose) {
        connectionNotifClose.addEventListener('click', () => {
            if(connectionNotif) connectionNotif.classList.remove('active');
        });
    }
}

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
 }

/* -------------------- PENUTUP MODAL GLOBAL (DENGAN RESET) -------------------- */
function initGlobalModalClosers() {
    window.addEventListener('click', (e) => {
        const allModals = document.querySelectorAll('.modal, .modal-kontak, .modal-filter');
        
        allModals.forEach(modal => {
            if (modal.style.display === 'flex' && e.target === modal) {
                modal.style.display = 'none';
                
                // Cari form di dalam modal yang ditutup, lalu reset
                const form = modal.querySelector('form');
                if (form) {
                    resetForm(form);
                }
            }
        });
    });
}

function initContactReasonModal() { 
    
    // Definisikan semua alasan kontak dalam satu array agar mudah dikelola
    const contactReasons = [
        { id: 'layanan', text: 'Menghubungi untuk Layanan', subject: 'Permintaan Layanan AFANLY', 
            body: 'Halo, saya ingin bertanya tentang layanan yang tersedia.' },
        { id: 'pembelian', text: 'Menghubungi untuk Pembelian Barang', subject: 'Pemesanan Produk AFANLY', 
            body: 'Halo, saya ingin melakukan pemesanan produk.' },
        { id: 'request', text: 'Menghubungi untuk Permintaan Barang', subject: 'Permintaan Barang AFANLY', 
            body: 'Halo, saya ingin meminta barang yang tidak ada di katalog.' },
        { id: 'kritik', text: 'Menghubungi untuk Kritik & Saran', subject: 'Kritik & Saran AFANLY', 
            body: 'Halo, saya ingin memberikan kritik dan saran.' },
        { id: 'laporan', text: 'Menghubungi untuk Laporan Pengaduan', subject: 'Laporan Pengaduan AFANLY', 
            body: 'Halo, saya ingin memberikan laporan pengaduan.' },
        { id: 'lainnya', text: 'Keterangan Lainnya', subject: 'Informasi Lebih Lanjut AFANLY', 
            body: 'Halo, saya ingin bertanya tentang hal lain.' }
    ];

    // Ambil semua elemen yang diperlukan
    const triggers = document.querySelectorAll('.contact-trigger');
    const modal = document.getElementById('contact-reason-modal');
    const form = document.getElementById('contact-reason-form');
    const reasonSelect = document.getElementById('reasonSelect');
    const closeModalBtn = document.getElementById('closeReasonModal');

    if (!triggers.length || !modal || !form || !reasonSelect || !closeModalBtn) {
        return; // Jangan jalankan jika ada elemen yang hilang
    }

    let currentMethod = ''; // Untuk menyimpan 'email' atau 'whatsapp'

    // Isi dropdown dengan pilihan alasan
    contactReasons.forEach(reason => {
        const option = document.createElement('option');
        option.value = reason.id;
        option.textContent = reason.text;
        reasonSelect.appendChild(option);
    });

    // Event listener untuk pemicu (kartu Email & WhatsApp)
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            currentMethod = trigger.dataset.method;
            modal.style.display = 'flex';
        });
    });

    // Event listener utama saat form di-submit
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Mencegah form mengirim dan me-reload halaman

        if (!form.checkValidity()) {
          // Jika form tidak valid, picu pesan error bawaan browser pada field yang salah
          form.reportValidity();
          // Hentikan eksekusi fungsi agar tidak lanjut mengirim
          return;
        }

        // 1. Kumpulkan semua data dari form
        const nama = document.getElementById('namaInput').value;
        const telp = document.getElementById('telpInput').value;
        const email = document.getElementById('emailInput').value;
        const pesanPengguna = document.getElementById('pesanInput').value;
        const selectedReasonId = reasonSelect.value;
        const selectedReason = contactReasons.find(r => r.id === selectedReasonId);

        // 2. Buat template pesan yang detail
        const templatePesan = `
${selectedReason.subject}

-- Detail Pengirim --
Nama: ${nama}
No. Telp: ${telp}
Email: ${email}

-- Isi Pesan --
${pesanPengguna}
`.trim();

        // 3. Buat URL sesuai metode kontak yang dipilih
        const waNumber = '628127659073';
        const emailAddress = 'defry.pku@gmail.com';
        let url = '';

        if (currentMethod === 'whatsapp') {
            const pesanWA = encodeURIComponent(templatePesan);
            url = `https://wa.me/${waNumber}?text=${pesanWA}`;
        } else if (currentMethod === 'email') {
            const subject = encodeURIComponent(selectedReason.subject);
            const body = encodeURIComponent(templatePesan);
            url = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
        }

        // 4. Buka link dan tutup modal
        if (url) {
            window.open(url, '_blank');
        }
        
        modal.style.display = 'none';
        form.reset(); // Kosongkan form setelah dikirim
    });

    // Event listener untuk tombol tutup (X)
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        resetForm(form); // Kosongkan form saat modal ditutup
    });
 }

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

function initYear() { 
    
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
 }

function renderServices() { 
    
    const wrapper = document.getElementById('layanan-wrapper');
    // Pastikan fungsi ini hanya berjalan jika elemen dan datanya ada
    if (!wrapper || typeof semuaLayanan === 'undefined') {
        // Jika di halaman lain tidak ada section#services, ini akan dilewati tanpa error
        return;
    }

    // Ambil beberapa layanan untuk ditampilkan di halaman utama (misalnya 4 pertama)
    const layananTampil = semuaLayanan.slice(0, 4);

    wrapper.innerHTML = ''; // Kosongkan wrapper

    layananTampil.forEach(layanan => {
        const photocard = document.createElement('div');
        photocard.className = 'photocard';
        
        photocard.innerHTML = `
            <img src="${layanan.gambar}" alt="${layanan.nama}">
            <p>${layanan.nama}</p>
            <span class="service-desc">${layanan.deskripsi}</span>
        `;
        wrapper.appendChild(photocard);
    });
    
    // Inisialisasi ulang fungsionalitas swipe/drag setelah card dirender
    initCardSwipe('layanan-wrapper');
 }

function initCardSwipe(wrapperId) { 
    
    const cardWrapper = document.getElementById(wrapperId);
    if (!cardWrapper) return;

    let isDown = false, startX, scrollLeft;

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

function initSmartScrollToCenter() {
    const scrollLinks = document.querySelectorAll('.navbar a[href^="#"], .sidebar a[href^="#"]');

    scrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // 1. Mencegah perilaku default browser agar kita bisa mengontrol scroll sepenuhnya.
            e.preventDefault();

            const href = this.getAttribute('href');

            if (href === '#' || href === '#top') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return; // Hentikan eksekusi setelah scroll
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

/* -------------------- VALIDASI FORMULIR REAL-TIME (VERSI FINAL) -------------------- */
function initFormValidation() {
    // Ambil SEMUA form yang ingin kita validasi dengan class .contact-form
    const formsToValidate = document.querySelectorAll('.contact-form');
    
    formsToValidate.forEach(form => {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

        // Fungsi helper untuk memvalidasi satu field
        const validateField = (input) => {
            const errorContainer = input.nextElementSibling;
            if (!errorContainer || !errorContainer.classList.contains('error-message')) return;

            // checkValidity() akan otomatis mengecek aturan seperti 'required', 'pattern', 'minlength', dll.
            if (input.checkValidity()) {
                input.classList.remove('is-invalid');
                errorContainer.textContent = '';
            } else {
                input.classList.add('is-invalid');
                // Ambil pesan error dari atribut 'title' di HTML untuk pesan yang lebih ramah
                errorContainer.textContent = input.title || input.validationMessage;
            }
        };

        // Tambahkan listener untuk setiap input
        inputs.forEach(input => {
            // Validasi saat pengguna selesai mengetik dan pindah dari input
            input.addEventListener('blur', () => validateField(input));
            // Hapus tanda error secara real-time saat pengguna mulai memperbaiki isinya
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) {
                    validateField(input);
                }
            });
        });

        // Modifikasi event listener submit yang sudah ada untuk validasi akhir
        form.addEventListener('submit', (e) => {
            let isFormValid = true;
            // Validasi semua field sekali lagi saat tombol kirim ditekan
            inputs.forEach(input => {
                validateField(input);
                if (!input.checkValidity()) {
                    isFormValid = false;
                }
            });

            // Jika ada satu saja yang tidak valid, batalkan pengiriman
            if (!isFormValid) {
                e.preventDefault();
                console.log("Formulir tidak valid. Pengiriman dibatalkan.");
            }
        });
    });
}

/**
 * Fungsi universal untuk membersihkan formulir dan status validasinya.
 * @param {HTMLElement} formElement - Elemen form yang ingin di-reset.
 */
function resetForm(formElement) {
    if (!formElement) return;

    // 1. Mengosongkan semua nilai input di dalam form
    formElement.reset();

    // 2. Hapus semua kelas 'is-invalid' dari setiap input
    const invalidInputs = formElement.querySelectorAll('.is-invalid');
    invalidInputs.forEach(input => {
        input.classList.remove('is-invalid');
    });

    // 3. Kosongkan semua teks pesan error
    const errorMessages = formElement.querySelectorAll('.error-message');
    errorMessages.forEach(message => {
        message.textContent = '';
    });
}

// --- FUNGSI UTAMA APLIKASI ---
async function main() {
    // Dapatkan nama halaman dari atribut data-page di body
    const pageName = document.body.dataset.page;

    // Langkah A: Muat semua komponen HTML yang relevan untuk halaman ini
    // "await" akan MEMASTIKAN JavaScript menunggu sampai semua HTML siap.
    await loadAllComponents(pageName);

    // Langkah B: Setelah HTML dijamin ada, jalankan semua skrip inisialisasi
    console.log("Semua komponen dimuat. Menjalankan skrip inisialisasi...");

    // Inisialisasi Global (selalu berjalan)
    initLoadingAndWelcomeScreen();
    initDarkMode();
    initSidebar();
    initNotificationCenter();
    initGlobalModalClosers();
    initContactReasonModal();
    initDevNotif();
    initYear();
    initSmartScrollToCenter();
    initFormValidation();
    
    // Inisialisasi Spesifik Halaman (hanya berjalan jika di halaman yang tepat)
    if (pageName === 'index') {
        console.log("Inisialisasi Halaman Utama...");
        renderServices();
        startAutoScrollCardWrapper();
        initAboutCarousel();
    } else if (pageName === 'toko') {
        initTokoPage();
    } else if (pageName === 'pelayanan') {
        initLayananPage();
    } else if (pageName === 'spesifikasi') {
        initSpesifikasiPage();
    }
}

// --- 4. JALANKAN APLIKASI ---
document.addEventListener("DOMContentLoaded", main);