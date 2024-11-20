import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './navigations/AuthStack';
import AppStack from './navigations/AppStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';
import {Alert} from 'react-native';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  useEffect(() => {
    const checkLoginStatus = async () => {
      if (isAuthenticated) {
        try {
          const rnBiometrics = new ReactNativeBiometrics();
          const {success, error} = await rnBiometrics.simplePrompt({
            promptMessage: 'Authenticate to continue',
          });

          if (success) {
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.error('[handleBiometricAuth] Error:', error);
          Alert.alert('Error', 'Biometric authentication failed from device');
          return false;
        }
      }
    };

    checkLoginStatus();
  }, [isAuthenticated]);

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
