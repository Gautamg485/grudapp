import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DashboardScreen from '../screens/DashboardScreen';
import AccountDetailsScreen from '../screens/AccountDetailsScreen';

const Stack = createNativeStackNavigator();

const AppStack = ({setIsAuthenticated}) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Dashboard">
        {props => (
          <DashboardScreen {...props} setIsAuthenticated={setIsAuthenticated} />
        )}
      </Stack.Screen>
      <Stack.Screen name="AccountDetails">
        {props => <AccountDetailsScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AppStack;
