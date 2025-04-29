import { NS } from "./helpers";
import Node from "./node";
import SortingAlgorithm from "./sorting_algorithm";

const min = 10;
const max = 120;

export default class SortingManager {
    /**
     * @type {SortingAlgorithm}
    */
    #currentAlgorithm;

    /**
     * @type {boolean}
    */
    #isRunning = false;

    /**
     * @type {boolean} 
    */
    #inStep = false;

    /**
     * @type {Node[]}
    */
    collection = [];

    /**
     * @type {SVGElement}
    */
    svg;

    /**
     * @type {HTMLTextAreaElement}
    */
    collectionField;

    /**
     * @type {HTMLElement} 
    */
    table;

    /**
     * @type {Number} 
    */
    #speed = 10;

    /**
     * @param {SVGElement} svg
     * @constructor 
     */
    constructor(svg, collectionField, table) {
        this.svg = svg;
        this.collectionField = collectionField;
        this.table = table;
    }

    /**
     * @param {SortingAlgorithm} algorithm 
     * @returns {void}
    */
    setAlgorithm(algorithm) {
        this.#currentAlgorithm = algorithm;
    }

    createCollection(size = 18) {
        const gap = 50 / size;
        const width = 900 / (size + gap);

        const collection = [];
        for (let i = 0; i < size; i++) {
            const number = Math.floor(Math.random() * (max - min)) + min;
            const node = new Node(number, width);
            collection.push(node);
        }

        this.collection = collection;
        this.svg.replaceChildren([]);

        // Create svg elements
        let x = (1000 / 2) - (size / 2 * (width + gap));
        for (const item of this.collection) {
            item.svg.setAttribute("x", x);
        
            x += gap + width;
            this.svg.appendChild(item.svg);
        }

        this.updateCollectionField();
    }

    shuffleCollection() {

    }

    updateCollectionField() {
        // Create numbers in text field
        this.collectionField.textContent = this.collection.map(x => x.value).join("\n");
    }

    changeSpeed(speed) {
        this.#speed = (speed ** 1.65) / 2500;
    }

    getSpeed() {
        return this.#speed * (this.collection.length);
    }

    start() {
        if (this.#isRunning || !this.#currentAlgorithm)
            return false;

        this.#isRunning = true;
        this.#currentAlgorithm.start(this.collection, this);

        return true;
    }

    stop() {
        this.#isRunning = false;
    }

    async step() {
        if (!this.#currentAlgorithm)
            throw new Error("Current algorithm is null");
        if (!this.#isRunning)
            throw new Error("Can't step algorithm while not running");
        if (this.#inStep)
            return true;

        this.#inStep = true;
        const result = await this.#currentAlgorithm.step();
        if (!result) {
            this.#currentAlgorithm.end();
            this.#isRunning = false;
        }

        this.#inStep = false;
        this.updateCollectionField();

        return result;
    }

    /**
     * @returns {boolean} 
    */
    isRunning() {
        return this.#isRunning
    }

    /**
     * 
     * @param {Node} node1 
     * @param {Node} node2 
     * @returns {Promise}
     */
    swap(node1, node2) {
        const afterResolve = resolve => {
            // Clean up after animation ends
            node1.svg.replaceChildren([]);
            node2.svg.replaceChildren([]);
            
            // Swap svg coords
            const temp = node1.svg.getAttribute("x");
            node1.svg.setAttribute("x", node2.svg.getAttribute("x"));
            node2.svg.setAttribute("x", temp);

            // Swap nodes in array
            const index1 = this.collection.indexOf(node1);
            const index2 = this.collection.indexOf(node2);
            this.collection[index1] = node2;
            this.collection[index2] = node1;
    
            resolve();
        }
    
        return new Promise((resolve) => {
            const duration = 2000 / this.getSpeed();
    
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
    
            const x1 = node1.svg.getAttribute("x");
            const x2 = node2.svg.getAttribute("x");
    
            addAnimation(node1.svg, x1, x2);
            addAnimation(node2.svg, x2, x1);
    
            // Resolve animation through timeout (events don't work)
            setTimeout(() => {
                afterResolve(resolve);
            }, duration);
        });
    }
}