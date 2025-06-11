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
});

// Tahun otomatis pada footer
document.getElementById('year').textContent = new Date().getFullYear();

// Validasi email
document.getElementById('emailLink').addEventListener('click', function(e) {
    const email = "defry.pku@gmail.com";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Email tidak valid!");
        e.preventDefault();
    }
});

// Validasi telepon
document.getElementById('phoneLink').addEventListener('click', function(e) {
    const phone = "081234567890";
    const phonePattern = /^[0-9]{10,15}$/;
    if (!phonePattern.test(phone.replace(/[^0-9]/g, ""))) {
        alert("Nomor telepon tidak valid!");
        e.preventDefault();
    }
});

// Validasi alamat (sederhana, hanya cek tidak kosong)
document.getElementById('addressLink').addEventListener('click', function(e) {
    const address = "Jl. Teknologi No. 123, Jakarta";
    if (!address || address.length < 5) {
        alert("Alamat tidak valid!");
        e.preventDefault();
    }
});

// Sidebar toggle
document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggle');
    toggleBtn.addEventListener('click', function () {
        sidebar.classList.toggle('active');
        document.body.classList.toggle('sidebar-open');
        // Sembunyikan tombol saat sidebar aktif
        if (sidebar.classList.contains('active')) {
            toggleBtn.style.display = 'none';
        } else {
            toggleBtn.style.display = 'block';
        }
    });

    // Optional: close sidebar when clicking outside (on mobile)
    document.addEventListener('click', function (e) {
        if (
            sidebar.classList.contains('active') &&
            !sidebar.contains(e.target) &&
            e.target !== toggleBtn
        ) {
            sidebar.classList.remove('active');
            document.body.classList.remove('sidebar-open');
            // Tampilkan tombol kembali saat sidebar ditutup
            toggleBtn.style.display = 'block';
        }
    });
});