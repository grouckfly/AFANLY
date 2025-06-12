//Constants for product categories
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

function toggleMenu() {
  const navMenu = document.getElementById("nav-menu");
  if (navMenu.style.display === "flex") {
    navMenu.style.display = "none";
  } else {
    navMenu.style.display = "flex";
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Event untuk tombol beli
  document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('beli-btn')) {
      e.preventDefault();
      const namaProduk = e.target.getAttribute('data-produk');
      validasiPembelian(namaProduk);
    }
  });
});

function validasiPembelian(namaProduk) {
  const modal = document.getElementById('modalKontak');
  const closeBtn = document.getElementById('closeModalKontak');
  const waBtn = document.getElementById('modalWaBtn');
  const emailBtn = document.getElementById('modalEmailBtn');
  const namaProdukSpan = document.getElementById('modalNamaProduk');

  // Tampilkan nama produk di modal
  if (namaProdukSpan) {
    namaProdukSpan.textContent = namaProduk;
  }

  // Template pesan
  const pesanWA = `Pembelian Barang AFANLY%0A%0ANama:%0AAlamat:%0ABarang yang diinginkan: ${encodeURIComponent(namaProduk)}%0ADeskripsi:`;
  const subjectEmail = `Pembelian Barang AFANLY`;
  const bodyEmail = `Nama:%0AAlamat:%0ABarang yang diinginkan: ${encodeURIComponent(namaProduk)}%0ADeskripsi:`;

  // Set href dinamis
  waBtn.href = `https://wa.me/628127659073?text=${pesanWA}`;
  emailBtn.href = `mailto:defry.pku@gmail.com?subject=${subjectEmail}&body=${bodyEmail}`;

  // Tampilkan modal
  modal.style.display = 'flex';

  // Tutup modal saat tombol close diklik
  closeBtn.onclick = function() {
    modal.style.display = 'none';
  };

  // Tutup modal saat klik di luar modal-content
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}

// Inisialisasi fungsi slider hero
function InitSliderHero() {
  const items = document.querySelectorAll('#hero-slider-container .hero-slider-item');
  let current = 0;

  function showNext() {
    items[current].classList.remove('active');
    current = (current + 1) % items.length;
    items[current].classList.add('active');
  }

  // Tampilkan pertama
  items[current].classList.add('active');

  // Ubah setiap 3 detik
  setInterval(showNext, 3000);
}

// Panggil saat halaman dimuat
document.addEventListener('DOMContentLoaded', InitSliderHero);

// Fungsi filter produk
function renderProduk(data) {
  const list = document.getElementById("produkList");
  list.innerHTML = "";
  if (data.length === 0) {
    list.innerHTML = `
      <div class="produk-notfound">
        <div>Barang Tidak Tersedia.<br>Ingin request barang? Hubungi kami:</div>
        <div class="notfound-actions">
          <a href="https://wa.me/628127659073?text=Permintaan%20Barang%20AFANLY%0A%0AHalo%20AFANLY%20saya%20ingin%20menanyakan%20barang%20yang%20tidak%20ada%20di%20toko.%0A%0ANama:%0AAlamat:%0ABarang%20yang%20diinginkan:%0ADeskripsi:" 
            target="_blank" class="notfound-btn wa">WhatsApp</a>

          <a href="mailto:defry.pku@gmail.com?subject=Permintaan%20Barang%20AFANLY&body=Halo%20AFANLY%20saya%20ingin%20menanyakan%20barang%20yang%20tidak%20ada%20di%20toko.%0A%0ANama:%0AAlamat:%0ABarang%20yang%20diinginkan:%0ADeskripsi:" 
            target="_blank" class="notfound-btn email">Email</a>
        </div>
      </div>
    `;
    return;
  }
  data.forEach(p => {
    const item = document.createElement("div");
    item.className = "produk";
    item.innerHTML = `
      <img src="${p.gambar}" alt="${p.nama}">
      <h3>${p.nama}</h3>
      <p>${p.deskripsi}</p>
      <span class="harga">${p.harga}</span>
      <button class="beli-btn" data-produk="${p.nama}">Beli</button>
    `;
    list.appendChild(item);
  });
}

function filterProduk() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const kategori = document.getElementById("kategoriSelect").value;

  const hasil = semuaProduk.filter(p => {
    const cocokNama = p.nama.toLowerCase().includes(search);
    const cocokKategori = kategori === "all" || p.jenis === kategori;
    return cocokNama && cocokKategori;
  });

  renderProduk(hasil);
}

document.getElementById("searchInput").addEventListener("input", filterProduk);
document.getElementById("kategoriSelect").addEventListener("change", filterProduk);

// Inisialisasi
renderProduk(semuaProduk);