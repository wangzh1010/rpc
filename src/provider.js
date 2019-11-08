const Registery = require('../registry/index')
const RpcServer = require('../server')
const path = require('path')
const registery = new Registery()
const server = new RpcServer({ registery });
server.register(path.resolve(__dirname, 'services'));
server.start().then(() => {
    for (s in server.services) {
        console.log(s, server.services[s])
    }
}).catch(err => {
    console.log(err)
});
