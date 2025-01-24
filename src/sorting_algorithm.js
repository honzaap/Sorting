import Node from "./node";
import SortingManager from "./sorting_manager";

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
    start(collection, manager) {
        this.collection = collection;
        this.manager = manager;
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