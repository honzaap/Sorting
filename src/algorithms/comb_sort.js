import NodeState from "../enums/node_state";
import { sleep } from "../helpers";
import SortingAlgorithm from "../sorting_algorithm";

export default class CombSort extends SortingAlgorithm {
    #gap = 0;
    #shrinkFactor = 1.3;
    #i = 0;
    #swapped = [];
    #lastNode1 = null;
    #lastNode2 = null;
    #iter = 0;

    start(collection, manager) {
        super.start(collection, manager);
        this.#gap = collection.length;
        this.#i = 0;
        this.#swapped = [];
        this.#lastNode1 = null;
        this.#lastNode2 = null;
        this.#iter = 0;
    }

    async step() {
        super.step();

        const col = this.collection;

        // Reset previous highlight
        if (this.#lastNode1 && this.#lastNode1.state !== NodeState.Sorted)
            this.#lastNode1.setState(NodeState.Idle);
        if (this.#lastNode2 && this.#lastNode2.state !== NodeState.Sorted)
            this.#lastNode2.setState(NodeState.Idle);

        // Finish if fully sorted
        if (this.#gap === 1 && !this.#swapped[this.#iter - 1]) {
            const node = this.collection.find(n => n.state !== NodeState.Sorted);
            if (node == null) return false;
            node.setState(NodeState.Sorted);
            return true;
        }

        // New pass
        if (this.#i === 0) {
            this.#gap = Math.floor(this.#gap / this.#shrinkFactor);
            if (this.#gap < 1) this.#gap = 1;
            this.#swapped[this.#iter] = false;
        }

        const j = this.#i + this.#gap;
        if (j < col.length) {
            const node1 = col[this.#i];
            const node2 = col[j];

            node1.setState(NodeState.Current);
            node2.setState(NodeState.Current);

            this.#lastNode1 = node1;
            this.#lastNode2 = node2;

            if (node1.value > node2.value) {
                await this.manager.swap(node1, node2);
                this.#swapped[this.#iter] = true;
            }

            await sleep(300 / this.manager.getSpeed());
            this.#i++;
        } else {
            this.#i = 0; // Restart loop with new gap
            this.#iter++;
        }

        return true;
    }

    static get name() {
        return "Comb Sort";
    }

    static get timeComplexity() {
        return {
            best: "O(n log n)",
            average: "O(n²)",
            worst: "O(n²)"
        };
    }

    static get spaceComplexity() {
        return "O(1)";
    }

}
