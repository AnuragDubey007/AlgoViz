export const ROWS = 25;
export const COLS = 60;
export let grid = [];

export let isAnimationRunning = false;

export function getAnimationState(){
    return isAnimationRunning;
}
export function SetAnimationState(value){
    isAnimationRunning = value;
}