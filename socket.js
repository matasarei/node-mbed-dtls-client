'use strict';

const stream = require('stream');
const dgram = require('dgram');
const fs = require('fs');

const mbed = require('./build/Release/node_mbed_dtls_client');

const MBEDTLS_ERR_SSL_PEER_CLOSE_NOTIFY = -0x7880;

class DtlsSocket extends stream.Duplex {
	constructor(options) {
		super({ allowHalfOpen: false });

		if(!options) options = {};  // Support no-parameter construction.

		this.remoteAddress = options.host;
		this.remotePort    = options.port;
		this.dgramSocket   = options.socket || dgram.createSocket('udp4');
		this._onMessage    = this._onMessage.bind(this);

		this.dgramSocket.on('message', this._onMessage);
		this.dgramSocket.once('error', err => {
			this.emit('error', err);
			this._end();
		});
		this.dgramSocket.once('close', () => {
			this._socketClosed();
		});

		const clientKey  = Buffer.isBuffer(options.key)      ? Buffer.concat([options.key, Buffer.from([0])])    : false;
		const clientCert = Buffer.isBuffer(options.cert)     ? Buffer.concat([options.cert, Buffer.from([0])])   : false;
		const ca_cert    = Buffer.isBuffer(options.CACert)   ? Buffer.concat([options.CACert, Buffer.from([0])]) : false;
		const psk        = Buffer.isBuffer(options.psk)      ? options.psk           : false;
		const psk_ident  = Buffer.isBuffer(options.PSKIdent) ? options.PSKIdent      : false;

		if( !psk && !clientKey )
		{
			throw "you must define either a PSK or a private key.";
		}

		this.mbedSocket = new mbed.DtlsSocket(
			clientKey, clientCert,              // Keys (Buffers)
			ca_cert,                            // CA   (Buffer)
			psk,                                // PSK  (Buffer)
			psk_ident,                          // PSK ident (Buffer)
			this._sendEncrypted.bind(this),     // Callback
			this._handshakeComplete.bind(this), // Callback
			this._error.bind(this),             // Callback
			options.debug);                     // Verbosity (integer)

		this.send = function(msg, offset, length, port, host, callback) {
			this.mbedSocket.send(msg);
		}

		process.nextTick(() => {
			this._sendSafetyCheck();
		});
	}

	bind(port, address, callback) {
		this.dgramSocket.bind(port, address, callback);
	}

	address() {
		return this.dgramSocket.address();
	}

	_onMessage(msg) {
		if (!this.mbedSocket) {
			return;
		}

		const data = this.mbedSocket.receiveData(msg);
		if (data) {
			this.push(data);
		}
	}

	_read() {
		// do nothing!
	}

	_write(chunk, encoding, callback) {
		this._sendCallback = callback;
		this.mbedSocket.send(chunk);
	}

	_sendSafetyCheck() {
		// make absolutely sure the socket will let us send
		if (this.dgramSocket) {
			this.mbedSocket.connect();
		}
		else {
			process.nextTick(() => {
				this._sendSafetyCheck();
			});
		}
	}

	_sendEncrypted(msg) {
		// store the callback here because '_write' might be called
		// again before the underlying socket finishes sending
		const sendCb = this._sendCallback;
		this._sendCallback = null;
		const sendFinished = (err) => {
			if (sendCb) {
				sendCb(err);
			}
			if (this._sendNotify) {
				this._closeSocket();
			}
		};

		if (!this.dgramSocket) {
			process.nextTick(() => {
				sendFinished(new Error('no underlying socket'));
			});
			return;
		}

		this.dgramSocket.send(msg, 0, msg.length, this.remotePort, this.remoteAddress, sendFinished);
	}

	_handshakeComplete() {
		this.connected = true;
		this.emit('secureConnect', this);
	}

	_error(code, msg) {
		if (code === MBEDTLS_ERR_SSL_PEER_CLOSE_NOTIFY) {
			this._end();
			return;
		}

		this._hadError = true;
		if (this._sendCallback) {
			this._sendCallback(code);
			this._sendCallback = null;
		} else {
			this.emit('error', code, msg);
		}
		this._end();
	}

	end() {
		this._sendNotify = true;
		this._end();
	}

	_end() {
		if (this._ending) {
			return;
		}
		this._ending = true;

		if (this.dgramSocket) {
			this.dgramSocket.removeListener('message', this._onMessage);
		}

		super.end();
		this.push(null);

		const noSend = this.mbedSocket.close();
		this.mbedSocket = null;

		if (noSend || !this._sendNotify) {
			this._closeSocket();
		}
	}

	_closeSocket() {
		if (!this.dgramSocket) {
			this._socketClosed();
			return;
		}

		this.dgramSocket.close();
	}

	_socketClosed() {
		this.dgramSocket = null;
		this.emit('close', this._hadError);
		this.removeAllListeners();
	}
}

module.exports = DtlsSocket;
