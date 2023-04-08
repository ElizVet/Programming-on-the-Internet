const { v4: uuidv4 } = require('uuid');

let cardId = '1234 5678 1234 5678';
let orderId;

function createOrder(customerCardNumber){
    return new Promise((resolve, reject) => {
        if(!validateCard(customerCardNumber)){ // проверка карты на валидность
            reject(new Error("\tкарта не валидна!"));
        } else { // генерация номера заказа
            resolve("\tкарта валидна, заказ сгенерирован успешно.");
            orderId = uuidv4();
        }
    });
}

function validateCard(customerCardNumber){
    console.log("\tномер карты: " + customerCardNumber);
    // Генерация случайного числа от 0 до 1 (не включая). Если рандом сделает больше 0.5, то true.
    return Math.random() <= 0.5;
}

function proceedToPayment(orderId){
    console.log("\tномер заказа: " + orderId);
    return new Promise((resolve, reject) => {
        if(Math.random() >= 0.5){
            resolve("\tоплата прошла успешно");
        } else{
            reject(new Error("\tплатеж не прошел"));
        }
    });
}

// вызовы:

createOrder(cardId)
    .then(result => { 
        console.log(result);

        proceedToPayment(orderId)
            .then(result => { console.log(result); })
            .catch(error => { console.error(error.message) });
    })
    .catch(error => { console.error(error.message) });


async function processCreateOrder() {
    try {
        console.log("\n");
        
        const result = await createOrder(cardId);
        console.log(result);

        processProceedToPayment();
    } catch (error) {
        console.error(error.message);
    }
}

async function processProceedToPayment(){
    try {
        const result = await proceedToPayment(orderId);
        console.log(result);
    } catch (error) {
        console.error(error.message);
    }
}

//processCreateOrder();