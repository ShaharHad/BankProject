import {useNavigate} from "react-router-dom";
import {useState} from "react";

import NavBar from "../components/NavBar.jsx";
import Axios from "../utils/Axios.js";
import {useGlobal} from "../components/GlobalProvider.jsx";
import {Box, Button, Container, TextField, Typography} from "@mui/material";


const Deposit = () => {

    const navigate = useNavigate();
    const {baseUrl, setIsTransactionsChanged, setNewBalance} = useGlobal();
    const [amount, setAmount] = useState(0);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);


    const handleDeposit = async (e) => {
        e.preventDefault();


        if(!/^\d{1,6}$/.test(amount)){
            setIsError(true);
            setMessage("amount should be greater then 0 and smaller then 1000000");
            return;
        }

        setIsLoading(true);
        console.log("amount: ", amount);
        await Axios.post( baseUrl + "/account/transaction/deposit", {amount: parseInt(amount)})
            .then((response) => {
                setNewBalance(response.data.current_balance);
                setIsError(false);
                setMessage("Deposit success");
                setIsTransactionsChanged(true);
        }).catch((err) =>{
            setIsError(true);
            if(err.status === 401){ // authentication failed and should be exit to login
                alert("Navigate to login screen duo to inactive account");
                navigate("/login");
            }
            else if(err.status === 402){ // authentication failed and should be exit to login
                setMessage(err.response.data.message);
            }
            else if(err.status !== 500) {
                setMessage(err.message);
            }
            else{
                setMessage("An error occurred. Please try again later.");
                console.log(err.message);
            }
        });

        setIsLoading(false);

    }

    return (
        <>
            <NavBar />
            <Container
                component="main"
                maxWidth="false"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '80vh',

                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 3,
                        borderRadius: 2,
                        boxShadow: 3,
                        width: '20%',
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Deposit
                    </Typography>
                    <form onSubmit={handleDeposit} style={{ width: '100%' }}>

                        <TextField
                            label="Amount"
                            variant="outlined"
                            fullWidth
                            required
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            margin="normal"

                        />

                        {message && (
                            <Typography variant="body2"
                                        color={isError ? "red" : "green"}
                                        align="center"

                            >
                                {message}
                            </Typography>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2, textTransform: "none", fontSize: "100%"}}
                            disabled={isLoading}
                        >
                            {isLoading ? "Processing..." : "Deposit"}
                        </Button>
                    </form>

                </Box>
            </Container>
        </>
    )
}

export default Deposit;