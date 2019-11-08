const fs = require('fs')
const reader = fs.createReadStream('../process.png');
const writer = fs.createWriteStream('./process.png');
// reader.pipe(writer)
let chunk;
reader.on('data', data => {
    console.log('接收到' + data.length + '字节的数据');
    if (chunk) {
        chunk = Buffer.concat([chunk, data], chunk.length + data.length)
    } else {
        chunk = data;
    }
    reader.pause();
    console.log('停止读取数据...');
    setTimeout(() => {
        console.log('数据开始重新流动...');
        reader.resume();
    }, 1000);
})
reader.on('end', () => {
    console.log('共读取到了 %d 字节数据', chunk.length);
    writer.write(chunk);
});

/* reader.on('readable', () => {
    let data;
    while ((data = reader.read(100)) !== null) {
        if (!chunk) {
            chunk = data;
        } else {
            chunk = Buffer.concat([chunk, data], chunk.length + data.length)
        }
    }
    console.log('读取到的数据： ' + chunk.length);
}); */
