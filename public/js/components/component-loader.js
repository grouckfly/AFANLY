// js/components/component-loader.js

// Fungsi ini mengambil file HTML dan menyuntikkannya ke target
async function loadComponent(componentPath, targetElementId) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Gagal memuat komponen: ${componentPath}`);
        }
        const html = await response.text();
        const target = document.getElementById(targetElementId);
        if (target) {
            // Gunakan insertAdjacentHTML agar tidak menghapus konten yang sudah ada
            target.insertAdjacentHTML('beforeend', html);
        }
    } catch (error) {
        console.error(error);
    }
}

// Ekspor fungsi utama untuk memuat semua komponen
export async function loadAllComponents() {
    // Definisikan komponen dan targetnya
    const components = [
        { path: 'components/loading-screens.html', target: 'component-container-top' },
        { path: 'components/navbar/navbar.html', target: 'component-container-top' },
        { path: 'components/navbar/navbar-toko.html', target: 'component-container-top-toko' },
        { path: 'components/navbar/navbar-pelayanan.html', target: 'component-container-top-pelayanan' },
        { path: 'components/navbar/navbar-spesifikasi.html', target: 'component-container-top-spesifikasi' },
        { path: 'components/sidebar/sidebar.html', target: 'component-container-top' },
        { path: 'components/sidebar/sidebar-toko.html', target: 'component-container-top-toko' },
        { path: 'components/sidebar/sidebar-pelayanan.html', target: 'component-container-top-pelayanan' },
        { path: 'components/sidebar/sidebar-spesifikasi.html', target: 'component-container-top-spesifikasi' },
        { path: 'components/modals.html', target: 'component-container-bottom' }
    ];

    // Buat array dari semua promise fetch
    const loadingPromises = components.map(comp => loadComponent(comp.path, comp.target));

    // Tunggu semua komponen selesai dimuat
    await Promise.all(loadingPromises);
}