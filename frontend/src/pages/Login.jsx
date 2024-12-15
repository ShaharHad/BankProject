import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'

axios.defaults.withCredentials = true;

const Login = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("All fields are required!");
      return;
    }

    await axios.post("http://localhost:8000/auth/login", {
      email: email,
      password: password
    }).then((response) => {
      navigate("/user/home", {state: response.data});
    }).catch((err) =>{
      console.log(err.message);
    })
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="text" id="email" placeholder="Insert email" name="email" 
            onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="text" id="password" placeholder="Insert password" name="password" 
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