import React, {useEffect, useReducer, useState} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {callApi} from '../utils/fetcher';

// Reducer to manage form state
const formReducer = (state: any, action: {type: any; payload: any}) => {
  switch (action.type) {
    case 'SET_USERNAME':
      return {...state, username: action.payload};
    case 'SET_PASSWORD':
      return {...state, password: action.payload};
    case 'SET_CNF_PASSWORD':
      return {...state, cnfpassword: action.payload};
    case 'SET_EMAIL':
      return {...state, emailId: action.payload};
    case 'SET_ERROR':
      return {...state, error: action.payload};
    default:
      return state;
  }
};

const RegisterScreen = ({navigation, setIsAuthenticated}) => {
  const [user, setUser] = useState(null);
  const [state, dispatch] = useReducer(formReducer, {
    username: '',
    password: '',
    error: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !state.username ||
      !state.password ||
      !state.cnfpassword ||
      !state.emailId
    ) {
      dispatch({type: 'SET_ERROR', payload: 'All fields are required!'});
      return;
    }

    if (state.password !== state.cnfpassword) {
      dispatch({type: 'SET_ERROR', payload: 'Passwords doesnt match!'});
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(state.emailId)) {
      dispatch({type: 'SET_ERROR', payload: 'Not a valid Email!'});
      return;
    }

    dispatch({type: 'SET_ERROR', payload: ''});

    setIsLoading(true);
    const result = await callApi(
      '/api/v2/login',
      {
        name: state.username,
        email: state.emailId,
        password: state.emailId,
        loginBy: 'app',
        loginRawData: '',
      },
      'POST',
    );

    setIsLoading(false);
    if (result.statusCode === 200 && result.data === 'Successfully Created') {
      setIsLoading(false);
      signInProcess(result);
    }
  };

  const signInProcess = async (result: any) => {
    await AsyncStorage.setItem(
      'username',
      result.data.name ? result.data.name : 'User',
    );
    await AsyncStorage.setItem('userdata', JSON.stringify(result.data));
    setIsAuthenticated(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={state.username}
        onChangeText={text => dispatch({type: 'SET_USERNAME', payload: text})}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email Id"
        keyboardType="email-address"
        value={state.emailId}
        onChangeText={text => dispatch({type: 'SET_EMAIL', payload: text})}
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={state.password}
        onChangeText={text => dispatch({type: 'SET_PASSWORD', payload: text})}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={state.cnfpassword}
        onChangeText={text =>
          dispatch({type: 'SET_CNF_PASSWORD', payload: text})
        }
        secureTextEntry
      />

      {/* Error message */}
      {state.error && <Text style={styles.error}>{state.error}</Text>}

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.button]}
        onPress={() => {
          handleRegister();
        }}
        disabled={isLoading}>
        <Text style={styles.buttonText}>
          {isLoading ? 'Registering...' : 'Register'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.facebookButton]}
        onPress={() => {
          navigation.replace('Login');
        }}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  facebookButton: {
    backgroundColor: '#3b5998', // Facebook blue
    width: '100%',
    height: 50,
    marginTop: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  googleButton: {
    width: '100%',
    height: 50,
    marginTop: 20,
    backgroundColor: '#db4437', // Google Red color
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  registerContainer: {
    marginTop: 20,
  },
  registerText: {
    fontSize: 16,
    color: '#555',
  },
  registerLink: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
