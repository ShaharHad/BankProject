import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Button, Typography} from "@mui/material";
import DraftsTwoToneIcon from '@mui/icons-material/DraftsTwoTone';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';

const Message = (data)=>{
    return (
        <Card sx={{
            maxWidth: "40vw",
            borderLeft: data.isRead ? "5px solid green" : "5px solid yellow",
            backgroundColor: "rgba(242,249,255, 0.9)",}}
        >
            <CardContent>
                {
                    data.isRead ? (
                        <DraftsTwoToneIcon fontSize="large"></DraftsTwoToneIcon>
                    ):(
                        <EmailTwoToneIcon fontSize="large"></EmailTwoToneIcon>
                    )
                }
                <Typography variant="subtitle2" color="text.secondary">
                    ID: {data._id}
                </Typography>
                <Typography variant="body1" >
                    {data.message}

                </Typography>
                <Button disabled={!!data.isRead} onClick={() => data.onRead(data._id)}>
                    {!data.isRead ? "Read" : false}
                </Button>
            </CardContent>

        </Card>
    )
}

export default Message;