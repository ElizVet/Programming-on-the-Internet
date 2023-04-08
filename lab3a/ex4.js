const http = require('http');
const url = require('url');
const fs = require('fs');

function factor(n, cb) {
    this.fact = factorial;
    this.calc = () => {process.nextTick(() => {cb(null, this.fact(n));});}
}

const server = http.createServer(function (request, response) {
    let rc = JSON.stringify({ k : 0 , fact:0});
    
    if (url.parse(request.url).pathname === '/fact') {
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
                let f=new factor(k,(err,result)=>{response.end(JSON.stringify({ k:k , fact : result}));});
                f.calc();
            }
        }
    }
}).listen(5000)

var factorial = function(n) {
    return (n > 1) ? n * factorial(n - 1) : 1;
}