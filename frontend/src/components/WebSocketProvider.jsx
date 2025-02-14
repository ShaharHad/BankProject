import {createContext, useEffect, useRef, useState} from 'react';
import {io} from "socket.io-client";

import { useGlobal } from "./GlobalProvider.jsx";
import CustomAlert from "./CustomAlert.jsx";


export const WebSocketContext = createContext();

export const WebSocketProvider = (components) => {
    const children = components.children;
    const socket = useRef(null);
    const serverUrl = import.meta.env.VITE_SERVER

    const navEntries = performance.getEntriesByType("navigation");
    const isReload = navEntries.length > 0 && navEntries[0].type === "reload";

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const { account } = useGlobal();
    const path = window.location.pathname;

    useEffect(() => {
        socket.current = io.connect(serverUrl,{
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
            setShowAlert(true);
            setAlertMessage(data.message);
        });

        return () => {
            socket.current.disconnect(); // Clean up the socket on unmount
        };

    }, []);

    return (
        <WebSocketContext.Provider value={socket}>
            {
                showAlert && (<CustomAlert title={"Info"} message={alertMessage} onClose={() => setShowAlert(false)} />)
            }
            {children}
        </WebSocketContext.Provider>
    );
};
