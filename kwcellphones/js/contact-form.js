// Contact Form Handler
// 
// FORM ENDPOINT SETUP INSTRUCTIONS:
// =================================
// This form submits to an external API endpoint. To enable form submission:
//
// 1. Set up your form handler endpoint (e.g., forms.[yourdomain.com]/api/submit)
// 2. Replace the fetch URL below (line ~245) with your endpoint
// 3. Ensure your endpoint accepts POST requests with JSON data
// 4. Update the form action attribute in contact.html as well
//
// Example endpoint: https://forms.[yourdomain.com]/api/submit
// =================================

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const deviceSelect = document.getElementById('device');
    const issueInput = document.getElementById('issue');
    const messageTextarea = document.getElementById('message');
    const phoneInput = document.getElementById('phone');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');
    
    if (!contactForm || !nameInput || !emailInput || !deviceSelect || !issueInput || !phoneInput || !formMessage || !submitBtn) {
        console.error('Required form elements not found');
        return;
    }

    // Canadian phone number pattern
    const CANADIAN_PATTERN = /^\([2-9][0-8][0-9]\) [2-9][0-9]{2}-[0-9]{4}$/;

    // Phone number formatting function
    function formatPhone(value) {
        let digitsOnly = value.replace(/\D/g, '');
        if (digitsOnly.length > 10) {
            digitsOnly = digitsOnly.slice(0, 10);
        }
        
        const area = digitsOnly.slice(0, 3);
        const exchange = digitsOnly.slice(3, 6);
        const line = digitsOnly.slice(6, 10);

        let formatted = '';
        if (digitsOnly.length <= 3) {
            formatted = area ? `(${area}` : '';
        } else if (digitsOnly.length <= 6) {
            formatted = `(${area}) ${exchange}`;
        } else {
            formatted = `(${area}) ${exchange}-${line}`;
        }
        return formatted;
    }

    // Phone validation function
    function validatePhone(value) {
        const isValid = CANADIAN_PATTERN.test(value);
        phoneInput.setCustomValidity(isValid ? '' : 'Please enter phone number in format (XXX) XXX-XXXX');
        phoneInput.setAttribute('aria-invalid', isValid ? 'false' : 'true');
        return isValid;
    }

    // Utilities for per-field inline errors
    function getOrCreateErrorEl(input) {
        const errorId = `${input.id}-error`;
        let el = document.getElementById(errorId);
        if (!el) {
            el = document.createElement('div');
            el.id = errorId;
            el.className = 'input-error';
            el.setAttribute('role', 'alert');
            // Insert right after the input within the same form-group
            const parent = input.closest('.form-group') || input.parentNode;
            parent.appendChild(el);
        }
        return el;
    }

    function appendDescribedBy(input, idToAdd) {
        const existing = (input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
        if (!existing.includes(idToAdd)) {
            existing.push(idToAdd);
            input.setAttribute('aria-describedby', existing.join(' '));
        }
    }

    function removeDescribedBy(input, idToRemove) {
        const existing = (input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
        const next = existing.filter(id => id !== idToRemove);
        if (next.length > 0) {
            input.setAttribute('aria-describedby', next.join(' '));
        } else {
            input.removeAttribute('aria-describedby');
        }
    }

    function showFieldError(input, message) {
        const errorEl = getOrCreateErrorEl(input);
        errorEl.textContent = message;
        input.setAttribute('aria-invalid', 'true');
        appendDescribedBy(input, errorEl.id);
    }

    function clearFieldError(input) {
        const errorId = `${input.id}-error`;
        const errorEl = document.getElementById(errorId);
        input.setAttribute('aria-invalid', 'false');
        if (errorEl) {
            errorEl.textContent = '';
            removeDescribedBy(input, errorId);
        }
        input.setCustomValidity('');
    }

    // Field validators
    function validateName() {
        const value = nameInput.value.trim();
        if (value.length < 2) {
            showFieldError(nameInput, 'Please enter your full name (at least 2 characters).');
            nameInput.setCustomValidity('Name is too short');
            return false;
        }
        const allowed = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,100}$/;
        if (!allowed.test(value)) {
            showFieldError(nameInput, 'Name can contain letters, spaces, apostrophes and hyphens.');
            nameInput.setCustomValidity('Invalid name');
            return false;
        }
        clearFieldError(nameInput);
        return true;
    }

    function validateEmail() {
        const value = emailInput.value.trim();
        // Use browser validation first
        if (emailInput.validity.typeMismatch || value === '') {
            showFieldError(emailInput, 'Please enter a valid email address.');
            emailInput.setCustomValidity('Invalid email');
            return false;
        }
        clearFieldError(emailInput);
        return true;
    }

    function validateDevice() {
        if (!deviceSelect.value) {
            showFieldError(deviceSelect, 'Please select a device type.');
            deviceSelect.setCustomValidity('Device required');
            return false;
        }
        clearFieldError(deviceSelect);
        return true;
    }

    function validateIssue() {
        const value = issueInput.value.trim();
        if (value.length < 5) {
            showFieldError(issueInput, 'Please describe the issue (at least 5 characters).');
            issueInput.setCustomValidity('Issue too short');
            return false;
        }
        clearFieldError(issueInput);
        return true;
    }

    function validateOptionalMessage() {
        const value = (messageTextarea.value || '').trim();
        if (value.length > 3000) {
            showFieldError(messageTextarea, 'Message is too long (max 3000 characters).');
            messageTextarea.setCustomValidity('Message too long');
            return false;
        }
        clearFieldError(messageTextarea);
        return true;
    }

    // Phone input event listeners
    phoneInput.addEventListener('input', function() {
        const oldVal = phoneInput.value;
        phoneInput.value = formatPhone(oldVal);
        validatePhone(phoneInput.value);
        
        // Maintain cursor position
        try {
            phoneInput.setSelectionRange(phoneInput.value.length, phoneInput.value.length);
        } catch (e) {
            // Ignore errors in older browsers
        }
    });

    phoneInput.addEventListener('blur', function() {
        validatePhone(phoneInput.value);
    });

    // Validate on input/blur for other fields
    nameInput.addEventListener('input', validateName);
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('input', validateEmail);
    emailInput.addEventListener('blur', validateEmail);
    deviceSelect.addEventListener('change', validateDevice);
    deviceSelect.addEventListener('blur', validateDevice);
    issueInput.addEventListener('input', validateIssue);
    issueInput.addEventListener('blur', validateIssue);
    messageTextarea.addEventListener('input', validateOptionalMessage);

    // Form submission handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate required fields
        const checks = [
            validateName(),
            validateEmail(),
            validateDevice(),
            validateIssue(),
            validateOptionalMessage(),
        ];

        // Validate phone if provided
        if (phoneInput.value.trim() !== '' && !validatePhone(phoneInput.value)) {
            checks.push(false);
        }

        if (checks.includes(false)) {
            // Focus first invalid field
            const firstInvalid = [nameInput, emailInput, deviceSelect, issueInput, phoneInput, messageTextarea].find(
                el => el.getAttribute('aria-invalid') === 'true'
            );
            if (firstInvalid) firstInvalid.focus();
            showMessage('Please fix the errors in the form before submitting.', 'error');
            return;
        }

        // Check honeypot field (bot trap)
        const honeypot = document.getElementById('website_url');
        if (honeypot && honeypot.value.trim() !== '') {
            console.log('Spam detected - honeypot field filled');
            return;
        }

        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Prepare form data as JSON
        const formData = new FormData(contactForm);
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });
        
        // Submit to API
        // TODO: Replace with your form handler endpoint
        // Example: 'https://forms.[yourdomain.com]/api/submit'
        fetch('https://[your-form-endpoint]/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Referer': window.location.href
            },
            body: JSON.stringify(jsonData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.id && data.message) {
                showMessage('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.', 'success');
                contactForm.reset();
                // Clear inline errors and states after reset
                [nameInput, emailInput, deviceSelect, issueInput, phoneInput, messageTextarea].forEach(clearFieldError);
            } else {
                showMessage('Error: ' + (data.error || 'Failed to send message. Please try again.'), 'error');
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            showMessage('An error occurred while sending your message. Please try again or call us directly.', 'error');
        })
        .finally(() => {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        });
    });

    // Message display function
    function showMessage(text, type) {
        formMessage.className = `form-message ${type}`;
        formMessage.textContent = text;
        formMessage.style.display = 'block';
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }

    // Clear message when user starts typing
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (formMessage.style.display !== 'none') {
                formMessage.style.display = 'none';
            }
        });
    });
});
