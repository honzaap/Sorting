import { NS } from "./helpers";

export default class Node {
    /**
     * @type {number}
     * @constant
    */
    value;

    /**
     * @type {SVGRectElement}
     * @constant
    */
    svg;

    /**
     * @constant
    */
    width = 15;

    constructor(value) {
        this.value = value;
        this.svg = document.createElementNS(NS, "rect");
        this.svg.setAttribute("height", this.#calculateHeight());
        this.svg.setAttribute("width", 15);
        this.svg.setAttribute("y", 500 - this.#calculateHeight());
        this.svg.setAttribute("fill", "#ff0000");
    }

    #calculateHeight() {
        return this.value * 5;
    }
} 