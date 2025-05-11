import NodeState from "../enums/node_state";
import { sleep } from "../helpers";
import SortingAlgorithm from "../sorting_algorithm";

export default class ShellSort extends SortingAlgorithm {
    #gap = 0;
    #shrinkFactor = 2; 
    #i = 0;
    #j = 0;
    #currentNode = null;

    start(collection, manager) {
        super.start(collection, manager);
        this.#gap = Math.floor(collection.length / this.#shrinkFactor);
        this.#i = this.#gap;
        this.#j = null;
        this.#currentNode = null;
    }

    async step() {
        super.step();

        const col = this.collection;

        for (const node of col) {
            if (node.state !== NodeState.Sorted) {
                node.setState(NodeState.Idle);
            }
        }

        if (this.#gap < 1) {
            for (const node of col) {
                node.setState(NodeState.Sorted);
            }
            return false;
        }

        if (this.#currentNode === null && this.#i < col.length) {
            this.#currentNode = col[this.#i];
            this.#j = this.#i;
            this.#currentNode.setState(NodeState.Current);
            return true;
        }

        if (this.#j >= this.#gap &&
            col[this.#j - this.#gap].value > this.#currentNode.value) {

            const nodeA = col[this.#j];
            const nodeB = col[this.#j - this.#gap];

            nodeA.setState(NodeState.Current);
            nodeB.setState(NodeState.Current);

            await this.manager.swap(nodeA, nodeB);
            await sleep(300 / this.manager.getSpeed());

            this.#j -= this.#gap;
            return true;
        }

        this.#i++;
        this.#currentNode = null;

        if (this.#i >= col.length) {
            this.#gap = Math.floor(this.#gap / this.#shrinkFactor);
            this.#i = this.#gap;
            this.#j = null;
            this.#currentNode = null;
        }

        return true;
    }

    static get name() {
        return "Shell Sort";
    }

    static get timeComplexity() {
        return {
            best: "O(n log n)",
            average: "O(n (log n)²)",
            worst: "O(n²)"
        };
    }

    static get spaceComplexity() {
        return "O(1)";
    }

}
