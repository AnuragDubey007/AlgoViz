import {grid, ROWS,COLS,SetAnimationState } from "../constants.js";
import { getDelay,getCurrentSpeed } from "../utils.js";

export async function DFS(isFirstLeg = false, wayPoint = null) {
    let startNode,endNode;

    if (isFirstLeg && wayPoint) {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (grid[row][col].isStart) startNode = grid[row][col];
                if (grid[row][col] === wayPoint) endNode = grid[row][col];
            }
        }
    } else if (wayPoint) {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (grid[row][col] === wayPoint) startNode = grid[row][col];
                if (grid[row][col].isEnd) endNode = grid[row][col];
            }
        }
    } else {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (grid[row][col].isStart) startNode = grid[row][col];
                if (grid[row][col].isEnd) endNode = grid[row][col];
            }
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

    const visitedNodesInOrder = [];
    let isFoundEnd = false;

    async function dfsHelper(node){
        if(!node || node.isVisited || isFoundEnd)return;

        node.isVisited = true;
        visitedNodesInOrder.push(node);

        if(node == endNode){
            isFoundEnd = true;
            return;
        }

        const directions = [[-1,0],[0,1],[1,0],[0,-1]];

        for(const [dr,dc] of directions){
            const newRow = node.row + dr;
            const newCol = node.col + dc;

            if(newRow < 0 || newRow >= ROWS || newCol < 0 || newCol >= COLS)continue;

            const neighbor = grid[newRow][newCol];
            if(!neighbor.isVisited && !neighbor.isWall){
                neighbor.previousNode = node;
                await dfsHelper(neighbor);
            }
        }
    }

    SetAnimationState(true);
    await dfsHelper(startNode);
    const path = await animateAlgorithm(visitedNodesInOrder,endNode,isFoundEnd, isFirstLeg, !!wayPoint);
    return path;
}



async function animateAlgorithm(visitedNodes,endNode,isFoundEnd, isFirstLeg, hasWaypoint){
    SetAnimationState(true);

    for(let i = 0; i < visitedNodes.length ;i++){
        const node= visitedNodes[i];
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
    }

    if (isFoundEnd) {
        if (hasWaypoint) {
            const shortestPath = await showShortestPath(endNode, true);
            return shortestPath;
        } else {
            await showShortestPath(endNode, false);
            return [];
        }
    } else {
        SetAnimationState(false);
        return null;
    }
}

async function showShortestPath(endNode, returnToStart = false){
    const shortestPath = [];
    
    // Work backwards from end node to start node
    let currentNode = endNode.previousNode;
    while(currentNode && !currentNode.isStart){
        // currentNode.element.classList.add('shortest-path');
        // shortestPath.push(currentNode);
        shortestPath.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }

    if (returnToStart) return shortestPath;
    
    for(let i = 0; i < shortestPath.length; i++){
        shortestPath[i].element.classList.add('shortest-path');
        await getDelay(getCurrentSpeed());
    }
    SetAnimationState(false);
}