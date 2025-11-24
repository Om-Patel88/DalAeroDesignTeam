/**
 * Centralized Form Handler for Dal Aero Design Team Website
 * Handles AJAX submission, validation, and UI states.
 */

document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form[action^="https://formspree.io"]');

    forms.forEach(form => {
        form.addEventListener('submit', handleSubmit);
    });
});

async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const statusContainer = document.getElementById(form.id + "-status"); // Expecting ID like "join-form-status"
    const successContainer = document.getElementById(form.id + "-success"); // Expecting ID like "join-form-success"
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // 1. Client-side Validation (Basic)
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // 2. Prepare Data
    const data = new FormData(form);

    // 3. UI Loading State
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sending...
    `;

    try {
        // 4. AJAX Submission
        const response = await fetch(form.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // 5. Success State
            form.reset();
            form.classList.add('hidden'); // Hide the form
            if (successContainer) {
                successContainer.classList.remove('hidden'); // Show success message
                // Scroll to success message
                successContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            // 6. Error State (Server-side)
            const data = await response.json();
            let errorMessage = "Oops! There was a problem submitting your form.";

            if (Object.hasOwn(data, 'errors')) {
                errorMessage = data["errors"].map(error => error["message"]).join(", ");
            }

            showError(statusContainer, errorMessage);
        }
    } catch (error) {
        // 7. Network Error
        showError(statusContainer, "Oops! There was a problem submitting your form. Please check your internet connection.");
    } finally {
        // 8. Reset Button State
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

function showError(container, message) {
    if (container) {
        container.innerHTML = message;
        container.className = "text-center mt-4 text-red-600 font-semibold p-4 bg-red-50 rounded-lg border border-red-200";
        container.classList.remove("hidden");
    } else {
        alert(message);
    }
}
