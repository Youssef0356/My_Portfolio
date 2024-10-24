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
  const text = "I'm a Developer with a passion for 3D and Game Development.";
const animatedTextElement = document.getElementById('animated-text');

let index = 0;

function typeText() {
  if (index < text.length) {
    animatedTextElement.textContent += text.charAt(index);
    index++;
    setTimeout(typeText, 100); // Adjust the speed here (in milliseconds)
  } else {
    setTimeout(() => {
      // Clear the text after finishing typing
      animatedTextElement.textContent = '';
      index = 0;
      typeText(); // Restart typing
    }, 2000); // Time to wait before restarting
  }
}

typeText();
