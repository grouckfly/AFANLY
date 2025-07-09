// js/toko.js
// TIDAK perlu 'import { semuaProduk }...' karena sudah global dari HTML

// --- Semua fungsi helper dan inti dari toko.js lama Anda diletakkan di sini ---
function formatRupiah(angka) {
  if (angka === null || angka === undefined) return "Rp 0";
  // Menggunakan Intl.NumberFormat untuk cara yang lebih modern dan andal
  return "Rp " + new Intl.NumberFormat("id-ID").format(angka);
}

function unformatRupiah(rupiah) {
  if (!rupiah || typeof rupiah !== "string") return 0;
  return parseInt(rupiah.replace(/[^0-9]/g, ""), 10) || 0;
}

function renderProduk(data, container) {
  if (!container) return;
  const notFoundMessage = document.getElementById("produk-notfound");
  container.innerHTML = "";

  notFoundMessage.style.display = data.length === 0 ? "flex" : "none";
  container.style.display = data.length === 0 ? "none" : "flex";

  data.forEach((p) => {
    const item = document.createElement("div");
    item.className = "produk";
    const encodedNama = encodeURIComponent(p.nama);
    const hargaTampil =
      p.hargaDasar !== undefined
        ? `Mulai dari ${formatRupiah(p.hargaDasar)}`
        : p.harga;

    let statusBadgeHTML = "";
    let tombolBeliHTML = "";

    if (p.status === "Tidak Tersedia") {
      statusBadgeHTML = `<div class="status-badge tidak-tersedia">Tidak Tersedia</div>`;
      tombolBeliHTML = `<button class="beli-btn disabled" style data-produk-nama="${p.nama}">Tidak Tersedia</button>`;
    } else {
      // Asumsi lainnya adalah "Tersedia"
      statusBadgeHTML = `<div class="status-badge tersedia">Tersedia</div>`;
      tombolBeliHTML = `<button class="beli-btn" data-produk-nama="${p.nama}">Beli</button>`;
    }

    item.innerHTML = `
            <img src="${p.gambar}" alt="${p.nama}">
            <h3>${p.nama}</h3>
            ${statusBadgeHTML}
            <div class="harga-wrapper">
                <span class="harga">${hargaTampil}</span>
            </div>
            <div class="produk-actions" style="display: flex; gap: 10px;">
                ${tombolBeliHTML}
                <a href="spesifikasi.html?produk=${encodedNama}" class="spec-btn">Spesifikasi</a>
            </div>
        `;
    container.appendChild(item);
  });
}

function updateFilterButtonState() {
  const kategori = document.getElementById("kategoriSelect").value;
  const urutkan = document.getElementById("urutkanHargaSelect").value;
  const minHarga = document.getElementById("minPriceInput").value;
  const maxHarga = document.getElementById("maxPriceInput").value;
  const openFilterBtn = document.getElementById("openFilterBtn");

  if (!openFilterBtn) return;

  const isFilterActive =
    kategori !== "all" ||
    urutkan !== "default" ||
    minHarga !== "" ||
    maxHarga !== "";

  if (isFilterActive) {
    openFilterBtn.classList.add("active");
  } else {
    openFilterBtn.classList.remove("active");
  }
}

function InitSliderHero() {
  const items = document.querySelectorAll(
    "#hero-slider-container .hero-slider-item"
  );
  if (items.length === 0) return;
  let current = 0;
  function showNext() {
    items[current].classList.remove("active");
    current = (current + 1) % items.length;
    items[current].classList.add("active");
  }
  items[current].classList.add("active");
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
      left: direction === "prev" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  prevBtn.addEventListener("click", () => scrollProducts("prev"));
  nextBtn.addEventListener("click", () => scrollProducts("next"));
}

function handleBeliClick(produk) {
  // Jika produk tidak tersedia, buka modal status dan hentikan proses.
  if (produk.status === "Tidak Tersedia") {
    openStatusModal(produk.nama);
    return;
  }

  if (produk.options && produk.hargaDasar !== undefined) {
    // Produk dengan varian: Buka modal untuk memilih opsi terlebih dahulu.
    openOptionsModal(produk);
  } else {
    // Produk sederhana: Langsung siapkan data dan buka formulir pemesanan.
    const detailPesanan = {
      namaDasar: produk.nama,
      pilihan: {},
      hargaFinal: produk.harga,
    };
    openInquiryModal(detailPesanan);
  }
}

// Hapus validasiPembelian dan openOptionsModal lama, ganti dengan ini

function openOptionsModal(produk) {
  const optionsModal = document.getElementById("options-modal");
  if (!optionsModal) {
    return;
  }

  const title = optionsModal.querySelector("#options-modal-title");
  const body = optionsModal.querySelector("#options-modal-body");
  const priceDisplay = optionsModal.querySelector("#options-modal-price");
  const applyBtn = optionsModal.querySelector("#applyOptionsBtn");
  const closeBtn = optionsModal.querySelector("#closeOptionsModal");

  title.textContent = `Pilih Opsi untuk ${produk.nama}`;
  applyBtn.textContent = "Lanjut ke Pembelian";
  body.innerHTML = "";

  produk.options.forEach((optionGroup) => {
    const groupDiv = document.createElement("div");
    groupDiv.className = "option-group";
    const label = document.createElement("label");
    label.textContent = optionGroup.nama;
    const select = document.createElement("select");
    select.dataset.group = optionGroup.nama;
    optionGroup.choices.forEach((choice) => {
      const optionEl = document.createElement("option");
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
    body.querySelectorAll("select").forEach((select) => {
      totalHarga += parseInt(select.value, 10);
      selectedOptions[select.dataset.group] =
        select.options[select.selectedIndex].textContent.split(" (")[0];
    });
    priceDisplay.textContent = formatRupiah(totalHarga);
    return { totalHarga, selectedOptions };
  };

  calculatePriceInModal();
  body
    .querySelectorAll("select")
    .forEach((select) =>
      select.addEventListener("change", calculatePriceInModal)
    );

  const newApplyBtn = applyBtn.cloneNode(true);
  applyBtn.parentNode.replaceChild(newApplyBtn, applyBtn);
  newApplyBtn.addEventListener("click", () => {
    const { totalHarga, selectedOptions } = calculatePriceInModal();
    const detailPesanan = {
      namaDasar: produk.nama,
      pilihan: selectedOptions,
      hargaFinal: formatRupiah(totalHarga),
    };
    openInquiryModal(detailPesanan); // Panggil modal formulir akhir
    optionsModal.style.display = "none";
  });

  closeBtn.onclick = () => (optionsModal.style.display = "none");
  optionsModal.style.display = "flex";
}

function openStatusModal(namaProduk) {
  const modal = document.getElementById("status-modal");
  if (!modal) return;

  const productNameSpan = document.getElementById("status-modal-product-name");
  const closeBtn = document.getElementById("closeStatusModal");
  const closeBtn2 = document.getElementById("status-modal-close-btn");

  if (productNameSpan) productNameSpan.textContent = namaProduk;
  modal.style.display = "flex";

  const closeModal = () => (modal.style.display = "none");
  if (closeBtn) closeBtn.onclick = closeModal;
  if (closeBtn2) closeBtn2.onclick = closeModal;
}

// js/toko.js

export function openInquiryModal(inquiryDetails) {
  const modal = document.getElementById("inquiry-modal");
  if (!modal) {
    console.error("Modal formulir inquiry (#inquiry-modal) tidak ditemukan!");
    return;
  }

  const title = document.getElementById("inquiry-modal-title");
  const form = document.getElementById("inquiry-form");
  const itemNameInput = document.getElementById("inquiry-item-name");
  const itemSpecsDiv = document.getElementById("inquiry-item-specs");
  const priceWrapper = document.getElementById("inquiry-item-price-wrapper");
  const priceInput = document.getElementById("inquiry-item-price");
  const messageInput = document.getElementById("inquiry-message");
  const closeBtn = document.getElementById("closeInquiryModal");

  // --- Isi form dengan data yang dikirim ---
  form.reset();
  title.textContent = `Formulir untuk: ${inquiryDetails.namaDasar}`;
  itemNameInput.value = inquiryDetails.namaDasar;

  if (
    inquiryDetails.pilihan &&
    Object.keys(inquiryDetails.pilihan).length > 0
  ) {
    let spekHTML = "<ul>";
    for (const [key, value] of Object.entries(inquiryDetails.pilihan)) {
      spekHTML += `<li><strong>${key}:</strong> ${value}</li>`;
    }
    spekHTML += "</ul>";
    itemSpecsDiv.innerHTML = spekHTML;
    itemSpecsDiv.style.display = "block";
  } else {
    itemSpecsDiv.style.display = "none";
  }

  if (inquiryDetails.hargaFinal) {
    priceInput.value = inquiryDetails.hargaFinal;
    priceWrapper.style.display = "block";
  } else {
    priceWrapper.style.display = "none";
  }

  if (inquiryDetails.pesanAwal) {
    messageInput.value = inquiryDetails.pesanAwal;
  }

  // =======================================================
  // --- PERBAIKAN LOGIKA EVENT LISTENER SUBMIT ---
  // =======================================================

  // Simpan handler dalam sebuah variabel agar bisa dilepas pasang
  const submitHandler = (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitMethod = e.submitter.dataset.method;
    const data = {
      namaUser: document.getElementById("inquiry-name").value,
      telpUser: document.getElementById("inquiry-phone").value,
      emailUser: document.getElementById("inquiry-email").value,
      alamatUser: document.getElementById("inquiry-address").value,
      pesanUser: document.getElementById("inquiry-message").value,
    };

    let spekListText = "";
    if (
      inquiryDetails.pilihan &&
      Object.keys(inquiryDetails.pilihan).length > 0
    ) {
      spekListText = "\n\n-- Rincian Spesifikasi --";
      for (const [key, value] of Object.entries(inquiryDetails.pilihan)) {
        spekListText += `\n- ${key}: ${value}`;
      }
    }

    const templatePesan = `
-- Detail Permintaan --
Produk/Layanan: ${inquiryDetails.namaDasar}${spekListText}
${inquiryDetails.hargaFinal ? `Harga: ${inquiryDetails.hargaFinal}` : ""}

-- Detail Pelanggan --
Nama: ${data.namaUser}
No. Telp: ${data.telpUser}
Email: ${data.emailUser}
Alamat: ${data.alamatUser}

-- Pesan Tambahan --
${data.pesanUser || "(Tidak ada pesan tambahan)"}
        `
      .trim()
      .replace(/\n\n\n/g, "\n\n");

    let url = "";
    if (submitMethod === "whatsapp") {
      url = `https://wa.me/628127659073?text=${encodeURIComponent(
        templatePesan
      )}`;
    } else {
      url = `mailto:defry.pku@gmail.com?subject=${encodeURIComponent(
        "Permintaan - " + inquiryDetails.namaDasar
      )}&body=${encodeURIComponent(templatePesan)}`;
    }

    if (url) window.open(url, "_blank");
    modal.style.display = "none";

    // Hapus event listener setelah digunakan untuk mencegah duplikasi
    form.removeEventListener("submit", submitHandler);
  };

  // Hapus listener lama (jika ada) dan tambahkan yang baru.
  // Ini adalah cara yang benar untuk mencegah penumpukan event tanpa merusak listener lain.
  if (form.submitListener) {
    form.removeEventListener("submit", form.submitListener);
  }
  form.addEventListener("submit", submitHandler);
  form.submitListener = submitHandler; // Simpan referensi ke listener saat ini

  // Tampilkan modal
  closeBtn.onclick = () => {
    modal.style.display = "none";
    form.removeEventListener("submit", submitHandler); // Bersihkan listener saat ditutup juga
    resetForm(form); // Kosongkan form saat modal ditutup
  };
  modal.style.display = "flex";
}

// --- Fungsi inisialisasi utama yang diekspor ---
export function initTokoPage() {
  console.log("Inisialisasi Halaman Toko...");

  // Proses data produk di dalam lingkup fungsi ini
  const semuaProdukProcessed = semuaProduk.map((p) => ({
    ...p,
    hargaAngka: p.hargaDasar || unformatRupiah(p.harga),
  }));
  localStorage.setItem("semuaProduk", JSON.stringify(semuaProduk));

  const produkListContainer = document.getElementById("produkList");
  const searchInput = document.getElementById("searchInput");
  const openFilterBtn = document.getElementById("openFilterBtn");
  const filterModal = document.getElementById("filter-modal");
  const closeFilterModalBtn = document.getElementById("closeFilterModal");
  const applyFilterBtn = document.getElementById("applyFilterBtn");
  const resetFilterBtn = document.getElementById("resetFilterBtn");

  // --- RENDER AWAL ---
  renderProduk(semuaProdukProcessed, produkListContainer);

  // --- FUNGSI FILTER (sekarang berada di dalam scope yang benar) ---
  function filterProduk() {
    // Pastikan variabel `semuaProdukProcessed` tersedia dalam scope ini
    const searchInput = document.getElementById("searchInput");
    const searchTerm = searchInput.value.toLowerCase().trim();

    const kategori = document.getElementById("kategoriSelect").value;
    const urutkan = document.getElementById("urutkanHargaSelect").value;
    const minHarga = unformatRupiah(
      document.getElementById("minPriceInput").value
    );
    let maxHarga = unformatRupiah(
      document.getElementById("maxPriceInput").value
    );
    if (maxHarga === 0) maxHarga = Infinity;

    let hasil;

    // --- LOGIKA BARU YANG DIPERBAIKI ---
    if (searchTerm) {
      // **JIKA PENGGUNA MENCARI:** Cari di SEMUA produk (termasuk yang tidak tersedia)
      // yang cocok dengan kata kunci DAN filter lainnya.
      hasil = semuaProdukProcessed.filter((p) => {
        const cocokPencarian =
          p.nama.toLowerCase().includes(searchTerm) ||
          (p.deskripsi && p.deskripsi.toLowerCase().includes(searchTerm));
        const cocokFilterLain =
          (kategori === "all" ||
            p.jenis.toLowerCase() === kategori.toLowerCase()) &&
          p.hargaAngka >= minHarga &&
          p.hargaAngka <= maxHarga;
        return cocokPencarian && cocokFilterLain;
      });
    } else {
      // **JIKA PENGGUNA TIDAK MENCARI (TAMPILAN DEFAULT ATAU HANYA FILTER):**
      // Ambil HANYA produk yang statusnya "Tersedia" DAN cocok dengan filter.
      hasil = semuaProdukProcessed.filter((p) => {
        const cocokFilterLain =
          (kategori === "all" ||
            p.jenis.toLowerCase() === kategori.toLowerCase()) &&
          p.hargaAngka >= minHarga &&
          p.hargaAngka <= maxHarga;

        return p.status === "Tersedia" && cocokFilterLain;
      });
    }

    // Sisa logika sorting dan render (tidak berubah)
    if (urutkan === "terendah") {
      hasil.sort((a, b) => a.hargaAngka - b.hargaAngka);
    } else if (urutkan === "tertinggi") {
      hasil.sort((a, b) => b.hargaAngka - a.hargaAngka);
    }

    // Panggil renderProduk dengan hasil akhir
    renderProduk(hasil, document.getElementById("produkList"));
    updateFilterButtonState();
  }

  // --- SETUP EVENT LISTENERS ---
  if (searchInput) searchInput.addEventListener("input", filterProduk);
  if (openFilterBtn)
    openFilterBtn.addEventListener(
      "click",
      () => (filterModal.style.display = "flex")
    );
  if (closeFilterModalBtn)
    closeFilterModalBtn.addEventListener(
      "click",
      () => (filterModal.style.display = "none")
    );
  if (applyFilterBtn)
    applyFilterBtn.addEventListener("click", () => {
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
    });
  }

  const minPriceInput = document.getElementById("minPriceInput");
    const maxPriceInput = document.getElementById("maxPriceInput");

    if (minPriceInput && maxPriceInput) {
        const handlePriceInput = (e) => {
            const input = e.target;
            // 1. Ambil nilai & hapus semua selain angka
            const stringValue = input.value.replace(/\D/g, '');
            
            if (stringValue === '') {
                input.value = '';
                return;
            }
            
            // 2. Format dengan titik pemisah ribuan
            const numberValue = parseInt(stringValue, 10);
            input.value = new Intl.NumberFormat('id-ID').format(numberValue);
        };

        minPriceInput.addEventListener("input", handlePriceInput);
        maxPriceInput.addEventListener("input", handlePriceInput);
    }

  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("beli-btn")) {
      e.preventDefault();
      const namaProduk = e.target.getAttribute("data-produk-nama");
      const produk = semuaProduk.find((p) => p.nama === namaProduk);
      if (produk) handleBeliClick(produk);
    }
  });

  filterProduk(); // Panggil filterProduk untuk inisialisasi awal

  // Inisialisasi slider jika ada
  if (typeof InitSliderHero === "function") InitSliderHero();
  if (typeof InitProductSliderControls === "function")
    InitProductSliderControls();
}

// =================================================================================
// HELPER & PRE-PROCESSING
// =================================================================================

// Fungsi ini tidak lagi diperlukan jika data harga sudah berupa angka, tapi kita simpan untuk kompatibilitas
function preprocessProdukData(produkData) {
  return produkData.map((p) => {
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
document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
  // Simpan data ke localStorage untuk digunakan oleh halaman spesifikasi
  localStorage.setItem("semuaProduk", JSON.stringify(semuaProduk));

  // Render produk awal ke halaman
  renderProduk(semuaProdukProcessed);

  // Siapkan semua event listener untuk interaksi pengguna
  setupEventListeners();

  // Inisialisasi fitur UI tambahan jika ada
  if (typeof InitSliderHero === "function") InitSliderHero();
  if (typeof InitProductSliderControls === "function")
    InitProductSliderControls();
}

// =================================================================================
// PENGATURAN SEMUA EVENT LISTENERS
// =================================================================================
function setupEventListeners() {
  // --- Event Listener Tombol Beli (Logika Baru) ---
  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("beli-btn")) {
      e.preventDefault();
      const namaProduk = e.target.getAttribute("data-produk");
      const produk = semuaProduk.find((p) => p.nama === namaProduk);
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
  if (openFilterBtn)
    openFilterBtn.addEventListener(
      "click",
      () => (filterModal.style.display = "flex")
    );
  if (closeFilterModalBtn)
    closeFilterModalBtn.addEventListener(
      "click",
      () => (filterModal.style.display = "none")
    );
  if (applyFilterBtn)
    applyFilterBtn.addEventListener("click", () => {
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
    const optionsModal = document.getElementById("options-modal");
    if (e.target === optionsModal) optionsModal.style.display = "none";
  });
}
