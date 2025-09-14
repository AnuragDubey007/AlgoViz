import {loadNavBar,loadFooter, LoadPageHeading } from "../inject.js";

document.addEventListener("DOMContentLoaded", () => {
LoadPageHeading(
    "Linked List Visualizer",
    "Explore and understand the linked list data structure through interactive visualization. Add and remove nodes to see how linked lists work in real-time."
);

loadFooter();
loadNavBar();
});

class ListNode{
    constructor(value){
        this.value=value;
        this.next=null;
    }
}

class LinkedList{
    constructor(){
        this.head=null;
        this.tail=null;
        this.size=0;
    }

    addAtHead(value){
        const newNode = new ListNode(value);
        if(!this.head){
            this.head=this.tail=newNode;

        }else{
            newNode.next=this.head;
            this.head=newNode;
        }
        this.size++;
    }

    addAtTail(value){
        const newNode=new ListNode(value);

        if(!this.head){
            this.head = this.tail = newNode;
        }
        else{
            this.tail.next=newNode;
            this.tail=newNode;
        }   
        this.size++;

    }

    addAtPosition(value,position){
        if(position<=0){
            this.addAtHead(value);
        }else if(position>=this.size){
            this.addAtTail(value);
        }else{
            const newNode = new ListNode(value);

            let prev = this.head;
            for(let i=1;i<position;i++){
                prev=prev.next;
            }
            newNode.next = prev.next;
            prev.next = newNode;
            this.size++;
        }
        
    }

    removeAtHead(){
        if(this.size === 0){
            return ;
        }
        else if(this.size===1){
            this.head = this.tail = null;;
        }else{
            // const tempNode = this.head;
            this.head = this.head.next;
            // delete(this.head);
        }
        this.size--;
    }

    removeAtTail(){
        if(this.size === 0)return ;

        if(this.size === 1){
            this.head = this.tail = null;
        }
        else{
            let prev = this.head;

            while(prev.next != this.tail){
                prev = prev.next;
            }
            prev.next = null;
            this.tail = prev;
        }

        this.size--;
        

    }

    removeAtPosition(position){
        if(position<=0){
            this.removeAtHead();
        }else if(position>=this.size-1){
            this.removeAtTail();
        }else{
             let curr = this.head;
            for(let i = 1; i < position ; i++){
                curr = curr.next;
            }
            // If we're about to remove the node just before tail,
            // then update tail if needed
            if (curr.next === this.tail) {
                this.tail = curr;
            }
            // const temp = curr.next;
            curr.next = curr.next.next;
            // delete(temp);
            this.size--;
        }
       
    }

    search(value){
        const results = [];
        let idx = 0;
        let cur = this.head;
        while(cur){
            if(cur.value === value) results.push(idx);
            cur = cur.next;
            idx++;
        }
        return results;
    }
}

function renderLinkedList(list, highlightValue = null){
    const container = document.querySelector(".linked-list");
    container.innerHTML = '';
    
    let current = list.head;
    let index=1;
    let isempty ='Empty List';
    while(current){
        const nodeWrapper = document.createElement("div");
        nodeWrapper.classList.add("node");

        const nodeContent = document.createElement("div");
        nodeContent.classList.add("node-content");

        if(current === list.head){
            nodeContent.classList.add("head");
        }else if(current === list.tail){
            nodeContent.classList.add("tail");
        }else{
            nodeContent.classList.add("current");
        }

        // Highlight if matches
        if (highlightValue !== null && current.value === highlightValue) {
            nodeContent.classList.add("highlight");
        }

        nodeContent.textContent = current.value;
        nodeWrapper.appendChild(nodeContent);

        if(current.next != null){
            const arrow = document.createElement("div");
            arrow.classList.add("node-pointer");
            nodeWrapper.appendChild(arrow);
        }

        const label = document.createElement("div");
        label.classList.add("node-label");

        if(current === list.head && current === list.tail){
            label.textContent='Head/Tail';
        }else if(current === list.head){
            label.textContent = 'Head';
        }
        else if(current === list.tail){
            label.textContent = 'Tail';
        }else{
            label.textContent = `Node${index}`;
        }

        nodeWrapper.appendChild(label);
        container.appendChild(nodeWrapper);

        current=current.next;
        index++;
        isempty = '&nbsp';
    }

    const nullNode = document.createElement("div");
    nullNode.classList.add("node");

    nullNode.innerHTML=`
        <div class="node-null">NULL</div>
        <div class="node-label">${isempty}</div>
    `;
    //&nbsp; Takes up vertical space (so the .node-label has height) so it will not come down little bit and have alignment with its nodes yoooo
    
    
    container.appendChild(nullNode);

    updateStats(list);

}

const list = new LinkedList();

const valueInput = document.querySelectorAll(".control-input")[0];
const positionInput = document.querySelectorAll(".control-input")[1];

const addHeadBtn = document.querySelectorAll(".control-btn")[0];
const addTailBtn = document.querySelectorAll(".control-btn")[1];
const addAtPositionBtn = document.querySelectorAll(".control-btn")[2];
const removeHeadBtn = document.querySelectorAll(".control-btn.secondary")[0];
const removeTailBtn = document.querySelectorAll(".control-btn.secondary")[1];
const removeAtPositionBtn = document.querySelectorAll(".control-btn.secondary")[2];
const searchBtn = document.querySelectorAll(".control-btn.secondary")[3];
const clearAllBtn = document.querySelectorAll(".control-btn.danger")[0];

addHeadBtn.addEventListener("click",() => {
    // console.log("clicked");
    const value = parseInt(valueInput.value);
    if(isNaN(value))return;
    list.addAtHead(value);
    renderLinkedList(list);
});

addTailBtn.addEventListener("click",() => {
    const value = parseInt(valueInput.value);
    if(isNaN(value))return ;
    list.addAtTail(value);
    renderLinkedList(list);
});

addAtPositionBtn.addEventListener('click',() => {
    const value = parseInt(valueInput.value);
    const position = parseInt(positionInput.value);
    if(isNaN(value) ||isNaN(position))return;
    list.addAtPosition(value,position-1);
    renderLinkedList(list);
});

removeHeadBtn.addEventListener('click',() => {
    list.removeAtHead();
    renderLinkedList(list);
});

removeTailBtn.addEventListener('click',() => {
    list.removeAtTail();
    renderLinkedList(list);
});

removeAtPositionBtn.addEventListener('click', () => {
    // const value = parseInt(valueInput.value); no need of value
    const position = parseInt(positionInput.value);
    if(isNaN(position))return ;
    list.removeAtPosition(position-1);
    renderLinkedList(list);
});

searchBtn.addEventListener("click", () => {
    const value = parseInt(valueInput.value);
    if (isNaN(value)) return;

    const found = list.search(value);
    if (found.length > 0) {
        renderLinkedList(list, value); // re-render and highlight node
    } else {
        alert("Value not found in list!");
    }
});

clearAllBtn.addEventListener('click', () => {
    list.head = null;
    list.tail = null;
    list.size=0;
    renderLinkedList(list);
});

function updateStats(list) {
    const sizeElement = document.querySelector('.stat-item:nth-child(1) .stat-value');
    const headElement = document.querySelector('.stat-item:nth-child(2) .stat-value');
    const tailElement = document.querySelector('.stat-item:nth-child(3) .stat-value');
    
    sizeElement.textContent = list.size;
    headElement.textContent = list.head ? list.head.value : '-';
    tailElement.textContent = list.tail ? list.tail.value : '-';
}

// const list=new LinkedList();
list.addAtHead(15);
list.addAtHead(27);
list.addAtHead(10);
list.addAtTail(89);
list.addAtHead(5);
console.log(list);

renderLinkedList(list);
updateStats(list);