import { grid,ROWS,COLS,SetAnimationState } from "../constants.js";
import { getCurrentSpeed, getDelay } from "../utils.js";

export async function BFS(){

    let startNode,endNode;

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
    
    for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < COLS; col++){
            const node = grid[row][col];
            if(!node.isStart && !node.isEnd && !node.isWall){
                node.element.classList.remove('visited', 'shortest-path');
            }
            node.isVisited = false;
            node.previousNode = null;
        }
    }

    const queue = [];
    const visitedNodesInOrder = [];
    let isFoundEnd = false;

    startNode.isVisited=true;

    queue.push(startNode);

    while(queue.length>0){
        // const levelSize = queue.length;
        // for(let i = 0; i < levelSize; i++){
            const currentNode = queue.shift();
            visitedNodesInOrder.push(currentNode);

            // currentNode.element.classList.add('visited');
            // await getDelay(getCurrentSpeed());

            if(currentNode === endNode){
                isFoundEnd = true;
                break;
            }

            //Explore Neighbor
            const directions = [[-1,0],[0,1],[1,0],[0,-1]];

            for(const [dr,dc] of directions){
                const newRow = currentNode.row + dr;
                const newCol = currentNode.col + dc;

                // Skip if out of bounds
                if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
                    const neighbor = grid[newRow][newCol];
                    //skip if wall or already visited
                    if(!neighbor.isVisited && !neighbor.isWall && !neighbor.isBomb){
                        neighbor.isVisited = true;
                        neighbor.previousNode = currentNode;
                        queue.push(neighbor);
                    }
                }
            //}
        }
    }
    // 6. After algorithm completes, show the shortest path and animate the result
    await animateAlgorithm(visitedNodesInOrder, endNode, isFoundEnd);
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