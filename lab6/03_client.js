// клиент, к-й отправляет соо серверу
const dgram = require('dgram')
const PORT = 40000

let client = dgram.createSocket('udp4')
client.connect(PORT, () => { // cвязывает сокет с удаленным адресом и портом
    client.send('Hello from client') // отправляет данные на сокет
})
// message генерируется, когда в сокете доступна новая дейтаграмма
client.on('message', (msg, info) => {console.log(`${msg}`); client.close()})
client.on('close', () => {console.log('Client closed');}); // закрывает сокет и перестает прослушивать данные на нем
client.on('error', (err) => { console.log(`${err}`);})