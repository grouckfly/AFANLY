// Constants for product categories
// nama:, jenis:, deskripsi:, harga:, gambar:
const semuaProduk = [
  {
    nama: "Laptop ASUS VivoBook",
    jenis: "Komputer",
    deskripsi: "Laptop ringan, cocok untuk kerja dan kuliah. RAM 8GB, SSD 512GB.",
    harga: "Rp7.500.000",
    gambar: "img/nobarang.jpg"
  },
  {
    nama: "Smartphone Samsung A15",
    jenis: "Komputer",
    deskripsi: "Layar Super AMOLED, baterai tahan lama, kamera 50MP.",
    harga: "Rp2.800.000",
    gambar: "img/nobarang.jpg"
  },
  {
    nama: "Printer Canon PIXMA",
    jenis: "Alat Kantor",
    deskripsi: "Printer warna, cocok untuk kebutuhan kantor dan rumah.",
    harga: "Rp1.200.000",
    gambar: "img/nobarang.jpg"
  },
  {
    nama: "Router TP-Link Archer",
    jenis: "Alat Kantor",
    deskripsi: "Dual Band, kecepatan tinggi, jangkauan luas.",
    harga: "Rp650.000",
    gambar: "img/nobarang.jpg"
  },
  {
    nama: "Paket CCTV 4 Channel",
    jenis: "Security System",
    deskripsi: "Termasuk DVR dan pemasangan. Cocok untuk rumah & toko.",
    harga: "Rp2.500.000",
    gambar: "img/nobarang.jpg"
  },
  {
    nama: "Keyboard Mechanical RGB",
    jenis: "Komputer",
    deskripsi: "Nyaman untuk gaming dan mengetik, lampu warna-warni.",
    harga: "Rp350.000",
    gambar: "img/nobarang.jpg"
  }
];

// --- Navigation and Menu Functions ---

/**
 * Toggles the display of the navigation menu.
 */
function toggleMenu() {
  const navMenu = document.getElementById("nav-menu");
  if (navMenu.style.display === "flex") {
    navMenu.style.display = "none";
  } else {
    navMenu.style.display = "flex";
  }
}

// --- Modal and Purchase Validation Functions ---

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

// --- Hero Slider Functions ---

/**
 * Initializes the hero slider to automatically cycle through items.
 */
function InitSliderHero() {
  const items = document.querySelectorAll('#hero-slider-container .hero-slider-item');
  let current = 0;

  /**
   * Shows the next item in the slider.
   */
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

// --- Product Rendering and Filtering Functions ---

/**
 * Renders the product list based on the provided data.
 * Displays a "not found" message if the data array is empty.
 * @param {Array<Object>} data - An array of product objects to render.
 */
function renderProduk(data) {
  const list = document.getElementById("produkList");
  list.innerHTML = "";

  if (data.length === 0) {
    document.getElementById("produk-notfound").style.display = "block"; // Show "product not found" message
    list.style.display = "none"; // Hide product list
  } else {
    document.getElementById("produk-notfound").style.display = "none"; // Hide "product not found" message
    list.style.display = "flex"; // Ensure list is flex to allow horizontal layout for slider
  }

  data.forEach(p => {
    const item = document.createElement("div");
    item.className = "produk";

    // Encode product name for URL parameter
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
 */
function filterProduk() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const kategori = document.getElementById("kategoriSelect").value;

  const hasil = semuaProduk.filter(p => {
    const cocokNama = p.nama.toLowerCase().includes(search);
    const cocokKategori = kategori === "all" || p.jenis === kategori;
    return cocokNama && cocokKategori;
  });

  renderProduk(hasil);

  // After filtering and re-rendering, reset scroll position of the product list to the beginning
  const produkListElement = document.getElementById("produkList");
  if (produkListElement) {
    produkListElement.scrollLeft = 0;
  }
}

// --- Product Slider Controls Function (NEW) ---

/**
 * Initializes controls for the product slider, allowing users to scroll left/right.
 * Requires corresponding HTML buttons with IDs 'prevProductBtn' and 'nextProductBtn'
 * and the product list container with ID 'produkList' styled for horizontal scrolling.
 */
function InitProductSliderControls() {
  const produkListElement = document.getElementById("produkList");
  const prevBtn = document.getElementById("prevProductBtn");
  const nextBtn = document.getElementById("nextProductBtn");

  // Exit if essential slider elements are not found in the DOM
  if (!produkListElement || !prevBtn || !nextBtn) {
    console.warn("Product slider control elements (produkList, prevProductBtn, or nextProductBtn) not found. Slider functionality will not be active.");
    return;
  }

  // Function to scroll the product list horizontally
  const scrollProducts = (direction) => {
    // Determine the amount to scroll. Here, we scroll by 80% of the visible width
    // to ensure smooth transitions and expose parts of the next/previous items.
    // You can adjust '0.8' (80%) as needed.
    const scrollAmount = produkListElement.clientWidth * 0.8;

    if (direction === 'prev') {
      produkListElement.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth' // Smooth scrolling effect
      });
    } else { // 'next'
      produkListElement.scrollBy({
        left: scrollAmount,
        behavior: 'smooth' // Smooth scrolling effect
      });
    }
  };

  // Add event listeners to the slider navigation buttons
  prevBtn.addEventListener("click", () => scrollProducts('prev'));
  nextBtn.addEventListener("click", () => scrollProducts('next'));
}


// --- Event Listeners and Initializations ---

document.addEventListener('DOMContentLoaded', function() {
  // Event listener for "Beli" (Buy) buttons using event delegation
  document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('beli-btn')) {
      e.preventDefault();
      const namaProduk = e.target.getAttribute('data-produk');
      validasiPembelian(namaProduk);
    }
  });

  // Initialize the hero slider
  InitSliderHero();

  // Event listeners for product filtering
  document.getElementById("searchInput").addEventListener("input", filterProduk);
  document.getElementById("kategoriSelect").addEventListener("change", filterProduk);

  // Initialize Product Slider Controls
  // This must be called after the HTML elements for the slider buttons and track are available
  InitProductSliderControls();

  // Initial rendering of all products when the page loads
  renderProduk(semuaProduk);

  // Store all products in localStorage so they can be accessed on other pages (e.g., product specification page)
  localStorage.setItem('semuaProduk', JSON.stringify(semuaProduk));
});