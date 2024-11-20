import {useEffect} from 'react';
import {BackHandler, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export const useBackButtonHandler = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Dashboard'); // Navigate to Dashboard on back press
      return true; // Prevent default back button behavior
    };

    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      // Cleanup the back handler on unmount
      return () => backHandler.remove();
    }
  }, [navigation]);
};
