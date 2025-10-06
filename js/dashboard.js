document.addEventListener('DOMContentLoaded', function() {
    // Toggle sidebar on mobile
    const toggleSidebar = document.querySelector('.toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            document.body.classList.toggle('sidebar-open');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992 && !sidebar.contains(e.target) && !e.target.closest('.toggle-sidebar')) {
            sidebar.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        }
    });
    
    // Handle window resize
    function handleResize() {
        if (window.innerWidth > 992) {
            sidebar.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // Toggle user dropdown
    const userDropdown = document.querySelector('.user-dropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (userDropdown) {
        const userAvatar = userDropdown.querySelector('.user-avatar');
        
        userAvatar.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            dropdownMenu.classList.remove('show');
        });
        
        // Prevent dropdown from closing when clicking inside
        dropdownMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Handle logout buttons
    const logoutButtons = document.querySelectorAll('#logoutBtn, #dropdownLogoutBtn');
    
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show confirmation dialog
            if (confirm('Are you sure you want to log out?')) {
                // In a real app, you would make an API call to log the user out
                console.log('User logged out');
                
                // Redirect to login page
                window.location.href = 'login.html';
            }
        });
    });
    
    // Handle like buttons
    const likeButtons = document.querySelectorAll('.like-btn');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            
            if (this.classList.contains('active')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                showToast('Added to favorites!', 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                showToast('Removed from favorites', 'info');
            }
            
            // In a real app, you would make an API call to save the favorite
        });
    });
    
    // Handle notification button
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            // In a real app, you would show a dropdown with notifications
            showToast('No new notifications', 'info');
            
            // Mark notifications as read
            const badge = this.querySelector('.badge');
            if (badge) {
                badge.style.display = 'none';
            }
        });
    }
    
    // Show welcome message on first visit
    if (!localStorage.getItem('welcomeShown')) {
        setTimeout(() => {
            showToast('Welcome to your dashboard!', 'success');
            localStorage.setItem('welcomeShown', 'true');
        }, 1000);
    }
    
    // Helper function to show toast messages
    function showToast(message, type = 'info') {
        // Create toast element if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
            
            // Add styles for toast
            const style = document.createElement('style');
            style.textContent = `
                .toast-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1100;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                
                .toast {
                    background: white;
                    border-radius: 8px;
                    padding: 12px 20px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    display: flex;
                    align-items: center;
                    min-width: 250px;
                    transform: translateX(120%);
                    animation: slideIn 0.3s forwards;
                    position: relative;
                    overflow: hidden;
                }
                
                .toast::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 4px;
                }
                
                .toast.success::before {
                    background-color: #48bb78;
                }
                
                .toast.error::before {
                    background-color: #f56565;
                }
                
                .toast.info::before {
                    background-color: #4299e1;
                }
                
                .toast.warning::before {
                    background-color: #ed8936;
                }
                
                .toast i {
                    margin-right: 10px;
                    font-size: 1.2rem;
                }
                
                .toast.success i {
                    color: #48bb78;
                }
                
                .toast.error i {
                    color: #f56565;
                }
                
                .toast.info i {
                    color: #4299e1;
                }
                
                .toast.warning i {
                    color: #ed8936;
                }
                
                @keyframes slideIn {
                    to {
                        transform: translateX(0);
                    }
                }
                
                @keyframes slideOut {
                    to {
                        transform: translateX(120%);
                        opacity: 0;
                    }
                }
                
                .toast.slide-out {
                    animation: slideOut 0.3s forwards;
                }
            `;
            document.head.appendChild(style);
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let iconClass = 'info-circle';
        if (type === 'success') iconClass = 'check-circle';
        else if (type === 'error') iconClass = 'exclamation-circle';
        else if (type === 'warning') iconClass = 'exclamation-triangle';
        
        toast.innerHTML = `
            <i class="fas fa-${iconClass}"></i>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Remove toast after delay
        setTimeout(() => {
            toast.classList.add('slide-out');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    // Initialize tooltips
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[title]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
        });
        
        function showTooltip(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('title');
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            // Position tooltip above the element
            tooltip.style.top = `${window.scrollY + rect.top - tooltipRect.height - 10}px`;
            tooltip.style.left = `${window.scrollX + rect.left + (rect.width - tooltipRect.width) / 2}px`;
            
            // Add arrow
            const arrow = document.createElement('div');
            arrow.className = 'tooltip-arrow';
            tooltip.appendChild(arrow);
            
            this._tooltip = tooltip;
        }
        
        function hideTooltip() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        }
        
        // Add styles for tooltip
        if (!document.getElementById('tooltip-styles')) {
            const style = document.createElement('style');
            style.id = 'tooltip-styles';
            style.textContent = `
                .tooltip {
                    position: absolute;
                    background: #2d3748;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    z-index: 1000;
                    pointer-events: none;
                    white-space: nowrap;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    animation: fadeIn 0.15s ease-out;
                }
                
                .tooltip-arrow {
                    position: absolute;
                    width: 0;
                    height: 0;
                    border-left: 6px solid transparent;
                    border-right: 6px solid transparent;
                    border-top: 6px solid #2d3748;
                    bottom: -6px;
                    left: 50%;
                    transform: translateX(-50%);
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Initialize tooltips after a short delay to ensure all elements are loaded
    setTimeout(initTooltips, 500);
    
    // Handle search functionality
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchInput) {
        // Add debounce to search input
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            
            const searchTerm = this.value.trim();
            
            if (searchTerm.length > 0) {
                searchTimeout = setTimeout(() => {
                    // In a real app, you would make an API call to search
                    console.log('Searching for:', searchTerm);
                }, 500);
            }
        });
    }
    
    // Handle responsive tables (if any)
    function makeTablesResponsive() {
        const tables = document.querySelectorAll('table');
        
        tables.forEach(table => {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });
        
        // Add styles for responsive tables
        if (!document.getElementById('table-styles')) {
            const style = document.createElement('style');
            style.id = 'table-styles';
            style.textContent = `
                .table-responsive {
                    width: 100%;
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                    margin: 15px 0;
                }
                
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 0;
                }
                
                th, td {
                    padding: 12px 15px;
                    text-align: left;
                    border-bottom: 1px solid #e2e8f0;
                }
                
                th {
                    background-color: #f8fafc;
                    font-weight: 600;
                    color: #4a5568;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    letter-spacing: 0.5px;
                }
                
                tr:hover {
                    background-color: #f8fafc;
                }
                
                @media (max-width: 768px) {
                    th, td {
                        padding: 8px 10px;
                        font-size: 0.9rem;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Call the function to make tables responsive
    makeTablesResponsive();
    
    // Handle form submissions
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Prevent default form submission for demo purposes
            e.preventDefault();
            
            // In a real app, you would handle form submission with AJAX
            console.log('Form submitted:', this);
            
            // Show success message
            showToast('Form submitted successfully!', 'success');
            
            // Reset form
            this.reset();
        });
    });
    
    // Handle click events on cards and other interactive elements
    const cards = document.querySelectorAll('.card, .roommate-card, .match-card');
    
    cards.forEach(card => {
        // Skip if the card already has a click handler or contains interactive elements
        if (card.hasAttribute('data-click-handler') || card.querySelector('a, button, [role="button"]')) {
            return;
        }
        
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', function() {
            // In a real app, you would navigate to the appropriate page
            console.log('Card clicked:', this);
            
            // For demo purposes, show a toast
            const title = this.querySelector('h3, h4')?.textContent || 'Item';
            showToast(`Opening details for ${title}`, 'info');
        });
        
        // Add visual feedback on hover
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        });
    });
    
    // Handle loading states for buttons
    const buttons = document.querySelectorAll('button[type="submit"], .btn[type="button"]');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Skip if already in loading state
            if (this.classList.contains('loading')) return;
            
            // For demo purposes, add a loading state to buttons that don't have a specific action
            if (!this.closest('form') && !this.getAttribute('href')) {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                this.classList.add('loading');
                
                // Reset after delay for demo purposes
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.classList.remove('loading');
                }, 1500);
            }
        });
    });
    
    // Initialize any charts if Chart.js is included
    if (typeof Chart !== 'undefined') {
        initCharts();
    }
    
    function initCharts() {
        // Example chart initialization
        const ctx = document.getElementById('statsChart');
        
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                    datasets: [{
                        label: 'Matches',
                        data: [12, 19, 3, 5, 2, 3, 8],
                        borderColor: '#4a6bff',
                        backgroundColor: 'rgba(74, 107, 255, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                display: true,
                                drawBorder: false
                            },
                            ticks: {
                                stepSize: 5
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }
    }
    
    // Handle dark mode toggle if implemented
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            // Save preference to localStorage
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
                showToast('Dark mode enabled', 'info');
            } else {
                localStorage.setItem('darkMode', 'disabled');
                showToast('Light mode enabled', 'info');
            }
        });
        
        // Check for saved user preference
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
        }
    }
    
    // Add animation to elements when they come into view
    function animateOnScroll() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate');
            }
        });
    }
    
    // Run once on page load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Add styles for animations if not already present
    if (!document.getElementById('animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease-out, transform 0.6s ease-out;
            }
            
            .animate-on-scroll.animate {
                opacity: 1;
                transform: translateY(0);
            }
            
            /* Add delay for staggered animations */
            .animate-on-scroll.delay-1 { transition-delay: 0.1s; }
            .animate-on-scroll.delay-2 { transition-delay: 0.2s; }
            .animate-on-scroll.delay-3 { transition-delay: 0.3s; }
            .animate-on-scroll.delay-4 { transition-delay: 0.4s; }
            .animate-on-scroll.delay-5 { transition-delay: 0.5s; }
        `;
        document.head.appendChild(style);
    }
    
    // Handle click events on navigation links to add active class
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // On mobile, close the sidebar after clicking a link
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('active');
                document.body.classList.remove('sidebar-open');
            }
        });
    });
    
    // Set active link based on current URL
    function setActiveLink() {
        const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            
            if (linkHref === currentPath || 
                (currentPath === '' && linkHref === 'dashboard.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Call the function to set active link
    setActiveLink();
    
    // Handle back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopButton);
    
    // Show/hide back to top button on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add styles for back to top button if not already present
    if (!document.getElementById('back-to-top-styles')) {
        const style = document.createElement('style');
        style.id = 'back-to-top-styles';
        style.textContent = `
            .back-to-top {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: var(--primary-color);
                color: white;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px);
                transition: all 0.3s ease;
                z-index: 999;
            }
            
            .back-to-top.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .back-to-top:hover {
                background-color: #3a56d4;
                transform: translateY(-3px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            }
            
            @media (max-width: 768px) {
                .back-to-top {
                    width: 45px;
                    height: 45px;
                    font-size: 1.1rem;
                    bottom: 20px;
                    right: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }
});
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
        // Toggle notification dropdown
        if (this.notificationBtn) {
            this.notificationBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown();
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.notificationDropdown.contains(e.target) && e.target !== this.notificationBtn) {
                this.notificationDropdown.classList.remove('active');
            }
        });
    }
    
    toggleDropdown() {
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
                if (!notification.read) {
                    notification.read = true;
                }
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
            if (!this.notifications[index].read) {
                this.unreadCount--;
            }
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
        if (this.notificationBadge) {
            if (this.unreadCount > 0) {
                this.notificationBadge.textContent = this.unreadCount > 9 ? '9+' : this.unreadCount;
                this.notificationBadge.style.display = 'flex';
            } else {
                this.notificationBadge.style.display = 'none';
            }
        }
    }
    
    renderNotifications() {
        const dropdownContent = this.notificationDropdown.querySelector('.notification-dropdown-content');
        
        if (this.notifications.length === 0) {
            dropdownContent.innerHTML = `
                <div class="notification-empty">
                    <i class="far fa-bell-slash"></i>
                    <p>No notifications yet</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="notification-header">
                <h4>Notifications</h4>
                <button class="btn-clear" id="clear-notifications">Clear all</button>
            </div>
            <div class="notification-list">
        `;
        
        this.notifications.forEach(notification => {
            const timeAgo = this.getTimeAgo(notification.timestamp);
            html += `
                <div class="notification-item ${notification.type} ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
                    <div class="notification-icon">
                        <i class="${notification.icon}"></i>
                    </div>
                    <div class="notification-content">
                        <h5>${notification.title}</h5>
                        <p>${notification.message}</p>
                        <span class="notification-time">${timeAgo}</span>
                    </div>
                    <button class="btn-delete" data-id="${notification.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        });
        
        html += '</div>';
        dropdownContent.innerHTML = html;
        
        // Add event listeners
        document.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.btn-delete')) {
                    const notificationId = parseInt(item.dataset.id);
                    this.markAsRead(notificationId);
                    // In a real app, you might navigate to a specific page
                    this.showToast({
                        title: 'Notification',
                        message: 'Opening notification...',
                        type: 'info'
                    });
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
                <h5>${notification.title}</h5>
                <p>${notification.message}</p>
            </div>
            <button class="toast-close">&times;</button>
        `;
        
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
        
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return interval + 'y ago';
        
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return interval + 'mo ago';
        
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return interval + 'd ago';
        
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return interval + 'h ago';
        
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return interval + 'm ago';
        
        return 'Just now';
    }
    
    updateStorage() {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }
}

// Initialize notification system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const notificationSystem = new NotificationSystem();
    
    // Example: Add a welcome notification if there are no notifications
    if (notificationSystem.notifications.length === 0) {
        notificationSystem.addNotification({
            title: 'Welcome to Roomus!',
            message: 'Start by completing your profile to get better matches.',
            type: 'info'
        });
    }
    
    // Example: You can add notifications from other parts of your app like this:
    // notificationSystem.addNotification({
    //     title: 'New Match!',
    //     message: 'You have a new potential roommate match!',
    //     type: 'match'
    // });
});
