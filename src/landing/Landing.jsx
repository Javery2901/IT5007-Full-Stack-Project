import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../images/background1.png';
import "../styles/Landing.css";


function Landing() {
    const navigate = useNavigate();
    const navigateToLogin = () => {
        navigate('/login');
    };
    const navigateToSignup = () => {
        navigate('/signup');
    };

    return (
        <div id="logo-buttons-container">
            <div className="container-fluid position-relative">
                <h1 className="mb-4 text-white">Helia Decentralized File Storage & Sharing</h1>
                <button onClick={navigateToLogin} className="btn btn-light btn-lg mx-2">Log In</button>
                <button onClick={navigateToSignup} className="btn btn-outline-light btn-lg mx-2">Sign Up</button>
            </div>
        </div>
    );
}

export default Landing; 