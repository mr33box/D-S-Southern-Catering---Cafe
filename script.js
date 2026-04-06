document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon from bars to times
            const icon = mobileMenuBtn.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // 3. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            navLinks.classList.remove('active'); // Close mobile menu if open
            if(mobileMenuBtn) {
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }

            const targetId = this.getAttribute('href');
            if(targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const navHeight = navbar.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 4. Reviews Slider Control
    const track = document.querySelector('.reviews-slider');
    const wrapper = document.querySelector('.reviews-wrapper');
    
    if (track && wrapper) {
        // Double the content to create a seamless loop
        const cards = Array.from(track.children);
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            track.appendChild(clone);
        });

        let isDown = false;
        let startX;
        let currentTranslate = 0;
        let animationId;
        let isHovered = false;
        
        // Config: pixels per frame
        const speed = 0.8; 
        
        function animate() {
            if (!isDown && !isHovered) {
                currentTranslate -= speed;
            }
            
            // Loop adjustment
            // The scrollWidth gives total width. Half of it is the original track width.
            const halfWidth = track.scrollWidth / 2;
            
            if (currentTranslate <= -halfWidth) {
                currentTranslate += halfWidth;
            } else if (currentTranslate > 0) {
                currentTranslate -= halfWidth;
            }
            
            track.style.transform = `translateX(${currentTranslate}px)`;
            
            animationId = requestAnimationFrame(animate);
        }

        // Start animation
        animationId = requestAnimationFrame(animate);

        // Interaction tracking
        wrapper.addEventListener('mouseenter', () => {
            isHovered = true;
        });
        
        wrapper.addEventListener('mouseleave', () => {
            isHovered = false;
            isDown = false;
        });

        // Mouse Dragging
        wrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX;
        });

        wrapper.addEventListener('mouseup', () => {
            isDown = false;
        });

        wrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX;
            const walk = x - startX;
            currentTranslate += walk;
            startX = x; 
        });

        // Touch swiping
        wrapper.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX;
        }, { passive: true });

        wrapper.addEventListener('touchend', () => {
            isDown = false;
        }, { passive: true });

        wrapper.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX;
            const walk = x - startX;
            currentTranslate += walk;
            startX = x;
        }, { passive: true });
    }
});
