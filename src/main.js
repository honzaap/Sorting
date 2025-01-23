import BubbleSort from "./algorithms/bubble_sort";
import { NS, sleep } from "./helpers";
import SortingManager from "./sorting_manager";
import "./style.scss";

// HTML Elements
const svg = document.getElementById("sortingSvg");
const createBtn = document.getElementById("create");
const runBtn = document.getElementById("run");
const stepBtn = document.getElementById("step");

createBtn.onclick = createCollection;
stepBtn.onclick = animate;
runBtn.onclick = runAlgorithm;

const collection = [3, 19, 5, 44, 12, 4, 23, 6, 9, 1, 59, 33, 22];
const collectionSvg = [];

// Animation vars
let start;
let current = 1;

const manager = new SortingManager(svg);
manager.setAlgorithm(new BubbleSort());

function createCollection() {
    manager.createCollection();
    

    /* let x = 100;
    let y = 20;
    let width = 15;

    for (const item of collection) {
        let height = item * 10;
        const rect = document.createElementNS(NS, "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("height", height);
        rect.setAttribute("width", width);
        rect.setAttribute("fill", "#ff0000");
        svg.appendChild(rect);
        collectionSvg.push(rect);

        x += width * 2;
    }*/ 
}

function runAlgorithm() {
    manager.start();
}

async function animate(time) {
    if (start == null) {
        start = time;
    }
    const elapsed = time - start;
  
    if (manager.isRunning()) {
        manager.step();
    }
    
    //await sleep(2);
    /*
    if (current < collection.length) {
        const rect1 = collectionSvg[current];
        const rect2 = collectionSvg[current - 1];

        await animateSwap(rect1, rect2);
        const temp = collectionSvg[current];
        collectionSvg[current] = collectionSvg[current - 1];
        collectionSvg[current - 1] = temp;

        current++;
    }
    */

    //await sleep(400);

    //requestAnimationFrame(animate);
}


  