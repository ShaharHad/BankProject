import {createContext, useEffect, useRef} from 'react';
import {io} from "socket.io-client";

export const WebSocketContext = createContext();

export const WebSocketProvider = (components) => {
    const children = components.children;
    const socket = useRef(null);

    useEffect(() => {
        socket.current = io.connect('http://localhost:8000',{
            transports: ['websocket'],
            withCredentials:true
        });

        socket.current.on('connect', () => {
            console.log('WebSocket connected:' +  socket.current.id);
        });

        socket.current.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });

        socket.current.on('message', (data) => {
            alert('Message from server:' + data.message)
        });

        return () => {
            socket.current.disconnect(); // Clean up the socket on unmount
        };

    }, [socket]);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};
