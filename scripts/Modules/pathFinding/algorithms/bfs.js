import { grid,ROWS,COLS,SetAnimationState } from "../constants.js";
import { getCurrentSpeed, getDelay } from "../utils.js";

export async function BFS(isFirstLeg = false, wayPoint = null) {

    let startNode,endNode;

    // Determine start and end based on whether we're doing first or second leg
    if (isFirstLeg && wayPoint) {
        // First leg: start to waypoint
        for(let row = 0; row < ROWS; row++){
            for(let col = 0; col < COLS; col++){
                if(grid[row][col].isStart) startNode = grid[row][col];
                if(grid[row][col] === wayPoint) endNode = grid[row][col];
            }
        }
    } else if (wayPoint) {
        // Second leg: waypoint to end
        for(let row = 0; row < ROWS; row++){
            for(let col = 0; col < COLS; col++){
                if(grid[row][col] === wayPoint) startNode = grid[row][col];
                if(grid[row][col].isEnd) endNode = grid[row][col];
            }
        }
    } else {
        // Normal case: start to end
        for(let row = 0; row < ROWS; row++){
            for(let col = 0; col < COLS; col++){
                if(grid[row][col].isStart) startNode = grid[row][col];
                if(grid[row][col].isEnd) endNode = grid[row][col];
            }
        }
    }

    if (!startNode || !endNode) {
        SetAnimationState(false);
        alert('Start or End node not set.');
        return null;
    }
    
    for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < COLS; col++){
            const node = grid[row][col];
            if (!node.isStart && !node.isEnd && !node.isWall) {
                if (isFirstLeg) {
                    // First run (Start → Waypoint) → clear everything
                    node.element.classList.remove('visited', 'visited-leg1', 'shortest-path');
                } else {
                    // Second run (Waypoint → End) → don't clear the purple path
                    node.element.classList.remove('visited', 'shortest-path');
                }
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
                    // In waypoint mode a tile may be isBomb === true but isWall === false.
                    // So use only isWall for blockage.
                    if(!neighbor.isVisited && !neighbor.isWall){
                        neighbor.isVisited = true;
                        neighbor.previousNode = currentNode;
                        queue.push(neighbor);
                    }
                }
            //}
        }
    }
    // 6. After algorithm completes, show the shortest path and animate the result
    const path = await animateAlgorithm(visitedNodesInOrder, endNode, isFoundEnd, isFirstLeg , !!wayPoint);
    return path;
}

async function animateAlgorithm(visitedNodes,endNode,isFoundEnd, isFirstLeg, hasWaypoint){
    SetAnimationState(true);

    for(let i = 0; i < visitedNodes.length ;i++){
        const node= visitedNodes[i];
        // Skip start/end visuals changes
        if (!node.isStart && !node.isEnd) {
            if (isFirstLeg) {
                node.element.classList.remove('visited');
                node.element.classList.add('visited-leg1');
            } else {
                node.element.classList.remove('visited-leg1');
                node.element.classList.add('visited');
            }
        }

        await getDelay(getCurrentSpeed());
        if (node === endNode) break; // stop animation once end reached
    }

    if(isFoundEnd){
        // Return the shortest path array (do not animate it here)
        if (hasWaypoint) {
            // In waypoint mode: return the shortest-path array so the orchestrator can combine both legs
            const shortestPath = await showShortestPath(endNode, true);
            return shortestPath; // array (may be empty if direct neighbors)
        } else {
            // Normal mode (no waypoint): animate the shortest path here (legacy behavior)
            await showShortestPath(endNode, false); // this will animate
            return []; // return something (not used by caller)
        }
    }
    else{
        SetAnimationState(false);
    }
}
// If returnToStart === true -> return the array (do NOT animate).
// If returnToStart === false -> animate and return nothing
async function showShortestPath(endNode, returnToStart = false) {
    const shortestPath = [];
    
    // Work backwards from end node to start node
    let currentNode = endNode.previousNode;
    while(currentNode && !currentNode.isStart){
        // currentNode.element.classList.add('shortest-path');
        // shortestPath.push(currentNode);
        shortestPath.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }

    if(returnToStart) return shortestPath;
    
    for(let i = 0; i < shortestPath.length; i++){
        shortestPath[i].element.classList.add('shortest-path');
        await getDelay(getCurrentSpeed());
    }
    SetAnimationState(false);
}



