import { log } from "./logger.ts";

const oldLog = console.log;
console.log = (...messages:string[]) => {
    oldLog(...messages);
    log(...messages);
};
const oldError = console.error;
console.error = (datas => {
    const err = new Error();
    err.message = datas;
    oldError(err);
});

window.addEventListener("error", errorEvent => {
    const {message, fileName = "?", line} = errorEvent.error;
    const errConstructor = new Function("return function " + errorEvent.error.constructor.name + "() { };")();
    const err:any = new errConstructor();
    err.message = message;
    err.location = `${fileName} | ${line}`;
    console.error(JSON.stringify(err));
});