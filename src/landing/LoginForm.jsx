import React, { useState } from 'react';
import { graphQLFetch } from '../utils/GraphQLFetch';
import { GET_USER } from "../gql/queries";
import { useNavigate } from 'react-router-dom';
import "../styles/Landing.css";

function LoginForm( {setUser} ) {
  
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const navigate = useNavigate();
  
    const handleChangeEmail = (e) => {
      setEmail(e.target.value)
    }
  
    const handleChangePassword = (e) => {
      setPassword(e.target.value)
    }
  
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const loginData = {
                email: email,
                password: password
            }
      
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                body: JSON.stringify(loginData),
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('token', data.token);
        
                try {
                    const data = await graphQLFetch(GET_USER, { email: email });
                    setUser(data.getUser);
                    navigate('/dashboard');
                } catch (error) {
                    console.error("Error fetching user:", error);
                }
                // can redirect as needed
            } else {
                alert(data.message);
            }
          } catch(error) {
            alert('Login error:', error);
          }
          
    };
  
    return (
        <div id="signup-page">
            <div id="signup-div">
                <div className="col-xl-auto">
                    <form onSubmit={handleSubmit} className="card-body">
                        <h2 className="card-title text-center text-light mb-4">Log In</h2>
                        <div className="mb-3">
                            <input
                            className="form-control"
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleChangeEmail}
                            placeholder="Email"
                            required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                            className="form-control"
                            type="password"
                            name="password"
                            value={password}
                            onChange={handleChangePassword}
                            placeholder="Password"
                            required
                            />
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-secondary btn-lg">Go to My Space</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
    );
  }

export default LoginForm;