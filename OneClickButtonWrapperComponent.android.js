import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { requireNativeComponent, NativeEventEmitter, NativeModules} from 'react-native';
export const OneClickButtonView = requireNativeComponent('OneClickButtonWrapper');

const OneClickButtonWrapperComponent = ({
  clientId,
  redirectUri,
  invoiceId,
  buttonShape,
  buttonColor,
  environment,
  onComplete,
  ...props
}) => {

  const customViewEventEmitter = new NativeEventEmitter();

    // Define a function to handle the custom event
    const handleGetInvoiceiId = async () => {
        console.log('handleGetInvoiceiId');
    };

  

    const handleOnCompletePayment = (event) => {
      console.log('OnCompleteCallback status :', event.transactionState);
      onComplete(event.transactionState)
  };

    // Add a listener for the custom event
    React.useEffect(() => {
        const getInvoiceIdSubscription = customViewEventEmitter.addListener(
            'getInvoiceId',
            handleGetInvoiceiId
        );

        const getOnCompletePaymentSubscription = customViewEventEmitter.addListener(
          'onCompletePayment',
          handleOnCompletePayment
      );

        return () => {
          getInvoiceIdSubscription.remove();
          getOnCompletePaymentSubscription.remove();
        };
    }, []);


  return (
    <OneClickButtonView clientId = {clientId} environment = {environment} 
    redirectUrl = {redirectUri} 
    buttonColor = {buttonColor}  
    buttonShape = {buttonShape} 
    invoiceId = {invoiceId}
    style={styles.buttonContainer} />
  );  
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: 88,
    width: '95%', // Set the container width to the screen width
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  comingSoonText: {
    // Style your text as needed
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OneClickButtonWrapperComponent;
