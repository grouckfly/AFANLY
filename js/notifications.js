// ===== AFANLY Website - Notification System =====
// Author: AFANLY Team
// Description: Bell notification system with toast

'use strict';

// ===== Notification Data =====
// Only show development warning by default
let notifications = [
    {
        id: 1,
        type: 'warning',
        icon: '🚧',
        title: 'Website dalam Pengembangan',
        message: 'Website AFANLY saat ini masih dalam tahap pengembangan. Beberapa fitur mungkin belum berfungsi sempurna.',
        time: 'Baru saja',
        timestamp: Date.now(),
        read: false,
        actions: [
            {
                label: 'Mengerti',
                callback: 'dismissNotification'
            }
        ]
    }
];

// ===== Notification Manager =====
const NotificationManager = {
    bell: null,
    badge: null,
    panel: null,
    list: null,
    
    init() {
        this.bell = document.getElementById('notificationBell');
        this.badge = document.getElementById('notificationBadge');
        this.panel = document.getElementById('notificationPanel');
        this.list = document.getElementById('notificationList');
        
        if (!this.bell || !this.badge || !this.panel || !this.list) {
            console.warn('Notification elements not found');
            return;
        }
        
        // Load notifications from localStorage
        this.loadNotifications();
        
        // Setup event listeners
        this.setupEvents();
        
        // Render notifications
        this.render();
        
        // Update badge
        this.updateBadge();
        
        // Add welcome notification on first visit (only once per session)
        this.addWelcomeNotification();
        
        console.log('Notification system initialized');
    },
    
    loadNotifications() {
        const stored = localStorage.getItem('afanly-notifications');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Merge with default notifications, keep stored read status
                notifications = notifications.map(notif => {
                    const stored = parsed.find(s => s.id === notif.id);
                    return stored ? { ...notif, read: stored.read } : notif;
                });
            } catch (e) {
                console.error('Error loading notifications:', e);
            }
        }
    },
    
    saveNotifications() {
        try {
            localStorage.setItem('afanly-notifications', JSON.stringify(
                notifications.map(n => ({ id: n.id, read: n.read }))
            ));
        } catch (e) {
            console.error('Error saving notifications:', e);
        }
    },
    
    addWelcomeNotification() {
        // Only add welcome notification once per session
        if (!sessionStorage.getItem('welcomeNotificationAdded')) {
            setTimeout(() => {
                this.addNotification({
                    type: 'info',
                    icon: '📢',
                    title: 'Selamat Datang!',
                    message: 'Terima kasih telah mengunjungi website AFANLY. Jelajahi layanan dan produk IT kami.',
                    actions: [
                        {
                            label: 'Lihat Layanan',
                            callback: 'goToServices'
                        },
                        {
                            label: 'Tutup',
                            callback: 'dismissNotification'
                        }
                    ]
                });
                sessionStorage.setItem('welcomeNotificationAdded', 'true');
            }, 2000); // Delay 2 detik setelah page load
        }
    },
    
    setupEvents() {
        // Toggle panel on bell click
        const bellButton = this.bell.querySelector('.bell-button');
        bellButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePanel();
        });
        
        // Mark all as read
        const markAllBtn = document.getElementById('markAllRead');
        markAllBtn?.addEventListener('click', () => {
            this.markAllAsRead();
        });
        
        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.bell.contains(e.target)) {
                this.closePanel();
            }
        });
        
        // Prevent panel close when clicking inside
        this.panel.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    },
    
    togglePanel() {
        this.panel.classList.toggle('active');
        
        if (this.panel.classList.contains('active')) {
            // Mark notifications as viewed (but not read) when panel opens
            this.bell.classList.remove('has-new');
        }
    },
    
    closePanel() {
        this.panel.classList.remove('active');
    },
    
    render() {
        if (notifications.length === 0) {
            this.list.innerHTML = `
                <div class="notification-empty">
                    <div class="notification-empty-icon">🔔</div>
                    <p>Tidak ada notifikasi</p>
                </div>
            `;
            return;
        }
        
        // Sort by timestamp (newest first)
        const sorted = [...notifications].sort((a, b) => b.timestamp - a.timestamp);
        
        this.list.innerHTML = sorted.map(notif => `
            <div class="notification-item ${notif.read ? '' : 'unread'}" data-id="${notif.id}">
                <div class="notification-icon-wrapper">
                    <div class="notification-icon ${notif.type}">
                        ${notif.icon}
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">${notif.title}</div>
                        <div class="notification-message">${notif.message}</div>
                        <div class="notification-time">${notif.time}</div>
                        ${notif.actions ? `
                            <div class="notification-actions">
                                ${notif.actions.map(action => `
                                    <button class="btn-${action.callback === 'dismissNotification' ? 'dismiss' : 'primary-small'}" 
                                            data-action="${action.callback}" 
                                            data-id="${notif.id}">
                                        ${action.label}
                                    </button>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add click handlers to notification items
        this.list.querySelectorAll('.notification-item').forEach(item => {
            const id = parseInt(item.dataset.id);
            
            // Mark as read on click
            item.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    this.markAsRead(id);
                }
            });
        });
        
        // Add click handlers to action buttons
        this.list.querySelectorAll('button[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                const id = parseInt(btn.dataset.id);
                this.handleAction(action, id);
            });
        });
    },
    
    handleAction(action, notifId) {
        switch(action) {
            case 'dismissNotification':
                this.markAsRead(notifId);
                break;
            case 'goToServices':
                this.markAsRead(notifId);
                this.closePanel();
                // Smooth scroll to services
                const servicesSection = document.getElementById('layanan');
                if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                    window.location.href = 'index.html#layanan';
                }
                break;
            case 'contactUs':
            case 'contactDirect':
                this.markAsRead(notifId);
                this.closePanel();
                window.open('https://wa.me/6281234567890', '_blank');
                break;
            case 'retryContact':
            case 'retryWhatsApp':
                this.markAsRead(notifId);
                this.closePanel();
                const contactForm = document.getElementById('contactForm') || document.getElementById('orderForm');
                if (contactForm) {
                    const submitBtn = contactForm.querySelector('button[type="submit"]') || 
                                    document.getElementById('sendWhatsApp');
                    if (submitBtn) submitBtn.click();
                }
                break;
            case 'switchToEmail':
                this.markAsRead(notifId);
                const emailBtn = document.getElementById('sendEmail');
                if (emailBtn) emailBtn.click();
                break;
            case 'openWhatsApp':
                this.markAsRead(notifId);
                window.open('https://wa.me/6281234567890', '_blank');
                break;
            case 'copyEmail':
                this.markAsRead(notifId);
                const email = 'info@afanly.com';
                navigator.clipboard.writeText(email).then(() => {
                    this.addNotification({
                        type: 'success',
                        icon: '✅',
                        title: 'Email Tersalin',
                        message: `${email} telah disalin ke clipboard.`,
                        actions: []
                    });
                });
                break;
            case 'reloadPage':
                this.markAsRead(notifId);
                location.reload();
                break;
        }
    },
    
    markAsRead(id) {
        const notif = notifications.find(n => n.id === id);
        if (notif) {
            notif.read = true;
            this.saveNotifications();
            this.render();
            this.updateBadge();
        }
    },
    
    markAllAsRead() {
        notifications.forEach(n => n.read = true);
        this.saveNotifications();
        this.render();
        this.updateBadge();
    },
    
    updateBadge() {
        const unreadCount = notifications.filter(n => !n.read).length;
        
        if (unreadCount > 0) {
            this.badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
            this.badge.classList.remove('hidden');
            this.bell.classList.add('has-new');
        } else {
            this.badge.classList.add('hidden');
            this.bell.classList.remove('has-new');
        }
    },
    
    addNotification(notification) {
        const newNotif = {
            id: Date.now(),
            type: notification.type || 'info',
            icon: notification.icon || '📢',
            title: notification.title,
            message: notification.message,
            time: 'Baru saja',
            timestamp: Date.now(),
            read: false,
            actions: notification.actions || []
        };
        
        notifications.unshift(newNotif);
        this.saveNotifications();
        this.render();
        this.updateBadge();
        
        // Show brief animation
        this.bell.style.animation = 'none';
        setTimeout(() => {
            this.bell.style.animation = '';
        }, 10);
    }
};

// ===== Auto Initialize =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        NotificationManager.init();
    });
} else {
    NotificationManager.init();
}

// ===== Quick Notification Helpers =====
const Notify = {
    success(title, message, actions = []) {
        NotificationManager.addNotification({
            type: 'success',
            icon: '✅',
            title: title,
            message: message,
            actions: actions
        });
    },
    
    error(title, message, actions = []) {
        NotificationManager.addNotification({
            type: 'error',
            icon: '❌',
            title: title,
            message: message,
            actions: actions
        });
    },
    
    warning(title, message, actions = []) {
        NotificationManager.addNotification({
            type: 'warning',
            icon: '⚠️',
            title: title,
            message: message,
            actions: actions
        });
    },
    
    info(title, message, actions = []) {
        NotificationManager.addNotification({
            type: 'info',
            icon: 'ℹ️',
            title: title,
            message: message,
            actions: actions
        });
    }
};

// Export Notify globally
window.Notify = Notify;

// ===== Export for use in other modules =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationManager;
}
