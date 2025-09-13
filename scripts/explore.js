import { modules } from "./exploreModulesData.js";
import { loadNavBar, loadFooter } from "./inject.js";

function generateModuleCards(modulesArray){
    const gridContainer = document.querySelector(".explore-card-grid");
    gridContainer.innerHTML = "";

    modulesArray.forEach((Module) => {
        const card = document.createElement("div");
        card.classList.add("explore-card");

        card.innerHTML=
        `
            <div class="explore-card-up">
                <img src="${Module.image}" alt="${Module.title}" class="explore-card-image">
            </div>
            <div class="explore-card-down">
                <h3>${Module.title}</h3>
                <p class="explore-card-para">
                    ${Module.description}
                </p>
                <div class="explore-card-tags">
                    <span class="explore-card-span">${Module.tags.firstTag}</span>
                    <span class="explore-card-span">${Module.tags.secondTag}</span>
                    <span class="explore-card-span">${Module.tags.thirdTag}</span>
                </div>
                <a href="${Module.link}" class="explore-card-button">Explore Module
                    <svg xmlns="http://www.w3.org/2000/svg" class="button-arrow-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </a>
            </div>
        `;

        gridContainer.appendChild(card);
    });
    
}

generateModuleCards(modules);


const allButtons = document.querySelectorAll(".explore-filter-button");

allButtons.forEach((button) => {
    button.addEventListener("click",() => {

        // for button active state css
        // Remove active class from all buttons first
        allButtons.forEach(btn => {btn.classList.remove('active')});

        button.classList.add('active');

        const selected = button.innerHTML;

        if(selected==="All Modules"){
            generateModuleCards(modules);
        }
        else{
            let filtered = [];
            for(let i=0;i<modules.length;i++){
                if(modules[i].category===selected){
                    filtered.push(modules[i]);
                }
            }
            generateModuleCards(filtered);
        }
    });
});

function setInitialActiveButton(){
    if(allButtons.length>0){
        allButtons[0].classList.add('active');
    }
}
document.addEventListener('DOMContentLoaded',() => {
    loadNavBar();
    loadFooter();
    setInitialActiveButton();
});
