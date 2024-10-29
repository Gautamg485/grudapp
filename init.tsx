import React, {useEffect, useState} from 'react';
import {ScrollView, Text, Button, Linking} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import {PermissionsAndroid} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
const SmsReader = () => {
  const [user, setUser] = useState(null);

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
            console.log('List: ', smsList);
            var arr = JSON.parse(smsList);

            arr.forEach(function (object: any) {
              console.log('Object: ' + object);
              console.log('-->' + object.date);
              console.log('-->' + object.body);
            });
          },
        );
      }
    };

    fetchSms();
  }, []);

  return (
    <ScrollView>
      {user ? (
        <Text>Welcome home, {user}!</Text>
      ) : (
        <Button title="Sign In with Google" onPress={signIn} />
      )}
      <QRCodeScanner
        onRead={e => {
          Linking.openURL(e.data).catch(err =>
            console.error('An error occured', err),
          );
        }}
        flashMode={RNCamera.Constants.FlashMode.torch}
      />
      <Text>Reading SMS...</Text>
    </ScrollView>
  );
};

export default SmsReader;
