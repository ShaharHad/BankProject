import {useLocation} from "react-router-dom";
import {useState} from "react";

import NavBar from "../components/NavBar.jsx";
import Axios from "../utils/Axios.js";
import {useGlobal} from "../components/GlobalProvider.jsx";


const Deposit = () => {

    const {setBalance, baseUrl} = useGlobal();
    const { state } = useLocation();
    const [amount, setAmount] = useState(0);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    console.log("base url: " + baseUrl);

    const handleDeposit = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        await Axios.post( baseUrl + "/account/transaction/deposit", {amount: parseInt(amount)})
            .then((response) => {
                setBalance(response.data.current_balance);
                setMessage("Deposit success");
        }).catch((err) =>{
            if(err.status !== 500) {
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
        <div>
            <NavBar user_info={state} />
            <h2>Deposit</h2>
            <form onSubmit={handleDeposit}>
                <div className="form-group">
                    <label htmlFor="amount">Amount: </label>
                    <input
                        id="amount"
                        type="number"
                        name="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        required
                    />
                </div>

                <button type="submit" disabled={isLoading}>{isLoading ? "Processing..." : "Deposit"}</button>
            </form>
            {message && (
                <p>{message}</p>
            )}
        </div>
    )
}

export default Deposit;