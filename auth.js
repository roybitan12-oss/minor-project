document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const errorMsg = document.getElementById('error-msg');

    // Handle Signup
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                showError("Passwords do not match!");
                return;
            }

            const apiBase = window.APP_CONFIG ? window.APP_CONFIG.getApiUrl() : '';
            fetch(apiBase + '/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            })
                .then(async res => {
                    const text = await res.text();
                    let data;
                    try {
                        data = JSON.parse(text);
                    } catch (e) {
                        throw new Error(`Invalid response from server: ${text.substring(0, 100)}`);
                    }
                    if (!res.ok) throw new Error(data.error || 'Signup failed');
                    return data;
                })
                .then(data => {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.href = 'index.html';
                })
                .catch(error => showError(error.message));
        });
    }

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const apiBase = window.APP_CONFIG ? window.APP_CONFIG.getApiUrl() : '';
            fetch(apiBase + '/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
                .then(async res => {
                    const text = await res.text();
                    let data;
                    try {
                        data = JSON.parse(text);
                    } catch (e) {
                        throw new Error(`Invalid response from server: ${text.substring(0, 100)}`);
                    }
                    if (!res.ok) throw new Error(data.error || 'Login failed');
                    return data;
                })
                .then(data => {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.href = 'index.html';
                })
                .catch(error => showError(error.message));
        });
    }

    function showError(message) {
        if (errorMsg) {
            errorMsg.textContent = message;
            errorMsg.style.display = 'block';
        }
    }

    // Auth State Observer (for index.html)
    const updateNav = () => {
        const loginBtn = document.getElementById('login-nav-btn');
        const userJson = localStorage.getItem('user');

        if (userJson) {
            const user = JSON.parse(userJson);
            if (loginBtn) {
                loginBtn.innerHTML = `<i class="fa fa-sign-out"></i> Logout (${user.name})`;
                loginBtn.title = `Logged in as ${user.name}`;
                loginBtn.href = '#';
                loginBtn.onclick = (e) => {
                    e.preventDefault();
                    localStorage.removeItem('user');
                    window.location.reload();
                };
            }
        } else {
            if (loginBtn) {
                loginBtn.innerHTML = '<i class="fa fa-user-circle"></i> Login';
                loginBtn.href = 'login.html';
                loginBtn.onclick = null;
                loginBtn.title = 'Login';
            }
        }
    };

    updateNav();
});
