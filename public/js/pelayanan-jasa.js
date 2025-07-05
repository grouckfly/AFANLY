/**
 * File: pelayanan-jasa.js (Versi Final dengan Modal)
 * Deskripsi: Skrip untuk merender, memfilter, dan menangani
 * modal kontak khusus untuk halaman layanan jasa.
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
        console.error("Elemen UI penting di halaman layanan tidak ditemukan.");
        return;
    }

    // --- FUNGSI UNTUK MERENDER KARTU LAYANAN KE DALAM GRID ---
    const renderLayananGrid = (layananArray) => {
        container.innerHTML = ''; // Kosongkan grid sebelum diisi ulang

        if (layananArray.length === 0) {
            notFoundMessage.style.display = 'block';
        } else {
            notFoundMessage.style.display = 'none';
        }

        layananArray.forEach(layanan => {
            const card = document.createElement('div');
            card.className = 'layanan-card';
            
            // Perubahan: Tombol "Ambil Jasa Ini" sekarang menjadi <button> pemicu modal
            card.innerHTML = `
                <img src="${layanan.gambar}" alt="${layanan.nama}">
                <div class="layanan-card-content">
                    <h3>${layanan.nama}</h3>
                    <p>${layanan.detail}</p>
                    <button class="btn-cta hubungi-layanan-btn" 
                            data-layanan-nama="${layanan.nama}" 
                            data-layanan-detail="${layanan.deskripsi}">
                        Ambil Jasa Ini
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    };

    // --- FUNGSI UNTUK MELAKUKAN FILTER ---
    const filterLayanan = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const hasilFilter = semuaLayanan.filter(layanan => (
            layanan.nama.toLowerCase().includes(searchTerm) ||
            layanan.deskripsi.toLowerCase().includes(searchTerm) ||
            layanan.detail.toLowerCase().includes(searchTerm)
        ));
        renderLayananGrid(hasilFilter);
    };

    // --- EVENT LISTENER UNTUK SEMUA TOMBOL "AMBIL JASA INI" ---
    container.addEventListener('click', (e) => {
        // Menggunakan event delegation untuk menangani semua tombol secara efisien
        if (e.target.classList.contains('hubungi-layanan-btn')) {
            const tombol = e.target;
            const namaLayanan = tombol.dataset.layananNama;
            const detailLayanan = tombol.dataset.layananDetail;

            // Memanggil fungsi untuk membuka modal dengan data yang sesuai
            bukaModalLayanan(namaLayanan, detailLayanan);
        }
    });

    // --- INISIALISASI HALAMAN ---
    searchInput.addEventListener('input', filterLayanan);
    renderLayananGrid(semuaLayanan);
});


/**
 * FUNGSI BARU KHUSUS UNTUK MODAL LAYANAN
 * Fungsi ini membuka dan mengisi konten modal layanan.
 * @param {string} namaLayanan - Nama layanan yang dipilih.
 * @param {string} detailLayanan - Deskripsi singkat layanan.
 */
function bukaModalLayanan(namaLayanan, detailLayanan) {
    const modal = document.getElementById('modalLayanan');
    const namaSpan = document.getElementById('modalLayananNama');
    const detailDiv = document.getElementById('modalLayananDetail');
    const waBtn = document.getElementById('modalLayananWaBtn');
    const emailBtn = document.getElementById('modalLayananEmailBtn');
    const closeBtn = document.getElementById('closeModalLayanan');

    // Pengaman jika HTML modal tidak ada
    if (!modal || !namaSpan || !detailDiv || !waBtn || !emailBtn || !closeBtn) {
        console.error("Elemen di dalam modal layanan (#modalLayanan) tidak ditemukan! Pastikan HTML modal sudah benar.");
        return;
    }

    // Isi konten modal
    namaSpan.textContent = namaLayanan;
    detailDiv.innerHTML = `<p>${detailLayanan}</p>`;

    // Buat template pesan
    const templatePesan = `
Permintaan Layanan AFANLY
------------------------
Layanan: ${namaLayanan}
------------------------

Nama:
Alamat:
Kontak (WhatsApp/Email):
Deskripsi Permintaan Layanan:
    `.trim();

    const pesanWA = encodeURIComponent(templatePesan);
    const subjectEmail = encodeURIComponent(`Permintaan Layanan - ${namaLayanan}`);
    const bodyEmail = encodeURIComponent(templatePesan);

    // Set link tombol
    waBtn.href = `https://wa.me/628127659073?text=${pesanWA}`;
    emailBtn.href = `mailto:defry.pku@gmail.com?subject=${subjectEmail}&body=${bodyEmail}`;

    // Tampilkan modal
    modal.style.display = 'flex';

    // Atur event listener untuk menutup modal
    closeBtn.onclick = () => { modal.style.display = 'none'; };
    // Event listener untuk klik di luar modal sudah diatur secara global di main.js
}