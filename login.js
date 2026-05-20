const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    event.stopPropagation();

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    emailInput.classList.remove('is-invalid');
    passwordInput.classList.remove('is-invalid');
    loginMessage.classList.add('d-none');
    loginMessage.textContent = '';
    loginMessage.classList.remove('alert-danger', 'alert-success');

    if (!emailValue || !passwordValue) {
        if (!emailValue) emailInput.classList.add('is-invalid');
        if (!passwordValue) passwordInput.classList.add('is-invalid');

        loginMessage.textContent = 'Please enter your login details first.';
        loginMessage.classList.remove('d-none');
        loginMessage.classList.add('alert', 'alert-danger');
        return;
    }

    // Load users from localStorage (stored as object keyed by email)
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    const user = users[emailValue];
    if (!user || user.password !== passwordValue) {
        loginMessage.textContent = 'Invalid details. Please check your email and password.';
        loginMessage.classList.remove('d-none');
        loginMessage.classList.add('alert', 'alert-danger');
        emailInput.classList.add('is-invalid');
        passwordInput.classList.add('is-invalid');
        return;
    }

    loginMessage.textContent = 'Login successful! Redirecting...';
    loginMessage.classList.remove('d-none');
    loginMessage.classList.add('alert', 'alert-success');
    loginForm.reset();

    // Save login state to localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', emailValue);

    // Get return URL from URL parameters or default to appointment page
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get('returnUrl') || 'appointment.html';

    // Redirect after a short delay to show success message
    setTimeout(() => {
        window.location.href = returnUrl;
    }, 800);
});