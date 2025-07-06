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

function renderProduk(data, container) {
    if (!container) return;
    const notFoundMessage = document.getElementById("produk-notfound");
    container.innerHTML = "";
    notFoundMessage.style.display = data.length === 0 ? "flex" : "none";
    container.style.display = data.length === 0 ? "none" : "flex";

    data.forEach(p => {
        const item = document.createElement("div");
        item.className = "produk";
        const encodedNama = encodeURIComponent(p.nama);
        const hargaTampil = p.hargaDasar !== undefined ? `Mulai dari ${formatRupiah(p.hargaDasar)}` : p.harga;
        
        item.innerHTML = `
            <img src="${p.gambar}" alt="${p.nama}">
            <h3>${p.nama}</h3>
            <span class="harga">${hargaTampil}</span>
            <div class="produk-actions" style="display: flex; gap: 10px;">
                <button class="beli-btn" data-produk-nama="${p.nama}">Beli</button>
                <a href="spesifikasi.html?produk=${encodedNama}" class="spec-btn">Spesifikasi</a>
            </div>
        `;
        container.appendChild(item);
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
        // Produk dengan varian: Buka modal untuk memilih opsi terlebih dahulu.
        openOptionsModal(produk);
    } else {
        // Produk sederhana: Langsung siapkan data dan buka formulir pemesanan.
        const detailPesanan = {
            namaDasar: produk.nama,
            pilihan: {},
            hargaFinal: produk.harga
        };
        openInquiryModal(detailPesanan);
    }
}

// Hapus validasiPembelian dan openOptionsModal lama, ganti dengan ini

function openOptionsModal(produk) {
    const optionsModal = document.getElementById('options-modal');
    if (!optionsModal) { return; }

    const title = optionsModal.querySelector('#options-modal-title');
    const body = optionsModal.querySelector('#options-modal-body');
    const priceDisplay = optionsModal.querySelector('#options-modal-price');
    const applyBtn = optionsModal.querySelector('#applyOptionsBtn');
    const closeBtn = optionsModal.querySelector('#closeOptionsModal');

    title.textContent = `Pilih Opsi untuk ${produk.nama}`;
    applyBtn.textContent = 'Lanjut ke Pembelian';
    body.innerHTML = '';

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
            selectedOptions[select.dataset.group] = select.options[select.selectedIndex].textContent.split(' (')[0];
        });
        priceDisplay.textContent = formatRupiah(totalHarga);
        return { totalHarga, selectedOptions };
    };

    calculatePriceInModal();
    body.querySelectorAll('select').forEach(select => select.addEventListener('change', calculatePriceInModal));

    const newApplyBtn = applyBtn.cloneNode(true);
    applyBtn.parentNode.replaceChild(newApplyBtn, applyBtn);
    newApplyBtn.addEventListener('click', () => {
        const { totalHarga, selectedOptions } = calculatePriceInModal();
        const detailPesanan = {
            namaDasar: produk.nama,
            pilihan: selectedOptions,
            hargaFinal: formatRupiah(totalHarga)
        };
        openInquiryModal(detailPesanan); // Panggil modal formulir akhir
        optionsModal.style.display = 'none';
    });

    closeBtn.onclick = () => optionsModal.style.display = 'none';
    optionsModal.style.display = 'flex';
}


// js/toko.js

export function openInquiryModal(inquiryDetails) {
    const modal = document.getElementById('inquiry-modal');
    if (!modal) {
        console.error("Modal formulir inquiry (#inquiry-modal) tidak ditemukan!");
        return;
    }

    // Ambil semua elemen di dalam modal
    const title = document.getElementById('inquiry-modal-title');
    const form = document.getElementById('inquiry-form');
    const itemNameInput = document.getElementById('inquiry-item-name');
    const itemSpecsDiv = document.getElementById('inquiry-item-specs');
    const priceWrapper = document.getElementById('inquiry-item-price-wrapper');
    const priceInput = document.getElementById('inquiry-item-price');
    const messageInput = document.getElementById('inquiry-message');
    const closeBtn = document.getElementById('closeInquiryModal');

    // --- Isi form dengan data yang dikirim ---
    form.reset(); // Selalu bersihkan form
    title.textContent = `Formulir untuk: ${inquiryDetails.namaDasar}`;
    itemNameInput.value = inquiryDetails.namaDasar;
    
    // Tampilkan spesifikasi jika ada
    if (inquiryDetails.pilihan && Object.keys(inquiryDetails.pilihan).length > 0) {
        let spekHTML = '<ul>';
        for (const [key, value] of Object.entries(inquiryDetails.pilihan)) {
            spekHTML += `<li><strong>${key}:</strong> ${value}</li>`;
        }
        spekHTML += '</ul>';
        itemSpecsDiv.innerHTML = spekHTML;
        itemSpecsDiv.style.display = 'block';
    } else {
        itemSpecsDiv.style.display = 'none';
    }

    // Tampilkan harga jika ada
    if (inquiryDetails.hargaFinal) {
        priceInput.value = inquiryDetails.hargaFinal;
        priceWrapper.style.display = 'block';
    } else {
        priceWrapper.style.display = 'none';
    }

    // Tampilkan pesan awal jika ada
    if (inquiryDetails.pesanAwal) {
        messageInput.value = inquiryDetails.pesanAwal;
    }

    // --- Atur event listener untuk form submit ---
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    newForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitMethod = e.submitter.dataset.method;

        const data = {
            namaUser: document.getElementById('inquiry-name').value,
            telpUser: document.getElementById('inquiry-phone').value,
            emailUser: document.getElementById('inquiry-email').value,
            alamatUser: document.getElementById('inquiry-address').value,
            pesanUser: document.getElementById('inquiry-message').value,
        };

        let spekListText = '';
        if (inquiryDetails.pilihan && Object.keys(inquiryDetails.pilihan).length > 0) {
            spekListText = '\n\n-- Rincian Spesifikasi --';
            for (const [key, value] of Object.entries(inquiryDetails.pilihan)) {
                spekListText += `\n- ${key}: ${value}`;
            }
        }
        
        const templatePesan = `
-- Detail Permintaan --
Produk/Layanan: ${inquiryDetails.namaDasar}${spekListText}
${inquiryDetails.hargaFinal ? `Harga: ${inquiryDetails.hargaFinal}` : ''}

-- Detail Pelanggan --
Nama: ${data.namaUser}
No. Telp: ${data.telpUser}
Email: ${data.emailUser}
Alamat: ${data.alamatUser}

-- Pesan Tambahan --
${data.pesanUser || '(Tidak ada pesan tambahan)'}
        `.trim().replace(/\n\n\n/g, '\n\n'); // Hapus spasi baris berlebih

        let url = '';
        if (submitMethod === 'whatsapp') {
            url = `https://wa.me/628127659073?text=${encodeURIComponent(templatePesan)}`;
        } else {
            url = `mailto:defry.pku@gmail.com?subject=${encodeURIComponent('Permintaan - ' + inquiryDetails.namaDasar)}&body=${encodeURIComponent(templatePesan)}`;
        }
        
        if (url) window.open(url, '_blank');
        modal.style.display = 'none';
    });

    closeBtn.onclick = () => { modal.style.display = 'none'; };
    modal.style.display = 'flex';
}

// --- Fungsi inisialisasi utama yang diekspor ---
export function initTokoPage() {
    console.log("Inisialisasi Halaman Toko...");
    
    const semuaProdukProcessed = semuaProduk.map(p => ({ ...p, hargaAngka: p.hargaDasar || unformatRupiah(p.harga) }));
    const produkListContainer = document.getElementById("produkList");
    
    renderProduk(semuaProdukProcessed, produkListContainer);
    
    // --- Setup Event Listeners ---
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('beli-btn')) {
            e.preventDefault();
            // PERBAIKAN KUNCI: Gunakan 'data-produk-nama' yang konsisten
            const namaProduk = e.target.getAttribute('data-produk-nama'); 
            const produk = semuaProduk.find(p => p.nama === namaProduk);
            if (produk) {
                handleBeliClick(produk);
            } else {
                console.error(`Produk tidak ditemukan: ${namaProduk}`);
            }
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