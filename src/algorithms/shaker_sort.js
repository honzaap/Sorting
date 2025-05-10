import NodeState from "../enums/node_state";
import { sleep } from "../helpers";
import SortingAlgorithm from "../sorting_algorithm";

export default class ShakerSort extends SortingAlgorithm {
    #start = 0;
    #end = 0;
    #i = 0;
    #direction = "forward";
    #swappedThisPass = false;
    #globalSwapped = true;
    #lastNode1 = null;
    #lastNode2 = null;

    start(collection, manager) {
        super.start(collection, manager);
        this.#start = 0;
        this.#end = collection.length - 1;
        this.#i = 0;
        this.#direction = "forward";
        this.#swappedThisPass = false;
        this.#globalSwapped = true;
        this.#lastNode1 = null;
        this.#lastNode2 = null;
    }

    async step() {
        super.step();
        const col = this.collection;

        // Clear previous nodes
        if (this.#lastNode1 && this.#lastNode1.state !== NodeState.Sorted)
            this.#lastNode1.setState(NodeState.Idle);
        if (this.#lastNode2 && this.#lastNode2.state !== NodeState.Sorted)
            this.#lastNode2.setState(NodeState.Idle);

        // If done
        if (!this.#globalSwapped) {
            for (const node of col) node.setState(NodeState.Sorted);
            return false;
        }

        // Forwards
        if (this.#direction === "forward") {
            if (this.#i < this.#end) {
                const node1 = col[this.#i];
                const node2 = col[this.#i + 1];

                node1.setState(NodeState.Current);
                node2.setState(NodeState.Current);
                this.#lastNode1 = node1;
                this.#lastNode2 = node2;

                if (node1.value > node2.value) {
                    await this.manager.swap(node1, node2);
                    this.#swappedThisPass = true;
                }
                else {
                    await sleep(500 / this.manager.getSpeed());
                }

                this.#i++;
                return true;
            } else {
                this.#end--;
                this.#i = this.#end;
                this.#direction = "backward";
                this.#globalSwapped = this.#swappedThisPass;
                this.#swappedThisPass = false;
                return true;
            }
        }

        // Backwards
        if (this.#direction === "backward") {
            if (this.#i > this.#start) {
                const node1 = col[this.#i - 1];
                const node2 = col[this.#i];

                node1.setState(NodeState.Current);
                node2.setState(NodeState.Current);
                this.#lastNode1 = node1;
                this.#lastNode2 = node2;

                if (node1.value > node2.value) {
                    await this.manager.swap(node1, node2);
                    this.#swappedThisPass = true;
                }
                else {
                    await sleep(500 / this.manager.getSpeed());
                }

                this.#i--;
                return true;
            } else {
                this.#start++;
                this.#i = this.#start;
                this.#direction = "forward";
                this.#globalSwapped = this.#swappedThisPass;
                this.#swappedThisPass = false;
                return true;
            }
        }

        return true;
    }

    static get name() {
        return "Shaker Sort";
    }

    static get timeComplexity() {
        return {
            best: "O(n)",
            average: "O(n²)",
            worst: "O(n²)"
        };
    }

    static get spaceComplexity() {
        return "O(1)";
    }

}
