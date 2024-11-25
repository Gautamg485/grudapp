import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Text,
  PermissionsAndroid,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import AccountCard from '../components/AccountCard'; // Import the Card component
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getAccountInfo,
  getTransactionAmount,
  getTransactionInfo,
} from '../utils/smsparser';
import {
  extractTextBetweenToAndOn,
  getRegexFromArray,
} from '../utils/advanceParser';

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
          // maxCount: 100,
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
              // console.log(
              //   'bankDetailsbankDetails ' + JSON.stringify(bankDetails),
              // );
              // console.log(
              //   'smsDetailsObjsmsDetailsObj11 ' + JSON.stringify(smsDetailsObj),
              // );

              if (bankDetails != null) {
                if (
                  smsDetailsObj[bankDetails.accType] &&
                  smsDetailsObj[bankDetails.accType][bankDetails.accNo]
                ) {
                  let updateBankDetails =
                    smsDetailsObj[bankDetails.accType][bankDetails.accNo];
                  let updateTransactionDetails =
                    updateBankDetails.transactionList &&
                    updateBankDetails.transactionList[
                      bankDetails.transactionType
                    ]
                      ? updateBankDetails.transactionList[
                          bankDetails.transactionType
                        ]
                      : [];
                  if (bankDetails.rawData) {
                    updateTransactionDetails.push(bankDetails.rawData);
                  }
                  updateBankDetails['transactionList'][
                    bankDetails.transactionType
                  ] = updateTransactionDetails;
                  delete updateBankDetails.rawData;
                  smsDetailsObj[bankDetails.accType][bankDetails.accNo] =
                    updateBankDetails;
                } else {
                  bankDetails['transactionList'] = {};
                  if (bankDetails && bankDetails.rawData) {
                    bankDetails['transactionList'][
                      bankDetails.transactionType
                    ] = [];
                    bankDetails['transactionList'][
                      bankDetails.transactionType
                    ].push(bankDetails.rawData);

                    delete bankDetails.rawData;
                  }
                  if (!smsDetailsObj[bankDetails.accType]) {
                    smsDetailsObj[bankDetails.accType] = {};
                  }
                  smsDetailsObj[bankDetails.accType][bankDetails.accNo] =
                    bankDetails;
                }
              }
            });
            // console.log(
            //   'smsDetailsListsmsDetailsList ' + JSON.stringify(smsDetailsObj),
            // );
            setSmsData(smsDetailsObj);
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
    let smsText = smsContent.replace(/\n/g, ' ').toLowerCase();
    if (
      smsText.indexOf('suspected') !== -1 ||
      smsText.indexOf('spam') !== -1 ||
      smsText.indexOf('g00d') !== -1 ||
      smsText.indexOf('good') !== -1 ||
      smsText.indexOf('welcome') !== -1 ||
      smsText.indexOf('cdsl') !== -1 ||
      smsText.indexOf('ready') !== -1 ||
      smsText.indexOf('activate') !== -1 ||
      smsText.indexOf('offer') !== -1 ||
      smsText.indexOf('news') !== -1 ||
      smsText.indexOf('verify') !== -1 ||
      smsText.indexOf('verification') !== -1 ||
      smsText.indexOf('pay later') !== -1 ||
      smsText.indexOf('dth') !== -1 ||
      smsText.indexOf('digital tv') !== -1 ||
      smsText.indexOf('loan') !== -1 ||
      smsText.indexOf('appr0ved.') !== -1
    ) {
      return null;
    } else {
      const result = getAccountInfo(smsText);

      // Extract specific information (bank name and account number)
      // Log the result
      // console.log('GGGGG 1:', JSON.stringify(result)); // Output: Axis Bank
      // console.log('GGGGG 1:', JSON.stringify(result)); // Output: Axis Bank
      // if (smsText.indexOf('3761') !== -1) {
      //   console.log('GGGGG 2:', smsText); // Output: Axis Bank
      //   console.log('GGGGG 3:', result.number); // Output: Axis Bank
      // }

      if (
        result.number !== null &&
        result.number.replaceAll(' ', '').replaceAll('.', '').length >= 4
      ) {
        // console.log('GGGGG 2:', smsText); // Output: Axis Bank
        // console.log('GGGGG 1:', JSON.stringify(result)); // Output: Axis Bank
        let bankName = '';
        let merchantName = '';
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
        const merchantNames = ['swiggy', 'zomato', 'paytm', 'flipkart'];

        let merchantRegex = getRegexFromArray(merchantNames);

        const merchantMatch = smsText.match(merchantRegex);

        if (merchantMatch) {
          merchantName = merchantMatch[0].trim();
        }

        let regex = getRegexFromArray(bankNames);

        const match = smsText.match(regex);

        if (match) {
          bankName = match[0].trim();
        }

        let transaction = getTransactionInfo(smsText);
        transaction['regexMerchantName'] = merchantName;
        // if (
        //   merchantName === '' ||
        //   merchantName.toLowerCase() === 'to' ||
        //   merchantName.toLowerCase() === 'on'
        // ) {
        transaction['advRegexMerchantName'] = extractTextBetweenToAndOn(
          smsText.toLowerCase(),
        );
        // }

        let typeRegex = getRegexFromArray(['sent', 'send', 'debited']);
        const typematch = smsText.toLowerCase().match(typeRegex);
        if (typematch) {
          transaction['transactionType'] = 'debit';
        } else {
          transaction['transactionType'] = 'credit';
        }

        return {
          bankName: bankName,
          accNo: result.number,
          accType:
            transaction && transaction.account && transaction.account.type
              ? transaction.account.type
              : 'ACCOUNT',
          transactionType: transaction['transactionType'],
          rawData: transaction,
        };
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
    <ScrollView style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {userData.name}!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.replace('QRScanner');
        }}>
        <Text style={styles.buttonText}>Scan QR</Text>
      </TouchableOpacity>
      {/* <ScrollView> */}
      {smsData ? (
        <>
          {Object.keys(smsData).map((value, key) => {
            return (
              <View key={key}>
                <Text style={styles.headingText}>{value}S</Text>
                <FlatList
                  key={'flatlist'}
                  data={Object.keys(smsData[value])}
                  renderItem={({item}) => (
                    <AccountCard
                      key={smsData[value][item].number}
                      data={smsData[value][item]}
                      navigation={navigation}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()} // Use index as a key (fallback)
                />
              </View>
            );
          })}
        </>
      ) : (
        <Text>Fetching Data ...</Text>
      )}
      {/* </ScrollView> */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
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
    marginTop: 20,
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
    marginBottom: 20,
    color: '#333',
  },
  headingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
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
