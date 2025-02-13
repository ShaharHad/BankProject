import JitsiMeetComponent from "../components/JitsiVideo.jsx";
import {Container, Typography} from "@mui/material";
import {useGlobal} from "../components/GlobalProvider.jsx";

const VideoChat = () => {

    const { account } = useGlobal();
    const email = account.email;

    return (
        <Container>
            <Typography variant="h3" >Banking Secure Video Chat</Typography>
            <JitsiMeetComponent email={email} />
        </Container>
    );
};

export default VideoChat;