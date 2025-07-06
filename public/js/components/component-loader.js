// js/components/component-loader.js (Versi Final)

// Fungsi ini mengambil satu file HTML dan menyuntikkannya ke target
async function loadComponent(componentPath, targetElement) {
    // Jika target tidak ada di halaman saat ini, lewati
    if (!targetElement) return;

    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Gagal memuat: ${componentPath}`);
        const html = await response.text();
        // Gunakan insertAdjacentHTML untuk menambahkan konten tanpa menghapus yang sudah ada
        targetElement.insertAdjacentHTML('beforeend', html);
    } catch (error) {
        console.error(`Error saat memuat komponen ${componentPath}:`, error);
    }
}

// Fungsi utama yang diekspor untuk memuat semua komponen yang dibutuhkan
export async function loadAllComponents(pageName) {
    const topContainer = document.getElementById('component-container-top');
    const bottomContainer = document.getElementById('component-container-bottom');

    // Komponen yang selalu dimuat di semua halaman
    const commonPromises = [
        loadComponent('./components/loading-screen.html', topContainer),
        loadComponent('./components/modals.html', bottomContainer)
    ];

    // Komponen spesifik berdasarkan nama halaman
    if (pageName === 'index') {
        await loadComponent('./components/navbar/navbar.html', topContainer);
        await loadComponent('./components/sidebar/sidebar.html', topContainer);
    } else if (pageName === 'toko') {
        await loadComponent('./components/navbar/navbar-toko.html', topContainer);
        await loadComponent('./components/sidebar/sidebar-toko.html', topContainer);
    } else if (pageName === 'pelayanan') {
        await loadComponent('./components/navbar/navbar-pelayanan.html', topContainer);
        await loadComponent('./components/sidebar/sidebar-pelayanan.html', topContainer);
    } else if (pageName === 'spesifikasi') {
        await loadComponent('./components/navbar/navbar-spesifikasi.html', topContainer);
        await loadComponent('./components/sidebar/sidebar-spesifikasi.html', topContainer);
    }

    // Tunggu semua komponen yang relevan selesai dimuat
    await Promise.all(commonPromises);
}