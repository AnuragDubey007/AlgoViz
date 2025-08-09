// maze.js
import { grid, ROWS, COLS } from "./constants.js";
import { getDelay, getCurrentSpeed } from "./utils.js";

export function randomWalls() {
    console.log("Running Random Walls pattern...");
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (Math.random() < 0.25) { // 25% chance wall
                let node = grid[row][col];
                if (!node.isStart && !node.isEnd) {
                    node.isWall = true;
                    node.element.classList.add("wall");
                }
            }
        }
    }
}

export async function recursiveDivision() {
    console.log("Running Recursive Division pattern...");
    
    // First clear all walls (except start/end nodes)
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const node = grid[row][col];
            if (!node.isStart && !node.isEnd) {
                node.isWall = false;
                node.element.classList.remove("wall");
            }
        }
    }

    // Add border walls
    for (let col = 0; col < COLS; col++) {
        grid[0][col].isWall = true;
        grid[0][col].element.classList.add("wall");
        grid[ROWS-1][col].isWall = true;
        grid[ROWS-1][col].element.classList.add("wall");
    }
    for (let row = 0; row < ROWS; row++) {
        grid[row][0].isWall = true;
        grid[row][0].element.classList.add("wall");
        grid[row][COLS-1].isWall = true;
        grid[row][COLS-1].element.classList.add("wall");
    }
    
    // Start the recursive division with the entire grid (minus borders)
    divide(1, 1, ROWS-2, COLS-2);
}

async function divide(minRow, minCol, maxRow, maxCol) {
    await getDelay(getCurrentSpeed());
    // Base case - area too small to divide further
    if (maxRow - minRow < 2 || maxCol - minCol < 2) {
        return;
    }

    // Choose orientation (horizontal or vertical)
    // Prefer horizontal if area is wider than tall
    const horizontal = (maxRow - minRow) > (maxCol - minCol);

    // Determine where to draw the wall
    let wallRow, wallCol;
    if (horizontal) {
        wallRow = getRandomEven(minRow + 1, maxRow - 1);
        createHorizontalWall(minCol, maxCol, wallRow);
        
        // Recursively divide the top and bottom areas
        divide(minRow, minCol, wallRow - 1, maxCol);
        divide(wallRow + 1, minCol, maxRow, maxCol);
    } else {
        wallCol = getRandomEven(minCol + 1, maxCol - 1);
        createVerticalWall(minRow, maxRow, wallCol);
        
        // Recursively divide the left and right areas
        divide(minRow, minCol, maxRow, wallCol - 1);
        divide(minRow, wallCol + 1, maxRow, maxCol);
    }
}

function createHorizontalWall(minCol, maxCol, row) {
    // Choose a random gap in the wall
    const gap = getRandomOdd(minCol, maxCol);
    
    for (let col = minCol; col <= maxCol; col++) {
        // Skip the gap and start/end nodes
        if (col === gap || grid[row][col].isStart || grid[row][col].isEnd) {
            continue;
        }
        
        grid[row][col].isWall = true;
        grid[row][col].element.classList.add("wall");
    }
}

function createVerticalWall(minRow, maxRow, col) {
    // Choose a random gap in the wall
    const gap = getRandomOdd(minRow, maxRow);
    
    for (let row = minRow; row <= maxRow; row++) {
        // Skip the gap and start/end nodes
        if (row === gap || grid[row][col].isStart || grid[row][col].isEnd) {
            continue;
        }
        
        grid[row][col].isWall = true;
        grid[row][col].element.classList.add("wall");
    }
}

// Helper function to get random even number in range
function getRandomEven(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num % 2 === 0 ? num : num - 1;
}

// Helper function to get random odd number in range
function getRandomOdd(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num % 2 === 1 ? num : num - 1;
}