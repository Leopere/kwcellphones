/**
 * Feedback Form Handler
 * Handles rating system, Google review redirects, and negative feedback submission
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize feedback system
    initializeFeedback();

    function initializeFeedback() {
        const ratingStars = document.querySelectorAll('.star');
        const ratingSection = document.getElementById('rating-section');
        const positiveFeedback = document.getElementById('positive-feedback');
        const negativeFeedback = document.getElementById('negative-feedback');
        const googleReviewBtn = document.getElementById('google-review-btn');
        const skipReviewBtn = document.getElementById('skip-review-btn');
        const improvementForm = document.getElementById('improvement-form');

        let selectedRating = 0;

        // Handle star rating clicks
        ratingStars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.dataset.rating);
                setRating(rating);
            });

            star.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const rating = parseInt(this.dataset.rating);
                    setRating(rating);
                }
            });

            star.addEventListener('mouseenter', function() {
                const rating = parseInt(this.dataset.rating);
                highlightStars(rating);
            });
        });

        // Handle mouse leave to reset highlighting
        document.getElementById('rating-stars').addEventListener('mouseleave', function() {
            highlightStars(selectedRating);
        });

        function setRating(rating) {
            selectedRating = rating;
            highlightStars(rating);

            // Hide rating error if it was shown
            const ratingError = document.getElementById('rating-error');
            ratingError.style.display = 'none';

            // Show appropriate feedback section after a brief delay
            setTimeout(() => {
                if (rating === 5) {
                    showPositiveFeedback();
                } else {
                    showNegativeFeedback(rating);
                }
            }, 500);
        }

        function highlightStars(rating) {
            ratingStars.forEach((star, index) => {
                if (index < rating) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
        }

        function showPositiveFeedback() {
            ratingSection.style.display = 'none';
            negativeFeedback.style.display = 'none';
            positiveFeedback.style.display = 'block';

            // Scroll to the feedback section
            positiveFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        function showNegativeFeedback(rating) {
            ratingSection.style.display = 'none';
            positiveFeedback.style.display = 'none';
            negativeFeedback.style.display = 'block';

            // Set the rating in the hidden field
            document.getElementById('feedback-rating').value = rating;

            // Scroll to the feedback section
            negativeFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Handle Google review button click
        if (googleReviewBtn) {
            googleReviewBtn.addEventListener('click', function(e) {
                // Submit positive feedback to API and track Google review intent
                submitPositiveFeedback('google_review_clicked');
            });
        }

        // Handle skip review button
        if (skipReviewBtn) {
            skipReviewBtn.addEventListener('click', function() {
                // Submit positive feedback to API
                submitPositiveFeedback('review_skipped');
            });
        }

        // Handle improvement form submission
        if (improvementForm) {
            improvementForm.addEventListener('submit', function(e) {
                e.preventDefault();

                const submitBtn = document.getElementById('improvement-submit-btn');
                const originalText = submitBtn.textContent;

                // Disable button and show loading state
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';

                // Submit the form
                const formData = new FormData(improvementForm);

                fetch(improvementForm.action, {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showThankYouMessage('Thank you for your feedback. We truly appreciate you taking the time to help us improve. We may reach out to discuss your experience further.');
                        improvementForm.reset();
                        trackReviewAction('improvement_feedback_submitted');
                    } else {
                        throw new Error(data.message || 'Submission failed');
                    }
                })
                .catch(error => {
                    console.error('Feedback submission error:', error);
                    showFormError('There was an error submitting your feedback. Please try again or contact us directly.');
                })
                .finally(() => {
                    // Re-enable button
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                });
            });
        }

        function submitPositiveFeedback(reviewAction) {
            // Create positive feedback data
            const positiveFeedbackData = new FormData();
            positiveFeedbackData.append('form_id', 'tech_device_repair_positive_feedback');
            positiveFeedbackData.append('rating', '5');
            positiveFeedbackData.append('feedback_type', 'positive_experience');
            positiveFeedbackData.append('review_action', reviewAction); // 'google_review_clicked' or 'review_skipped'
            positiveFeedbackData.append('message', reviewAction === 'google_review_clicked'
                ? 'Customer gave 5-star rating and clicked to review on Google'
                : 'Customer gave 5-star rating but chose not to leave a Google review');

            // Submit to API
            // TODO: Replace with your form handler endpoint
            fetch('https://[your-form-endpoint]/api/submit', {
                method: 'POST',
                body: positiveFeedbackData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    trackReviewAction(reviewAction);

                    // Show appropriate thank you message based on action
                    const message = reviewAction === 'google_review_clicked'
                        ? 'Thank you for choosing to review us on Google! Your support helps our local business grow.'
                        : 'Thank you for your positive feedback! We appreciate your support.';

                    // For Google review clicks, add a small delay since the link opens in new tab
                    if (reviewAction === 'google_review_clicked') {
                        setTimeout(() => {
                            showThankYouMessage(message);
                        }, 2000);
                    } else {
                        showThankYouMessage(message);
                    }
                } else {
                    throw new Error(data.message || 'Submission failed');
                }
            })
            .catch(error => {
                console.error('Positive feedback submission error:', error);
                // Still show thank you message even if API fails
                const message = reviewAction === 'google_review_clicked'
                    ? 'Thank you for choosing to review us on Google! Your support helps our local business grow.'
                    : 'Thank you for your positive feedback! We appreciate your support.';
                showThankYouMessage(message);
            });
        }

        function showThankYouMessage(message) {
            // Hide all feedback sections
            positiveFeedback.style.display = 'none';
            negativeFeedback.style.display = 'none';

            // Show thank you message in the container
            const container = document.getElementById('feedback-container');
            container.innerHTML = `
                <div class="thank-you-message" style="
                    text-align: center;
                    padding: 3rem 2rem;
                    background: var(--color-background-secondary);
                    border-radius: 0.5rem;
                    border: 1px solid var(--color-border);
                ">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🙏</div>
                    <h3 style="color: var(--color-text-primary); margin-bottom: 1rem;">Thank You!</h3>
                    <p style="color: var(--color-text-secondary); font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem;">
                        ${message}
                    </p>
                    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                        <a href="services.html" class="btn btn-primary">View Our Services</a>
                        <a href="contact.html" class="btn btn-secondary">Contact Us</a>
                        <a href="index.html" class="btn btn-outline">Back to Home</a>
                    </div>
                </div>
            `;
        }

        function showFormError(message) {
            const formMessage = document.getElementById('improvement-form-message');
            formMessage.className = 'form-message error';
            formMessage.textContent = message;
            formMessage.style.display = 'block';
        }

        function trackReviewAction(action) {
            // Simple tracking - could be extended to send to analytics
            console.log('Feedback action tracked:', action);

            // Could send to analytics service here
            // Example: gtag('event', 'feedback_action', { action: action });
        }
    }
});
