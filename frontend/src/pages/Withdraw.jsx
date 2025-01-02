import {useLocation} from "react-router-dom";
import {useState} from "react";

import Axios from "../utils/Axios.js";
import {useGlobal} from "../components/GlobalProvider.jsx";
import NavBar from "../components/NavBar.jsx";

const Withdraw = () => {

    const {setBalance} = useGlobal();
    const { state } = useLocation();
    const [amount, setAmount] = useState(0);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleWithdraw = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        console.log("amount type: " + typeof amount);
        await Axios.post("http://localhost:8000/api/account/transaction/withdraw", {amount: parseInt(amount)})
            .then((response) => {
                setBalance(response.data.current_balance);
                setMessage("Withdraw success");
            }).catch((err) =>{
                if(err.status === 402){
                    setMessage("dont have enough money to withdraw");
                }
                else{
                    setMessage("An error occurred. Please try again later.");
                    console.log(err.message);
                }

            })

        setIsLoading(false);

    }

    return (
        <div>
            <NavBar user_info={state} />
            <h2>Withdraw</h2>
            <form onSubmit={handleWithdraw}>
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

                <button type="submit" disabled={isLoading}>{isLoading ? "Processing..." : "Withdraw"}</button>
            </form>
            {message && (
                <p>{message}</p>
            )}
        </div>
    )
}

export default Withdraw;