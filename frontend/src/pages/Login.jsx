import { useState} from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from 'axios'
import {useGlobal} from "../components/GlobalProvider.jsx";

axios.defaults.withCredentials = true;

const Login = () => {

  const {setBalance, baseUrl} = useGlobal();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("All fields are required!");
      return;
    }

    await axios.post(baseUrl + "/auth/login", {
      email: email,
      password: password
    }).then((response) => {

      setBalance(response.data.balance);
      sessionStorage.setItem("token", response.data.token);
      navigate("/user/home", {state: response.data});
    }).catch((err) =>{
      alert("Login failed");
      console.log(err.message);
    })
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Insert email" name="email"
            onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Insert password" name="password"
            onChange={(e) => setPassword(e.target.value)}/>
        </div>

        <button type="submit">Login</button>

      </form>
      <div>
        <span>Don't have an account? </span>
        <Link to={"/register"}>Register</Link>
      </div>
    </div>
  )
}

export default Login