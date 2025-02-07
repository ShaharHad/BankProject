import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Typography} from "@mui/material";

const BalanceCard = (data) => {

    const balance = data.balance;

    return (
        <Card sx={{
            width: 1/4,
            backgroundColor: "rgba(242,249,255, 0.9)",
            boxShadow: 5
        }}>
            <CardContent>
                <Typography gutterBottom sx={{color: "#1976d2", fontSize: 20 }}>
                    Current Balance
                </Typography>
                <Typography gutterBottom sx={{ fontSize: 16 }}>
                    {balance + " $"}
                </Typography>
            </CardContent>
        </Card>
    )
}


export default BalanceCard;