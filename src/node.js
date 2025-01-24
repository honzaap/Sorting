import { NS } from "./helpers";
import NodeState from "./enums/node_state";

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

    /**
     * @param {String} value 
     * @param {Number} width 
    */
    state = NodeState.Idle;

    constructor(value, width) {
        this.value = value;
        this.width = width;
        this.svg = document.createElementNS(NS, "rect");
        this.svg.setAttribute("height", this.#calculateHeight());
        this.svg.setAttribute("width", width);
        this.svg.setAttribute("y", 651 - this.#calculateHeight());
        this.setState(NodeState.Idle);
    }

    #calculateHeight() {
        return this.value * 5;
    }

    /**
     * @param {String} state  
    */
    setState(state) {
        switch (state) {
            case NodeState.Idle:
                this.svg.setAttribute("fill", "#6180B9");
                break;
            case NodeState.Sorted:
                this.svg.setAttribute("fill", "#61B96E");
                break;
            case NodeState.Current:
                this.svg.setAttribute("fill", "#D4A932");
                break;
            case NodeState.OnHold:
                this.svg.setAttribute("fill", "#ecd80c");
                break;
            case NodeState.InAction:
                this.svg.setAttribute("fill", "#dfb110");
                break;
            default:
                throw new Error("Invalid state");
        }
    }
}