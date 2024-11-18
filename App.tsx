import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './navigations/AuthStack';
import AppStack from './navigations/AppStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

const handleBiometricAuthentication = async () => {
    try {
      const rnBiometrics = new ReactNativeBiometrics();

      const result = await rnBiometrics.createSignature({
        promptMessage: 'Please Authenticate to Gowtham App',
        payload: 'your_payload_data', // Replace with your desired payload
      });

      if (result.success) {
        console.log('Signature:', result.signature);
        return result.signature;
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error);
    }
  };
  // Simulate checking authentication (e.g., token verification)
  useEffect(() => {
     const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token !== null) {
        setIsAuthenticated(true);  // User is logged in
      } else {
        setIsAuthenticated(false);  // User is not logged in
      }
    };

    checkLoginStatus();
  }, []);

   useEffect(() => {
     const checkLoginStatus = async () => {
         if (isAuthenticated){
             const bioMetricSignature = await AsyncStorage.getItem('bioMetricSignature');
             const signature = await handleBiometricAuthentication();

             let bioMetricSignatureStatus = true;
             if (bioMetricSignature!==null) {
                 if (signature !== bioMetricSignature)
                    setIsAuthenticated(false);
             } else {
                await AsyncStorage.setItem('bioMetricSignature', signature);
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
