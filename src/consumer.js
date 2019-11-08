const RpcClient = require('../client/index')
const Registry = require('../registry/index')
const registry = new Registry()
const client = new RpcClient({ registry });
client.connect().then(() => {
    client.invoke({ id: 1, namespace: 'services.foo', method: 'plus', args: [6] })
        .then(data => {
            console.log(data);
        })
        .catch(e => {
            console.log(e)
        });
});
