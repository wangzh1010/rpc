# rpc

底层TCP，通过socket通信
数据包格式
---------------------------------------------------------------
| version | type | id | codec | len | reserve | payload | md5 |
---------------------------------------------------------------
version：    版本            1位
type：       请求类型        1位
id：         标识            4位
codec：      解析            1位
len：        payload长度     4位
reserve：    预留            9位
payload:     实体            n位
md5：        校验            32位
