import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const AccountCard = ({data, navigation}) => {
  return (
    <View style={styles.card} key={data.number}>
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.cardTitle}>
            {data.bankName ? data.bankName.toUpperCase() : ''}
          </Text>
          <Text style={styles.cardTitle}>{`XX${data.accNo}`}</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.replace('AccountDetails', {
              data: data,
            });
          }}>
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
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
