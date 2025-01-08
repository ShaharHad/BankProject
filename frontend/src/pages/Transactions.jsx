import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Stack, CircularProgress} from '@mui/material';

import {useGlobal} from "../components/GlobalProvider.jsx";
import {formatTimestamp} from "../utils/TimeOperation.js";
import NavBar from "../components/NavBar";
import Axios from "../utils/Axios.js";
import CustomTable from "../components/CustomTable.jsx";
import BalanceCard from "../components/BalanceCard.jsx";


const generateHeaders = (data) =>
    Object.keys(data[0] || {}).map((header) => ({
        key: header,
        header: header.charAt(0).toUpperCase() + header.slice(1),
    }));

const Transactions = () => {

    const navigate = useNavigate();
    const {balance, baseUrl, transactions, setTransactions, isTransactionsChanged, setIsTransactionsChanged} = useGlobal();
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
        <div>
            <NavBar />
            {
                isLoading ? (
                    <CircularProgress />
                ) : (
                    <Stack>
                        <h1>Balance</h1>
                        <BalanceCard balance={balance}/>
                        <h1>Transactions</h1>
                        {transactions !== null && transactions.length > 0 ?
                            <CustomTable columns={columns} data={transactions}></CustomTable>
                            : <p>No transactions found</p>
                        }
                    </Stack>
                )
            }
        </div>
    )
}

export default Transactions