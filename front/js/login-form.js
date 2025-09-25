/**
 * Handles login form behavior and validation.
 */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const loginBtn = document.getElementById('login-btn');
    const btnText = loginBtn.querySelector('.btn-text');
    const spinner = document.getElementById('login-spinner');

    /**
     * Display a toast message.
     * @param {string} message - The message to display.
     * @param {string} [type='error'] - The type of message ('error' or 'success').
     */
    function showToast(message, type = 'error') {
        const toast = document.getElementById('toast');
        const toastMessage = toast.querySelector('.toast-message');

        toastMessage.textContent = message;
        toast.className = `toast ${type}`;
        toast.style.display = 'block';

        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }

    /**
     * Validate an email string.
     * @param {string} email - The email to validate.
     * @returns {boolean} True if valid email, false otherwise.
     */
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Clear error messages and input styles.
     */
    function clearErrors() {
        emailError.textContent = '';
        passwordError.textContent = '';
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');
    }

    /**
     * Validate email input on blur.
     */
    emailInput.addEventListener('blur', function() {
        if (!validateEmail(this.value)) {
            emailError.textContent = 'Enter a valid email';
            this.classList.add('error');
        } else {
            emailError.textContent = '';
            this.classList.remove('error');
        }
    });

    /**
     * Handle form submission for login.
     * @param {Event} e - The submit event.
     */
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearErrors();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        let hasErrors = false;

        if (!email) {
            emailError.textContent = 'Email is required';
            emailInput.classList.add('error');
            hasErrors = true;
        } else if (!validateEmail(email)) {
            emailError.textContent = 'Enter a valid email';
            emailInput.classList.add('error');
            hasErrors = true;
        }

        if (!password) {
            passwordError.textContent = 'Password is required';
            passwordInput.classList.add('error');
            hasErrors = true;
        }

        if (hasErrors) return;

        // Show spinner and disable button
        btnText.style.display = 'none';
        spinner.classList.remove('hidden');
        loginBtn.disabled = true;

        // Attempt login
        const result = await login(email, password);

        // Restore button state
        btnText.style.display = 'inline';
        spinner.classList.add('hidden');
        loginBtn.disabled = false;

        if (result.success) {
            showToast('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = '/welcome-dashboard';
            }, 1000);
        } else {
            showToast(result.error);
        }
    });
});
