document.addEventListener("DOMContentLoaded", function () {
    // Select all elements with the class 'initial'
    const images = document.querySelectorAll('.initial');
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add the animation class when the image is in view
          entry.target.classList.add('scale-in');
        } else {
          // Remove the animation class when the image goes out of view
          entry.target.classList.remove('scale-in');
        }
      });
    }, {
      threshold: 0.1 // Trigger when 10% of the image is in view
    });
  
    // Observe each image element
    images.forEach(image => {
      observer.observe(image);
    });
  });
  document.addEventListener('DOMContentLoaded', function () {
    const categoryFilter = document.getElementById('categoryFilter');
    const projectGrid = document.getElementById('projectGrid');
    const projects = projectGrid.children;

    categoryFilter.addEventListener('change', function () {
        const selectedCategory = this.value;

        for (let i = 0; i < projects.length; i++) {
            const project = projects[i];
            const projectCategory = project.getAttribute('data-category');

            if (selectedCategory === 'all' || projectCategory === selectedCategory) {
                project.style.display = 'flex'; 
            } else {
                project.style.display = 'none'; 
            }
        }
    });
});
gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', function () {
    // Apply animation to the section
    gsap.from("#mySection", {
        scrollTrigger: {
            trigger: "#mySection",  // The section with id="mySection"
            start: "top bottom",    // Start when the top of the section hits the bottom of the viewport
            end: "top center",      // End when the top of the section hits the center of the viewport
            scrub: true,            // Scrubs the animation based on scroll position
        },
        opacity: 0,  // Start with opacity 0
        duration: 1, // Duration of the animation
    });

    // Initialize AOS for other animations if needed
    AOS.init({
        duration: 800,
    });
});
