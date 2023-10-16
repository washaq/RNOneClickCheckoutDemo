/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import OneClickButtonWrapperComponent from './OneClickButtonWrapperComponent.js';

const App = () => {
  const onComplete = (status: string) => {
    // Logic for handling completion
    console.log("handle complete "+status)
    Alert.alert(
      '',
      'Invoice Status = '+status,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') }
      ],
      { cancelable: false }
    );
  };

  const fetchInvoiceCallback = async () => {
    return "Return Invoice Id"
  };

  return (
    <View style={styles.container}>
      {/* Other components */}
      <OneClickButtonWrapperComponent
        clientId="Merchant Mobile Client Id" // Provice your mobile client id
        redirectUri="Provide-Your-Redirect-Uri://careemcallback" // provide redirectUri
        buttonStyle={{   // button style optional default values are ( midnightBlue, dark, 28.0)
          style: 'midnightBlue',  // background color of button, has three options: midnightBlue / green / white
          buttonDescription: 'dark', // text color of the description that is underneath the button, has two options: dark / light
          cornerRadius: 28.0 // Corner radius of the button 
        }}
        environment="staging" // Environment: staging / production 
        fetchInvoiceCallback={fetchInvoiceCallback} // Pass the function as a prop that return invoice id 
        onComplete={onComplete} // Pass the onComplete function as a prop that will receive final status of payment has 5 options: success / alreadyPaid / failed / cancelled / invalidInvoiceId 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default App;