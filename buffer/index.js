let res = Buffer.from(['abc', 'def']);
console.log(res);
let buf = Buffer.alloc(10, '测试', 'utf-8')
for (let i = 0; i < buf.length; i++) {
    console.log(buf[i])
}

let buf1 = Buffer.allocUnsafe(5);
console.log(buf1)
buf1.fill(0)
console.log(buf1)

let buf2 = Buffer.alloc(10);
let buf3 = Buffer.alloc(5);
let len = buf2.length + buf3.length;
let bufA = Buffer.concat([buf2, buf3], len);
console.log(bufA.length)

function write() {
    let buf = Buffer.alloc(1024 * 1024);
    buf[0] = 1;
    buf[1] = 0;
    buf.writeInt32BE(1000, 2);
    let data = JSON.stringify({ version: 1 });
    let len = Buffer.from(data).length;
    buf[6] = len;
    buf.write(data, 7);
    buf[6 + len + 1] = 99;
    return buf.slice(0, 7 + len + 1);
}
let buf4 = write();
function read(buf) {
    console.log(buf);
    console.log(buf[0]);
    console.log(buf[1]);
    console.log(buf.readInt32BE(2));
    let len = buf[6];
    console.log(len);
    console.log(JSON.parse(buf.slice(7, 7 + len)));
    console.log(buf[6 + len + 1]);
}
read(buf4)

// 很多同学在看 Buffer API 文档时，会发现很多 API 都是 xxxBE 和 xxxLE 两个版本成对出现的，比如：readInt32BE 和 readInt32LE，writeDoubleBE 和 writeDoubleLE 等等。BE 和 LE 分别代表什么含义？它们有什么区别？我们应该用 BE 还是 LE 呢？细心的同学可能还会问为什么 writeInt8 这个 API 没有 BE 和 LE 的版本？
// 它们的区别在于：Int8 只需要一个字节就可以表示，而 Short，Int32，Double 这些类型一个字节放不下，我们就要用多个字节表示，这就要引入「字节序」的概念，也就是字节存储的顺序。对于某一个要表示的值，是把它的低位存到低地址，还是把它的高位存到低地址，前者叫小端字节序（Little Endian），后者叫大端字节序（Big Endian）。大端和小端各有优缺点，不同的CPU厂商并没有达成一致，但是当网络通讯的时候大家必须统一标准，不然无法通讯了。为了统一网络传输时候的字节的顺序，TCP/IP 协议 RFC1700 里规定使用「大端」字节序作为网络字节序，所以，我们在开发网络通讯协议的时候操作 Buffer 都应该用大端序的 API，也就是 BE 结尾的。
