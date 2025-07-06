// js/toko.js
// TIDAK perlu 'import { semuaProduk }...' karena sudah global dari HTML

// --- Semua fungsi helper dan inti dari toko.js lama Anda diletakkan di sini ---
function formatRupiah(angka) { 
    
    if (angka === null || angka === undefined) return 'Rp 0';
    // Menggunakan Intl.NumberFormat untuk cara yang lebih modern dan andal
    return "Rp " + new Intl.NumberFormat('id-ID').format(angka);
 }

function unformatRupiah(rupiah) { 
    
    if (!rupiah || typeof rupiah !== 'string') return 0;
    return parseInt(rupiah.replace(/[^0-9]/g, ''), 10) || 0;
 }

function renderProduk(data) { 
    
    const list = document.getElementById("produkList");
    const notFoundMessage = document.getElementById("produk-notfound");
 
    if (!list || !notFoundMessage) return;
 
    list.innerHTML = "";
 
    if (data.length === 0) {
        notFoundMessage.style.display = "flex";
        list.style.display = "none";
    } else {
        notFoundMessage.style.display = "none";
        list.style.display = "flex";
    }
 
    data.forEach(p => {
        const item = document.createElement("div");
        item.className = "produk";
        const encodedNama = encodeURIComponent(p.nama);
 
        let hargaTampil = '';
        if (p.hargaDasar !== undefined) {
            hargaTampil = `Mulai dari ${formatRupiah(p.hargaDasar)}`;
        } else {
            hargaTampil = p.harga;
        }

        const hargaUntukTombol = p.hargaDasar !== undefined ? formatRupiah(p.hargaDasar) : p.harga;
 
        item.innerHTML = `
            <img src="${p.gambar}" alt="${p.nama}">
            <h3>${p.nama}</h3>
            <span class="harga">${hargaTampil}</span>
            <div class="produk-actions">
                <button class="beli-btn" data-produk="${p.nama}" data-harga="${hargaUntukTombol}">Beli</button>
                <a href="spesifikasi.html?produk=${encodedNama}" class="spec-btn">Spesifikasi</a>
            </div>
        `;
        list.appendChild(item);
    });
 }

function filterProduk() { 
    
    const search = document.getElementById("searchInput").value.toLowerCase();
    const kategori = document.getElementById("kategoriSelect").value;
    const urutkan = document.getElementById("urutkanHargaSelect").value;
    const minHarga = unformatRupiah(document.getElementById("minPriceInput").value);
    let maxHarga = unformatRupiah(document.getElementById("maxPriceInput").value);
    if (maxHarga === 0) maxHarga = Infinity;
 
    let hasil = semuaProdukProcessed.filter(p => {
        const cocokPencarian = p.nama.toLowerCase().includes(search) || (p.deskripsi && p.deskripsi.toLowerCase().includes(search)) || p.jenis.toLowerCase().includes(search);
        const cocokKategori = kategori === "all" || p.jenis.toLowerCase() === kategori.toLowerCase();
        
        // Gunakan hargaAngka yang sudah diproses untuk filter harga
        const hargaUntukFilter = p.hargaAngka;
        const cocokHarga = hargaUntukFilter >= minHarga && hargaUntukFilter <= maxHarga;
        
        return cocokPencarian && cocokKategori && cocokHarga;
    });
 
    if (urutkan === 'terendah') {
        hasil.sort((a, b) => a.hargaAngka - b.hargaAngka);
    } else if (urutkan === 'tertinggi') {
        hasil.sort((a, b) => b.hargaAngka - a.hargaAngka);
    }
 
    renderProduk(hasil);
    updateFilterButtonState();
 
    const produkListElement = document.getElementById("produkList");
    if (produkListElement) produkListElement.scrollLeft = 0;
 }

function updateFilterButtonState() { 
    
    const kategori = document.getElementById("kategoriSelect").value;
    const urutkan = document.getElementById("urutkanHargaSelect").value;
    const minHarga = document.getElementById("minPriceInput").value;
    const maxHarga = document.getElementById("maxPriceInput").value;
    const openFilterBtn = document.getElementById("openFilterBtn");
 
    if (!openFilterBtn) return;

    const isFilterActive = kategori !== 'all' || urutkan !== 'default' || minHarga !== '' || maxHarga !== '';
 
    if (isFilterActive) {
        openFilterBtn.classList.add('active');
    } else {
        openFilterBtn.classList.remove('active');
    }
 }

function InitSliderHero() { 
    
    const items = document.querySelectorAll('#hero-slider-container .hero-slider-item');
    if (items.length === 0) return;
    let current = 0;
    function showNext() {
        items[current].classList.remove('active');
        current = (current + 1) % items.length;
        items[current].classList.add('active');
    }
    items[current].classList.add('active');
    setInterval(showNext, 3000);
 }

function InitProductSliderControls() { 
    
    const produkListElement = document.getElementById("produkList");
    const prevBtn = document.getElementById("prevProductBtn");
    const nextBtn = document.getElementById("nextProductBtn");
 
    if (!produkListElement || !prevBtn || !nextBtn) return;
 
    const scrollProducts = (direction) => {
        const scrollAmount = produkListElement.clientWidth * 0.8;
        produkListElement.scrollBy({
            left: direction === 'prev' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };
 
    prevBtn.addEventListener("click", () => scrollProducts('prev'));
    nextBtn.addEventListener("click", () => scrollProducts('next'));
 }

function handleBeliClick(produk) { 
    
    if (produk.options && produk.hargaDasar !== undefined) {
        // Jika produk punya varian, buka modal untuk memilih opsi
        openOptionsModal(produk);
    } else {
        // Jika produk sederhana, langsung panggil modal kontak
        const detailPesanan = {
            namaDasar: produk.nama,
            pilihan: {}, // Tidak ada pilihan spesifik
            hargaFinal: produk.harga
        };
        validasiPembelian(detailPesanan);
    }
 }

function openOptionsModal(produk) { 
    
    const optionsModal = document.getElementById('options-modal');
    const title = document.getElementById('options-modal-title');
    const body = document.getElementById('options-modal-body');
    const priceDisplay = document.getElementById('options-modal-price');
    const applyBtn = document.getElementById('applyOptionsBtn');
    const closeBtn = document.getElementById('closeOptionsModal');

    if (!optionsModal || !title || !body || !priceDisplay || !applyBtn || !closeBtn) {
        console.error("Elemen modal opsi tidak lengkap!");
        return;
    }

    // Mengatur konten & tombol sesuai konteks Halaman Toko
    title.textContent = `Pilih Opsi untuk ${produk.nama}`;
    applyBtn.textContent = 'Terapkan'; // Ubah teks tombol
    body.innerHTML = ''; 

    // Buat dropdown di dalam modal
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
        body.appendChild(groupDiv);
    });

    const calculatePriceInModal = () => {
        let totalHarga = produk.hargaDasar;
        const selectedOptions = {};
        body.querySelectorAll('select').forEach(select => {
            totalHarga += parseInt(select.value, 10);
            const groupName = select.dataset.group;
            const selectedText = select.options[select.selectedIndex].textContent.split(' (')[0];
            selectedOptions[groupName] = selectedText;
        });
        priceDisplay.textContent = formatRupiah(totalHarga);
        return { totalHarga, selectedOptions };
    };

    calculatePriceInModal(); // Panggil untuk harga awal

    body.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', calculatePriceInModal);
    });

    // Hapus listener lama untuk mencegah penumpukan, lalu tambahkan yang baru
    const newApplyBtn = applyBtn.cloneNode(true);
    applyBtn.parentNode.replaceChild(newApplyBtn, applyBtn);
    newApplyBtn.addEventListener('click', () => {
        const { totalHarga, selectedOptions } = calculatePriceInModal();
        const detailPesanan = {
            namaDasar: produk.nama,
            pilihan: selectedOptions,
            hargaFinal: formatRupiah(totalHarga)
        };
        validasiPembelian(detailPesanan); // Panggil modal kontak
        optionsModal.style.display = 'none'; // Tutup modal opsi
    });
    
    closeBtn.onclick = () => optionsModal.style.display = 'none';
    optionsModal.style.display = 'flex';
 }

function validasiPembelian(detailPesanan) { 
    
    const modal = document.getElementById('modalKontak');
    const namaProdukSpan = document.getElementById('modalNamaProduk');
    const hargaProdukSpan = document.getElementById('modalHargaProduk');
    const spekProdukDiv = document.getElementById('modalSpesifikasi');
    const waBtn = document.getElementById('modalWaBtn');
    const emailBtn = document.getElementById('modalEmailBtn');
    const closeBtn = document.getElementById('closeModalKontak');

    if (!modal || !namaProdukSpan || !hargaProdukSpan || !spekProdukDiv) return;

    namaProdukSpan.textContent = detailPesanan.namaDasar;
    hargaProdukSpan.textContent = detailPesanan.hargaFinal;

    let spekListHTML = '';
    let spekListText = '';
    if (detailPesanan.pilihan && Object.keys(detailPesanan.pilihan).length > 0) {
        spekListHTML = '<ul>';
        spekListText += '\n\nSpesifikasi yang Dipilih:';
        for (const [key, value] of Object.entries(detailPesanan.pilihan)) {
            spekListHTML += `<li><strong>${key}:</strong> ${value}</li>`;
            spekListText += `\n- ${key}: ${value}`;
        }
        spekListHTML += '</ul>';
        spekProdukDiv.style.display = 'block';
    } else {
        spekProdukDiv.style.display = 'none';
    }
    spekProdukDiv.innerHTML = spekListHTML;

    const templatePesan = `Pemesanan Produk AFANLY
------------------------
Produk: ${detailPesanan.namaDasar}${spekListText}

Harga Total: ${detailPesanan.hargaFinal}
------------------------

Mohon lengkapi data berikut:
Nama Pemesan:
No. Telpon:
Alamat Pengiriman:`.trim();

    const pesanWA = encodeURIComponent(templatePesan);
    const subjectEmail = encodeURIComponent(`Pemesanan Produk - ${detailPesanan.namaDasar}`);
    const bodyEmail = encodeURIComponent(templatePesan);

    waBtn.href = `https://wa.me/628127659073?text=${pesanWA}`;
    emailBtn.href = `mailto:defry.pku@gmail.com?subject=${subjectEmail}&body=${bodyEmail}`;

    modal.style.display = 'flex';

    closeBtn.onclick = () => modal.style.display = 'none';
 }

// --- Fungsi inisialisasi utama yang diekspor ---
export function initTokoPage() {
    console.log("Inisialisasi Halaman Toko...");
    
    const semuaProdukProcessed = semuaProduk.map(p => ({ ...p, hargaAngka: p.hargaDasar || unformatRupiah(p.harga) }));
    
    renderProduk(semuaProdukProcessed);
    
    // Setup event listeners spesifik untuk halaman toko
    const searchInput = document.getElementById("searchInput");
    if(searchInput) searchInput.addEventListener("input", () => filterProduk(semuaProdukProcessed));
    
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('beli-btn')) {
            e.preventDefault();
            const namaProduk = e.target.getAttribute('data-produk');
            const produk = semuaProduk.find(p => p.nama === namaProduk);
            if (produk) handleBeliClick(produk);
        }
    });
    
    // ... event listener untuk modal filter ...

    setupEventListeners();
    InitSliderHero();
    InitProductSliderControls();
}


// =================================================================================
// HELPER & PRE-PROCESSING
// =================================================================================


// Fungsi ini tidak lagi diperlukan jika data harga sudah berupa angka, tapi kita simpan untuk kompatibilitas
function preprocessProdukData(produkData) {
    return produkData.map(p => {
        // Proses hargaAngka hanya jika ada harga string (untuk produk lama)
        if (p.harga && !p.hargaDasar) {
            const hargaAngka = unformatRupiah(p.harga);
            return { ...p, hargaAngka };
        }
        // Untuk produk dengan varian, hargaAngka diambil dari hargaDasar
        if (p.hargaDasar !== undefined) {
            return { ...p, hargaAngka: p.hargaDasar };
        }
        return p;
    });
}

// Proses data produk sekali saat dimuat
const semuaProdukProcessed = preprocessProdukData(semuaProduk);


// =================================================================================
// INISIALISASI APLIKASI UTAMA
// =================================================================================

// Event listener utama yang akan berjalan setelah struktur HTML halaman siap.
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    // Simpan data ke localStorage untuk digunakan oleh halaman spesifikasi
    localStorage.setItem('semuaProduk', JSON.stringify(semuaProduk));

    // Render produk awal ke halaman
    renderProduk(semuaProdukProcessed); 
    
    // Siapkan semua event listener untuk interaksi pengguna
    setupEventListeners();
    
    // Inisialisasi fitur UI tambahan jika ada
    if (typeof InitSliderHero === 'function') InitSliderHero();
    if (typeof InitProductSliderControls === 'function') InitProductSliderControls();
}


// =================================================================================
// PENGATURAN SEMUA EVENT LISTENERS
// =================================================================================
function setupEventListeners() {
    // --- Event Listener Tombol Beli (Logika Baru) ---
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('beli-btn')) {
            e.preventDefault();
            const namaProduk = e.target.getAttribute('data-produk');
            const produk = semuaProduk.find(p => p.nama === namaProduk);
            if (produk) {
                handleBeliClick(produk);
            }
        }
    });

    // --- Event Listener untuk Filter & Modal Filter ---
    const searchInput = document.getElementById("searchInput");
    const openFilterBtn = document.getElementById("openFilterBtn");
    const closeFilterModalBtn = document.getElementById("closeFilterModal");
    const filterModal = document.getElementById("filter-modal");
    const applyFilterBtn = document.getElementById("applyFilterBtn");
    const resetFilterBtn = document.getElementById("resetFilterBtn");
    
    if (searchInput) searchInput.addEventListener("input", filterProduk);
    if (openFilterBtn) openFilterBtn.addEventListener("click", () => filterModal.style.display = "flex");
    if (closeFilterModalBtn) closeFilterModalBtn.addEventListener("click", () => filterModal.style.display = "none");
    if (applyFilterBtn) applyFilterBtn.addEventListener("click", () => {
        filterProduk();
        filterModal.style.display = "none";
    });
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener("click", () => {
            document.getElementById("kategoriSelect").value = "all";
            document.getElementById("urutkanHargaSelect").value = "default";
            document.getElementById("minPriceInput").value = "";
            document.getElementById("maxPriceInput").value = "";
            filterProduk();
            updateFilterButtonState();
        });
    }

    // Event listener untuk menutup modal saat klik di luar area konten
    window.addEventListener("click", (e) => {
        if (e.target === filterModal) filterModal.style.display = "none";
        const optionsModal = document.getElementById('options-modal');
        if (e.target === optionsModal) optionsModal.style.display = "none";
    });

    // Event listener auto-format harga pada input filter
    const minPriceInput = document.getElementById("minPriceInput");
    const maxPriceInput = document.getElementById("maxPriceInput");
    if (minPriceInput && maxPriceInput) {
        const handlePriceInput = (e) => {
            const unformatted = unformatRupiah(e.target.value);
            e.target.value = unformatted > 0 ? formatRupiah(unformatted).replace('Rp ', '') : '';
        };
        minPriceInput.addEventListener("input", handlePriceInput);
        maxPriceInput.addEventListener("input", handlePriceInput);
    }
}