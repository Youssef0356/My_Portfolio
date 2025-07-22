/**
 * MouseChaser - Interactive floating bubble game component
 * A playful element that moves around the screen and reacts to mouse proximity
 */

class MouseChaser {
    constructor(options = {}) {
        // Configuration with defaults
        this.config = {
            size: options.size || 40,
            speed: options.speed || 0.02,
            proximityRange: options.proximityRange || 100,
            escapeSpeed: options.escapeSpeed || 0.08,
            colors: options.colors || ['#969CFF', '#EC4899', '#3B82F6', '#10B981'],
            particleCount: options.particleCount || 8,
            enabled: options.enabled !== false,
            zIndex: options.zIndex || 1000,
            ...options
        };

        // Game state
        this.position = { x: 200, y: 200 };
        this.velocity = { x: 0, y: 0 };
        this.target = { x: 200, y: 200 };
        this.mouse = { x: 0, y: 0 };
        this.scale = 1;
        this.isEscaping = false;
        this.lastTime = 0;
        this.particles = [];
        this.currentColorIndex = 0;
        
        // Performance tracking
        this.frameCount = 0;
        this.lastFpsTime = 0;
        this.fps = 60;

        // DOM elements
        this.container = null;
        this.bubble = null;
        this.toggleButton = null;

        // Bind methods
        this.animate = this.animate.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.toggle = this.toggle.bind(this);

        this.init();
    }

    init() {
        if (!this.config.enabled) return;

        this.createElements();
        this.setupEventListeners();
        this.setRandomTarget();
        this.animate();
    }

    createElements() {
        // Create main container
        this.container = document.createElement('div');
        this.container.className = 'mouse-chaser-container';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: ${this.config.zIndex};
            overflow: hidden;
        `;

        // Create the bubble element
        this.bubble = document.createElement('div');
        this.bubble.className = 'mouse-chaser-bubble';
        this.bubble.style.cssText = `
            position: absolute;
            width: ${this.config.size}px;
            height: ${this.config.size}px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${this.config.colors[0]}88, ${this.config.colors[1]}88);
            backdrop-filter: blur(10px);
            border: 2px solid ${this.config.colors[0]}44;
            box-shadow: 
                0 8px 32px ${this.config.colors[0]}33,
                inset 0 2px 8px rgba(255,255,255,0.2);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            will-change: transform;
            cursor: pointer;
            pointer-events: auto;
        `;

        // Create toggle button for accessibility
        this.toggleButton = document.createElement('button');
        this.toggleButton.className = 'mouse-chaser-toggle';
        this.toggleButton.innerHTML = '🫧';
        this.toggleButton.title = 'Toggle floating bubble game';
        this.toggleButton.setAttribute('aria-label', 'Toggle interactive bubble game');
        this.toggleButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: rgba(150, 156, 255, 0.2);
            backdrop-filter: blur(10px);
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: ${this.config.zIndex + 1};
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Add hover effects to toggle button
        this.toggleButton.addEventListener('mouseenter', () => {
            this.toggleButton.style.background = 'rgba(150, 156, 255, 0.4)';
            this.toggleButton.style.transform = 'scale(1.1)';
        });

        this.toggleButton.addEventListener('mouseleave', () => {
            this.toggleButton.style.background = 'rgba(150, 156, 255, 0.2)';
            this.toggleButton.style.transform = 'scale(1)';
        });

        this.container.appendChild(this.bubble);
        document.body.appendChild(this.container);
        document.body.appendChild(this.toggleButton);

        // Set initial position
        this.updateBubblePosition();
    }

    setupEventListeners() {
        // Mouse tracking
        document.addEventListener('mousemove', this.handleMouseMove, { passive: true });
        
        // Touch tracking for mobile
        document.addEventListener('touchstart', this.handleMouseMove, { passive: true });
        document.addEventListener('touchmove', this.handleMouseMove, { passive: true });

        // Window resize
        window.addEventListener('resize', this.handleResize, { passive: true });
        
        // Toggle functionality
        this.toggleButton.addEventListener('click', this.toggle);
        
        // Keyboard accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.config.enabled) {
                this.toggle();
            }
        });

        // Bubble click interaction
        this.bubble.addEventListener('click', () => {
            this.createCatchEffect();
            this.changeColor();
        });

        // Pause on visibility change for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }

    handleMouseMove(e) {
        if (!this.config.enabled) return;
        
        const event = e.touches ? e.touches[0] : e;
        this.mouse.x = event.clientX;
        this.mouse.y = event.clientY;
    }

    handleResize() {
        if (!this.config.enabled) return;
        
        // Ensure bubble stays within bounds
        this.position.x = Math.max(this.config.size, Math.min(window.innerWidth - this.config.size, this.position.x));
        this.position.y = Math.max(this.config.size, Math.min(window.innerHeight - this.config.size, this.position.y));
        this.setRandomTarget();
    }

    animate(currentTime = 0) {
        if (!this.config.enabled) return;

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Calculate FPS for performance monitoring
        this.frameCount++;
        if (currentTime - this.lastFpsTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsTime = currentTime;
        }

        this.updateMovement(deltaTime);
        this.updateParticles(deltaTime);
        this.updateBubblePosition();

        requestAnimationFrame(this.animate);
    }

    updateMovement(deltaTime) {
        const distance = this.getDistance(this.mouse, this.position);
        
        // Check if mouse is within proximity range
        if (distance < this.config.proximityRange) {
            this.isEscaping = true;
            this.escapeFromMouse();
        } else {
            this.isEscaping = false;
            this.moveToTarget();
        }

        // Apply velocity with smooth interpolation
        const smoothing = Math.min(deltaTime * 0.01, 1);
        this.position.x += this.velocity.x * smoothing;
        this.position.y += this.velocity.y * smoothing;

        // Keep within screen bounds with padding
        const padding = this.config.size;
        this.position.x = Math.max(padding, Math.min(window.innerWidth - padding, this.position.x));
        this.position.y = Math.max(padding, Math.min(window.innerHeight - padding, this.position.y));

        // Set new random target when close to current target
        if (!this.isEscaping && this.getDistance(this.position, this.target) < 50) {
            this.setRandomTarget();
        }
    }

    escapeFromMouse() {
        const dx = this.position.x - this.mouse.x;
        const dy = this.position.y - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            const normalizedX = dx / distance;
            const normalizedY = dy / distance;
            
            this.velocity.x = normalizedX * this.config.escapeSpeed * 100;
            this.velocity.y = normalizedY * this.config.escapeSpeed * 100;
        }

        // Visual feedback when escaping
        const proximityEffect = (this.config.proximityRange - distance) / this.config.proximityRange;
        this.scale = 1.2 - proximityEffect * 0.3;
        this.bubble.style.filter = 'brightness(1.3) saturate(1.2)';
    }

    moveToTarget() {
        const dx = this.target.x - this.position.x;
        const dy = this.target.y - this.position.y;
        
        this.velocity.x = dx * this.config.speed;
        this.velocity.y = dy * this.config.speed;

        // Reset visual effects
        this.scale = 1;
        this.bubble.style.filter = 'brightness(1) saturate(1)';
    }

    setRandomTarget() {
        const padding = this.config.size * 2;
        this.target.x = padding + Math.random() * (window.innerWidth - padding * 2);
        this.target.y = padding + Math.random() * (window.innerHeight - padding * 2);
    }

    updateBubblePosition() {
        if (!this.bubble) return;
        
        this.bubble.style.transform = `translate3d(${this.position.x - this.config.size/2}px, ${this.position.y - this.config.size/2}px, 0) scale(${this.scale})`;
    }

    createCatchEffect() {
        // Create particle burst effect
        const catchX = this.position.x;
        const catchY = this.position.y;
        for (let i = 0; i < this.config.particleCount; i++) {
            this.createParticle(catchX, catchY);
        }

        // Bubble reaction
        this.scale = 1.5;
        this.bubble.style.filter = 'brightness(1.5) saturate(1.5)';
        
        setTimeout(() => {
            this.scale = 1;
            this.bubble.style.filter = 'brightness(1) saturate(1)';
        }, 200);
    }

    createParticle(x, y) {
        const particleEl = document.createElement('div');
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 3;
        const size = 4 + Math.random() * 8;
        
        particleEl.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: ${this.config.colors[Math.floor(Math.random() * this.config.colors.length)]}88;
            pointer-events: none;
            will-change: transform, opacity;
        `;

        this.container.appendChild(particleEl);

        this.particles.push({
            element: particleEl,
            x,
            y,
            angle,
            velocity,
            size,
            life: 1,
        });
    }

    changeColor() {
        this.currentColorIndex = (this.currentColorIndex + 1) % this.config.colors.length;
        const color1 = this.config.colors[this.currentColorIndex];
        const color2 = this.config.colors[(this.currentColorIndex + 1) % this.config.colors.length];
        
        this.bubble.style.background = `linear-gradient(135deg, ${color1}88, ${color2}88)`;
        this.bubble.style.borderColor = `${color1}44`;
        this.bubble.style.boxShadow = `
            0 8px 32px ${color1}33,
            inset 0 2px 8px rgba(255,255,255,0.2)
        `;
    }

    updateParticles(deltaTime) {
        const lifeDecrement = deltaTime / 800; // Lifespan of ~0.8s

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= lifeDecrement;

            if (p.life <= 0) {
                p.element.remove();
                this.particles.splice(i, 1);
                continue;
            }

            const travelDistance = p.velocity * (1 - p.life) * 60;
            const particleX = p.x + Math.cos(p.angle) * travelDistance;
            const particleY = p.y + Math.sin(p.angle) * travelDistance;
            
            p.element.style.transform = `translate3d(${particleX - p.size/2}px, ${particleY - p.size/2}px, 0) scale(${p.life})`;
            p.element.style.opacity = p.life;
        }
    }

    getDistance(point1, point2) {
        const dx = point1.x - point2.x;
        const dy = point1.y - point2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    toggle() {
        this.config.enabled = !this.config.enabled;
        
        if (this.config.enabled) {
            this.container.style.display = 'block';
            this.toggleButton.innerHTML = '🫧';
            this.toggleButton.title = 'Disable floating bubble game';
            this.animate();
        } else {
            this.container.style.display = 'none';
            this.toggleButton.innerHTML = '💤';
            this.toggleButton.title = 'Enable floating bubble game';
        }

        // Save preference to localStorage
        localStorage.setItem('mouseChaserEnabled', this.config.enabled);
    }

    pause() {
        this.config.enabled = false;
    }

    resume() {
        const savedPreference = localStorage.getItem('mouseChaserEnabled');
        if (savedPreference !== 'false') {
            this.config.enabled = true;
            this.animate();
        }
    }

    destroy() {
        // Clean up event listeners and DOM elements
        document.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('resize', this.handleResize);
        
        if (this.container) {
            this.container.remove();
        }
        if (this.toggleButton) {
            this.toggleButton.remove();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MouseChaser;
}

// Auto-initialize if script is loaded directly
if (typeof window !== 'undefined') {
    window.MouseChaser = MouseChaser;
}