const { Readable } = require('stream')
const fs = require('fs')

class MyReader extends Readable {
    constructor(opts) {
        super(opts);
        this._start = 0;
        this._max = 10;
    }

    _read() {
        let num = ++this._start;
        if (num > this._max) {
            this.push(null);
        } else {
            let buf = Buffer.from(String(num));
            this.push(buf)
        }
    }
}

let r = new MyReader();
let data = [];
r.on('data', chunk => {
    data.push(chunk.toString())
})
r.on('end', () => {
    console.log(data)
    let w = fs.createWriteStream('./num.txt');
    w.write(data.join('~'))
})
