function firstJob(){
    const startTime = Date.now();
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve(`Hello World! -- Time: ${(Date.now() - startTime)}`); }, 2000)
    });
}

// обработка с помощью обработчиков Promise
firstJob()
    .then(result => { console.log(result); })
    .catch(error => { console.error(error); });


// вызов функции с помощью конструкции async/await c try/catch
async function processFirstJob() {
    try {
      const result = await firstJob();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
}

processFirstJob();