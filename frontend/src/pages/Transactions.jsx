import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import Stack from '@mui/material/Stack';

import {useGlobal} from "../components/GlobalProvider.jsx";
import NavBar from "../components/NavBar";
import Axios from "../utils/Axios.js";
import CustomTable from "../components/CustomTable.jsx";
import BalanceCard from "../components/BalanceCard.jsx";


const Transactions = () => {

    const {balance, baseUrl} = useGlobal();
    const [transactions, setTransactions] = useState([]);
    const [columns, setColumns] = useState([]);
    const {state} = useLocation();
    let headers;



    useEffect(() => {
        const fetchTransactions= async () => {

            await Axios.get(baseUrl + "/account/transaction")
                .then((response) => {

                    setTransactions(response.data.map((transaction) => {
                        transaction.timestamp = new Date(transaction.timestamp * 1000).toISOString()
                            .slice(0, 19).replace('T', ' '); // format date
                        return transaction;
                    }));
                    // setTransactions(response.data);
                    headers = Object.keys(response.data[0]);
                    headers = headers.map((header) => {
                        return {
                            key: header,
                            header: header.charAt(0).toUpperCase() + header.slice(1),
                        }
                    });
                    setColumns(headers);
                }).catch((err) =>{
                    console.error("Error: " + err.message);
                });
        }
        fetchTransactions();
    }, []);


    return (
        <div>
            <NavBar user_info={state} />
            <Stack>
                <h1>Balance</h1>
                <BalanceCard balance={balance}/>
                <h1>Transactions</h1>
                <CustomTable columns={columns} data={transactions}></CustomTable>
            </Stack>

        </div>
    )
}

export default Transactions