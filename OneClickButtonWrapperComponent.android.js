import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const OneClickButtonWrapperComponent = ({
  clientId,
  redirectUri,
  buttonStyle,
  environment,
  fetchInvoiceCallback,
  onComplete,
  ...props
}) => {

  return (
    <View style={styles.buttonContainer}>
      <Text style={styles.comingSoonText}>Coming Soon</Text>
    </View>
  );  
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: 88,
    width: '95%', // Set the container width to the screen width
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  comingSoonText: {
    // Style your text as needed
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OneClickButtonWrapperComponent;