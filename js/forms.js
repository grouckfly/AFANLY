// ===== AFANLY Website - Form Handling with Notifications =====
// Author: AFANLY Team
// Description: Form validation and submission handlers with notifications

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
        
        // Show notification for validation error
        if (window.Notify) {
            window.Notify.warning('Validasi Gagal', message);
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

// ===== Contact Form Handler =====
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
        
        // Sanitize inputs
        const formData = {
            name: sanitizeInput(name.value.trim()),
            phone: sanitizeInput(phone.value.trim()),
            email: sanitizeInput(email.value.trim()),
            message: sanitizeInput(message.value.trim())
        };
        
        try {
            // Send to WhatsApp
            sendContactToWhatsApp(formData);
            
            // Show success message
            FormUI.showSuccess(contactForm);
            
            // Success notification
            if (window.Notify) {
                window.Notify.success(
                    'Pesan Berhasil Dikirim!',
                    'Terima kasih telah menghubungi kami. Anda akan diarahkan ke WhatsApp.',
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
            
            // Error notification
            if (window.Notify) {
                window.Notify.error(
                    'Gagal Mengirim Pesan',
                    'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi atau hubungi kami langsung.',
                    [
                        {
                            label: 'Coba Lagi',
                            callback: 'retryContact'
                        },
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

// ===== Send Contact to WhatsApp =====
function sendContactToWhatsApp(data) {
    const message = 
        `Pesan Baru dari Website AFANLY\n\n` +
        `Nama: ${data.name}\n` +
        `No. Telp: ${data.phone}\n` +
        `Email: ${data.email}\n` +
        `Pesan: ${data.message}`;
    
    const whatsappURL = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Check if popup blocker might prevent opening
    const newWindow = window.open(whatsappURL, '_blank', 'noopener,noreferrer');
    
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Popup blocked
        if (window.Notify) {
            window.Notify.warning(
                'Popup Diblokir',
                'Browser Anda memblokir popup. Silakan izinkan popup atau klik tombol di bawah.',
                [
                    {
                        label: 'Buka WhatsApp',
                        callback: 'openWhatsApp'
                    }
                ]
            );
        }
        throw new Error('Popup blocked');
    }
}

// ===== Send Order to WhatsApp =====
function sendOrderToWhatsApp(data) {
    let message = 
        `*Pesanan Baru dari Website AFANLY*\n\n` +
        `🛒 *Produk:* ${data.product}\n` +
        `💰 *Harga:* ${data.price}\n\n`;
    
    if (data.options && Object.keys(data.options).length > 0) {
        message += `*⚙️ Pilihan:*\n`;
        Object.entries(data.options).forEach(([key, value]) => {
            message += `- ${key}: ${value}\n`;
        });
        message += `\n`;
    }
    
    message +=
        `👤 *Data Pembeli:*\n` +
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
        
        // Success notification
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
    
    console.log('Forms initialized with notifications');
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
        sanitizeInput
    };
}
