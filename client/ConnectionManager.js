class ConnectionManager
{
    constructor(tetrisManager)
    {
        this.conn = null;
        this.peers = new Map;

        this.tetrisManager = tetrisManager;

    }

    connect(address)
    {
        this.conn = new WebSocket(address);

        this.conn.addEventListener('open', () => {
            console.log('Connection Established');
            this.initSession();

            this.send({
                type : 'create session',
            });
        });

        this.conn.addEventListener('message', event => {
            console.log('Recieved message', event.data);
            this.receive(event.data );
        });
    }

    initSession()
    {
        const sessionId = window.location.hash.split('#')[1];
        // const state = this.localTetris.serialize();
        if (sessionId) {
            this.send({
                type: 'join-session',
                id: sessionId,
                // state,
            });
        } else {
            this.send({
                type: 'create-session',
                // state,
            });
        }
    }

    updateManager(peers) 
    {
        const me = peers.you;
        const clients = peers.clients.filter(client => me !== client.id);
        clients.forEach(client => {
            if (!this.peers.has(client.id)) {
                const tetris = this.tetrisManager.createPlayer();
                // tetris.unserialize(client.state);
                this.peers.set(client.id, tetris);
            }
        });

        [...this.peers.entries()].forEach(([id, tetris]) => {
            // if (!clients.some(client => client.id === id)) {
            if (clients.indexOf(id) === -1 ) {
                this.tetrisManager.removePlayer(tetris);
                this.peers.delete(id);
            }
        });
    }

    receive(msg)
    {
        const data = JSON.parse(msg);
        if (data.type === 'session created') {
            window.location.hash = data.id;
        } else if (data.type === 'session-broadcast') {
            this.updateManager(data.peers);
        }
    }

    send(data)
    {
        const msg = JSON.stringify(data);
        console.log('Sending message ${msg}');
        this.conn.send(msg);
    }
}