import { loadNavBar, loadFooter } from "./inject.js";

window.addEventListener("DOMContentLoaded",() => {
    loadNavBar();
    loadFooter();

    const startBtn = document.querySelector("#startExploringBtn");
    if (startBtn) {
        startBtn.addEventListener("click", () => {
            const exploreSection = document.querySelector('.explore-section');
            if (exploreSection) {
                exploreSection.scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        });
    }
});