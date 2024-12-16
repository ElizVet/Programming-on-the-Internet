//const m0603 = require('./m0603');
const m0603 = require('lizm0603'); // глобал реп npm ls -g

const mailAddr = 'shimliza64@gmail.com'; // отправитель
const mailPass = 'tizoxbqjwfmadciw';
const message = 'i want to sleeeeeep';

m0603.send(mailAddr, mailPass, message);
console.log('WOOOW Sent email');