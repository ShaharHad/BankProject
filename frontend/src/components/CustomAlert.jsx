import {Dialog, DialogContent, DialogContentText, DialogTitle, Slide} from "@mui/material"
import {forwardRef, useState} from "react";


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CustomAlert = (data) => {

    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
        data.onClose();
    };

    return (

            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{data.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {data.message}
                    </DialogContentText>
                </DialogContent>
            </Dialog>

    )

}

export default CustomAlert;