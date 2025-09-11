export function loadNavBar(){
    fetch("components/navbar.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("navbar").innerHTML = data;            
        });
}

export function loadFooter(){
    fetch("components/footer.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("footer").innerHTML = data;
        });
}

export function LoadPageHeading(title,description){
    const headSection =
    `
    <section class="page-heading-section">
            <div class="page-heading-box">
                <div class="text-center">
                    <h1 class="page-heading">
                        <span class="gradient-text">${title}</span>
                    </h1>
                    <p class="page-heading-para">${description}</p>
                </div>
            </div>
    </section>
    `;
    document.getElementById("pageheading").innerHTML = headSection;
}
