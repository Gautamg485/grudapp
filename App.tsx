import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './navigations/AuthStack';
import AppStack from './navigations/AppStack';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulate checking authentication (e.g., token verification)
  useEffect(() => {
    const checkAuth = async () => {
      // const token = await getAuthToken(); // Replace with secure token retrieval
      // setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AppStack setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <AuthStack setIsAuthenticated={setIsAuthenticated} />
      )}
    </NavigationContainer>
  );
};

export default App;
