import { NS, sleep } from "./helpers";
import "./style.scss";

// HTML Elements
const svg = document.getElementById("sortingSvg");
const testBtn = document.getElementById("test");

testBtn.onclick = createCollection;

const collection = [3, 19, 5, 44, 12, 4, 23, 6, 9, 1, 59, 33, 22];
const collectionSvg = [];

// Animation vars
let start;
let current = 1;


function createCollection() {
    console.log("Create collection");
    let x = 100;
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
    }

    requestAnimationFrame(animate);
}

async function animate(time) {
    if (start == null) {
        start = time;
    }
    const elapsed = time - start;
  
    await sleep(2);
    if (current < collection.length) {
        const rect1 = collectionSvg[current];
        const rect2 = collectionSvg[current - 1];

        await animateSwap(rect1, rect2);
        const temp = collectionSvg[current];
        collectionSvg[current] = collectionSvg[current - 1];
        collectionSvg[current - 1] = temp;

        current++;
    }
    await sleep(400);

    requestAnimationFrame(animate);
}

function animateSwap(rect1, rect2) {
    function afterResolve(resolve) {
        console.log("resolve");
        // Clear up after animation ends
        for (const child of rect1.children) 
            child.remove();
        for (const child of rect2.children) 
            child.remove();
        
        const temp = rect1.getAttribute("x");
        rect1.setAttribute("x", rect2.getAttribute("x"));
        rect2.setAttribute("x", temp);

        resolve();
    }

    return new Promise((resolve) => {
        const duration = 1000;

        function addAnimation(rect, fromX, toX) {
            const animateElement = document.createElementNS(NS, "animate");
            animateElement.setAttribute("attributeName", "x");
            animateElement.setAttribute("from", fromX);
            animateElement.setAttribute("to", toX);
            animateElement.setAttribute("dur", `${duration}ms`);
            animateElement.setAttribute("fill", "freeze");

            rect.appendChild(animateElement);
            animateElement.beginElement();
        }

        const x1 = rect1.getAttribute("x");
        const x2 = rect2.getAttribute("x");

        addAnimation(rect1, x1, x2);
        addAnimation(rect2, x2, x1);

        // Resolve animation through timeout (events don't work)
        setTimeout(() => {
            afterResolve(resolve);
        }, duration);
    });
}
  