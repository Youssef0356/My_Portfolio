/**
 * Cyber Navigation System
 * Advanced navigation with futuristic interactions
 */

class CyberNavigation {
    constructor(options = {}) {
        this.config = {
            selector: options.selector || 'nav',
            glitchEffect: options.glitchEffect !== false,
            soundEffects: options.soundEffects !== false,
            particleTrail: options.particleTrail !== false,
            ...options
        };

        this.nav = null;
        this.particles = [];
        this.audioContext = null;
        this.sounds = {};

        this.init();
    }

    init() {
        this.nav = document.querySelector(this.config.selector);
        if (!this.nav) return;

        this.setupNavigation();
        this.setupAudio();
        this.setupEventListeners();
        this.createParticleSystem();
    }

    setupNavigation() {
        // Add cyber styling to navigation
        this.nav.classList.add('cyber-nav');
        
        // Enhance navigation items
        const navItems = this.nav.querySelectorAll('a');
        navItems.forEach((item, index) => {
            this.enhanceNavItem(item, index);
        });

        // Add navigation scanner
        this.createNavigationScanner();
        
        // Add holographic logo effect
        this.enhanceLogo();
    }

    enhanceNavItem(item, index) {
        item.classList.add('cyber-nav-item');
        
        // Add data attributes for effects
        item.setAttribute('data-nav-index', index);
        item.setAttribute('data-original-text', item.textContent);
        
        // Create hover indicator
        const indicator = document.createElement('div');
        indicator.className = 'nav-indicator';
        indicator.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, #00ffff, #ff00ff);
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        item.style.position = 'relative';
        item.appendChild(indicator);
        
        // Add glitch text container
        if (this.config.glitchEffect) {
            const glitchContainer = document.createElement('span');
            glitchContainer.className = 'nav-glitch-container';
            glitchContainer.innerHTML = item.innerHTML;
            item.innerHTML = '';
            item.appendChild(glitchContainer);
        }
    }

    createNavigationScanner() {
        const scanner = document.createElement('div');
        scanner.className = 'nav-scanner';
        scanner.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 2px;
            height: 100%;
            background: linear-gradient(to bottom, transparent, #00ffff, transparent);
            animation: navScan 4s linear infinite;
            pointer-events: none;
            z-index: 10;
        `;
        
        this.nav.appendChild(scanner);
        
        // Add scanner animation
        if (!document.querySelector('#nav-scanner-animations')) {
            const style = document.createElement('style');
            style.id = 'nav-scanner-animations';
            style.textContent = `
                @keyframes navScan {
                    0% { left: 0; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { left: 100%; opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    enhanceLogo() {
        const logo = this.nav.querySelector('[class*="logo"], .brand, h1, .title');
        if (!logo) return;

        logo.classList.add('cyber-logo');
        
        // Add holographic effect
        const holoEffect = document.createElement('div');
        holoEffect.className = 'logo-holo-effect';
        holoEffect.style.cssText = `
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #00ffff, #ff00ff, #ffff00, #00ffff);
            background-size: 400% 400%;
            animation: logoHolo 3s ease-in-out infinite;
            z-index: -1;
            border-radius: inherit;
            filter: blur(1px);
            opacity: 0.7;
        `;
        
        logo.style.position = 'relative';
        logo.appendChild(holoEffect);
        
        // Add logo animation
        if (!document.querySelector('#logo-animations')) {
            const style = document.createElement('style');
            style.id = 'logo-animations';
            style.textContent = `
                @keyframes logoHolo {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupAudio() {
        if (!this.config.soundEffects) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
        } catch (e) {
            console.warn('Audio context not supported');
        }
    }

    createSounds() {
        // Create hover sound
        this.sounds.hover = this.createTone(800, 0.1, 'sine');
        this.sounds.click = this.createTone(1200, 0.2, 'square');
        this.sounds.scan = this.createTone(400, 0.3, 'sawtooth');
    }

    createTone(frequency, duration, type = 'sine') {
        return () => {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    createParticleSystem() {
        if (!this.config.particleTrail) return;
        
        this.particleCanvas = document.createElement('canvas');
        this.particleCanvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 5;
        `;
        
        this.nav.appendChild(this.particleCanvas);
        this.particleCtx = this.particleCanvas.getContext('2d');
        
        this.resizeParticleCanvas();
        window.addEventListener('resize', () => this.resizeParticleCanvas());
        
        this.animateParticles();
    }

    resizeParticleCanvas() {
        if (!this.particleCanvas) return;
        
        const rect = this.nav.getBoundingClientRect();
        this.particleCanvas.width = rect.width;
        this.particleCanvas.height = rect.height;
    }

    addParticle(x, y) {
        this.particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 1,
            decay: 0.02,
            size: Math.random() * 3 + 1,
            color: ['#00ffff', '#ff00ff', '#ffff00'][Math.floor(Math.random() * 3)]
        });
    }

    animateParticles() {
        if (!this.particleCtx) return;
        
        this.particleCtx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
        
        // Update and draw particles
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            if (particle.life <= 0) return false;
            
            this.particleCtx.save();
            this.particleCtx.globalAlpha = particle.life;
            this.particleCtx.fillStyle = particle.color;
            this.particleCtx.beginPath();
            this.particleCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.particleCtx.fill();
            this.particleCtx.restore();
            
            return true;
        });
        
        requestAnimationFrame(() => this.animateParticles());
    }

    setupEventListeners() {
        const navItems = this.nav.querySelectorAll('.cyber-nav-item');
        
        navItems.forEach(item => {
            // Hover effects
            item.addEventListener('mouseenter', (e) => {
                this.handleNavHover(e.target);
            });
            
            item.addEventListener('mouseleave', (e) => {
                this.handleNavLeave(e.target);
            });
            
            // Click effects
            item.addEventListener('click', (e) => {
                this.handleNavClick(e.target, e);
            });
            
            // Mouse move for particle trail
            if (this.config.particleTrail) {
                item.addEventListener('mousemove', (e) => {
                    const rect = this.nav.getBoundingClientRect();
                    this.addParticle(
                        e.clientX - rect.left,
                        e.clientY - rect.top
                    );
                });
            }
        });
        
        // Mobile touch support
        navItems.forEach(item => {
            item.addEventListener('touchstart', (e) => {
                this.handleNavHover(e.target);
            });
        });
    }

    handleNavHover(item) {
        const indicator = item.querySelector('.nav-indicator');
        if (indicator) {
            indicator.style.width = '100%';
        }
        
        // Play hover sound
        if (this.sounds.hover) {
            this.sounds.hover();
        }
        
        // Glitch effect
        if (this.config.glitchEffect && Math.random() < 0.3) {
            this.triggerGlitch(item);
        }
        
        // Add glow effect
        item.style.textShadow = '0 0 10px currentColor';
    }

    handleNavLeave(item) {
        const indicator = item.querySelector('.nav-indicator');
        if (indicator) {
            indicator.style.width = '0';
        }
        
        // Remove glow effect
        item.style.textShadow = '';
    }

    handleNavClick(item, event) {
        // Play click sound
        if (this.sounds.click) {
            this.sounds.click();
        }
        
        // Create click ripple
        this.createClickRipple(item, event);
        
        // Trigger navigation scan
        this.triggerNavigationScan();
    }

    triggerGlitch(item) {
        const container = item.querySelector('.nav-glitch-container');
        if (!container) return;
        
        const originalText = item.getAttribute('data-original-text');
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        let glitchText = '';
        for (let i = 0; i < originalText.length; i++) {
            if (Math.random() < 0.3) {
                glitchText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            } else {
                glitchText += originalText[i];
            }
        }
        
        container.textContent = glitchText;
        
        setTimeout(() => {
            container.textContent = originalText;
        }, 100);
    }

    createClickRipple(item, event) {
        const rect = item.getBoundingClientRect();
        const ripple = document.createElement('div');
        
        ripple.style.cssText = `
            position: absolute;
            left: ${event.clientX - rect.left}px;
            top: ${event.clientY - rect.top}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(0, 255, 255, 0.6);
            transform: translate(-50%, -50%);
            animation: navRipple 0.6s ease-out;
            pointer-events: none;
            z-index: 10;
        `;
        
        item.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
        
        // Add ripple animation
        if (!document.querySelector('#nav-ripple-animations')) {
            const style = document.createElement('style');
            style.id = 'nav-ripple-animations';
            style.textContent = `
                @keyframes navRipple {
                    to {
                        width: 100px;
                        height: 100px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    triggerNavigationScan() {
        const scanner = this.nav.querySelector('.nav-scanner');
        if (scanner) {
            scanner.style.animation = 'none';
            setTimeout(() => {
                scanner.style.animation = 'navScan 1s linear';
            }, 10);
        }
    }

    // Adaptive navigation based on scroll
    setupScrollEffects() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down - hide nav
                this.nav.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show nav
                this.nav.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
            
            // Add scroll-based effects
            const scrollProgress = Math.min(currentScrollY / window.innerHeight, 1);
            this.nav.style.backdropFilter = `blur(${10 + scrollProgress * 10}px)`;
        });
    }

    destroy() {
        // Clean up audio context
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        // Remove particle canvas
        if (this.particleCanvas) {
            this.particleCanvas.remove();
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.resizeParticleCanvas);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CyberNavigation;
}

// Auto-initialize if script is loaded directly
if (typeof window !== 'undefined') {
    window.CyberNavigation = CyberNavigation;
}