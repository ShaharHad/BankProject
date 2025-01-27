import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Stack, CircularProgress, Container, Typography} from '@mui/material';

import {useGlobal} from "../components/GlobalProvider.jsx";
import {formatTimestamp} from "../utils/TimeOperation.js";
import Axios from "../utils/Axios.js";
import CustomTable from "../components/CustomTable.jsx";


const generateHeaders = (data) =>
    Object.keys(data[0] || {}).map((header) => ({
        key: header,
        header: header.charAt(0).toUpperCase() + header.slice(1),
    }));

const Transactions = () => {

    const navigate = useNavigate();
    const {baseUrl, transactions, setTransactions, isTransactionsChanged, setIsTransactionsChanged} = useGlobal();
    const [isLoading, setIsLoading] = useState(false);



    useEffect(() => {
        const fetchTransactions= async () => {
            setIsLoading(true);
            await Axios.get(baseUrl + "/account/transaction")
                .then((response) => {
                    response.data.sort((a,b) => b.timestamp - a.timestamp);
                    setTransactions(response.data.map((transaction) => {
                        transaction.timestamp = formatTimestamp(transaction.timestamp);
                        return transaction;
                    }));
                    setIsTransactionsChanged(false);
                }).catch((err) =>{
                    if(err.status === 401){ // authentication failed and should be exit to login
                        alert("Navigate to login screen duo to inactive account");
                        sessionStorage.removeItem("token");
                        navigate("/login");
                    }
                    console.error("Error: " + err.message);
                });
            setIsLoading(false);
        }
        if(isTransactionsChanged){
            fetchTransactions();
        }
    }, [transactions]);

    const columns = generateHeaders(transactions);


    return (
        <Container sx={{
            margin: "center",
        }}>
            {
                isLoading ? (
                    <CircularProgress />
                ) : (
                    <Stack >
                        <Typography variant="h4" sx={{marginTop: '3rem', marginBottom: '2rem'}}>
                            Transactions
                        </Typography>
                        {transactions !== null && transactions.length > 0 ?
                            <CustomTable columns={columns} data={transactions}></CustomTable>
                            : <p>No transactions found</p>
                        }
                    </Stack>
                )
            }
        </Container>
    )
}

export default Transactions