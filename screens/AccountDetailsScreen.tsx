import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useBackButtonHandler} from '../components/useBackButtonController';
import TabComponent from '../components/TabComponent';

const AccountDetailsScreen: React.FC = ({route}) => {
  useBackButtonHandler();
  const {data} = route.params; // Extract dynamic parameters

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Account Details</Text>

      <View style={styles.table}>
        <View style={[styles.row, styles.rowWhite]}>
          <Text style={styles.label}>Bank Name:</Text>
          <Text style={styles.value}>
            {data.bankName ? data.bankName.toUpperCase() : ''}
          </Text>
        </View>

        <View style={[styles.row, styles.rowWhite]}>
          <Text style={styles.label}>Account Number:</Text>
          <Text style={styles.value}>{`XX${data.accNo}`}</Text>
        </View>
      </View>
      <Text style={styles.heading}>Transaction List</Text>
      <TabComponent data={data.transactionList} />
      {/* <Text style={styles.heading}>Account Details</Text>

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
      <Text style={styles.heading}>Transaction List</Text>
      <ScrollView style={styles.table}>
        {data.transactionList
          ? data.transactionList.map((value, key) => {
              return (
                <View style={[styles.row, styles.rowWhite]} key={key}>
                  <Text style={styles.label}>
                    {value.regexMerchantName && value.regexMerchantName !== ''
                      ? value.regexMerchantName.toUpperCase()
                      : value.advRegexMerchantName
                      ? value.advRegexMerchantName.toUpperCase()
                      : value.transaction && value.transaction.merchant
                      ? value.transaction.merchant.toUpperCase()
                      : ''}
                  </Text>
                  <Text style={styles.value}>
                    Rs. {value.transaction.amount}
                  </Text>
                </View>
              );
            })
          : ''}
      </ScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
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
