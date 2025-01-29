import {Pie} from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box } from "@mui/material";


ChartJS.register(ArcElement, Tooltip, Legend);

const pieChart = (data) => {

    let labels = ["Income", "Expenses"];
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

    const values = [income, expense];


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
                ],
                borderColor: [
                    "rgba(75, 192, 192, 1)",
                    "rgba(255, 99, 132, 1)",
                ],
                borderWidth: 1,
            },
        ],

        borderWidth: 1,
    }


    return (
        <Box sx={{width: "15rem", backgroundColor: "rgba(255, 255, 255, 0.8)", marginTop: 2, paddingBottom: 1}}>

            <Pie data={dataset} options={options} />
        </Box>
    );
}

export default pieChart;