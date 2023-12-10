import SignupForm from './SignupForm'; 
import LoginForm from './LoginForm'; 
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainNavbar from './MainNavbar';
import "../styles/Landing.css";

function Signlogin( { setUser } ) {
    return (
        <>
            <MainNavbar />
            <div className="container mt-4">
                <Routes>
                    <Route path="/login" element={<LoginForm setUser={setUser} />} />
                    <Route path="/signup" element={<SignupForm setUser={setUser} />} />
                </Routes>
            </div>
        </>
    );
}

export default Signlogin;