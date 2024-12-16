//отправляет на браузер HTML-страницу
const http = require("http");
const url = require("url");
const fs = require("fs");
const nodemailer = require("nodemailer"); // пакет
const smtpTransport = require('nodemailer-smtp-transport');
const {parse} =require('querystring');

const server = http.createServer().listen(5000);
console.log("http://localhost:5000/");

server.on("request", (req, res) => {
    const path = url.parse(req.url).pathname;

    if (path === "/" && req.method === "GET") {
        fs.readFile("nodemailer02.html", (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    }
    if (path === "/" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        
        req.on("end", () => {
            let params = parse(body);
            const transporter = nodemailer.createTransport(smtpTransport({ // хранит конфиг SMTP
                service: 'Gmail',
                auth: {
                    user: params.sender,
                    pass: params.password,
                }
            }));
            
            const options = {
                from: params.sender,
                to: params.receiver,
                subject: "Lab №5",
                text: params.message,
            };

            transporter.sendMail(options, (err, info) => {
                err ? console.log(err):console.log('Message sent success!')
            })
    

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`${params.sender} ${params.receiver} ${params.message}`);
        })
    }
});