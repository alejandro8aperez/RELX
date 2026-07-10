// ============================================
// AQUA-8 PLATFORM - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href').includes(currentPage)) {
            link.classList.add('active');
        }
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 102, 204, 0.15)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });
    
    // Language toggle: use Google Translate instead of page navigation
    document.querySelectorAll('.lang-toggle a').forEach(link => {
        const isEN = link.textContent.trim() === 'EN';
        const isES = link.textContent.trim() === 'ES';
        if (isEN || isES) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                translateTo(isEN ? 'en' : 'es');
            });
        }
    });

    // Hero particles
    createParticles();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Counter animation for stats
    animateCounters();
});

function createParticles() {
    const container = document.querySelector('.hero-particles');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = Math.random() * 20 + 5 + 'px';
        particle.style.height = particle.style.width;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        container.appendChild(particle);
    }
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target], .impact-number[data-target]');
    if (!counters.length) return;

    function runCounter(counter) {
        // Evitar doble ejecución
        if (counter._done) return;
        counter._done = true;

        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function easeOutQuad(t) { return t * (2 - t); }

        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.round(easeOutQuad(progress) * target);
            const suffix = counter.getAttribute('data-suffix') || '';
            counter.textContent = value.toLocaleString('es-CO') + suffix;
            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                const suffix = counter.getAttribute('data-suffix') || '';
                counter.textContent = target.toLocaleString('es-CO') + suffix;
            }
        }

        requestAnimationFrame(tick);
    }

    // FIX: detectar si el elemento ya es visible al cargar
    // (el hero está en viewport desde el inicio — el Observer solo dispara
    //  en elementos que ENTRAN al viewport, no los que ya están dentro)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    counters.forEach(counter => {
        // Verificar si ya está visible en el viewport
        const rect = counter.getBoundingClientRect();
        const alreadyVisible = (
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        );

        if (alreadyVisible) {
            // Ya está en pantalla — animar con pequeño delay para efecto visual
            setTimeout(() => runCounter(counter), 300);
        } else {
            // Fuera de pantalla — Observer lo activa al hacer scroll
            observer.observe(counter);
        }
    });
}
