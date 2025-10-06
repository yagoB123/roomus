// Notification System
class NotificationSystem {
    constructor() {
        this.notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        this.notificationBtn = document.querySelector('.notification-btn');
        this.notificationBadge = document.querySelector('.notification-badge');
        this.notificationDropdown = document.querySelector('.notification-dropdown');
        this.unreadCount = this.notifications.filter(n => !n.read).length;
        
        this.init();
    }
    
    init() {
        this.updateBadge();
        this.setupEventListeners();
        this.renderNotifications();
    }
    
    setupEventListeners() {
        if (this.notificationBtn) {
            this.notificationBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown();
            });
        }
        
        document.addEventListener('click', (e) => {
            if (this.notificationDropdown && !this.notificationDropdown.contains(e.target) && 
                e.target !== this.notificationBtn && !this.notificationBtn.contains(e.target)) {
                this.notificationDropdown.classList.remove('active');
            }
        });
    }
    
    toggleDropdown() {
        if (!this.notificationDropdown) return;
        
        this.notificationDropdown.classList.toggle('active');
        if (this.notificationDropdown.classList.contains('active')) {
            this.markAllAsRead();
        }
    }
    
    addNotification(notification) {
        const newNotification = {
            id: Date.now(),
            title: notification.title || 'New Notification',
            message: notification.message || '',
            type: notification.type || 'info',
            read: false,
            timestamp: new Date(),
            icon: this.getNotificationIcon(notification.type)
        };
        
        this.notifications.unshift(newNotification);
        this.unreadCount++;
        this.updateStorage();
        this.renderNotifications();
        this.showToast(notification);
    }
    
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification && !notification.read) {
            notification.read = true;
            this.unreadCount--;
            this.updateStorage();
            this.updateBadge();
            this.renderNotifications();
        }
    }
    
    markAllAsRead() {
        if (this.unreadCount > 0) {
            this.notifications.forEach(notification => {
                if (!notification.read) notification.read = true;
            });
            this.unreadCount = 0;
            this.updateStorage();
            this.updateBadge();
            this.renderNotifications();
        }
    }
    
    deleteNotification(notificationId) {
        const index = this.notifications.findIndex(n => n.id === notificationId);
        if (index !== -1) {
            if (!this.notifications[index].read) this.unreadCount--;
            this.notifications.splice(index, 1);
            this.updateStorage();
            this.renderNotifications();
        }
    }
    
    clearAllNotifications() {
        this.notifications = [];
        this.unreadCount = 0;
        this.updateStorage();
        this.renderNotifications();
    }
    
    updateBadge() {
        if (!this.notificationBadge) return;
        
        if (this.unreadCount > 0) {
            this.notificationBadge.textContent = this.unreadCount > 9 ? '9+' : this.unreadCount;
            this.notificationBadge.style.display = 'flex';
        } else {
            this.notificationBadge.style.display = 'none';
        }
    }
    
    renderNotifications() {
        if (!this.notificationDropdown) return;
        
        const dropdownContent = this.notificationDropdown.querySelector('.notification-dropdown-content');
        if (!dropdownContent) return;
        
        if (this.notifications.length === 0) {
            dropdownContent.innerHTML = `
                <div class="notification-empty">
                    <i class="far fa-bell-slash"></i>
                    <p>No notifications yet</p>
                </div>`;
            return;
        }
        
        let html = `
            <div class="notification-header">
                <h4>Notifications</h4>
                <button class="btn-clear" id="clear-notifications">Clear all</button>
            </div>
            <div class="notification-list">`;
        
        this.notifications.slice(0, 10).forEach(notification => {
            const timeAgo = this.getTimeAgo(notification.timestamp);
            html += `
                <div class="notification-item ${notification.type} ${notification.read ? 'read' : 'unread'}" 
                     data-id="${notification.id}">
                    <div class="notification-icon">
                        <i class="${notification.icon}"></i>
                    </div>
                    <div class="notification-content">
                        <h5>${this.escapeHtml(notification.title)}</h5>
                        <p>${this.escapeHtml(notification.message)}</p>
                        <span class="notification-time">${timeAgo}</span>
                    </div>
                    <button class="btn-delete" data-id="${notification.id}" aria-label="Delete notification">
                        <i class="fas fa-times"></i>
                    </button>
                </div>`;
        });
        
        html += '</div>';
        dropdownContent.innerHTML = html;
        
        // Add event listeners
        document.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.btn-delete')) {
                    const notificationId = parseInt(item.dataset.id);
                    this.markAsRead(notificationId);
                }
            });
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const notificationId = parseInt(btn.dataset.id);
                this.deleteNotification(notificationId);
            });
        });
        
        const clearBtn = document.getElementById('clear-notifications');
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clearAllNotifications();
            });
        }
    }
    
    showToast(notification) {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${notification.type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${this.getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="toast-content">
                <h5>${this.escapeHtml(notification.title)}</h5>
                <p>${this.escapeHtml(notification.message)}</p>
            </div>
            <button class="toast-close" aria-label="Close notification">&times;</button>`;
        
        document.body.appendChild(toast);
        
        // Auto remove toast after 5 seconds
        const timer = setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
        
        // Close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(timer);
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
        });
        
        // Show the toast
        setTimeout(() => toast.classList.add('show'), 10);
    }
    
    getNotificationIcon(type) {
        const icons = {
            'success': 'fas fa-check-circle',
            'error': 'fas fa-exclamation-circle',
            'warning': 'fas fa-exclamation-triangle',
            'info': 'fas fa-info-circle',
            'message': 'fas fa-envelope',
            'match': 'fas fa-heart',
            'default': 'fas fa-bell'
        };
        return icons[type] || icons['default'];
    }
    
    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        
        const intervals = {
            year: 31536000,
            month: 2592000,
            day: 86400,
            hour: 3600,
            minute: 60
        };
        
        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval}${unit[0]} ago`;
            }
        }
        
        return 'Just now';
    }
    
    escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    
    updateStorage() {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }
}

// Initialize notification system when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.notificationSystem = new NotificationSystem();
    });
} else {
    window.notificationSystem = new NotificationSystem();
}

// Example usage:
// notificationSystem.addNotification({
//     title: 'New Message',
//     message: 'You have a new message from John',
//     type: 'message'
// });
