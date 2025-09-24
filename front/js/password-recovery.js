
const API_URL =
    window.location.hostname.includes("localhost")
        ? "/api"
        : "https://task-app-back.vercel.app/api";

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const submitBtn = document.querySelector('.submit-btn');


    function showMessage(message, type = 'info') {

        let messageBox = document.querySelector('.message-box');
        if (!messageBox) {
            messageBox = document.createElement('div');
            messageBox.className = 'message-box';
            form.insertAdjacentElement('beforebegin', messageBox);
        }

        messageBox.className = `message-box ${type}`;
        messageBox.innerHTML = `
            <span class="message-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : '📧'}</span>
            <span class="message-text">${message}</span>
        `;
        messageBox.style.display = 'block';


        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 5000);
    }


    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }


    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();


        if (!email) {
            showMessage('Por favor ingresa tu correo electrónico', 'error');
            emailInput.focus();
            return;
        }

        if (!validateEmail(email)) {
            showMessage('Por favor ingresa un correo electrónico válido', 'error');
            emailInput.focus();
            return;
        }


        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>⏳</span> Enviando...';
        submitBtn.style.opacity = '0.7';

        try {

            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {

                showMessage('Si el correo existe en nuestra base de datos, recibirás un enlace de recuperación en breve.', 'success');


                emailInput.value = '';


                setTimeout(() => {
                    window.location.href = '/login';
                }, 3000);
            } else {
                showMessage(data.error || 'Error al procesar la solicitud', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Error de conexión. Por favor intenta nuevamente.', 'error');
        } finally {

            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            submitBtn.style.opacity = '1';
        }
    });


    emailInput.addEventListener('blur', function () {
        if (this.value && !validateEmail(this.value)) {
            this.classList.add('error');
            showMessage('Ingresa un correo electrónico válido', 'error');
        } else {
            this.classList.remove('error');
        }
    });


    emailInput.addEventListener('input', function () {
        this.classList.remove('error');
    });
});