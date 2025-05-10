import Mapper from "./algorithms/algo_mapper";
import SortingManager from "./sorting_manager";
import "./style.scss";

// HTML Elements
const svg = document.getElementById("sortingSvg");
const table = document.getElementById("table");
const selectAlgoBtn = document.getElementById("selectAlgoBtn");
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
    btn.onclick = () => changeAlgorithm(btn.getAttribute("data-algo"), btn.innerHTML);
}

collectionField.onchange = modifyCollection;

// Button events
playBtn.onclick = play;
stepBtn.onclick = step;
createNewCollectionBtn.onclick = createCollection;
shuffleCollectionBtn.onclick = shuffleCollection;
animationSpeed.onchange = e => changeAnimationSpeed(Number.parseInt(e.target.value));
collectionSize.onchange = e => changeCollectionSize(Number.parseInt(e.target.value));

// Animation vars
let animationOn = false;

const manager = SortingManager.getInstance();
manager.configure(svg, collectionField, table);
changeAlgorithm("bubble", "Bubble sort");

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
        shuffleCollectionBtn.disabled = true;
        createNewCollectionBtn.disabled = true;
        selectAlgoBtn.disabled = true;
        collectionField.disabled = true;
    }
}

function changeAlgorithm(algorithm, name) {
    stop();
    const algo = Mapper[algorithm];
    manager.setAlgorithm(new algo());
    selectAlgoBtn.innerHTML = name;

    document.querySelector(".algo-name").textContent = algo.name;
    table.querySelector(".tc-best").textContent = algo.timeComplexity.best;
    table.querySelector(".tc-average").textContent = algo.timeComplexity.average;
    table.querySelector(".tc-worst").textContent = algo.timeComplexity.worst;
    table.querySelector(".sc").textContent = algo.spaceComplexity;
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
    if (animationOn) return;

    manager.createCollection(size);
}

function modifyCollection() {
    try {
        const collection = collectionField.value.trim().split("\n").filter(s => !!s).map(s => Number.parseInt(s.trim()));
        manager.createCollection(collection.length, collection);
    }
    catch (e) {
        console.error("Cannot replace collection", e);
    }
}

function stop() {
    animationOn = false;
    playBtn.classList.remove("active");

    shuffleCollectionBtn.disabled = false;
    createNewCollectionBtn.disabled = false;
    selectAlgoBtn.disabled = false;
    collectionField.disabled = false;
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