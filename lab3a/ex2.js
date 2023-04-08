const http = require('http');
const url = require('url');
const fs = require('fs');


const server = http.createServer(function (request, response) {
    let rc = JSON.stringify({ k : 0 });
    
    if (url.parse(request.url).pathname === '/fact') {
        console.log(request.url);
        var k = url.parse(request.url, true).query.k;
        
        if (k.toString() == "x") {
            fs.readFile("ex3.html", (err, data) => {
                response.end(data);
            });
        }
        else if (typeof url.parse(request.url, true).query.k != 'undefined') {
            let k = parseInt(url.parse(request.url, true).query.k);
            if (Number.isInteger(k)) {
                response.writeHead(200, {'Content-Type' : 'application/json'});
                response.end(JSON.stringify({ k : k , fact : factorial(k) }));
            }
        }
    }
}).listen(5000)

var factorial = function(n) {
    return (n > 1) ? n * factorial(n - 1) : 1;
}