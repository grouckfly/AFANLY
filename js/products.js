// ===== AFANLY Website - Products Management =====
// Author: AFANLY Team
// Description: Product catalog, search, filter, and ordering

'use strict';

// ===== Products Data (Will be loaded from JSON) =====
let productsData = [];

// ===== State Management =====
let currentProduct = null;
let selectedOptions = {};

// ===== Utility Functions =====
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function getCategoryName(category) {
    const categories = {
        'komputer': 'Komputer & PC',
        'kantor': 'Alat Kantor',
        'security': 'Security System'
    };
    return categories[category] || category;
}

// ===== Load Products from JSON =====
async function loadProductsFromJSON() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        const data = await response.json();
        productsData = data;
        console.log('Products loaded successfully:', productsData.length, 'items');
        return true;
    } catch (error) {
        console.error('Error loading products:', error);
        // Use fallback data if JSON fails to load
        productsData = getFallbackProducts();
        console.log('Using fallback product data');
        return false;
    }
}

// ===== Fallback Products (if JSON fails) =====
function getFallbackProducts() {
    return [
        {
            id: 1,
            name: 'Laptop HP EliteBook 840',
            category: 'komputer',
            price: 8500000,
            images: [
                'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23e0e0e0%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22%23666%22 font-size=%2220%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3ELaptop HP%3C/text%3E%3C/svg%3E'
            ],
            description: 'Laptop HP EliteBook 840 dengan prosesor Intel Core i5 generasi terbaru.',
            available: true,
            options: {
                'RAM': ['8GB', '16GB', '32GB'],
                'Storage': ['256GB SSD', '512GB SSD', '1TB SSD']
            }
        }
    ];
}

// ===== Render Products =====
function renderProducts(products = productsData) {
    const productsGrid = document.getElementById('productsGrid');
    const noProducts = document.getElementById('noProducts');
    
    if (!productsGrid) return;
    
    if (products.length === 0) {
        productsGrid.style.display = 'none';
        noProducts.style.display = 'block';
        return;
    }
    
    productsGrid.style.display = 'grid';
    noProducts.style.display = 'none';
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}" role="button" tabindex="0">
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
                <span class="stock-badge ${product.available ? 'available' : 'unavailable'}">
                    ${product.available ? 'Tersedia' : 'Habis'}
                </span>
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">${formatCurrency(product.price)}</div>
                <p class="product-description">${product.description}</p>
            </div>
        </div>
    `).join('');
    
    attachProductCardEvents();
}

function attachProductCardEvents() {
    document.querySelectorAll('.product-card').forEach(card => {
        // Click event
        card.addEventListener('click', function() {
            openProductDetail(this);
        });
        
        // Keyboard support
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openProductDetail(this);
            }
        });
    });
}

function openProductDetail(cardElement) {
    const productId = parseInt(cardElement.dataset.productId);
    const product = productsData.find(p => p.id === productId);
    if (product) {
        showProductModal(product);
    }
}

// ===== Product Modal =====
function showProductModal(product) {
    currentProduct = product;
    selectedOptions = {};
    
    const modal = document.getElementById('productModal');
    if (!modal) return;
    
    // Set main image
    const mainImage = document.getElementById('modalMainImage');
    mainImage.src = product.images[0];
    mainImage.alt = product.name;
    
    // Set thumbnails
    const thumbnailContainer = document.querySelector('.thumbnail-images');
    if (product.images.length > 1) {
        thumbnailContainer.innerHTML = product.images.map((img, index) => `
            <div class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}" role="button" tabindex="0">
                <img src="${img}" alt="${product.name} - Gambar ${index + 1}" loading="lazy">
            </div>
        `).join('');
        
        // Thumbnail events
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.addEventListener('click', function() {
                switchImage(this);
            });
            thumb.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    switchImage(this);
                }
            });
        });
    } else {
        thumbnailContainer.innerHTML = '';
    }
    
    function switchImage(thumbElement) {
        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        thumbElement.classList.add('active');
        const index = parseInt(thumbElement.dataset.index);
        mainImage.src = product.images[index];
    }
    
    // Set product details
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductPrice').textContent = formatCurrency(product.price);
    document.getElementById('modalProductDescription').textContent = product.description;
    
    // Set availability
    const statusElem = document.getElementById('modalProductStatus');
    statusElem.className = `stock-badge ${product.available ? 'available' : 'unavailable'}`;
    statusElem.textContent = product.available ? 'Tersedia' : 'Habis';
    
    // Set options
    const optionsContainer = document.getElementById('modalProductOptions');
    if (product.options && Object.keys(product.options).length > 0) {
        optionsContainer.innerHTML = Object.keys(product.options).map(optionName => `
            <div class="option-group">
                <label for="option-${optionName}">${optionName}:</label>
                <select id="option-${optionName}" name="${optionName}" data-option="${optionName}">
                    ${product.options[optionName].map(value => `
                        <option value="${value}">${value}</option>
                    `).join('')}
                </select>
            </div>
        `).join('');
        
        // Initialize selected options
        optionsContainer.querySelectorAll('select').forEach(select => {
            selectedOptions[select.dataset.option] = select.value;
            
            select.addEventListener('change', function() {
                selectedOptions[this.dataset.option] = this.value;
            });
        });
    } else {
        optionsContainer.innerHTML = '';
    }
    
    // Order button
    const orderBtn = document.getElementById('orderNowBtn');
    if (product.available) {
        orderBtn.disabled = false;
        orderBtn.textContent = 'Pesan Sekarang';
        orderBtn.onclick = () => {
            modal.classList.remove('active');
            showOrderModal(product);
        };
    } else {
        orderBtn.disabled = true;
        orderBtn.textContent = 'Stok Habis';
        orderBtn.onclick = null;
    }

    // Notification ketika produk tidak tersedia
    if (!product.available && window.Notify) {
        window.Notify.warning(
            'Produk Tidak Tersedia',
            `Maaf, ${product.name} saat ini sedang tidak tersedia. Silakan cek produk lain atau hubungi kami.`,
            [
                {
                    label: 'Hubungi Kami',
                    callback: 'contactUs'
                },
                {
                    label: 'Lihat Produk Lain',
                    callback: 'dismissNotification'
                }
            ]
        );
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== Order Modal =====
function showOrderModal(product) {
    const modal = document.getElementById('orderModal');
    if (!modal) return;
    
    // Set product info
    document.getElementById('orderProductName').textContent = product.name;
    document.getElementById('orderProductPrice').textContent = formatCurrency(product.price);
    
    // Display selected options
    const orderOptionsContainer = document.getElementById('orderFormOptions');
    if (Object.keys(selectedOptions).length > 0) {
        orderOptionsContainer.innerHTML = `
            <p><strong>Pilihan yang Dipilih:</strong></p>
            ${Object.entries(selectedOptions).map(([key, value]) => 
                `<p>• ${key}: <strong>${value}</strong></p>`
            ).join('')}
        `;
        orderOptionsContainer.style.display = 'block';
    } else {
        orderOptionsContainer.style.display = 'none';
    }
    
    // Store data in modal
    modal.dataset.productId = product.id;
    modal.dataset.selectedOptions = JSON.stringify(selectedOptions);
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== Search & Filter =====
function initSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');
    
    if (!searchInput) return;
    
    function applyFilters() {
        let filtered = [...productsData];
        
        // Apply category filter
        const category = categoryFilter.value;
        if (category !== 'all') {
            filtered = filtered.filter(p => p.category === category);
        }
        
        // Apply availability filter
        const availability = availabilityFilter.value;
        if (availability === 'available') {
            filtered = filtered.filter(p => p.available);
        } else if (availability === 'unavailable') {
            filtered = filtered.filter(p => !p.available);
        }
        
        // Apply search
        const query = searchInput.value.toLowerCase().trim();
        if (query) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                getCategoryName(product.category).toLowerCase().includes(query)
            );
        }
        
        // Apply sort
        const sort = sortFilter.value;
        switch(sort) {
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
        }
        
        renderProducts(filtered);

        // Notification untuk hasil search/filter
        if (window.Notify) {
            const query = searchInput?.value.toLowerCase().trim();
            if (query && filtered.length === 0) {
                window.Notify.warning(
                    'Produk Tidak Ditemukan',
                    `Tidak ada produk yang cocok dengan pencarian "${query}". Coba kata kunci lain.`
                );
            } else if (query && filtered.length > 0) {
                window.Notify.info(
                    'Hasil Pencarian',
                    `Ditemukan ${filtered.length} produk untuk "${query}".`
                );
            } else if (filtered.length === 0) {
                window.Notify.info(
                    'Tidak Ada Produk',
                    'Tidak ada produk yang sesuai dengan filter yang dipilih.'
                );
            }
        }
    }
    
    searchBtn?.addEventListener('click', applyFilters);
    searchInput?.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });
    
    // Debounce search on typing
    let searchTimeout;
    searchInput?.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(applyFilters, 500);
    });
    
    categoryFilter?.addEventListener('change', applyFilters);
    sortFilter?.addEventListener('change', applyFilters);
    availabilityFilter?.addEventListener('change', applyFilters);
}

// Update initOrderForm - tambahkan error handling
function initOrderForm() {
    const orderForm = document.getElementById('orderForm');
    const sendWhatsAppBtn = document.getElementById('sendWhatsApp');
    const sendEmailBtn = document.getElementById('sendEmail');
    
    if (!orderForm) return;
    
    sendWhatsAppBtn?.addEventListener('click', function() {
        if (validateOrderForm()) {
            const orderData = getOrderData();
            
            try {
                if (typeof sendOrderToWhatsApp !== 'undefined') {
                    sendOrderToWhatsApp(orderData);
                }
                
                closeOrderModal();
            } catch (error) {
                console.error('Error sending order:', error);
                
                if (window.Notify) {
                    window.Notify.error(
                        'Gagal Mengirim Pesanan',
                        'Terjadi kesalahan. Silakan coba lagi atau gunakan opsi Email.'
                    );
                }
            }
        }
    });
    
    sendEmailBtn?.addEventListener('click', function() {
        if (validateOrderForm()) {
            const orderData = getOrderData();
            
            try {
                if (typeof sendOrderToEmail !== 'undefined') {
                    sendOrderToEmail(orderData);
                }
                
                closeOrderModal();
            } catch (error) {
                console.error('Error sending order:', error);
                
                if (window.Notify) {
                    window.Notify.error(
                        'Gagal Membuka Email',
                        'Tidak dapat membuka email client. Silakan hubungi kami langsung.'
                    );
                }
            }
        }
    });
}

// Update fungsi validateOrderForm - tambahkan notifikasi lebih detail
function validateOrderForm() {
    const name = document.getElementById('orderName');
    const phone = document.getElementById('orderPhone');
    const email = document.getElementById('orderEmail');
    const address = document.getElementById('orderAddress');
    
    let isValid = true;
    let errors = [];
    
    if (typeof FormUI !== 'undefined') {
        [name, phone, email, address].forEach(input => FormUI.clearError(input));
    }
    
    if (typeof Validator !== 'undefined') {
        if (!Validator.required(name.value)) {
            FormUI?.showError(name, 'Nama harus diisi');
            errors.push('Nama');
            isValid = false;
        }
        
        if (!Validator.phone(phone.value)) {
            FormUI?.showError(phone, 'Nomor telepon tidak valid');
            errors.push('Nomor Telepon');
            isValid = false;
        }
        
        if (!Validator.email(email.value)) {
            FormUI?.showError(email, 'Email tidak valid');
            errors.push('Email');
            isValid = false;
        }
        
        if (!Validator.required(address.value)) {
            FormUI?.showError(address, 'Alamat harus diisi');
            errors.push('Alamat');
            isValid = false;
        }
    }
    
    // Notification untuk error
    if (!isValid && window.Notify) {
        window.Notify.error(
            'Form Tidak Lengkap',
            `Mohon lengkapi: ${errors.join(', ')}`
        );
    }
    
    return isValid;
}

function getOrderData() {
    const orderModal = document.getElementById('orderModal');
    const productId = parseInt(orderModal.dataset.productId);
    const product = productsData.find(p => p.id === productId);
    const options = JSON.parse(orderModal.dataset.selectedOptions || '{}');
    
    const sanitize = typeof sanitizeInput !== 'undefined' ? sanitizeInput : (s) => s;
    
    return {
        product: product.name,
        price: formatCurrency(product.price),
        name: sanitize(document.getElementById('orderName').value.trim()),
        phone: sanitize(document.getElementById('orderPhone').value.trim()),
        email: sanitize(document.getElementById('orderEmail').value.trim()),
        address: sanitize(document.getElementById('orderAddress').value.trim()),
        message: sanitize(document.getElementById('orderMessage').value.trim()),
        options: options
    };
}

function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('orderForm').reset();
}

// ===== Modal Controls =====
function initModalControls() {
    // Close buttons
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            closeModal(this.closest('.modal'));
        });
    });
    
    // Close on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                closeModal(modal);
            });
        }
    });
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form if it's order modal
    if (modal.id === 'orderModal') {
        document.getElementById('orderForm')?.reset();
    }
}

// Tambahkan di initProducts - notifikasi saat load produk
async function initProducts() {
    if (!document.getElementById('productsGrid')) {
        return;
    }
    
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '<p style="text-align: center; padding: 2rem;">Memuat produk...</p>';
    
    try {
        await loadProductsFromJSON();
        
        renderProducts();
        
        // Success notification
        if (window.Notify && productsData.length > 0) {
            window.Notify.success(
                'Produk Berhasil Dimuat',
                `${productsData.length} produk tersedia untuk Anda.`
            );
        }
        
    } catch (error) {
        console.error('Error loading products:', error);
        
        // Error notification
        if (window.Notify) {
            window.Notify.error(
                'Gagal Memuat Produk',
                'Terjadi kesalahan saat memuat data produk. Menggunakan data cadangan.',
                [
                    {
                        label: 'Muat Ulang',
                        callback: 'reloadPage'
                    }
                ]
            );
        }
    }
    
    initSearchAndFilter();
    initOrderForm();
    initModalControls();
    
    console.log('Products page initialized');
}

// ===== Auto Initialize =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProducts);
} else {
    initProducts();
}

// ===== Export for use in other modules =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadProductsFromJSON,
        renderProducts,
        formatCurrency,
        getCategoryName
    };
}
