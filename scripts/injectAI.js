export async function injectAI() {
    try {
        // Fetch the HTML from public folder
        const res = await fetch('/aiAssistant.html');
        const html = await res.text();
        
        // Create a container and inject into body
        const container = document.createElement('div');
        container.innerHTML = html;
        document.body.appendChild(container);

        // Load the AI Assistant JS
        const script = document.createElement('script');
        script.src = '/aiAssistant.js';
        document.body.appendChild(script);

        // Load the AI Assistant CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/aiAssistant.css';
        document.head.appendChild(link);

        console.log("AI Assistant injected");

        // Load marked.js dependency first
        await loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js');
        await loadScript('/aiAssistant.js'); // then AI logic

        //Initialize AI logic safely
        if (window.initAI) window.initAI();

        console.log("AI Assistant JS loaded and initialized");

    } catch (error) {
        console.error("Failed to inject AI Assistant:", error);
    }
}


function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}
