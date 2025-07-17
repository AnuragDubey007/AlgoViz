import { dijkstra } from "./algorithms/dijkstra.js";
import { grid,ROWS,COLS,getAnimationState,SetAnimationState} from "./constants.js";
import { BFS } from "./algorithms/bfs.js";
import { DFS } from "./algorithms/dfs.js";
import { astar } from "./algorithms/a-star.js";
// import {consta}
const gridContainer = document.querySelector(".visualization-container");
const visualizeBtn = document.getElementById("visualization-button");
const resetButton = document.getElementById('reset-btn');

const algorithmCheck = document.querySelector("#algorithm1");
const algorithm2 = document.querySelector("#algorithm2");

const AddwallBtn = document.querySelector('#walls-btn');//it was show peice looks good so i added but evrall it is working without it 
const AddweightBtn = document.querySelector('#weight-btn');
const AddBombBtn = document.querySelector('#bomb-btn');

const clearWallsBtn = document.getElementById('clear-Walls-btn');
const clearPathBtn = document.getElementById('clear-path-btn');
const clearWeightBtn = document.getElementById('clear-weight-btn');
const clearBoardBtn = document.getElementById('clear-board-btn');


// const speedSlider = document.getElementById('speed');
// let speed = 50;
// speedSlider.addEventListener('input',(e) => {
//     const sliderValue = parseInt(e.target.value);
//     speed = 301 - sliderValue * 3;
// });


let isAnimationRunning = false;

function createGrid(){
    gridContainer.innerHTML = "";
    // grid = [];
    grid.length = 0;

    for(let row = 0; row < ROWS; row++){
        const currentRow = [];
        
        //Create columns
        for(let col = 0; col < COLS; col++ ){

            const node = {
                element : document.createElement('div'),
                row: row,
                col: col,
                isStart: false,
                isEnd: false,
                isWall: false,
                distance: Infinity,
                previousNode: null
            };

            node.element.classList.add('node');

            // Add row and col as data attributes for easy access
            node.element.dataset.row = row;
            node.element.dataset.col = col;

            gridContainer.appendChild(node.element);
            currentRow.push(node);
        }

        grid.push(currentRow);
    }

    const startRow = Math.floor(ROWS/2);
    const startCol = Math.floor(COLS/4);
    const endRow = Math.floor(ROWS/2);
    const endCol = Math.floor(3 * COLS/4);
    //update start node
    grid[startRow][startCol].isStart = true;
    grid[startRow][startCol].element.classList.add('start');
    //update end node
    grid[endRow][endCol].isEnd = true;
    grid[endRow][endCol].element.classList.add('end');
}

window.addEventListener('load',()=> {
    createGrid();
    setNodeInteraction();
});

let isDrawing = false;
let isErasing = false;

function setNodeInteraction(){


    gridContainer.addEventListener('mousedown',(e) => {
        if(getAnimationState())return;
            
        const NodeElement = e.target;
        

        const row = parseInt(NodeElement.dataset.row);
        const col = parseInt(NodeElement.dataset.col);

        // Validate coordinates
        if (isNaN(row) || isNaN(col) || row < 0 || row >= ROWS || col < 0 || col >= COLS) {
            return;
        }

        const node = grid[row][col];
        if(node.isStart || node.isEnd)return;
        
        if(node.isWall){
            isErasing= true;
            NodeElement.classList.remove('wall');
            node.isWall=false;
        }else{
            isDrawing= true;
            NodeElement.classList.add('wall');
            node.isWall=true;
        }
        // if(node.element.classList.contains('start') || node.element.classList.contains('end')){
        //     return;
        // }

        // if(node.element.classList.contains('wall')){
        //     isErasing = true;
        //     node.classList.remove('wall');
        // }else{
        //     isDrawing = true;
        //     node.classList.add('wall');
        // }
    });

    gridContainer.addEventListener('mousemove',(e) => {
        if (getAnimationState()) {
        isDrawing = false;
        isErasing = false;
        return;
    }
        if(!isErasing && !isDrawing)return;
        const nodeElement = e.target;

        const row = parseInt(nodeElement.dataset.row);
        const col = parseInt(nodeElement.dataset.col);

        // Validate coordinates
        if (isNaN(row) || isNaN(col) || row < 0 || row >= ROWS || col < 0 || col >= COLS) {
            return;
        }

        const node= grid[row][col];

        if(node.isStart || node.isEnd)return ;

        if(isDrawing){
            nodeElement.classList.add('wall');
            node.isWall=true;
        }else{
            nodeElement.classList.remove('wall');
            node.isWall = false;
        }

            // if(node.element.classList.contains('start') || node.classList.contains('end')){
            //     return ;
            // }
            // if(isDrawing){
            //     node.classList.add('wall');
            // }else if(isErasing){
            //     node.classList.remove('wall');
            // }
    });


    window.addEventListener('mouseup',()=> {
        isDrawing=false;
        isErasing=false;
    });
}   


let selectedAlgorithm = "Dijkstra's Algorithm";

const dropDownItems = document.querySelectorAll('.dropdown-content .dropdown-item');

    dropDownItems.forEach((button) => {
        button.addEventListener('click',() => {
            selectedAlgorithm = button.textContent;
            document.querySelector('.dropdown-button span').textContent = button.textContent;

            dropDownItems.forEach( i => i.classList.remove('selected'));
            button.classList.add('selected');
        });
    });


visualizeBtn.addEventListener('click',async() => {
    if(getAnimationState())return;
    
    SetAnimationState(true);
//     gridContainer.style.pointerEvents = 'none';
// gridContainer.style.cursor = 'not-allowed';
    if(selectedAlgorithm==="Dijkstra's Algorithm"){
        await dijkstra();
    }
    // else if(selectedAlgorithm==="A* Search"){
    //     await astar();
    // }
    else if(selectedAlgorithm==="Breadth-First-Search"){
        await BFS();
    }
    else if(selectedAlgorithm==="Depth-First-Search"){
        await DFS();
    }

    
//     gridContainer.style.pointerEvents = 'auto';
// gridContainer.style.cursor = 'auto';

    SetAnimationState(false);
});   

const dropDownBtn = document.querySelector('.dropdown-button');
const dropdownContent = document.querySelector('.dropdown-content');
dropDownBtn.addEventListener('click',()=> {
    document.querySelector('.dropdown-content')
        .style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
});

window.addEventListener('click',(e)=>{
    if(!e.target.matches('.dropdown-button')){
        dropdownContent.style.display='none';
    }
});

resetButton.addEventListener('click',()=> {
    if (getAnimationState()) {
        alert("Wait! Visualization is running.");
        return;
    }
    for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < COLS; col++){
            const node = grid[row][col];
            node.element.className = 'node'; //Reset all classes;
            node.isWall = false;
            node.distance = Infinity;
            node.previousNode = null;
            // console.log('reset');

            // Restore start/end nodes
            if(node.isStart) node.element.classList.add('start');
            if(node.isEnd) node.element.classList.add('end');
        }
    }
    console.log('reset');
});

clearWallsBtn.addEventListener('click',() => {
    for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < COLS; col++){
            const node = grid[row][col];
            if(!node.isStart && !node.isEnd){
                node.element.className = 'node'; //Reset all classes;
                node.isWall=false;
            }
            
        }
    }
});

