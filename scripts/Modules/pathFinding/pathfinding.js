import { loadNavBar, loadFooter, LoadPageHeading } from "../inject.js";

LoadPageHeading(
    "Pathfinding Visualizer",
    "Learn and visualize pathfinding algorithms. Set start, end, and obstacles to see how algorithms find the shortest path."
);

loadNavBar();
loadFooter();




import { dijkstra } from "./algorithms/dijkstra.js";
import { grid,ROWS,COLS,getAnimationState,SetAnimationState} from "./constants.js";
import { BFS } from "./algorithms/bfs.js";
import { DFS } from "./algorithms/dfs.js";
import { astar } from "./algorithms/a-star.js";
import { getCurrentSpeed, getDelay, clearWeight } from "./utils.js";
import { randomWalls, recursiveDivision } from "./maze.js";

// import {consta}
const gridContainer = document.querySelector(".visualization-container");
const visualizeBtn = document.getElementById("visualization-button");
const resetButton = document.getElementById('reset-btn');

const algorithmCheck = document.querySelector("#algorithm1");
const algorithm2 = document.querySelector("#algorithm2");

const addWallBtn = document.querySelector('#walls-btn');//it was show peice looks good so i added but evrall it is working without it 
const addWeightBtn = document.querySelector('#weight-btn');
const addBombBtn = document.querySelector('#bomb-btn');

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


// let isAnimationRunning = false;

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
                previousNode: null,
                weight: 1, // Default weight
                isWeight: false,
                isBomb: false
            };
            // node.element.classList.remove('visited','shortest-path','wall','weight','bomb','exploding','bomb-affected');
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
        if(!node || node.isStart || node.isEnd)return;
        
        if(currentTool === 'wall'){
            if(node.isWall){
            isErasing= true;
            NodeElement.classList.remove('wall');
                node.isWall=false;
            }
            else{
                isDrawing= true;
                NodeElement.classList.add('wall');
                node.isWall=true;
            }
        }
        else if(currentTool === 'weight'){
            // If weight button has been disabled (e.g., BFS/DFS selected), ignore weight clicks
            if(addWeightBtn.disabled) return ;

            
            if(!node.isWall && !node.isWeight){
                node.isWeight = true;
                node.weight = 5;
                NodeElement.classList.add('weight');
            }else if(node.isWeight){
                node.isWeight = false;
                node.weight = 1;
                NodeElement.classList.remove('weight');
            }
        }
        else if(currentTool == 'bomb'){
            // Waypoint mode => only allow ONE bomb (toggle)
            if (bombMode === 'waypoint') {
                // Remove any existing bomb(s) first
                for (let r = 0; r < ROWS; r++) {
                    for (let c = 0; c < COLS; c++) {
                        const bn = grid[r][c];
                        if (bn.isBomb) {
                            bn.isBomb = false;
                            // waypoint is not supposed to be a wall by default
                            bn.isWall = false;
                            bn.element.classList.remove('bomb', 'exploding', 'bomb-affected');
                        }
                    }
                }

                // Toggle the clicked node as the single waypoint bomb
                if (!node.isBomb && !node.isStart && !node.isEnd) {
                    node.isBomb = true;
                    node.isWall = false;            // waypoint isn't a blocking wall
                    NodeElement.classList.add('bomb');
                    NodeElement.classList.remove('wall');
                } else if (node.isBomb) {
                    // clicked same bomb: remove it
                    node.isBomb = false;
                    node.isWall = false;
                    NodeElement.classList.remove('bomb', 'exploding', 'bomb-affected');
                }
            }
            else{
                // Blast mode: keep current behaviour (allow multiple bombs, bomb acts like wall until explode)
                if(!node.isWall && !node.isBomb){
                node.isBomb = true;
                node.isWall = true;
                NodeElement.classList.add('bomb');
                NodeElement.classList.remove('wall');
                }else if(node.isBomb){
                    node.isBomb = false;
                    node.isWall = false;
                    NodeElement.classList.remove('bomb', 'exploding', 'bomb-affected');
                }
            }
           
            // You can add additional logic if bomb affects algorithm
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

        if(!node || node.isStart || node.isEnd)return ;

        if(currentTool == 'wall'){
            if(isDrawing){
            nodeElement.classList.add('wall');
            node.isWall=true;
            }
            else{
                nodeElement.classList.remove('wall');
                node.isWall = false;
            }
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

const dropDownItems = document.querySelectorAll('.algorithm-content .dropdown-item');
const dropDownItems2 = document.querySelectorAll('.maze-content .dropdown-item');


    dropDownItems.forEach((button) => {
        button.addEventListener('click',(e) => {
            selectedAlgorithm = button.textContent;
            

            // Update only the algorithm text
            if (algorithmTextSpan) {
                algorithmTextSpan.textContent = selectedAlgorithm;
            }

            dropDownItems.forEach( i => i.classList.remove('selected'));
            button.classList.add('selected');

            

            if(selectedAlgorithm === 'Breadth-First-Search' || selectedAlgorithm === 'Depth-First-Search'){
                addWeightBtn.disabled = true;
                clearWeight();// BFS/DFS don’t support weights
                if(currentTool === 'weight'){
                    currentTool = 'wall';
                    updateActiveTool();
                }
            }else{
                addWeightBtn.disabled = false;
            }
            
            algorithmDropdownContent.style.display = 'none'; // Updated variable name
            // In future, we can also handle bombs or special tiles here
        });
    });

    let selectedMazePattern = null;

    dropDownItems2.forEach((button) => {
        button.addEventListener('click', (e) => {
            if (getAnimationState()) return;

            selectedMazePattern = button.textContent;

            // Update only the maze text
            if (mazeTextSpan) {
                mazeTextSpan.textContent = selectedMazePattern;
            }

            dropDownItems2.forEach(i => i.classList.remove('selected'));
            button.classList.add('selected');

            // Clear existing walls first (but keep start/end nodes)
            clearWallsBtn.click();

            if (selectedMazePattern === 'Random Walls') {
                randomWalls();
            } else if (selectedMazePattern === 'Recursive Division') {
                recursiveDivision();
            }

            mazeDropdownContent.style.display = 'none'; // Updated variable name
        });
    })


const algorithmDropdownBtn = document.querySelector('.algorithm-dropdown');
const algorithmDropdownContent = document.querySelector('.algorithm-content');
const algorithmTextSpan = document.querySelector('.algorithm-text');

// Algorithm dropdown
algorithmDropdownBtn.addEventListener('click', () => {
    algorithmDropdownContent
        .style.display = algorithmDropdownContent.style.display === 'block' ? 'none' : 'block';
});


const mazeDropdownBtn = document.querySelector('.maze-dropdown');
const mazeDropdownContent = document.querySelector('.maze-content');
const mazeTextSpan = document.querySelector('.maze-text');

// Maze dropdown
mazeDropdownBtn.addEventListener('click', (e) => {
    mazeDropdownContent
        .style.display = mazeDropdownContent.style.display === 'block' ? 'none' : 'block';
});


window.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-content')
            .forEach(dc => dc.style.display = 'none');
    }
});

async function explodeAllBombs(){
    // Don't explode anything if in waypoint mode
    if (bombMode === 'waypoint') return;

    const explosionsDirections = [
        [-1, -1], [-1, 0], [-1, 1],
        [ 0, -1],          [ 0, 1],
        [ 1, -1], [ 1, 0], [ 1, 1],
    ];

    
    for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < COLS; col++){
            const node = grid[row][col];

            if(node.isBomb && bombMode === 'blast'){
                // Animate the bomb first
                node.isWall = true;

                node.element.classList.add('bomb');
                node.element.classList.remove('wall');
                await getDelay(getCurrentSpeed());

                //Then explode to adjacent nodes
                for(const [dr,dc] of explosionsDirections){
                    const newRow = row + dr;
                    const newCol = col + dc;

                    if(newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS){
                        let affectNode = grid[newRow][newCol];
                        if(!affectNode.isStart && !affectNode.isEnd){
                            // Make this tile behave as a wall for pathfinding:)
                            affectNode.isWall = true;

                            // Don't add 'wall' visual — add bomb-affected visual (fire/smoke).
                            // We already have .node.bomb-affected CSS — use it.
                            affectNode.element.classList.add('bomb-affected')

                            // Ensure we don't accidentally leave a plain 'wall' class on it
                            affectNode.element.classList.remove('wall');
                        }
                    }
                }
            }
        }
    }
}



visualizeBtn.addEventListener('click',async() => {
    if(getAnimationState())return;

    

    clearPathBtn.disabled = true;
    clearWallsBtn.disabled = true;
    clearWeightBtn.disabled = true;   
    clearBoardBtn.disabled = true;
    document.getElementById("bomb-waypoint-toggle").disabled = true;
    
    SetAnimationState(true);


    // Find the waypoint bomb if in waypoint mode
    let waypoint = null;
    if (bombMode === 'waypoint') {
        for(let row = 0; row < ROWS; row++){
            for(let col = 0; col < COLS; col++){
                if(grid[row][col].isBomb) {
                    waypoint = grid[row][col];
                    break;
                }
            }
            if (waypoint) break;
        }
    }
//     gridContainer.style.pointerEvents = 'none';
// gridContainer.style.cursor = 'not-allowed';
    if(selectedAlgorithm==="Dijkstra's Algorithm"){
        if (waypoint) {
            const firstLegPath = await dijkstra(true, waypoint);
            if (!firstLegPath) {
                alert("No path found from start to waypoint.");
                SetAnimationState(false);
                clearPathBtn.disabled = false;
                clearWallsBtn.disabled = false;
                clearWeightBtn.disabled = false;
                clearBoardBtn.disabled = false;
                return;
            }

            const secondLegPath = await dijkstra(false, waypoint);
            if (!secondLegPath) {
                alert("No path found from waypoint to end.");
                SetAnimationState(false);
                clearPathBtn.disabled = false;
                clearWallsBtn.disabled = false;
                clearWeightBtn.disabled = false;
                clearBoardBtn.disabled = false;
                return;
            }

            const combined = [...firstLegPath];
            combined.push(waypoint);
            combined.push(...secondLegPath);

            for (let i = 0; i < combined.length; i++) {
                const n = combined[i];
                if (!n.isStart && !n.isEnd) n.element.classList.add('shortest-path');
                await getDelay(getCurrentSpeed());
            }
        }
        else {
            await explodeAllBombs();
            await dijkstra();
        }
    }
    else if(selectedAlgorithm==="A* Search"){
        if (waypoint) {
            const firstLegPath = await astar(true, waypoint);
            if (!firstLegPath) {
                alert("No path found from start to waypoint.");
                SetAnimationState(false);
                clearPathBtn.disabled = false;
                clearWallsBtn.disabled = false;
                clearWeightBtn.disabled = false;
                clearBoardBtn.disabled = false;
                return;
            }

            const secondLegPath = await astar(false, waypoint);
            if (!secondLegPath) {
                alert("No path found from waypoint to end.");
                SetAnimationState(false);
                clearPathBtn.disabled = false;
                clearWallsBtn.disabled = false;
                clearWeightBtn.disabled = false;
                clearBoardBtn.disabled = false;
                return;
            }

            const combined = [...firstLegPath];
            combined.push(waypoint);
            combined.push(...secondLegPath);

            for (let i = 0; i < combined.length; i++) {
                const n = combined[i];
                if (!n.isStart && !n.isEnd) n.element.classList.add('shortest-path');
                await getDelay(getCurrentSpeed());
            }
        }
        else {
            await explodeAllBombs();
            await astar();
        }
    }
    else if(selectedAlgorithm==="Breadth-First-Search"){
        clearWeight();
        if (waypoint) {
            // Run first leg: start -> waypoint (this will animate traversal with 'visited-leg1')
            const firstLegPath = await BFS(true, waypoint);

            // If no path found to the waypoint, stop and notify
            if (!firstLegPath) {
                alert("No path found from start to waypoint.");
                SetAnimationState(false);
                // Re-enable buttons
                clearPathBtn.disabled = false;
                clearWallsBtn.disabled = false;
                clearWeightBtn.disabled = false;
                clearBoardBtn.disabled = false;
                return;
            }

            // Run second leg: waypoint -> end (will animate traversal with 'visited')
            const secondLegPath = await BFS(false, waypoint);

            if (!secondLegPath) {
                alert("No path found from waypoint to end.");
                SetAnimationState(false);
                clearPathBtn.disabled = false;
                clearWallsBtn.disabled = false;
                clearWeightBtn.disabled = false;
                clearBoardBtn.disabled = false;
                return;
            }

            // Combined shortest path = nodes between start->waypoint, then the waypoint node, then nodes waypoint->end
            const combined = [...firstLegPath];
            // include the waypoint tile visually in the combined shortest-path
            combined.push(waypoint);
            combined.push(...secondLegPath);

            // Animate the combined shortest path
            for (let i = 0; i < combined.length; i++) {
                const n = combined[i];
                if (!n.isStart && !n.isEnd) {
                    n.element.classList.add('shortest-path');
                }
                await getDelay(getCurrentSpeed());
            }
        }
        else{
            await explodeAllBombs();
            await BFS();
        }
    }
    else if(selectedAlgorithm==="Depth-First-Search"){
        clearWeight();
        if (waypoint) {
            const firstLegPath = await DFS(true, waypoint);
            if (!firstLegPath) {
                alert("No path found from start to waypoint.");
                SetAnimationState(false);
                clearPathBtn.disabled = false;
                clearWallsBtn.disabled = false;
                clearWeightBtn.disabled = false;
                clearBoardBtn.disabled = false;
                return;
            }

            const secondLegPath = await DFS(false, waypoint);
            if (!secondLegPath) {
                alert("No path found from waypoint to end.");
                SetAnimationState(false);
                clearPathBtn.disabled = false;
                clearWallsBtn.disabled = false;
                clearWeightBtn.disabled = false;
                clearBoardBtn.disabled = false;
                return;
            }

            const combined = [...firstLegPath];
            combined.push(waypoint);
            combined.push(...secondLegPath);

            for (let i = 0; i < combined.length; i++) {
                const n = combined[i];
                if (!n.isStart && !n.isEnd) n.element.classList.add('shortest-path');
                await getDelay(getCurrentSpeed());
            }
        }
        else {
            await explodeAllBombs();
            await DFS();
        }
    }

    // re-enable clear buttons after done
    clearPathBtn.disabled = false;
    clearWallsBtn.disabled = false;
    clearWeightBtn.disabled = false;
    clearBoardBtn.disabled = false;
    document.getElementById("bomb-waypoint-toggle").disabled = false;


    
//     gridContainer.style.pointerEvents = 'auto';
// gridContainer.style.cursor = 'auto';

    SetAnimationState(false);
});   



// Track current tool
let currentTool = 'wall';

// Tool button event handlers
addWallBtn.addEventListener('click', () => {
    currentTool = 'wall';
    updateActiveTool();
});
addWeightBtn.addEventListener('click', () => {
    currentTool = 'weight';
    updateActiveTool();
});
addBombBtn.addEventListener('click', () => {
    currentTool = 'bomb';
    updateActiveTool();
});

function updateActiveTool(){
    // Reset all buttons
    addWallBtn.classList.remove('active');
    addWeightBtn.classList.remove('active');
    addBombBtn.classList.remove('active');


    // If weight button is disabled, ensure currentTool isn't 'weight'
    if(currentTool === 'weight' && addWeightBtn.disabled){
        currentTool = 'wall';
    }

    // Activate current tool
    if(currentTool === 'wall')addWallBtn.classList.add('active');
    if(currentTool === 'weight')addWeightBtn.classList.add('active');
    if(currentTool === 'bomb')addBombBtn.classList.add('active');
}
updateActiveTool();


resetButton.addEventListener('click',()=> {
    if (getAnimationState()) {
        alert("Wait! Visualization is running.");
        return;
    }
    for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < COLS; col++){
            const node = grid[row][col];
            //node.element.classList.remove("visited", "shortest-path");
            node.element.className = 'node'; //Reset all classes;
            node.isWall = false;
            node.isWeight = false;
            node.weight = 1;
            node.distance = Infinity;
            node.previousNode = null;
            node.isBomb = false;
            // console.log('reset');

            // Restore start/end nodes
            if(node.isStart) node.element.classList.add('start');
            if(node.isEnd) node.element.classList.add('end');
        }
    }
    console.log('reset');
});

clearPathBtn.addEventListener('click', () => {
    for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < COLS; col++){
            const node = grid[row][col];
            clearAlgoVisuals(node);
            node.element.classList.remove('visited', 'visited-leg1', 'shortest-path'); //Reset all classes;
            // Reset algorithm-specific properties
            node.distance = Infinity;
            node.isVisited = false;
            node.previousNode = null;
        }
    }
});

clearWallsBtn.addEventListener('click',() => {
    for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < COLS; col++){
            const node = grid[row][col];
            if(node.isWall){
                node.element.classList.remove('wall', 'bomb-affected', 'bomb'); //Reset all classes;
                node.isWall=false;
            }
        }
    }
});
clearWeightBtn.addEventListener('click', () => {
    for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < COLS; col++){
            const node = grid[row][col];
            node.element.classList.remove('weight'); 
            node.isWeight = false;
            node.weight = 1;// Reset to default weight
        }
    }
});
clearBoardBtn.addEventListener('click',()=> {
    if (getAnimationState()) {
        alert("Wait! Visualization is running.");
        return;
    }
    for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < COLS; col++){
            const node = grid[row][col];
            node.element.className = 'node'; //Reset all classes;
            node.isWall = false;
            node.isWeight = false;
            node.weight = 1;
            node.distance = Infinity;
            node.previousNode = null;
            node.isBomb = false;
        
            if(node.isStart) node.element.classList.add('start');
            if(node.isEnd) node.element.classList.add('end');
        }
    }
    console.log('Board Cleared');
});


function clearAlgoVisuals(node) {
  node.element.classList.remove('open','closed','visited','shortest-path');
  node.element.textContent = '';
  node.isVisited = false;
  node.distance = Infinity;
  node.previousNode = null;
}


// if (!isFoundEnd) {
//     alert("No path found!");
//     SetAnimationState(false);
// }

let bombMode = 'blast';

document.getElementById('bomb-waypoint-toggle').addEventListener('change', (e) => {
    const isWaypoint = e.target.checked;
    bombMode = isWaypoint ? 'waypoint' : 'blast';
    //Alternative behavior (if you want to keep one existing bomb instead of clearing all)
    if (isWaypoint) {
    //clear ALL existing bombs so user gets a clean single-waypoint place
        let kept = false
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const n = grid[r][c];
                if (n.isBomb || n.isWall) {
                    if (!kept) {
                        n.isBomb = false;
                        // waypoint bombs should not be walls by default
                        n.isWall = false;
                        // remove bomb visuals / effects only (do NOT remove other non-bomb classes)
                        n.element.classList.remove('bomb', 'exploding', 'bomb-affected');
                        n.element.classList.remove('wall'); // ensure visual consistency
                    }
                    else{
                        // clear all other bombs
                        n.isBomb = false;
                        n.isWall = false;
                        n.element.classList.remove('bomb', 'exploding', 'bomb-affected', 'wall');
                    }
                }
            }
        }
    }
});

