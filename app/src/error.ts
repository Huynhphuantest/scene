//import { log } from "./logger.ts";
//console.log('?')
/*
console.log = log;
console.error = (datas => {
    const err = new Error();
    err.message = datas;
    console.log(err);
});

window.addEventListener("error", errorEvent => {
    const {message, fileName = "?", line} = errorEvent.error;
    const errConstructor = new Function("return function " + errorEvent.error.constructor.name + "() { };")();
    const err:any = new errConstructor();
    err.message = message;
    err.location = `${fileName} | ${line}`;
    console.log(err);
});
*/