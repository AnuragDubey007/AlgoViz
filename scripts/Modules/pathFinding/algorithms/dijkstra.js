import { grid,ROWS,COLS,getAnimationState,SetAnimationState} from "../constants.js";
import { getDelay,getCurrentSpeed } from "../utils.js";

export async function dijkstra(){
    // 1. Get start and end nodes
    let startNode, endNode;
    for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < COLS; col++){
            if(grid[row][col].isStart)startNode = grid[row][col];
            if(grid[row][col].isEnd)endNode = grid[row][col];
        }
    }
     // 2. Reset all nodes (except walls)
    //  resetVisualization();
     for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < COLS; col++){
            const node = grid[row][col];
            if(!node.isStart && !node.isEnd && !node.isWall){
                node.element.className = 'node';
                node.distance = Infinity;
                node.isVisited = false;
                node.previousNode = null;
            }
        }
     }

    // 3. Set start node distance to 0
     startNode.distance = 0;

    // 4. Create a list of all nodes to visit
    const unVisitedNodes = [];
    for(let row = 0; row < ROWS ; row++){
        for(let col = 0; col < COLS; col++){
            if(!grid[row][col].isWall){
                unVisitedNodes.push(grid[row][col]);
            }
        }
    }
    // 5. Arrays to track visited nodes and shortest path
    let visitedNodesInOrder = [];
    let isFoundEnd = false;
    // 5. Main algorithm loop
    while(unVisitedNodes.length > 0){
        unVisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);

        const closestNode = unVisitedNodes.shift();

        if(closestNode.distance===Infinity)break;

        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        // closestNode.element.classList.add('visited');

        if(closestNode === endNode){
            isFoundEnd = true;
            break;
        }

        updateNeighbors(closestNode);
    }
     
    // 6. After algorithm completes, show the shortest path and animate the result
    await animateAlgorithm(visitedNodesInOrder, endNode, isFoundEnd);
    // showShortestPath(endNode);
}
function updateNeighbors(node){
    const row = node.row;
    const col = node.col;
    const neighbors = [];

    // Get all adjacent nodes (up, down, left, right)
    // if(row > 0) neighbors.push(grid[row-1][col]);       //up
    // if(row < ROWS-1)neighbors.push(grid[row+1][col]);   //Down
    // if(col > 0)neighbors.push(grid[row][col-1]);        //Left
    // if(col < COLS-1)neighbors.push(grid[row][col+1]);   //Right

    const directions = [[-1,0],[0,1],[1,0],[0,-1]];

    for(const [dr,dc] of directions){
        const newRow = row+dr;
        const newCol = col+dc;

        if(newRow < 0 || newRow >= ROWS || newCol < 0 || newCol >= COLS){
            continue;
        }

        const neighbor = grid[newRow][newCol];
        if(neighbor.isWall || neighbor.element.classList.contains('visited')){
            continue;
        }
         // Calculate new distance
        const newDistance = node.distance+1;
        if(newDistance < neighbor.distance){
            neighbor.distance = newDistance;
            neighbor.previousNode = node;
        }
    }
   
}

async function animateAlgorithm(visitedNodes,endNode,isFoundEnd){
    SetAnimationState(true);

    for(let i = 0; i < visitedNodes.length ;i++){
        const node= visitedNodes[i];
        node.element.classList.add('visited');

        await getDelay(getCurrentSpeed());
    }

    if(isFoundEnd){
        await showShortestPath(endNode);
    }
    else{
        SetAnimationState(false);
    }
}
async function showShortestPath(endNode){
    const shortestPath = [];
    
    // Work backwards from end node to start node
    let currentNode = endNode.previousNode;
    while(currentNode && !currentNode.isStart){
        // currentNode.element.classList.add('shortest-path');
        // shortestPath.push(currentNode);
        shortestPath.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }

    
    
    for(let i = 0; i < shortestPath.length; i++){
        shortestPath[i].element.classList.add('shortest-path');
        await getDelay(getCurrentSpeed());
    }
    SetAnimationState(false);
}