document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

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
                form.style.display = 'none';
                formMessage.textContent = 'Thanks for your submission! We will notify you upon launch.';
                formMessage.className = 'success';
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
});
