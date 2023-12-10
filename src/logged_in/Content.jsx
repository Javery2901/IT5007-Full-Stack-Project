import SharedwithMe from './SharedwithMe';
import Dashboard from './Dashboard';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SecondNavbar from './SecondNavbar';
import "../styles/content.css";

function Content( { user, setUser } ) {
    return (
        <div className="custom-wrapper">
            <SecondNavbar setUser={setUser} />
            <Routes>
                <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
                <Route path="/shared" element={<SharedwithMe user={user} setUser={setUser} />} />
            </Routes>
        </div>
    );
}

export default Content;