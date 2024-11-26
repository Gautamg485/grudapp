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
          <Text style={[styles.label, styles.fixedWidth]}>Bank Name:</Text>
          <Text style={[styles.value, styles.fixedWidth]}>
            {data.bankName ? data.bankName.toUpperCase() : ''}
          </Text>
        </View>

        <View style={[styles.row, styles.rowWhite]}>
          <Text style={[styles.label, styles.fixedWidth]}>Account Number:</Text>
          <Text
            style={[styles.value, styles.fixedWidth]}>{`XX${data.accNo}`}</Text>
        </View>
      </View>
      <Text style={styles.heading}>Transaction List</Text>
      <TabComponent data={data.transactionList} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    padding: 20,
  },
  fixedWidth: {
    width: '50%', // Fixed width for both columns
  },
  rowGrey: {
    backgroundColor: '#f0f0f0', // Light grey background for even rows
  },
  rowWhite: {
    backgroundColor: '#ffffff', // White background for odd rows
  },
  label: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    textAlign: 'right',
  },
});

export default AccountDetailsScreen;
