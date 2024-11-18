import React, {useEffect, useState} from 'react';
import {ScrollView, Text, Button, Linking} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import {PermissionsAndroid} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
// import QRCodeScanner from 'react-native-qrcode-scanner';
// import {RNCamera} from 'react-native-camera';
import ReactNativeBiometrics from 'react-native-biometrics';

const SmsReader = () => {
  const [user, setUser] = useState(null);
  const [isBiometricAuthenticated, setIsBiometricAuthenticated] =
    useState(false);

  const handleBiometricAuthentication = async () => {
    try {
      const rnBiometrics = new ReactNativeBiometrics();

      const result = await rnBiometrics.createSignature({
        promptMessage: 'Please Authenticate to Gowtham App',
        payload: 'your_payload_data', // Replace with your desired payload
      });

      if (result.success) {
        setIsBiometricAuthenticated(true);
        // Use the signature for further authentication or encryption
        console.log('Signature:', result.signature);
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error);
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '317914990748-2shn3bhu5htjb5cqldun7dq6bqpg0i2i.apps.googleusercontent.com', // Replace with your client ID
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  const signIn = async () => {
    try {
      const user = await GoogleSignin.signIn();
      // You can use the `idToken` to access the user's information
      // or send it to your backend for further processing
      console.warn('useruser ' + JSON.stringify(user.data.user.givenName));
      setUser(user.data.user.givenName);
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

  useEffect(() => {
    const fetchSms = async () => {
      const permissionGranted = await requestSmsPermission();
      if (permissionGranted) {
        const filter = {
          box: 'inbox', // 'inbox' or 'sent'
          maxCount: 100, // Limit number of SMS fetched
          // You can add more filters if needed
        };

        SmsAndroid.list(
          JSON.stringify(filter),
          (fail: any) => {
            console.log('Failed with this error: ' + fail);
          },
          (count: any, smsList: any) => {
            console.log('Count: ', count);
            // console.log('List: ', smsList);
            // var arr = JSON.parse(smsList);

            // arr.forEach(function (object: any) {
            //   console.log('Object: ' + object);
            //   console.log('-->' + object.date);
            //   console.log('-->' + object.body);
            // });
          },
        );
      }
    };

    fetchSms();
  }, []);

  return (
    <ScrollView>
      {user ? (
        <Text>Welcome, {user}!</Text>
      ) : (
        <Button title="Sign In with Google" onPress={signIn} />
      )}
      <Button
        title="Authenticate with Biometrics"
        onPress={handleBiometricAuthentication}
      />
      {isBiometricAuthenticated && (
        <Text>Biometric authentication successful!</Text>
      )}
      {/* <QRCodeScanner
        onRead={e => {
          Linking.openURL(e.data).catch(err =>
            console.error('An error occured', err),
          );
        }}
        flashMode={RNCamera.Constants.FlashMode.torch}
      /> */}
      <Text>Reading SMS...</Text>
    </ScrollView>
  );
};

export default SmsReader;
