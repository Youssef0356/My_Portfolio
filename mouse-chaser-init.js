/**
 * Mouse Chaser Initialization Script
 * Handles setup and configuration for the portfolio website
 */

(function() {
    'use strict';

    // Configuration for the portfolio website
    const portfolioConfig = {
        size: 35,                    // Bubble size in pixels
        speed: 0.025,               // Movement speed (0.01 - 0.05 recommended)
        proximityRange: 120,        // Distance at which bubble reacts to mouse
        escapeSpeed: 0.1,          // Speed when escaping from mouse
        colors: [                   // Color palette matching portfolio theme
            '#969CFF',              // Primary purple
            '#EC4899',              // Pink accent
            '#3B82F6',              // Blue
            '#10B981',              // Green
            '#F59E0B',              // Amber
            '#EF4444'               // Red
        ],
        particleCount: 6,           // Number of particles on interaction
        enabled: true,              // Start enabled by default
        zIndex: 999                 // Z-index for layering
    };

    // Check for user preferences
    function checkUserPreferences() {
        // Check localStorage for saved preference
        const savedPreference = localStorage.getItem('mouseChaserEnabled');
        if (savedPreference !== null) {
            portfolioConfig.enabled = savedPreference === 'true';
        }

        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            portfolioConfig.enabled = false;
        }

        // Check for mobile devices (optional - you might want to keep it enabled)
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            // Adjust settings for mobile
            portfolioConfig.size = 28;
            portfolioConfig.proximityRange = 80;
            portfolioConfig.particleCount = 4;
        }

        // Check for low-end devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            portfolioConfig.particleCount = 3;
            portfolioConfig.speed = 0.02;
        }
    }

    // Initialize the mouse chaser
    function initializeMouseChaser() {
        // Check if MouseChaser class is available
        if (typeof MouseChaser === 'undefined') {
            console.warn('MouseChaser class not found. Make sure to include the MouseChaser.js file.');
            return;
        }

        try {
            // Create and initialize the mouse chaser
            window.portfolioMouseChaser = new MouseChaser(portfolioConfig);
            
            // Add custom event listeners for portfolio-specific interactions
            setupPortfolioIntegration();
            
            console.log('Mouse Chaser initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Mouse Chaser:', error);
        }
    }

    // Portfolio-specific integrations
    function setupPortfolioIntegration() {
        // Pause game during video playback
        const videos = document.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"]');
        videos.forEach(video => {
            video.addEventListener('play', () => {
                if (window.portfolioMouseChaser) {
                    window.portfolioMouseChaser.pause();
                }
            });
            
            video.addEventListener('pause', () => {
                if (window.portfolioMouseChaser) {
                    window.portfolioMouseChaser.resume();
                }
            });
        });

        // Pause during modal/overlay interactions
        const modals = document.querySelectorAll('.modal, .overlay, .lightbox');
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('active') || target.classList.contains('open')) {
                        if (window.portfolioMouseChaser) {
                            window.portfolioMouseChaser.pause();
                        }
                    } else {
                        if (window.portfolioMouseChaser) {
                            window.portfolioMouseChaser.resume();
                        }
                    }
                }
            });
        });

        modals.forEach(modal => {
            observer.observe(modal, { attributes: true });
        });

        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Toggle with 'G' key (for Game)
            if (e.key.toLowerCase() === 'g' && e.ctrlKey && e.shiftKey) {
                e.preventDefault();
                if (window.portfolioMouseChaser) {
                    window.portfolioMouseChaser.toggle();
                }
            }
        });

        // Add analytics tracking (optional)
        if (typeof gtag !== 'undefined') {
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('mouse-chaser-bubble')) {
                    gtag('event', 'interaction', {
                        event_category: 'Mouse Chaser',
                        event_label: 'Bubble Clicked'
                    });
                }
            });
        }
    }

    // Performance monitoring
    function monitorPerformance() {
        if (!window.portfolioMouseChaser) return;

        let frameCount = 0;
        let lastTime = performance.now();

        function checkPerformance() {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 5000) { // Check every 5 seconds
                const fps = frameCount / 5;
                frameCount = 0;
                lastTime = currentTime;
                
                // If FPS drops below 30, reduce particle count
                if (fps < 30 && window.portfolioMouseChaser.config.particleCount > 2) {
                    window.portfolioMouseChaser.config.particleCount = Math.max(2, window.portfolioMouseChaser.config.particleCount - 1);
                    console.log('Reduced particle count for better performance');
                }
            }
            
            requestAnimationFrame(checkPerformance);
        }
        
        requestAnimationFrame(checkPerformance);
    }

    // Wait for DOM to be ready
    function onDOMReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    // Initialize everything
    onDOMReady(() => {
        checkUserPreferences();
        
        // Small delay to ensure all resources are loaded
        setTimeout(() => {
            initializeMouseChaser();
            
            // Start performance monitoring after initialization
            setTimeout(monitorPerformance, 1000);
        }, 100);
    });

    // Handle page visibility changes for performance
    document.addEventListener('visibilitychange', () => {
        if (window.portfolioMouseChaser) {
            if (document.hidden) {
                window.portfolioMouseChaser.pause();
            } else {
                window.portfolioMouseChaser.resume();
            }
        }
    });

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (window.portfolioMouseChaser) {
            window.portfolioMouseChaser.destroy();
        }
    });

    // Expose configuration for external modification
    window.mouseChaserConfig = portfolioConfig;

})();