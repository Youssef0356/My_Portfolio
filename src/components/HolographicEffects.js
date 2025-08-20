/**
 * Holographic Effects System
 * Creates advanced visual effects for 2077 aesthetic
 */

class HolographicEffects {
    constructor() {
        this.effects = new Map();
        this.observers = new Map();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.initializeEffects();
        this.setupEventListeners();
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.activateEffect(entry.target);
                } else {
                    this.deactivateEffect(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
    }

    initializeEffects() {
        // Initialize holographic text effects
        document.querySelectorAll('.holo-text').forEach(element => {
            this.setupHolographicText(element);
        });

        // Initialize glitch effects
        document.querySelectorAll('.glitch-text').forEach(element => {
            this.setupGlitchText(element);
        });

        // Initialize floating elements
        document.querySelectorAll('.float-element').forEach(element => {
            this.setupFloatingElement(element);
        });

        // Initialize scan line effects
        document.querySelectorAll('.scan-lines').forEach(element => {
            this.setupScanLines(element);
        });
    }

    setupHolographicText(element) {
        const text = element.textContent;
        element.setAttribute('data-text', text);
        
        // Add holographic shimmer effect
        const shimmer = document.createElement('div');
        shimmer.className = 'holo-shimmer';
        shimmer.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            animation: shimmerPass 3s ease-in-out infinite;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.appendChild(shimmer);
        
        this.observer.observe(element);
    }

    setupGlitchText(element) {
        const text = element.textContent;
        element.setAttribute('data-text', text);
        
        // Random glitch intervals
        const glitchInterval = setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                element.classList.add('glitching');
                setTimeout(() => {
                    element.classList.remove('glitching');
                }, 200);
            }
        }, 1000);
        
        this.effects.set(element, { type: 'glitch', interval: glitchInterval });
    }

    setupFloatingElement(element) {
        const amplitude = parseFloat(element.dataset.amplitude) || 20;
        const speed = parseFloat(element.dataset.speed) || 0.02;
        const phase = Math.random() * Math.PI * 2;
        
        let startTime = Date.now();
        
        const animate = () => {
            const elapsed = (Date.now() - startTime) * speed;
            const y = Math.sin(elapsed + phase) * amplitude;
            const x = Math.cos(elapsed * 0.5 + phase) * (amplitude * 0.3);
            
            element.style.transform = `translate3d(${x}px, ${y}px, 0) rotateY(${Math.sin(elapsed) * 5}deg)`;
            
            if (this.effects.has(element)) {
                requestAnimationFrame(animate);
            }
        };
        
        this.effects.set(element, { type: 'float', animate });
        animate();
    }

    setupScanLines(element) {
        const scanLine = document.createElement('div');
        scanLine.className = 'scan-line';
        scanLine.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #00ffff, transparent);
            animation: scanMove 2s linear infinite;
            pointer-events: none;
            z-index: 10;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(scanLine);
        
        // Add scan line CSS animation
        if (!document.querySelector('#scan-animations')) {
            const style = document.createElement('style');
            style.id = 'scan-animations';
            style.textContent = `
                @keyframes scanMove {
                    0% { top: 0; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Data visualization effects
    createDataStream(container, data) {
        const stream = document.createElement('div');
        stream.className = 'data-stream';
        stream.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            pointer-events: none;
        `;
        
        data.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'data-bar';
            bar.style.cssText = `
                position: absolute;
                bottom: 0;
                left: ${(index / data.length) * 100}%;
                width: ${100 / data.length}%;
                height: ${value}%;
                background: linear-gradient(to top, #00ffff, #ff00ff);
                animation: dataGrow 1s ease-out ${index * 0.1}s both;
                border-top: 1px solid rgba(255, 255, 255, 0.5);
            `;
            stream.appendChild(bar);
        });
        
        container.appendChild(stream);
        
        // Add grow animation
        if (!document.querySelector('#data-animations')) {
            const style = document.createElement('style');
            style.id = 'data-animations';
            style.textContent = `
                @keyframes dataGrow {
                    from { height: 0; opacity: 0; }
                    to { height: var(--height); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Holographic projection effect
    createHologram(element, options = {}) {
        const hologram = document.createElement('div');
        hologram.className = 'hologram-projection';
        hologram.style.cssText = `
            position: absolute;
            top: -20px;
            left: -20px;
            right: -20px;
            bottom: -20px;
            background: 
                linear-gradient(45deg, transparent 30%, rgba(0, 255, 255, 0.1) 50%, transparent 70%),
                linear-gradient(-45deg, transparent 30%, rgba(255, 0, 255, 0.1) 50%, transparent 70%);
            background-size: 20px 20px;
            animation: hologramFlicker 0.1s infinite alternate;
            pointer-events: none;
            z-index: -1;
            border-radius: inherit;
        `;
        
        element.style.position = 'relative';
        element.appendChild(hologram);
        
        // Add flicker animation
        if (!document.querySelector('#hologram-animations')) {
            const style = document.createElement('style');
            style.id = 'hologram-animations';
            style.textContent = `
                @keyframes hologramFlicker {
                    0% { opacity: 0.8; }
                    100% { opacity: 0.9; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Matrix-style digital rain
    createDigitalRain(container) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        
        container.appendChild(canvas);
        
        const resizeCanvas = () => {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = Array(columns).fill(0);
        
        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#00ff41';
            ctx.font = `${fontSize}px monospace`;
            
            drops.forEach((y, x) => {
                const char = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(char, x * fontSize, y * fontSize);
                
                if (y * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[x] = 0;
                }
                drops[x]++;
            });
            
            requestAnimationFrame(draw);
        };
        
        draw();
    }

    // Circuit board pattern
    createCircuitPattern(element) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.3;
        `;
        
        // Generate random circuit paths
        const paths = [];
        for (let i = 0; i < 20; i++) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const d = this.generateCircuitPath();
            path.setAttribute('d', d);
            path.setAttribute('stroke', '#00ffff');
            path.setAttribute('stroke-width', '1');
            path.setAttribute('fill', 'none');
            path.setAttribute('opacity', '0.6');
            
            // Animate the path
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.style.animation = `drawPath 3s ease-in-out infinite ${i * 0.2}s`;
            
            svg.appendChild(path);
        }
        
        element.appendChild(svg);
        
        // Add path animation
        if (!document.querySelector('#circuit-animations')) {
            const style = document.createElement('style');
            style.id = 'circuit-animations';
            style.textContent = `
                @keyframes drawPath {
                    0%, 20% { stroke-dashoffset: var(--length); }
                    80%, 100% { stroke-dashoffset: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    generateCircuitPath() {
        const width = 300;
        const height = 200;
        const segments = 5 + Math.floor(Math.random() * 10);
        
        let path = `M ${Math.random() * width} ${Math.random() * height}`;
        
        for (let i = 0; i < segments; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            
            if (Math.random() > 0.5) {
                path += ` L ${x} ${y}`;
            } else {
                const cx = Math.random() * width;
                const cy = Math.random() * height;
                path += ` Q ${cx} ${cy} ${x} ${y}`;
            }
        }
        
        return path;
    }

    activateEffect(element) {
        element.classList.add('effect-active');
        
        if (this.effects.has(element)) {
            const effect = this.effects.get(element);
            if (effect.animate) {
                effect.animate();
            }
        }
    }

    deactivateEffect(element) {
        element.classList.remove('effect-active');
    }

    setupEventListeners() {
        // Add click effects
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cyber-button')) {
                this.createClickRipple(e.target, e.clientX, e.clientY);
            }
        });
        
        // Add hover effects
        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('holo-card')) {
                this.activateCardHover(e.target);
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('holo-card')) {
                this.deactivateCardHover(e.target);
            }
        });
    }

    createClickRipple(element, x, y) {
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('div');
        
        ripple.style.cssText = `
            position: absolute;
            left: ${x - rect.left}px;
            top: ${y - rect.top}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(0, 255, 255, 0.6);
            transform: translate(-50%, -50%);
            animation: rippleExpand 0.6s ease-out;
            pointer-events: none;
            z-index: 10;
        `;
        
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
        
        // Add ripple animation if not exists
        if (!document.querySelector('#ripple-animations')) {
            const style = document.createElement('style');
            style.id = 'ripple-animations';
            style.textContent = `
                @keyframes rippleExpand {
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

    activateCardHover(element) {
        // Add dynamic lighting effect
        const light = document.createElement('div');
        light.className = 'card-light';
        light.style.cssText = `
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%);
            pointer-events: none;
            z-index: -1;
            animation: lightPulse 2s ease-in-out infinite;
        `;
        
        element.appendChild(light);
    }

    deactivateCardHover(element) {
        const light = element.querySelector('.card-light');
        if (light) {
            light.remove();
        }
    }

    destroy() {
        // Clean up all effects
        this.effects.forEach((effect, element) => {
            if (effect.interval) {
                clearInterval(effect.interval);
            }
        });
        
        this.effects.clear();
        
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HolographicEffects;
}

// Auto-initialize if script is loaded directly
if (typeof window !== 'undefined') {
    window.HolographicEffects = HolographicEffects;
}