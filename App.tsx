/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  Text,
  View,
  AppRegistry,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Sound from 'react-native-sound';
import PushNotification from 'react-native-push-notification';
import BackgroundFetch from 'react-native-background-fetch';
import BackgroundTimer from 'react-native-background-timer';

const App = () => {
  const TARGET_LATITUDE = 13.0457258;
  const TARGET_LONGITUDE = 80.257855;
  const RADIUS_METERS = 300;
  const [currentDistance, setCurrentDistance] = useState(0);

  const initLocationApp = async () => {
    await requestPermissions();
    await callBackgroundFetch();
    // await callBackgroundTimer();
  };

  const requestPermissions = async () => {
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

    PushNotification.configure({
      onNotification: function (notification: any) {
        console.log('Notification:', notification);
      },
      requestPermissions: Platform.OS === 'ios',
    });
  };

  const sendNotification = async (radius = '', latitude = 0, longitude = 0) => {
    PushNotification.getChannels(function (channel_ids: any) {
      console.log('CH IDS - ' + channel_ids); // ['channel_id_1']
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

  const callBackgroundFetch = async () => {
    console.log('BackgroundFetch Task Init');
    try {
      BackgroundFetch.configure(
        {
          minimumFetchInterval: 1, // Minimum   time between fetches in minutes
          stopOnTerminate: false, // Continue fetching when the app is terminated
          startOnBoot: true, // Start fetching when the device boots up
          enableHeadless: true, // Enable headless mode for background tasks
        },
        async taskId => {
          console.log('BackgroundFetch Task Started', taskId);

          try {
            Geolocation.getCurrentPosition(
              position => {
                console.log('BackgroundFetch Position - ' + position);
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
  };

  const callBackgroundTimer = async () => {
    console.log('BackgroundTimer Task Start');
    BackgroundTimer.runBackgroundTimer(() => {
      // Your background task code here
      Geolocation.getCurrentPosition(
        position => {
          console.log('POSITION - ' + position);
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

    // return () => BackgroundTimer.clearTimeout(backgroundTask);
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

  useEffect(() => {
    initLocationApp();
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text
        style={{
          fontSize: 18,
          color: '#2E4A7D',
          marginBottom: 5,
        }}>
        Latitude: {TARGET_LATITUDE}
      </Text>
      <Text
        style={{
          fontSize: 18,
          color: '#2E4A7D',
          marginBottom: 5,
        }}>
        Latitude: {TARGET_LONGITUDE}
      </Text>
      <Text
        style={{
          fontSize: 18,
          color: '#2E4A7D',
          marginBottom: 5,
        }}>
        Radius: {RADIUS_METERS}
      </Text>
      <Text
        style={{
          fontSize: 18,
          color: '#FF4C4C',
          fontWeight: 'bold',
        }}>
        Current Radius: {currentDistance}
      </Text>
    </View>
  );
};

AppRegistry.registerComponent('MyApp', () => App);
AppRegistry.registerHeadlessTask('RNBackgroundFetch', () => BackgroundFetch);
export default App;
