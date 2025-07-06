// js/data-produk.js (Versi Final dengan Data Lengkap untuk Semua Produk)

// INSTRUKSI PEMBERIAN DATA PRODUK:
// 1. Contoh produk yang memiliki opsi konfigurasi:
// {
    //     nama: "Laptop Ultrabook Swift 14",
    //     jenis: "Komputer",
    //     deskripsi: "Bebas.",
    //     gambar: "Bebas",
    //     gallery: [
    //         "Gambar 1",
    //         "Gambar 2",
    //         "Gambar 3" dst jangan lupa koma di akhir
    //     ],
        // hargaDasar: 15500000,  Harga awal produk
    //     options: [
    //         {
    //             nama: "Prosesor",
    //             choices: [
    //                 { text: "Intel Core i5 (Bawaan)", modifier: 0, default: true },
    //                 { text: "Intel Core i7 (+ Rp 2.000.000)", modifier: 2000000 }
    //             ]
    //         },
    //         {
    //             nama: "RAM",
    //             choices: [
    //                 { text: "8 GB DDR5 (Bawaan)", modifier: 0, default: true },
    //                 { text: "16 GB DDR5 (+ Rp 1.200.000)", modifier: 1200000 }
    //             ]
    //         },
    //         {
    //             nama: "Warna",
    //             choices: [
    //                 { text: "Perak Metalik", modifier: 0, default: true },
    //                 { text: "Hitam Karbon", modifier: 0 },
    //                 { text: "Special Edition Biru Laut (+ Rp 350.000)", modifier: 350000 }
    //             ]
    //         }
    //     ]
    // },

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
            "https://placehold.co/600x600/4287f5/white?text=Depan",
            "https://placehold.co/600x600/3d7be0/white?text=Samping",
            "https://placehold.co/600x600/235baa/white?text=Keyboard"
        ],
        hargaDasar: 15500000,
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
        deskripsi: "Performa gaming maksimal dengan sistem pendingin canggih. Upgrade komponen sesuai keinginan untuk pengalaman terbaik.",
        gambar: "https://placehold.co/600x600/f54242/white?text=PC+Gaming",
        gallery: [
            "https://placehold.co/600x600/f54242/white?text=PC+Gaming",
            "https://placehold.co/600x600/d43535/white?text=Casing+RGB",
            "https://placehold.co/600x600/b82828/white?text=Komponen"
        ],
        hargaDasar: 32000000,
        options: [
             {
                nama: "Kartu Grafis",
                choices: [
                    { text: "NVIDIA RTX 4070 (Bawaan)", modifier: 0, default: true },
                    { text: "NVIDIA RTX 4080 (+ Rp 8.500.000)", modifier: 8500000 }
                ]
            },
            {
                nama: "Penyimpanan",
                choices: [
                    { text: "1 TB SSD Gen4 (Bawaan)", modifier: 0, default: true },
                    { text: "2 TB SSD Gen4 (+ Rp 1.800.000)", modifier: 1800000 }
                ]
            }
        ]
    },
    {
        nama: "Monitor Ultrawide LG 34 inch",
        jenis: "Komputer",
        deskripsi: "Monitor layar lebar 34 inci dengan resolusi QHD untuk multitasking dan pengalaman sinematik.",
        hargaDasar: 7800000,
        gambar: "https://placehold.co/600x600/333333/white?text=Monitor",
        gallery: [
            "https://placehold.co/600x600/333333/white?text=Monitor+Depan",
            "https://placehold.co/600x600/292929/white?text=Monitor+Belakang",
            "https://placehold.co/600x600/1f1f1f/white?text=Port+Input"
        ],
        options: [
            {
                nama: "Kondisi",
                choices: [
                    { text: "Baru (Segel)", modifier: 0, default: true },
                    { text: "Like New (Buka Kotak)", modifier: -500000 }
                ]
            }
        ]
    },
    {
        nama: "Keyboard Mekanikal Keychron K2",
        jenis: "Komputer",
        deskripsi: "Keyboard mekanikal nirkabel dengan layout 75% yang ringkas dan switch yang bisa Anda pilih.",
        hargaDasar: 1350000,
        gambar: "https://placehold.co/600x600/5c5c5c/white?text=Keyboard",
        gallery: ["https://placehold.co/600x600/5c5c5c/white?text=Keyboard+Utama", "https://placehold.co/600x600/4a4a4a/white?text=Backlight+RGB"],
        options: [
            {
                nama: "Tipe Switch",
                choices: [
                    { text: "Gateron Brown (Tactile)", modifier: 0, default: true },
                    { text: "Gateron Blue (Clicky)", modifier: 0 },
                    { text: "Optical Banana (Premium) (+ Rp 200.000)", modifier: 200000 }
                ]
            },
            {
                nama: "Frame",
                choices: [
                    { text: "Plastik (Bawaan)", modifier: 0, default: true },
                    { text: "Aluminium (+ Rp 300.000)", modifier: 300000 }
                ]
            }
        ]
    },
    {
        nama: "Mouse Logitech MX Master 3S",
        jenis: "Komputer",
        deskripsi: "Mouse ergonomis presisi tinggi dengan quiet clicks dan scrolling elektromagnetik MagSpeed.",
        hargaDasar: 1600000,
        gambar: "https://placehold.co/600x600/6b6b6b/white?text=Mouse",
        gallery: ["https://placehold.co/600x600/6b6b6b/white?text=Mouse+Hitam", "https://placehold.co/600x600/d1d1d1/black?text=Mouse+Putih"],
        options: [
             {
                nama: "Warna",
                choices: [
                    { text: "Graphite (Hitam)", modifier: 0, default: true },
                    { text: "Pale Gray (Putih)", modifier: 0 }
                ]
            }
        ]
    },
    { 
        nama: "Webcam Logitech C922 Pro Stream", 
        jenis: "Komputer", 
        deskripsi: "Webcam Full HD 1080p untuk streaming profesional.", 
        hargaDasar: 1450000, 
        gambar: "https://placehold.co/600x600/2b2b2b/white?text=Webcam", 
        gallery: ["https://placehold.co/600x600/2b2b2b/white?text=Webcam", "https://placehold.co/600x600/1f1f1f/white?text=Webcam+Tripod"],
        options: [
            {
                nama: "Paket",
                choices: [
                    { text: "Webcam Saja", modifier: 0, default: true },
                    { text: "Webcam + Mini Tripod (+ Rp 150.000)", modifier: 150000}
                ]
            }
        ] 
    },
    { 
        nama: "Headset SteelSeries Arctis 7+", 
        jenis: "Komputer", 
        deskripsi: "Headset gaming nirkabel dengan suara surround 7.1.", 
        hargaDasar: 2800000, 
        gambar: "https://placehold.co/600x600/f1f1f1/black?text=Headset", 
        gallery: ["https://placehold.co/600x600/f1f1f1/black?text=Headset+Putih", "https://placehold.co/600x600/1a1a1a/white?text=Headset+Hitam"],
        options: [
            {
                nama: "Warna",
                choices: [
                    { text: "Hitam", modifier: 0, default: true },
                    { text: "Putih", modifier: 0 }
                ]
            }
        ]
    },
    { 
        nama: "Motherboard ASUS ROG Z790", 
        jenis: "Komputer", 
        deskripsi: "Motherboard ATX untuk prosesor Intel gen terbaru.", 
        harga: "Rp 9.500.000", 
        gambar: "https://placehold.co/600x600/800000/white?text=Motherboard", 
        gallery: ["https://placehold.co/600x600/800000/white?text=Motherboard", "https://placehold.co/600x600/600000/white?text=IO+Panel"]
    },
    { 
        nama: "VGA Card NVIDIA RTX 4080", 
        jenis: "Komputer", 
        deskripsi: "Kartu grafis performa tinggi untuk gaming 4K.", 
        harga: "Rp 22.000.000", 
        gambar: "https://placehold.co/600x600/76b900/white?text=VGA+Card", 
        gallery: ["https://placehold.co/600x600/76b900/white?text=VGA+Card", "https://placehold.co/600x600/5a8c00/white?text=Kipas"] 
    },
    { 
        nama: "RAM Corsair Vengeance 32GB Kit", 
        jenis: "Komputer", 
        deskripsi: "Kit memori DDR5 32GB (2x16GB) kecepatan 6000MHz.", 
        harga: "Rp 2.100.000", 
        gambar: "https://placehold.co/600x600/1a1a1a/white?text=RAM", 
        gallery: ["https://placehold.co/600x600/1a1a1a/white?text=RAM", "https://placehold.co/600x600/3d3d3d/white?text=Terpasang"] 
    },

    // =================================================================================
    // KATEGORI: Alat Kantor
    // =================================================================================
    {
        nama: "Printer Epson L3210 All-in-One",
        jenis: "Alat Kantor",
        deskripsi: "Printer tangki tinta yang sangat hemat biaya untuk cetak, pindai, dan fotokopi.",
        hargaDasar: 2500000,
        gambar: "https://placehold.co/600x600/003366/white?text=Printer",
        gallery: ["https://placehold.co/600x600/003366/white?text=Printer", "https://placehold.co/600x600/004488/white?text=Scanner"],
        options: [
            {
                nama: "Paket Tinta",
                choices: [
                    { text: "Tinta Bawaan (1 set)", modifier: 0, default: true },
                    { text: "Tinta Bawaan + 1 Set Cadangan (+ Rp 350.000)", modifier: 350000}
                ]
            }
        ]
    },
    {
        nama: "Mesin Penghancur Kertas SecureMax",
        jenis: "Alat Kantor",
        deskripsi: "Hancurkan dokumen rahasia dengan aman menggunakan mesin cross-cut kapasitas 10 lembar.",
        harga: "Rp 1.850.000",
        gambar: "https://placehold.co/600x600/4d4d4d/white?text=Shredder",
        gallery: ["https://placehold.co/600x600/4d4d4d/white?text=Shredder"]
    },
    {
        nama: "Proyektor BenQ MW550",
        jenis: "Alat Kantor",
        deskripsi: "Proyektor bisnis dengan kecerahan 3600 Lumens untuk presentasi yang jelas.",
        harga: "Rp 6.200.000",
        gambar: "https://placehold.co/600x600/f0f0f0/black?text=Proyektor",
        gallery: ["https://placehold.co/600x600/f0f0f0/black?text=Proyektor", "https://placehold.co/600x600/cccccc/black?text=Lensa"]
    },
    {
        nama: "Kursi Ergonomis ErgoPro",
        jenis: "Alat Kantor",
        deskripsi: "Kursi kerja dengan dukungan lumbar yang dapat disesuaikan untuk kenyamanan sepanjang hari.",
        hargaDasar: 3100000,
        gambar: "https://placehold.co/600x600/363636/white?text=Kursi+Kantor",
        gallery: ["https://placehold.co/600x600/363636/white?text=Kursi+Hitam", "https://placehold.co/600x600/969696/white?text=Kursi+Abu"],
        options: [
            {
                nama: "Warna Kain",
                choices: [
                    { text: "Hitam Klasik", modifier: 0, default: true },
                    { text: "Abu-abu Modern", modifier: 0 }
                ]
            },
            {
                nama: "Jenis Sandaran Tangan",
                choices: [
                    { text: "2D Adjustable", modifier: 0, default: true },
                    { text: "4D Adjustable (+ Rp 450.000)", modifier: 450000 }
                ]
            }
        ]
    },
    { 
        nama: "Meja Kerja Elektrik Adjustable", 
        jenis: "Alat Kantor", 
        deskripsi: "Meja yang ketinggiannya dapat diatur secara elektrik.", 
        harga: "Rp 5.500.000", 
        gambar: "https://placehold.co/600x600/d2b48c/black?text=Meja+Elektrik",
        gallery: ["https://placehold.co/600x600/d2b48c/black?text=Meja+Elektrik"] 
    },
    { 
        nama: "Lemari Arsip Baja 4 Laci", 
        jenis: "Alat Kantor", 
        deskripsi: "Lemari arsip dari bahan baja yang kokoh dan tahan lama.", 
        harga: "Rp 2.750.000", 
        gambar: "https://placehold.co/600x600/a9a9a9/white?text=Lemari+Arsip",
        gallery: ["https://placehold.co/600x600/a9a9a9/white?text=Lemari+Arsip"]
    },
    { 
        nama: "Papan Tulis Kaca Glassboard", 
        jenis: "Alat Kantor", 
        deskripsi: "Papan tulis modern dari bahan kaca tempered yang mudah dibersihkan.", 
        hargaDasar: 1900000,
        gambar: "https://placehold.co/600x600/e6f2ff/black?text=Glassboard",
        gallery: ["https://placehold.co/600x600/e6f2ff/black?text=Glassboard"],
        options: [
            {
                nama: "Ukuran",
                choices: [
                    { text: "120 x 80 cm", modifier: 0, default: true},
                    { text: "150 x 90 cm (+ Rp 400.000)", modifier: 400000}
                ]
            }
        ]
    },
    { 
        nama: "Mesin Laminating A3 SecureLam", 
        jenis: "Alat Kantor", 
        deskripsi: "Melindungi dokumen penting hingga ukuran A3.", 
        harga: "Rp 950.000", 
        gambar: "https://placehold.co/600x600/b0c4de/black?text=Laminating",
        gallery: ["https://placehold.co/600x600/b0c4de/black?text=Laminating"]
    },
    { 
        nama: "Telepon IP Cisco 7821", 
        jenis: "Alat Kantor", 
        deskripsi: "Telepon berbasis IP untuk komunikasi bisnis yang jernih.", 
        harga: "Rp 2.200.000", 
        gambar: "https://placehold.co/600x600/708090/white?text=Telepon+IP",
        gallery: ["https://placehold.co/600x600/708090/white?text=Telepon+IP"]
    },
    { 
        nama: "Brankas Digital Tahan Api", 
        jenis: "Alat Kantor", 
        deskripsi: "Brankas baja dengan kunci digital dan ketahanan api.", 
        harga: "Rp 4.800.000", 
        gambar: "https://placehold.co/600x600/2f4f4f/white?text=Brankas",
        gallery: ["https://placehold.co/600x600/2f4f4f/white?text=Brankas"]
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
        gallery: ["https://placehold.co/600x600/cc0000/white?text=CCTV+Outdoor", "https://placehold.co/600x600/b30000/white?text=Night+Vision"],
        options: [
            {
                nama: "Paket Pembelian",
                choices: [
                    { text: "Kamera Saja", modifier: 0, default: true },
                    { text: "Kamera + Adaptor 12V (+ Rp 75.000)", modifier: 75000 },
                    { text: "Kamera + Adaptor & Kabel 20m (+ Rp 150.000)", modifier: 150000 }
                ]
            }
        ]
    },
    {
        nama: "Smart Lock Digital Bardi",
        jenis: "Security System",
        deskripsi: "Kunci pintu pintar yang bisa dibuka dengan sidik jari, kartu, PIN, dan aplikasi smartphone.",
        hargaDasar: 2300000,
        gambar: "https://placehold.co/600x600/000000/white?text=Smart+Lock",
        gallery: ["https://placehold.co/600x600/000000/white?text=Smart+Lock", "https://placehold.co/600x600/1a1a1a/white?text=Fingerprint"],
        options: [
            {
                nama: "Warna",
                choices: [
                    { text: "Hitam", modifier: 0, default: true},
                    { text: "Silver", modifier: 0}
                ]
            }
        ]
    },
    { 
        nama: "Video Doorbell Eufy Security", 
        jenis: "Security System", 
        deskripsi: "Bel pintu pintar dengan kamera 2K dan komunikasi dua arah.", 
        harga: "Rp 2.900.000", 
        gambar: "https://placehold.co/600x600/1a2b3c/white?text=Video+Doorbell",
        gallery: ["https://placehold.co/600x600/1a2b3c/white?text=Video+Doorbell"]
    },
    { 
        nama: "Alarm System Kit AJAX", 
        jenis: "Security System", 
        deskripsi: "Paket sistem alarm nirkabel profesional.", 
        harga: "Rp 7.500.000", 
        gambar: "https://placehold.co/600x600/999999/black?text=Alarm+Kit",
        gallery: ["https://placehold.co/600x600/999999/black?text=Alarm+Kit"]
    },
    { 
        nama: "DVR 8 Channel Dahua", 
        jenis: "Security System", 
        deskripsi: "Digital Video Recorder untuk 8 channel kamera CCTV.", 
        harga: "Rp 1.500.000", 
        gambar: "https://placehold.co/600x600/3d3d3d/white?text=DVR",
        gallery: ["https://placehold.co/600x600/3d3d3d/white?text=DVR"] 
    },
    { 
        nama: "Sensor Gerak PIR Wireless", 
        jenis: "Security System", 
        deskripsi: "Passive Infrared sensor untuk mendeteksi gerakan.", 
        harga: "Rp 350.000", 
        gambar: "https://placehold.co/600x600/f5f5f5/black?text=Sensor+Gerak",
        gallery: ["https://placehold.co/600x600/f5f5f5/black?text=Sensor+Gerak"]
    },
    { 
        nama: "Sirine Alarm Outdoor 120dB", 
        jenis: "Security System", 
        deskripsi: "Sirine eksternal dengan suara 120 desibel dan lampu strobo.", 
        harga: "Rp 450.000", 
        gambar: "https://placehold.co/600x600/ff3333/white?text=Sirine+Alarm",
        gallery: ["https://placehold.co/600x600/ff3333/white?text=Sirine+Alarm"]
    },
    { 
        nama: "Access Control Sidik Jari ZKTeco", 
        jenis: "Security System", 
        deskripsi: "Mesin absensi dan kontrol akses pintu.", 
        harga: "Rp 1.950.000", 
        gambar: "https://placehold.co/600x600/0066cc/white?text=Access+Control",
        gallery: ["https://placehold.co/600x600/0066cc/white?text=Access+Control"]
    },
    { 
        nama: "CCTV Indoor Dome 2MP", 
        jenis: "Security System", 
        deskripsi: "Kamera pengawas dalam ruangan berbentuk kubah.", 
        harga: "Rp 450.000", 
        gambar: "https://placehold.co/600x600/e0e0e0/black?text=CCTV+Indoor",
        gallery: ["https://placehold.co/600x600/e0e0e0/black?text=CCTV+Indoor"]
    },
    { 
        nama: "Smoke Detector & Heat Alarm", 
        jenis: "Security System", 
        deskripsi: "Detektor asap dan panas untuk peringatan dini kebakaran.", 
        harga: "Rp 300.000", 
        gambar: "https://placehold.co/600x600/ff9900/white?text=Smoke+Detector",
        gallery: ["https://placehold.co/600x600/ff9900/white?text=Smoke+Detector"]
    }
];