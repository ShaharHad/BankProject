import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
    Typography
} from "@mui/material"
import {forwardRef, useState} from "react";


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const RequestVideoChatDialog = (data) => {

    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
        data.onClose();
    };

    const handleYesButton = () => {
        data.handleYesButton();
    };

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>
                <Typography variant="h4" >Request Video Chat</Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {"Do you want to do video chat with the recipient ?"}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleYesButton}
                    color="primary"
                    variant="contained"
                    sx={{mr: 10}}
                >
                    Yes
                </Button>
                <Button
                    onClick={handleClose}
                    color="secondary"
                    variant="contained"
                    sx={{mr: 8}}
                >
                    No
                </Button>
            </DialogActions>

        </Dialog>

    )

}

export default RequestVideoChatDialog;