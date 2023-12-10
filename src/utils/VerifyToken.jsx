// In your React component or a utility function
const verifyToken = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Handle the absence of a token (e.g., redirect to login)
      return;
    }
  
    try {
      const response = await fetch('/api/token_verification', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const data = await response.json();
      if (data.success) {
        // Token is valid - set user data, etc.
      } else {
        // Token is invalid - handle accordingly
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      // Handle errors (e.g., show a message or redirect to login)
    }
  };
  