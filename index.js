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
  // Get the category filter select element
  const categoryFilter = document.getElementById('categoryFilter');
  
  // Get all video elements with a data-category attribute
  const videoItems = document.querySelectorAll('[data-category]');
  
  // Function to filter videos based on selected category
  function filterVideos() {
    const selectedCategory = categoryFilter.value;
    
    videoItems.forEach(item => {
      const videoCategory = item.getAttribute('data-category');
      
      // Show videos that match the selected category, or all if "all" is selected
      if (selectedCategory === 'all' || selectedCategory === videoCategory) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // Add event listener for category filter change
  categoryFilter.addEventListener('change', filterVideos);

  // Call filterVideos on page load to show the initial category
  filterVideos();
