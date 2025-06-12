function toggleMenu() {
  const navMenu = document.getElementById("nav-menu");
  if (navMenu.style.display === "flex") {
    navMenu.style.display = "none";
  } else {
    navMenu.style.display = "flex";
  }
}

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

// Pasang event pada semua tombol "Beli Sekarang"
document.addEventListener('DOMContentLoaded', function() {
  const beliButtons = document.querySelectorAll('.beli-btn');
  beliButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const namaProduk = btn.getAttribute('data-produk');
      validasiPembelian(namaProduk);
    });
  });
});

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