function thirdJob(data){
    const startTime = Date.now();
    return new Promise((resolve, reject) => {
        if(typeof data !== "number") {                      // data - не число
            reject(new Error(`error -- Time: ${(Date.now() - startTime)}`));
        } else if (data % 2 === 0) {                        // data - четное число
            setTimeout(() => { reject(new Error(`even -- Time: ${(Date.now() - startTime)}`)); }, 2000);
        } else {
            setTimeout(() => { resolve(`odd -- Time: ${(Date.now() - startTime)}`); }, 1000);
        }
    });
}
// Здесь мы создаем новый Promise, который будет разрешен или отклонен в зависимости от значения параметра data. 
// Если data не является числом, мы немедленно отклоняем промис с сообщением "error". 
// Если data является четным числом, мы отклоняем промис через 2 секунды с сообщением "even". 
// Если data является нечетным числом, мы разрешаем промис через 1 секунду с сообщением "odd".

thirdJob(4)
  .then((result) => { console.log(result); })
  .catch((error) => { console.error(error.message); });

// Обработка с помощью конструкции async/await c try/catch
async function processThirdJob() {
    try {
        const result = await thirdJob("dfghjm");
        console.log(result);
    } catch (error) {
        console.error(error.message);
    }
}

processThirdJob();