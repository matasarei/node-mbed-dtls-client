'use strict';

const path = require('path');
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
rl.setPrompt('<= ');

const dtls = require('../index.js');

const options = {
	host:          process.argv[2] || 'localhost',
	port:          process.argv[3] || 5684,
	key:           null, //fs.readFileSync(path.join(__dirname, '../test/ec_private_key.pem')),
	cert:          null, //fs.readFileSync(path.join(__dirname, '../test/ec_cert.pem')),
	psk:           Buffer.from("AAAAAAAAAAAAAAAA"),
	PSKIdent:      Buffer.from("32323232-3232-3232-3232-323232323232"),
	debug:         0
};

let clientSocket = dtls.connect(options, socket => {
	console.log(`secure connection to ${socket.remoteAddress}:${socket.remotePort}`);
	socket.on('data', msg => {
		console.log(`=> ${msg}`);
		rl.prompt();
	});

	rl.on('line', msg => {
		socket.write(msg);
	});

	rl.prompt();
});

clientSocket.on('error', (code, msg) => {
	console.error(`socket error ${code}`, msg);
});

clientSocket.on('close', () => {
	rl.close();
	clientSocket = null;
});

process.on('SIGINT', () => {
	clientSocket.end();
});
