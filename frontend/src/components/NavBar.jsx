//appBar component default color is blue (primary)
import {AppBar, Toolbar, Typography, Button, Icon, Container} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import {useNavigate} from "react-router-dom";


const NavBar = () => {

  const navigate = useNavigate();

  const token = sessionStorage.getItem('token');

  return (
      <Container maxWidth="false" disableGutters>
        <AppBar position="sticky">
          <Toolbar>
            <Icon
                sx={{mr: 2}}
            >
              <AccountBalanceIcon/>
            </Icon>
            <Typography variant="h5" sx={{flexGrow: 1}}>
              Shahar's bank
              <Typography sx={{flexGrow: 1}}>
                Because your money worth more
              </Typography>
            </Typography>

            {token !== null ? (
                <>
                    <Button
                        color="inherit"
                        onClick={() => navigate('/user/home')}>
                      Home
                    </Button>
                <Button
                    color="inherit"
                    onClick={() => navigate('/user/deposit')}>
                  Deposit
                </Button>
              <Button
              color="inherit"
              onClick={() => navigate('/user/withdraw')}>
            Withdraw
          </Button>
          <Button
              color="inherit"
              onClick={() => navigate('/user/transfer')}>
            Transfer
          </Button>
          <Button
              color="inherit"
              onClick={() => navigate('/user/transactions')}>
            Transactions
          </Button>
          <Button color="inherit" onClick={() => {
            navigate('/login');
            sessionStorage.removeItem("token");
          }}>Logout</Button>
                </>
              )
            : (
                <>
                  <Button
                      color="inherit"
                      onClick={() => navigate('/login')}>
                    Login
                  </Button>
                  <Button
                      color="inherit"
                      onClick={() => navigate('/register')}>
                    Register
                  </Button>
                </>
                )}

          </Toolbar>
        </AppBar>
      </Container>
  );
}

export default NavBar