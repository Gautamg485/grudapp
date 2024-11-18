import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AccountCard = ({ data }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardNumber}>*** {data.accNo}</Text>
      <Text style={styles.cardHolderName}>{data.bankName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    margin: 10,
    width: '90%',
    alignSelf: 'center',
    elevation: 5, // For Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardHolderName: {
    fontSize: 16,
    marginBottom: 10,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardDetail: {
    fontSize: 14,
    color: '#888',
  },
});

export default AccountCard;