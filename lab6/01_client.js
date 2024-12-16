// клиент, к-й отправляет соо серверу
const net = require('net')

const HOST = '127.0.0.1'
const PORT = 40000

let client = new net.Socket(); // абстракция TCP-сокета

// устанавливает соединение, а потом генерирует событие connect.
client.connect(PORT, HOST, () => {console.log(`Client connected to a server`);}); 
client.write('Hello from client') // отправляет данные на сокет
client.on('data', data => { 
    console.log(`Client received: ${data.toString()}`);
    client.destroy(); // уничтожает поток и закрывает соединение
});
client.on('close', () => {console.log('Client closed');}); // генерируется после полного закрытия сокета
client.on('error', (err) => { console.log(`${err}`);}) // обработка ошибки