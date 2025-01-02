import {AppBar, Toolbar, Typography, Button, Icon} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import {useNavigate} from "react-router-dom";

const NavBar = ({user_info}) => {

  const navigate = useNavigate();

  return (
      <div>
        <AppBar position="sticky">
          <Toolbar>
            <Icon
                sx={{mr: 2}}
            >
              <AccountBalanceIcon/>
            </Icon>
            <Typography variant="h5" sx={{flexGrow: 1}}>
              Bank
            </Typography>
            <Button
                color="inherit"
                onClick={() => navigate('/user/home', {state: user_info})}>
              Home
            </Button>
            <Button
                color="inherit"
                onClick={() => navigate('/user/deposit', {state: user_info})}>
              Deposit
            </Button>
            <Button
                color="inherit"
                onClick={() => navigate('/user/withdraw', {state: user_info})}>
              Withdraw
            </Button>
            <Button
                color="inherit"
                onClick={() => navigate('/user/transfer', {state: user_info})}>
              Transfer
            </Button>
            <Button
                color="inherit"
                onClick={() => navigate('/user/transactions', {state: user_info})}>
              Transactions
            </Button>
            <Button color="inherit" onClick={() => {
              navigate('/login');
              sessionStorage.removeItem("token");
            }}>Logout</Button>
          </Toolbar>
        </AppBar>

      </div>
  );
}

export default NavBar