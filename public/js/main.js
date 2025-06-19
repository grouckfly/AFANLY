document.addEventListener("DOMContentLoaded", function () {
  initDarkMode();
  initSidebar();
  initModal();
  initDevNotif();
  initYear();
  initValidation();
  initKritikSaranModal();

  // Hanya inisialisasi services jika ada elemen terkait
  if (document.querySelector(".services .card-wrapper")) {
    initServicesSection();
    startAutoScrollCardWrapper();
  }
});

/* -------------------- DARK MODE -------------------- */
function initDarkMode() {
  const toggle = document.getElementById("darkModeToggle");
  const sidebarDarkBtn = document.getElementById("sidebarDarkModeToggle");
  const body = document.body;

  const sunIcon = toggle.querySelector(".sun-icon");
  const moonIcon = toggle.querySelector(".moon-icon");
  const modeText = toggle.querySelector(".mode-text");

  const sidebarSunIcon = sidebarDarkBtn.querySelector(".sun-icon");
  const sidebarMoonIcon = sidebarDarkBtn.querySelector(".moon-icon");
  const sidebarModeText = sidebarDarkBtn.querySelector(".mode-text");

  function applyTheme(theme) {
    const isDarkMode = theme === "dark";
    if (isDarkMode) {
      body.classList.add("dark-mode");
      // Update main toggle
      sunIcon.style.display = "none";
      moonIcon.style.display = "inline-block";
      modeText.textContent = "Mode Gelap";
      // Update sidebar toggle
      sidebarSunIcon.style.display = "none";
      sidebarMoonIcon.style.display = "inline-block";
      sidebarModeText.textContent = "Mode Gelap";
    } else {
      body.classList.remove("dark-mode");
      // Update main toggle
      sunIcon.style.display = "inline-block";
      moonIcon.style.display = "none";
      modeText.textContent = "Mode Cerah";
      // Update sidebar toggle
      sidebarSunIcon.style.display = "inline-block";
      sidebarMoonIcon.style.display = "none";
      sidebarModeText.textContent = "Mode Cerah";
    }
    localStorage.setItem("theme", theme);
    updateAriaAttributes();
  }

  function updateAriaAttributes() {
    const isDark = body.classList.contains("dark-mode");
    [toggle, sidebarDarkBtn].forEach((btn) => {
      if (btn) {
        btn.setAttribute("aria-checked", isDark.toString());
      }
    });
  }

  // Inisialisasi mode berdasarkan localStorage atau waktu
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    const hour = new Date().getHours();
    const autoTheme = hour >= 18 || hour < 6 ? "dark" : "light";
    applyTheme(autoTheme);
  }

  // Event toggle tombol
  [toggle, sidebarDarkBtn].forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", () => {
        const isCurrentlyDark = body.classList.contains("dark-mode");
        const newTheme = isCurrentlyDark ? "light" : "dark";
        applyTheme(newTheme);
      });
    }
  });

  // Inisialisasi atribut aria
  updateAriaAttributes();
}


/* -------------------- SIDEBAR -------------------- */
function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }

  // Tambahkan event listener untuk klik di luar sidebar
  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
      sidebar.classList.remove("active");
    }
  });

  // Tutup sidebar saat mengklik link
  const sidebarLinks = document.querySelectorAll(".sidebar-links a");
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("active");
    });
  });
}

/* -------------------- MODAL -------------------- */
function initModal() {
  const modal = document.getElementById("kritik-saran-modal");
  const kritikSaranBtns = document.querySelectorAll(".kritik-saran-btn");
  const closeBtn = document.querySelector(".modal-close");

  kritikSaranBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      modal.style.display = "flex";
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

/* -------------------- DEV NOTIF -------------------- */
// Fungsi untuk notifikasi pengembangan
function initDevNotif() {
    const notif = document.getElementById('dev-notif');
    const closeBtn = document.getElementById('notif-close');
    const footerToggleBtn = document.getElementById('toggle-notif');
    const sidebarToggleBtn = document.getElementById('sidebar-notif-toggle'); // Tombol baru di sidebar
    
    // Tampilkan notifikasi saat halaman dimuat
    setTimeout(() => {
        notif.classList.add('active');
    }, 1000);
    
    // Tutup notifikasi saat tombol close diklik
    closeBtn.addEventListener('click', () => {
        notif.classList.remove('active');
    });
    
    // Tombol di footer untuk membuka/menutup notifikasi
    footerToggleBtn.addEventListener('click', () => {
        notif.classList.toggle('active');
    });
    
    // Tombol di sidebar untuk membuka/menutup notifikasi
    sidebarToggleBtn.addEventListener('click', () => {
        notif.classList.toggle('active');
    });
    
    // Sembunyikan notifikasi setelah 7 detik (hanya saat pertama kali)
    setTimeout(() => {
        notif.classList.remove('active');
    }, 7000);
}

/* -------------------- FOOTER YEAR -------------------- */
function initYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/* -------------------- VALIDATION -------------------- */
function initValidation() {
  const emailLink = document.getElementById("emailLink");
  const phoneLink = document.getElementById("phoneLink");
  const addressLink = document.getElementById("addressLink");

  if (emailLink) {
    emailLink.addEventListener("click", function (e) {
      const email = "defry.pku@gmail.com";
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert("Email tidak valid!");
        e.preventDefault();
      }
    });
  }

  if (phoneLink) {
    phoneLink.addEventListener("click", function (e) {
      const phone = "081234567890";
      const phonePattern = /^[0-9]{10,15}$/;
      if (!phonePattern.test(phone.replace(/[^0-9]/g, ""))) {
        alert("Nomor telepon tidak valid!");
        e.preventDefault();
      }
    });
  }

  if (addressLink) {
    addressLink.addEventListener("click", function (e) {
      const address = "Jl. Teknologi No. 123, Jakarta";
      if (!address || address.length < 5) {
        alert("Alamat tidak valid!");
        e.preventDefault();
      }
    });
  }
}

/* -------------------- SECTION SERVICES -------------------- */
function initServicesSection() {
  const cardWrapper = document.querySelector(".services .card-wrapper");

  // Validasi keberadaan elemen sebelum melanjutkan
  if (!cardWrapper) {
    console.warn(
      "Services section tidak ditemukan, melewati initServicesSection."
    );
    return; // Keluar dari fungsi
  }

  console.log("Inisialisasi initServicesSection berhasil."); // Tambahkan ini

  // Mengatur event listener jika cardWrapper ada
  let isDown = false,
    startX,
    scrollLeft;

  cardWrapper.addEventListener("mousedown", (e) => {
    isDown = true;
    cardWrapper.classList.add("dragging");
    startX = e.pageX - cardWrapper.offsetLeft;
    scrollLeft = cardWrapper.scrollLeft;
  });

  cardWrapper.addEventListener("mouseleave", () => {
    isDown = false;
    cardWrapper.classList.remove("dragging");
  });

  cardWrapper.addEventListener("mouseup", () => {
    isDown = false;
    cardWrapper.classList.remove("dragging");
  });

  cardWrapper.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - cardWrapper.offsetLeft;
    const walk = (x - startX) * 1.5;
    cardWrapper.scrollLeft = scrollLeft - walk;
  });
}

/* -------------------- Auto Swipe -------------------- */
function startAutoScrollCardWrapper(
  selector = ".services .card-wrapper",
  intervalMs = 3000
) {
  const cardWrapper = document.querySelector(selector);

  // Cek keberadaan elemen
  if (!cardWrapper) {
    console.warn("Card wrapper tidak ditemukan, auto-scroll akan dilewati.");
    return; // Keluar dari fungsi
  }

  console.log("Inisialisasi startAutoScrollCardWrapper berhasil."); // Tambahkan ini

  const cards = cardWrapper.querySelectorAll(".photocard");
  if (!cards.length) return;

  let idx = 0;
  let interval = null;
  let isUserInteracting = false;
  let userInteractedTimeout = null;

  function scrollToCard(i) {
    if (!cards[i]) return;

    const card = cards[i];
    const cardOffset = card.offsetLeft;
    const paddingLeft =
      parseInt(getComputedStyle(cardWrapper).paddingLeft) || 0;

    cardWrapper.scroll({
      left: cardOffset - paddingLeft,
      behavior: "smooth",
    });
  }

  function start() {
    stop(); // Clear interval sebelumnya
    interval = setInterval(() => {
      if (!isUserInteracting) {
        idx = (idx + 1) % cards.length;
        scrollToCard(idx);
      }
    }, intervalMs);
  }

  function stop() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  function markInteracting() {
    isUserInteracting = true;
    stop();

    // Lanjutkan auto-scroll setelah 3 detik tidak ada interaksi
    if (userInteractedTimeout) clearTimeout(userInteractedTimeout);
    userInteractedTimeout = setTimeout(() => {
      isUserInteracting = false;
      start();
    }, 3000);
  }

  // Tangkap interaksi pengguna
  const interactionEvents = [
    "touchstart",
    "pointerdown",
    "mousedown",
    "wheel",
    "keydown",
  ];
  interactionEvents.forEach((evt) => {
    cardWrapper.addEventListener(evt, markInteracting, { passive: true });
  });

  // Mulai auto-scroll
  start();
}

/* -------------------- KRITIK DAN SARAN -------------------- */
function initKritikSaranModal() {
  const modal = document.getElementById("kritik-saran-modal");
  const closeModal = modal.querySelector(".modal-close");
  const kritikSaranBtns = document.querySelectorAll(".kritik-saran-btn");
  const sidebar = document.getElementById("sidebar");
  const body = document.body;

  kritikSaranBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      modal.style.display = "flex"; // Tampilkan modal

      // Jika tombol berasal dari sidebar, tutup sidebar
      if (
        btn.id === "sidebar-kritik-saran" &&
        sidebar.classList.contains("active")
      ) {
        sidebar.classList.remove("active"); // Sembunyikan sidebar
        body.classList.remove("sidebar-open");
      }
    });
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none"; // Sembunyikan modal
  });

  // Tutup modal jika klik di luar konten
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

/* -------------------- END OF SCRIPT -------------------- */
