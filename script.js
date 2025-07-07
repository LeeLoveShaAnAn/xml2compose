document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Don't prevent default for external links
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission handler
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    const formContainer = form.parentElement;
                    formContainer.innerHTML = '<p id="form-message" class="success">Thanks for your submission! We will notify you upon launch.</p>';
                } else {
                    response.json().then(data => {
                        const errorMessage = data.errors ? data.errors.map(error => error.message).join(', ') : 'Oops! There was a problem submitting your form';
                        formMessage.textContent = errorMessage;
                        formMessage.className = 'error';
                    }).catch(() => {
                        formMessage.textContent = 'Oops! There was a problem submitting your form';
                        formMessage.className = 'error';
                    });
                }
            }).catch(() => {
                formMessage.textContent = 'Oops! There was a problem submitting your form';
                formMessage.className = 'error';
            });
        });
    }
});
