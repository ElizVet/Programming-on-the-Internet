var http = require("http");

const server = http.createServer(function(request,response){

    process.stdin.setEncoding('utf-8');
    response.write('<h1>norm</h1>');
    var state = "norm";

    process.stdin.on("readable", () => {
        let chunk = null;
        while ((chunk = process.stdin.read()) != null) {
            if(chunk.trim() == 'norm') {
                process.stdout.write(`reg = ${state} -> norm\n`);
                state = "norm";
                response.write('<h1>norm</h1>');
            }
            else if(chunk.trim() == 'stop') {
                process.stdout.write(`reg = ${state} -> stop\n`);
                state = "stop";
                response.write('<h1>stop</h1>');
            }
            else if(chunk.trim() == 'test') {
                process.stdout.write(`reg = ${state} -> test\n`);
                state = "test";
                response.write('<h1>test</h1>');
            }
            else if(chunk.trim() == 'idle') {
                process.stdout.write(`reg = ${state} -> idle\n`);
                state = "idle";
                response.write('<h1>idle</h1>');
            }
            else if (chunk.trim() == 'exit') {
                process.exit(0);
            }
            else process.stdout.write("Wrong command\n");
        }
    });
}).listen(5000);

console.log('server.listen(http://localhost:5000)');