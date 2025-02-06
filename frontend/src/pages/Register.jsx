import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios'


import {useGlobal} from "../components/GlobalProvider.jsx";
import {Box, Button, Container, TextField, Typography} from "@mui/material";

const Register = () => {

  const {baseUrl} = useGlobal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !phone) {
      setMessage("All fields are required!");
      return;
    }
      if(!/^\d{10}$/.test(phone)){
          setMessage("phone number have to be 10 digits!");
          return;
      }


      axios.post(baseUrl + "/auth/register", {
      email: email,
      password: password,
      phone: phone,
      name: name
    }).then((response) => {
      console.log(response);
      navigate("/login");
    }).catch((err) =>{
        setMessage(err.response.data.message);
    });
  }

  return (
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
              backgroundColor: "rgba(242,249,255, 0.9)",
              padding: 3,
              borderRadius: 2,
              boxShadow: 3,
            }}
        >
          <Typography variant="h4" gutterBottom>
            Register
          </Typography>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>

            <TextField
                data-test="name"
                label="Name"
                variant="outlined"
                fullWidth
                required
                tyoe="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
            />

            <TextField
                data-test="email"
                name="email"
                label="Email"
                variant="outlined"
                fullWidth
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
            />

            <TextField
                data-test="password"
                label="Password"
                variant="outlined"
                fullWidth
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
            />

            <TextField
                data-test="phone"
                label="Phone"
                variant="outlined"
                fullWidth
                required
                type="text"
                value={phone}
                margin="normal"
                placeholder="0509999999"
                onChange={(e) => setPhone(e.target.value)}
                />


            {message && (
                <Typography variant="body2" color="error" align="center" sx={{ marginTop: 1 }}>
                  {message}
                </Typography>
            )}

            <Button
                data-test="submit"
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, textTransform: "none" }}
            >
              Register
            </Button>
          </form>

          <Box mt={2}>
            <Typography variant="body3" align="center">
              Don't have an account?
              <Link to="/login" style={{ textDecoration: 'none', color: '#007bff' }}>
                Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
  );
};


export default Register