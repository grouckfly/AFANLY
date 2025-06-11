document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('darkModeToggle');
    const sidebarDarkBtn = document.getElementById('sidebarDarkModeToggle');
    const body = document.body;

    function updateDarkModeButton() {
        const isDark = body.classList.contains('dark-mode');
        if (toggle) toggle.innerHTML = isDark ? '🌙' : '☀️';
        if (sidebarDarkBtn) sidebarDarkBtn.innerHTML = isDark ? '🌙' : '☀️';
    }

    // Cek preferensi sebelumnya
    let theme = localStorage.getItem('theme');
    if (!theme) {
        // Aktifkan dark mode otomatis jika jam >= 18:00
        const now = new Date();
        const hour = now.getHours();
        if (hour >= 18 || hour < 6) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        }
    } else if (theme === 'dark') {
        body.classList.add('dark-mode');
    }
    updateDarkModeButton();

    if (toggle) {
        toggle.addEventListener('click', function () {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
            updateDarkModeButton();
        });
    }

    if (sidebarDarkBtn) {
        sidebarDarkBtn.addEventListener('click', function () {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
            updateDarkModeButton();
        });
    }

    // Notifikasi dev-notif
    const devNotif = document.getElementById('dev-notif');
    const notifText = document.getElementById('notif-text');
    const notifClose = document.getElementById('notif-close');

    function minimizeNotif() {
        notifText.style.display = 'none';
        notifClose.style.display = 'none';
        // Tambahkan ikon peringatan jika belum ada
        if (!devNotif.querySelector('.notif-icon')) {
            const icon = document.createElement('span');
            icon.className = 'notif-icon';
            icon.innerText = '⚠️';
            icon.style.cursor = 'pointer';
            devNotif.appendChild(icon);

            // Event: klik ikon peringatan untuk restore notifikasi
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

    // Tahun otomatis pada footer
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Validasi email
    const emailLink = document.getElementById('emailLink');
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            const email = "defry.pku@gmail.com";
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert("Email tidak valid!");
                e.preventDefault();
            }
        });
    }

    // Validasi telepon
    const phoneLink = document.getElementById('phoneLink');
    if (phoneLink) {
        phoneLink.addEventListener('click', function(e) {
            const phone = "081234567890";
            const phonePattern = /^[0-9]{10,15}$/;
            if (!phonePattern.test(phone.replace(/[^0-9]/g, ""))) {
                alert("Nomor telepon tidak valid!");
                e.preventDefault();
            }
        });
    }

    // Validasi alamat (sederhana, hanya cek tidak kosong)
    const addressLink = document.getElementById('addressLink');
    if (addressLink) {
        addressLink.addEventListener('click', function(e) {
            const address = "Jl. Teknologi No. 123, Jakarta";
            if (!address || address.length < 5) {
                alert("Alamat tidak valid!");
                e.preventDefault();
            }
        });
    }

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    // body sudah dideklarasikan di atas

    if (sidebarToggle && sidebar && body) {
        sidebarToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
            body.classList.toggle('sidebar-open');
            // Sembunyikan tombol ketika sidebar aktif
        if (sidebar.classList.contains('active')) {
            sidebarToggle.style.display = 'none';
        } else {
            sidebarToggle.style.display = '';
        }
        });

        // Optional: klik di luar sidebar untuk menutup di mobile
        document.addEventListener('click', function (e) {
            if (
                sidebar.classList.contains('active') &&
                !sidebar.contains(e.target) &&
                e.target !== sidebarToggle
            ) {
                sidebar.classList.remove('active');
                body.classList.remove('sidebar-open');
                // Tampilkan kembali tombol ketika sidebar ditutup
            sidebarToggle.style.display = '';
            }
        });
    }

    // Infinite scroll untuk service carousel (lebih mulus, tanpa blur pada card utama)
    const carousel = document.getElementById('service-carousel');
    const btnLeft = document.querySelector('.carousel-btn.left');
    const btnRight = document.querySelector('.carousel-btn.right');

    if (carousel) {
        // Duplikat isi carousel untuk efek infinity
        carousel.innerHTML += carousel.innerHTML;

        // Scroll ke tengah saat load
        setTimeout(() => {
            const card = carousel.querySelector('.photocard');
            if (card) {
                const cardWidth = card.offsetWidth + parseInt(getComputedStyle(carousel).gap || 24);
                carousel.scrollLeft = carousel.scrollWidth / 2 - carousel.offsetWidth / 2;
            }
        }, 100);

        // Infinity scroll logic
        let isJumping = false;
        carousel.addEventListener('scroll', function () {
            if (isJumping) return;
            const maxScroll = carousel.scrollWidth / 2;
            if (carousel.scrollLeft < 10) {
                isJumping = true;
                carousel.scrollLeft += maxScroll - 20;
                setTimeout(() => { isJumping = false; }, 0);
            } else if (carousel.scrollLeft > carousel.scrollWidth - carousel.offsetWidth - 10) {
                isJumping = true;
                carousel.scrollLeft -= maxScroll - 20;
                setTimeout(() => { isJumping = false; }, 0);
            }
        });

        // Tombol geser
        const card = carousel.querySelector('.photocard');
        let scrollAmount = 300;
        if (card) {
            scrollAmount = card.offsetWidth + parseInt(getComputedStyle(carousel).gap || 24);
        }
        if (btnLeft && btnRight) {
            btnLeft.addEventListener('click', function () {
                carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
            btnRight.addEventListener('click', function () {
                carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }
    }

    // Highlight photocard tengah pada scroll (hanya blur card lain, card utama tetap jelas)
    function setActivePhotocard() {
        const cardWrapper = document.querySelector('.card-wrapper');
        const photocards = document.querySelectorAll('.photocard');
        if (!cardWrapper || !photocards.length) return;

        let minDiff = Infinity;
        let activeCard = null;
        const wrapperRect = cardWrapper.getBoundingClientRect();
        const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;

        photocards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const diff = Math.abs(wrapperCenter - cardCenter);
            if (diff < minDiff) {
                minDiff = diff;
                activeCard = card;
            }
        });

        photocards.forEach(card => {
            if (card === activeCard) {
                card.classList.add('active');
                card.style.opacity = "1";
                card.style.filter = "none";
                const desc = card.querySelector('.service-desc');
                if (desc) desc.style.filter = "none";
            } else {
                card.classList.remove('active');
                card.style.opacity = "0.6";
                card.style.filter = "blur(2px)";
                const desc = card.querySelector('.service-desc');
                if (desc) desc.style.filter = "blur(2px)";
            }
        });
    }

    const cardWrapper = document.querySelector('.card-wrapper');
    if (cardWrapper && cardWrapper.querySelectorAll('.photocard').length) {
        setActivePhotocard();
        cardWrapper.addEventListener('scroll', setActivePhotocard);
        window.addEventListener('resize', setActivePhotocard);
    }
});