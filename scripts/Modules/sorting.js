




const algo1Container = document.querySelector(".compare-view .algo-view:nth-child(1) .visualization");
const algo2Container = document.querySelector(".compare-view .algo-view:nth-child(2) .visualization");

const algorithm1 = document.querySelector("#algorithm1");
const algorithm2 = document.querySelector("#algorithm2");
const compareCheckBoxBtn = document.querySelector('#compare-mode');
const secondAlgoContainer = document.querySelector(".second-algorithm-container");

const arraySizeSlider = document.getElementById("size");
const speedSlider = document.getElementById("speed");

const sizeValue = document.getElementById("size-value");
const speedValue = document.getElementById("speed-value");

const generateBtn = document.getElementById("generate");
const sortBtn = document.getElementById("sort");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");

const visualizationSingle = document.querySelector(".single-view .visualization");
const comparisonMode = document.querySelector(".compare-view");

const singlestat = document.getElementById("single-status");
const compareStat = document.getElementById("comparison-status");

const singleTitle = document.querySelector(".visualization-header .visualization-title");
const doubleTitleFirst = document.querySelector(".compare-view .algo-view:nth-child(1) .visualization-title");
const doubleTitleSecond = document.querySelector(".compare-view .algo-view:nth-child(2) .visualization-title");
document.addEventListener("DOMContentLoaded",()=> {
    updateTitles();
    generateArray(arraySizeSlider.value);

    algorithm1.addEventListener('change',updateTitles);
    algorithm2.addEventListener('change',updateTitles);
    compareCheckBoxBtn.addEventListener('change',updateTitles);
});

function updateTitles(){
    if (compareCheckBoxBtn.checked) {
        
        if (doubleTitleFirst && doubleTitleSecond) {
            document.querySelector(".visualization-header .visualization-title").textContent = "Comparison Mode";
            doubleTitleFirst.textContent = algorithm1.options[algorithm1.selectedIndex].text;
            doubleTitleSecond.textContent = algorithm2.options[algorithm2.selectedIndex].text;
        }
    } else {
        if (singleTitle) {
            singleTitle.textContent = algorithm1.options[algorithm1.selectedIndex].text;
            console.log("ccdfsdfsdfsdf");
        }
    }
}


compareCheckBoxBtn.addEventListener("change",() => {
    enableControls();
    resetCounters();
    isPaused = false;
    stopSort = true;
    if(compareCheckBoxBtn.checked){
        comparisonMode.style.display = 'grid';
        document.querySelector(".single-view").style.display = 'none';
        singlestat.style.display = 'none';
        compareStat.style.display = 'grid';
        secondAlgoContainer.style.display='block';
        generateCompareArray(arraySizeSlider.value);
        enableCompareCheckBoxBtn();
        console.log("done1");
        
    }else{
        comparisonMode.style.display = 'none';
        document.querySelector(".single-view").style.display = 'block';
        singlestat.style.display = 'grid';
        compareStat.style.display = 'none';
        secondAlgoContainer.style.display='none';
        generateArray(arraySizeSlider.value);
        updateTitles();
        console.log("done");
    }
});


let array = [];
let isPaused = false;
let isSorting = false;
let stopSort = false;


function generateArray(size = 50){
    array = [];

    visualizationSingle.innerHTML='';//clear old bars 


    for(let i = 0; i < size; i++){
        const value = Math.floor(Math.random()*500)+5;
        array.push(value);

        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${value}px`;
        visualizationSingle.appendChild(bar);
    }
    
}

function generateCompareArray(size = 50){
    let originalArray = [];

    algo1Container.innerHTML = '';
    algo2Container.innerHTML='';

    //  if (size > 300) {
    //     algo1Container.classList.add('small-gap');
    //     algo1Container.classList.add('small-gap');  
    // } else {
    //     algo1Container.classList.remove('small-gap');
    //     algo1Container.classList.remove('small-gap');
    // }

    for(let i = 0; i < size; i++){
        const value = Math.floor(Math.random()*500)+5;
        originalArray.push(value);
    }
    let array1 = [...originalArray];
    let array2 = [...originalArray];

    for(let i = 0; i < size; i++){
        let bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${originalArray[i]}px`;
        algo1Container.appendChild(bar);
    }

    for(let i = 0; i < size; i++){
        let bar=document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${originalArray[i]}px`;
        algo2Container.appendChild(bar);
    }
        // let gap = 1;
        // if (size >= 300) {
        //     gap = Math.max(0.2, 1 - (size - 300) * 0.005);
        // }
        // algo1Container.style.setProperty('--bar-gap', `${gap}px`);
        // algo2Container.style.setProperty('--bar-gap', `${gap}px`);
}

generateBtn.addEventListener("click",()=> {
    resetCounters();
    if(compareCheckBoxBtn.checked)generateCompareArray(arraySizeSlider.value);
    else generateArray(arraySizeSlider.value);
});

arraySizeSlider.addEventListener("input",()=> {
    resetCounters();
    stopSort=true;
    isPaused = false;//I clicked "Pause" and then "Reset" Now if isPaused = true, next sort will stay paused
    sizeValue.innerText = arraySizeSlider.value;
    if(compareCheckBoxBtn.checked)generateCompareArray(arraySizeSlider.value);
    else generateArray(arraySizeSlider.value);
    enableControls();
    
});

speedSlider.addEventListener("input",()=> {
    speedValue.innerText = speedSlider.value;
});


async function bubbleSort(bars, counterKey="single"){
    
    let n = bars.length;
    
    for(let i = 0; i < n - 1; i++){
        for(let j = 0; j < n - i - 1;j ++){
            counters[counterKey].comparisons++;
            updateStats();
            let height1 = parseInt(bars[j].style.height);
            let height2 = parseInt(bars[j+1].style.height);

            colorBar(bars[j],"comparing");
            colorBar(bars[j+1],"comparing");
            
            await pauseCheck();
            if(stopSort) return;
            await wait(getDelay());

             // compare and swap if needed
             if(height1 > height2){
                bars[j].style.height = `${height2}px`;
                bars[j+1].style.height = `${height1}px`;

                colorBar(bars[j],"swapping");
                colorBar(bars[j+1],"swapping");
                counters[counterKey].swaps++;
                updateStats();
             }
             
            await pauseCheck();
            if(stopSort) return;
            await wait(getDelay());

            // Reset back to default after compare
            colorBar(bars[j],null);
            colorBar(bars[j+1],null);
        }
            // Mark last sorted bar
            colorBar(bars[n-i-1],"sorted");

    }

    colorBar(bars[0],"sorted");
}

async function selectionSort(bars, counterKey = "single"){
    
    let n = bars.length;

    for(let i = 0; i < n; i++){
        let minIndex = i;
        colorBar(bars[i],"comparing");

        for(let j = i + 1; j < n; j++){
            counters[counterKey].comparisons++;
            updateStats();

            colorBar(bars[j],"comparing");
            await pauseCheck();
            if(stopSort)return;
            await wait(getDelay());

            let heightMin = parseInt(bars[minIndex].style.height);
            let heightJ = parseInt(bars[j].style.height);

            if(heightMin>heightJ){
                minIndex=j;
            }
            colorBar(bars[j],null);
        }
        if(minIndex!=i){
            let temp = bars[i].style.height
            bars[i].style.height = bars[minIndex].style.height;
            bars[minIndex].style.height = temp;

            colorBar(bars[i],"swapping");
            colorBar(bars[minIndex],"swapping");

            counters[counterKey].swaps++;
            updateStats();

            // if(compareCheckBoxBtn.checked)swaps1++,swaps2++;
            // else swaps++;
            // updateStats();
            //whre to add these and all , is this logic correct ??
        }
        await pauseCheck();
        if(stopSort)return;
        await wait(getDelay());

        colorBar(bars[i],"sorted");
    }
}

async function insertionSort(bars, counterKey = "single"){
    let n = bars.length;

    for(let i = 1; i < n ;i++){
        let j = i;
        while(j>0){
            counters[counterKey].comparisons++;
            updateStats();

            const height1 = parseInt(bars[j].style.height);
            const height2 = parseInt(bars[j-1].style.height);

            colorBar(bars[j],"comparing");
            colorBar(bars[j-1],"comparing");

            await pauseCheck();
            if(stopSort)return;
            await wait(getDelay());

            if(height1 < height2){
                //swap
                bars[j].style.height = `${height2}px`;
                bars[j-1].style.height = `${height1}px`;
                counters[counterKey].swaps++;
                updateStats();

                colorBar(bars[j],"swapping");
                colorBar(bars[j-1],"swapping");
            }else{
                colorBar(bars[j],null);
                colorBar(bars[j-1],null);
                break;
            }

            await pauseCheck();
            if(stopSort)return;
            await wait(getDelay());

            colorBar(bars[j],null);
            colorBar(bars[j-1],null);

            j--;
        }
    }

    for(let i = 0; i < n; i++){
        colorBar(bars[i],"sorted");
        await wait(5);
    }
}

async function mergeSort(bars, counterKey = "single"){
    let n = bars.length;

    async function merge(start,mid,end){
        let left=  [], right = [];

        for(let i= start ; i <= mid; i++)left.push(parseInt(bars[i].style.height));
        for(let i= mid+1 ; i <= end; i++)right.push(parseInt(bars[i].style.height));

        let i = 0, j=0, k=start;

        while(i < left.length && j < right.length){
            counters[counterKey].comparisons++;
            updateStats();

            colorBar(bars[k], "comparing");
            await pauseCheck();
            if(stopSort)return ;
            await wait(getDelay());


            if(left[i] <= right[j]){
                bars[k].style.height = `${left[i]}px`;
                i++;
            }else{
                bars[k].style.height = `${right[j]}px`;
                j++;
            }

            counters[counterKey].swaps++
            updateStats();

            colorBar(bars[k], "swapping");
            await pauseCheck();
            if(stopSort)return ;
            await wait(getDelay());
            
            colorBar(bars[k],null);
            k++;
        }

        while(i < left.length){
            bars[k].style.height = `${left[i]}px`;

            colorBar(bars[k], "swapping");
            counters[counterKey].swaps++
            updateStats();
            await pauseCheck();
            if(stopSort)return ;
            await wait(getDelay());
            colorBar(bars[k],null);

            i++; k++
        }
        while(j < right.length){
            bars[k].style.height = `${right[j]}px`;

            colorBar(bars[k], "swapping");
            counters[counterKey].swaps++
            updateStats();
            await pauseCheck();
            if(stopSort)return ;
            await wait(getDelay());
            colorBar(bars[k],null);
            
            j++; k++
        }

    }

    async function mergeSortHelper(start, end){
        if(start >= end)return;

        const mid = Math.floor((start+end)/2);
        await mergeSortHelper(start,mid);
        await mergeSortHelper(mid+1,end);
        await merge(start,mid,end);
    }

    await mergeSortHelper(0 , n-1);

    //color sorted bars
    for(let i = 0; i < n; i++){
        colorBar(bars[i],"sorted");
        await wait(5);
    }
}
function disableCompareCheckBoxBtn(){
    compareCheckBoxBtn.disabled = true;
    compareCheckBoxBtn.style.cursor = "not-allowed";
}
function enableCompareCheckBoxBtn(){
    compareCheckBoxBtn.disabled = false;
    compareCheckBoxBtn.style.cursor = "pointer";
}
sortBtn.addEventListener("click",async()=> {
    // sortBtn.innerHTML = `<span class="loading-spinner"></span> Sorting...`;
    stopSort=false;
    resetCounters();
    disableControls();
    updateStatus("sorting");
    disableCompareCheckBoxBtn();
    if(compareCheckBoxBtn.checked){
        //Compare Mode
        const selectAlgo1 = algorithm1.value;
        const selectAlgo2 = algorithm2.value;
        const bar1 = algo1Container.querySelectorAll(".bar");
        const bar2 = algo2Container.querySelectorAll(".bar");

        const tasks = [];

        if(selectAlgo1=="bubble")tasks.push(bubbleSort(bar1, "algo1"));
        if(selectAlgo1=="selection")tasks.push(selectionSort(bar1, "algo1"));
        if(selectAlgo1=="insertion")tasks.push(insertionSort(bar1, "algo1"));
        if(selectAlgo1=="merge")tasks.push(mergeSort(bar1, "algo1"));

        if(selectAlgo2=="bubble")tasks.push(bubbleSort(bar2, "algo2"));
        if(selectAlgo2=="selection")tasks.push(selectionSort(bar2, "algo2"));
        if(selectAlgo2=="insertion")tasks.push(insertionSort(bar2, "algo2"));
        if(selectAlgo2=="merge")tasks.push(mergeSort(bar2, "algo2"));

        await Promise.all(tasks);

    }
    else{
        //Single Mode
        const selectAlgo = algorithm1.value;
        const bars = visualizationSingle.querySelectorAll(".bar");
        if(selectAlgo=="bubble"){
            await bubbleSort(bars, "single");
        }else if(selectAlgo=="merge"){
            await mergeSort(bars, "single");
        }else if(selectAlgo=="selection"){
            await selectionSort(bars, "single");
        }else if(selectAlgo=="insertion"){
            await insertionSort(bars, "single");
        }//add more later...}
    }
    enableCompareCheckBoxBtn();
    updateStatus("idle");
    enableControls();
});

function wait(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}
function getDelay(){
    const speed = speedSlider.value;
    return Math.max(1, 500 - speed * 5);
}

function colorBar(bar,colorClass){
    bar.classList.remove("comparing","swapping","sorted");
   if (colorClass) bar.classList.add(colorClass);
}

function pauseCheck(){
    return new Promise(resolve => {
        const check = () => {
            if(!isPaused)return resolve(0);
            else{
                setTimeout(check,100);// wait and check again
            }
        };
        check();
    });
}

function disableControls(){
    sortBtn.disabled = true;
    generateBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
}

function enableControls(){
    sortBtn.disabled = false;
    generateBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
    // sizeValue.disabled=true;
}

pauseBtn.addEventListener("click",()=> {
    const pauseIcon = pauseBtn.querySelector('.pause-icon');
    const playIcon = pauseBtn.querySelector('.play-icon');
    const btnText = pauseBtn.querySelector('.btn-text');
    if(isPaused){
        isPaused=false;
        btnText.textContent = "Pause";
        pauseIcon.style.display = 'block';
        playIcon.style.display = 'none';
        updateStatus("sorting");
        disableCompareCheckBoxBtn();
    }
    else if(!isPaused){
        isPaused=true;
        btnText.textContent = "Resume";
        pauseIcon.style.display = 'none';
        playIcon.style.display = 'block';
        updateStatus("paused");
        enableCompareCheckBoxBtn();
    }
});



resetBtn.addEventListener("click",() => {

    //pause button visuals
    const pauseIcon = pauseBtn.querySelector('.pause-icon');
    const playIcon = pauseBtn.querySelector('.play-icon');
    const btnText = pauseBtn.querySelector('.btn-text');

    stopSort=true;
    isPaused = false;//I clicked "Pause" and then "Reset" Now if isPaused = true, next sort will stay paused
    btnText.textContent = "Pause";
    pauseIcon.style.display = 'block';
    playIcon.style.display = 'none';
    resetCounters();
    // enableCompareCheckBoxBtn(); no need because after sorting when sortind await is over then it goes down in sortingbtn(it is there)yooooo

    if(compareCheckBoxBtn.checked)generateCompareArray(arraySizeSlider.value);
    else generateArray(arraySizeSlider.value);
    enableControls();
    updateStatus("idle");

    updateStats();
});


function updateStatus(state){
    const statusIndicator = document.getElementById("status-indicator");
    const statusText = document.getElementById("status-text");

    statusIndicator.classList.remove("idle","sorting","paused");


    if(state==="sorting"){
        statusIndicator.classList.add("sorting");
        statusText.textContent="Sorting";
    }else if(state==="paused"){
        statusIndicator.classList.add("paused");
        statusText.textContent="Paused";
    }else if(state==="idle"){
        statusIndicator.classList.add("idle");
        statusText.textContent="Idle";
    }
}

const counters= {
    single:{comparisons:0, swaps:0},
    algo1:{comparisons:0, swaps:0},
    algo2:{comparisons:0, swaps:0},
}

function resetCounters(){
    counters.single.comparisons=0;
    counters.single.swaps=0;
    counters.algo1.comparisons=0;
    counters.algo1.swaps=0;
    counters.algo2.comparisons=0;
    counters.algo2.swaps=0;
    updateStats();
}

function updateStats(){//is this correct ????
    if(compareCheckBoxBtn.checked){
    document.querySelectorAll("#comparison-status .stat-value")[0].textContent = counters.algo1.comparisons;
    document.querySelectorAll("#comparison-status .stat-value")[1].textContent = counters.algo1.swaps;
    document.querySelectorAll("#comparison-status .stat-value")[2].textContent = counters.algo2.comparisons;
    document.querySelectorAll("#comparison-status .stat-value")[3].textContent = counters.algo2.swaps;
    }else{
    document.querySelectorAll("#single-status .stat-value")[0].textContent = counters.single.comparisons;
    document.querySelectorAll("#single-status .stat-value")[1].textContent = counters.single.swaps;
    }
}

// function updateDoubleStats(){
//     document.querySelectorAll("comparison-status .single-value")[0].innerHTML = comparisons1;
//     document.querySelectorAll(".comparison-status .single-value")[1].innerHTML = swaps1;
//     document.querySelectorAll("comparison-status .single-value")[2].innerHTML = comparisons2;
//     document.querySelectorAll(".comparison-status .single-value")[4].innerHTML = swaps2;
// }
