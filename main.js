// Main array
let array = [];

// Grid element
let array_HTML = document.getElementById("array");
let navbar_HTML = document.getElementById("navbar");
let collection_range = document.getElementById("range-collection");
let algo_select = document.getElementById("algo-select");
let description_HTML = document.getElementById("algo-desc");
const RUN = 32;

const window_y = array_HTML.scrollHeight;
const window_x = array_HTML.scrollWidth;
let sorted = false;
let line_size ;
let is_running = false;

collection_range.onchange = function(){CreateRandomCollection()}

CreateRandomCollection()

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

async function shuffle() {
    if(is_running) return
    is_running = true;
    array.sort(() => Math.random() - 0.5);
    let newArr = array;
    array = [];
    let range = collection_range.value;
    array = [];
    array_HTML.innerHTML = "";

    let width = Math.floor(window_x / (parseInt(range)+parseInt(collection_range.max/10)) );
    let gap = Math.max(1, Math.floor((window_x-(width*range))/200));
    array_HTML.style.gap = gap+"px";
    for(var number of newArr){
        array.push(number);
        var line_HTML = document.createElement("div");
        let height = Math.floor((window_y - window_y/5) / 200 * number);
        line_HTML.classList.add("line");
        line_HTML.style.width = width+"px";
        line_HTML.style.height = height+"px";
        array_HTML.appendChild(line_HTML);
        await sleep(1);
    }
    sorted = false;
    is_running = false;
}

function SelectChange(select){
    if(select == "algo-select"){
        let algo = algo_select.value;
        switch(algo){
            case "BubbleSort":
                description_HTML.innerHTML = "Buble Sort má časovou komplexitu O(<var>n</var><sup>2</sup>)."
                break;
            case "MergeSort":
                description_HTML.innerHTML = "Merge Sort má časovou komplexitu O(<var>n</var>Log<var>n</var>)."
                break;
            case "SelectionSort":
                description_HTML.innerHTML = "Selection Sort má časovou komplexitu O(<var>n</var><sup>2</sup>)."
                break;
            case "QuickSort":
                description_HTML.innerHTML = "Quick Sort má v průměru časovou komlexitu O(<var>n</var>Log<var>n</var>) a v nejhorším případě O(<var>n</var><sup>2</sup>)."
                break;
            case "HeapSort":
                description_HTML.innerHTML = "Heap Sort má časovou komplexitu O(<var>n</var>Log<var>n</var>)."
                break;
            case "InsertionSort":
                description_HTML.innerHTML = "Insertion Sort má časovou komplexitu O(<var>n</var><sup>2</sup>)."
                break;
        }
    }
}

async function CreateRandomCollection()
{
    if(is_running) return
    is_running = true;
    let range = collection_range.value;
    array = [];
    array_HTML.innerHTML = "";

    let width = Math.floor(window_x / (parseInt(range)+parseInt(collection_range.max/10)) );
    let gap = Math.max(1, Math.floor((window_x-(width*range))/200));
    array_HTML.style.gap = gap+"px";

    for(var i = 0; i < range; i++){
        let number = Math.max(5, Math.floor(Math.random()*200));
        array.push(number);

        var line_HTML = document.createElement("div");
        let height = Math.floor((window_y - window_y/5) / 200 * number);
        line_HTML.classList.add("line");
        line_HTML.style.width = width+"px";
        line_HTML.style.height = height+"px";
        array_HTML.appendChild(line_HTML);
        await sleep(1);
    }
    is_running = false;
}


async function Run()
{
    if(is_running) return;
    if(sorted) await shuffle();
    is_running = true;
    let algo = algo_select.value;
    switch (algo){
        case "BubbleSort":
            await BubbleSort(array);
            break;
        case "MergeSort":
            await MergeSort(array,0);
            break;
        case "SelectionSort":
            await SelectionSort(array, array.length);
            break;
        case "QuickSort":
            await QuickSort(array, 0, array.length-1);
            break;
        case "HeapSort":
            await HeapSort(array);
            break;
        case "InsertionSort":
            await InsertionSort(array, 0, array.length);
            break;
    }
    sorted = true;
    is_running = false;
}

function swap(array, i1, i2){
    let tmp = array[i1];
    array[i1] = array[i2];
    array[i2] = tmp;
    return array;
}
function swap_HTML(array, i1, i2){
    let tmp = array.children[i1].style.height;
    array.children[i1].style.height = array.children[i2].style.height;
    array.children[i2].style.height = tmp;
}

function make_HTML(array,index,number){
    array.children[index].style.height = Math.floor((window_y - window_y/5) / 200 * number)+"px";
}

async function BubbleSort(arr)
{

    let n = arr.length;
    let swapped = true;
    while (swapped){
        swapped = false;
        for(var i = 1; i < n; i++){
            if(arr[i-1] > arr[i]){
                swap(arr,i,i-1);
                swap_HTML(array_HTML,i,i-1)
                await sleep(0);
                swapped = true;
            }
        }
    }
    is_running = false
}

async function MergeSort(arr,start)
{
    if(arr.length > 1){
        let mid = Math.floor(arr.length/2);

        let L = arr.slice(0,mid);
        let R = arr.slice(mid)

        await MergeSort(L,start + 0);
        await MergeSort(R, start + mid);

        let i = 0;
        let j = 0;
        let k = 0;

        while(i < L.length && j < R.length){
            if(L[i] <= R[j]){
                arr[k] = L[i];
                make_HTML(array_HTML,k+start,L[i]);
                await sleep(10);
                i++;
            }
            else{
                arr[k] = R[j]
                make_HTML(array_HTML,k+start,R[j]);
                await sleep(10);
                j++;
            }
            k++;
        }
        while(i < L.length){
            arr[k] = L[i];
            make_HTML(array_HTML,k+start,L[i]);
            await sleep(10);
            i++;
            k++;
        }
        while(j < R.length){
            arr[k] = R[j];
            make_HTML(array_HTML,k+start,R[j]);
            await sleep(10);
            j++;
            k++;
        }
    }
}

async function QuickSort(arr, low, high)
{
    if(low < high){
        pi = await partition(arr, low, high);

        await QuickSort(arr, low, pi-1);
        await QuickSort(arr, pi+1, high);
    }
}

async function partition(arr, low, high)
{
    let pivot = arr[high];

    let i = low - 1;
    for( var j = low; j < high; j++){
        if(arr[j] < pivot){
            i++;
            swap(arr,i,j);
            swap_HTML(array_HTML,i,j);
            await sleep(10);
        }
    }
    swap(arr,i+1, high);
    swap_HTML(array_HTML,i+1,high);
    await sleep(10);
    return i+1;
}

async function SelectionSort(arr, n)
{
    for(var i = 0; i < n-1; i++){
        let min_idx = i;
        for(var j = i+1; j < n; j++){
            if(arr[j] < arr[min_idx]) min_idx = j;
        }
        swap(arr, min_idx, i);
        swap_HTML(array_HTML, min_idx, i);
        await sleep(20);
    }
}

async function HeapSort(arr)
{
    let n = arr.length;

    for(var i = Math.floor(n/2) - 1; i >= 0; i--){
        await heapify(arr, n, i);
    }
    for(var i = n - 1; i > 0; i--){
        swap(arr,0,i);
        swap_HTML(array_HTML,0,i);
        await sleep(10);

        await heapify(arr, i, 0);
    }
}

async function heapify(arr, n, i)
{
    let largest = i; 
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    if(l < n && arr[l] > arr[largest]){
        largest = l;
    }

    if(r < n && arr[r] > arr[largest]){
        largest = r;
    }

    if(largest != i){
        swap(arr,i,largest);
        swap_HTML(array_HTML,i,largest);
        await sleep(10);

        await heapify(arr, n, largest);
    }   
}

async function InsertionSort(arr, left, right){
    for(var i = left; i < right; i++){
        let key = arr[i];

        let j = i-1;
        while(j >= 0 && key < arr[j]){
            arr[j+1] = arr[j];
            make_HTML(array_HTML,j+1,arr[j]);
            await sleep(1);
            j--;
        }
        arr[j+1]=key;
        make_HTML(array_HTML,j+1,key);
        await sleep(1);
    }
}