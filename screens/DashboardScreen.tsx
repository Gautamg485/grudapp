import React, {useEffect, useState} from 'react';
import {FlatList, View, ScrollView, StyleSheet, Text, PermissionsAndroid, Button, TouchableOpacity} from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {userData.name}!</Text>
      <View>
        {smsData ?
        <FlatList
            data={smsData}
            renderItem={({ item }) => <AccountCard data={item} />}
            keyExtractor={(item) => item}
          /> : <Text>Fetching Data ...</Text>}
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#ff5722',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContainer: {
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },
  noAccountsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default DashboardScreen;
