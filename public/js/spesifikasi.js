/* Spesifikasi Produk - Halaman Detail Produk */
document.addEventListener('DOMContentLoaded', function() {
    // Ambil parameter dari URL
    const urlParams = new URLSearchParams(window.location.search);
    // Mengambil produk berdasarkan NAMA, bukan ID
    const namaProduk = decodeURIComponent(urlParams.get('produk')); // Gunakan 'produk' untuk nama

    // Ambil data produk dari localStorage
    const semuaProduk = JSON.parse(localStorage.getItem('semuaProduk'));

    if (semuaProduk) {
        // Cari produk berdasarkan NAMA
        const produk = semuaProduk.find(p => p.nama === namaProduk);

        if (produk) {
            const detailProdukContainer = document.getElementById('detail-produk');
            detailProdukContainer.innerHTML = ''; // Kosongkan konten sebelumnya

            // --- Bagian Galeri Gambar ---
            const imageGalleryDiv = document.createElement('div');
            imageGalleryDiv.classList.add('product-image-gallery');

            const mainImageWrapper = document.createElement('div');
            mainImageWrapper.classList.add('main-image-wrapper');

            const mainImage = document.createElement('img');
            // Gunakan gambar pertama dari gallery atau fallback ke gambar utama
            // Pastikan produk.gallery adalah array dan tidak kosong
            mainImage.src = (produk.gallery && produk.gallery.length > 0) ? produk.gallery[0] : produk.gambar;
            mainImage.alt = produk.nama;
            mainImage.classList.add('detail-image');
            mainImage.id = 'mainProductImage'; // Tambahkan ID untuk referensi JS

            // Tombol navigasi
            const prevBtn = document.createElement('button');
            prevBtn.classList.add('gallery-nav', 'prev');
            prevBtn.id = 'prevImageBtn';
            prevBtn.textContent = '❮';

            const nextBtn = document.createElement('button');
            nextBtn.classList.add('gallery-nav', 'next');
            nextBtn.id = 'nextImageBtn';
            nextBtn.textContent = '❯';

            mainImageWrapper.appendChild(mainImage);
            // Tambahkan tombol navigasi hanya jika ada lebih dari 1 gambar di galeri
            if (produk.gallery && produk.gallery.length > 1) {
                mainImageWrapper.appendChild(prevBtn);
                mainImageWrapper.appendChild(nextBtn);
            }

            const thumbnailWrapper = document.createElement('div');
            thumbnailWrapper.classList.add('thumbnail-wrapper');
            thumbnailWrapper.id = 'thumbnailContainer';

            // Tambahkan thumbnail
            // Pastikan menggunakan produk.gallery jika ada, jika tidak, hanya gambar utama
            const imagesToDisplay = (produk.gallery && produk.gallery.length > 0) ? produk.gallery : [produk.gambar];

            imagesToDisplay.forEach((imgSrc, index) => {
                const thumbnail = document.createElement('img');
                thumbnail.src = imgSrc;
                thumbnail.alt = `Thumbnail ${index + 1} of ${produk.nama}`;
                thumbnail.classList.add('thumbnail');
                if (index === 0) {
                    thumbnail.classList.add('active'); // Set gambar pertama sebagai aktif
                }
                thumbnail.dataset.index = index; // Simpan indeks untuk navigasi
                thumbnailWrapper.appendChild(thumbnail);
            });

            imageGalleryDiv.appendChild(mainImageWrapper);
            // Tampilkan thumbnail wrapper hanya jika ada lebih dari 1 gambar
            if (imagesToDisplay.length > 1) {
                imageGalleryDiv.appendChild(thumbnailWrapper);
            }

            detailProdukContainer.appendChild(imageGalleryDiv);

            // --- Bagian Detail Info ---
            const detailInfoDiv = document.createElement('div');
            detailInfoDiv.classList.add('detail-info');
            detailInfoDiv.innerHTML = `
                <h2>${produk.nama}</h2>
                <p><strong>Jenis:</strong> ${produk.jenis}</p>
                <p><strong>Harga:</strong> ${produk.harga}</p>
                <p><strong>Deskripsi:</strong> ${produk.deskripsi}</p> <div class="produk-actions">
                    <button class="beli-btn" data-produk="${produk.nama}">Beli</button>
                    <a href="toko.html#produk" class="spec-btn">Kembali ke Produk</a>
                </div>
            `;
            // Perbaikan kecil: typo di sini, seharusnya detailProdukContainer
            detailProdukContainer.appendChild(detailInfoDiv); // Menggunakan detailProdukContainer yang benar

            // --- Logika Galeri Gambar (Next/Prev dan Thumbnail Click) ---
            let currentImageIndex = 0;
            // Gunakan imagesToDisplay yang sudah disiapkan
            const galleryImages = imagesToDisplay;

            function updateGallery(index) {
                mainImage.src = galleryImages[index];
                // Hapus kelas 'active' dari semua thumbnail
                document.querySelectorAll('.thumbnail-wrapper .thumbnail').forEach(thumb => {
                    thumb.classList.remove('active');
                });
                // Tambahkan kelas 'active' ke thumbnail yang sedang ditampilkan
                const activeThumbnail = document.querySelector(`.thumbnail-wrapper .thumbnail[data-index="${index}"]`);
                if (activeThumbnail) {
                    activeThumbnail.classList.add('active');
                    // Gulir ke thumbnail yang aktif jika perlu
                    activeThumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            }

            // Tambahkan event listener hanya jika ada lebih dari 1 gambar
            if (galleryImages.length > 1) {
                prevBtn.addEventListener('click', () => {
                    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
                    updateGallery(currentImageIndex);
                });

                nextBtn.addEventListener('click', () => {
                    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
                    updateGallery(currentImageIndex);
                });

                thumbnailWrapper.addEventListener('click', (e) => {
                    if (e.target.classList.contains('thumbnail')) {
                        currentImageIndex = parseInt(e.target.dataset.index);
                        updateGallery(currentImageIndex);
                    }
                });
                // Inisialisasi galeri agar gambar pertama aktif
                updateGallery(currentImageIndex);
            }


            // --- Event Listener untuk tombol "Beli" ---
            const tombolBeli = detailInfoDiv.querySelector('.beli-btn');
            if (tombolBeli) {
                tombolBeli.addEventListener('click', function(e) {
                    e.preventDefault();
                    const namaProdukUntukModal = this.getAttribute('data-produk');
                    // Panggil fungsi validasiPembelian yang didefinisikan di toko.js
                    if (typeof validasiPembelian === 'function') {
                        validasiPembelian(namaProdukUntukModal);
                    } else {
                        console.error("Fungsi 'validasiPembelian' tidak ditemukan. Pastikan toko.js dimuat sebelum spesifikasi.js.");
                    }
                });
            }
            
            // Inisialisasi zoom setelah gambar utama di-render
            initializeZoom(); // Panggil fungsi initializeZoom di sini
        } else {
            // Jika produk tidak ditemukan
            document.getElementById('detail-produk').innerHTML = `
                <h2>Produk Tidak Ditemukan</h2>
                <p>Produk "${namaProduk}" tidak ditemukan di katalog kami.</p>
                <a href="toko.html#produk" class="spec-btn">Lihat Produk Lainnya</a>
            `;
        }
    } else {
        // Jika data produk tidak tersedia di localStorage
        document.getElementById('detail-produk').innerHTML = `
            <h2>Data Produk Tidak Tersedia</h2>
            <p>Silakan kembali ke halaman utama untuk melihat produk.</p>
            <a href="toko.html" class="spec-btn">Kembali ke Halaman Utama</a>
        `;
    }

    // Set tahun footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Inisialisasi Dark Mode
    initDarkMode();

    // Inisialisasi Notifikasi Pengembangan
    // Jika initDevNotif ada di main.js, pastikan main.js dimuat.
    // Jika tidak, Anda perlu mendefinisikan initDevNotif di sini atau di file lain yang dimuat.
    if (typeof initDevNotif === 'function') {
        initDevNotif(); 
    } else {
        // Minimal implementasi untuk notifikasi pengembangan jika main.js tidak mendefinisikannya
        const devNotif = document.getElementById('dev-notif');
        const notifCloseBtn = document.getElementById('notif-close');
        const toggleNotifBtn = document.getElementById('toggle-notif');
        const sidebarNotifToggleBtn = document.getElementById('sidebar-notif-toggle');

        function toggleDevNotif() {
            if (devNotif) {
                devNotif.style.display = devNotif.style.display === 'block' ? 'none' : 'block';
            }
        }
        if (notifCloseBtn) notifCloseBtn.addEventListener('click', () => { if (devNotif) devNotif.style.display = 'none'; });
        if (toggleNotifBtn) toggleNotifBtn.addEventListener('click', toggleDevNotif);
        if (sidebarNotifToggleBtn) sidebarNotifToggleBtn.addEventListener('click', toggleDevNotif);

        // Tampilkan notifikasi secara otomatis saat load
        if (devNotif) {
            setTimeout(() => {
                devNotif.style.display = 'block';
            }, 1000); // Muncul setelah 1 detik
            setTimeout(() => {
                devNotif.style.display = 'none';
            }, 5000); // Sembunyikan setelah 5 detik
        }
    }
});

/* -------------------- ZOOM PRODUK -------------------- */
// Fungsi ini dipisahkan agar bisa dipanggil setelah elemen gambar tersedia
function initializeZoom() {
    const mainProductImage = document.getElementById('mainProductImage');

    if (mainProductImage) {
        mainProductImage.addEventListener('click', function () {
            const isFullscreen = mainProductImage.classList.toggle('fullscreen');

            if (isFullscreen) {
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
                    mainProductImage.classList.remove('fullscreen');
                    overlay.remove();
                });
                document.body.appendChild(overlay);
            } else {
                const overlay = document.getElementById('overlay');
                if (overlay) overlay.remove();
            }
        });
    } else {
        console.warn('Main product image element not found for zoom functionality.');
    }
}

/* -------------------- DARK MODE -------------------- */
function initDarkMode() {
    console.log('initDarkMode() called.'); // Log ini akan muncul saat fungsi dipanggil

    const toggle = document.getElementById("darkModeToggle");
    const sidebarDarkBtn = document.getElementById("sidebarDarkModeToggle");
    const body = document.body;

    console.log('Element darkModeToggle:', toggle);        // Periksa ini!
    console.log('Element sidebarDarkModeToggle:', sidebarDarkBtn); // Periksa ini!

    if (!toggle || !sidebarDarkBtn) {
        console.error('ERROR: Dark mode toggle buttons not found or not ready. Check HTML IDs and script loading order.');
        // Jika masih null di sini, ada masalah besar dengan DOM
        return; 
    }

    const sunIcon = toggle.querySelector(".sun-icon");
    const moonIcon = toggle.querySelector(".moon-icon");
    const modeText = toggle.querySelector(".mode-text");

    const sidebarSunIcon = sidebarDarkBtn.querySelector(".sun-icon");
    const sidebarMoonIcon = sidebarDarkBtn.querySelector(".moon-icon");
    const sidebarModeText = sidebarDarkBtn.querySelector(".mode-text");

    // Pastikan ikon dan teks juga ditemukan
    console.log('Main Toggle Icons/Text:', { sunIcon, moonIcon, modeText });
    console.log('Sidebar Toggle Icons/Text:', { sidebarSunIcon, sidebarMoonIcon, sidebarModeText });


    function applyTheme(theme) {
        console.log('Applying theme:', theme); // Log untuk melihat tema yang diterapkan
        const isDarkMode = theme === "dark";
        if (isDarkMode) {
            body.classList.add("dark-mode");
            if (sunIcon) sunIcon.style.display = "none";
            if (moonIcon) moonIcon.style.display = "inline-block";
            if (modeText) modeText.textContent = "Mode Gelap";
            if (sidebarSunIcon) sidebarSunIcon.style.display = "none";
            if (sidebarMoonIcon) sidebarMoonIcon.style.display = "inline-block";
            if (sidebarModeText) sidebarModeText.textContent = "Mode Gelap";
        } else {
            body.classList.remove("dark-mode");
            if (sunIcon) sunIcon.style.display = "inline-block";
            if (moonIcon) moonIcon.style.display = "none";
            if (modeText) modeText.textContent = "Mode Cerah";
            if (sidebarSunIcon) sidebarSunIcon.style.display = "inline-block";
            if (sidebarMoonIcon) sidebarMoonIcon.style.display = "none";
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
        console.log('Aria attributes updated. Current mode:', isDark ? 'Dark' : 'Light');
    }

    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
        console.log('Stored theme found:', storedTheme);
        applyTheme(storedTheme);
    } else {
        const hour = new Date().getHours();
        const autoTheme = hour >= 18 || hour < 6 ? "dark" : "light";
        console.log('No stored theme. Applying auto theme:', autoTheme);
        applyTheme(autoTheme);
    }

    [toggle, sidebarDarkBtn].forEach((btn) => {
        if (btn) {
            btn.addEventListener("click", () => {
                console.log('Dark mode toggle clicked!'); // Log ini harus muncul saat diklik
                const isCurrentlyDark = body.classList.contains("dark-mode");
                const newTheme = isCurrentlyDark ? "light" : "dark";
                applyTheme(newTheme);
            });
        }
    });
    updateAriaAttributes();
    console.log('Dark mode event listeners attached.');
}