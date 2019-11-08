const { Transform } = require('stream')

class ProtoTransform extends Transform {
    constructor(options) {
        super(options)
    }

    _transform(chunk, encoding, callback) {
        let { name, args } = chunk;
        callback(null, JSON.stringify({ name, args }))
    }
}

let pt = new ProtoTransform({ writableObjectMode: true });

pt.setEncoding('ascii');
pt.on('data', data => {
    console.log(data);
});
pt.write({ id: '1', name: 'foo', args: [1, 2, 3] });
