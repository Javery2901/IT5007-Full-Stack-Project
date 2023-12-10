import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function MainNavbar() {
  const location = useLocation();

  const loginBtnClass = location.pathname === '/login' ? 'btn btn-light mx-2' : 'btn btn-outline-light mx-2';
  const signupBtnClass = location.pathname === '/signup' ? 'btn btn-light mx-2' : 'btn btn-outline-light mx-2';

  return (
    <nav className="navbar navbar-expand">
      <div className="container-fluid">
        <div className="navbar-nav">
          <Link to="/login" className={loginBtnClass}>Log In</Link>
          <Link to="/signup" className={signupBtnClass}>Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}

export default MainNavbar;
