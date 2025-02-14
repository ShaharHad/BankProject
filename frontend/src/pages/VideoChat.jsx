import {Container, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

import {useGlobal} from "../components/GlobalProvider.jsx";
import JitsiMeetComponent from "../components/JitsiVideo.jsx";

const VideoChat = () => {

    const { account } = useGlobal();
    const email = account.email;
    const navigate = useNavigate();

    return (
        <Container>
            <Typography variant="h3" >Banking Secure Video Chat</Typography>
            <JitsiMeetComponent email={email} handleExit={() => navigate("/user/transfer")} />
        </Container>
    );
};

export default VideoChat;