import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

export const callApi = async (url = '', body = {}, method = 'GET') => {
  try {
    let authToken: any = '';
    if (url.indexOf('api/v2') === -1) {
      authToken = await AsyncStorage.getItem('userToken');
    }
    let config = {
      method: method,
      body: JSON.stringify(body),
      headers: {
        Authorization:
          url.indexOf('api/v2') !== -1 ? `Basic ${Config.API_AUTH}` : authToken,
        'Content-Type': 'application/json',
      },
    };

    let baseUrl = Config.API_URL;
    baseUrl = 'https://7997c9251eaa952341ac76df42ef3b1f.serveo.net';
    const response = await fetch(`${baseUrl}${url}`, config);
    const result = await response.json();

    if (
      response.headers &&
      response.headers.map &&
      response.headers.map.authorization
    ) {
      await AsyncStorage.setItem(
        'userToken',
        response.headers.map.authorization,
      );
    }
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
};
