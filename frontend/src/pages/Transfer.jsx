import {useLocation} from "react-router-dom";
import {useState} from "react";

import Axios from "../utils/Axios.js";
import {useGlobal} from "../components/GlobalProvider.jsx";
import NavBar from "../components/NavBar.jsx";

const Transfer = () => {

    const {setBalance} = useGlobal();
    const { state } = useLocation();
    const [receiver, setReceiver] = useState("");
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleTransaction = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        await Axios.post("http://localhost:8000/api/account/transaction/payment",
            {amount: parseInt(amount), receiver: receiver}).then((response) => {
                setBalance(response.data.current_balance);
                setMessage("Payment transfer success");
            }).catch((err) =>{
                if(err.status === 402) {
                    setMessage("dont have enough money for transfer");
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
            <h2>Transfer</h2>
            <form onSubmit={handleTransaction}>
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

                <div className="form-group">
                    <label htmlFor="receiver">Receiver: </label>
                    <input
                        id="receiver"
                        type="text"
                        name="receiver"
                        value={receiver}
                        onChange={(e) => setReceiver(e.target.value)}
                        placeholder="Enter receiver"
                        required
                    />
                </div>

                <button type="submit" disabled={isLoading}>{isLoading ? "Processing..." : "Transfer"}</button>
            </form>
            {message && (
                <p>{message}</p>
            )}
        </div>
    )
}

export default Transfer;