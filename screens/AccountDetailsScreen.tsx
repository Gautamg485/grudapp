import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useBackButtonHandler} from '../components/useBackButtonController';
import Config from 'react-native-config';
import {callApi} from '../utils/fetcher';

const AccountDetailsScreen: React.FC = ({route}) => {
  useBackButtonHandler();
  const {data} = route.params; // Extract dynamic parameters

  const [details, setDetails] = useState(null);

  useEffect(() => {
    const updateData = async () => {
      const apiUrl = Config.API_URL;
      console.log(apiUrl);
      const result = await callApi(apiUrl);

      setDetails(result);
    };

    updateData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Account Details</Text>

      <View style={styles.table}>
        <View style={[styles.row, styles.rowWhite]}>
          <Text style={styles.label}>Bank Name:</Text>
          <Text style={styles.value}>{data.bankName}</Text>
        </View>

        <View style={[styles.row, styles.rowWhite]}>
          <Text style={styles.label}>Account Number:</Text>
          <Text style={styles.value}>{data.accNo}</Text>
        </View>
      </View>
      <Text style={styles.heading}>{JSON.stringify(details)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  rowGrey: {
    backgroundColor: '#f0f0f0', // Light grey background for even rows
  },
  rowWhite: {
    backgroundColor: '#ffffff', // White background for odd rows
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  value: {
    fontSize: 16,
    flex: 2,
    textAlign: 'right',
  },
});

export default AccountDetailsScreen;
