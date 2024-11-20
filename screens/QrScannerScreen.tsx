import React, {useEffect, useState} from 'react';
import {View, Text, Alert, Linking, BackHandler} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {useBackButtonHandler} from '../components/useBackButtonController';

const QRScanner = ({navigation}) => {
  const [scanned, setScanned] = useState(false);
  useBackButtonHandler();

  useEffect(() => {
    // Listen for the back button press
    const backAction = () => {
      // Show a confirmation dialog when the user presses the back button
      //   Alert.alert('Hold on!', 'Are you sure you want to exit?', [
      //     {
      //       text: 'Cancel',
      //       onPress: () => null, // Do nothing
      //       style: 'cancel',
      //     },
      //     {text: 'YES', onPress: () => BackHandler.exitApp()}, // Exit the app
      //   ]);
      navigation.replace('Dashboard');

      // Return true to prevent the default back action (navigation)
      return true;
    };

    // Add the back button listener when the component mounts
    BackHandler.addEventListener('hardwareBackPress', backAction);

    // Cleanup the event listener when the component unmounts
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, []);

  const onSuccess = (e: any) => {
    setScanned(true);
    const qrCodeData = e.data;

    console.log('qrCodeDataqrCodeData ' + qrCodeData);
    // Example: handle the QR code data for payment (could be a URL or a payment ID)
    if (qrCodeData.startsWith('upi:')) {
      return Linking.openURL(qrCodeData);
    } else {
      Alert.alert('Invalid QR Code', 'This QR code is not valid for payment');
    }
  };

  return (
    <View style={{flex: 1}}>
      <QRCodeScanner
        onRead={onSuccess}
        flashMode={RNCamera.Constants.FlashMode.on}
        topContent={
          <Text style={{fontSize: 18, textAlign: 'center'}}>
            Scan your payment QR code
          </Text>
        }
        bottomContent={
          <Text style={{fontSize: 16, textAlign: 'center'}}>Scan to pay</Text>
        }
      />
      {scanned && (
        <Text style={{textAlign: 'center', marginTop: 20}}>
          QR Code Scanned!
        </Text>
      )}
    </View>
  );
};

export default QRScanner;
