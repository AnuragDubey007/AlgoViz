// Very simple scroll animation
function simpleScrollAnimation() {
  const elements = document.querySelectorAll('.module1-view, .module2-view, .ai-assistant-section');
  
  elements.forEach(element => {
    const position = element.getBoundingClientRect();
    
    // If element is in viewport
    if(position.top < window.innerHeight - 50) {
      element.classList.add('reveal');
    }
  });
}

// Run on load and scroll
window.addEventListener('load', simpleScrollAnimation);
window.addEventListener('scroll', simpleScrollAnimation);