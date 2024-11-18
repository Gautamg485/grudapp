import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

const AuthStack = ({setIsAuthenticated}) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login">
        {props => (
          <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthStack;
