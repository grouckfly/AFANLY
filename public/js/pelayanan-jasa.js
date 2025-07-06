/**
 * File: pelayanan-jasa.js (Versi Modul Final & Mandiri)
 * Deskripsi: Modul untuk semua fungsionalitas di halaman pelayanan-jasa.html.
 * Modul ini mengimpor datanya sendiri dan diekspor untuk dipanggil oleh main.js.
 */

// LANGKAH 1: Impor data yang dibutuhkan langsung di file ini.
import { semuaLayanan } from './data-layanan.js';
import { openInquiryModal } from './toko.js';

// --- Fungsi-fungsi spesifik untuk halaman layanan ---

function renderLayananGrid(layananArray, container, notFoundMessage) {
    if (!container || !notFoundMessage) return;
    container.innerHTML = '';
    notFoundMessage.style.display = layananArray.length === 0 ? 'block' : 'none';

    layananArray.forEach(layanan => {
        const card = document.createElement('div');
        card.className = 'layanan-card';
        let tombolHTML;

        if (layanan.isBonus) {
            tombolHTML = `<span class="btn-cta btn-bonus">✓ Layanan Gratis</span>`;
        } else {
            tombolHTML = `
                <button class="btn-cta hubungi-layanan-btn" 
                        data-layanan-nama="${layanan.nama}" 
                        data-layanan-detail="${layanan.deskripsi}">
                    Ambil Jasa Ini
                </button>
            `;
        }
        
        card.innerHTML = `
            <img src="${layanan.gambar}" alt="${layanan.nama}">
            <div class="layanan-card-content">
                <h3>${layanan.nama}</h3>
                <p>${layanan.detail}</p>
                <div class="action-wrapper">${tombolHTML}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

function bukaModalLayanan(namaLayanan, detailLayanan) {
    const modal = document.getElementById('modalLayanan');
    const namaSpan = document.getElementById('modalLayananNama');
    const detailDiv = document.getElementById('modalLayananDetail');
    const waBtn = document.getElementById('modalLayananWaBtn');
    const emailBtn = document.getElementById('modalLayananEmailBtn');
    const closeBtn = document.getElementById('closeModalLayanan');

    if (!modal || !namaSpan || !detailDiv || !waBtn || !emailBtn || !closeBtn) {
        console.error("Elemen di dalam modal layanan (#modalLayanan) tidak ditemukan.");
        return;
    }

    namaSpan.textContent = namaLayanan;
    detailDiv.innerHTML = `<p>${detailLayanan}</p>`;

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

    waBtn.href = `https://wa.me/628127659073?text=${pesanWA}`;
    emailBtn.href = `mailto:defry.pku@gmail.com?subject=${subjectEmail}&body=${bodyEmail}`;

    modal.style.display = 'flex';
    closeBtn.onclick = () => { modal.style.display = 'none'; };
}


// --- Fungsi Inisialisasi Utama yang Diekspor untuk main.js ---

export function initLayananPage() {
    console.log("Inisialisasi Halaman Layanan Jasa (Versi Modul)...");
    
    const searchInput = document.getElementById('searchLayananInput');
    const container = document.getElementById('layanan-grid-container');
    const notFoundMessage = document.getElementById('layanan-notfound');

    if (!container || !searchInput || !notFoundMessage) {
        console.error("Elemen UI penting di halaman layanan tidak ditemukan.");
        return;
    }

    // Fungsi filter sekarang menggunakan 'semuaLayanan' yang sudah diimpor.
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
            const namaLayanan = e.target.dataset.layananNama;
            
            // Siapkan paket data untuk dikirim ke modal formulir
            const inquiryDetails = {
                namaDasar: namaLayanan,
                pilihan: {}, // Layanan tidak punya opsi seperti produk
                hargaFinal: null, // Harga didiskusikan nanti
                pesanAwal: `Halo, saya tertarik untuk konsultasi lebih lanjut mengenai layanan "${namaLayanan}".`
            };
            
            // Panggil fungsi global dari toko.js
            if (typeof openInquiryModal === 'function') {
                openInquiryModal(inquiryDetails);
            } else {
                console.error("Fungsi 'openInquiryModal' tidak ditemukan. Pastikan toko.js sudah dimuat.");
            }
        }
    });

    // Event listener untuk input pencarian
    searchInput.addEventListener('input', filterLayanan);

    // Render semua layanan saat halaman pertama kali dimuat
    renderLayananGrid(semuaLayanan, container, notFoundMessage);
}