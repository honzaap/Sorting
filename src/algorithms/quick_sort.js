import NodeState from "../enums/node_state";
import { sleep } from "../helpers";
import SortingAlgorithm from "../sorting_algorithm";

export default class QuickSort extends SortingAlgorithm {
    #stack = [];
    #low = null;
    #high = null;
    #pivotIndex = null;
    #i = null;
    #j = null;
    #phase = null;
    #prevCompared = null;

    start(collection, manager) {
        super.start(collection, manager);
        this.#stack = [[0, collection.length - 1]];
        this.#low = this.#high = this.#pivotIndex = null;
        this.#i = this.#j = null;
        this.#phase = null;
        this.#prevCompared = null;
    }

    async step() {
        super.step();
        const col = this.collection;

        if (this.#phase === null && this.#stack.length > 0) {
            [this.#low, this.#high] = this.#stack.pop();

            if (this.#low >= this.#high) {
                if (this.#low === this.#high) {
                    col[this.#low].setState(NodeState.Sorted);
                }
                return this.#stack.length > 0;
            }

            this.#pivotIndex = Math.floor((this.#low + this.#high) / 2);
            col[this.#pivotIndex].setState(NodeState.InAction);

            this.#i = this.#low - 1;
            this.#j = this.#low;
            this.#phase = "partition";
        }

        if (this.#phase === "partition") {
            if (this.#prevCompared &&
                this.#prevCompared !== col[this.#pivotIndex] &&
                this.#prevCompared.state !== NodeState.Sorted
            ) {
                this.#prevCompared.setState(NodeState.Idle);
            }

            if (this.#j <= this.#high) {
                const current = col[this.#j];

                if (this.#j !== this.#pivotIndex) {
                    current.setState(NodeState.Current);
                    this.#prevCompared = current;
                }

                const pivotValue = col[this.#pivotIndex].value;
                if (current.value < pivotValue) {
                    this.#i++;

                    if (this.#i === this.#pivotIndex) {
                        this.#pivotIndex = this.#j;
                    } else if (this.#j === this.#pivotIndex) {
                        this.#pivotIndex = this.#i;
                    }

                    await this.manager.swap(col[this.#i], col[this.#j]);
                }

                await sleep(400 / this.manager.getSpeed());
                this.#j++;
                return true;
            }

            this.#phase = "final_swap";
        }

        if (this.#phase === "final_swap") {
            const col = this.collection;
            const pivotFinalIndex = this.#i + 1;

            if (this.#pivotIndex !== pivotFinalIndex) {
                await this.manager.swap(col[this.#pivotIndex], col[pivotFinalIndex]);
                this.#pivotIndex = pivotFinalIndex;
            }

            col[this.#pivotIndex].setState(NodeState.Sorted);

            this.#stack.push([this.#low, this.#pivotIndex - 1]);
            this.#stack.push([this.#pivotIndex + 1, this.#high]);

            this.#low = this.#high = this.#pivotIndex = null;
            this.#i = this.#j = null;
            this.#phase = null;
            this.#prevCompared = null;

            return this.#stack.length > 0;
        }

        return this.#stack.length > 0;
    }
}
