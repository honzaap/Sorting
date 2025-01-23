import SortingAlgorithm from "../sorting_algorithm";

export default class BubbleSort extends SortingAlgorithm {
    #i = 0;
    #j = 0;

    start(collection, manager) {
        super.start(collection, manager);
        this.#i = 0;
        this.#j = 0;
    }
    
    async step() {
        super.step();
        console.log("step");

        const node1 = this.collection[this.#j];
        const node2 = this.collection[this.#j+1];
        if(node2.value < node1.value){
            await this.manager.swap(node1, node2);
        }

        this.#j++;
        if (this.#j >= this.collection.length - this.#i - 1) {
            this.#i++;
            this.#j = 0;
        }

        return this.#i < this.collection.length - 1;
    }
}

/*
for (var i = 0; i < array.length - 1; i++) {
    for (var j = 0; j < array.length - i - 1; j++) {
        if(array[j] < array[j+1]){
            var tmp = array[j];
            array[j] = array[j+1];
            array[j+1] = tmp;
        }
    }
}

*/