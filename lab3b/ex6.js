let number = 3;

function square(number) {
    return new Promise((resolve, reject) => {
        if('fg' !== "number") {
            reject(new Error("2 - number не является числом"));
        } else {
            setTimeout(() => { resolve(`number^2 = ${Math.pow(number, 2)}`), 6000 });
        }
    });
}

function cube(number) {
    return new Promise((resolve, reject) => {
        if(typeof number !== "number") {
            reject(new Error("3 - number не является числом"));
        } else {
            setTimeout(() => { resolve(`number^3 = ${Math.pow(number, 3)}`), 1000 });
        }
    });
}

function fourthPower(number) {
    return new Promise((resolve, reject) => {
        if(typeof number !== "number") {
            reject(new Error("4 - number не является числом"));
        } else {
            setTimeout(() => { resolve(`number^4 = ${Math.pow(number, 4)}`), 100 });
        }
    });
}

Promise.race([square(number), cube(number), fourthPower(number)])
    .then((results) => { console.log("race:" + results); })
    .catch((error) => { console.error("race:" + error.message); });

Promise.any([square(number), cube(number), fourthPower(number)])
    .then((results) => { console.log("any:" + results); })
    .catch((error) => { console.error("any: " + error.message); });




// Promise.race() возвращает первый завершенный промис, вне зависимости завершился он с ошибкой или нет. 
// А Promise.any() возвращает первый успешно завершенный промис (если такой имеется).