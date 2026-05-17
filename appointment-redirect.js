// Check if user is logged in
function isUserLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Determine if current page is in the pages folder or at root
function isInPagesFolder() {
    let currentPath = window.location.pathname;
    return currentPath.includes('/pages/');
}

// Get appointment page URL based on current location
function getAppointmentUrl() {
    return isInPagesFolder() ? 'appointment.html' : 'pages/appointment.html';
}

// Get login page URL based on current location
function getLoginUrl() {
    return isInPagesFolder() ? 'login.html' : 'pages/login.html';
}

// Handle Book Appointment button clicks
function handleBookAppointmentClick(event) {
    event.preventDefault();
    
    if (isUserLoggedIn()) {
        // User is logged in, go directly to appointment page
        window.location.href = getAppointmentUrl();
    } else {
        // User is not logged in, redirect to login with return URL
        const appointmentUrl = getAppointmentUrl();
        const loginUrl = getLoginUrl();
        window.location.href = loginUrl + '?returnUrl=' + encodeURIComponent(appointmentUrl);
    }
}

// Update navbar based on login status
function updateNavbar() {
    const loginBtn = document.querySelector('.btn-login');
    
    if (isUserLoggedIn()) {
        // User is logged in
        if (loginBtn) {
            loginBtn.textContent = 'Log out';
            loginBtn.href = '#';
            loginBtn.onclick = function(e) {
                e.preventDefault();
                logout();
                return false;
            };
        }
    } else {
        // User is not logged in
        if (loginBtn) {
            loginBtn.textContent = 'Log in';
            const loginUrl = getLoginUrl();
            loginBtn.href = loginUrl;
            loginBtn.onclick = null;
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = isInPagesFolder() ? '../index.html' : 'index.html';
}

// Attach event listeners to all Book Appointment buttons when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Update navbar
    updateNavbar();
    
    // Select all Book Appointment buttons by their various class names and href
    const bookAppointmentButtons = document.querySelectorAll(
        'a.btn-primary[href*="appointment.html"], ' +
        'a.btn-book-appointment[href*="appointment.html"], ' +
        'a.bk-app-btn[href*="appointment.html"]'
    );
    
    bookAppointmentButtons.forEach(button => {
        button.addEventListener('click', handleBookAppointmentClick);
    });
});
