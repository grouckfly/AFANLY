// File ini hanya berisi data master untuk semua produk.
// Dibuat terpisah agar mudah dikelola.

const semuaProduk = [
  // =================================================================================
  // KATEGORI: Komputer (10 Produk)
  // =================================================================================
  {
    nama: "Laptop Ultrabook Swift 14",
    jenis: "Komputer",
    deskripsi: "Laptop tipis dan ringan dengan prosesor Intel Core i7, cocok untuk mobilitas tinggi dan pekerjaan produktif.",
    harga: "Rp 16.500.000",
    gambar: "https://placehold.co/600x600/4287f5/white?text=Laptop",
    gallery: [
      "https://placehold.co/600x600/4287f5/white?text=Laptop+Depan",
      "https://placehold.co/600x600/4287f5/white?text=Laptop+Samping",
      "https://placehold.co/600x600/4287f5/white?text=Laptop+Keyboard"
    ]
  },
  {
    nama: "PC Gaming ROG Strix G15",
    jenis: "Komputer",
    deskripsi: "Performa gaming maksimal dengan NVIDIA GeForce RTX 4070 dan sistem pendingin canggih.",
    harga: "Rp 32.000.000",
    gambar: "https://placehold.co/600x600/f54242/white?text=PC+Gaming",
    gallery: [
      "https://placehold.co/600x600/f54242/white?text=PC+Gaming",
      "https://placehold.co/600x600/f54242/white?text=Casing+RGB",
      "https://placehold.co/600x600/f54242/white?text=Komponen"
    ]
  },
  {
    nama: "Monitor Ultrawide LG 34 inch",
    jenis: "Komputer",
    deskripsi: "Monitor layar lebar 34 inci dengan resolusi QHD untuk multitasking dan pengalaman sinematik.",
    harga: "Rp 7.800.000",
    gambar: "https://placehold.co/600x600/333333/white?text=Monitor",
    gallery: [
      "https://placehold.co/600x600/333333/white?text=Monitor+Depan",
      "https://placehold.co/600x600/333333/white?text=Monitor+Belakang",
      "https://placehold.co/600x600/333333/white?text=Port+Input"
    ]
  },
  {
    nama: "Keyboard Mekanikal Keychron K2",
    jenis: "Komputer",
    deskripsi: "Keyboard mekanikal nirkabel dengan layout 75% yang ringkas dan switch Gateron Brown.",
    harga: "Rp 1.350.000",
    gambar: "https://placehold.co/600x600/5c5c5c/white?text=Keyboard",
    gallery: [
      "https://placehold.co/600x600/5c5c5c/white?text=Keyboard",
      "https://placehold.co/600x600/5c5c5c/white?text=Tombol",
      "https://placehold.co/600x600/5c5c5c/white?text=Backlight"
    ]
  },
  {
    nama: "Mouse Logitech MX Master 3S",
    jenis: "Komputer",
    deskripsi: "Mouse ergonomis presisi tinggi dengan quiet clicks dan scrolling elektromagnetik MagSpeed.",
    harga: "Rp 1.600.000",
    gambar: "https://placehold.co/600x600/6b6b6b/white?text=Mouse",
    gallery: [
      "https://placehold.co/600x600/6b6b6b/white?text=Mouse",
      "https://placehold.co/600x600/6b6b6b/white?text=Mouse+Atas",
      "https://placehold.co/600x600/6b6b6b/white?text=Mouse+Samping"
    ]
  },
  {
    nama: "Webcam Logitech C922 Pro Stream",
    jenis: "Komputer",
    deskripsi: "Webcam Full HD 1080p yang dirancang untuk streaming profesional dengan background removal.",
    harga: "Rp 1.450.000",
    gambar: "https://placehold.co/600x600/2b2b2b/white?text=Webcam",
    gallery: [
      "https://placehold.co/600x600/2b2b2b/white?text=Webcam",
      "https://placehold.co/600x600/2b2b2b/white?text=Lensa",
      "https://placehold.co/600x600/2b2b2b/white?text=Dudukan"
    ]
  },
  {
    nama: "Headset SteelSeries Arctis 7+",
    jenis: "Komputer",
    deskripsi: "Headset gaming nirkabel dengan suara surround 7.1 dan daya tahan baterai 30 jam.",
    harga: "Rp 2.800.000",
    gambar: "https://placehold.co/600x600/ffffff/black?text=Headset",
    gallery: [
      "https://placehold.co/600x600/ffffff/black?text=Headset",
      "https://placehold.co/600x600/ffffff/black?text=Earcup",
      "https://placehold.co/600x600/ffffff/black?text=Mikrofon"
    ]
  },
  {
    nama: "Motherboard ASUS ROG Z790",
    jenis: "Komputer",
    deskripsi: "Motherboard ATX untuk prosesor Intel generasi terbaru dengan dukungan PCIe 5.0 dan DDR5.",
    harga: "Rp 9.500.000",
    gambar: "https://placehold.co/600x600/800000/white?text=Motherboard",
    gallery: [
      "https://placehold.co/600x600/800000/white?text=Motherboard",
      "https://placehold.co/600x600/800000/white?text=Heatsink",
      "https://placehold.co/600x600/800000/white?text=Slot+RAM"
    ]
  },
  {
    nama: "VGA Card NVIDIA RTX 4080",
    jenis: "Komputer",
    deskripsi: "Kartu grafis performa tinggi untuk gaming 4K dan pekerjaan kreatif profesional.",
    harga: "Rp 22.000.000",
    gambar: "https://placehold.co/600x600/76b900/white?text=VGA+Card",
    gallery: [
      "https://placehold.co/600x600/76b900/white?text=VGA+Card",
      "https://placehold.co/600x600/76b900/white?text=Kipas",
      "https://placehold.co/600x600/76b900/white?text=Port+Output"
    ]
  },
  {
    nama: "RAM Corsair Vengeance 32GB Kit",
    jenis: "Komputer",
    deskripsi: "Kit memori DDR5 32GB (2x16GB) dengan kecepatan 6000MHz dan heatspreader aluminium.",
    harga: "Rp 2.100.000",
    gambar: "https://placehold.co/600x600/1a1a1a/white?text=RAM",
    gallery: [
      "https://placehold.co/600x600/1a1a1a/white?text=RAM",
      "https://placehold.co/600x600/1a1a1a/white?text=Kit",
      "https://placehold.co/600x600/1a1a1a/white?text=Terpasang"
    ]
  },
  
  // =================================================================================
  // KATEGORI: Alat Kantor (10 Produk)
  // =================================================================================
  {
    nama: "Printer Epson L3210 All-in-One",
    jenis: "Alat Kantor",
    deskripsi: "Printer tangki tinta (Ink Tank) yang sangat hemat biaya untuk cetak, pindai, dan fotokopi.",
    harga: "Rp 2.500.000",
    gambar: "https://placehold.co/600x600/003366/white?text=Printer",
    gallery: [
      "https://placehold.co/600x600/003366/white?text=Printer",
      "https://placehold.co/600x600/003366/white?text=Tangki+Tinta",
      "https://placehold.co/600x600/003366/white?text=Scanner"
    ]
  },
  {
    nama: "Mesin Penghancur Kertas SecureMax",
    jenis: "Alat Kantor",
    deskripsi: "Hancurkan dokumen rahasia dengan aman menggunakan mesin cross-cut kapasitas 10 lembar.",
    harga: "Rp 1.850.000",
    gambar: "https://placehold.co/600x600/4d4d4d/white?text=Shredder",
    gallery: [
      "https://placehold.co/600x600/4d4d4d/white?text=Shredder",
      "https://placehold.co/600x600/4d4d4d/white?text=Pisau+Potong",
      "https://placehold.co/600x600/4d4d4d/white?text=Hasil+Potongan"
    ]
  },
  {
    nama: "Proyektor BenQ MW550",
    jenis: "Alat Kantor",
    deskripsi: "Proyektor bisnis dengan kecerahan 3600 Lumens untuk presentasi yang jelas di ruangan terang.",
    harga: "Rp 6.200.000",
    gambar: "https://placehold.co/600x600/f0f0f0/black?text=Proyektor",
    gallery: [
      "https://placehold.co/600x600/f0f0f0/black?text=Proyektor",
      "https://placehold.co/600x600/f0f0f0/black?text=Lensa+Proyektor",
      "https://placehold.co/600x600/f0f0f0/black?text=Panel+Belakang"
    ]
  },
  {
    nama: "Kursi Ergonomis ErgoPro",
    jenis: "Alat Kantor",
    deskripsi: "Kursi kerja dengan dukungan lumbar yang dapat disesuaikan untuk kenyamanan sepanjang hari.",
    harga: "Rp 3.100.000",
    gambar: "https://placehold.co/600x600/363636/white?text=Kursi+Kantor",
    gallery: [
      "https://placehold.co/600x600/363636/white?text=Kursi+Kantor",
      "https://placehold.co/600x600/363636/white?text=Sandaran",
      "https://placehold.co/600x600/363636/white?text=Roda"
    ]
  },
  {
    nama: "Meja Kerja Elektrik Adjustable",
    jenis: "Alat Kantor",
    deskripsi: "Meja yang ketinggiannya dapat diatur secara elektrik, memungkinkan kerja sambil duduk atau berdiri.",
    harga: "Rp 5.500.000",
    gambar: "https://placehold.co/600x600/d2b48c/black?text=Meja+Elektrik",
    gallery: [
      "https://placehold.co/600x600/d2b48c/black?text=Meja+Elektrik",
      "https://placehold.co/600x600/d2b48c/black?text=Tombol+Kontrol",
      "https://placehold.co/600x600/d2b48c/black?text=Posisi+Berdiri"
    ]
  },
  {
    nama: "Lemari Arsip Baja 4 Laci",
    jenis: "Alat Kantor",
    deskripsi: "Lemari arsip dari bahan baja yang kokoh dan tahan lama, dilengkapi kunci sentral.",
    harga: "Rp 2.750.000",
    gambar: "https://placehold.co/600x600/a9a9a9/white?text=Lemari+Arsip",
    gallery: [
      "https://placehold.co/600x600/a9a9a9/white?text=Lemari+Arsip",
      "https://placehold.co/600x600/a9a9a9/white?text=Laci",
      "https://placehold.co/600x600/a9a9a9/white?text=Kunci"
    ]
  },
  {
    nama: "Papan Tulis Kaca Glassboard",
    jenis: "Alat Kantor",
    deskripsi: "Papan tulis modern dari bahan kaca tempered yang mudah dibersihkan dan tidak membekas.",
    harga: "Rp 1.900.000",
    gambar: "https://placehold.co/600x600/e6f2ff/black?text=Glassboard",
    gallery: [
      "https://placehold.co/600x600/e6f2ff/black?text=Glassboard",
      "https://placehold.co/600x600/e6f2ff/black?text=Detail+Kaca",
      "https://placehold.co/600x600/e6f2ff/black?text=Spidol"
    ]
  },
  {
    nama: "Mesin Laminating A3 SecureLam",
    jenis: "Alat Kantor",
    deskripsi: "Melindungi dokumen penting hingga ukuran A3 dengan hasil laminasi yang rapi dan bebas gelembung.",
    harga: "Rp 950.000",
    gambar: "https://placehold.co/600x600/b0c4de/black?text=Laminating",
    gallery: [
      "https://placehold.co/600x600/b0c4de/black?text=Laminating",
      "https://placehold.co/600x600/b0c4de/black?text=Roller",
      "https://placehold.co/600x600/b0c4de/black?text=Hasil"
    ]
  },
  {
    nama: "Telepon IP Cisco 7821",
    jenis: "Alat Kantor",
    deskripsi: "Telepon berbasis IP untuk komunikasi bisnis yang jernih dan andal dengan 2-line.",
    harga: "Rp 2.200.000",
    gambar: "https://placehold.co/600x600/708090/white?text=Telepon+IP",
    gallery: [
      "https://placehold.co/600x600/708090/white?text=Telepon+IP",
      "https://placehold.co/600x600/708090/white?text=Layar",
      "https://placehold.co/600x600/708090/white?text=Tombol"
    ]
  },
  {
    nama: "Brankas Digital Tahan Api",
    jenis: "Alat Kantor",
    deskripsi: "Brankas baja dengan kunci digital dan ketahanan api hingga 1 jam untuk aset berharga.",
    harga: "Rp 4.800.000",
    gambar: "https://placehold.co/600x600/2f4f4f/white?text=Brankas",
    gallery: [
      "https://placehold.co/600x600/2f4f4f/white?text=Brankas",
      "https://placehold.co/600x600/2f4f4f/white?text=Panel+Digital",
      "https://placehold.co/600x600/2f4f4f/white?text=Bagian+Dalam"
    ]
  },

  // =================================================================================
  // KATEGORI: Security System (10 Produk)
  // =================================================================================
  {
    nama: "CCTV Outdoor Hikvision 5MP",
    jenis: "Security System",
    deskripsi: "Kamera CCTV outdoor tahan cuaca (IP67) dengan resolusi tajam 5MP dan night vision.",
    harga: "Rp 850.000",
    gambar: "https://placehold.co/600x600/cc0000/white?text=CCTV+Outdoor",
    gallery: [
      "https://placehold.co/600x600/cc0000/white?text=CCTV+Outdoor",
      "https://placehold.co/600x600/cc0000/white?text=Lensa+5MP",
      "https://placehold.co/600x600/cc0000/white?text=Bracket"
    ]
  },
  {
    nama: "Smart Lock Digital Bardi",
    jenis: "Security System",
    deskripsi: "Kunci pintu pintar yang bisa dibuka dengan sidik jari, kartu, PIN, dan aplikasi smartphone.",
    harga: "Rp 2.300.000",
    gambar: "https://placehold.co/600x600/000000/white?text=Smart+Lock",
    gallery: [
      "https://placehold.co/600x600/000000/white?text=Smart+Lock",
      "https://placehold.co/600x600/000000/white?text=Fingerprint",
      "https://placehold.co/600x600/000000/white?text=Keypad"
    ]
  },
  {
    nama: "Video Doorbell Eufy Security",
    jenis: "Security System",
    deskripsi: "Bel pintu pintar dengan kamera 2K, deteksi manusia, dan komunikasi dua arah.",
    harga: "Rp 2.900.000",
    gambar: "https://placehold.co/600x600/1a2b3c/white?text=Video+Doorbell",
    gallery: [
      "https://placehold.co/600x600/1a2b3c/white?text=Video+Doorbell",
      "https://placehold.co/600x600/1a2b3c/white?text=Kamera+2K",
      "https://placehold.co/600x600/1a2b3c/white?text=Tombol+Bel"
    ]
  },
  {
    nama: "Alarm System Kit AJAX",
    jenis: "Security System",
    deskripsi: "Paket sistem alarm nirkabel profesional, termasuk Hub, sensor gerak, dan sensor pintu.",
    harga: "Rp 7.500.000",
    gambar: "https://placehold.co/600x600/999999/black?text=Alarm+Kit",
    gallery: [
      "https://placehold.co/600x600/999999/black?text=Alarm+Kit",
      "https://placehold.co/600x600/999999/black?text=Hub+Pusat",
      "https://placehold.co/600x600/999999/black?text=Sensor"
    ]
  },
  {
    nama: "DVR 8 Channel Dahua",
    jenis: "Security System",
    deskripsi: "Digital Video Recorder untuk 8 channel kamera CCTV dengan kompresi H.265+.",
    harga: "Rp 1.500.000",
    gambar: "https://placehold.co/600x600/3d3d3d/white?text=DVR",
    gallery: [
      "https://placehold.co/600x600/3d3d3d/white?text=DVR",
      "https://placehold.co/600x600/3d3d3d/white?text=Panel+Depan",
      "https://placehold.co/600x600/3d3d3d/white?text=Port+Belakang"
    ]
  },
  {
    nama: "Sensor Gerak PIR Wireless",
    jenis: "Security System",
    deskripsi: "Passive Infrared sensor untuk mendeteksi gerakan, kompatibel dengan sistem alarm nirkabel.",
    harga: "Rp 350.000",
    gambar: "https://placehold.co/600x600/f5f5f5/black?text=Sensor+Gerak",
    gallery: [
      "https://placehold.co/600x600/f5f5f5/black?text=Sensor+Gerak",
      "https://placehold.co/600x600/f5f5f5/black?text=Sensor+PIR",
      "https://placehold.co/600x600/f5f5f5/black?text=Terpasang"
    ]
  },
  {
    nama: "Sirine Alarm Outdoor 120dB",
    jenis: "Security System",
    deskripsi: "Sirine eksternal dengan suara 120 desibel dan lampu strobo untuk efek kejut maksimal.",
    harga: "Rp 450.000",
    gambar: "https://placehold.co/600x600/ff3333/white?text=Sirine+Alarm",
    gallery: [
      "https://placehold.co/600x600/ff3333/white?text=Sirine+Alarm",
      "https://placehold.co/600x600/ff3333/white?text=Speaker",
      "https://placehold.co/600x600/ff3333/white?text=Lampu+Strobo"
    ]
  },
  {
    nama: "Access Control Sidik Jari ZKTeco",
    jenis: "Security System",
    deskripsi: "Mesin absensi dan kontrol akses pintu menggunakan verifikasi sidik jari, kartu, dan PIN.",
    harga: "Rp 1.950.000",
    gambar: "https://placehold.co/600x600/0066cc/white?text=Access+Control",
    gallery: [
      "https://placehold.co/600x600/0066cc/white?text=Access+Control",
      "https://placehold.co/600x600/0066cc/white?text=Sensor+Jari",
      "https://placehold.co/600x600/0066cc/white?text=Layar+Info"
    ]
  },
  {
    nama: "CCTV Indoor Dome 2MP",
    jenis: "Security System",
    deskripsi: "Kamera pengawas dalam ruangan berbentuk kubah yang tidak mencolok dengan kualitas HD.",
    harga: "Rp 450.000",
    gambar: "https://placehold.co/600x600/e0e0e0/black?text=CCTV+Indoor",
    gallery: [
      "https://placehold.co/600x600/e0e0e0/black?text=CCTV+Indoor",
      "https://placehold.co/600x600/e0e0e0/black?text=Bentuk+Kubah",
      "https://placehold.co/600x600/e0e0e0/black?text=Lensa"
    ]
  },
  {
    nama: "Smoke Detector & Heat Alarm",
    jenis: "Security System",
    deskripsi: "Detektor asap dan panas fotolistrik yang terintegrasi untuk peringatan dini kebakaran.",
    harga: "Rp 300.000",
    gambar: "https://placehold.co/600x600/ff9900/white?text=Smoke+Detector",
    gallery: [
      "https://placehold.co/600x600/ff9900/white?text=Smoke+Detector",
      "https://placehold.co/600x600/ff9900/white?text=Sensor",
      "https://placehold.co/600x600/ff9900/white?text=Ventilasi"
    ]
  }
];