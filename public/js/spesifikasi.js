document.addEventListener('DOMContentLoaded', function() {

    // Ambil parameter dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const namaProduk = decodeURIComponent(urlParams.get('produk'));

    // Ambil data produk dari localStorage
    const semuaProduk = JSON.parse(localStorage.getItem('semuaProduk'));

    if (semuaProduk) {
        const produk = semuaProduk.find(p => p.nama === namaProduk);

        if (produk) {
            document.getElementById('detail-produk').innerHTML = `
                <img src="${produk.gambar}" alt="${produk.nama}" class="detail-image">
                <div class="detail-info">
                <h2>${produk.nama}</h2>
                    <p><strong>Jenis:</strong> ${produk.jenis}</p>
                    <p><strong>Harga:</strong> ${produk.harga}</p>
                    <p><strong>Deskripsi:</strong> ${produk.deskripsi}</p>
                    <a href="toko.html#produk" class="spec-btn" style="margin-top: 1rem;">Kembali ke Produk</a>
                </div>
            `;
        } else {
            document.getElementById('detail-produk').innerHTML = `
                <h2>Produk Tidak Ditemukan</h2>
                <p>Produk "${namaProduk}" tidak ditemukan di katalog kami.</p>
                <a href="toko.html#produk" class="spec-btn">Lihat Produk Lainnya</a>
            `;
        }
    } else {
        document.getElementById('detail-produk').innerHTML = `
            <h2>Data Produk Tidak Tersedia</h2>
            <p>Silakan kembali ke halaman utama untuk melihat produk.</p>
            <a href="toko.html" class="spec-btn">Kembali ke Halaman Utama</a>
        `;
    }

    // Set tahun footer
    document.getElementById('year').textContent = new Date().getFullYear();
});

/* -------------------- ZOOM PRODUK -------------------- */
document.addEventListener('DOMContentLoaded', function () {
    const detailProdukContainer = document.getElementById('detail-produk');

    detailProdukContainer.addEventListener('click', function (event) {
        const target = event.target;

        if (target.tagName === 'IMG' && target.classList.contains('detail-image')) {
            // Toggle efek fullscreen
            const isFullscreen = target.classList.toggle('fullscreen');

            if (isFullscreen) {
                // Tambahkan overlay untuk gambar di layar penuh
                const overlay = document.createElement('div');
                overlay.id = 'overlay';
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                overlay.style.zIndex = '999';
                overlay.addEventListener('click', function () {
                    target.classList.remove('fullscreen');
                    overlay.remove();
                });
                document.body.appendChild(overlay);
            } else {
                // Hapus overlay jika gambar keluar dari fullscreen
                const overlay = document.getElementById('overlay');
                if (overlay) overlay.remove();
            }
        }
    });
});


/* -------------------- DARK MODE -------------------- */
function initDarkMode() {
  const toggle = document.getElementById("darkModeToggle");
  const sidebarDarkBtn = document.getElementById("sidebarDarkModeToggle");
  const body = document.body;

  const sunIcon = toggle.querySelector(".sun-icon");
  const moonIcon = toggle.querySelector(".moon-icon");
  const modeText = toggle.querySelector(".mode-text");

  const sidebarSunIcon = sidebarDarkBtn.querySelector(".sun-icon");
  const sidebarMoonIcon = sidebarDarkBtn.querySelector(".moon-icon");
  const sidebarModeText = sidebarDarkBtn.querySelector(".mode-text");

  function applyTheme(theme) {
    const isDarkMode = theme === "dark";
    if (isDarkMode) {
      body.classList.add("dark-mode");
      // Update main toggle
      sunIcon.style.display = "none";
      moonIcon.style.display = "inline-block";
      modeText.textContent = "Mode Gelap";
      // Update sidebar toggle
      sidebarSunIcon.style.display = "none";
      sidebarMoonIcon.style.display = "inline-block";
      sidebarModeText.textContent = "Mode Gelap";
    } else {
      body.classList.remove("dark-mode");
      // Update main toggle
      sunIcon.style.display = "inline-block";
      moonIcon.style.display = "none";
      modeText.textContent = "Mode Cerah";
      // Update sidebar toggle
      sidebarSunIcon.style.display = "inline-block";
      sidebarMoonIcon.style.display = "none";
      sidebarModeText.textContent = "Mode Cerah";
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

  // Inisialisasi mode berdasarkan localStorage atau waktu
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    const hour = new Date().getHours();
    const autoTheme = hour >= 18 || hour < 6 ? "dark" : "light";
    applyTheme(autoTheme);
  }

  // Event toggle tombol
  [toggle, sidebarDarkBtn].forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", () => {
        const isCurrentlyDark = body.classList.contains("dark-mode");
        const newTheme = isCurrentlyDark ? "light" : "dark";
        applyTheme(newTheme);
      });
    }
  });

  // Inisialisasi atribut aria
  updateAriaAttributes();
}