const db = require('./db.js'); // объект для работы с БД
const http = require('http');
const fs = require('fs');
const url = require('url');

// принимает HTTP-запросы GET, POST, PUT, DELETE

function transaction(req, res) {
    if (req.url === '/') {
        fs.readFile('index.html', (err, data) => { res.end(data.toString());} );
        return;
    }
    else if (req.url != '/api/db') {
        res.end();
    }
    switch (req.method) {
        case 'GET':     // все строки бд в json
            db.select().then((data) => {
                res.end(JSON.stringify(data));
            });
            break;
        case 'POST':    // добавить строку в бд в json
            req.on('data', data => {
                let obj = JSON.parse(data);
                db.insert(obj.id, obj.name, obj.bday);
                res.end(JSON.stringify(obj));
            });
            break;
        case 'PUT':     // изменить существ строку
            req.on('data', data => {
                let obj = JSON.parse(data);
                db.update(obj.id, obj.name, obj.bday);
                res.end(JSON.stringify(obj));
            });
            break;
        case 'DELETE':  // удалить строку по id
            const id = url.parse(req.url, true).query.id;
            req.on('data', data => {
                let obj = JSON.parse(data);
                db.delete(id);
                res.end(JSON.stringify(obj));
                
            });
            break;
    }
}


const server = http.createServer(transaction);
server.listen(5000, '127.0.0.1', null); // http://localhost:5000/api/db
