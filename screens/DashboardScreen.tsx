import React, {useEffect} from 'react';
import {View, Text, PermissionsAndroid} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';

const DashboardScreen: React.FC = () => {
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
    <View>
      <Text>Welcome to the Dashboard!</Text>
    </View>
  );
};

export default DashboardScreen;
