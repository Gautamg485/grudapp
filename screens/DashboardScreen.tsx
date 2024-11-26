import React, {useEffect, useState} from 'react';
import {
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
import {getAccountInfo, getTransactionInfo} from '../utils/smsparser';
import {
  extractTextBetweenToAndOn,
  getMatchedValueFromRegex,
} from '../utils/advanceParser';
import {getFormattedDate} from '../utils/generalUtil';
import {callApi} from '../utils/fetcher';

const DashboardScreen: React.FC = ({setIsAuthenticated, navigation}: any) => {
  const [userData, setUserData]: any = useState(false);
  const [smsData, setSmsData]: any = useState(false);

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
      const asyncSmsData = await AsyncStorage.getItem('smsData');
      if (asyncSmsData) setSmsData(JSON.parse(asyncSmsData));
      const smsData = await callApi(
        '/getSmsData',
        {
          userId: 6,
        },
        'POST',
      );

      let filter: any = {
        box: 'inbox',
      };

      let smsDetailsObj: any = {};
      let smsRegex: any = {};
      if (smsData && smsData.data) {
        smsRegex = {
          scamRegex: smsData.data.scamRegex,
          bankNameRegex: smsData.data.bankNameRegex,
          transactionTypeRegex: smsData.data.transactionTypeRegex,
          merchantRegex: smsData.data.merchantRegex,
        };
        if (smsData.data.smsData && smsData.data.smsData !== '{}') {
          setSmsData(JSON.parse(smsData.data.smsData));
          smsDetailsObj = JSON.parse(smsData.data.smsData);
          filter['minDate'] = smsData.data.smsLastUpdatedAt;
        }
      }

      let username = await AsyncStorage.getItem('username');
      setUserData({name: username});
      const permissionGranted = await requestSmsPermission();
      if (permissionGranted) {
        SmsAndroid.list(
          JSON.stringify(filter),
          (fail: any) => {
            console.log('Failed with this error: ' + fail);
          },
          async (count: any, smsList: any) => {
            console.log('Count: ', count);
            var arr = JSON.parse(smsList);

            arr.forEach(function (object: any) {
              const bankDetails: any = extractBankInfo(
                object.body,
                object.date,
                smsRegex,
              );

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
            setSmsData(smsDetailsObj);
            await AsyncStorage.setItem(
              'smsData',
              JSON.stringify(smsDetailsObj),
            );
            // console.log('SMS DETAILS - ' + JSON.stringify(smsDetailsObj));
            await callApi(
              '/saveSmsData',
              {
                userId: 6,
                transactionData: JSON.stringify(smsDetailsObj),
              },
              'POST',
            );
          },
        );
      }
    };

    fetchSms();
  }, []);

  const extractBankInfo = (smsContent: any, date: any, smsRegex: any) => {
    let smsText = smsContent.replace(/\n/g, ' ').toLowerCase();
    if (getMatchedValueFromRegex(smsRegex['scamRegex'], smsText) !== '') {
      return null;
    } else {
      const result: any = getAccountInfo(smsText);

      if (
        result.number !== null &&
        result.number.replaceAll(' ', '').replaceAll('.', '').length >= 4
      ) {
        let transaction: any = getTransactionInfo(smsText);
        transaction['regexMerchantName'] = getMatchedValueFromRegex(
          smsRegex['merchantRegex'],
          smsText,
        );
        transaction['advRegexMerchantName'] = extractTextBetweenToAndOn(
          smsText.toLowerCase(),
        );

        if (
          getMatchedValueFromRegex(
            smsRegex['transactionTypeRegex'],
            smsText,
          ) !== ''
        ) {
          transaction['transactionType'] = 'debit';
        } else {
          transaction['transactionType'] = 'credit';
        }
        transaction['date'] = getFormattedDate(date);

        return {
          bankName: getMatchedValueFromRegex(
            smsRegex['bankNameRegex'],
            smsText,
          ),
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
              <View style={{flex: 1}} key={key}>
                <Text style={styles.headingText}>{value}S</Text>
                {Object.keys(smsData[value]).map((item, itemkey) => {
                  return (
                    <View key={itemkey}>
                      <AccountCard
                        key={smsData[value][item].number}
                        data={smsData[value][item]}
                        navigation={navigation}
                      />
                    </View>
                  );
                })}
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
    marginBottom: 10,
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
    marginTop: 10,
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
