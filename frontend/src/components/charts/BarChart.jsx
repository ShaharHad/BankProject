import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = (data) => {

    let income = 0;
    let expense = 0;

    data.transactions.forEach((transaction) => {
        if(transaction.type === "withdraw" || (transaction.type === "transfer" && transaction.sender === data.email)) {
            expense += transaction.payment;
        }
        else{
            income += transaction.payment;
        }
    });

    const chartData = {
        labels: ["Money"],
        datasets: [
            {
                label: "Income ($)",
                data: [income],
                backgroundColor: [
                    "rgba(75, 192, 192, 0.5)",
                ],
                borderColor: [
                    "rgba(75, 192, 192, 1)",
                ],
                borderWidth: 1,
            },
            {
                label: "Expense ($)",
                data: [expense],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.5)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                ],
                borderWidth: 1,
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                enabled: true,
            },
        },
    };


    return <Bar data={chartData} options={options} />;
};

export default BarChart;
