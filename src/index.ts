import {val} from "./new/app";

console.log("hello world", val)

function addNum (a: number, b: string) {
    const c = Number(b)
    return a + c
}

addNum(5, "10")