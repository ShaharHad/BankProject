import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Container } from '@mui/material';

import axios from 'axios';
import { useGlobal } from "../components/GlobalProvider.jsx";




axios.defaults.withCredentials = true;

const Login = () => {
  const { setBalance, baseUrl, account } = useGlobal();

    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("All fields are required!");
      return;
    }

    await axios.post(baseUrl + "/auth/login", {
      email: email,
      password: password
    }).then((response) => {
      setBalance(response.data.balance);
      sessionStorage.setItem("balance", response.data.balance);
      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("account", JSON.stringify(response.data.account));
      account.current = response.data.account;
      navigate("/user/home");
    }).catch((err) => {
      if (err.response && (err.response.status === 400 || err.response.status === 404)) {
        setMessage("Password or Email incorrect");
      } else {
        setMessage("An error occurred. Please try again later.");
      }
    })
  };

  return (
      <div style={{
          backgroundImage: "url('../assets/bank_image.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",

      }}>

      <Container
          component="main"
          maxWidth="xs"
          sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80vh',

          }}
      >
          <Box
              sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  padding: 3,
                  borderRadius: 2,
                  boxShadow: 3,
              }}
          >
              <Typography variant="h4" gutterBottom>
                  Login
              </Typography>
              <form onSubmit={handleSubmit} style={{ width: '100%' }}>

                  <TextField
                      label="Email"
                      variant="outlined"
                      fullWidth
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      margin="normal"
                  />

                  <TextField
                      label="Password"
                      variant="outlined"
                      fullWidth
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      margin="normal"
                  />


                  {message && (
                      <Typography variant="body2" color="error" align="center" sx={{ marginTop: 1 }}>
                          {message}
                      </Typography>
                  )}

                  <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 2, textTransform: "none" }}
                  >
                      Login
                  </Button>
              </form>

              <Box mt={2}>
                  <Typography variant="body3" align="center">
                      Don't have an account?{' '}
                      <Link to="/register" style={{ textDecoration: 'none', color: '#007bff' }}>
                          Register
                      </Link>
                  </Typography>
              </Box>
          </Box>
      </Container>
      </div>

  );
};

export default Login;

