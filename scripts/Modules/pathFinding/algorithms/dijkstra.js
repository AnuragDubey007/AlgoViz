import { grid,ROWS,COLS,getAnimationState,SetAnimationState} from "../constants.js";
import { getDelay,getCurrentSpeed, PriorityQueue } from "../utils.js";

export async function dijkstra(){
    // 1. Get start and end nodes
    let startNode, endNode;
    for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < COLS; col++){
            if(grid[row][col].isStart)startNode = grid[row][col];
            if(grid[row][col].isEnd)endNode = grid[row][col];
        }
    }

    if (!startNode || !endNode) {
        SetAnimationState(false);
        alert('Start or End node not set.');
        return;
    }
     // 2. Reset all nodes (except walls)
    //  resetVisualization();
     for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < COLS; col++){
            const node = grid[row][col];
            node.distance = Infinity;
            node.isVisited = false;
            node.previousNode = null;
            // Add this line to clear any previous text:
            node.element.textContent = '';
            if(!node.isStart && !node.isEnd && !node.isWall && !node.isBomb){
                node.element.classList.remove('visited', 'shortest-path');
            }
        }
     }

    // 3. Set start node distance to 0
     startNode.distance = 0;

    // 4. Create a list of all nodes to visit
    const unVisitedNodes = new PriorityQueue();
    unVisitedNodes.enqueue(startNode, 0);

    // Initialize with all non-wall nodes
    // for(let row = 0; row < ROWS ; row++){
    //     for(let col = 0; col < COLS; col++){
    //         if(!grid[row][col].isWall){
    //             unVisitedNodes.enqueue(grid[row][col]);
    //         }
    //     }
    // }
    // 5. Arrays to track visited nodes and shortest path
    let visitedNodesInOrder = [];
    let isFoundEnd = false;

    // const visitedSet = new Set();
    // 5. Main algorithm loop
    while(!unVisitedNodes.isEmpty()){
        // unVisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);

        const entry = unVisitedNodes.dequeue();
        if(!entry) break;
        const closestNode = entry.node;
        const entryPriority = entry.priority;

        // If entryPriority > current best distance, it's stale — skip it.
        if (entryPriority > closestNode.distance) continue;

        // Skip if already visited with a shorter distance
        if (closestNode.isVisited) continue;

        

        // if(closestNode.isVisited)continue;

        // finalize
        closestNode.isVisited = true;

        if (closestNode.isWall || closestNode.isBomb) continue; // skip walls/bombs safely

        // If unreachable
        if(closestNode.distance === Infinity)break;

        visitedNodesInOrder.push(closestNode);
        // closestNode.element.classList.add('visited');

        if(closestNode === endNode){
            isFoundEnd = true;
            break;
        }

        updateNeighbors(closestNode, unVisitedNodes);
    }
     
    // 6. After algorithm completes, show the shortest path and animate the result
    await animateAlgorithm(visitedNodesInOrder, endNode, isFoundEnd);
    // showShortestPath(endNode);
}
async function updateNeighbors(node, unVisitedNodes){
    // const row = node.row;

    // const col = node.col;

    // Get all adjacent nodes (up, down, left, right)
    // if(row > 0) neighbors.push(grid[row-1][col]);       //up
    // if(row < ROWS-1)neighbors.push(grid[row+1][col]);   //Down
    // if(col > 0)neighbors.push(grid[row][col-1]);        //Left
    // if(col < COLS-1)neighbors.push(grid[row][col+1]);   //Right

    const directions = [[-1,0],[0,1],[1,0],[0,-1]];

    for(const [dr,dc] of directions){
        const newRow = node.row + dr;
        const newCol = node.col + dc;

        if(newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS){
           const neighbor = grid[newRow][newCol];

            if(!neighbor.isVisited && !neighbor.isWall && !neighbor.isBomb){
                // Calculate new distance
                const newDistance = node.distance + (neighbor.weight ?? 1); // For weighted: + neighbor.weight
                if(newDistance < neighbor.distance){
                    neighbor.distance = newDistance;
                    neighbor.previousNode = node;
                    // enqueue with snapshot priority
                    unVisitedNodes.enqueue(neighbor, neighbor.distance);
                    // debug:
                    // console.log(`update: (${closestNode.row},${closestNode.col}) -> (${neighbor.row},${neighbor.col}) weight=${neighbor.weight} newDist=${newDistance}`);
                }
            }
        }
    }
   
}

async function animateAlgorithm(visitedNodes,endNode,isFoundEnd){
    SetAnimationState(true);

    for(let i = 0; i < visitedNodes.length ;i++){
        const node= visitedNodes[i];
        node.element.classList.add('visited');
        // if(node.isWeight) {
        //     node.element.textContent = node.weight; // Show weight value
        // }
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