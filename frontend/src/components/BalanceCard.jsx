import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Typography} from "@mui/material";

const BalanceCard = ({balance}) => {

    return (
        <Card sx={{
            width: 1/4,
            backgroundColor: "transparent",
            boxShadow: 5
        }}>
            <CardContent>
                <Typography gutterBottom sx={{ color: '#000000', fontSize: 18 }}>
                    Balance
                </Typography>
                <Typography gutterBottom sx={{ fontSize: 16 }}>
                    {balance}
                </Typography>
            </CardContent>
        </Card>
    )
}




export default BalanceCard;