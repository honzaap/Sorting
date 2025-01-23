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
     * @param {Node[]} collection
     * @returns {void}
    */
    start(collection, manager) {
        this.collection = collection;
        this.manager = manager;
    }

    /**
     * @returns {Promise<boolean>} True if more steps remain, False if algorithm is finished
    */
    async step() {}

    /**
     * @returns {void}
    */
    end() {}
}