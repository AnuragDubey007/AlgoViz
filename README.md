# AlgoViz – Algorithm & Data Structure Visualization Platform

AlgoViz is an **interactive algorithm and data structure visualization platform** built with **Vanilla JavaScript**, designed to help learners understand how algorithms work internally through real-time animations, controls, and comparisons.

The project focuses on **visual clarity, correctness, and interactivity**, covering core topics frequently asked in **coding interviews and computer science fundamentals**.

> 🔒 **Note:**  
> A live demo link is intentionally not exposed due to limited AI usage resources.  
> Screenshots below demonstrate all major features and functionality.



---



## ✨ Key Features

### 🔹 Graph Pathfinding Visualizer
- Visualizes **BFS, DFS, Dijkstra, and A\*** algorithms on a dynamic grid

- Supports **walls, weighted nodes, waypoints**, and **maze generation**

- Step-by-step animation to compare shortest-path behavior under different constraints

### 🔹 Sorting Algorithm Visualizer
- Implements **Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, and Quick Sort**

- **Side-by-side comparison mode** to run two algorithms in parallel

- Displays **live metrics** such as comparisons and swaps

- Adjustable **array size** and **visualization speed**

### 🔹 Data Structure Visualizers
- **Linked List Visualizer**
  - Insertions, deletions, searches, and position-based operations
  - Real-time updates of **HEAD, TAIL, and SIZE**
  
- **Tree Visualizer**
  - Dynamic node insertion and traversal animations
  - Clear hierarchical structure rendering

### 🔹 AI-Assisted Learning Widget
- Floating **AI help assistant** available across all modules

- Uses the **Gemini API (gemini-2.5-flash)** via a lightweight Node.js/Express proxy (API key not exposed)

- Provides **on-demand explanations** for algorithms and concepts

- Implemented as a **reusable, dynamically injected JavaScript component**


---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript (ES6)
- **Backend:** Node.js, Express (lightweight API proxy)
- **AI Integration:** Google Gemini API (gemini-2.5-flash)

---

## 📸 Screenshots

### Graph Pathfinding (BFS, DFS, Dijkstra, A*)
Shows shortest-path traversal on weighted grids with obstacles and waypoints.


<img width="1895" height="943" alt="Screenshot 2025-12-17 172234" src="https://github.com/user-attachments/assets/40513080-3f5e-4c76-8414-987c46fbaa98" />

### Sorting Algorithm 
Side-by-side execution with live swap and comparison counters.
<img width="1893" height="932" alt="Screenshot 2025-12-17 223525" src="https://github.com/user-attachments/assets/89195d97-7424-4b50-952e-3b26b032d625" />

### Linked List Visualizer
Dynamic insert, delete, and search operations with HEAD/TAIL tracking.
<img width="1910" height="928" alt="Screenshot 2025-12-17 194756" src="https://github.com/user-attachments/assets/26f10c6e-b43d-4de2-b51a-25feaeaed6b1" />

### AI Assistant
On-demand algorithm explanations via integrated Gemini-powered widget.
<img width="1898" height="937" alt="Screenshot 2025-12-17 191057" src="https://github.com/user-attachments/assets/39c22028-45c6-42bf-a7fc-7644ecb8279f" />



> 📌 Screenshots are provided instead of a live demo to avoid exhausting limited AI API resources.


---

## 🎯 Project Goals

- Make **abstract DSA concepts visual and intuitive**
- Help learners **compare algorithm behavior**, not just outcomes
- Provide a **hands-on learning experience** similar to real interview reasoning
- Strengthen **core JavaScript fundamentals** without relying on frameworks

---

## 🚀 Getting Started (Local)

```bash
git clone https://github.com/your-username/algoviz.git
cd algoviz
