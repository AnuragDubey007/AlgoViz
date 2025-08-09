// algorithms/a-star.js
import { grid, ROWS, COLS, getAnimationState, SetAnimationState } from "../constants.js";
import { getDelay, getCurrentSpeed, PriorityQueue } from "../utils.js";

/*
  Simple A* (Manhattan heuristic) implementation for the visualizer.
  - Clear and short variable names
  - Handles edge cases and external cancel/reset
  - Uses node.weight for weighted tiles (default 1)
  - Uses your PriorityQueue: enqueue(node, priority) and dequeue() => {node, priority}
*/


/** Manhattan distance between two nodes (admissible when min edge cost = 1) */
function heuristic(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export async function astar() {
  // 1) find start and end nodes
  let start = null;
  let end = null;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c].isStart) start = grid[r][c];
      if (grid[r][c].isEnd) end = grid[r][c];
    }
  }

  // 2) validate
  if (!start || !end) {
    SetAnimationState(false);
    alert("Start or End node not set.");
    return;
  }

  // 3) trivial case: start is end (nothing to animate)
  if (start === end) return;

  // 4) reset algorithm state per-node but keep walls/start/end/bombs intact
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const n = grid[r][c];
      n.g = Infinity;           // cost from start
      n.f = Infinity;           // g + h
      n.isVisited = false;      // finalized flag
      n.previousNode = null;
      n.element.textContent = ""; // clear any debug text

      // Clear only animation visuals for regular cells (do not remove start/end/wall)
      if (!n.isStart && !n.isEnd && !n.isWall && !n.isBomb) {
        n.element.classList.remove("visited", "shortest-path", "open", "closed", "bomb-affected");
        n.element.textContent = ""; // clear debug/weight text
      }
    }
  }

  // 5) initialize open set with start
  start.g = 0;
  start.f = heuristic(start, end);
  const openSet = new PriorityQueue();
  openSet.enqueue(start, start.f);

  const visitedOrder = []; // store nodes in visitation order for animation
  let found = false;

    let nodesExpanded = 0;
    const startTime = performance.now();
    

  // 4-direction neighbors (up, right, down, left) — same order as other algorithms
  const dirs = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  // 6) main loop
  while (!openSet.isEmpty()) {
    // allow external cancel/reset: another part of app may flip this flag
    if (getAnimationState() === false) break;

    const entry = openSet.dequeue();
    if (!entry) break; // nothing left

    const current = entry.node;
    const entryPriority = entry.priority;

    // skip stale queue entries (we inserted snapshots earlier)
    if (entryPriority > (current.f ?? Infinity)) continue;

    // skip if already finalized
    if (current.isVisited) continue;

    // skip obstacles
    if (current.isWall || current.isBomb) continue;


    // finalize current
    current.isVisited = true;
    
    // visual: mark closed, remove open
    if (!current.isStart && !current.isEnd) {
    current.element.classList.remove('open');
    current.element.classList.add('closed');
    }
    nodesExpanded++;
   
    // allow UI to repaint so the '.closed' mark appears step-by-step
    if (getAnimationState() === false) break; // respect external cancel
    await getDelay(getCurrentSpeed());

    // unreachable sentinel (defensive)
    if (current.g === Infinity) break;

    // record for animation
    visitedOrder.push(current);

    // goal check
    if (current === end) {
      found = true;
      break;
    }

    // relax neighbors
    for (const [dr, dc] of dirs) {
      const nr = current.row + dr;
      const nc = current.col + dc;

      // bounds check
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;

      const neighbor = grid[nr][nc];
      
      if (neighbor.isVisited) continue;

      // skip obstacles
      if (neighbor.isWall || neighbor.isBomb) continue;

      // tentative g (account for neighbor.weight)
      const newG = current.g + (neighbor.weight ?? 1);

      // better path found?
      if (newG < (neighbor.g ?? Infinity)) {
        neighbor.previousNode = current;
        neighbor.g = newG;
        neighbor.f = neighbor.g + heuristic(neighbor, end);
        // enqueue snapshot with its f-value (duplicates okay)
        // openSet.enqueue(neighbor, neighbor.f);
        openSet.enqueue(neighbor, neighbor.f);

        // show as open (unless start/end)
        // mark open visually
        if (!neighbor.isStart && !neighbor.isEnd && !neighbor.isWall && !neighbor.isBomb && !neighbor.element.classList.contains("open")) {
            neighbor.element.classList.add('open');
        }
        // very important: allow UI to repaint so the 'open' mark appears step-by-step
        await getDelay(getCurrentSpeed());
      }
    }
  }
    // 7) animate visited nodes then the shortest path (if found)
    await animateVisited(visitedOrder, end, found);

    
    const timeTaken = (performance.now() - startTime).toFixed(2);
    console.log(`Expanded: ${nodesExpanded}, Time: ${timeTaken}ms`);

}

/* --- animation helpers --- */

async function animateVisited(list, end, found) {
  // mark animation running
  SetAnimationState(true);

  for (const n of list) {
    // don't override start/end styles
    if (!n.isStart && !n.isEnd) {
        n.element.classList.remove("closed");   // <--- remove closed first
        n.element.classList.add("visited");
        // optional: show weight value for debugging (remove if you want cleaner UI)
        if (n.isWeight) n.element.textContent = n.weight;
    }
    await getDelay(getCurrentSpeed());
  }

  if (found) {
    await showPath(end);
  } else {
    // no path found — stop animation state
    SetAnimationState(false);
  }
}

async function showPath(end) {
  // reconstruct path backwards using previousNode
  const path = [];
  let cur = end.previousNode;
  while (cur && !cur.isStart) {
    path.unshift(cur);
    cur = cur.previousNode;
  }

  // animate path (don't override start/end)
  for (const n of path) {
    if (!n.isStart && !n.isEnd) n.element.classList.add("shortest-path");
    await getDelay(getCurrentSpeed());
  }

  SetAnimationState(false);
}


