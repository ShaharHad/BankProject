import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import Stack from '@mui/material/Stack';

import {useGlobal} from "../components/GlobalProvider.jsx";
import NavBar from "../components/NavBar";
import Graph from "../components/Graph.jsx";
import Axios from "../utils/Axios.js";
import BalanceCard from "../components/BalanceCard.jsx";


const Home = () => {

    const {balance, baseUrl}  = useGlobal();
    const [transactions, setTransactions] = useState([]);
    const {state} = useLocation();


    useEffect(() => {
        const fetchTransactions= async () => {

            await Axios.get(baseUrl + "/account/transaction")
                .then((response) => {
                    setTransactions(response.data);
                }).catch((err) =>{
                console.error("Error: " + err.message);
            });
        }
        fetchTransactions();
    }, []);

  return (
      <div>
          <NavBar user_info={state} />
          <h1>Welcome {state.name}</h1>
          <Stack>
              <BalanceCard balance={balance}/>
              <Graph transactions={transactions} title={"7 days summary transactions"} />
          </Stack>

      </div>
  )
}

export default Home