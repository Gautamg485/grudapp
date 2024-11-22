import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './navigations/AuthStack';
import AppStack from './navigations/AppStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';
import {Alert} from 'react-native';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBioMetricAuthenticated, setIsBioMetricAuthenticated] =
    useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token !== null) {
        setIsAuthenticated(true); // User is logged in
      } else {
        setIsAuthenticated(false); // User is not logged in
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AppStack
          setIsAuthenticated={setIsAuthenticated}
          isAuthenticated={isAuthenticated}
          setIsBioMetricAuthenticated={setIsBioMetricAuthenticated}
          isBioMetricAuthenticated={isBioMetricAuthenticated}
        />
      ) : (
        <AuthStack setIsAuthenticated={setIsAuthenticated} />
      )}
    </NavigationContainer>
  );
};

export default App;
