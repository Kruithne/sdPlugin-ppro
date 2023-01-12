streamDeck = new class {
	inPort = 0;
	inUUID = '';
	inMessageType = '';
	inApplicationInfo = null;
	inActionInfo = null;
	socket = null;

	initialized = false;
	initResolver = null;

	/**
	 * Initialize the socket connection to the Stream Deck.
	 * @param {string} inPort 
	 * @param {string} inUUID 
	 * @param {string} inMessageType 
	 * @param {string} inApplicationInfo 
	 * @param {string} inActionInfo 
	 */
	initSocket(inPort, inUUID, inMessageType, inApplicationInfo, inActionInfo) {
		this.inPort = parseInt(inPort);
		this.inUUID = inUUID;
		this.inMessageType = inMessageType;
		this.inApplicationInfo = JSON.parse(inApplicationInfo);
		this.inActionInfo = JSON.parse(inActionInfo);

		const socket = this.socket = new WebSocket('ws://127.0.0.1:' + inPort);

		socket.onopen = () => {
			this.sendJSON({
				"event": inMessageType,
				"uuid": inUUID
			});
		};

		socket.onmessage = evt => {
			const json = JSON.parse(evt.data);
			console.log(json);
		};

		socket.onclose = () => {
			// WebSocket is closed.
		};

		this.initResolver?.();
	}

	/**
	 * Returns a promise that resolves when the document is ready and the socket is initialized.
	 * @returns {Promise<void>}
	 */
	async isReady() {
		// Theoretically, if isReady() is called from multiple places, it could result in
		// a situation where the promise never resolves since we only store one resolver.
		// In practice, this won't be an issue since isReady() should only be called once
		// from an importing property inspector script.
		if (!this.initialized)
			await new Promise(res => this.initResolver = res);

		// Check if the document is ready, if not, await for it.
		if (document.readyState === 'loading')
			await new Promise(res => document.addEventListener('DOMContentLoaded', res, { once: true}));
	}

	/**
	 * Encode an object as JSON and send it to the Stream Deck.
	 * @param {object} obj
	 */
	sendJSON(obj) {
		this.socket.send(JSON.stringify(obj));
	}
};

connectElgatoStreamDeckSocket = streamDeck.initSocket.bind(streamDeck);