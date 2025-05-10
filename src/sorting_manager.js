import NodeState from "./enums/node_state";
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
     * @type {SortingManager}
     */
    static #instance;

    /**
     * @private
     * @constructor 
     */
    constructor() { }

    static getInstance() {
        if (!this.#instance)
            this.#instance = new SortingManager();
    
        return this.#instance;
    }

    /**
     * 
     * @param {SVGElement} svg 
     * @param {HTMLTextAreaElement} collectionField 
     * @param {HTMLElement} table 
     */
    configure(svg, collectionField, table) {
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
        this.reset();
    }

    createCollection(size = 18, existingCollection = []) {
        if (this.isRunning()) {
            this.stop();
        }

        const gap = 50 / size;
        const width = 900 / (size + gap);

        const collection = [];
        for (let i = 0; i < size; i++) {
            const number = existingCollection[i] ?? Math.floor(Math.random() * (max - min)) + min;
            console.log(number);
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

    async shuffleCollection() {
        this.stop();
        for (let i = this.collection.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            await this.swap(this.collection[i], this.collection[j], false);
        }
        this.reset();
        this.updateCollectionField();
    }

    updateCollectionField() {
        // Create numbers in text field
        this.collectionField.value = this.collection.map(x => x.value).join("\n");
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
        this.#currentAlgorithm.start(this.collection);

        return true;
    }

    stop() {
        this.#isRunning = false;
    }

    reset() {
        this.stop();
        for (let i = 0; i < this.collection.length; i++) {
            this.collection[i].setState(NodeState.Idle);
        }
        this.updateCollectionField();
    }

    /**
     * Performs a single step of the currently selected algorithm
     * @returns {Promise<boolean>} true if there are any steps left
     */
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
    swap(node1, node2, animation = true) {
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
            const duration = !animation ? 0 : 2000 / this.getSpeed();
    
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