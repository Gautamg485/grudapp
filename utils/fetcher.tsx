import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

export const callApi = async (url = '', body = {}, method = 'GET') => {
  try {
    let config = {
      method: method,
      body: JSON.stringify(body),
      headers: {
        Authorization:
          url.indexOf('api/v2') !== -1 ? `Basic ${Config.API_AUTH}` : '',
        'Content-Type': 'application/json',
      },
    };

    let baseUrl = Config.API_URL;
    console.log('url11 ' + JSON.stringify(baseUrl));
    baseUrl = 'https://47c57af9b7889c2e3eac61988b34c8b7.serveo.net';
    console.log('url22 ' + JSON.stringify(baseUrl));
    console.log('configconfig ' + JSON.stringify(config));
    const response = await fetch(`${baseUrl}${url}`, config);
    const result = await response.json();

    if (
      response.headers &&
      response.headers.map &&
      response.headers.map.authorization
    ) {
      console.warn(
        '111111111111 ' + JSON.stringify(response.headers.map.authorization),
      );
      await AsyncStorage.setItem(
        'authtoken',
        response.headers.map.authorization,
      );
    }
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
};
