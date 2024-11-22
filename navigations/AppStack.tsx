import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DashboardScreen from '../screens/DashboardScreen';
import AccountDetailsScreen from '../screens/AccountDetailsScreen';
import QRScanner from '../screens/QrScannerScreen';
import BioMetricScreen from '../screens/BioMetricScreen';

const Stack = createNativeStackNavigator();

const AppStack = ({
  setIsAuthenticated,
  setIsBioMetricAuthenticated,
  isBioMetricAuthenticated,
}) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!isBioMetricAuthenticated ? (
        <Stack.Screen name="BioMetricScreen">
          {props => (
            <BioMetricScreen
              {...props}
              setIsBioMetricAuthenticated={setIsBioMetricAuthenticated}
            />
          )}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Dashboard">
            {props => (
              <DashboardScreen
                {...props}
                setIsAuthenticated={setIsAuthenticated}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="AccountDetails">
            {props => <AccountDetailsScreen {...props} />}
          </Stack.Screen>
          <Stack.Screen name="QRScanner">
            {props => <QRScanner {...props} />}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppStack;
