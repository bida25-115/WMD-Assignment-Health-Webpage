document.addEventListener('DOMContentLoaded', () => {
  const profileForm = document.getElementById('profileForm');
  const profileMessage = document.getElementById('profileMessage');
  const nameInput = document.getElementById('regName');
  const emailInput = document.getElementById('regEmail');
  const phoneInput = document.getElementById('regPhone');
  const passwordInput = document.getElementById('regPassword');
  const confirmInput = document.getElementById('regConfirm');
  const aboutInput = document.getElementById('regAbout');
  const submitBtn = document.getElementById('profileSubmitBtn');

  function showMessage(text, type = 'success') {
    profileMessage.textContent = text;
    profileMessage.classList.remove('d-none', 'alert-success', 'alert-danger');
    profileMessage.classList.add('alert', type === 'success' ? 'alert-success' : 'alert-danger');
  }

  function clearMessage() {
    profileMessage.textContent = '';
    profileMessage.classList.add('d-none');
    profileMessage.classList.remove('alert-success', 'alert-danger');
  }

  // Load users map from localStorage
  function loadUsers() {
    return JSON.parse(localStorage.getItem('users') || '{}');
  }
  function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  let currentEmail = localStorage.getItem('userEmail');

  if (isLoggedIn && currentEmail) {
    const users = loadUsers();
    const user = users[currentEmail];
    if (user) {
      nameInput.value = user.name || '';
      emailInput.value = user.email || '';
      phoneInput.value = user.phone || '';
      aboutInput.value = user.about || '';
      submitBtn.textContent = 'Update information';
    }
  } else {
    submitBtn.textContent = 'Register';
  }

  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearMessage();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const phone = phoneInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    const about = aboutInput.value.trim();

    if (!name || !email || !phone) {
      showMessage('Please fill in name, email and phone.', 'error');
      return;
    }

    const users = loadUsers();

    if (isLoggedIn && currentEmail) {
      // Update profile for logged-in user
      const user = users[currentEmail] || {};
      user.name = name;
      user.email = email;
      user.phone = phone;
      if (password) {
        if (password !== confirm) {
          showMessage('Passwords do not match.', 'error');
          return;
        }
        user.password = password;
      }
      user.about = about;

      // If user changed their email, migrate the key
      if (email !== currentEmail) {
        delete users[currentEmail];
        users[email] = user;
        localStorage.setItem('userEmail', email);
        currentEmail = email;
      } else {
        users[currentEmail] = user;
      }

      saveUsers(users);
      showMessage('Profile updated successfully.');
      return;
    }

    // Registration path
    if (!password) {
      showMessage('Please set a password to register.', 'error');
      return;
    }
    if (password !== confirm) {
      showMessage('Passwords do not match.', 'error');
      return;
    }

    if (users[email]) {
      showMessage('An account with that email already exists. Please log in.', 'error');
      return;
    }

    users[email] = {
      name,
      email,
      phone,
      password,
      about,
    };

    saveUsers(users);

    // Log the user in and allow immediate updates from profile page
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    isLoggedIn = true;
    currentEmail = email;
    submitBtn.textContent = 'Save changes';
    showMessage('Registration successful. Your details are saved.');

    return;
  });

  // Right-panel update button behavior
  const rightUpdateBtn = document.getElementById('rightUpdateBtn');
  if (rightUpdateBtn) {
    rightUpdateBtn.addEventListener('click', () => {
      profileForm.requestSubmit();
    });
  }

  // Sign out handler (menu-item with sign out text)
  const signOutElem = document.querySelector('.menu-item.mb-0');
  if (signOutElem) {
    signOutElem.style.cursor = 'pointer';
    signOutElem.addEventListener('click', () => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      // reload page to reflect logged-out state
      window.location.reload();
    });
  }
});
