import { React, useState, createContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import FileList from "./logged_in/FileList";
import FileUploader from "./logged_in/FileUploader";
import { useHelia } from "./hooks/useHelia";
import { UploadType } from "./logged_in/FileUploader";
import FileProvider from "./provider/FileProvider";
import { graphQLFetch } from './utils/GraphQLFetch';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GET_USER } from './gql/queries';
import Landing from './landing/Landing';
import Signlogin from './landing/Signlogin';
import Content from './logged_in/Content';

export const UserContext = createContext();

function App() {
  const { error, starting } = useHelia();
  const [ user, setUser ] = useState();

  const verifyToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch('http://localhost:3001/api/token_example', {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
          }
        });
    
        const data = await response.json();
        if (data.success) {
          console.log('User email from token:', data.user_email);
          const u = await graphQLFetch(GET_USER, { email: data.user_email });
          setUser(u.getUser);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.log('Error verifying token:', error);      }
    }
  }

  useEffect(() => {
    verifyToken();
  }, []);
  
  useEffect(() => {
    document.body.classList.toggle('logged-in-background', !!user);

    return () => {
      document.body.classList.remove('logged-in-background');
    };
  }, [user]);
  return (
    <Router>
      <div>
        {user ? (
          <Routes>
            <Route path="/*" element={<Content user={user} setUser={setUser} />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/*" element={<Signlogin setUser={setUser} />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
