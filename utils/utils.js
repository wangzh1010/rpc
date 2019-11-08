const crypto = require('crypto')
const HEAD_LEN = 20;
const VERIFY_LEN = 16;
let UUID = 1;
class Utils {
    static encode(payload) {
        payload = JSON.stringify(payload);
        const packet = Buffer.alloc(10 * 1024);
        let offset = 0;
        packet[0] = 1; //版本
        packet[1] = 1; //请求类型
        packet.writeInt32BE(UUID++, 2); //标识
        packet[6] = 1; //解析
        offset = 20;
        let bodyLen = packet.write(payload, offset);
        packet.writeInt32BE(bodyLen, 7);
        offset += bodyLen;
        const hash = crypto.createHash('md5')
        hash.update(payload);
        let md5 = hash.digest();
        let md5Len = md5.copy(packet, offset, 0);
        offset += md5Len;
        let data = packet.slice(0, offset);
        return data;
    }
    static decode(chunk) {
        if (chunk.length < HEAD_LEN) {
            return false;
        }
        let bodyLen = chunk.readInt32BE(7);
        if (chunk.length < HEAD_LEN + bodyLen + VERIFY_LEN) {
            return false;
        }
        let ver = chunk[0];
        let type = chunk[1];
        let uuid = chunk.readInt32BE(2);
        let codec = chunk[6];
        let payload = chunk.slice(HEAD_LEN, bodyLen + HEAD_LEN);
        let md5 = chunk.slice(HEAD_LEN + bodyLen, HEAD_LEN + bodyLen + VERIFY_LEN);
        return JSON.parse(payload);
    }
}
module.exports = Utils;
