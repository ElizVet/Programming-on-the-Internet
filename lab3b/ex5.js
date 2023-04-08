let number = 3;

function square(number) {
    return new Promise((resolve, reject) => {
        if(typeof number !== "number") {
            reject(new Error("2 - number не является числом"));
        } else {
            resolve(`number^2 = ${Math.pow(number, 2)}`);
        }
    });
}

function cube(number) {
    return new Promise((resolve, reject) => {
        if(typeof number !== "number") {
            reject(new Error("3 - number не является числом"));
        } else {
            resolve(`number^3 = ${Math.pow(number, 3)}`);
        }
    });
}

function fourthPower(number) {
    return new Promise((resolve, reject) => {
        if(typeof number !== "number") {
            reject(new Error("4 - number не является числом"));
        } else {
            resolve(`number^4 = ${Math.pow(number, 4)}`);
        }
    });
}

// возвращает Promise, который разрешается, только когда все переданные промисы разрешаются.
Promise.all([square(number), cube(number), fourthPower(number)])
    .then((results) => { console.log(results); })
    .catch((error) => { console.error(error.message); });