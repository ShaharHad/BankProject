import {Line} from "react-chartjs-2"
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from "chart.js";
import {useState} from "react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend); // for render

const Graph = (data) => {

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    const visibleData = 7;
    const [currentIndex, setCurrentIndex] = useState(0);
    const transactions = data.transactions;
    let y = [];
    let x = [];
    let sum = 0;

    transactions.forEach((transaction) => {
        if(transaction.type === "withdraw" || (transaction.type === "transfer" && transaction.sender === data.email)) {
            sum -= transaction.payment;

        }
        else{
            sum += transaction.payment;
        }
        y.push(sum);

        const formattedDate = new Date(transaction.timestamp * 1000).toISOString()
            .slice(0, 19).replace('T', ' '); // format: "YYYY-MM-DD HH:MM:SS"

        x.push(formattedDate);
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