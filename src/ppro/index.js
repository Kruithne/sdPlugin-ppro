(() => {
	const net = require('net');
	const cs = new CSInterface();

	const server = net.createServer(socket => {
		let buffer = null;
		let dataLength = 0;
		let bytesWritten = 0;

		console.log('Connected to client');

		socket.on('data', data => {
			console.log('Received data from client');
			
			if (!buffer) {
				dataLength = data.readUInt32LE(0);
				buffer = Buffer.alloc(dataLength);

				console.log('Data length: ' + dataLength + ' bytes')

				data.copy(buffer, 0, 4);
				bytesWritten += data.length - 4;
			} else {
				data.copy(buffer, buffer.length, 0);
				bytesWritten += data.length;
			}

			if (bytesWritten === dataLength) {
				const payload = buffer.toString('utf8');

				try {
					const json = JSON.parse(payload);
					console.log(json);
				} catch (e) {
					console.error('Received invalid JSON: ' + payload);
				} finally {
					buffer = null;
					dataLength = 0;
					bytesWritten = 0;
				}
			}
		});

		socket.on('end', () => {
			// We don't need to do anything here, but a handler must
			// be defined to prevent an error from being thrown.
		});

		socket.on('error', () => {
			// We don't need to do anything here, but a handler must
			// be defined to prevent an error from being thrown.
		});
	});

	server.listen(9200);
	
	cs.evalScript('$._KRU_.testFunction()', (result) => {
		console.log(result);
	});
})();