// http://localhost:5000/blablabla

const PORT = 5000;
const http = require("http");


// 02 серверное приложение с модулем http, к-е возвращает разметку <h1>Hello World</h1>


// http.createServer(function(request,response){
//     response.writeHead(200, {
//         'Content-Type': 'text/html; charset=utf-8'
//       });
//     response.end("<h1>хело май дир</h1>");
// }).listen(PORT, "127.0.0.1", function(){
//     console.log("Сервер начал прослушивание запросов");
// });


// // 03 серверное приложение
// // ответ сервера: html стр с содержимым запроса: метод, uri, версия протокола, заголовки, тело


http.createServer(function(request,response){
    response.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    });
    
    let body = "";
    request.on('data', str => {body += str});
  
    request.on('end', ()=> response.end(`<!DOCTYPE html><html><head></head><body>
        <h1>Инфо о запросе:</h1>
        <p>Метод: ${request.method}</p> 
        <p>Url: ${request.url}</p>
        <p>Версия протокола: ${request.httpVersion}</p>
        <p>Заголовки: ${JSON.stringify(request.headers)}</p>
        <p>Тело: ${body}</p>
        </body></html>`));

}).listen(PORT, "127.0.0.1", function(){
    console.log("Сервер начал прослушивание запросов");
});