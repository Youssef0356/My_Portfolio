/**
 * Advanced Particle System for 2077 Futuristic Effects
 * Creates dynamic floating particles with various behaviors
 */

class ParticleSystem {
    constructor(options = {}) {
        this.config = {
            particleCount: options.particleCount || 50,
            colors: options.colors || ['#00ffff', '#ff00ff', '#ffff00', '#00ff41'],
            minSize: options.minSize || 1,
            maxSize: options.maxSize || 4,
            speed: options.speed || 0.5,
            interactive: options.interactive !== false,
            connectionDistance: options.connectionDistance || 150,
            showConnections: options.showConnections !== false,
            ...options
        };

        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isRunning = false;

        this.init();
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.setupEventListeners();
        this.start();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'particle-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.8;
        `;
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * this.config.speed,
            vy: (Math.random() - 0.5) * this.config.speed,
            size: Math.random() * (this.config.maxSize - this.config.minSize) + this.config.minSize,
            color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
            opacity: Math.random() * 0.5 + 0.3,
            pulseSpeed: Math.random() * 0.02 + 0.01,
            pulsePhase: Math.random() * Math.PI * 2,
            trail: []
        };
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        if (this.config.interactive) {
            document.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });
        }

        // Pause on visibility change for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    update() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }

            // Keep particles in bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));

            // Update pulsing effect
            particle.pulsePhase += particle.pulseSpeed;
            particle.opacity = 0.3 + Math.sin(particle.pulsePhase) * 0.3;

            // Interactive mouse repulsion
            if (this.config.interactive) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.vx -= (dx / distance) * force * 0.01;
                    particle.vy -= (dy / distance) * force * 0.01;
                }
            }

            // Add to trail
            particle.trail.push({ x: particle.x, y: particle.y });
            if (particle.trail.length > 5) {
                particle.trail.shift();
            }

            // Limit velocity
            const maxVel = this.config.speed * 2;
            particle.vx = Math.max(-maxVel, Math.min(maxVel, particle.vx));
            particle.vy = Math.max(-maxVel, Math.min(maxVel, particle.vy));
        });
    }

    draw() {
        // Clear canvas with fade effect
        this.ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections
        if (this.config.showConnections) {
            this.drawConnections();
        }

        // Draw particles
        this.particles.forEach(particle => {
            this.drawParticle(particle);
        });
    }

    drawParticle(particle) {
        const ctx = this.ctx;
        
        // Draw trail
        if (particle.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
            
            for (let i = 1; i < particle.trail.length; i++) {
                ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
            }
            
            ctx.strokeStyle = particle.color + '20';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Draw particle with glow effect
        const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 3
        );
        gradient.addColorStop(0, particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.5, particle.color + '40');
        gradient.addColorStop(1, particle.color + '00');

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw core
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
    }

    drawConnections() {
        const ctx = this.ctx;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    const opacity = (1 - distance / this.config.connectionDistance) * 0.3;
                    
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    animate() {
        if (!this.isRunning) return;
        
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }

    pause() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    resume() {
        if (!this.isRunning) {
            this.start();
        }
    }

    destroy() {
        this.pause();
        if (this.canvas) {
            this.canvas.remove();
        }
        window.removeEventListener('resize', this.resize);
    }

    // Dynamic configuration updates
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        if (newConfig.particleCount && newConfig.particleCount !== this.particles.length) {
            this.createParticles();
        }
    }

    // Add burst effect at specific location
    addBurst(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 2 + 1;
            
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 3 + 1,
                color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                opacity: 1,
                pulseSpeed: 0.05,
                pulsePhase: 0,
                trail: [],
                life: 1,
                decay: 0.02
            });
        }

        // Remove burst particles after they fade
        setTimeout(() => {
            this.particles = this.particles.filter(p => p.life === undefined || p.life > 0);
        }, 2000);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticleSystem;
}

// Auto-initialize if script is loaded directly
if (typeof window !== 'undefined') {
    window.ParticleSystem = ParticleSystem;
}