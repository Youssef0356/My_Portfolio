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