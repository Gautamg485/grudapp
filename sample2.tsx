import React, {useEffect, useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  // AppState,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Sound from 'react-native-sound';
import PushNotification from 'react-native-push-notification';
import BackgroundFetch from 'react-native-background-fetch';
import BackgroundTimer from 'react-native-background-timer';

const App = () => {
  const TARGET_LATITUDE = 13.0457258; // Replace with your target latitude
  const TARGET_LONGITUDE = 80.257855; // Replace with your target longitude
  const RADIUS_METERS = 300;

  // const [appState, setAppState] = useState(AppState.currentState);
  const [currentDistance, setCurrentDistance] = useState(0);
  let reached = false;

  useEffect(() => {
    console.log('BackgroundFetch Task Init');
    try {
      BackgroundFetch.configure(
        {
          minimumFetchInterval: 15, // Minimum   time between fetches in minutes
          stopOnTerminate: false, // Continue fetching when the app is terminated
          startOnBoot: true, // Start fetching when the device boots up
          enableHeadless: true, // Enable headless mode for background tasks
        },
        async taskId => {
          // Task callback
          console.log('BackgroundFetch Task Started', taskId);

          // Your background task logic here
          // ...
          try {
            Geolocation.getCurrentPosition(
              position => {
                console.log(position);
                console.log('TRACKING');
                const {latitude, longitude} = position.coords;
                let distance: any = checkProximity(latitude, longitude);
                sendNotification(distance, latitude, longitude);
              },
              error => {
                console.error(error);
              },
              {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000,
                forceRequestLocation: true,
                forceLocationManager: true,
                showLocationDialog: true,
              },
            );
          } catch (error) {
            console.error(error);
          }
          // Finish the task
          BackgroundFetch.finish(taskId);
        },
        async taskId => {
          // Timeout callback
          console.log('BackgroundFetch Task Timeout', taskId);

          // Quickly finish the task
          BackgroundFetch.finish(taskId);
        },
      );
    } catch (error) {
      console.error('Error configuring BackgroundFetch:', error);
      // Consider logging to a remote service or using a logging library
    }
    console.log('BackgroundFetch Task End');
    const backgroundTask = BackgroundTimer.runBackgroundTimer(() => {
      // Your background task code here
      console.log('222222222222');
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
          console.log('TRACKING');
          const {latitude, longitude} = position.coords;
          let distance: any = checkProximity(latitude, longitude);
          sendNotification(distance, latitude, longitude);
        },
        error => {
          console.error(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          forceRequestLocation: true,
          forceLocationManager: true,
          showLocationDialog: true,
        },
      );
    }, 2000); // 2000 milliseconds = 2 seconds

    return () => BackgroundTimer.clearTimeout(backgroundTask);
  }, []);

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
    //     startTracking();
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
        distanceFilter: 0, // Update every meter
        // interval: 100, // Update every 5 seconds
        // fastestInterval: 1000,
        showsBackgroundLocationIndicator: true,
      },
    );
  };

  const stopTracking = () => {
    // Geolocation.clearWatch();
  };

  const checkProximity = (latitude: number, longitude: number) => {
    const distance = calculateDistance(
      latitude,
      longitude,
      TARGET_LATITUDE,
      TARGET_LONGITUDE,
    );
    console.log('RADIUS_METERS ' + RADIUS_METERS);
    console.log('distance ' + distance);
    setCurrentDistance(distance);
    if (distance <= RADIUS_METERS) {
      if (!reached) {
        sendNotification(distance, latitude, longitude);
        reached = true;
      }
    } else {
      reached = false;
    }

    return distance;
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

  const sendNotification = async (
    radius = '',
    latitude = 0,
    longitude = '',
  ) => {
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
        message:
          'You are within 5 meters of your target location. Current Radius - ' +
          radius +
          ' lat- ' +
          latitude +
          ' long- ' +
          longitude,
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
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={styles.submittedDataText}>Latitude: {TARGET_LATITUDE}</Text>
      <Text style={styles.submittedDataText}>Latitude: {TARGET_LONGITUDE}</Text>
      <Text style={styles.submittedDataText}>Radius: {RADIUS_METERS}</Text>
      <Text style={styles.highlightedPhoneText}>
        Current Radius: {currentDistance}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
