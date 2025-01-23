import SortingAlgorithm from "../sorting_algorithm";

export default class BubbleSort extends SortingAlgorithm {
    current = 1;
    
    async step() {
        super.step();

        const node1 = this.collection[this.current];
        const node2 = this.collection[this.current - 1];
        await this.manager.swap(node1, node2);
        this.current++;

        return this.current >= this.collection.length
    }
}