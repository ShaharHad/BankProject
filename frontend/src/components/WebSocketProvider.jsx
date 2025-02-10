import {createContext, useEffect, useRef} from 'react';
import {io} from "socket.io-client";

import { useGlobal } from "./GlobalProvider.jsx";


export const WebSocketContext = createContext();

export const WebSocketProvider = (components) => {
        const children = components.children;
    const socket = useRef(null);

    const navEntries = performance.getEntriesByType("navigation");
    const isReload = navEntries.length > 0 && navEntries[0].type === "reload";

    const { account } = useGlobal();
    const path = window.location.pathname;

    useEffect(() => {
        socket.current = io.connect('http://localhost:8000',{
            transports: ['websocket'],
            withCredentials:true
        });

        socket.current.on('connect', () => {
            console.log('WebSocket connected:' +  socket.current.id + ", reload: " + isReload + ", path: " + path);
            if(isReload && (path !== "/" && path !== "/login" && path !== "/register")) {
                socket.current.emit('register', {email: account.current.email});
            }
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

    }, []);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};
