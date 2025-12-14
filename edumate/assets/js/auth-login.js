// API Configuration
const API_BASE_URL = 'http://localhost:3000/api/v1';

// Login Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const loginMessage = document.getElementById('loginMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const remember = document.getElementById('remember').checked;

            // Disable button during request
            loginBtn.disabled = true;
            loginBtn.textContent = 'Logging in...';
            hideMessage();

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Store token
                    if (remember) {
                        localStorage.setItem('authToken', data.data.token);
                        localStorage.setItem('user', JSON.stringify(data.data.user));
                    } else {
                        sessionStorage.setItem('authToken', data.data.token);
                        sessionStorage.setItem('user', JSON.stringify(data.data.user));
                    }

                    showMessage('Login successful! Redirecting...', 'success');
                    
                    // Redirect to dashboard or home page
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    showMessage(data.message || 'Login failed. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                showMessage('Network error. Please check if the server is running.', 'error');
            } finally {
                loginBtn.disabled = false;
                loginBtn.textContent = 'Login';
            }
        });
    }

    function showMessage(message, type) {
        loginMessage.textContent = message;
        loginMessage.className = `alert alert-${type}`;
        loginMessage.style.display = 'block';
        loginMessage.style.padding = '10px';
        loginMessage.style.borderRadius = '5px';
        loginMessage.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
        loginMessage.style.color = type === 'success' ? '#155724' : '#721c24';
        loginMessage.style.border = `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`;
    }

    function hideMessage() {
        loginMessage.style.display = 'none';
    }
});

// Check if user is already logged in
function checkAuthStatus() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (token && user) {
        // User is logged in
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

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
}
