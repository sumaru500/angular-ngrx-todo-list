import * as io from 'socket.io-client';

// const PORT_WS_NODE = 4001;
const PORT_WS_SPRING = 8081;
const initWebSocket = () => {
    let clientSocket = null;
    const socketOptions =  {
        transports: ['polling', 'websocket'],
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
        timeout: 500,
    }
    // if (environment.backServer === 'node') {
        // clientSocket = io(`http://localhost:${PORT_WS_NODE}`, socketOptions);
    // }

    // if (environment.backServer === 'spring') {
        clientSocket = io.connect(`http://localhost:${PORT_WS_SPRING}`, socketOptions);
    // }

    clientSocket.on('connect', () => {
        console.log('Socket client connected');
    });

    clientSocket.on('disconnect', () => {
        console.log('Socket client disconnected');
    });

    clientSocket.on('connect_error', (error: any) => {
        console.log('Socket client error', error);
    });

    return clientSocket;
};

export default initWebSocket;
