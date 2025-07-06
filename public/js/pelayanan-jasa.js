/**
 * File: pelayanan-jasa.js (Versi Final dengan Modal)
 * Deskripsi: Skrip untuk merender, memfilter, dan menangani
 * modal kontak khusus untuk halaman layanan jasa.
 */

// js/pelayanan-jasa.js

/**
 * FUNGSI BARU KHUSUS UNTUK MODAL LAYANAN
 * Fungsi ini membuka dan mengisi konten modal layanan.
 * @param {string} namaLayanan - Nama layanan yang dipilih.
 * @param {string} detailLayanan - Deskripsi singkat layanan.
 */

// --- Fungsi-fungsi spesifik halaman layanan ---
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

/**
 * Merender kartu-kartu layanan ke dalam grid.
 * @param {Array} layananArray - Array berisi objek layanan yang akan ditampilkan.
 * @param {HTMLElement} container - Elemen DOM (div) untuk menampung kartu.
 * @param {HTMLElement} notFoundMessage - Elemen DOM untuk pesan "tidak ditemukan".
 */
function renderLayananGrid(layananArray, container, notFoundMessage) {
    // Pengaman jika elemen tidak ditemukan
    if (!container || !notFoundMessage) return;

    container.innerHTML = ''; // Selalu kosongkan grid sebelum diisi ulang

    // Tampilkan atau sembunyikan pesan "tidak ditemukan"
    notFoundMessage.style.display = layananArray.length === 0 ? 'block' : 'none';

    layananArray.forEach(layanan => {
        const card = document.createElement('div');
        card.className = 'layanan-card';
        
        // Logika kondisional untuk menentukan jenis tombol
        let tombolHTML;
        if (layanan.isBonus) {
            // Jika ini layanan gratis/bonus, buat tombol non-interaktif
            tombolHTML = `<span class="btn-cta btn-bonus">✓ Layanan Gratis</span>`;
        } else {
            // Jika layanan biasa, buat tombol pemicu modal yang bisa diklik
            tombolHTML = `
                <button class="btn-cta hubungi-layanan-btn" 
                        data-layanan-nama="${layanan.nama}" 
                        data-layanan-detail="${layanan.deskripsi}">
                    Ambil Jasa Ini
                </button>
            `;
        }
        
        // Template HTML untuk setiap kartu
        card.innerHTML = `
            <img src="${layanan.gambar}" alt="${layanan.nama}">
            <div class="layanan-card-content">
                <h3>${layanan.nama}</h3>
                <p>${layanan.detail}</p>
                ${tombolHTML} 
            </div>
        `;
        container.appendChild(card);
    });
}

export function initLayananPage() {
    // Pastikan data global `semuaLayanan` ada sebelum melanjutkan
    if (typeof semuaLayanan === 'undefined') {
        console.error("Data layanan (semuaLayanan) tidak ditemukan. Pastikan data-layanan.js dimuat sebelum main.js.");
        return;
    }
    
    console.log("Inisialisasi Halaman Layanan Jasa...");
    
    const searchInput = document.getElementById('searchLayananInput');
    const container = document.getElementById('layanan-grid-container');
    const notFoundMessage = document.getElementById('layanan-notfound');

    if (!container || !searchInput || !notFoundMessage) {
        console.error("Elemen UI penting (container, search input, atau not found) di halaman layanan tidak ada.");
        return;
    }

    // Fungsi filter yang menggunakan data dari lingkup luar
    const filterLayanan = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const hasilFilter = semuaLayanan.filter(layanan => 
            layanan.nama.toLowerCase().includes(searchTerm) ||
            layanan.deskripsi.toLowerCase().includes(searchTerm) ||
            layanan.detail.toLowerCase().includes(searchTerm)
        );
        renderLayananGrid(hasilFilter, container, notFoundMessage);
    };

    // Event listener untuk klik pada tombol di dalam grid
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('hubungi-layanan-btn')) {
            bukaModalLayanan(e.target.dataset.layananNama, e.target.dataset.layananDetail);
        }
    });

    // Event listener untuk input pencarian
    searchInput.addEventListener('input', filterLayanan);

    // Render semua layanan saat halaman pertama kali dimuat
    renderLayananGrid(semuaLayanan, container, notFoundMessage);
}