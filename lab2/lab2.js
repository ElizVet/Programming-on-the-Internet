// http://localhost:5000/xmlhttprequest

const http = require("http");
const port = 5000;
const host = "localhost";
const fs = require('fs').promises;

http.createServer(function(request,response){
    
    // если обещание успешно выполняется, то читаем файл
    // contents содержит данные файла HTML

    switch (request.url) {
        case "/html":
            fs.readFile("index.html")
                .then(contents => { 
                    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    response.end(contents);
                });
            break
        case "/png":
            fs.readFile("pic.png")
                .then(contents => { 
                    response.writeHead(200, { 'Content-Type': 'image/png; charset=utf-8' });
                    response.end(contents);
                });
            break
        case "/api/name":
            response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            response.end("Шимчёнок Елизавета Константиновна");
            break
        case "/xmlhttprequest":
            fs.readFile("xmlhttprequest.html")
            .then(contents => {
                response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                response.end(contents);
            });
            break
        case "/fetch":
            fs.readFile("fetch.html")
            .then(contents => {
                response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                response.end(contents);
            });
            break
        case "/jquery":
            fs.readFile("jquery.html")
            .then(contents => {
                response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                response.end(contents);
            });
            break
        default:
            response.writeHead(404);
            response.end(JSON.stringify({error:"Resource not found"}));
    }


}).listen(port, "127.0.0.1", function(){
    console.log("Сервер начал прослушивание запросов");
});