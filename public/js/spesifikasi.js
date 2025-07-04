/**
 * File: spesifikasi.js
 * Versi Final & Lengkap
 * Deskripsi: Skrip untuk menangani halaman detail produk, termasuk:
 * - Galeri gambar interaktif (main image, thumbnail, next/prev).
 * - Sistem opsi produk independen via modal dengan kalkulasi harga dinamis.
 * - Fungsionalitas zoom gambar.
 */

document.addEventListener('DOMContentLoaded', function() {
    renderProductPage();
});

function renderProductPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const namaProduk = decodeURIComponent(urlParams.get('produk'));
    const semuaProduk = JSON.parse(localStorage.getItem('semuaProduk'));
    const detailProdukContainer = document.getElementById('detail-produk');

    if (!semuaProduk || !detailProdukContainer) {
        return handleError("Data produk tidak dapat dimuat.");
    }

    const produk = semuaProduk.find(p => p.nama === namaProduk);

    if (!produk) {
        return handleError(`Produk "${namaProduk}" tidak ditemukan.`);
    }

    // Render layout dasar (gambar, galeri) dan dapatkan div info
    const detailInfoDiv = renderBaseLayout(produk, detailProdukContainer);

    // Render detail info berdasarkan tipe produk (dengan atau tanpa opsi)
    if (produk.options && produk.hargaDasar !== undefined) {
        renderInfoWithOptions(produk, detailInfoDiv);
    } else {
        renderSimpleInfo(produk, detailInfoDiv);
    }
    
    // Inisialisasi fungsionalitas JS setelah semua elemen HTML dibuat
    initializeZoom();
}

// ================================================================
// FUNGSI-FUNGSI UNTUK MERENDER TAMPILAN
// ================================================================

function renderBaseLayout(produk, container) {
    container.innerHTML = '';
    
    const imageGalleryDiv = document.createElement('div');
    imageGalleryDiv.className = 'product-image-gallery';

    const mainImageWrapper = document.createElement('div');
    mainImageWrapper.className = 'main-image-wrapper';

    const mainImage = document.createElement('img');
    const imagesToDisplay = (produk.gallery && produk.gallery.length > 0) ? produk.gallery : [produk.gambar];
    mainImage.src = imagesToDisplay[0];
    mainImage.alt = produk.nama;
    mainImage.className = 'detail-image';
    mainImage.id = 'mainProductImage';
    mainImageWrapper.appendChild(mainImage);
    
    // --- LOGIKA GALERI YANG DIPERBAIKI ---
    // Tambahkan tombol navigasi hanya jika ada lebih dari 1 gambar
    if (imagesToDisplay.length > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.className = 'gallery-nav prev';
        prevBtn.id = 'prevImageBtn';
        prevBtn.textContent = '❮';
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'gallery-nav next';
        nextBtn.id = 'nextImageBtn';
        nextBtn.textContent = '❯';

        mainImageWrapper.appendChild(prevBtn);
        mainImageWrapper.appendChild(nextBtn);
    }
    imageGalleryDiv.appendChild(mainImageWrapper);

    // Tambahkan thumbnail hanya jika ada lebih dari 1 gambar
    if (imagesToDisplay.length > 1) {
        const thumbnailWrapper = document.createElement('div');
        thumbnailWrapper.className = 'thumbnail-wrapper';
        imagesToDisplay.forEach((imgSrc, index) => {
            const thumb = document.createElement('img');
            thumb.src = imgSrc;
            thumb.alt = `Thumbnail ${index + 1}`;
            thumb.className = 'thumbnail';
            thumb.dataset.index = index;
            if (index === 0) thumb.classList.add('active');
            thumbnailWrapper.appendChild(thumb);
        });
        imageGalleryDiv.appendChild(thumbnailWrapper);
    }
    
    const detailInfoDiv = document.createElement('div');
    detailInfoDiv.className = 'detail-info';

    container.appendChild(imageGalleryDiv);
    container.appendChild(detailInfoDiv);
    
    // Panggil setup untuk fungsionalitas galeri setelah elemennya dibuat
    setupGallery(imagesToDisplay);
    return detailInfoDiv;
}

function renderSimpleInfo(produk, container) {
    container.innerHTML += `
        <h2>${produk.nama}</h2>
        <div class="harga-display">${produk.harga}</div>
        <div class="deskripsi-produk">${produk.deskripsi}</div>
        <div class="produk-actions">
            <button class="beli-btn" data-produk="${produk.nama}" data-harga="${produk.harga}">Beli</button>
            <a href="toko.html#produk" class="spec-btn">Kembali ke Produk</a>
        </div>
    `;
    setupBeliButton(container, produk.nama);
}

/**
 * Merender info untuk produk dengan opsi varian via modal di halaman Spesifikasi.
 */
function renderInfoWithOptions(produk, container) {
    // 1. Siapkan kerangka HTML di halaman utama
    container.innerHTML = `
        <h2>${produk.nama}</h2>
        <button class="options-trigger-btn">⚙️ Ubah Spesifikasi</button>
        <div class="options-summary">Memuat pilihan...</div>
        <div class="harga-display"></div>
        <div class="deskripsi-produk">${produk.deskripsi}</div>
        <div class="produk-actions">
            <button class="beli-btn">Beli</button>
            <a href="toko.html#produk" class="spec-btn">Kembali ke Produk</a>
        </div>
    `;

    // 2. Ambil semua elemen yang relevan
    const optionsModal = document.getElementById('options-modal');
    const optionsBody = document.getElementById('options-modal-body');
    const openOptionsModalBtn = container.querySelector('.options-trigger-btn');
    const closeOptionsModalBtn = document.getElementById('closeOptionsModal');
    const applyBtn = document.getElementById('applyOptionsBtn');
    const priceDisplayModal = document.getElementById('options-modal-price');

    // 3. Mengatur konten & tombol sesuai konteks Halaman Spesifikasi
    document.getElementById('options-modal-title').textContent = `Ubah Opsi untuk ${produk.nama}`;
    applyBtn.textContent = 'Terapkan Pilihan'; // Ubah teks tombol

    // 4. Isi modal dengan opsi
    populateOptionsModal(produk, optionsBody);
    
    // 5. Fungsi untuk update harga (di halaman utama & di dalam modal) dan ringkasan
    const updatePriceAndSummary = () => {
        let totalHarga = produk.hargaDasar;
        const selectedOptionsText = [];
        const selectedOptionsData = {};
        const allSelects = optionsBody.querySelectorAll('select');

        allSelects.forEach(select => {
            totalHarga += parseInt(select.value, 10);
            const groupName = select.dataset.group;
            const selectedText = select.options[select.selectedIndex].textContent.split(' (')[0];
            selectedOptionsText.push(`<strong>${groupName}:</strong> ${selectedText}`);
            selectedOptionsData[groupName] = selectedText;
        });

        const hargaFinalFormatted = formatRupiah(totalHarga.toString());
        
        // Update di halaman utama
        container.querySelector('.harga-display').textContent = hargaFinalFormatted;
        container.querySelector('.options-summary').innerHTML = selectedOptionsText.join(' &bull; ');
        
        // Update juga harga di dalam modal
        priceDisplayModal.textContent = hargaFinalFormatted;

        // Siapkan detail untuk tombol Beli
        setupBeliButton(container, produk, selectedOptionsData, hargaFinalFormatted);
    };

    // 6. Atur Event Listeners
    openOptionsModalBtn.addEventListener('click', () => {
        // Update harga di modal setiap kali dibuka
        updatePriceAndSummary(); 
        optionsModal.style.display = 'flex';
    });
    
    closeOptionsModalBtn.addEventListener('click', () => optionsModal.style.display = 'none');
    
    // Listener untuk update harga live di dalam modal
    optionsBody.addEventListener('change', updatePriceAndSummary);

    const newApplyBtn = applyBtn.cloneNode(true);
    applyBtn.parentNode.replaceChild(newApplyBtn, applyBtn);
    newApplyBtn.addEventListener('click', () => {
        // Cukup tutup modal, karena harga sudah diupdate secara live
        optionsModal.style.display = 'none';
    });

    // Tampilkan harga dan ringkasan default saat halaman dimuat
    updatePriceAndSummary();
}

function populateOptionsModal(produk, modalBody) {
    modalBody.innerHTML = '';
    produk.options.forEach(optionGroup => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'option-group';
        const label = document.createElement('label');
        label.textContent = optionGroup.nama;
        const select = document.createElement('select');
        select.dataset.group = optionGroup.nama;
        optionGroup.choices.forEach(choice => {
            const optionEl = document.createElement('option');
            optionEl.value = choice.modifier;
            optionEl.textContent = choice.text;
            if (choice.default) optionEl.selected = true;
            select.appendChild(optionEl);
        });
        groupDiv.appendChild(label);
        groupDiv.appendChild(select);
        modalBody.appendChild(groupDiv);
    });
}


// =================================================================================
// FUNGSI UTILITAS & FUNGSI LAMA YANG DIPERTAHANKAN
// =================================================================================

function setupBeliButton(container, produk, pilihan = {}, hargaFinal = null) {
    const tombolBeli = container.querySelector('.beli-btn');
    if (tombolBeli && !tombolBeli.dataset.listenerAttached) {
        tombolBeli.addEventListener('click', function() {
            // Siapkan paket data pesanan setiap kali di-klik untuk data terbaru
            const detailPesanan = {
                namaDasar: produk.nama,
                pilihan: pilihan,
                hargaFinal: hargaFinal || produk.harga
            };

            if (produk.options) {
                const updatedOptions = {};
                const optionsBody = document.getElementById('options-modal-body');
                optionsBody.querySelectorAll('select').forEach(select => {
                    const groupName = select.dataset.group;
                    const selectedText = select.options[select.selectedIndex].textContent.split(' (')[0];
                    updatedOptions[groupName] = selectedText;
                });
                detailPesanan.pilihan = updatedOptions;
                detailPesanan.hargaFinal = container.querySelector('.harga-display').textContent;
            }
            
            if (typeof validasiPembelian === 'function') {
                validasiPembelian(detailPesanan);
            } else {
                console.error("Fungsi 'validasiPembelian' dari toko.js tidak ditemukan.");
            }
        });
        tombolBeli.dataset.listenerAttached = 'true';
    }
}

function setupGallery(images) {
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail-wrapper .thumbnail');
    const prevBtn = document.getElementById('prevImageBtn');
    const nextBtn = document.getElementById('nextImageBtn');
    let currentIndex = 0;

    if (!mainImage || images.length <= 1) {
        if(prevBtn) prevBtn.style.display = 'none';
        if(nextBtn) nextBtn.style.display = 'none';
        return;
    };

    function updateDisplay(index) {
        mainImage.src = images[index];
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
            if (i === index) {
                thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        });
    }

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            currentIndex = parseInt(thumb.dataset.index);
            updateDisplay(currentIndex);
        });
    });

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateDisplay(currentIndex);
        });
    
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateDisplay(currentIndex);
        });
    }
}

function handleError(message) {
    const container = document.getElementById('detail-produk');
    if (container) {
        container.innerHTML = `<div class="detail-info" style="text-align: center; width: 100%;"><h2>Terjadi Kesalahan</h2><p>${message}</p><div class="produk-actions" style="justify-content: center;"><a href="toko.html" class="spec-btn">Kembali ke Toko</a></div></div>`;
    }
}

function formatRupiah(angka) {
    if (angka === null || angka === undefined) return "0";
    let number_string = angka.toString().replace(/[^,\d]/g, ''),
        sisa = number_string.length % 3,
        rupiah = number_string.substr(0, sisa),
        ribuan = number_string.substr(sisa).match(/\d{3}/gi);
    if (ribuan) {
        let separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }
    return rupiah;
}

/**
 * Mengatur fungsionalitas Lightbox untuk gambar produk.
 * Versi baru yang lebih bersih dan modern.
 */
function initializeZoom() {
    // Ambil elemen-elemen yang diperlukan
    const mainProductImage = document.getElementById('mainProductImage');
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeBtn = document.getElementById('close-lightbox');

    // Pastikan semua elemen ada sebelum melanjutkan
    if (!mainProductImage || !lightbox || !lightboxImage || !closeBtn) {
        console.warn('Elemen untuk fungsionalitas lightbox tidak lengkap.');
        return;
    }

    // Event listener untuk MEMBUKA lightbox
    mainProductImage.addEventListener('click', function () {
        // Set sumber gambar di lightbox sesuai gambar yang di-klik
        lightboxImage.src = this.src;
        // Tampilkan lightbox
        lightbox.style.display = 'flex';
        // Kunci body agar tidak bisa di-scroll
        document.body.classList.add('lightbox-active');
    });

    // Fungsi untuk MENUTUP lightbox
    function closeLightbox() {
        lightbox.style.display = 'none';
        lightboxImage.src = ''; // Kosongkan src untuk menghemat memori
        document.body.classList.remove('lightbox-active');
    }

    // Tambahkan event listener untuk tombol tutup (X)
    closeBtn.addEventListener('click', closeLightbox);

    // Tambahkan event listener untuk menutup saat mengklik area gelap (latar belakang)
    lightbox.addEventListener('click', function(e) {
        // Hanya tutup jika yang di-klik adalah latar belakangnya, bukan gambarnya
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}