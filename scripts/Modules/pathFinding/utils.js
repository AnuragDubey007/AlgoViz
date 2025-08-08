import { ROWS, COLS, grid} from "./constants.js";

export function getDelay(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
};

export function getCurrentSpeed(){
    const slider = document.getElementById('speed');
    const sliderValue = parseInt(slider.value);
    return 301- sliderValue * 3;
}


export function clearWeight(){
    for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < COLS; col++){
            const node = grid[row][col];
            if(!node)continue;
            if(node.isWeight){
                node.element.classList.remove('weight'); 
                node.isWeight = false;
                node.weight = 1;// Reset to default weight
            }
            
        }
    }
}



// utils.js - Add this class
export class PriorityQueue {
    constructor(){
        // binary min-heap stored as an array of entries { node, priority }
        this.heap = [];
    }

    enqueue(node, priority) {
        const entry = {node, priority };
        this.heap.push(entry);
        this._bubbleUp(this.heap.length -1);
    }

    dequeue() {
        if (this.isEmpty()) return null;
        const root = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this._bubbleDown(0);
        }
        return root; // { node, priority }
    }
      // convenience helpers
    peek() { return this.heap.length ? this.heap[0] : null; }
    size() { return this.heap.length; }
    clear() { this.heap.length = 0; }


//       _compare(i, j) {
//     const a = this.heap[i], b = this.heap[j];
//     if (a.priority !== b.priority) return a.priority - b.priority;
//     const an = a.node, bn = b.node;
//     if (an && bn && typeof an.row === 'number' && typeof an.col === 'number') {
//       if (an.row !== bn.row) return an.row - bn.row;
//       return an.col - bn.col;
//     }
//     return 0;
//   }


    _bubbleUp(index) {
            while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[index].priority >= this.heap[parentIndex].priority) break;
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }

    _bubbleDown(index) {
            const length = this.heap.length;
            while (true) {
                const left = 2 * index + 1;
                const right = 2 * index + 2;
                let smallest = index;

                if (left < length && this.heap[left].priority < this.heap[smallest].priority) {
                    smallest = left;
                }
                if (right < length && this.heap[right].priority < this.heap[smallest].priority) {
                    smallest = right;
                }
                if (smallest === index) break;

                [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
                index = smallest;
            }
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}


