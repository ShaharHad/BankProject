import {Pie} from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const pieChart = (data) => {

    let labels = ["deposit", "withdraw", "transfer"];
    let deposit = 0;
    let withdraw = 0;
    let transfer = 0;

    data.transactions.forEach((transaction) => {
        if(transaction.type === "transfer") {
            ++transfer;
        }
        else if(transaction.type === "deposit") {
            ++deposit;
        }
        else{
            ++withdraw;
        }
    });

    const values = [deposit, withdraw, transfer];

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                enabled: true,
            },
        },
    };

    const dataset = {
        labels: labels,
        datasets: [
            {
                label: "Money",
                data: values,
                backgroundColor: [
                    "rgba(75, 192, 192, 0.5)",
                    "rgba(255, 99, 132, 0.5)",
                    "rgba(255, 255, 132, 0.5)",
                ],
                borderColor: [
                    "rgba(75, 192, 192, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(255, 255, 132, 1)",
                ],
                borderWidth: 1,
                hoverOffset: 4
            },
        ],

        borderWidth: 1,
    }

    return (
        <Pie data={dataset} options={options} />
    );
}

export default pieChart;