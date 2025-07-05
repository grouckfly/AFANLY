/**
 * File: pelayanan-jasa.js
 * Deskripsi: Skrip untuk merender dan memfilter daftar layanan jasa.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Pastikan data layanan sudah tersedia dari data-layanan.js
    if (typeof semuaLayanan === 'undefined') {
        console.error("Data layanan (semuaLayanan) tidak ditemukan.");
        return;
    }
    
    // Ambil elemen-elemen penting dari DOM
    const searchInput = document.getElementById('searchLayananInput');
    const container = document.getElementById('layanan-grid-container');
    const notFoundMessage = document.getElementById('layanan-notfound');

    if (!container || !searchInput || !notFoundMessage) {
        console.error("Elemen container, search input, atau pesan not found tidak ada di halaman.");
        return;
    }

    // Fungsi untuk merender kartu layanan ke dalam grid
    const renderLayananGrid = (layananArray) => {
        container.innerHTML = ''; // Kosongkan grid sebelum diisi ulang

        if (layananArray.length === 0) {
            // Jika tidak ada hasil, tampilkan pesan
            notFoundMessage.style.display = 'block';
        } else {
            // Jika ada hasil, sembunyikan pesan
            notFoundMessage.style.display = 'none';
        }

        layananArray.forEach(layanan => {
            const card = document.createElement('div');
            card.className = 'layanan-card';

            const waLink = `https://wa.me/628127659073?text=Permintaan%20Layanan%20AFANLY%0A%0ASaya%20tertarik%20dengan%20layanan:%20${encodeURIComponent(layanan.nama)}%0A%0ADeskripsi%20Kebutuhan:%20`;
            
            card.innerHTML = `
                <img src="${layanan.gambar}" alt="${layanan.nama}">
                <div class="layanan-card-content">
                    <h3>${layanan.nama}</h3>
                    <p>${layanan.detail}</p>
                    <a href="${waLink}" target="_blank" rel="noopener" class="btn-cta">Hubungi Kami</a>
                </div>
            `;
            container.appendChild(card);
        });
    };

    // Fungsi untuk melakukan filter berdasarkan input pencarian
    const filterLayanan = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();

        const hasilFilter = semuaLayanan.filter(layanan => {
            // Cari kecocokan di nama, deskripsi, atau detail layanan
            return (
                layanan.nama.toLowerCase().includes(searchTerm) ||
                layanan.deskripsi.toLowerCase().includes(searchTerm) ||
                layanan.detail.toLowerCase().includes(searchTerm)
            );
        });

        // Render ulang grid dengan data yang sudah difilter
        renderLayananGrid(hasilFilter);
    };

    // Tambahkan event listener ke kolom pencarian
    // 'input' akan berjalan setiap kali pengguna mengetik atau menghapus
    searchInput.addEventListener('input', filterLayanan);

    // Render semua layanan saat halaman pertama kali dimuat
    renderLayananGrid(semuaLayanan);
});