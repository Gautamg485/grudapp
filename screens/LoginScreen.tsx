import React, {useEffect, useReducer, useState} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  //   Alert,
  Image,
} from 'react-native';
import {PermissionsAndroid} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';

// Reducer to manage form state
const formReducer = (state: any, action: {type: any; payload: any}) => {
  switch (action.type) {
    case 'SET_USERNAME':
      return {...state, username: action.payload};
    case 'SET_PASSWORD':
      return {...state, password: action.payload};
    case 'SET_ERROR':
      return {...state, error: action.payload};
    default:
      return state;
  }
};

const LoginScreen = ({navigation, setIsAuthenticated}) => {
  const [user, setUser] = useState(null);
  const [state, dispatch] = useReducer(formReducer, {
    username: '',
    password: '',
    error: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!state.username || !state.password) {
      dispatch({type: 'SET_ERROR', payload: 'Both fields are required!'});
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      //       Alert.alert('Success', 'Login Successful!');
      //       if (state.username === 'user' && state.password === 'password') {
      signInProcess(state.username);
      //       } else {
      //         // Handle incorrect credentials
      //       }
    }, 1500);
  };

  useEffect(() => {
    requestSmsPermission();
    GoogleSignin.configure({
      webClientId:
        '317914990748-2shn3bhu5htjb5cqldun7dq6bqpg0i2i.apps.googleusercontent.com', // Replace with your client ID
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  const signInProcess = async name => {
    //       console.log("namename "+name)
    await AsyncStorage.setItem('userToken', 'dummy-token-123'); // Save token to AsyncStorage
    await AsyncStorage.setItem('username', name ? name : 'test'); // Save token to AsyncStorage
    setIsAuthenticated(true);
    //          navigation.replace('Dashboard');  // Replace current screen with Login
  };
  const handleGoogleLogin = async () => {
    try {
      const user: any = await GoogleSignin.signIn();
      console.log('useruser ' + JSON.stringify(user));
      setUser(user.data.user.givenName);
      signInProcess(user.data.user.givenName);
    } catch (error) {
      console.error(error);
    }
  };

  async function requestSmsPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'SMS Permission',
          message: 'This app needs access to your SMS messages.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  const handleFacebookLogin = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email'])
      .then(result => {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );
          // Get Access Token after successful login
          AccessToken.getCurrentAccessToken()
            .then(data => {
              console.log('Access Token:', data.accessToken.toString());
              // You can send the access token to your server to verify login
              fetchUserData(data.accessToken);
            })
            .catch(error => {
              console.error('Error getting access token:', error);
            });
        }
      })
      .catch(error => {
        console.error('Login failed with error:', error);
      });
  };

  // Fetch user data from Facebook using the Access Token
  const fetchUserData = accessToken => {
    const {
      GraphRequest,
      GraphRequestManager,
    } = require('react-native-fbsdk-next');
    const infoRequest = new GraphRequest(
      '/me',
      {
        accessToken: accessToken.toString(),
        parameters: {
          fields: {
            string: 'id,name,email', // Fields to fetch from Facebook
          },
        },
      },
      (error, result) => {
        if (error) {
          console.log('Error fetching user data:', error);
        } else {
          console.log('User Data:', result);
          setUser(result.name);
          signInProcess(result.name);
        }
      },
    );

    // Start the request to fetch user data
    new GraphRequestManager().addRequest(infoRequest).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={state.username}
        onChangeText={text => dispatch({type: 'SET_USERNAME', payload: text})}
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

      {/* Error message */}
      {state.error && <Text style={styles.error}>{state.error}</Text>}

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}>
        <Text style={styles.buttonText}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.facebookButton]}
        onPress={() => {
          navigation.replace('Register');
        }}>
        <Text style={styles.buttonText}>Don't have account? Sign Up!!!</Text>
      </TouchableOpacity>

      {/* Custom Google Sign-In Button */}
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <View style={styles.googleButtonContent}>
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.facebookButton}
        onPress={handleFacebookLogin}>
        <View style={styles.googleButtonContent}>
          <Text style={styles.googleButtonText}>Sign in with Facebook</Text>
        </View>
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

export default LoginScreen;
