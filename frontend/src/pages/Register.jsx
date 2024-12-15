import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios'

const Register = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !phone) {
      alert("All fields are required!");
      return;
    }
    
    axios.post("http://localhost:8000/auth/register", {
      email: email,
      password: password,
      phone: phone,
      name: name
    }).then((response) => {
      console.log(response);
      navigate("/login");
    }).catch((err) =>{
      console.log(err.message);
    });
  }

  return (
    <div>
    <h1>Register</h1>
    <form className="form" onSubmit={handleSubmit}>
    <div>
        <label htmlFor="name">Name</label>
        <input type="name" id="name" placeholder="Insert name" name="name"
          onChange={(e) => setName(e.target.value)}/>
      </div>
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
      <div>
        <label htmlFor="phone">Phone number</label>
        <input type="text" id="phone" placeholder="Insert phone number" name="phone"
          onChange={(e) => setPhone(e.target.value)}/>
      </div>

      <button type='submit'>Register</button>
      
    </form>
    <div>
        <span>Already have an account? </span>
        <Link to={'/login'}>Login</Link>
      </div>
  </div>
  )
}

export default Register