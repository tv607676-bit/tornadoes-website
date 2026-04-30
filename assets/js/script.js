document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    const animationSpeed = 30; // Controls overall counting speed. Lower = faster.

    const runCounterAnimation = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                
                // Calculate the increment dynamically based on target size
                const increment = Math.max(target / animationSpeed, 1);
                
                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 15);
                } else {
                    // Ensure the exact target number is set at the end
                    counter.innerText = target;
                }
            };
            
            updateCount();
        });
    };

    // Intersection Observer to trigger animation when the Achievements section is in view
    const achievementsSection = document.querySelector('.achievements');
    
    if (achievementsSection && counters.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // When the element is scrolled into view
                if (entry.isIntersecting) {
                    runCounterAnimation();
                    // Stop watching once animation has run
                    observer.disconnect();
                }
            });
        }, {
            threshold: 0.6 // Fire when 30% of the section is visible
        });
        
        observer.observe(achievementsSection);
    }

    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Contact Form Submission
    const enquiryForm = document.getElementById('enquiryForm');
    const formMessage = document.getElementById('formMessage');

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = enquiryForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            
            // Set loading state
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;
            
            // Gather data
            const formData = new FormData(enquiryForm);
            const payload = {
                full_name: formData.get('full_name'),
                email: formData.get('email'),
                mobile_number: formData.get('mobile_number'),
                subject: formData.get('subject')
            };
            
            try {
                const response = await fetch('https://api.tornadoes.co.in/api/enquiry', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    formMessage.className = 'form-message success';
                    formMessage.innerText = data.message || 'Enquiry submitted successfully';
                    enquiryForm.reset();
                } else {
                    formMessage.className = 'form-message error';
                    formMessage.innerText = data.message || 'Failed to submit enquiry. Please try again.';
                }
            } catch (error) {
                formMessage.className = 'form-message error';
                formMessage.innerText = 'Network error. Please try again later.';
            } finally {
                // Restore button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                    formMessage.className = 'form-message'; // Reset classes
                    setTimeout(() => formMessage.style.display = '', 50); // Restore default display logic
                }, 5000);
            }
        });
    }
    // Notifications Logic
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationPopup = document.getElementById('notificationPopup');
    const popupClose = document.getElementById('popupClose');
    const notificationDot = document.getElementById('notificationDot');
    const notificationList = document.getElementById('notificationList');

    if (notificationBtn && notificationPopup) {
        // Toggle Popup
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationPopup.classList.toggle('active');
            // Hide red dot when opened
            if (notificationDot) {
                notificationDot.classList.remove('active');
            }
        });

        // Close Popup
        if (popupClose) {
            popupClose.addEventListener('click', () => {
                notificationPopup.classList.remove('active');
            });
        }

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!notificationPopup.contains(e.target) && !notificationBtn.contains(e.target)) {
                notificationPopup.classList.remove('active');
            }
        });

        // Format Bytes helper
        const formatBytes = (bytes) => {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        };

        // Fetch Notifications
        const fetchNotifications = async () => {
            try {
                const response = await fetch('https://api.tornadoes.co.in/api/news');
                const data = await response.json();
                
                if (data && data.data && data.data.length > 0) {
                    let attachmentsHtml = '';
                    let hasAttachments = false;

                    data.data.forEach(newsItem => {
                        if (newsItem.attachments && newsItem.attachments.length > 0) {
                            hasAttachments = true;
                            newsItem.attachments.forEach(attachment => {
                                const sizeStr = formatBytes(attachment.size_bytes);
                                const downloadUrl = `https://api.tornadoes.co.in/api/news/${newsItem.id}/attachments/${attachment.id}/download`;
                                
                                attachmentsHtml += `
                                    <div class="attachment-item">
                                        <div class="attachment-info">
                                            <div class="attachment-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                            </div>
                                            <div class="attachment-details">
                                                <span class="attachment-name" title="${attachment.original_name}">${attachment.original_name}</span>
                                                <span class="attachment-meta">${sizeStr}</span>
                                            </div>
                                        </div>
                                        <a href="${downloadUrl}" class="btn-download" target="_blank" download>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                            Download
                                        </a>
                                    </div>
                                `;
                            });
                        }
                    });

                    if (hasAttachments) {
                        if (notificationList) {
                            notificationList.innerHTML = attachmentsHtml;
                        }
                        if (notificationDot) {
                            notificationDot.classList.add('active');
                        }
                    } else {
                        if (notificationList) {
                            notificationList.innerHTML = '<div class="notification-empty">No new documents available</div>';
                        }
                    }
                } else {
                    if (notificationList) {
                        notificationList.innerHTML = '<div class="notification-empty">No new documents available</div>';
                    }
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
                if (notificationList) {
                    notificationList.innerHTML = '<div class="notification-empty">Failed to load notifications</div>';
                }
            }
        };

        // Initialize fetch
        fetchNotifications();
    }
});
