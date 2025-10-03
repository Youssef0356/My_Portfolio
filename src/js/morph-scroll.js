// 3D Morph Scroll Effect JavaScript
class MorphScrollEffect {
    constructor() {
        this.container = null;
        this.items = [];
        this.scrollProgress = 0;
        this.isAnimating = false;
        this.softSkills = [
            { name: "Creative", icon: "🎨", description: "Innovative visual thinking" },
            { name: "Adaptive", icon: "🔄", description: "Quick to learn and adjust" },
            { name: "Detail-Oriented", icon: "🔍", description: "Precision in every project" },
            { name: "Collaborative", icon: "🤝", description: "Team player mindset" },
            { name: "Problem Solver", icon: "💡", description: "Strategic thinking" },
            { name: "Passionate", icon: "🔥", description: "Dedicated to excellence" }
        ];
        this.images = [];
        this.currentImageIndex = 0;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.container = document.querySelector('.morph-scroll-section');
        if (!this.container) return;

        // Load images
        this.loadImages();
        
        // Create elements
        this.createMorphElements();
        this.createSoftSkillsOrbs();
        
        // Setup event listeners
        this.setupScrollListener();
        this.setupMouseTracking();
        this.setupIntersectionObserver();
        this.setupTimelineTrigger();
        
        // Start animation
        requestAnimationFrame(() => this.animate());
    }

    loadImages() {
        // Load images from Spiral Scroll Images folder
        for (let i = 1; i <= 14; i++) {
            this.images.push({
                src: `Images/Spiral Scroll Images/1 (${i}).jpg`,
                title: this.getTitleForImage(i),
                description: this.getDescriptionForImage(i)
            });
        }
    }

    getTitleForImage(index) {
        const titles = [
            "Innovation", "Creativity", "Vision", "Design", "Technology",
            "Artistry", "Development", "Excellence", "Precision", "Mastery",
            "Growth", "Evolution", "Future", "Dreams"
        ];
        return titles[index - 1] || `Project ${index}`;
    }

    getDescriptionForImage(index) {
        const descriptions = [
            "Pushing boundaries in digital art",
            "Crafting unique visual experiences",
            "Bringing ideas to life through code",
            "Merging art with technology",
            "Creating immersive digital worlds",
            "Transforming concepts into reality",
            "Building tomorrow's solutions",
            "Pursuing perfection in every pixel",
            "Attention to every detail",
            "Continuous learning and growth",
            "Adapting to new challenges",
            "Evolving with technology",
            "Shaping the digital future",
            "Making dreams tangible"
        ];
        return descriptions[index - 1] || "Exploring new possibilities";
    }

    createMorphElements() {
        const spiralContainer = document.querySelector('.spiral-container');
        const morphTrack = document.querySelector('.morph-track');
        
        if (!spiralContainer || !morphTrack) return;

        // Create morph items in a 3D spiral helix pattern
        this.images.forEach((image, index) => {
            const morphItem = document.createElement('div');
            morphItem.className = 'morph-item';
            morphItem.dataset.index = index;

            // Create 3D spiral helix positioning
            const totalItems = this.images.length;
            const angleStep = (Math.PI * 2) / totalItems;
            const angle = index * angleStep;
            const radius = 400; // Fixed radius for circular spiral
            const verticalSpacing = 60; // Vertical spacing between items
            
            // Calculate position in 3D space
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = (index - totalItems / 2) * verticalSpacing;

            // Initial transform for spiral positioning
            morphItem.style.transform = `
                translate3d(${x}px, ${y}px, ${z}px)
                rotateY(${angle * 180 / Math.PI}deg)
                rotateX(15deg)
                scale(0.8)
            `;

            // Create inner structure for 3D flip effect
            const innerDiv = document.createElement('div');
            innerDiv.className = 'morph-item-inner';
            
            const frontFace = document.createElement('div');
            frontFace.className = 'morph-item-face morph-item-front';
            frontFace.innerHTML = `<img src="${image.src}" alt="${image.title}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;">`;
            
            const backFace = document.createElement('div');
            backFace.className = 'morph-item-face morph-item-back';
            backFace.innerHTML = `
                <div class="morph-content" style="padding: 20px; height: 100%; display: flex; flex-direction: column; justify-content: center; color: white;">
                    <h3 class="morph-title" style="font-size: 1.5rem; margin-bottom: 10px;">${image.title}</h3>
                    <p class="morph-description" style="font-size: 0.9rem; opacity: 0.8;">${image.description}</p>
                </div>
            `;
            
            innerDiv.appendChild(frontFace);
            innerDiv.appendChild(backFace);
            morphItem.appendChild(innerDiv);

            morphTrack.appendChild(morphItem);
            this.items.push(morphItem);
        });
    }

    createSoftSkillsOrbs() {
        const skillsContainer = document.querySelector('.soft-skills-morph');
        if (!skillsContainer) return;

        this.softSkills.forEach((skill, index) => {
            const orb = document.createElement('div');
            orb.className = 'skill-orb';
            
            // Position orbs in a circle
            const angle = (index / this.softSkills.length) * Math.PI * 2;
            const radius = 200;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            orb.style.left = `calc(50% + ${x}px)`;
            orb.style.top = `calc(50% + ${y}px)`;
            orb.style.animationDelay = `${index * 0.2}s`;
            
            orb.innerHTML = `
                <div>
                    <span style="font-size: 2rem">${skill.icon}</span>
                    <div style="font-size: 0.7rem; margin-top: 5px">${skill.name}</div>
                </div>
            `;
            
            orb.title = skill.description;
            skillsContainer.appendChild(orb);
        });
    }

    setupScrollListener() {
        let ticking = false;
        let lastScrollY = 0;
        let scrollVelocity = 0;
        
        // Smooth scroll interpolation
        this.targetScrollProgress = 0;
        this.currentScrollProgress = 0;
        this.scrollEase = 0.08; // Smooth easing factor
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
                    scrollVelocity = currentScrollY - lastScrollY;
                    lastScrollY = currentScrollY;
                    
                    this.handleScroll(scrollVelocity);
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Start smooth animation loop
        this.startSmoothAnimation();
    }

    handleScroll(velocity = 0) {
        const spiralContainer = document.querySelector('.spiral-container');
        if (!spiralContainer) return;

        // Calculate scroll progress from the entire page
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        this.targetScrollProgress = Math.min(1, Math.max(0, scrollTop / documentHeight));
        
        // Store velocity for dynamic effects
        this.scrollVelocity = velocity;
    }
    
    startSmoothAnimation() {
        const animate = () => {
            // Smooth interpolation
            this.currentScrollProgress += (this.targetScrollProgress - this.currentScrollProgress) * this.scrollEase;
            this.scrollProgress = this.currentScrollProgress;
            
            // Apply transformations with smooth progress
            this.applyMorphTransformations();
            this.updateSkillOrbs();
            this.updateJourneyTextPosition();
            this.updateFadeMorphing();
            
            requestAnimationFrame(animate);
        };
        animate();
    }

    applyMorphTransformations() {
        const morphTrack = document.querySelector('.morph-track');
        const spiralContainer = document.querySelector('.spiral-container');
        if (!morphTrack || !spiralContainer) return;

        // Enhanced spiral container movement with velocity
        const containerY = Math.sin(this.scrollProgress * Math.PI * 2) * 30;
        const velocityEffect = (this.scrollVelocity || 0) * 0.1;
        spiralContainer.style.transform = `translateY(${containerY + velocityEffect}px)`;

        // Smoother main spiral rotation
        const mainRotation = this.scrollProgress * 1080; // Three full rotations
        const tiltX = Math.sin(this.scrollProgress * Math.PI * 2) * 15;
        const tiltZ = Math.cos(this.scrollProgress * Math.PI * 3) * 8;
        
        morphTrack.style.transform = `
            perspective(2500px)
            rotateY(${mainRotation}deg)
            rotateX(${tiltX}deg)
            rotateZ(${tiltZ}deg)
        `;

        // Enhanced individual item transformations
        this.items.forEach((item, index) => {
            const totalItems = this.items.length;
            const angleStep = (Math.PI * 2) / totalItems;
            const baseAngle = index * angleStep;
            
            // Smoother scroll offset calculation
            const scrollOffset = this.scrollProgress * Math.PI * 6;
            const dynamicAngle = baseAngle + scrollOffset;
            
            // Enhanced 3D Spiral helix with wave motion
            const waveOffset = Math.sin(this.scrollProgress * Math.PI * 3 + index * 0.4) * 30;
            const radius = 380 + Math.sin(scrollOffset + index * 0.5) * 80 + waveOffset;
            const x = Math.cos(dynamicAngle) * radius;
            const z = Math.sin(dynamicAngle) * radius - 250;
            const y = (index - totalItems / 2) * 70 + Math.sin(scrollOffset + index) * 25;
            
            // Smoother individual rotations
            const itemRotationY = (dynamicAngle * 180 / Math.PI) + this.scrollProgress * 540;
            const itemRotationX = Math.sin(scrollOffset + index * 0.3) * 25 + (this.scrollVelocity || 0) * 0.5;
            const itemRotationZ = Math.cos(scrollOffset + index * 0.2) * 15;
            
            // Enhanced scaling with smooth transitions
            const distanceFromCenter = Math.sqrt(x * x + y * y + z * z);
            const baseScale = Math.max(0.4, Math.min(1.2, 900 / distanceFromCenter));
            const pulseScale = 1 + Math.sin(this.scrollProgress * Math.PI * 4 + index) * 0.1;
            const scale = baseScale * pulseScale;
            
            // Apply transformations with smooth transitions
            item.style.transform = `
                translate3d(${x}px, ${y}px, ${z}px)
                rotateY(${itemRotationY}deg)
                rotateX(${itemRotationX}deg)
                rotateZ(${itemRotationZ}deg)
                scale(${scale})
            `;
            
            // Enhanced 3D card flip with smooth timing
            const inner = item.querySelector('.morph-item-inner');
            if (inner) {
                const flipProgress = (this.scrollProgress * totalItems * 2 + index) % 2;
                const flipAngle = flipProgress > 1 ? 180 : 0;
                const smoothFlip = this.easeInOutCubic(Math.abs(flipProgress - 1));
                inner.style.transform = `rotateY(${flipAngle * smoothFlip}deg)`;
            }
            
            // Enhanced depth effects with smoother transitions
            const normalizedZ = (z + 700) / 1400;
            const depthOpacity = 0.2 + normalizedZ * 0.7;
            const depthBlur = Math.max(0, (1 - normalizedZ) * 1.5);
            const brightness = 0.5 + normalizedZ * 0.6;
            
            item.style.opacity = depthOpacity;
            item.style.filter = `blur(${depthBlur}px) brightness(${brightness}) saturate(${1 + normalizedZ * 0.3})`;
            item.style.zIndex = Math.floor(normalizedZ * 15);
        });
    }
    
    // Smooth easing function
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    updateSkillOrbs() {
        const orbs = document.querySelectorAll('.skill-orb');
        orbs.forEach((orb, index) => {
            const orbProgress = (this.scrollProgress * 2 + index * 0.1) % 1;
            const scale = 1 + Math.sin(orbProgress * Math.PI * 2) * 0.3;
            const rotation = orbProgress * 360;
            
            orb.style.transform = `
                scale(${scale})
                rotate(${rotation}deg)
                translateZ(${Math.sin(orbProgress * Math.PI) * 50}px)
            `;
        });
    }

    setupMouseTracking() {
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        const updateMouseEffect = () => {
            targetX += (mouseX - targetX) * 0.1;
            targetY += (mouseY - targetY) * 0.1;

            const spiralContainer = document.querySelector('.spiral-container');
            if (spiralContainer) {
                spiralContainer.style.transform = `
                    perspective(${2000 + targetY * 500}px)
                    rotateX(${-targetY * 10}deg)
                    rotateY(${targetX * 10}deg)
                `;
            }

            requestAnimationFrame(updateMouseEffect);
        };

        updateMouseEffect();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, {
            threshold: 0.1
        });

        // Observe morph items
        this.items.forEach(item => observer.observe(item));
    }

    setupTimelineTrigger() {
        // Start the effect immediately when page loads
        const spiralContainer = document.querySelector('.spiral-container');
        if (spiralContainer) {
            spiralContainer.style.opacity = '0.6';
        }
    }
    
    updateJourneyTextPosition() {
        const morphText = document.querySelector('.morph-text');
        if (!morphText) return;
        
        // Make "My Journey" text move and change as you scroll
        const yPos = 50 + Math.sin(this.scrollProgress * Math.PI * 2) * 20;
        const xPos = Math.cos(this.scrollProgress * Math.PI * 3) * 30;
        const scale = 1 + Math.sin(this.scrollProgress * Math.PI * 4) * 0.2;
        const rotation = this.scrollProgress * 180;
        
        morphText.style.transform = `
            translate(${xPos}px, ${yPos}%)
            scale(${scale})
            rotateY(${rotation}deg)
        `;
        
        // Change opacity based on scroll
        morphText.style.opacity = 0.3 + Math.abs(Math.sin(this.scrollProgress * Math.PI * 2)) * 0.4;
    }

    handleItemClick(index) {
        const item = this.items[index];
        if (!item) return;

        // Create expand effect
        item.classList.add('expanding');
        
        // Show detailed view
        this.showDetailedView(this.images[index]);
        
        setTimeout(() => {
            item.classList.remove('expanding');
        }, 600);
    }

    handleItemHover(item, isHovering) {
        if (isHovering) {
            // Bring to front
            item.style.zIndex = '20';
            
            // Pulse effect
            item.classList.add('pulse');
        } else {
            item.style.zIndex = '';
            item.classList.remove('pulse');
        }
    }

    showDetailedView(image) {
        // Create modal or expanded view
        console.log('Showing detailed view for:', image.title);
        // Implementation for modal/detailed view can be added here
    }

    updateFadeMorphing() {
        // Implement fade morphing between elements
        this.items.forEach((item, index) => {
            const totalItems = this.items.length;
            const itemProgress = (this.scrollProgress * totalItems - index + totalItems) % totalItems;
            const normalizedProgress = itemProgress / totalItems;
            
            // Create fade zones
            let fadeOpacity = 1;
            if (normalizedProgress < 0.1) {
                fadeOpacity = normalizedProgress / 0.1; // Fade in
            } else if (normalizedProgress > 0.9) {
                fadeOpacity = (1 - normalizedProgress) / 0.1; // Fade out
            }
            
            // Apply morphing scale effect
            const morphScale = 1 + Math.sin(normalizedProgress * Math.PI) * 0.2;
            
            // Get current transform and modify it
            const currentTransform = item.style.transform;
            if (currentTransform) {
                // Add morphing effects to existing transform
                item.style.transform = currentTransform + ` scale(${morphScale})`;
            }
            
            // Apply fade effect
            const currentOpacity = parseFloat(item.style.opacity) || 1;
            item.style.opacity = currentOpacity * fadeOpacity;
            
            // Add glow effect for focused items
            if (normalizedProgress > 0.4 && normalizedProgress < 0.6) {
                item.style.boxShadow = `
                    0 0 30px rgba(150, 156, 255, ${0.3 * fadeOpacity}),
                    0 0 60px rgba(236, 72, 153, ${0.2 * fadeOpacity})
                `;
            } else {
                item.style.boxShadow = 'none';
            }
        });
    }
    
    animate() {
        // Continuous animation loop for ambient effects
        const time = Date.now() * 0.001;
        
        // Animate morph text with breathing effect
        const morphText = document.querySelector('.morph-text');
        if (morphText) {
            const breathe = Math.sin(time * 0.8) * 0.05;
            const float = Math.sin(time * 0.5) * 8;
            morphText.style.transform = `
                translateY(${float}px)
                scale(${1 + breathe})
            `;
        }
        
        // Animate skill orbs with floating motion
        const orbs = document.querySelectorAll('.skill-orb');
        orbs.forEach((orb, index) => {
            const floatY = Math.sin(time * 0.6 + index * 0.5) * 5;
            const floatX = Math.cos(time * 0.4 + index * 0.3) * 3;
            const currentTransform = orb.style.transform || '';
            orb.style.transform = currentTransform + ` translate(${floatX}px, ${floatY}px)`;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the effect when the script loads
const morphEffect = new MorphScrollEffect();

// Export for use in other scripts if needed
window.MorphScrollEffect = MorphScrollEffect;

// Add background particles and animations
function createBackgroundEffects() {
    // Create animated background container
    const animatedBg = document.createElement('div');
    animatedBg.className = 'animated-bg';
    document.body.appendChild(animatedBg);
    
    // Create gradient background
    const gradientBg = document.createElement('div');
    gradientBg.className = 'gradient-bg';
    document.body.appendChild(gradientBg);
    
    // Create floating particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'bg-particle';
        particle.style.cssText = `
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            --duration: ${Math.random() * 6 + 6}s;
            animation-delay: ${Math.random() * 8}s;
        `;
        animatedBg.appendChild(particle);
    }
    
    // Create geometric shapes
    const shapes = ['triangle', 'square', 'diamond'];
    for (let i = 0; i < 15; i++) {
        const shape = document.createElement('div');
        const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
        shape.className = `bg-geometric ${shapeType}`;
        shape.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            --duration: ${Math.random() * 8 + 10}s;
            animation-delay: ${Math.random() * 12}s;
        `;
        animatedBg.appendChild(shape);
    }
    
    // Create cyber grid lines
    for (let i = 0; i < 3; i++) {
        const light = document.createElement('div');
        light.className = `light x${i + 3}`;
        light.style.cssText = `
            --random-x${i + 3}: ${Math.random()};
        `;
        document.body.appendChild(light);
    }
}

// Initialize background effects
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createBackgroundEffects);
} else {
    createBackgroundEffects();
}
