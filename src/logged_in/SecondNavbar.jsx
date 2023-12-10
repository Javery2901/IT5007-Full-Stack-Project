import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/content.css";
import { Link, useLocation } from 'react-router-dom';

function SecondNavbar( {setUser} ) {

  // log out button functions
  const navigate = useNavigate();

  const location = useLocation();
  const isCurrentPath = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="menu-panel">
      <div className="menu">
          <Link to="/shared" className={`snav-li ${isCurrentPath('/shared') ? 'selected' : ''}`} id="shared-files-tab">Shared With Me</Link>
          <Link to="/dashboard" className={`snav-li ${isCurrentPath('/dashboard') ? 'selected' : ''}`} id="local-files-tab">Dashboard</Link>
      </div>
      <div className="logout-container">
          <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </div>
  );
}

export default SecondNavbar;
