import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate()


    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/auth/login', { email, password })
            .then(result => {
                if (result.data.status) {
                    navigate('/home');
                }
            })
            .catch(err => {
                console.log(err);
            });

    };

    return (
        <div className='sign-up-container'>
            <form className="sign-up-form" onSubmit={handleSubmit}>
                <h2>Login</h2>

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    autoComplete='off'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    placeholder="******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type='submit'>Login</button>
                <Link to="/forgotPassword">Forgot Password</Link>
                <p>Don't Have Account?
                    <Link to="/signup">Sign Up</Link></p>
            </form>
        </div>
    );
};

export default Login;
