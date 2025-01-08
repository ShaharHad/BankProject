import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Stack, CircularProgress, Box} from '@mui/material';

import {useGlobal} from "../components/GlobalProvider.jsx";
import {formatTimestamp} from "../utils/TimeOperation.js";
import NavBar from "../components/NavBar";
import Graph from "../components/Graph.jsx";
import Axios from "../utils/Axios.js";
import BalanceCard from "../components/BalanceCard.jsx";

const Home = () => {

    const navigate = useNavigate();
    const {account, balance, baseUrl, setIsTransactionsChanged, isTransactionsChanged, setTransactions, transactions}  = useGlobal();
    const [message, setMessage] = useState("");
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
                    if(err.status === 401){ // authentication failed and should be exited to login page
                        alert("Navigate to login screen duo to inactive account");
                        navigate("/login");
                    }
                    else{
                        setMessage("An error occurred. Please try again later.");
                    }
                });
            setIsLoading(false);
        }
        if(isTransactionsChanged){
            fetchTransactions();
        }
    }, [transactions]);

  return (
      <div>
          <NavBar/>
          {isLoading ? (
              <CircularProgress />
          ) : (
                  <Box sx={{
                      backgroundColor: "#90d5ff",
                  }}>
                      <h1>Welcome {account.name}</h1>
                      <Stack>
                          <BalanceCard balance={balance}/>
                          {transactions !== null && transactions.length > 0 ?
                              <Graph transactions={transactions} email={account.email} title={"7 last days summary transactions"}/>
                              : <p>No transactions found</p>
                          }
                      </Stack>
                      {message && <p style={{color: "red"}}>{message}</p>}

                  </Box>
              )}
      </div>

  )
}

export default Home