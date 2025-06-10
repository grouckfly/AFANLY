document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('darkModeToggle');
    const sidebarDarkBtn = document.getElementById('sidebarDarkModeToggle');
    const body = document.body;

    // Fungsi untuk update label tombol
    function updateDarkModeButton() {
        const isDark = body.classList.contains('dark-mode');
        if (toggle) toggle.innerHTML = isDark ? '🌞 Mode Terang' : '🌓 Mode Gelap';
        if (sidebarDarkBtn) sidebarDarkBtn.innerHTML = isDark ? '🌞 Mode Terang' : '🌓 Mode Gelap';
    }

    // Cek preferensi sebelumnya
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
    }
    updateDarkModeButton();

    if (toggle) {
        toggle.addEventListener('click', function () {
            body.classList.toggle('dark-mode');
            // Simpan preferensi
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
            // Simpan preferensi
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
            updateDarkModeButton();
        });
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