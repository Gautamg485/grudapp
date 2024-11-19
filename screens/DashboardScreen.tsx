import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Text,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import AccountCard from '../components/AccountCard'; // Import the Card component
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAccountInfo} from '../utils/smsparser';

const DashboardScreen: React.FC = ({setIsAuthenticated, navigation}) => {
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
      let username = await AsyncStorage.getItem('username');
      setUserData({name: username});
      const permissionGranted = await requestSmsPermission();
      if (permissionGranted) {
        const filter = {
          box: 'inbox',
          maxCount: 100,
          // minDate: 1731974400000,
          // maxDate: 1732060800000,
          // bodyRegex: '(spent|spend|paid)', // content regex to match
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

            let smsDetailsList = [];
            let smsDetailsObj = {};
            arr.forEach(function (object: any) {
              //               console.log('Object: ' + object);
              //               console.log('-->' + object.date);
              //               console.log('-->' + object.body);
              const bankDetails = extractBankInfo(object.body);
              console.log(
                'bankDetailsbankDetails ' + JSON.stringify(bankDetails),
              );
              console.log(
                'smsDetailsObjsmsDetailsObj11 ' + JSON.stringify(smsDetailsObj),
              );

              if (bankDetails != null && !smsDetailsObj[bankDetails.accNo]) {
                smsDetailsObj[bankDetails.accNo] = bankDetails;
                smsDetailsList.push(bankDetails);
              }
            });
            console.log(
              'smsDetailsListsmsDetailsList ' + JSON.stringify(smsDetailsList),
            );
            setSmsData(smsDetailsList);
          },
        );
      }
    };

    fetchSms();
  }, []);

  const extractBankInfo = smsContent => {
    // Define the regular expressions for bank name and account number
    // const bankNameRegex = /^([A-Za-z\s]+)\s*:/;
    // const accountNumberRegex = /a\/c \*\*(\d+)/;
    // if (smsContent.indexOf('Axis') !== -1) {
    //   console.warn('smsContent - ' + JSON.stringify(smsContent));
    // }
    let smsText = smsContent.toLowerCase();
    if (
      smsText.indexOf('suspected') !== -1 ||
      smsText.indexOf('spam') !== -1 ||
      smsText.indexOf('g00d') !== -1 ||
      smsText.indexOf('good') !== -1 ||
      smsText.indexOf('news') !== -1 ||
      smsText.indexOf('appr0ved.') !== -1
    ) {
      return null;
    } else {
      const result = getAccountInfo(smsContent);

      // Extract specific information (bank name and account number)
      // Log the result
      // console.log('GGGGG 1:', JSON.stringify(result)); // Output: Axis Bank
      // console.log('GGGGG 1:', JSON.stringify(result)); // Output: Axis Bank

      if (result.number !== null && result.number.replaceAll(' ', '') !== '') {
        console.log('GGGGG 2:', smsContent); // Output: Axis Bank
        console.log('GGGGG 1:', JSON.stringify(result)); // Output: Axis Bank
        let bankName = '';
        // Define regex to match potential bank names
        // let bankArr = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank'];
        // let bankString = '';
        // bankArr.forEach(function (string: any) {
        //   if (bankArr[bankArr.length - 1] === string) {
        //     bankString += `${string}`;
        //   } else {
        //     bankString += `${string}|`;
        //   }
        //   console.warn('stringstring ' + string);
        // });
        // console.warn('bankStringbankString ' + bankString);
        // const regex = `/\b(${bankString})\b/gi`;
        const bankNames = [
          'HDFC Bank',
          'ICICI Bank',
          'State Bank of India',
          'Axis Bank',
          'SBI',
        ];

        const escapedNames = bankNames.map(name =>
          name.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&'),
        );

        // Create the regex pattern from the bank names
        const pattern = `\\b(${escapedNames.join('|')})\\b`;

        // Return a case-insensitive global regex
        let regex = new RegExp(pattern, 'gi');
        console.warn('regexregex ' + regex);

        const match = smsContent.match(regex);

        if (match) {
          bankName = match[0].trim();
        }
        return {bankName: bankName, accNo: result.number};
      } else {
        return null;
      }
    }
    // Extract the bank name using regex
    // const bankNameMatch = smsContent.match(bankNameRegex);
    // const accountNumberMatch = smsContent.match(accountNumberRegex);

    // Output the extracted data
    // if (bankNameMatch) {
    //   console.log('Bank Name:', bankNameMatch[1]);
    // }
    // if (accountNumberMatch) {
    //   console.log('Account Number:', accountNumberMatch[1]);
    // }

    // if (bankNameMatch && accountNumberMatch) {
    //   return {bankName: bankNameMatch[1], accNo: accountNumberMatch[1]};
    // } else {
    //   const regexBankAndAccount =
    //     /Card\sno\.\s([A-Za-z0-9]+)[\s\S]*?(\w+\s?Bank)$/;

    //   // Match the regex against the smsText
    //   const match = regexBankAndAccount.exec(smsContent);

    //   if (match) {
    //     const accountNumber = match[1]; // Account number captured by the first group
    //     const bankName = match[2]; // Bank name captured by the second group

    //     // console.log('Account Number:', accountNumber);
    //     // console.log('Bank Name:', bankName);
    //     return {bankName: bankName, accNo: accountNumber};
    //   } else {
    //     // console.log('No match found');
    //   }

    //   return null;
    // }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setIsAuthenticated(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {userData.name}!</Text>
      <View>
        {smsData ? (
          <FlatList
            data={smsData}
            renderItem={({item}) => (
              <AccountCard
                key={item.number}
                data={item}
                navigation={navigation}
              />
            )}
            keyExtractor={item => item.number}
          />
        ) : (
          <Text>Fetching Data ...</Text>
        )}
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
