document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    const toggleMenu = () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        // Prevent body scroll when menu is open
        body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    };

    hamburger.addEventListener('click', toggleMenu);

    // Close menu when link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            body.style.overflow = 'auto';
        });
    });

    // --- High Performance Reveal on Scroll ---
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing after reveal for better performance
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('[data-reveal]').forEach(el => {
        revealObserver.observe(el);
    });

    // --- Active Nav Link (Scroll Spy) ---
    const sections = document.querySelectorAll('section[id]');
    const scrollSpyOptions = {
        threshold: 0.5,
        rootMargin: "-70px 0px 0px 0px"
    };

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.style.color = link.getAttribute('href') === `#${id}` 
                        ? 'var(--secondary)' 
                        : 'var(--dark)';
                });
            }
        });
    }, scrollSpyOptions);

    sections.forEach(section => scrollSpyObserver.observe(section));

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Video Logic ---
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        const wrapper = video.closest('.video-wrapper');
        
        video.addEventListener('play', () => {
            if (wrapper) wrapper.classList.add('playing');
        });
        
        video.addEventListener('pause', () => {
            if (wrapper) wrapper.classList.remove('playing');
        });

        video.addEventListener('ended', function() {
            if (wrapper) wrapper.classList.remove('playing');
            this.load(); 
        });
    });

    // Fallback for missing images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.background = '#f0f0f0';
            this.alt = 'Image pending...';
        });
    });
    // --- Promo Pop-up Modal Logic ---
    const promoModal = document.getElementById('promoModal');
    const closePromo = document.getElementById('closePromo');

    if (promoModal) {
        // Show modal with a slight delay
        setTimeout(() => {
            promoModal.classList.add('active-display');
            setTimeout(() => {
                promoModal.classList.add('show');
            }, 10);
        }, 1500);

        const closeModalFunc = () => {
            promoModal.classList.remove('show');
            setTimeout(() => {
                promoModal.classList.remove('active-display');
            }, 500);
        };

        if (closePromo) closePromo.addEventListener('click', closeModalFunc);
        promoModal.addEventListener('click', (e) => {
            if (e.target === promoModal) closeModalFunc();
        });
    }
});
