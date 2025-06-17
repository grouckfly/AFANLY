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
                <h2>${produk.nama}</h2>
                <img src="${produk.gambar}" alt="${produk.nama}" class="detail-image">
                <div class="detail-info">
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

    // Inisialisasi dark mode (jika ada)
    if (typeof initDarkMode === 'function') {
        initDarkMode();
    }

    // Set tahun footer
    document.getElementById('year').textContent = new Date().getFullYear();
});
