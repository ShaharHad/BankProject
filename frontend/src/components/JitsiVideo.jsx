import {JaaSMeeting} from "@jitsi/react-sdk";
import {Box, CircularProgress} from "@mui/material";
import {useEffect, useState} from "react";
import { useGlobal } from "./GlobalProvider.jsx";
import Axios from "../utils/Axios.js";

const JitsiMeetComponent = (data) => {

    const [jwt, setJwt] = useState("");
    const [showMeeting, setShowMeeting] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const { baseUrl } = useGlobal();

    const appID = import.meta.env.VITE_JITSI_APP_ID;

    useEffect(() => {
        Axios.get(baseUrl + "/auth/generateJitsiToken").then((res) => {
            setJwt(res.data.token);
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    const handleHangup = () => {

        if("handleExit" in data){
            data.handleExit();
        }
        setShowMeeting(false);
        console.log("The user has hung up the meeting.");
    };

    const updateParticipants = () => {

        if("handleExit" in data){
            data.handleExit();
        }
        console.log("The user has hung up the meeting.");

    };


    return (
        isLoading ? (
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
        )
        : (
            <Box sx={{ textAlign: "center", mt: 4 }}>
                {!showMeeting ? (
                    <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box >
                        <JaaSMeeting
                            appId = { appID }
                            roomName = {`Bank-${data.email}`}
                            jwt = { jwt }
                            getIFrameRef={(node) => (node.style.height = "800px")}
                            configOverwrite = {{
                                disableThirdPartyRequests: true,
                                disableLocalVideoFlip: true,
                                backgroundAlpha: 0.5,

                            }}
                            interfaceConfigOverwrite = {{
                                VIDEO_LAYOUT_FIT: 'nocrop',
                                MOBILE_APP_PROMO: false,
                                TILE_VIEW_MAX_COLUMNS: 4,
                                TOOLBAR_BUTTONS: [
                                    "microphone", "camera", "chat", "raisehand",
                                    "tileview", "fullscreen", "hangup"
                                ]
                            }}
                            onApiReady={(api) => { // configure listeners
                                api.on('videoConferenceLeft', handleHangup);
                                // api.on('videoConferenceLeft', handleHangup);
                                // api.on('videoConferenceLeft', handleHangup);
                            }}
                        />
                    </Box>
                )}
            </Box>
        )
    );
};

export default JitsiMeetComponent;
