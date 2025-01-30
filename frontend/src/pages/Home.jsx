import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Stack, CircularProgress, Box, Typography} from '@mui/material';

import {useGlobal} from "../components/GlobalProvider.jsx";
import {formatTimestamp} from "../utils/TimeOperation.js";
import LineChart from "../components/charts/LineChart.jsx";
import Axios from "../utils/Axios.js";
import BalanceCard from "../components/BalanceCard.jsx";
import PieChart from "../components/charts/PieChart.jsx";
import BarChart from "../components/charts/BarChart.jsx";

const Home = () => {

    const navigate = useNavigate();
    const {account, balance, baseUrl, isTransactionsChanged, setTransactions, transactions}  = useGlobal();
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

                    isTransactionsChanged.current = false;
                }).catch((err) =>{
                    if(err.status === 401){ // authentication failed and should be exited to login page
                        alert("Navigate to login screen duo to inactive account");
                        sessionStorage.removeItem("token");
                        sessionStorage.removeItem("account");
                        sessionStorage.removeItem("balance");
                        navigate("/login");
                    }
                    else{
                        setMessage("An error occurred. Please try again later.");
                    }
                });
            setIsLoading(false);
        }
        if(isTransactionsChanged.current){
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
                          <Box sx={{
                              width: "20rem",
                              backgroundColor: "rgba(255, 255, 255, 0.8)",
                              marginTop: 2,
                              paddingBottom: 1
                          }}>
                              {transactions !== null && transactions.length > 0 ?
                                  <PieChart transactions={transactions} email={account.email}/>
                                  : <p>No transactions found</p>
                              }
                          </Box>
                          <Box sx={{
                              width: "35rem",
                              backgroundColor: "rgba(255, 255, 255, 0.8)",
                              marginTop: 2,
                              paddingBottom: 1,
                              marginLeft: "2rem",
                          }}>
                          {transactions !== null && transactions.length > 0 ?
                              <BarChart transactions={transactions} email={account.email}/>
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