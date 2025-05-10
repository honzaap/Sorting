import NodeState from "../enums/node_state";
import { sleep } from "../helpers";
import SortingAlgorithm from "../sorting_algorithm";

export default class InsertionSort extends SortingAlgorithm {
    #i = 1;
    #j = 0;
    #keyNode = null;
    #prevCurrent = null;

    start(collection, manager) {
        super.start(collection, manager);
        this.#i = 1;
        this.#j = 0;
        this.#keyNode = null;
        this.#prevCurrent = null;
    }

    async step() {
        super.step();

        const n = this.collection.length;

        if (this.#i >= n) {
            this.collection.forEach(node => node.setState(NodeState.Sorted));
            return false;
        }

        if (this.#keyNode === null) {
            console.log("keyNode === null")
            this.#keyNode = this.collection[this.#i];
            this.#keyNode.setState(NodeState.Current);
            this.#j = this.#i - 1;
            return true;
        }


        this.#prevCurrent?.setState(NodeState.Sorted);

        if (this.#j >= 0) {
            console.log("j >= 0")
            const current = this.collection[this.#j];
            current.setState(NodeState.Current);
            this.#prevCurrent = current;

            if (current.value > this.#keyNode.value) {
                console.log("SWAP")
                await this.manager.swap(this.collection[this.#j + 1], this.collection[this.#j]);
                await sleep(400 / this.manager.getSpeed());
                this.#j--;
                return true;
            }
        }

        this.#keyNode.setState(NodeState.Sorted);
        this.#keyNode = null;
        this.#prevCurrent?.setState(NodeState.Sorted);
        this.#prevCurrent = null;
        this.#i++;
        console.log("RETURN TRUE")

        return true;
    }

    static get name() {
        return "Insertion Sort";
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
