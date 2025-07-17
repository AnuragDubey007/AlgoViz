import {grid, ROWS,COLS,SetAnimationState } from "../constants.js";
import { getDelay,getCurrentSpeed } from "../utils.js";

export async function DFS(){
    let startNode,endNode;

    for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < COLS; col++){
            if(grid[row][col].isStart)startNode = grid[row][col];
            if(grid[row][col].isEnd)endNode = grid[row][col];
        }
    }

    for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < COLS; col++){
            const node = grid[row][col];
            if(!node.isStart && !node.isEnd && !node.isWall){
                node.element.className = 'node';
            }
            node.isVisited = false;
            node.previousNode = null;
        }
    }

    const visitedNodesInOrder = [];
    let isFoundEnd = false;

    async function dfsHelper(node){
        if(!node || node.isVisited || node.isVisited || isFoundEnd)return;

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
    await animateAlgorithm(visitedNodesInOrder,endNode,isFoundEnd);
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