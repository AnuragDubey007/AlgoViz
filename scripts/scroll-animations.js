function scrollAnimation() {
  const elements = document.querySelectorAll('.module1-view, .module2-view, .ai-assistant-section');

  elements.forEach(element => {
    const rect = element.getBoundingClientRect();
    const inView = rect.top < window.innerHeight - 100;

    // if already animated once, skip
    if (element.dataset.animated === "true") return;

    if (inView) {
      element.style.opacity = '1';
      element.style.transform = 'translate(0, 0)';
      element.dataset.animated = "true";
    }
  });
}

// Remove the transform setting from DOMContentLoaded and load events
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(scrollAnimation, 150);
});

window.addEventListener('load', scrollAnimation);
window.addEventListener('scroll', scrollAnimation);