// API Configuration
const API_BASE_URL = 'http://localhost:3000/api/v1';

// Register Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const registerBtn = document.getElementById('registerBtn');
    const registerMessage = document.getElementById('registerMessage');

    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validate passwords match
            if (password !== confirmPassword) {
                showMessage('Passwords do not match!', 'error');
                return;
            }

            // Validate password length
            if (password.length < 6) {
                showMessage('Password must be at least 6 characters long!', 'error');
                return;
            }

            // Disable button during request
            registerBtn.disabled = true;
            registerBtn.textContent = 'Creating Account...';
            hideMessage();

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        email,
                        password
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Store token
                    localStorage.setItem('authToken', data.data.token);
                    localStorage.setItem('user', JSON.stringify(data.data.user));

                    showMessage('Registration successful! Redirecting...', 'success');
                    
                    // Redirect to home page or dashboard
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    showMessage(data.message || 'Registration failed. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Registration error:', error);
                showMessage('Network error. Please check if the server is running.', 'error');
            } finally {
                registerBtn.disabled = false;
                registerBtn.textContent = 'Register';
            }
        });
    }

    function showMessage(message, type) {
        registerMessage.textContent = message;
        registerMessage.className = `alert alert-${type}`;
        registerMessage.style.display = 'block';
        registerMessage.style.padding = '10px';
        registerMessage.style.borderRadius = '5px';
        registerMessage.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
        registerMessage.style.color = type === 'success' ? '#155724' : '#721c24';
        registerMessage.style.border = `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`;
    }

    function hideMessage() {
        registerMessage.style.display = 'none';
    }
});

// Check if user is already logged in
function checkAuthStatus() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (token && user) {
        return {
            isAuthenticated: true,
            token: token,
            user: JSON.parse(user)
        };
    }
    
    return {
        isAuthenticated: false
    };
}
