// File ini berisi data master untuk semua produk.
// Beberapa produk menggunakan struktur baru dengan "hargaDasar" dan "options" untuk demonstrasi fitur varian.
// Produk lainnya menggunakan struktur lama dengan "harga" untuk menunjukkan kompatibilitas.

const semuaProduk = [
    // =================================================================================
    // KATEGORI: Komputer
    // =================================================================================
    {
        nama: "Laptop Ultrabook Swift 14",
        jenis: "Komputer",
        deskripsi: "Laptop tipis dan ringan dengan prosesor bertenaga, cocok untuk mobilitas tinggi dan pekerjaan produktif. Pilih spesifikasi yang sesuai dengan kebutuhan Anda.",
        gambar: "https://placehold.co/600x600/4287f5/white?text=Laptop",
        gallery: [
            "https://placehold.co/600x600/4287f5/white?text=Laptop+Depan",
            "https://placehold.co/600x600/3d7be0/white?text=Laptop+Samping",
            "https://placehold.co/600x600/235baa/white?text=Laptop+Keyboard"
        ],
        hargaDasar: 15500000, // Harga untuk varian paling dasar
        options: [
            {
                nama: "Prosesor",
                choices: [
                    { text: "Intel Core i5 (Bawaan)", modifier: 0, default: true },
                    { text: "Intel Core i7 (+ Rp 2.000.000)", modifier: 2000000 }
                ]
            },
            {
                nama: "RAM",
                choices: [
                    { text: "8 GB DDR5 (Bawaan)", modifier: 0, default: true },
                    { text: "16 GB DDR5 (+ Rp 1.200.000)", modifier: 1200000 }
                ]
            },
            {
                nama: "Penyimpanan",
                choices: [
                    { text: "512 GB SSD (Bawaan)", modifier: 0, default: true },
                    { text: "1 TB SSD (+ Rp 1.500.000)", modifier: 1500000 }
                ]
            },
            {
                nama: "Warna",
                choices: [
                    { text: "Perak Metalik", modifier: 0, default: true },
                    { text: "Hitam Karbon", modifier: 0 },
                    { text: "Special Edition Biru Laut (+ Rp 350.000)", modifier: 350000 }
                ]
            }
        ]
    },
    {
        nama: "PC Gaming ROG Strix G15",
        jenis: "Komputer",
        deskripsi: "Performa gaming maksimal dengan NVIDIA GeForce RTX 4070 dan sistem pendingin canggih.",
        harga: "Rp 32.000.000", // Produk ini tidak memiliki opsi, jadi menggunakan harga tetap.
        gambar: "https://placehold.co/600x600/f54242/white?text=PC+Gaming",
        gallery: [
            "https://placehold.co/600x600/f54242/white?text=PC+Gaming",
            "https://placehold.co/600x600/d43535/white?text=Casing+RGB",
            "https://placehold.co/600x600/b82828/white?text=Komponen"
        ]
    },
    {
        nama: "Monitor Ultrawide LG 34 inch",
        jenis: "Komputer",
        deskripsi: "Monitor layar lebar 34 inci dengan resolusi QHD untuk multitasking dan pengalaman sinematik.",
        harga: "Rp 7.800.000",
        gambar: "https://placehold.co/600x600/333333/white?text=Monitor"
    },
    {
        nama: "Keyboard Mekanikal Keychron K2",
        jenis: "Komputer",
        deskripsi: "Keyboard mekanikal nirkabel dengan layout 75% yang ringkas dan switch yang bisa Anda pilih.",
        hargaDasar: 1350000,
        gambar: "https://placehold.co/600x600/5c5c5c/white?text=Keyboard",
        options: [
            {
                nama: "Tipe Switch",
                choices: [
                    { text: "Gateron Brown (Tactile)", modifier: 0, default: true },
                    { text: "Gateron Blue (Clicky)", modifier: 0 },
                    { text: "Gateron Red (Linear)", modifier: 0 },
                    { text: "Optical Banana (Premium Tactile) (+ Rp 200.000)", modifier: 200000 }
                ]
            }
        ]
    },
    {
        nama: "Mouse Logitech MX Master 3S",
        jenis: "Komputer",
        deskripsi: "Mouse ergonomis presisi tinggi dengan quiet clicks dan scrolling elektromagnetik MagSpeed.",
        harga: "Rp 1.600.000",
        gambar: "https://placehold.co/600x600/6b6b6b/white?text=Mouse"
    },
    {
        nama: "Webcam Logitech C922 Pro Stream",
        jenis: "Komputer",
        deskripsi: "Webcam Full HD 1080p yang dirancang untuk streaming profesional dengan background removal.",
        harga: "Rp 1.450.000",
        gambar: "https://placehold.co/600x600/2b2b2b/white?text=Webcam"
    },
    {
        nama: "Headset SteelSeries Arctis 7+",
        jenis: "Komputer",
        deskripsi: "Headset gaming nirkabel dengan suara surround 7.1 dan daya tahan baterai 30 jam.",
        harga: "Rp 2.800.000",
        gambar: "https://placehold.co/600x600/ffffff/black?text=Headset"
    },
    {
        nama: "Motherboard ASUS ROG Z790",
        jenis: "Komputer",
        deskripsi: "Motherboard ATX untuk prosesor Intel generasi terbaru dengan dukungan PCIe 5.0 dan DDR5.",
        harga: "Rp 9.500.000",
        gambar: "https://placehold.co/600x600/800000/white?text=Motherboard"
    },
    {
        nama: "VGA Card NVIDIA RTX 4080",
        jenis: "Komputer",
        deskripsi: "Kartu grafis performa tinggi untuk gaming 4K dan pekerjaan kreatif profesional.",
        harga: "Rp 22.000.000",
        gambar: "https://placehold.co/600x600/76b900/white?text=VGA+Card"
    },
    {
        nama: "RAM Corsair Vengeance 32GB Kit",
        jenis: "Komputer",
        deskripsi: "Kit memori DDR5 32GB (2x16GB) dengan kecepatan 6000MHz dan heatspreader aluminium.",
        harga: "Rp 2.100.000",
        gambar: "https://placehold.co/600x600/1a1a1a/white?text=RAM"
    },

    // =================================================================================
    // KATEGORI: Alat Kantor
    // =================================================================================
    {
        nama: "Printer Epson L3210 All-in-One",
        jenis: "Alat Kantor",
        deskripsi: "Printer tangki tinta (Ink Tank) yang sangat hemat biaya untuk cetak, pindai, dan fotokopi.",
        harga: "Rp 2.500.000",
        gambar: "https://placehold.co/600x600/003366/white?text=Printer"
    },
    {
        nama: "Mesin Penghancur Kertas SecureMax",
        jenis: "Alat Kantor",
        deskripsi: "Hancurkan dokumen rahasia dengan aman menggunakan mesin cross-cut kapasitas 10 lembar.",
        harga: "Rp 1.850.000",
        gambar: "https://placehold.co/600x600/4d4d4d/white?text=Shredder"
    },
    {
        nama: "Proyektor BenQ MW550",
        jenis: "Alat Kantor",
        deskripsi: "Proyektor bisnis dengan kecerahan 3600 Lumens untuk presentasi yang jelas di ruangan terang.",
        harga: "Rp 6.200.000",
        gambar: "https://placehold.co/600x600/f0f0f0/black?text=Proyektor"
    },
    {
        nama: "Kursi Ergonomis ErgoPro",
        jenis: "Alat Kantor",
        deskripsi: "Kursi kerja dengan dukungan lumbar yang dapat disesuaikan untuk kenyamanan sepanjang hari.",
        hargaDasar: 3100000,
        gambar: "https://placehold.co/600x600/363636/white?text=Kursi+Kantor",
        options: [
            {
                nama: "Warna Kain",
                choices: [
                    { text: "Hitam Klasik", modifier: 0, default: true },
                    { text: "Abu-abu Modern", modifier: 0 },
                    { text: "Biru Navy", modifier: 0 }
                ]
            }
        ]
    },
    {
        nama: "Meja Kerja Elektrik Adjustable",
        jenis: "Alat Kantor",
        deskripsi: "Meja yang ketinggiannya dapat diatur secara elektrik, memungkinkan kerja sambil duduk atau berdiri.",
        harga: "Rp 5.500.000",
        gambar: "https://placehold.co/600x600/d2b48c/black?text=Meja+Elektrik"
    },
    {
        nama: "Lemari Arsip Baja 4 Laci",
        jenis: "Alat Kantor",
        deskripsi: "Lemari arsip dari bahan baja yang kokoh dan tahan lama, dilengkapi kunci sentral.",
        harga: "Rp 2.750.000",
        gambar: "https://placehold.co/600x600/a9a9a9/white?text=Lemari+Arsip"
    },
    {
        nama: "Papan Tulis Kaca Glassboard",
        jenis: "Alat Kantor",
        deskripsi: "Papan tulis modern dari bahan kaca tempered yang mudah dibersihkan dan tidak membekas.",
        harga: "Rp 1.900.000",
        gambar: "https://placehold.co/600x600/e6f2ff/black?text=Glassboard"
    },
    {
        nama: "Mesin Laminating A3 SecureLam",
        jenis: "Alat Kantor",
        deskripsi: "Melindungi dokumen penting hingga ukuran A3 dengan hasil laminasi yang rapi dan bebas gelembung.",
        harga: "Rp 950.000",
        gambar: "https://placehold.co/600x600/b0c4de/black?text=Laminating"
    },
    {
        nama: "Telepon IP Cisco 7821",
        jenis: "Alat Kantor",
        deskripsi: "Telepon berbasis IP untuk komunikasi bisnis yang jernih dan andal dengan 2-line.",
        harga: "Rp 2.200.000",
        gambar: "https://placehold.co/600x600/708090/white?text=Telepon+IP"
    },
    {
        nama: "Brankas Digital Tahan Api",
        jenis: "Alat Kantor",
        deskripsi: "Brankas baja dengan kunci digital dan ketahanan api hingga 1 jam untuk aset berharga.",
        harga: "Rp 4.800.000",
        gambar: "https://placehold.co/600x600/2f4f4f/white?text=Brankas"
    },

    // =================================================================================
    // KATEGORI: Security System
    // =================================================================================
    {
        nama: "CCTV Outdoor Hikvision 5MP",
        jenis: "Security System",
        deskripsi: "Kamera CCTV outdoor tahan cuaca (IP67) dengan resolusi tajam 5MP dan night vision.",
        hargaDasar: 850000,
        gambar: "https://placehold.co/600x600/cc0000/white?text=CCTV+Outdoor",
        options: [
            {
                nama: "Paket Pembelian",
                choices: [
                    { text: "Kamera Saja", modifier: 0, default: true },
                    { text: "Kamera + Adaptor 12V", modifier: 75000 },
                    { text: "Kamera + Adaptor & Kabel 20m", modifier: 150000 }
                ]
            }
        ]
    },
    {
        nama: "Smart Lock Digital Bardi",
        jenis: "Security System",
        deskripsi: "Kunci pintu pintar yang bisa dibuka dengan sidik jari, kartu, PIN, dan aplikasi smartphone.",
        harga: "Rp 2.300.000",
        gambar: "https://placehold.co/600x600/000000/white?text=Smart+Lock"
    },
    {
        nama: "Video Doorbell Eufy Security",
        jenis: "Security System",
        deskripsi: "Bel pintu pintar dengan kamera 2K, deteksi manusia, dan komunikasi dua arah.",
        harga: "Rp 2.900.000",
        gambar: "https://placehold.co/600x600/1a2b3c/white?text=Video+Doorbell"
    },
    {
        nama: "Alarm System Kit AJAX",
        jenis: "Security System",
        deskripsi: "Paket sistem alarm nirkabel profesional, termasuk Hub, sensor gerak, dan sensor pintu.",
        harga: "Rp 7.500.000",
        gambar: "https://placehold.co/600x600/999999/black?text=Alarm+Kit"
    },
    {
        nama: "DVR 8 Channel Dahua",
        jenis: "Security System",
        deskripsi: "Digital Video Recorder untuk 8 channel kamera CCTV dengan kompresi H.265+.",
        harga: "Rp 1.500.000",
        gambar: "https://placehold.co/600x600/3d3d3d/white?text=DVR"
    },
    {
        nama: "Sensor Gerak PIR Wireless",
        jenis: "Security System",
        deskripsi: "Passive Infrared sensor untuk mendeteksi gerakan, kompatibel dengan sistem alarm nirkabel.",
        harga: "Rp 350.000",
        gambar: "https://placehold.co/600x600/f5f5f5/black?text=Sensor+Gerak"
    },
    {
        nama: "Sirine Alarm Outdoor 120dB",
        jenis: "Security System",
        deskripsi: "Sirine eksternal dengan suara 120 desibel dan lampu strobo untuk efek kejut maksimal.",
        harga: "Rp 450.000",
        gambar: "https://placehold.co/600x600/ff3333/white?text=Sirine+Alarm"
    },
    {
        nama: "Access Control Sidik Jari ZKTeco",
        jenis: "Security System",
        deskripsi: "Mesin absensi dan kontrol akses pintu menggunakan verifikasi sidik jari, kartu, dan PIN.",
        harga: "Rp 1.950.000",
        gambar: "https://placehold.co/600x600/0066cc/white?text=Access+Control"
    },
    {
        nama: "CCTV Indoor Dome 2MP",
        jenis: "Security System",
        deskripsi: "Kamera pengawas dalam ruangan berbentuk kubah yang tidak mencolok dengan kualitas HD.",
        harga: "Rp 450.000",
        gambar: "https://placehold.co/600x600/e0e0e0/black?text=CCTV+Indoor"
    },
    {
        nama: "Smoke Detector & Heat Alarm",
        jenis: "Security System",
        deskripsi: "Detektor asap dan panas fotolistrik yang terintegrasi untuk peringatan dini kebakaran.",
        harga: "Rp 300.000",
        gambar: "https://placehold.co/600x600/ff9900/white?text=Smoke+Detector"
    }
];