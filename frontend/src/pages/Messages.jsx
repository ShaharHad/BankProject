import {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";

import axios from 'axios';
import { useGlobal } from "../components/GlobalProvider.jsx";
import Axios from "../utils/Axios.js";
import {Button, CircularProgress, Container, Typography} from "@mui/material";
import Message from "../components/Message.jsx";

axios.defaults.withCredentials = true;

const Messages = () => {

    const navigate = useNavigate();
    const { baseUrl, setHaveNewMessages } = useGlobal();
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const readMessages = useRef([]);
    const unreadMessages = useRef([]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleData = 5;

    const markMessageAsRead = async (id) => {
        const index = unreadMessages.current.findIndex(obj => obj._id === id);
        if(index === -1){
            console.error("No exist message to set the isRead field");
            return;
        }
        Axios.put(`${baseUrl}/account/message/`, {
            msg: unreadMessages.current[index],
        }).then(() => {

            const msg = { ...unreadMessages.current.splice(index, 1)[0], isRead: true };
            readMessages.current.push(msg);
            if(unreadMessages.current.length === 0){
                setHaveNewMessages(false);
            }
            else{
                setHaveNewMessages(true);
            }
            setMessages([...unreadMessages.current, ...readMessages.current]);

        }).catch((err) => {
            console.error(err);
        })

    };

    useEffect(() => {
        const fetchMessages= async () => {
            setIsLoading(true);
            await Axios.get(baseUrl + "/account/message/")
                .then((response) => {
                    console.log(response);
                    if(response.data.messages.unreadMessages.length === 0){
                        setHaveNewMessages(false);
                    }
                    else{
                        setHaveNewMessages(true);
                    }
                    readMessages.current = response.data.messages.readMessages;
                    unreadMessages.current = response.data.messages.unreadMessages;
                    setMessages([...unreadMessages.current, ...readMessages.current]);

                }).catch((err) =>{
                    if(err.status === 401){ // authentication failed and should be moved to login page
                        alert("Navigate to login screen duo to inactive account");
                        sessionStorage.removeItem("token");
                        sessionStorage.removeItem("account");
                        sessionStorage.removeItem("balance");
                        navigate("/login");
                    }
                    console.error("Error: " + err.message);
                });
            setIsLoading(false);
        }
        fetchMessages();
    }, []);

    const getCurrentData = () => {
        return messages.slice(currentIndex, currentIndex + visibleData);
    }

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - visibleData, 0));
    }

    const handleNext = () => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + visibleData, messages.length - visibleData));
    }

    return (
        isLoading ? (
            <Typography variant="h4">
                <CircularProgress />
            </Typography>
        ):(
            <Container>
                <Typography variant="h5" >Messages</Typography>
                {getCurrentData().map((msg) => (
                    <Message key={msg._id} {...msg} onRead={markMessageAsRead} />
                ))}
                <Button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    type="button"
                    variant="contained"
                    color="primary"
                    sx={{margin: 2}}
                >
                    Previous
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={currentIndex + visibleData >= messages.length}
                    type="button"
                    variant="contained"
                    color="primary"
                    sx={{margin: 2}}
                >
                    Next
                </Button>
            </Container>
        )

    );
};

export default Messages;


