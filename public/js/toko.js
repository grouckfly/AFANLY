// Constants for product categories
// nama:, jenis:, deskripsi:, harga:, gambar:, gallery:
const semuaProduk = [
  {
    nama: "N/A",
    jenis: "komputer",
    deskripsi: "N/A",
    harga: "Rp. N/A",
    gambar: "img/nobarang.jpg", // Gambar utama
    gallery: [ // Array of image paths for the gallery
      "img/nobarang.jpg",
      "img/nobarang.jpg",
      "img/nobarang.jpg"
    ]
  },
  {
    nama: "N/A",
    jenis: "Komputer",
    deskripsi: "N/A",
    harga: "Rp. N/A",
    gambar: "img/nobarang.jpg",
    gallery: [
      "img/nobarang.jpg",
      "img/nobarang.jpg",
      "img/nobarang.jpg"
    ]
  },
  {
    nama: "N/A",
    jenis: "Alat Kantor",
    deskripsi: "N/A",
    harga: "Rp. N/A",
    gambar: "img/nobarang.jpg",
    gallery: [
      "img/nobarang.jpg",
      "img/nobarang.jpg",
      "img/nobarang.jpg"
    ]
  },
  {
    nama: "N/A",
    jenis: "Alat Kantor",
    deskripsi: "N/A",
    harga: "Rp. N/A",
    gambar: "img/nobarang.jpg",
    gallery: [
      "img/nobarang.jpg",
      "img/nobarang.jpg",
      "img/nobarang.jpg"
    ]
  },
  {
    nama: "N/A",
    jenis: "Security System",
    deskripsi: "N/A",
    harga: "Rp. N/A",
    gambar: "img/nobarang.jpg",
    gallery: [
      "img/nobarang.jpg",
      "img/nobarang.jpg",
      "img/nobarang.jpg"
    ]
  },
  {
    nama: "N/A",
    jenis: "Komputer",
    deskripsi: "N/A",
    harga: "Rp. N/A",
    gambar: "img/nobarang.jpg",
    gallery: [
      "img/nobarang.jpg",
      "img/nobarang.jpg",
      "img/nobarang.jpg"
    ]
  }
];

// --- Main Initializer and Event Listeners ---

/**
 * Initializes the application, sets up event listeners, and performs initial rendering.
 */
function initializeApp() {
  // Event listener for "Beli" (Buy) buttons using event delegation
  document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('beli-btn')) {
      e.preventDefault();
      const namaProduk = e.target.getAttribute('data-produk');
      validasiPembelian(namaProduk);
    }
  });

  // Event listeners for product filtering
  const searchInput = document.getElementById("searchInput");
  const kategoriSelect = document.getElementById("kategoriSelect");

  if (searchInput) {
    searchInput.addEventListener("input", filterProduk);
  }
  if (kategoriSelect) {
    kategoriSelect.addEventListener("change", filterProduk);
  }

  // Initialize the hero slider
  InitSliderHero();

  // Initialize Product Slider Controls
  InitProductSliderControls();

  // Initial rendering of all products when the page loads
  renderProduk(semuaProduk);

  // Store all products in localStorage for use on other pages
  localStorage.setItem('semuaProduk', JSON.stringify(semuaProduk));
}

// Execute the main initializer function once the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', initializeApp);


// --- Function Definitions ---

/**
 * Toggles the display of the navigation menu.
 */
function toggleMenu() {
  const navMenu = document.getElementById("nav-menu");
  if (navMenu) {
    if (navMenu.style.display === "flex") {
      navMenu.style.display = "none";
    } else {
      navMenu.style.display = "flex";
    }
  }
}

/**
 * Handles the display and functionality of the purchase contact modal.
 * Sets up WhatsApp and Email links with pre-filled product information.
 * @param {string} namaProduk - The name of the product being purchased.
 */
function validasiPembelian(namaProduk) {
  const modal = document.getElementById('modalKontak');
  const closeBtn = document.getElementById('closeModalKontak');
  const waBtn = document.getElementById('modalWaBtn');
  const emailBtn = document.getElementById('modalEmailBtn');
  const namaProdukSpan = document.getElementById('modalNamaProduk');

  if (!modal || !closeBtn || !waBtn || !emailBtn) {
    console.error("Modal elements not found. Purchase validation cannot proceed.");
    return;
  }

  // Display the product name in the modal
  if (namaProdukSpan) {
    namaProdukSpan.textContent = namaProduk;
  }

  // WhatsApp and Email message templates
  const pesanWA = `Pembelian Barang AFANLY%0A%0ANama:%0AAlamat:%0ABarang yang diinginkan: ${encodeURIComponent(namaProduk)}%0ADeskripsi:`;
  const subjectEmail = `Pembelian Barang AFANLY`;
  const bodyEmail = `Nama:%0AAlamat:%0ABarang yang diinginkan: ${encodeURIComponent(namaProduk)}%0ADeskripsi:`;

  // Set dynamic href for buttons
  waBtn.href = `https://wa.me/628127659073?text=${pesanWA}`;
  emailBtn.href = `mailto:defry.pku@gmail.com?subject=${subjectEmail}&body=${bodyEmail}`;

  // Show the modal
  modal.style.display = 'flex';

  // Close modal when the close button is clicked
  closeBtn.onclick = function() {
    modal.style.display = 'none';
  };

  // Close modal when clicking outside the modal-content
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}

/**
 * Initializes the hero slider to automatically cycle through items.
 */
function InitSliderHero() {
  const items = document.querySelectorAll('#hero-slider-container .hero-slider-item');
  if (items.length === 0) return; // Exit if no slider items

  let current = 0;

  function showNext() {
    items[current].classList.remove('active');
    current = (current + 1) % items.length;
    items[current].classList.add('active');
  }

  // Display the first item immediately
  items[current].classList.add('active');

  // Change slide every 3 seconds
  setInterval(showNext, 3000);
}

/**
 * Renders the product list based on the provided data.
 * Displays a "not found" message if the data array is empty.
 * @param {Array<Object>} data - An array of product objects to render.
 */
function renderProduk(data) {
  const list = document.getElementById("produkList");
  const notFoundMessage = document.getElementById("produk-notfound");

  if (!list || !notFoundMessage) return; // Exit if essential elements are not found

  list.innerHTML = ""; // Clear existing products

  if (data.length === 0) {
    notFoundMessage.style.display = "block";
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

/**
 * Filters the product list based on search input and category selection.
 * The search is now flexible, checking the name, description, and type of the product.
 */
function filterProduk() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const kategori = document.getElementById("kategoriSelect").value;

  const hasil = semuaProduk.filter(p => {
    // Kondisi 1: Teks pencarian cocok dengan nama, deskripsi, ATAU jenis.
    const cocokPencarian =
      p.nama.toLowerCase().includes(search) ||
      p.deskripsi.toLowerCase().includes(search) ||
      p.jenis.toLowerCase().includes(search);

    // Kondisi 2: Kategori yang dipilih di dropdown cocok (atau "semua" yang dipilih).
    // Dibuat case-insensitive untuk lebih aman.
    const cocokKategori = kategori === "all" || p.jenis.toLowerCase() === kategori.toLowerCase();

    // Produk akan ditampilkan jika kedua kondisi di atas terpenuhi.
    return cocokPencarian && cocokKategori;
  });

  renderProduk(hasil);

  // Setelah filtering, reset posisi scroll dari daftar produk
  const produkListElement = document.getElementById("produkList");
  if (produkListElement) {
    produkListElement.scrollLeft = 0;
  }
}

/**
 * Initializes controls for the product slider, allowing users to scroll left/right.
 */
function InitProductSliderControls() {
  const produkListElement = document.getElementById("produkList");
  const prevBtn = document.getElementById("prevProductBtn");
  const nextBtn = document.getElementById("nextProductBtn");

  if (!produkListElement || !prevBtn || !nextBtn) {
    console.warn("Product slider control elements not found. Slider functionality will not be active.");
    return;
  }

  const scrollProducts = (direction) => {
    const scrollAmount = produkListElement.clientWidth * 0.8; // Scroll by 80% of visible width

    produkListElement.scrollBy({
      left: direction === 'prev' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  prevBtn.addEventListener("click", () => scrollProducts('prev'));
  nextBtn.addEventListener("click", () => scrollProducts('next'));
}