import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {getDisplayDate} from '../utils/generalUtil';

const TransactionList = ({data}) => {
  return (
    <ScrollView>
      <View style={styles.table}>
        {data && data.length ? (
          data.map((value, key) => {
            return (
              <View style={styles.row}>
                <View style={[styles.cell, styles.fixedWidth]}>
                  <Text style={styles.label}>
                    {value.regexMerchantName && value.regexMerchantName !== ''
                      ? value.regexMerchantName.toUpperCase()
                      : value.advRegexMerchantName
                      ? value.advRegexMerchantName.toUpperCase()
                      : value.transaction && value.transaction.merchant
                      ? value.transaction.merchant.toUpperCase()
                      : '-'}
                  </Text>
                  <Text style={styles.shortlabel}>
                    {getDisplayDate(value.date)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.cell,
                    styles.fixedWidth,
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
          <Text>{'No Transaction'}</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  table: {},
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  fixedWidth: {
    width: 150,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  redColor: {
    color: 'red', // White background for odd rows
  },
  greenColor: {
    color: 'green', // White background for odd rows
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    // wordWrap: 'break-word',
  },
  shortlabel: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 14,
    textAlign: 'right',
  },
});

export default TransactionList;
