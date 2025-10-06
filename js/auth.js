document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                this.setAttribute('aria-label', 'Hide password');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                this.setAttribute('aria-label', 'Show password');
            }
        });
    });

    // Login Form Handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                email: this.querySelector('#email').value.trim(),
                password: this.querySelector('#password').value,
                remember: this.querySelector('#remember')?.checked || false
            };
            
            // Simple validation
            if (!formData.email || !formData.password) {
                showAlert('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(formData.email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            submitButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // In a real app, you would make an API call here
                console.log('Login attempt with:', formData);
                
                // For demo purposes, redirect to dashboard on success
                showAlert('Login successful! Redirecting...', 'success');
                
                // Reset form and button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
                
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
                
            }, 1500);
        });
    }
    
    // Registration Form Handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        const passwordInput = registerForm.querySelector('#password');
        const confirmPasswordInput = registerForm.querySelector('#confirmPassword');
        
        // Password validation on input
        passwordInput.addEventListener('input', function() {
            validatePassword(this.value);
            checkPasswordMatch();
        });
        
        // Confirm password validation on input
        confirmPasswordInput.addEventListener('input', checkPasswordMatch);
        
        // Form submission
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                firstName: this.querySelector('#firstName').value.trim(),
                lastName: this.querySelector('#lastName').value.trim(),
                email: this.querySelector('#email').value.trim(),
                password: this.querySelector('#password').value,
                terms: this.querySelector('#terms').checked
            };
            
            // Validation
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
                showAlert('Please fill in all required fields', 'error');
                return;
            }
            
            if (!isValidEmail(formData.email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }
            
            if (!isPasswordValid(formData.password)) {
                showAlert('Please make sure your password meets all requirements', 'error');
                return;
            }
            
            if (formData.password !== confirmPasswordInput.value) {
                showAlert('Passwords do not match', 'error');
                return;
            }
            
            if (!formData.terms) {
                showAlert('You must accept the terms and conditions', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            submitButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // In a real app, you would make an API call here
                console.log('Registration attempt with:', {
                    ...formData,
                    password: '••••••••' // Don't log actual password
                });
                
                // For demo purposes, show success and redirect
                showAlert('Account created successfully! Redirecting to login...', 'success');
                
                // Reset form and button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
                
                // Redirect to login after a short delay
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                
            }, 2000);
        });
    }
    
    // Social Login Buttons
    const socialButtons = document.querySelectorAll('.btn-google, .btn-facebook');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('btn-google') ? 'Google' : 'Facebook';
            showAlert(`Redirecting to ${provider} login...`, 'info');
            // In a real app, you would redirect to the OAuth flow here
        });
    });
    
    // Helper Functions
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function isPasswordValid(password) {
        // At least 8 characters, 1 uppercase, 1 number, 1 special character
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(password);
    }
    
    function validatePassword(password) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        // Update UI for each requirement
        Object.keys(requirements).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (requirements[key]) {
                    element.classList.add('valid');
                } else {
                    element.classList.remove('valid');
                }
            }
        });
    }
    
    function checkPasswordMatch() {
        const password = document.getElementById('password')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;
        const matchMessage = document.getElementById('passwordMatch');
        
        if (!confirmPassword) return;
        
        if (password === confirmPassword) {
            if (password) {
                matchMessage.textContent = 'Passwords match!';
                matchMessage.className = 'validation-message valid';
            } else {
                matchMessage.textContent = '';
            }
        } else {
            matchMessage.textContent = 'Passwords do not match';
            matchMessage.className = 'validation-message invalid';
        }
    }
    
    function showAlert(message, type = 'info') {
        // Remove any existing alerts
        const existingAlert = document.querySelector('.alert-message');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert-message ${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="alert-close">&times;</button>
        `;
        
        // Add to DOM
        document.body.appendChild(alert);
        
        // Show with animation
        setTimeout(() => {
            alert.classList.add('show');
        }, 10);
        
        // Auto-remove after 5 seconds
        const removeTimeout = setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                }
            }, 300);
        }, 5000);
        
        // Close button
        const closeButton = alert.querySelector('.alert-close');
        closeButton.addEventListener('click', () => {
            clearTimeout(removeTimeout);
            alert.classList.remove('show');
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                }
            }, 300);
        });
    }
    
    // Add styles for alerts if not already present
    if (!document.getElementById('alert-styles')) {
        const style = document.createElement('style');
        style.id = 'alert-styles';
        style.textContent = `
            .alert-message {
                position: fixed;
                top: 20px;
                right: 20px;
                max-width: 400px;
                padding: 15px 20px;
                border-radius: 8px;
                background: white;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                justify-content: space-between;
                z-index: 1000;
                transform: translateX(120%);
                transition: transform 0.3s ease-in-out;
                border-left: 4px solid #4a6bff;
            }
            
            .alert-message.show {
                transform: translateX(0);
            }
            
            .alert-message.error {
                border-left-color: #dc3545;
            }
            
            .alert-message.success {
                border-left-color: #28a745;
            }
            
            .alert-message.info {
                border-left-color: #17a2b8;
            }
            
            .alert-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .alert-message i {
                font-size: 1.2rem;
            }
            
            .alert-message.error i {
                color: #dc3545;
            }
            
            .alert-message.success i {
                color: #28a745;
            }
            
            .alert-message.info i {
                color: #17a2b8;
            }
            
            .alert-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6c757d;
                line-height: 1;
                padding: 0 0 0 15px;
                transition: color 0.2s;
            }
            
            .alert-close:hover {
                color: #343a40;
            }
        `;
        document.head.appendChild(style);
    }
});
