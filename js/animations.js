/* ====================================
   ANIMATIONS CONTROLLER
   Handles scroll animations, hover effects, and interactions
   ==================================== */

class AnimationsController {
    constructor() {
        this.init();
    }
    
    init() {
        // Initialize scroll reveal animations
        this.setupScrollReveal();
        
        // Initialize 3D tilt effects on cards
        this.setup3DTilt();
        
        // Initialize button ripple effects
        this.setupButtonRipples();
        
        // Initialize counter animations
        this.setupCounterAnimations();
        
        // Initialize parallax effects
        this.setupParallax();
    }
    
    // ========== SCROLL REVEAL ANIMATIONS ==========
    setupScrollReveal() {
        const revealElements = document.querySelectorAll('.fade-in-up, .feature-card, .stat-item');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }
    
    // ========== 3D TILT EFFECT ON CARDS ==========
    setup3DTilt() {
        const cards = document.querySelectorAll('.feature-card, .glass-card');
        
        cards.forEach(card => {
            // Keep some cards completely motionless (details & late-prayers)
            if (card.classList.contains('post-details-card') ||
                card.classList.contains('late-prayers-card')) {
                return;
            }
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Rotation removed for smoother experience
                card.style.transform = `
                    translateY(-1px)
                    scale3d(1.005, 1.005, 1.005)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale3d(1, 1, 1)';
            });
        });
    }
    
    // ========== BUTTON RIPPLE EFFECTS ==========
    setupButtonRipples() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-hero-primary, .btn-cta, .theme-option');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    top: ${y}px;
                    left: ${x}px;
                    pointer-events: none;
                    animation: rippleEffect 0.6s ease-out;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
        
        // Add ripple animation
        if (!document.getElementById('ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes rippleEffect {
                    from {
                        transform: scale(0);
                        opacity: 1;
                    }
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // ========== COUNTER ANIMATIONS ==========
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        
        const animateCounter = (element) => {
            const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target + (element.textContent.includes('+') ? '+' : '');
                }
            };
            
            updateCounter();
        };
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    // ========== PARALLAX EFFECTS ==========
    setupParallax() {
        // Parallax effects removed - no elements to animate
    }
    
    // ========== SMOOTH SCROLL TO ANCHORS ==========
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offset = 80; // Account for fixed nav
                    const targetPosition = target.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // ========== HOVER GLOW EFFECTS ==========
    setupHoverGlow() {
        const glowElements = document.querySelectorAll('.feature-icon, .logo-icon');
        
        glowElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.filter = 'drop-shadow(0 0 15px var(--secondary))';
                this.style.transform = 'scale(1.02)';
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.filter = 'none';
                this.style.transform = 'scale(1)';
            });
        });
    }
    
    // ========== LOADING ANIMATIONS ==========
    showLoadingAnimation() {
        const loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-crescent">☪</div>
                <div class="loader-text">جاري التحميل...</div>
            </div>
        `;
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeOut 0.5s ease 1.5s forwards;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .loader-crescent {
                font-size: 4rem;
                color: var(--secondary);
                animation: spin 2s linear infinite;
                margin-bottom: 1rem;
            }
            .loader-text {
                color: var(--text-secondary);
                font-size: 1.25rem;
                animation: pulse 1.5s ease-in-out infinite;
            }
            .loader-content {
                text-align: center;
                animation: fadeInUp 0.5s ease;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(loader);
        
        setTimeout(() => {
            loader.remove();
        }, 2000);
    }
    
    // ========== CELEBRATION ANIMATION ==========
    celebrateSuccess(message = 'مبروك!') {
        const celebration = document.createElement('div');
        celebration.className = 'celebration-overlay';
        celebration.innerHTML = `
            <div class="celebration-content">
                <div class="celebration-icon">🎉</div>
                <h2 class="celebration-message">${message}</h2>
            </div>
        `;
        celebration.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .celebration-content {
                text-align: center;
                animation: bounceIn 0.8s ease;
            }
            .celebration-icon {
                font-size: 6rem;
                margin-bottom: 1rem;
                animation: celebrate 1s ease infinite;
            }
            .celebration-message {
                color: var(--secondary);
                font-size: 3rem;
                text-shadow: 0 0 20px var(--secondary);
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(celebration);
        
        // Create confetti
        this.createConfetti();
        
        setTimeout(() => {
            celebration.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => celebration.remove(), 500);
        }, 3000);
    }
    
    // ========== CONFETTI EFFECT ==========
    createConfetti() {
        const colors = ['#d4af37', '#0d4d3d', '#2d7a5f', '#ffffff'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -20px;
                opacity: ${Math.random() * 0.8 + 0.2};
                z-index: 10001;
                animation: confetti ${Math.random() * 3 + 2}s linear forwards;
            `;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 5000);
        }
    }
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.animationsController = new AnimationsController();
    
    // Show loading animation on page load
    // Uncomment if you want loading animation
    // window.animationsController.showLoadingAnimation();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationsController;
}