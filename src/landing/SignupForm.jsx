import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { graphQLFetch } from '../utils/GraphQLFetch';
import { sendEmail } from '../utils/utils'; 
import { ADD_USER } from "../gql/mutations";
import "../styles/Landing.css";

function SignupForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangeEmail = (e) => {
        setEmail(e.target.value)
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleChangeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
          alert('Passwords do not match.');
          return;
        }
    
        const userData = { email, password };
        const userSignupContent = 'user_signup';
        const sendEmailData = { email: email, content: userSignupContent };
    
        try {
            const data = await graphQLFetch(ADD_USER, userData);
            if (data) {
                const result = await sendEmail(sendEmailData);
                if (result.success) {
                confirm('please check your email to verify your account.');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                navigate('/login'); // Navigate to login page or any other page
                } else {
                alert("Failed to send email");
                }
            }
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    return (
        <div id="signup-page">
            <div id="signup-div">
                <div className="col-xl-auto">
                    <form onSubmit={handleSubmit} className="card-body">
                    <h2 className="card-title text-center text-light mb-4">Sign Up</h2>
                        <div className="mb-3">
                            <input
                                className="form-control"
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={handleChangeEmail}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                className="form-control"
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={handleChangePassword}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                className="form-control"
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={handleChangeConfirmPassword}
                                required
                            />
                        </div>
                        {
                            password !== confirmPassword &&
                            confirmPassword &&
                            <div style={{ color: 'red' }}>Passwords do not match.</div>
                        }
                        <div className="d-grid">
                            <button type="submit" className="btn btn-secondary btn-lg">Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
    );
}

export default SignupForm;