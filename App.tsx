/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';

const App = () => {

  let OneClickButtonWrapperComponent;
  if (Platform.OS === 'ios') {
    OneClickButtonWrapperComponent = require('./OneClickButtonWrapperComponent.ios.js').default;
  } else {
    OneClickButtonWrapperComponent = require('./OneClickButtonWrapperComponent.android.js').default;
  }
  
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
    return "4404abcb-b116-47ac-ade1-6a96d543f5ae"
  };
  if (Platform.OS === 'ios') {
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
  } else {
    return (
      <View style={styles.container}>
        {/* Other components */}
        <OneClickButtonWrapperComponent
          clientId="Merchant Mobile Client Id" // Provice your mobile client id
          redirectUri="Provide-Your-Redirect-Uri://careemcallback" // provide redirectUri
          invoiceId = "Invoice Id" // provide invoice id 
          buttonShape = "Rounded" //shape : Rounded / Rectangle / SemiRounded
          buttonColor = "MidNightBlue" //Color :  Green / MidNightBlue / White
          environment="staging" // Environment: staging / production 
          onComplete={onComplete} // Pass the onComplete function as a prop that will receive final status of payment has 5 options: success / alreadyPaid / failed / cancelled / invalidInvoiceId 
        />
      </View>
    );
  }

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default App;