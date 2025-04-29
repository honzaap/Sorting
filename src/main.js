import BubbleSort from "./algorithms/bubble_sort";
import MergeSort from "./algorithms/merge_sort";
import SelectionSort from "./algorithms/selection_sort";
import SortingManager from "./sorting_manager";
import "./style.scss";

// HTML Elements
const svg = document.getElementById("sortingSvg");
const table = document.getElementById("table");
const selectAlgo = document.getElementById("selectAlgo");
const playBtn = document.getElementById("play");
const stepBtn = document.getElementById("step");
const animationSpeed = document.getElementById("animationSpeed");
const collectionField = document.getElementById("collectionField");
const collectionSize = document.getElementById("collectionSize");
const createNewCollectionBtn = document.getElementById("createNewCollection");
const shuffleCollectionBtn = document.getElementById("shuffleCollection");

// Handle algo change
for (const btn of selectAlgo.children) {
    btn.onclick = () => changeAlgorithm(btn.getAttribute("data-algo"));
}

// Button events
playBtn.onclick = play;
stepBtn.onclick = step;
createNewCollectionBtn.onclick = createCollection;
shuffleCollectionBtn.onclick = shuffleCollection;
animationSpeed.onchange = e => changeAnimationSpeed(Number.parseInt(e.target.value));
collectionSize.onchange = e => changeCollectionSize(Number.parseInt(e.target.value));

// Animation vars
let animationOn = false;

const manager = new SortingManager(svg, collectionField, table);
manager.setAlgorithm(new SelectionSort());

let size = Number.parseInt(collectionSize.value);

function play() {
    if (animationOn) {
        stop();
    }
    else {
        animationOn = true;
        manager.start();
        requestAnimationFrame(animate);
        playBtn.classList.add("active");
    }
}

function changeAlgorithm(algorithm) {
    console.log(algorithm);
}

function changeAnimationSpeed(speed) {
    manager.changeSpeed(speed);
}

function changeCollectionSize(newSize) {
    size = newSize;
}

function shuffleCollection() {
    manager.shuffleCollection();
}

function createCollection() {
    manager.createCollection(size);
}

function stop() {
    animationOn = false;
    playBtn.classList.remove("active");
}

async function step() {
    if (!manager.isRunning())
        manager.start();

    manager.step();
}

async function animate(time) {
    if (manager.isRunning())
        manager.step();
    else
        stop();

    if (animationOn) 
        requestAnimationFrame(animate);
}

createCollection();
changeAnimationSpeed(Number.parseInt(animationSpeed.value));