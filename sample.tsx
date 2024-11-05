import React, {useEffect, useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  AppState,
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Sound from 'react-native-sound';
import PushNotification from 'react-native-push-notification';

const App = () => {
  // const TARGET_LATITUDE = 12.936119; // Replace with your target latitude
  // const TARGET_LONGITUDE = 80.1793316; // Replace with your target longitude
  // const RADIUS_METERS = 5;

  const [appState, setAppState] = useState(AppState.currentState);
  const [currentDistance, setCurrentDistance] = useState(0);
  const [reached, setReached] = useState(false);

  const [latField, setLatField] = useState(12.936119);
  const [longField, setLongField] = useState(80.1793316);
  const [radiusField, setRadiusField] = useState(5);

  const [targetLatitude, setTargetLatitude] = useState(12.936119);
  const [targetLongitude, setTargetLongitude] = useState(80.1793316);
  const [targetRadius, setTargetRadius] = useState(5);

  const requestNotificationPermissions = async () => {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: 'Notification Permission',
        message: 'This app would like to send you notifications.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
  };
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'LOCATION Permission',
          message: 'This app needs access to your Location messages.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: 'Background Location Permission',
          message: 'This app needs access to your Background Location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
    }
  };

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  useEffect(() => {
    requestPermissions();
    configurePushNotifications();
    // AppState.addEventListener('change', handleAppStateChange);

    // if (!reached) {
    startTracking();
    // }

    // return () => {
    //   stopTracking();
    // };
  }, []);

  // const handleAppStateChange = (nextAppState: string) => {
  //   console.log('nextAppStatenextAppState ' + nextAppState);
  //   setAppState(nextAppState);
  // };

  const startTracking = () => {
    console.log('startTrackingstartTracking');
    Geolocation.watchPosition(
      position => {
        console.log('TRACKING');
        const {latitude, longitude} = position.coords;
        checkProximity(latitude, longitude);
      },
      error => {
        console.log('Location error:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 1, // Update every meter
        interval: 1000, // Update every 5 seconds
        fastestInterval: 1000,
        showsBackgroundLocationIndicator: true,
      },
    );
  };

  const stopTracking = () => {
    // Geolocation.clearWatch();
  };

  const checkProximity = (latitude: number, longitude: number) => {
    console.log('targetLatitudetargetLatitude ' + targetLatitude);
    console.log('targetLongitudetargetLongitude ' + targetLongitude);
    console.log('targetRadiustargetRadius ' + targetRadius);
    if (targetLatitude > 0 && targetLongitude > 0 && targetRadius > 0) {
      const distance = calculateDistance(
        latitude,
        longitude,
        targetLatitude,
        targetLongitude,
      );
      console.log('RADIUS_METERS ' + targetRadius);
      console.log('distance ' + distance);
      setCurrentDistance(distance);
      if (distance <= targetRadius) {
        if (!reached) {
          sendNotification();
          setReached(true);
        }
      } else {
        setReached(false);
      }
    }
  };

  const configurePushNotifications = () => {
    PushNotification.configure({
      onNotification: function (notification: any) {
        console.log('Notification:', notification);
      },
      requestPermissions: Platform.OS === 'ios',
    });
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const sendNotification = async () => {
    PushNotification.getChannels(function (channel_ids: any) {
      console.log(channel_ids); // ['channel_id_1']
      if (channel_ids.length === 0) {
        PushNotification.createChannel(
          {
            channelId: 'your-channel-id', // (required)
            channelName: 'My channel', // (required)
            channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
            playSound: false, // (optional) default: true
            soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
            vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
          },
          (created: any) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
        );
      }
    });

    try {
      PushNotification.localNotification({
        channelId: 'your-channel-id', // (required)
        title: "You've arrived!",
        message: 'You are within 5 meters of your target location.',
        playSound: true, // (optional)
        sound: 'default', // (optional)
      });
    } catch (error) {
      console.log(error);
    }

    const alarm = new Sound('alarm_sound.mp3', Sound.MAIN_BUNDLE, error => {
      if (!error) {
        alarm.play(success => {
          if (!success) {
            console.warn('Alarm playback failed');
          }
          alarm.release();
        });
      } else {
        console.log(error);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          value={latField}
          onChangeText={setLatField}
          placeholder="Enter your latitude"
          placeholderTextColor="#A1A1A1"
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          value={longField}
          onChangeText={setLongField}
          placeholder="Enter your longitude"
          placeholderTextColor="#A1A1A1"
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          value={radiusField}
          onChangeText={setRadiusField}
          placeholder="Enter your Radius"
          placeholderTextColor="#A1A1A1"
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setTargetLatitude(latField);
            setTargetLongitude(longField);
            setTargetRadius(radiusField);
          }}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.submittedDataContainer}>
        <Text style={styles.submittedDataText}>Latitude: {targetLatitude}</Text>
        <Text style={styles.submittedDataText}>
          Latitude: {targetLongitude}
        </Text>
        <Text style={styles.submittedDataText}>Radius: {targetRadius}</Text>
        <Text style={styles.highlightedPhoneText}>
          Current Radius: {currentDistance}
        </Text>
      </View>

      {/* <Text>READING LOCATION...</Text>
        <Text>CURRENT DISTANCE FROM DESTINATION</Text>
        <Text>{currentDistance}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F6F3', // Soft teal background
    padding: 20,
  },
  title: {
    fontSize: 28, // Larger title size
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#2E4A7D', // Dark navy for the title
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF', // White background for the card
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5, // For Android
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#2E4A7D', // Dark navy border
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 18, // Larger input font size
    backgroundColor: '#F0F0F0', // Light gray background for inputs
    color: '#2E4A7D', // Dark navy text color for inputs
  },
  button: {
    height: 50,
    backgroundColor: '#FF4C4C', // Bright red button
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#FF4C4C', // Shadow color to match button
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3, // For Android
  },
  buttonText: {
    color: '#FFFFFF', // White text for button
    fontSize: 20, // Larger button text size
    fontWeight: 'bold',
  },
  submittedDataContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF', // White background for the card
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5, // For Android
    marginBottom: 20,
  },
  submittedDataText: {
    fontSize: 18, // Larger font size for submitted data
    color: '#2E4A7D', // Dark navy color for text
    marginBottom: 5,
  },
  highlightedPhoneText: {
    fontSize: 18,
    color: '#FF4C4C', // Bright red to highlight the phone number
    fontWeight: 'bold', // Bold font for emphasis
  },
});

export default App;
