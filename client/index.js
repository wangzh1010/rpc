const net = require('net');
const Utils = require('../utils/utils')
class RpcClient {
    constructor({ port = '8124', hostname = '127.0.0.1', registry } = {}) {
        this.client = null;
        this.resolve = null;
        this.reject = null;
        this.chunk = Buffer.alloc(0);
        this.port = port;
        this.hostname = hostname;
        this.registry = registry
    }
    connect() {
        return new Promise((resolve, reject) => {
            this.client = net.connect(this.port, this.hostname, () => {
                resolve();
            });
            this.client.on('data', data => {
                this.chunk = Buffer.concat([this.chunk, data]);
                let payload = Utils.decode(this.chunk);
                if (payload) {
                    this.resolve(payload);
                }
            });
            this.client.on('error', err => {
                reject(err);
            });
        });
    }

    invoke(payload) {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            this.client.write(Utils.encode(payload));
        });
    }
}

module.exports = RpcClient;
