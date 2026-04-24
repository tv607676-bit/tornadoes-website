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
});
