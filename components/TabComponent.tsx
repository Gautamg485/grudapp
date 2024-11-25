import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import TransactionList from './TransactionList';

const TabComponent = ({data}) => {
  // State to keep track of the active tab
  const [activeTab, setActiveTab] = useState('all');

  // Function to render content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'all':
        return (
          <TransactionList
            data={[...(data.debit ?? []), ...(data.credit ?? [])]}
          />
        );
      case 'credit':
        return <TransactionList data={data.credit} />;
      case 'debit':
        return <TransactionList data={data.debit} />;
      default:
        return (
          <TransactionList
            data={[...(data.debit ?? []), ...(data.credit ?? [])]}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Navigation Buttons */}
      {/* <Text>{JSON.stringify(data)}</Text> */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'all' && styles.activeTabText,
            ]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'credit' && styles.activeTab]}
          onPress={() => setActiveTab('credit')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'credit' && styles.activeTabText,
            ]}>
            Credit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'debit' && styles.activeTab]}
          onPress={() => setActiveTab('debit')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'debit' && styles.activeTabText,
            ]}>
            Debit
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f4f4f4',
    paddingTop: 10,
    paddingBottom: 10,
  },
  tab: {
    padding: 10,
    margin: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    minWidth: 80, // Set minimum width for the tab
    alignItems: 'center', // Ensure text is centered horizontally
    justifyContent: 'center', // Center text vertically
  },
  activeTab: {
    backgroundColor: 'blue',
  },
  tabText: {
    fontSize: 16,
    color: '#000',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    padding: 20,
  },
});

export default TabComponent;
