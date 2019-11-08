const { Writable } = require('stream')
const { StringDecoder } = require('string_decoder')

class MyWriter extends Writable {
    constructor(options) {
        super(options);
        this._decoder = new StringDecoder(options && options.defaultEncoding);
        this._data = '';
    }
    _write(chunk, encoding, callback) {
        if ('buffer' === encoding) {
            chunk = this._decoder.write(chunk);
        }
        this._data += chunk;
        callback();
    }
    _final(callback) {
        this._data = this._decoder.end();
        callback()
    }
    get data() {
        return this._data;
    }
}

const euro = [[0xE2, 0x82], [0xAC]].map(Buffer.from);
const w = new MyWriter();
w.write('货币：');
w.write(euro[0]);
w.end(euro[1]);
console.log(w.data);
