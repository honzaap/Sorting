import NodeState from "../enums/node_state";
import { sleep } from "../helpers";
import SortingAlgorithm from "../sorting_algorithm";

export default class SelectionSort extends SortingAlgorithm {
    #i = 0;
    #j = 1;
    #minIndex = 0;
    #prevJ = 0;

    start(collection, manager) {
        super.start(collection, manager);
        this.#i = 0;
        this.#j = 1;
        this.#minIndex = 0;
    }

    async step() {
        super.step();

        this.collection[this.#prevJ]?.setState(NodeState.Idle);

        if (this.#j >= this.collection.length) {
            // End of the pass — swap min with current i
            if (this.collection[this.#i] !== this.collection[this.#minIndex]) {
                await this.manager.swap(this.collection[this.#i], this.collection[this.#minIndex]);
                await sleep(500 / this.manager.getSpeed());
            }

            this.collection[this.#i].setState(NodeState.Sorted);

            this.#i++;
            this.#prevJ = this.#j;
            this.#j = this.#i + 1;
            this.#minIndex = this.#i;

            return this.#i < this.collection.length;
        }

        if (this.#i >= this.collection.length - 1) {
            this.collection[this.#i].setState(NodeState.Sorted);
            return false; // Finished
        }

        // Highlight current nodes
        this.collection[this.#minIndex]?.setState(NodeState.OnHold);
        this.collection[this.#j]?.setState(NodeState.Current);

        await sleep(Math.max(500 / this.manager.getSpeed(), 10));

        // Compare and update minIndex
        if (this.collection[this.#j].value < this.collection[this.#minIndex].value) {
            this.collection[this.#minIndex]?.setState(NodeState.Idle);
            this.#minIndex = this.#j;
            this.collection[this.#minIndex]?.setState(NodeState.Current);
        }

        this.#prevJ = this.#j;
        this.#j++;

        return true; // Keep going
    }
}