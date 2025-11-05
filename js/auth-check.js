// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    // Skip auth check on login and register pages
    if (window.location.pathname.includes('login.html') || 
        window.location.pathname.includes('register.html') ||
        window.location.pathname.includes('index.html')) {
        return;
    }

    // Check if user is authenticated
    const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
    // If no user email or session, redirect to login
    if (!userEmail || (!rememberMe && !sessionStorage.getItem('userSession'))) {
        // Store current URL to redirect back after login
        if (!window.location.pathname.includes('login.html')) {
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
        }
        window.location.href = 'login.html';
    }
});
