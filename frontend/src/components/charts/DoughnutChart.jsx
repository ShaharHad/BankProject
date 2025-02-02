import {Doughnut} from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const doughnutChart = (data) => {

    let labels = ["deposit $", "withdraw $", "transfer (income $)", "transfer (expense $)"];
    let depositAmount = 0;
    let withdrawAmount = 0;
    let transferIncomeAmount = 0;
    let transferExpenseAmount = 0;

    data.transactions.forEach((transaction) => {

        if(transaction.type === "deposit") {
            depositAmount += transaction.payment;
        }
        else if(transaction.type === "withdraw") {
            withdrawAmount += transaction.payment;
        }
        else if(transaction.type === "transfer" && transaction.sender === data.email) {
            transferExpenseAmount += transaction.payment;
        }
        else{
            transferIncomeAmount += transaction.payment;
        }
    });

    const values = [depositAmount, withdrawAmount, transferIncomeAmount, transferExpenseAmount];

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

    const dataset = {
        labels: labels,
        datasets: [
            {
                label: "Money",
                data: values,
                backgroundColor: [
                    "rgba(75, 192, 192, 0.5)",
                    "rgba(255, 99, 132, 0.5)",
                    "rgba(230, 164, 255, 0.5)",
                    "rgba(230, 164, 0, 0.5)",
                ],
                borderColor: [
                    "rgba(75, 192, 192, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(255, 255, 255, 1)",
                    "rgba(230, 164, 0, 1)",
                ],
                borderWidth: 1,
            },
        ],
    }

    return (
        <Doughnut data={dataset} options={options} />
    );
}

export default doughnutChart;