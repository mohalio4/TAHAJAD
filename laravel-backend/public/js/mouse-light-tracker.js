/* ====================================
   MOUSE LIGHT TRACKER
   Global mouse tracking light effect
   ==================================== */

class MouseLightTracker {
    constructor() {
        this.tracker = null;
        this.init();
    }
    
    init() {
        // Create tracker element if it doesn't exist
        if (!document.getElementById('mouseLightTracker')) {
            this.tracker = document.createElement('div');
            this.tracker.id = 'mouseLightTracker';
            this.tracker.className = 'mouse-light-tracker';
            document.body.appendChild(this.tracker);
        } else {
            this.tracker = document.getElementById('mouseLightTracker');
        }
        
        // Set up mouse tracking
        this.setupMouseTracking();
    }
    
    setupMouseTracking() {
        let mouseX = 0;
        let mouseY = 0;
        let trackerX = 0;
        let trackerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Smooth animation loop
        const animate = () => {
            // Smooth interpolation
            trackerX += (mouseX - trackerX) * 0.1;
            trackerY += (mouseY - trackerY) * 0.1;
            
            if (this.tracker) {
                this.tracker.style.left = trackerX + 'px';
                this.tracker.style.top = trackerY + 'px';
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
        
        // Hide tracker when mouse leaves window
        document.addEventListener('mouseleave', () => {
            if (this.tracker) {
                this.tracker.style.opacity = '0';
            }
        });
        
        document.addEventListener('mouseenter', () => {
            if (this.tracker) {
                this.tracker.style.opacity = '1';
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.mouseLightTracker = new MouseLightTracker();
});

