// js/components/component-loader.js (Versi Final yang Diperbaiki)

async function loadComponent(componentPath, targetElement) {
    // Jika target tidak ada di halaman saat ini, lewati saja.
    if (!targetElement) return;

    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Gagal memuat: ${componentPath}`);
        const html = await response.text();
        targetElement.insertAdjacentHTML('beforeend', html);
    } catch (error) {
        console.error(`Error saat memuat komponen ${componentPath}:`, error);
    }
}

export async function loadAllComponents(pageName) {
    const topContainer = document.getElementById('component-container-top');
    const bottomContainer = document.getElementById('component-container-bottom');
    const contactContainer = document.getElementById('contact-component-container'); // Perbaiki ID

    // Daftar komponen yang akan dimuat
    const componentPromises = [
        loadComponent('./components/loading-screen.html', topContainer),
        loadComponent('./components/modals.html', bottomContainer)
    ];

    // --- PERBAIKAN LOGIKA ---

    // 1. Muat komponen kontak HANYA JIKA wadahnya ada di halaman
    if (contactContainer) {
        componentPromises.push(loadComponent('./components/contact.html', contactContainer));
    }

    // 2. Tentukan path navbar dan sidebar yang benar berdasarkan nama halaman
    let navbarPath = './components/navbar/navbar.html'; // Default
    let sidebarPath = './components/sidebar/sidebar.html'; // Default

    if (pageName === 'toko') {
        navbarPath = './components/navbar/navbar-toko.html';
        sidebarPath = './components/sidebar/sidebar-toko.html';
    } else if (pageName === 'pelayanan') {
        navbarPath = './components/navbar/navbar-pelayanan.html';
        sidebarPath = './components/sidebar/sidebar-pelayanan.html';
    } else if (pageName === 'spesifikasi') {
        navbarPath = './components/navbar/navbar-spesifikasi.html';
        sidebarPath = './components/sidebar/sidebar-spesifikasi.html';
    }
    
    // Tambahkan promise untuk memuat navbar dan sidebar
    componentPromises.push(loadComponent(navbarPath, topContainer));
    componentPromises.push(loadComponent(sidebarPath, topContainer));

    // Tunggu semua promise yang relevan selesai
    await Promise.all(componentPromises);
}