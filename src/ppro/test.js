const net = require('net');
const client = new net.Socket();

client.connect(9200, '127.0.0.1', () => {
	console.log('Connected to server');
});

setInterval(() => {
	const json = JSON.stringify({ number: Math.random() });
	const dataLength = Buffer.byteLength(json);
	const data = Buffer.alloc(dataLength + 4);
	data.writeUInt32LE(dataLength, 0);
	data.write(json, 4);
	client.write(data);
}, 10000);