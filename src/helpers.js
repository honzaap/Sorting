export const NS = "http://www.w3.org/2000/svg";

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}