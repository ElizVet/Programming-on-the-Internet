function secondJob(){
    const startTime = Date.now();
    return new Promise((resolve, reject) => {
        setTimeout(() => { reject(new Error(`Произошла ошибка -- Time: ${(Date.now() - startTime)}`)); }, 3000)
    });
}

// Обработка с помощью обработчиков Promise
secondJob()
    .then(() => { console.log("Успешно выполнено"); })
    .catch((error) => { console.error(error.message); });



// Обработка с помощью конструкции async/await c try/catch
async function processSecondJob() {
    try {
        await secondJob();
        console.log("Успешно выполнено");
    } catch (error) {
        console.error(error.message);
    }
}

processSecondJob();
