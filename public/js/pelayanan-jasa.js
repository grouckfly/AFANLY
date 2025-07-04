// js/pelayanan-jasa.js
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('layanan-grid-container');

    if (container && typeof semuaLayanan !== 'undefined') {
        semuaLayanan.forEach(layanan => {
            const card = document.createElement('div');
            card.className = 'layanan-card';

            const namaEncoded = encodeURIComponent(layanan.nama);
            const hargaEncoded = encodeURIComponent("Tergantung Kebutuhan");
            const detailEncoded = encodeURIComponent(`\nDetail Layanan: ${layanan.detail}`);
            
            const waLink = `https://wa.me/628127659073?text=Permintaan%20Layanan%20AFANLY%0A%0ANama%20Layanan:%20${namaEncoded}%0A%0ADeskripsi%20Kebutuhan:%20`;
            
            card.innerHTML = `
                <img src="${layanan.gambar}" alt="${layanan.nama}">
                <div class="layanan-card-content">
                    <h3>${layanan.nama}</h3>
                    <p>${layanan.detail}</p>
                    <a href="${waLink}" target="_blank" rel="noopener" class="btn-cta">Hubungi Kami</a>
                </div>
            `;
            container.appendChild(card);
        });
    }
});