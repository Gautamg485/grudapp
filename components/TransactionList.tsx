import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

const TransactionList = ({data}) => {
  return (
    <ScrollView style={styles.table}>
      {data && data.length ? (
        data.map((value, key) => {
          return (
            <View style={[styles.row, styles.rowWhite]} key={key}>
              <Text style={styles.label}>
                {value.regexMerchantName && value.regexMerchantName !== ''
                  ? value.regexMerchantName.toUpperCase()
                  : value.advRegexMerchantName
                  ? value.advRegexMerchantName.toUpperCase()
                  : value.transaction && value.transaction.merchant
                  ? value.transaction.merchant.toUpperCase()
                  : '-'}
              </Text>
              <Text
                style={[
                  styles.value,
                  value.transactionType && value.transactionType === 'debit'
                    ? styles.redColor
                    : styles.greenColor,
                ]}>
                {value.transactionType && value.transactionType === 'debit'
                  ? '-'
                  : '+'}{' '}
                Rs. {value.transaction.amount}
              </Text>
            </View>
          );
        })
      ) : (
        <Text>No Transaction</Text>
      )}
    </ScrollView>
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
  redColor: {
    color: 'red', // White background for odd rows
  },
  greenColor: {
    color: 'green', // White background for odd rows
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

export default TransactionList;
