import { loadNavBar, loadFooter, LoadPageHeading } from "../inject.js";
document.addEventListener("DOMContentLoaded", () => {
LoadPageHeading(
    "Tree Traversal Visualizer",
    "Visualize binary trees and binary search trees. Explore traversal algorithms like In-order, Pre-order, Post-order, and Level-order."
);
loadNavBar();
loadFooter();
});


const generateButton = document.getElementById("generate-tree");
const startButton = document.getElementById("start-traversal");

const slowBtn = document.getElementById("slow-speed");
const mediumBtn = document.getElementById("medium-speed");
const fastBtn = document.getElementById("fast-speed");
const svg = document.getElementById("tree-svg");
const traversalResultContainer = document.getElementById("traversal-result-container");
const resetBtn = document.getElementById("reset-btn");

const inOrderBtn = document.getElementById("in-order");
const preOrderBtn = document.getElementById("pre-order");
const postOrderBtn = document.getElementById("post-order");
const levelOrderBtn = document.getElementById("level-order");

const binaryTreeBtn = document.getElementById("binary-tree");
const binarysearchBtn = document.getElementById("binary-search-tree");
const AVLTreeBtn = document.getElementById("AVL-tree");
const completeBinaryTreeBtn = document.getElementById("complete-binary-tree");

inOrderBtn.classList.add('active');
mediumBtn.classList.add('active');
binaryTreeBtn.classList.add('active');
let isTraversing = false;
let traversalTimeoutIds = [];
let stopTraversal = false;
let currentSpeed = 800;
let selectedTreeType = "binary-tree";

class TreeNode{
    constructor(value){
        this.value = value;
        this.right = null;
        this.left = null;
        this.x = 0;
        this.y = 0;
        this.id = `node-${Math.random().toString(36).substr(2,9)}`;
    }
}

let root = null;
function createSampleTree(){
    root = new TreeNode(50);

    root.left = new TreeNode(30);
    root.right = new TreeNode(77);

    root.left.left = new TreeNode(20);
    root.left.right = new TreeNode(40);

    root.right.left = new TreeNode(60);
    root.right.right = new TreeNode(80);
}

createSampleTree();

// let leftChild = new TreeNode(60);
// let rightChild = new TreeNode(77);
// console.log(root);
// console.log(root.left);
// console.log(root.right);

function setNodePosition(node, depth = 0, position = 0, totalDepth = 3){
    if(!node) return;

    const canvasWidth = 800;
    const canvasHeight = 400;

    const spacingX = canvasWidth / Math.pow(2,depth+1);
    const x = position * spacingX + spacingX / 2;

    const y = (depth+1) * (canvasHeight / (totalDepth + 2));

    node.x = x;
    node.y = y;

    setNodePosition(node.left, depth+1, position*2, totalDepth);
    setNodePosition(node.right, depth+1, position*2+1, totalDepth);
}

setNodePosition(root);

console.log("With positions",root);


function generateRandomTree(){
    let values= [];
    let size = Math.floor(Math.random()*10)+5;
    while(values.length < size){
        let num = Math.floor(Math.random()*90)+10;
        if(!values.includes(num)){
            values.push(num);
        }
    }
    values.sort((a,b)=> a-b);
    if(selectedTreeType == 'binary-search-tree'){
        root = buildBalancedBST(values,0,values.length-1);
    }
    else if(selectedTreeType == 'AVL-tree'){
        root = buildAVLTree(values);
    }
    else if(selectedTreeType == 'complete-tree'){
        root = buildCompleteBinaryTree(values);
    }
    else if(selectedTreeType == 'binary-tree'){
        root = buildBinaryTree(values);
    }
}

function buildBalancedBST(arr , start, end){

    if(start > end)return null;

    let mid = Math.floor((start+end)/2);
    let node = new TreeNode(arr[mid]);

    node.left = buildBalancedBST(arr ,start, mid-1);
    node.right = buildBalancedBST(arr,mid+1,end);
    
    return node;
}

function buildCompleteBinaryTree(values){
    if(values.length === 0)return null;

    const root = new TreeNode(values[0]);
    const queue = [root];
    let i = 1;

    while(i<values.length){
        const current = queue.shift();

        current.left = new TreeNode(values[i]);
        queue.push(current.left);
        i++;

        if(i<values.length){
            current.right = new TreeNode(values[i]);
            queue.push(current.right);
            i++;
        }
    }
    return root;
}
function buildBinaryTree(values){
    if(values.length === 0)return null;

    const root = new TreeNode(values[0]);
    const queue = [root];
    let i = 0;

    while(i<values.length && queue.length){
        const current = queue.shift();

        if(i < values.length){
            current.left = new TreeNode(values[i]);
            queue.push(current.left);
            i++;
        }
        if(i <values.length){
            current.right = new TreeNode(values[i]);
            queue.push(current.right);
            i++;
        }
    }
    return root;
}   

function drawTree(node, svg){
    if(!node)return;

    if(node.left){
        drawLine(svg, node.x, node.y, node.left.x, node.left.y);
    }
    if(node.right){
        drawLine(svg, node.x, node.y, node.right.x, node.right.y);
    }

    drawNode(svg,node);

    drawTree(node.left, svg);
    drawTree(node.right, svg);
}

function drawLine(svg, x1, y1, x2, y2){
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1",x1); // start X
    line.setAttribute("y1",y1); // start y
    line.setAttribute("x2",x2); // end X
    line.setAttribute("y2",y2); // end y
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width","2");
    svg.appendChild(line);
}

function drawNode(svg, node){

    let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("id", node.id);
    group.setAttribute("transform", `translate(${node.x}, ${node.y})`);

    //circle
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r","20");// radius
    circle.setAttribute("fill","#ffffff");// white inside
    circle.setAttribute("stroke","#000000");// black border
    circle.setAttribute("stroke-width","2");// border thickness

    //text
    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("text-anchor","middle");// center horizontally
    text.setAttribute("dominant-baseline","middle");// center vertically
    text.setAttribute("font-size","14");
    text.setAttribute("font-weight","bold");
    text.textContent = node.value; // the number

    group.appendChild(circle);
    group.appendChild(text);
    svg.appendChild(group);
}

function getDelay(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function traverse(Type){
    if(isTraversing)return ;


    stopTraversal = false;
    isTraversing = true;
    
    disableControls();

    if(Type=="inorder"){
        await inorderTraversal(root);
    }else if(Type=="preorder"){
        await preOrderTraversal(root);
    }
    else if(Type=="postorder"){
        await postOrderTraversal(root);
    }
    else if(Type=="levelorder"){
        await levelOrderTraversal(root);
    }

    isTraversing = false;
    enableControls();
    //remove last arrow
    // let last = traversalResultContainer.lastChild;
    // if(last && last.classList.contains("traversal-result-arrow")){
    //     traversalResultContainer.removeChild(last);
    // }
}
async function inorderTraversal(node){
    if(!node || stopTraversal)return;

    await inorderTraversal(node.left);
    if(stopTraversal)return;

    highlightNode(node);
    showTraversalStep(node.value);
    await getDelay(currentSpeed);

    await inorderTraversal(node.right);
}
async function preOrderTraversal(node){
    if(!node || stopTraversal)return;

    highlightNode(node);
    showTraversalStep(node.value);
    await getDelay(currentSpeed);

    await preOrderTraversal(node.left);

    await preOrderTraversal(node.right);
}
async function postOrderTraversal(node){
    if(!node || stopTraversal)return;

    await postOrderTraversal(node.left);

    await postOrderTraversal(node.right);
    if(stopTraversal)return;

    highlightNode(node);
    showTraversalStep(node.value);
    await getDelay(currentSpeed);
    
}
async function levelOrderTraversal(node){
    if(!node || stopTraversal)return;

    const queue = [node];

    while(queue.length>0 && isTraversing){
        const current = queue.shift();
        
        highlightNode(current);
        showTraversalStep(current.value);
        await getDelay(currentSpeed);

        if(current.left) queue.push(current.left);
        if(current.right) queue.push(current.right);
    }

}
function highlightNode(node){
    const nodeGroup = document.getElementById(node.id);
    if(nodeGroup){
        nodeGroup.classList.add('highlight');
    }
}
function clearHighlightNode(){
    document.querySelectorAll(".highlight").forEach(el => el.classList.remove("highlight"));
}

function showTraversalStep(value){
    document.querySelector(".traversal-result-para").style.display="none";


    const hasCircle = document.querySelector(".traversal-result-circle");
    if(hasCircle){
        const arrow =document.createElement("div");
        arrow.classList.add("traversal-result-arrow");
        arrow.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="button-arrow-white" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
        `;
        traversalResultContainer.appendChild(arrow);
    }
    const resultCircle = document.createElement("div");
    resultCircle.classList.add("traversal-result-circle");
    resultCircle.textContent=value;

    
    // if(traversalResultContainer.children.length>0){
    
    // }

    traversalResultContainer.appendChild(resultCircle);
    
}

function clearTraversalOutput(){
    traversalResultContainer.innerHTML = ` <p class="traversal-result-para">Nodes will appear here as they are visited.</p>`;
}
function cancelTraversal(){
    stopTraversal = true;
    isTraversing = false;
}

generateButton.addEventListener("click",() => {
    generateRandomTree();
    setNodePosition(root);
    console.log("Tree Generated",root);
    svg.innerHTML= "";
    drawTree(root,svg);
    clearHighlightNode();
    clearTraversalOutput();
});

startButton.addEventListener("click",async() => {
    console.log("clicked start button");
    disableControls();
    clearTraversalOutput();
    clearHighlightNode();

    svg.innerHTML="";
    drawTree(root,svg);

    if(inOrderBtn.classList.contains('active')){
        await traverse("inorder");
    }else if(preOrderBtn.classList.contains('active')){
        await traverse("preorder");
    }
    else if(postOrderBtn.classList.contains('active')){
        await traverse("postorder");
    }
    else if(levelOrderBtn.classList.contains('active')){
        await traverse("levelorder");
    }

    enableControls();
    console.log("Traversal Done");
    
});
resetBtn.addEventListener("click", () => {

    clearTraversalOutput();
    cancelTraversal();
    clearHighlightNode();
    
    createSampleTree();
    setNodePosition(root);
    svg.innerHTML="";
    drawTree(root,svg);

    enableControls();
});

slowBtn.addEventListener("click",() => {
    currentSpeed=1500;
    slowBtn.classList.add('active');
    mediumBtn.classList.remove('active');
    fastBtn.classList.remove('active');
});

mediumBtn.addEventListener("click",() => {
    currentSpeed=800;
    slowBtn.classList.remove('active');
    mediumBtn.classList.add('active');
    fastBtn.classList.remove('active');
});
fastBtn.addEventListener("click",() => {
    currentSpeed=300;
    slowBtn.classList.remove('active');
    mediumBtn.classList.remove('active');
    fastBtn.classList.add('active');
});
inOrderBtn.addEventListener('click',() => {
    inOrderBtn.classList.add('active');
    preOrderBtn.classList.remove('active');
    postOrderBtn.classList.remove('active');
    levelOrderBtn.classList.remove('active');
});
preOrderBtn.addEventListener('click',() => {
    preOrderBtn.classList.add('active');
    inOrderBtn.classList.remove('active');
    postOrderBtn.classList.remove('active');
    levelOrderBtn.classList.remove('active');
});
postOrderBtn.addEventListener('click',() => {
    postOrderBtn.classList.add('active');
    inOrderBtn.classList.remove('active');
    preOrderBtn.classList.remove('active');
    levelOrderBtn.classList.remove('active');
});
levelOrderBtn.addEventListener('click',() => {
    inOrderBtn.classList.remove('active');
    preOrderBtn.classList.remove('active');
    postOrderBtn.classList.remove('active');
    levelOrderBtn.classList.add('active');
});
binaryTreeBtn.addEventListener('click', () => {
    selectedTreeType = "binary-tree";
    binaryTreeBtn.classList.add('active');
    binarysearchBtn.classList.remove('active');
    AVLTreeBtn.classList.remove('active');
    completeBinaryTreeBtn.classList.remove('active');
});

binarysearchBtn.addEventListener('click', () => {
    selectedTreeType = "binary-search-tree";
    binaryTreeBtn.classList.remove('active');
    binarysearchBtn.classList.add('active');
    AVLTreeBtn.classList.remove('active');
    completeBinaryTreeBtn.classList.remove('active');
});

AVLTreeBtn.addEventListener('click', () => {
    selectedTreeType = "AVL-tree";
    binaryTreeBtn.classList.remove('active');
    binarysearchBtn.classList.remove('active');
    AVLTreeBtn.classList.add('active');
    completeBinaryTreeBtn.classList.remove('active');
});

completeBinaryTreeBtn.addEventListener('click', () => {
    selectedTreeType = "complete-tree";
    binaryTreeBtn.classList.remove('active');
    binarysearchBtn.classList.remove('active');
    AVLTreeBtn.classList.remove('active');
    completeBinaryTreeBtn.classList.add('active');
});
window.addEventListener('DOMContentLoaded',() => {
    svg.innerHTML="";
    drawTree(root,svg);
});

function disableControls(){
    startButton.disabled = true;
    generateButton.disabled = true;
    inOrderBtn.disabled = true;
    postOrderBtn.disabled = true;
    levelOrderBtn.disabled = true;
    preOrderBtn.disabled = true;
    binaryTreeBtn.disabled = true;
    binarysearchBtn.disabled = true;
    completeBinaryTreeBtn.disabled = true;
    AVLTreeBtn.disabled = true;
}

function enableControls(){
    startButton.disabled = false;
    generateButton.disabled = false;
    inOrderBtn.disabled = false;
    postOrderBtn.disabled = false;
    levelOrderBtn.disabled = false;
    preOrderBtn.disabled = false;
    binaryTreeBtn.disabled = false;
    binarysearchBtn.disabled = false;
    completeBinaryTreeBtn.disabled = false;
    AVLTreeBtn.disabled = false;
}