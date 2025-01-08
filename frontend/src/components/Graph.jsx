import {Line} from "react-chartjs-2"
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from "chart.js";
import {useState} from "react";
import Box from "@mui/material/Box";
import {Button, Container} from "@mui/material";


import {formatTimestamp} from "../utils/TimeOperation.js"
import {useGlobal} from "./GlobalProvider.jsx";


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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

    y.push(sum);
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
        setCurrentIndex((prevIndex) =>
            Math.min(prevIndex + visibleData, x.length - visibleData)
        );
    }
    

    return (
        <Container
            maxWidth="sx"
            disableGutters
        >
            <div>
                <h2>{data.title}</h2>
            </div>
            <Box
                sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 3,
                borderRadius: 2,
                margin: 1,
                minWidth: 650,
                boxShadow: 10
            }}>
                <Line
                    options={options}
                    data={getCurrentData()}
                >
                </Line>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 3,
                    borderRadius: 2,
                    margin: 1,
                    minWidth: 650,
                    boxShadow: 0
                }}
            >
                <Button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    type="button"
                    variant="contained"
                    color="primary"
                    sx={{margin: 2}}
                >
                    Previous
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={(currentIndex + visibleData) >= x.length}
                    type="button"
                    variant="contained"
                    color="primary"
                    sx={{margin: 2}}
                >
                    Next
                </Button>
            </Box>
        </Container>
    );
}

export default Graph;