/* ====================================
   PARTICLES SYSTEM
   Creates animated floating particles background
   ==================================== */

class ParticlesSystem {
    constructor(containerId = 'particles', options = {}) {
        this.container = document.getElementById(containerId);
        
        if (!this.container) {
            console.warn('Particles container not found');
            return;
        }
        
        // Configuration
        this.config = {
            particleCount: options.particleCount || 50,
            minSize: options.minSize || 2,
            maxSize: options.maxSize || 6,
            minSpeed: options.minSpeed || 20,
            maxSpeed: options.maxSpeed || 60,
            colors: options.colors || ['#d4af37', '#0d4d3d', '#2d7a5f'],
            shapes: options.shapes || ['circle', 'star', 'crescent']
        };
        
        this.particles = [];
        this.init();
    }
    
    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        // Set canvas size
        this.resize();
        
        // Create particles
        this.createParticles();
        
        // Start animation
        this.animate();
        
        // Handle resize
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * (this.config.maxSize - this.config.minSize) + this.config.minSize,
            speed: Math.random() * (this.config.maxSpeed - this.config.minSpeed) + this.config.minSpeed,
            color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
            shape: this.config.shapes[Math.floor(Math.random() * this.config.shapes.length)],
            opacity: Math.random() * 0.5 + 0.3,
            angle: Math.random() * Math.PI * 2,
            rotation: Math.random() * 0.02 - 0.01
        };
    }
    
    drawParticle(particle) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fillStyle = particle.color;
        
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.angle);
        
        switch (particle.shape) {
            case 'circle':
                this.drawCircle(particle);
                break;
            case 'star':
                this.drawStar(particle);
                break;
            case 'crescent':
                this.drawCrescent(particle);
                break;
        }
        
        this.ctx.restore();
    }
    
    drawCircle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawStar(particle) {
        const spikes = 5;
        const outerRadius = particle.size;
        const innerRadius = particle.size / 2;
        
        this.ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / spikes;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawCrescent(particle) {
        const radius = particle.size;
        
        // Draw full circle
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Cut out smaller circle to create crescent
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.beginPath();
        this.ctx.arc(radius * 0.3, 0, radius * 0.7, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalCompositeOperation = 'source-over';
    }
    
    updateParticle(particle, deltaTime) {
        // Move particle up
        particle.y -= (particle.speed * deltaTime) / 1000;
        
        // Slight horizontal movement
        particle.x += Math.sin(particle.angle) * 0.5;
        
        // Rotate particle
        particle.angle += particle.rotation;
        
        // Pulse opacity
        particle.opacity += Math.sin(Date.now() * 0.001) * 0.001;
        particle.opacity = Math.max(0.2, Math.min(0.8, particle.opacity));
        
        // Reset particle when it goes off screen
        if (particle.y < -particle.size) {
            particle.y = this.canvas.height + particle.size;
            particle.x = Math.random() * this.canvas.width;
        }
        
        if (particle.x < -particle.size) {
            particle.x = this.canvas.width + particle.size;
        } else if (particle.x > this.canvas.width + particle.size) {
            particle.x = -particle.size;
        }
    }
    
    animate() {
        let lastTime = Date.now();
        
        const loop = () => {
            const currentTime = Date.now();
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;
            
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Update and draw particles
            this.particles.forEach(particle => {
                this.updateParticle(particle, deltaTime);
                this.drawParticle(particle);
            });
            
            requestAnimationFrame(loop);
        };
        
        loop();
    }
    
    // Public methods to control particles
    pause() {
        this.paused = true;
    }
    
    resume() {
        this.paused = false;
    }
    
    destroy() {
        if (this.canvas) {
            this.canvas.remove();
        }
        this.particles = [];
    }
    
    updateColors(colors) {
        this.config.colors = colors;
        this.particles.forEach(particle => {
            particle.color = colors[Math.floor(Math.random() * colors.length)];
        });
    }
}

// Initialize particles when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create particles with Islamic-themed shapes
    window.particlesSystem = new ParticlesSystem('particles', {
        particleCount: 40,
        minSize: 3,
        maxSize: 8,
        minSpeed: 15,
        maxSpeed: 50,
        shapes: ['circle', 'star', 'crescent'],
        colors: ['#d4af37', '#0d4d3d', '#2d7a5f', 'rgba(212, 175, 55, 0.6)']
    });
    
    // Update particle colors when theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const body = document.body;
                let colors;
                
                if (body.classList.contains('gold-theme')) {
                    colors = ['#c9a961', '#1a3a2e', '#8b7355', 'rgba(201, 169, 97, 0.6)'];
                } else if (body.classList.contains('ruby-theme')) {
                    colors = ['#8b0000', '#d4af37', '#b33030', 'rgba(139, 0, 0, 0.6)'];
                } else if (body.classList.contains('night-theme')) {
                    colors = ['#2d5f5d', '#4a90a4', '#1a1f2e', 'rgba(74, 144, 164, 0.6)'];
                } else if (body.classList.contains('sadness-theme')) {
                    colors = ['#660000', '#1a1a1a', '#4d0000', 'rgba(102, 0, 0, 0.6)'];
                } else {
                    colors = ['#d4af37', '#0d4d3d', '#2d7a5f', 'rgba(212, 175, 55, 0.6)'];
                }
                
                if (window.particlesSystem) {
                    window.particlesSystem.updateColors(colors);
                }
            }
        });
    });
    
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticlesSystem;
}