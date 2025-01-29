import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Stack, CircularProgress, Box, Typography} from '@mui/material';

import {useGlobal} from "../components/GlobalProvider.jsx";
import {formatTimestamp} from "../utils/TimeOperation.js";
import LineChart from "../components/charts/LineChart.jsx";
import Axios from "../utils/Axios.js";
import BalanceCard from "../components/BalanceCard.jsx";
import PieChart from "../components/charts/PieChart.jsx";

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
                        sessionStorage.removeItem("token");
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
      <>
          {isLoading ? (
              <CircularProgress />
          ) : (
                  <Box sx={{
                      margin: "1vh",

                  }}>
                      <Typography variant="h4" sx={{marginTop: '0.5rem', marginBottom: '1rem'}}>
                          Welcome {account.name}
                      </Typography>
                      <BalanceCard balance={balance}/>
                      <Stack direction="row">
                          <Box>
                              {transactions !== null && transactions.length > 0 ?
                                  <PieChart transactions={transactions} email={account.email}/>
                                  : <p>No transactions found</p>
                              }
                          </Box>
                      </Stack>


                        <Box>
                            {transactions !== null && transactions.length > 0 ?
                                <LineChart  transactions={transactions} email={account.email} title={"7 last days summary transactions"}/>
                                : <p>No transactions found</p>
                            }
                        </Box>



                      {message && <p style={{color: "red"}}>{message}</p>}

                  </Box>
              )}
      </>

  )
}

export default Home