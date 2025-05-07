import NodeState from "../enums/node_state";
import { sleep } from "../helpers";
import SortingAlgorithm from "../sorting_algorithm";

export default class BogoSort extends SortingAlgorithm {
    start(collection, manager) {
        super.start(collection, manager);
    }

    async step() {
        super.step();

        const col = this.collection;

        // Reset all states
        for (const node of col) {
            if (node.state !== NodeState.Sorted) {
                node.setState(NodeState.Idle);
            }
        }

        // Shuffle the array
        for (let i = col.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            await this.manager.swap(col[i], col[j], false);
        }

        await sleep(300 / this.manager.getSpeed());

        // Check if sorted
        let sorted = true;
        for (let i = 0; i < col.length - 1; i++) {
            if (col[i].value > col[i + 1].value) {
                sorted = false;
                break;
            }
        }

        if (sorted) {
            for (const node of col) {
                node.setState(NodeState.Sorted);
            }
            return false; 
        }

        return true;
    }
}
