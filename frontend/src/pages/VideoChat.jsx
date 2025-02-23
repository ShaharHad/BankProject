import {Container, Typography} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";

import {useGlobal} from "../components/GlobalProvider.jsx";
import JitsiMeetComponent from "../components/JitsiVideo.jsx";

const VideoChat = () => {

    const location = useLocation();
    const data = location.state;
    const { account } = useGlobal();
    const name = account.current.name;
    const navigate = useNavigate();

    return (
        <Container>
            <Typography variant="h3" >Banking Secure Video Chat</Typography>
            <JitsiMeetComponent
                name={name}
                handleExit={() => navigate("/user/transfer")}
                receiver={data.receiver}
            />
        </Container>
    );
};

export default VideoChat;