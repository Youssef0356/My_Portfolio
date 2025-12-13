/**
 * creative.js
 * Contains interactive effects: Custom Cursor, 3D Tilt, Text Scramble
 */

/* ===========================
   1. CUSTOM CURSOR
   =========================== */
class CustomCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursorInner = document.createElement('div');
        this.cursorInner.className = 'custom-cursor-inner';

        this.cursor.appendChild(this.cursorInner);
        document.body.appendChild(this.cursor);

        this.pos = { x: 0, y: 0 };
        this.mouse = { x: 0, y: 0 };
        this.speed = 0.2; // Lerp speed

        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Add hover classes for clickable elements
        const clickables = document.querySelectorAll('a, button, .project-card, input, textarea');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => this.cursor.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => this.cursor.classList.remove('cursor-hover'));
        });

        this.animate();
    }

    animate() {
        // Linear interpolation for smooth lag
        this.pos.x += (this.mouse.x - this.pos.x) * this.speed;
        this.pos.y += (this.mouse.y - this.pos.y) * this.speed;

        this.cursor.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0)`;

        requestAnimationFrame(() => this.animate());
    }
}

/* ===========================
   2. 3D TILT EFFECT (Optimized)
   =========================== */
class TiltEffect {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        this.elements.forEach(el => {
            el.addEventListener('mousemove', (e) => this.handleMove(e, el));
            el.addEventListener('mouseleave', () => this.handleLeave(el));
        });
    }

    handleMove(e, el) {
        if (el.rafId) cancelAnimationFrame(el.rafId);

        el.rafId = requestAnimationFrame(() => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Constrain rotation to avoid extreme flipping
            const rotateX = ((y - centerY) / centerY) * -5; // Reduced from -10
            const rotateY = ((x - centerX) / centerX) * 5;  // Reduced from 10

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            // Removed will-change to prevent rendering artifacts on scroll
        });
    }

    handleLeave(el) {
        if (el.rafId) cancelAnimationFrame(el.rafId);

        // Smooth reset
        el.style.transition = 'transform 0.5s ease';
        el.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;

        setTimeout(() => {
            el.style.transition = ''; // clear transition so mousemove is instant
        }, 500);
    }
}

/* ===========================
   3. TEXT SCRAMBLE DECODER
   =========================== */
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.originalText = el.innerText;
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Initialize Logic
document.addEventListener('DOMContentLoaded', () => {
    // 1. Init Cursor (Only on desktop)
    if (window.matchMedia("(min-width: 992px)").matches) {
        new CustomCursor();
    }

    // 2. Init Tilt
    new TiltEffect('.glass-card');
    new TiltEffect('.project-card');

    // 3. Init Text Scramble on Intersection
    const headers = document.querySelectorAll('h1, h2');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('scrambled')) {
                const fx = new TextScramble(entry.target);
                fx.setText(entry.target.innerText);
                entry.target.classList.add('scrambled');
            }
        });
    }, { threshold: 0.5 });
    headers.forEach(header => observer.observe(header));

    // 4. Init Photo Stack
    new PhotoStack();
});

/* ===========================
   4. PHOTO STACK CONTROL
   =========================== */
class PhotoStack {
    constructor() {
        this.container = document.querySelector('.photo-stack-container');
        if (!this.container) return;

        this.prevBtn = this.container.querySelector('.prev');
        this.nextBtn = this.container.querySelector('.next');

        // Exclude buttons from the "items" list, only get images
        this.getItems = () => this.container.querySelectorAll('.photo-stack-item');

        this.init();
    }

    init() {
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
    }

    next() {
        const items = this.getItems();
        // Move first item to the END
        // This makes the 2nd item become the 1st (nth-child(1)), thus rotating the stack
        this.container.appendChild(items[0]);
        // Re-append buttons to keep them on top if z-index isn't enough (though z-index handles it)
        this.container.appendChild(this.prevBtn);
        this.container.appendChild(this.nextBtn);
    }

    prev() {
        const items = this.getItems();
        // Move last item to the START
        this.container.insertBefore(items[items.length - 1], items[0]);
    }
}
