import NodeState from "../enums/node_state";
import { sleep } from "../helpers";
import SortingAlgorithm from "../sorting_algorithm";

export default class MergeSort extends SortingAlgorithm {
    // Internal state
    #stack = [];
    #currentMerge = null;
    #tempArray = [];

    start(collection, manager) {
        super.start(collection, manager);
        this.#stack = [{ left: 0, right: collection.length - 1, stage: "split" }];
        this.#currentMerge = null;
        this.#tempArray = [];
    }

    async step() {
        super.step();
    
        if (this.#currentMerge) {
            // Currently merging two subarrays
            const { left, mid, right, i, j, k } = this.#currentMerge;
    
            this.collection[i]?.setState(NodeState.Current);
            this.collection[j]?.setState(NodeState.Current);
    
            if (i <= mid && (j > right || this.collection[i].value <= this.collection[j].value)) {
                this.#tempArray[k] = this.collection[i];
                this.#currentMerge.i++;
            } else {
                this.#tempArray[k] = this.collection[j];
                this.#currentMerge.j++;
            }
            this.#currentMerge.k++;
    
            await sleep(500 / this.manager.getSpeed());
    
            if (this.#currentMerge.k > right) {
                // Copy back into main collection visually
                for (let idx = left; idx <= right; idx++) {
                    if (this.collection[idx] !== this.#tempArray[idx]) {
                        await this.manager.swap(this.collection[idx], this.#tempArray[idx]);
                    }
                    this.collection[idx].setState(NodeState.Sorted);
                }
                this.#currentMerge = null;
            }
    
            return true;
        }
    
        if (this.#stack.length > 0) {
            const task = this.#stack.pop();
    
            if (task.stage === "split") {
                const left = task.left;
                const right = task.right;
    
                if (left >= right) {
                    return await this.step(); // Continue to next useful step
                }
    
                const mid = Math.floor((left + right) / 2);
    
                // Push a "merge" task AFTER splitting
                this.#stack.push({ left, right, mid, stage: "merge" });
    
                // Push "split" tasks for left and right halves
                this.#stack.push({ left: mid + 1, right, stage: "split" });
                this.#stack.push({ left, right: mid, stage: "split" });
    
                return await this.step(); // Continue to next useful step
            }
    
            if (task.stage === "merge") {
                const { left, mid, right } = task;
                this.#tempArray = [...this.collection];
                this.#currentMerge = { left, mid, right, i: left, j: mid + 1, k: left };
                return true;
            }
        }
    
        // Finished all tasks
        return false;
    }
}
