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
    */
    state = NodeState.Idle;

    constructor(value) {
        this.value = value;
        this.svg = document.createElementNS(NS, "rect");
        this.svg.setAttribute("height", this.#calculateHeight());
        this.svg.setAttribute("width", 15);
        this.svg.setAttribute("y", 500 - this.#calculateHeight());
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
                this.svg.setAttribute("fill", "#28bbe6");
                break;
            case NodeState.Sorted:
                this.svg.setAttribute("fill", "#26d346");
                break;
            case NodeState.Current:
                this.svg.setAttribute("fill", "#ec9732");
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