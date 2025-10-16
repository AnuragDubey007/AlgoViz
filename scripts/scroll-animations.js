
function scrollAnimation() {
  const elements = document.querySelectorAll('.module1-view, .module2-view, .ai-assistant-section');
  
  elements.forEach(element => {
    const position = element.getBoundingClientRect();
    
    // If element is in viewport
    if(position.top < window.innerHeight - 50) {
      element.classList.add('reveal');
    }
  });
}


window.addEventListener('load', scrollAnimation);
window.addEventListener('scroll', scrollAnimation);