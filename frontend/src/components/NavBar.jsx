import {AppBar, Toolbar, Typography, Button, Icon} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import {useNavigate} from "react-router-dom";

const NavBar = ({user_info}) => {

  console.log('user_info', user_info);

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
            <Typography variant="h6" sx={{flexGrow: 1}}>
              Bank
            </Typography>
            <Button
                color="inherit"
                onClick={() => navigate('/user/home', {state: user_info})}>
              Home
            </Button>
            <Button color="inherit" onClick={() => navigate('/login')}>Logout</Button>
          </Toolbar>
        </AppBar>

      </div>
  );
}

export default NavBar