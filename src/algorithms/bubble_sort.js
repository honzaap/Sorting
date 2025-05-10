import NodeState from "../enums/node_state";
import { sleep } from "../helpers";
import SortingAlgorithm from "../sorting_algorithm";

export default class BubbleSort extends SortingAlgorithm {
    #i = 0;
    #j = 0;

    #swapped = [];
    #prevNode;

    start(collection, manager) {
        super.start(collection, manager);
        this.#i = 0;
        this.#j = 0;
        this.#prevNode = null;
        this.#swapped = [true];
    }
    
    async step() {
        super.step();

        const node1 = this.collection[this.#j];
        const node2 = this.collection[this.#j+1];

        this.#prevNode?.setState(NodeState.Idle);
        node1.setState(NodeState.Current);
        node2.setState(NodeState.Current);

        this.#prevNode = node1;

        if (!this.#swapped[this.#i]) {
            this.collection.forEach(i => i.setState(NodeState.Sorted));
            return false;
        }

        // Swap items
        if(node2.value < node1.value){
            this.#prevNode = node2;
            await this.manager.swap(node1, node2);
            this.#swapped[this.#i + 1] = true;
        }
        else {
            await sleep(1300 / this.manager.getSpeed()); // For animation clarity
        }

        this.#j++;
        // Item is ordered, continue main iteration
        if (this.#j >= this.collection.length - this.#i - 1) {
            (node1.value > node2.value ? node1 : node2).setState(NodeState.Sorted);
            this.#i++;
            this.#j = 0;
        }

        // Set correct state to final item
        if (this.#i >= this.collection.length - 1) {
            node1.setState(NodeState.Sorted);
            node2.setState(NodeState.Sorted);
        }

        return this.#i < this.collection.length - 1;
    }

    static get name() {
        return "Bubble Sort";
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