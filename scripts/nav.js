
function scrollToFooter() {
    const footer = document.querySelector('footer');
    if (footer) {
        footer.scrollIntoView({ behavior: 'smooth' });
    }
}


function scrollToExploreSection() {
    // If we're on homepage, scroll to explore section
    if (window.location.pathname.endsWith('index.html') || 
        window.location.pathname === '/' || 
        window.location.pathname.endsWith('/')) {
        
        const exploreSection = document.querySelector('.explore-section');
        if (exploreSection) {
            exploreSection.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        // If not on homepage, go to explore page
        window.location.href = 'explore.html';
    }
}
