/**
 * File: spesifikasi.js
 * Deskripsi: Skrip untuk menangani halaman detail produk, termasuk logika
 * untuk menampilkan produk dengan opsi varian yang dipilih melalui modal.
 */

// Event listener utama yang akan berjalan setelah struktur HTML halaman siap.
document.addEventListener('DOMContentLoaded', function() {
    renderProductPage();
});

/**
 * Fungsi utama untuk merender seluruh konten halaman spesifikasi produk.
 */
function renderProductPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const namaProduk = decodeURIComponent(urlParams.get('produk'));
    const semuaProduk = JSON.parse(localStorage.getItem('semuaProduk'));
    const detailProdukContainer = document.getElementById('detail-produk');

    if (!semuaProduk || !detailProdukContainer) {
        return handleError("Data produk tidak dapat dimuat. Silakan kembali ke halaman toko.");
    }
    const produk = semuaProduk.find(p => p.nama === namaProduk);
    if (!produk) {
        return handleError(`Produk dengan nama "${namaProduk}" tidak ditemukan.`);
    }

    const detailInfoDiv = renderBaseLayout(produk, detailProdukContainer);

    if (produk.options && produk.hargaDasar !== undefined) {
        renderInfoWithOptions(produk, detailInfoDiv);
    } else {
        renderSimpleInfo(produk, detailInfoDiv);
    }
    
    // Memanggil fungsi zoom yang sudah ada setelah elemen gambar dirender
    if (typeof initializeZoom === 'function') {
        initializeZoom();
    }
}


// ================================================================
// FUNGSI INTI UNTUK MERENDER KONTEN
// ================================================================

/**
 * Merender layout dasar (gambar, galeri) yang sama untuk semua produk.
 * @param {object} produk - Objek produk.
 * @param {HTMLElement} container - Elemen kontainer utama.
 * @returns {HTMLElement} - Elemen div untuk diisi detail info.
 */
function renderBaseLayout(produk, container) {
    container.innerHTML = ''; // Kosongkan
    
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

    if (imagesToDisplay.length > 1) {
        const thumbnailWrapper = document.createElement('div');
        thumbnailWrapper.className = 'thumbnail-wrapper';
        imagesToDisplay.forEach((imgSrc, index) => {
            const thumb = document.createElement('img');
            thumb.src = imgSrc;
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
    
    // Memanggil fungsi setup galeri yang sudah ada
    setupGallery(imagesToDisplay);
    return detailInfoDiv;
}

/**
 * Merender info untuk produk sederhana (tanpa opsi).
 * @param {object} produk - Objek produk.
 * @param {HTMLElement} container - Elemen untuk diisi info.
 */
function renderSimpleInfo(produk, container) {
    container.innerHTML += `
        <h2>${produk.nama}</h2>
        <div class="harga-display">${produk.harga}</div>
        <div class="deskripsi-produk">${produk.deskripsi}</div>
        <div class="produk-actions">
            <button class="beli-btn" data-produk="${produk.nama}">Beli</button>
            <a href="toko.html#produk" class="spec-btn">Kembali ke Produk</a>
        </div>
    `;
    setupBeliButton(container, produk.nama);
}

/**
 * Merender info untuk produk dengan opsi varian via modal.
 * @param {object} produk - Objek produk.
 * @param {HTMLElement} container - Elemen untuk diisi info.
 */
function renderInfoWithOptions(produk, container) {
    container.innerHTML += `
        <h2>${produk.nama}</h2>
        <button class="options-trigger-btn">⚙️ Ubah Spesifikasi</button>
        <div class="options-summary"></div>
        <div class="harga-display"></div>
        <div class="deskripsi-produk">${produk.deskripsi}</div>
        <div class="produk-actions">
            <button class="beli-btn">Beli</button>
            <a href="toko.html#produk" class="spec-btn">Kembali ke Produk</a>
        </div>
    `;

    const optionsModal = document.getElementById('options-modal');
    const optionsBody = document.getElementById('options-modal-body');
    const openOptionsModalBtn = container.querySelector('.options-trigger-btn');
    const closeOptionsModalBtn = document.getElementById('closeOptionsModal');
    const applyBtn = document.getElementById('applyOptionsBtn');
    const resetBtn = document.getElementById('resetOptionsBtn');
    
    populateOptionsModal(produk, optionsBody);
    
    const updatePriceAndSummary = () => {
        let totalHarga = produk.hargaDasar;
        const selectedOptionsText = [];
        const allSelects = optionsBody.querySelectorAll('select');

        allSelects.forEach(select => {
            totalHarga += parseInt(select.value, 10);
            const selectedText = select.options[select.selectedIndex].textContent.split(' (')[0];
            selectedOptionsText.push(`<strong>${select.dataset.group}:</strong> ${selectedText}`);
        });

        container.querySelector('.harga-display').textContent = `Rp ${formatRupiah(totalHarga.toString())}`;
        container.querySelector('.options-summary').innerHTML = selectedOptionsText.join(' &bull; ');
        
        const finalProductName = `${produk.nama} (${selectedOptionsText.map(s => s.split(': ')[1]).join(', ')})`;
        container.querySelector('.beli-btn').setAttribute('data-produk', finalProductName);
    };

    openOptionsModalBtn.addEventListener('click', () => optionsModal.style.display = 'flex');
    closeOptionsModalBtn.addEventListener('click', () => optionsModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === optionsModal) optionsModal.style.display = 'none';
    });

    applyBtn.addEventListener('click', () => {
        updatePriceAndSummary();
        optionsModal.style.display = 'none';
    });

    resetBtn.addEventListener('click', () => {
        populateOptionsModal(produk, optionsBody);
    });

    updatePriceAndSummary();
    setupBeliButton(container);
}


/**
 * Fungsi baru yang spesifik untuk mengisi dropdown di dalam modal.
 * @param {object} produk - Objek produk.
 * @param {HTMLElement} modalBody - Elemen body dari modal.
 */
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
            if (choice.default) {
                optionEl.selected = true;
            }
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

/**
 * Mengatur event listener untuk tombol "Beli".
 * Fungsi ini tidak diubah dari versi sebelumnya.
 */
function setupBeliButton(container) {
    const tombolBeli = container.querySelector('.beli-btn');
    if (tombolBeli && !tombolBeli.dataset.listenerAttached) {
        tombolBeli.addEventListener('click', function() {
            const namaProdukUntukModal = this.getAttribute('data-produk');
            if (typeof validasiPembelian === 'function') {
                validasiPembelian(namaProdukUntukModal);
            } else {
                console.error("Fungsi 'validasiPembelian' dari toko.js tidak ditemukan.");
            }
        });
        tombolBeli.dataset.listenerAttached = 'true';
    }
}

/**
 * Mengatur fungsionalitas galeri gambar.
 * Fungsi ini tidak diubah dari versi sebelumnya.
 */
function setupGallery(images) {
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail-wrapper .thumbnail');
    const prevBtn = document.getElementById('prevImageBtn');
    const nextBtn = document.getElementById('nextImageBtn');
    let currentIndex = 0;

    if (!mainImage || images.length <= 1) return;

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

/**
 * Menangani error jika produk/data tidak ditemukan.
 * Fungsi ini tidak diubah dari versi sebelumnya.
 */
function handleError(message) {
    const container = document.getElementById('detail-produk');
    if (container) {
        container.innerHTML = `
            <div class="detail-info" style="text-align: center; width: 100%;">
                <h2>Terjadi Kesalahan</h2>
                <p>${message}</p>
                <div class="produk-actions" style="justify-content: center;">
                    <a href="toko.html" class="spec-btn">Kembali ke Toko</a>
                </div>
            </div>
        `;
    }
}

/**
 * Helper untuk format Rupiah.
 * Fungsi ini tidak diubah dari versi sebelumnya.
 */
function formatRupiah(angka) {
    if (!angka) return "0";
    let number_string = angka.replace(/[^,\d]/g, '').toString(),
        split = number_string.split(','),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
        let separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }
    return rupiah;
}

/**
 * Mengatur fungsionalitas zoom pada gambar.
 * Fungsi ini tidak diubah dari versi Anda sebelumnya.
 */
function initializeZoom() {
    const mainProductImage = document.getElementById('mainProductImage');

    if (mainProductImage) {
        mainProductImage.addEventListener('click', function () {
            const isFullscreen = this.classList.toggle('fullscreen');
            let overlay = document.getElementById('fullscreen-overlay');

            if (isFullscreen) {
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.id = 'fullscreen-overlay';
                    // Gaya overlay bisa dipindahkan ke CSS untuk kebersihan
                    overlay.style.position = 'fixed';
                    overlay.style.inset = '0';
                    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
                    overlay.style.zIndex = '9999';
                    document.body.appendChild(overlay);
                    
                    overlay.addEventListener('click', () => {
                        this.classList.remove('fullscreen');
                        overlay.remove();
                    });
                }
            } else {
                if (overlay) overlay.remove();
            }
        });
    }
}