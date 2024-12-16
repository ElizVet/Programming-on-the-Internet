const dgram = require('dgram')
const PORT = 40000

let server = dgram.createSocket('udp4')
server.on('message', (msg, info) => {
    console.log(`${msg}`)
    server.send(`ECHO: ${msg}`, info.port) // отправляет данные на сокет
})
server.on('error', (err) => { console.log(`${err}`);})
server.bind(PORT)