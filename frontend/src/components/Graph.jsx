import {Line} from "react-chartjs-2"
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from "chart.js";
import {useState} from "react";

import {formatTimestamp} from "../utils/TimeOperation.js"
import {useGlobal} from "./GlobalProvider.jsx";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend); // for render

const Graph = (data) => {

    const {balance} = useGlobal();

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    const visibleData = 7;
    const [currentIndex, setCurrentIndex] = useState(0);
    const transactions = data.transactions;
    let sum = Number(balance);
    let y = [];
    let x = [];

    y.push(Number(balance));
    x.push(formatTimestamp(Math.floor(Date.now() / 1000)));

    transactions.forEach((transaction) => {
        if(transaction.type === "withdraw" || (transaction.type === "transfer" && transaction.sender === data.email)) {
            sum += transaction.payment;
        }
        else{
            sum -= transaction.payment;
        }
        y.push(sum);

        x.push(transaction.timestamp);
    });


    const getCurrentData = () =>{
        return {
            labels: x.slice(currentIndex, currentIndex + visibleData),
            datasets: [
                {
                    label: "Amount",
                    data: y.slice(currentIndex, currentIndex + visibleData),
                    borderColor: "rgb(75, 192, 192)",
                }
            ]
        }
    }

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - visibleData, 0));
    }

    const handleNext = () => {
        setCurrentIndex((prevIndex) => {
            return Math.min(prevIndex + visibleData, x.length - visibleData)
        });
    }

    return (
        <div>
            <div>
                <h2>{data.title}</h2>
            </div>
            <div>
                <Line options={options} data={getCurrentData()}></Line>
            </div>
            <div>
                <button onClick={handlePrevious} disabled={currentIndex === 0}>Previous</button>
                <button onClick={handleNext} disabled={currentIndex + visibleData >= x.length}>Next</button>
            </div>
        </div>
    );
}

export default Graph;