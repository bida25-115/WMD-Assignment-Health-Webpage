document.addEventListener('DOMContentLoaded', function () {
            const form = document.getElementById('contactForm');
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                    form.classList.add('was-validated');
                    const invalidField = form.querySelector(':invalid');
                    if (invalidField) {
                        invalidField.focus();
                    }
                } else {
                    event.preventDefault();
                    alert('Thank you! Your message has been received.');
                    form.reset();
                    form.classList.remove('was-validated');
                }
            });
        });