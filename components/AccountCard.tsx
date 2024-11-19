import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const AccountCard = ({data}) => {
  return (
    <View style={styles.card} key={data.number}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{data.bankName}</Text>
        <Text style={styles.cardNumber}>{data.accNo}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardNumber: {
    fontSize: 16,
    color: '#888',
  },
});

export default AccountCard;
