import React, {useEffect, useState} from 'react';
import {FlatList, View, ScrollView, Text, PermissionsAndroid, Button} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import AccountCard from '../components/AccountCard'; // Import the Card component
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardScreen: React.FC = ({setIsAuthenticated}) => {
    const [userData, setUserData] = useState(false);
    const [smsData, setSmsData] = useState(false);

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
        let username =  await AsyncStorage.getItem('username');
        setUserData({name: username});
      const permissionGranted = await requestSmsPermission();
      if (permissionGranted) {
        const filter = {
          box: 'inbox', // 'inbox' or 'sent'
          maxCount: 100, // Limit number of SMS fetched
          bodyRegex: '(.*)debited(.*)', // content regex to match
          // You can add more filters if needed
        };

        SmsAndroid.list(
          JSON.stringify(filter),
          (fail: any) => {
            console.log('Failed with this error: ' + fail);
          },
          (count: any, smsList: any) => {
            console.log('Count: ', count);
//             console.log('List: ', smsList);
            var arr = JSON.parse(smsList);

            let smsDetailsList=[];
            let smsDetailsObj={};
            arr.forEach(function (object: any) {
//               console.log('Object: ' + object);
//               console.log('-->' + object.date);
//               console.log('-->' + object.body);
              const bankDetails = extractBankInfo(object.body);
                          console.log("bankDetailsbankDetails "+JSON.stringify(bankDetails));
                          console.log("smsDetailsObjsmsDetailsObj11 "+JSON.stringify(smsDetailsObj));

              if (bankDetails!=null && !smsDetailsObj[bankDetails["accNo"]]) {
                  smsDetailsObj[bankDetails["accNo"]]= bankDetails;
                smsDetailsList.push(bankDetails);
              }
            });
            console.log("smsDetailsListsmsDetailsList "+JSON.stringify(smsDetailsList));
            setSmsData(smsDetailsList);
          },
        );
      }
    };

    fetchSms();
  }, []);

const extractBankInfo = (smsContent) => {
  // Define the regular expressions for bank name and account number
  const bankNameRegex = /^([A-Za-z\s]+)\s*:/;
  const accountNumberRegex = /a\/c \*\*(\d+)/;

  // Extract the bank name using regex
  const bankNameMatch = smsContent.match(bankNameRegex);
  const accountNumberMatch = smsContent.match(accountNumberRegex);

  // Output the extracted data
  if (bankNameMatch) {
    console.log('Bank Name:', bankNameMatch[1]);
  }
  if (accountNumberMatch) {
    console.log('Account Number:', accountNumberMatch[1]);
  }

  if (bankNameMatch && accountNumberMatch) {
    return {bankName: bankNameMatch[1], accNo: accountNumberMatch[1]}
  } else {
      return null;
  }
};

const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setIsAuthenticated(false);
  };

  return (
    <View>
        <Text>Welcome {userData ? userData.name : "User"}</Text>
      <View>
        {smsData ?
        <FlatList
            data={smsData}
            renderItem={({ item }) => <AccountCard data={item} />}
            keyExtractor={(item) => item}
          /> : <Text>Fetching Data ...</Text>}
      </View>
            <Button title="Logout" onPress={logout} />

    </View>
  );
};

export default DashboardScreen;
