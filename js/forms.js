// ===== AFANLY Website - Form Handling with Contact Method Modal =====
// Author: AFANLY Team
// Description: Form validation and submission handlers with dual sending options
// Last Updated: 11 November 2025

'use strict';

// ===== Configuration =====
const CONFIG = {
    whatsappNumber: '628127659073', // Ganti dengan nomor WhatsApp Anda
    emailAddress: 'defry.pku@gmail.com'   // Ganti dengan email Anda
};

// ===== Validation Functions =====
const Validator = {
    email(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    },
    
    phone(phone) {
        const cleaned = phone.replace(/[\s\-]/g, '');
        const re = /^[0-9]{10,13}$/;
        return re.test(cleaned);
    },
    
    required(value) {
        return value.trim() !== '';
    }
};

// ===== Form UI Functions =====
const FormUI = {
    showError(input, message) {
        const formGroup = input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');
        
        input.classList.add('error');
        if (errorMessage) {
            errorMessage.textContent = message;
        }
    },
    
    clearError(input) {
        const formGroup = input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');
        
        input.classList.remove('error');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
    },
    
    clearAllErrors(form) {
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => this.clearError(input));
    },
    
    showSuccess(form) {
        const successDiv = form.parentElement.querySelector('.form-success');
        if (successDiv) {
            form.style.display = 'none';
            successDiv.style.display = 'block';
            
            setTimeout(() => {
                form.style.display = 'block';
                successDiv.style.display = 'none';
                form.reset();
            }, 3000);
        }
    }
};

// ===== Sanitize Input =====
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// ===== Contact Form Handler with Modal =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('contactName');
        const phone = document.getElementById('contactPhone');
        const email = document.getElementById('contactEmail');
        const message = document.getElementById('contactMessage');
        
        // Clear previous errors
        FormUI.clearAllErrors(contactForm);
        
        let isValid = true;
        let errorCount = 0;
        
        // Validate name
        if (!Validator.required(name.value)) {
            FormUI.showError(name, 'Nama harus diisi');
            isValid = false;
            errorCount++;
        }
        
        // Validate phone
        if (!Validator.phone(phone.value)) {
            FormUI.showError(phone, 'Nomor telepon tidak valid (10-13 digit)');
            isValid = false;
            errorCount++;
        }
        
        // Validate email
        if (!Validator.email(email.value)) {
            FormUI.showError(email, 'Email tidak valid');
            isValid = false;
            errorCount++;
        }
        
        // Validate message
        if (!Validator.required(message.value)) {
            FormUI.showError(message, 'Deskripsi pesan harus diisi');
            isValid = false;
            errorCount++;
        }
        
        if (!isValid) {
            // Show error notification
            if (window.Notify) {
                window.Notify.error(
                    'Form Tidak Valid',
                    `Terdapat ${errorCount} kesalahan pada form. Mohon periksa kembali.`
                );
            }
            return;
        }
        
        // If valid, show contact method modal
        showContactMethodModal();
    });
    
    // Setup modal buttons
    setupContactMethodModal();
}

// ===== Show Contact Method Modal =====
function showContactMethodModal() {
    const modal = document.getElementById('contactMethodModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// ===== Setup Contact Method Modal =====
function setupContactMethodModal() {
    const modal = document.getElementById('contactMethodModal');
    const closeBtn = modal?.querySelector('.modal-close');
    const whatsappBtn = document.getElementById('sendViaWhatsApp');
    const emailBtn = document.getElementById('sendViaEmail');
    
    if (!modal) return;
    
    // Close modal
    closeBtn?.addEventListener('click', () => {
        closeContactMethodModal();
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeContactMethodModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeContactMethodModal();
        }
    });
    
    // WhatsApp button
    whatsappBtn?.addEventListener('click', () => {
        const formData = getContactFormData();
        
        try {
            sendContactToWhatsApp(formData);
            
            // Close modal
            closeContactMethodModal();
            
            // Show success
            const contactForm = document.getElementById('contactForm');
            FormUI.showSuccess(contactForm);
            
            // Success notification
            if (window.Notify) {
                window.Notify.success(
                    'Mengarahkan ke WhatsApp',
                    'Anda akan diarahkan ke WhatsApp untuk mengirim pesan.',
                    [
                        {
                            label: 'OK',
                            callback: 'dismissNotification'
                        }
                    ]
                );
            }
        } catch (error) {
            console.error('Error sending contact:', error);
            
            if (window.Notify) {
                window.Notify.error(
                    'Gagal Membuka WhatsApp',
                    'Browser memblokir popup. Silakan izinkan popup atau coba gunakan Email.',
                    [
                        {
                            label: 'Coba Lagi',
                            callback: 'retryContact'
                        },
                        {
                            label: 'Gunakan Email',
                            callback: 'switchToEmail'
                        }
                    ]
                );
            }
        }
    });
    
    // Email button
    emailBtn?.addEventListener('click', () => {
        const formData = getContactFormData();
        
        try {
            sendContactToEmail(formData);
            
            // Close modal
            closeContactMethodModal();
            
            // Show success
            const contactForm = document.getElementById('contactForm');
            FormUI.showSuccess(contactForm);
            
            // Success notification
            if (window.Notify) {
                window.Notify.success(
                    'Email Client Dibuka',
                    'Silakan kirim email dari aplikasi email Anda.',
                    [
                        {
                            label: 'OK',
                            callback: 'dismissNotification'
                        }
                    ]
                );
            }
        } catch (error) {
            console.error('Error sending email:', error);
            
            if (window.Notify) {
                window.Notify.error(
                    'Gagal Membuka Email',
                    'Tidak dapat membuka email client. Silakan hubungi kami langsung.',
                    [
                        {
                            label: 'Hubungi Langsung',
                            callback: 'contactDirect'
                        }
                    ]
                );
            }
        }
    });
}

// ===== Close Contact Method Modal =====
function closeContactMethodModal() {
    const modal = document.getElementById('contactMethodModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== Get Contact Form Data =====
function getContactFormData() {
    return {
        name: sanitizeInput(document.getElementById('contactName').value.trim()),
        phone: sanitizeInput(document.getElementById('contactPhone').value.trim()),
        email: sanitizeInput(document.getElementById('contactEmail').value.trim()),
        message: sanitizeInput(document.getElementById('contactMessage').value.trim())
    };
}

// ===== Send Contact to WhatsApp =====
function sendContactToWhatsApp(data) {
    const message = 
        `Pesan Baru dari Website AFANLY\n\n` +
        `Nama: ${data.name}\n` +
        `No. Telp: ${data.phone}\n` +
        `Email: ${data.email}\n\n` +
        `Pesan:\n${data.message}`;
    
    const whatsappURL = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    const newWindow = window.open(whatsappURL, '_blank', 'noopener,noreferrer');
    
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        throw new Error('Popup blocked');
    }
}

// ===== Send Contact to Email =====
function sendContactToEmail(data) {
    let body = 
        `Nama: ${data.name}\n` +
        `No. Telp: ${data.phone}\n` +
        `Email: ${data.email}\n\n` +
        `Pesan:\n${data.message}`;
    
    const subject = `Pesan dari ${data.name} - AFANLY Website`;
    const mailtoURL = `mailto:${CONFIG.emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoURL;
}

// ===== Send Order to WhatsApp =====
function sendOrderToWhatsApp(data) {
    let message = 
        `Pesanan Baru dari Website AFANLY\n\n` +
        `Produk: ${data.product}\n` +
        `Harga: ${data.price}\n\n`;
    
    if (data.options && Object.keys(data.options).length > 0) {
        message += `Pilihan:\n`;
        Object.entries(data.options).forEach(([key, value]) => {
            message += `- ${key}: ${value}\n`;
        });
        message += `\n`;
    }
    
    message +=
        `Data Pembeli:\n` +
        `Nama: ${data.name}\n` +
        `No. Telp: ${data.phone}\n` +
        `Email: ${data.email}\n` +
        `Alamat: ${data.address}\n`;
    
    if (data.message) {
        message += `\n📝 *Catatan:*\n${data.message}`;
    }
    
    const whatsappURL = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    try {
        const newWindow = window.open(whatsappURL, '_blank', 'noopener,noreferrer');
        
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            throw new Error('Popup blocked');
        }
        
        if (window.Notify) {
            window.Notify.success(
                'Pesanan Berhasil Dibuat!',
                'Anda akan diarahkan ke WhatsApp untuk menyelesaikan pesanan.',
                [
                    {
                        label: 'OK',
                        callback: 'dismissNotification'
                    }
                ]
            );
        }
    } catch (error) {
        if (window.Notify) {
            window.Notify.error(
                'Gagal Membuka WhatsApp',
                'Browser memblokir popup. Izinkan popup atau gunakan opsi Email.',
                [
                    {
                        label: 'Coba Lagi',
                        callback: 'retryWhatsApp'
                    },
                    {
                        label: 'Kirim via Email',
                        callback: 'switchToEmail'
                    }
                ]
            );
        }
        throw error;
    }
}

// ===== Send Order to Email =====
function sendOrderToEmail(data) {
    let body = 
        `Pesanan Baru dari Website AFANLY\n\n` +
        `Produk: ${data.product}\n` +
        `Harga: ${data.price}\n\n`;
    
    if (data.options && Object.keys(data.options).length > 0) {
        body += `Pilihan:\n`;
        Object.entries(data.options).forEach(([key, value]) => {
            body += `- ${key}: ${value}\n`;
        });
        body += `\n`;
    }
    
    body +=
        `Data Pembeli:\n` +
        `Nama: ${data.name}\n` +
        `No. Telp: ${data.phone}\n` +
        `Email: ${data.email}\n` +
        `Alamat: ${data.address}\n`;
    
    if (data.message) {
        body += `\nCatatan:\n${data.message}`;
    }
    
    const subject = `Pesanan: ${data.product}`;
    const mailtoURL = `mailto:${CONFIG.emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
        window.location.href = mailtoURL;
        
        if (window.Notify) {
            window.Notify.success(
                'Email Client Dibuka',
                'Silakan kirim email dari aplikasi email Anda.',
                [
                    {
                        label: 'OK',
                        callback: 'dismissNotification'
                    }
                ]
            );
        }
    } catch (error) {
        if (window.Notify) {
            window.Notify.error(
                'Gagal Membuka Email',
                'Tidak dapat membuka email client. Silakan hubungi kami langsung.',
                [
                    {
                        label: 'Salin Email',
                        callback: 'copyEmail'
                    }
                ]
            );
        }
        throw error;
    }
}

// ===== Initialize Forms =====
function initForms() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initForms);
        return;
    }
    
    initContactForm();
    
    console.log('Forms initialized with contact method modal');
}

// Start initialization
initForms();

// ===== Export for use in other modules =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Validator,
        FormUI,
        sendOrderToWhatsApp,
        sendOrderToEmail,
        sendContactToWhatsApp,
        sendContactToEmail,
        sanitizeInput
    };
}
