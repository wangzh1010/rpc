const net = require('net');
const path = require('path');
const fs = require('fs');
const Utils = require('../utils/utils');
class RpcServer {
    constructor({ port = '8124', hostname = '127.0.0.1', registery } = {}) {
        this.server = null;
        this.socket = null;
        this.services = {};
        this.chunk = Buffer.alloc(0);
        this.port = port;
        this.hostname = hostname;
        this.registery = registery;
        this.register(path.resolve(__dirname, 'services'));
    }
    start() {
        return new Promise((resolve, reject) => {
            this.server = net.createServer(socket => {
                this.socket = socket;
                this.socket.on('data', data => {
                    this.chunk = Buffer.concat([this.chunk, data]);
                    let payload = Utils.decode(this.chunk);
                    if (payload) {
                        this.onRequest(payload);
                    }
                });
                this.socket.on('error', err => {
                    console.log('socket error', err);
                });
            });

            this.server.listen(this.port, this.hostname, () => {
                console.log(`server start listening ${this.port}...`);
                resolve();
            });

            this.server.on('error', (err) => {
                console.log('server error', err);
                reject(err);
            });
        });
    }
    onRequest(payload) {
        let methods = this.services[payload.method];
        if (methods && methods.length > 0) {
            let result = methods[0].fn.call(null, ...payload.args);
            this.socket.end(Utils.encode({ result }));
        } else {
            this.socket.end(Utils.encode({ result: 'null' }));
        }
        this.chunk = Buffer.alloc(0);
    }
    register(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(filename => {
            let mapping = require(path.resolve(dir, filename));
            for (let method in mapping) {
                if (!this.services[method]) {
                    this.services[method] = [];
                }
                this.services[method].push({ fn: mapping[method], version: 1 });
                this.registery.register({ method, version: 1 });
            }
        });
    }
}

module.exports = RpcServer;
