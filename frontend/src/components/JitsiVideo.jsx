import {JaaSMeeting} from "@jitsi/react-sdk";
import {Button, Box, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import { useGlobal } from "./GlobalProvider.jsx";
import Axios from "../utils/Axios.js";

const JitsiMeetComponent = (data) => {

    const [jwt, setJwt] = useState("");
    const [showMeeting, setShowMeeting] = useState(false);
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
        console.log("The user has hung up the meeting.");
        setShowMeeting(false);
    };

    return (
        isLoading ? (
            <Typography variant="h3">Loading...</Typography>
        )
        : (
            <Box sx={{ textAlign: "center", mt: 4 }}>
                {!showMeeting ? (
                    <Button variant="contained" color="primary" onClick={() => setShowMeeting(true)}>
                        Start Video Call
                    </Button>
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
                            onApiReady={(api) => {
                                api.on('videoConferenceLeft', handleHangup);
                            }}
                        />
                    </Box>
                )}
            </Box>
        )
    );
};

export default JitsiMeetComponent;






// import React, { useState } from "react";
// import { JitsiMeeting } from "@jitsi/react-sdk";
// import { Button, Box } from "@mui/material";
//
// const JitsiMeetComponent = ({ roomName, displayName }) => {
//     const [showMeeting, setShowMeeting] = useState(false);
//
//     return (
//         <Box sx={{ textAlign: "center", mt: 4 }}>
//             {!showMeeting ? (
//                 <Button variant="contained" color="primary" onClick={() => setShowMeeting(true)}>
//                     Start Video Call
//                 </Button>
//             ) : (
//                 <Box sx={{ height: "600px" }}>
//                     <JitsiMeeting
//                         roomName={roomName}
//                         configOverwrite={{
//                             startWithAudioMuted: true,
//                             startWithVideoMuted: true,
//                         }}
//                         interfaceConfigOverwrite={{
//                             DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
//                         }}
//                         userInfo={{ displayName }}
//                         getIFrameRef={(iframe) => {
//                             iframe.style.height = "600px";
//                             iframe.style.width = "100%";
//                         }}
//                     />
//                 </Box>
//             )}
//         </Box>
//     );
// };
//
// export default JitsiMeetComponent;

