import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

const BioMetricScreen = ({setIsBioMetricAuthenticated}) => {
  const checkBioMetricStatus = async () => {
    try {
      const rnBiometrics = new ReactNativeBiometrics({
        allowDeviceCredentials: true,
      });
      const {success, error} = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate to continue',
      });

      if (success) {
        console.log('setIsBioMetricAuthenticated');
        setIsBioMetricAuthenticated(true);
        return true;
      } else {
        setIsBioMetricAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('[handleBiometricAuth] Error:', error);
      Alert.alert('Error', 'Biometric authentication failed from device');
      return false;
    }
  };

  useEffect(() => {
    checkBioMetricStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authentication Required</Text>
      <TouchableOpacity
        style={styles.facebookButton}
        onPress={checkBioMetricStatus}>
        <View style={styles.googleButtonContent}>
          <Text style={styles.googleButtonText}>Authenticate</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  facebookButton: {
    backgroundColor: '#000000', // Facebook blue
    width: '100%',
    height: 50,
    marginTop: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
});

export default BioMetricScreen;
