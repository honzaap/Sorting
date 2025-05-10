import BubbleSort from "./bubble_sort";
import BogoSort from "./bogo_sort";
import MergeSort from "./merge_sort";
import InsertionSort from "./insertion_sort";
import SelectionSort from "./selection_sort";
import QuickSort from "./quick_sort";
import CombSort from "./comb_sort";
import ShakerSort from "./shaker_sort";

export default {
    "bubble": BubbleSort,
    "merge": MergeSort,
    "insert": InsertionSort,
    "quick": QuickSort,
    "selection": SelectionSort,
    "comb": CombSort,
    "shaker": ShakerSort,
    "bogo": BogoSort,
}