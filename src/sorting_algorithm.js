import NodeState from "./enums/node_state";
import Node from "./node";
import SortingManager from "./sorting_manager";

/**
 * @abstract
 */
export default class SortingAlgorithm {
    /**
     * @type {Node[]}
     * @protected
    */
    collection = [];

    /**
     * @type {SortingManager}
     * @protected 
    */
    manager;

    /**
     * Initialize everything needed for the algorithm
     * @param {Node[]} collection
     * @returns {void}
    */
    start(collection) {
        this.collection = collection;
        this.manager = SortingManager.getInstance();

        for (const node of this.collection) {
            node.setState(NodeState.Idle);
        }
    }

    /**
     * Perform one step of the algorithm
     * @returns {Promise<boolean>} True if more steps remain, False if algorithm is finished
    */
    async step() {}

    /**
     * Finalize algorithm and/or clean up
     * @returns {void}
    */
    end() {}
}