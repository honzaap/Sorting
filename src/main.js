import BubbleSort from "./algorithms/bubble_sort";
import { NS, sleep } from "./helpers";
import SortingManager from "./sorting_manager";
import "./style.scss";

// HTML Elements
const svg = document.getElementById("sortingSvg");
const createBtn = document.getElementById("create");
const runBtn = document.getElementById("run");
const stepBtn = document.getElementById("step");
const animateBtn = document.getElementById("animate");

createBtn.onclick = createCollection;
stepBtn.onclick = step;
runBtn.onclick = runAlgorithm;
animateBtn.onclick = animate;

// Animation vars
let start;

const manager = new SortingManager(svg);
manager.setAlgorithm(new BubbleSort());

function createCollection() {
    manager.createCollection();
}

function runAlgorithm() {
    manager.start();
}

async function step() {
    if (manager.isRunning()) {
        manager.step();
    }
}

async function animate(time) {
    if (start == null) {
        start = time;
    }
    const elapsed = time - start;
  
    if (manager.isRunning()) {
        manager.step();
    }

    requestAnimationFrame(animate);
}

  