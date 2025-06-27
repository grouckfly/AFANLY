// =================================================================================
// HELPER & PRE-PROCESSING (Tidak Berubah)
// =================================================================================
function formatRupiah(angka) {
  if (angka === null || angka === undefined) return '';
  let number_string = angka.toString().replace(/[^,\d]/g, '').toString();
  let split = number_string.split(',');
  let sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  let ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    let separator = sisa ? '.' : '';
    rupiah += separator + ribuan.join('.');
  }
  rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
  return rupiah;
}

function unformatRupiah(rupiah) {
    if (!rupiah || typeof rupiah !== 'string') return 0;
    return parseInt(rupiah.replace(/\D/g, ''), 10) || 0;
}

function preprocessProdukData(produkData) {
  return produkData.map(p => {
    const hargaAngka = unformatRupiah(p.harga);
    return { ...p, hargaAngka };
  });
}

const semuaProdukProcessed = preprocessProdukData(semuaProduk);


// =================================================================================
// INISIALISASI APLIKASI & EVENT LISTENERS
// =================================================================================
function initializeApp() {
  // Event listener umum
  document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('beli-btn')) {
      e.preventDefault();
      validasiPembelian(e.target.getAttribute('data-produk'));
    }
  });

  // --- LOGIKA FILTER BARU ---
  const searchInput = document.getElementById("searchInput");
  const openFilterBtn = document.getElementById("openFilterBtn");
  const closeFilterModalBtn = document.getElementById("closeFilterModal");
  const filterModal = document.getElementById("filter-modal");
  const applyFilterBtn = document.getElementById("applyFilterBtn");
  const resetFilterBtn = document.getElementById("resetFilterBtn");

  // Filter real-time hanya untuk search bar utama
  searchInput.addEventListener("input", filterProduk);

  // Buka & Tutup Modal
  openFilterBtn.addEventListener("click", () => {
    filterModal.style.display = "flex";
  });
  closeFilterModalBtn.addEventListener("click", () => {
    filterModal.style.display = "none";
  });
  window.addEventListener("click", (e) => {
    if (e.target === filterModal) {
        filterModal.style.display = "none";
    }
  });

  // Tombol di dalam Modal
  applyFilterBtn.addEventListener("click", () => {
    filterProduk(); // Panggil filter utama
    filterModal.style.display = "none"; // Tutup modal setelah menerapkan
  });
  
  resetFilterBtn.addEventListener("click", () => {
    // Reset semua input di dalam modal
    document.getElementById("kategoriSelect").value = "all";
    document.getElementById("urutkanHargaSelect").value = "default";
    document.getElementById("minPriceInput").value = "";
    document.getElementById("maxPriceInput").value = "";
    updateFilterButtonState(); // Update tampilan tombol filter
  });

  // Event listener auto-format harga (tidak berubah)
  const minPriceInput = document.getElementById("minPriceInput");
  const maxPriceInput = document.getElementById("maxPriceInput");
  const handlePriceInput = (e) => {
    const nilaiMentah = e.target.value;
    const nilaiFormatted = formatRupiah(nilaiMentah);
    e.target.value = nilaiFormatted;
  };
  minPriceInput.addEventListener("input", handlePriceInput);
  maxPriceInput.addEventListener("input", handlePriceInput);

  // Inisialisasi lain
  InitSliderHero();
  InitProductSliderControls();
  renderProduk(semuaProdukProcessed);
  localStorage.setItem('semuaProduk', JSON.stringify(semuaProduk));
}

document.addEventListener('DOMContentLoaded', initializeApp);


// =================================================================================
// FUNGSI UTAMA (FILTER, RENDER, DLL)
// =================================================================================

function filterProduk() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const kategori = document.getElementById("kategoriSelect").value;
  const urutkan = document.getElementById("urutkanHargaSelect").value;
  const minHarga = unformatRupiah(document.getElementById("minPriceInput").value);
  let maxHarga = unformatRupiah(document.getElementById("maxPriceInput").value);
  if (maxHarga === 0) maxHarga = Infinity;

  let hasil = semuaProdukProcessed.filter(p => {
    const cocokPencarian = p.nama.toLowerCase().includes(search) || p.deskripsi.toLowerCase().includes(search) || p.jenis.toLowerCase().includes(search);
    const cocokKategori = kategori === "all" || p.jenis.toLowerCase() === kategori.toLowerCase();
    const cocokHarga = p.hargaAngka >= minHarga && p.hargaAngka <= maxHarga;
    return cocokPencarian && cocokKategori && cocokHarga;
  });

  if (urutkan === 'terendah') {
    hasil.sort((a, b) => a.hargaAngka - b.hargaAngka);
  } else if (urutkan === 'tertinggi') {
    hasil.sort((a, b) => b.hargaAngka - a.hargaAngka);
  }

  renderProduk(hasil);
  updateFilterButtonState(); // Panggil fungsi untuk update tampilan tombol

  const produkListElement = document.getElementById("produkList");
  if (produkListElement) produkListElement.scrollLeft = 0;
}

/**
 * Fungsi baru untuk menandai jika ada filter yang aktif.
 */
function updateFilterButtonState() {
    const kategori = document.getElementById("kategoriSelect").value;
    const urutkan = document.getElementById("urutkanHargaSelect").value;
    const minHarga = document.getElementById("minPriceInput").value;
    const maxHarga = document.getElementById("maxPriceInput").value;
    const openFilterBtn = document.getElementById("openFilterBtn");

    const isFilterActive = 
        kategori !== 'all' || 
        urutkan !== 'default' || 
        minHarga !== '' || 
        maxHarga !== '';

    if (isFilterActive) {
        openFilterBtn.classList.add('active');
    } else {
        openFilterBtn.classList.remove('active');
    }
}


// ... (Sisa fungsi: renderProduk, validasiPembelian, InitSliderHero, InitProductSliderControls tetap sama persis) ...
// ... Pastikan Anda masih memiliki fungsi-fungsi tersebut di sini ...
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
  
      item.innerHTML = `
        <img src="${p.gambar}" alt="${p.nama}">
        <h3>${p.nama}</h3>
        <span class="harga">${p.harga}</span>
        <div class="produk-actions">
          <button class="beli-btn" data-produk="${p.nama}">Beli</button>
          <a href="spesifikasi.html?produk=${encodedNama}" class="spec-btn">Spesifikasi</a>
        </div>
      `;
      list.appendChild(item);
    });
}

function validasiPembelian(namaProduk) {
  const modal = document.getElementById('modalKontak');
  const closeBtn = document.getElementById('closeModalKontak');
  const waBtn = document.getElementById('modalWaBtn');
  const emailBtn = document.getElementById('modalEmailBtn');
  const namaProdukSpan = document.getElementById('modalNamaProduk');

  if (!modal || !closeBtn || !waBtn || !emailBtn) return;
  
  if (namaProdukSpan) namaProdukSpan.textContent = namaProduk;

  const pesanWA = `Pembelian Barang AFANLY%0A%0ANama:%0AAlamat:%0ABarang yang diinginkan: ${encodeURIComponent(namaProduk)}%0ADeskripsi:`;
  const subjectEmail = `Pembelian Barang AFANLY`;
  const bodyEmail = `Nama:%0AAlamat:%0ABarang yang diinginkan: ${encodeURIComponent(namaProduk)}%0ADeskripsi:`;

  waBtn.href = `https://wa.me/628127659073?text=${pesanWA}`;
  emailBtn.href = `mailto:defry.pku@gmail.com?subject=${subjectEmail}&body=${bodyEmail}`;

  modal.style.display = 'flex';

  closeBtn.onclick = function() {
    modal.style.display = 'none';
  };

  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
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