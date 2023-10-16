# RNOneClickCheckoutDemo
This is a RNOneClickCheckoutDemo project that explain how to use OneClickCheckout SDK in react native App.

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _iOS_ app:


### For iOS

```bash
# install pod dependencis
cd ios/

# then run
bundle install && bundle exec pod install

# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see demo app running in your _iOS Simulator_ 

This is one way to run your app — you can also run it directly from within Xcode.

## Step 3: Modifying your App

Now that you have successfully run the demo app, let's modify your app to integerate OneClickCheckout SDK in it.

1.Open Your project in Xcode.
2. Open `Podfile`.
3. Add these frameworks in podfile. Use 1.2.0 or greater version of `OneClickCheckout` for React Native apps. You can see all versions [here](https://careempublic.jfrog.io/ui/native/careem-cocopod-local/OneClickCheckout-iOS). Exclude `arm64` architecture for simulators and add it in `post_install`.

```bash
# .......

pod 'Analytika', :http => 'https://careempublic.jfrog.io/artifactory/careem-maven-local/com/careem/analytika/analytika-ios-universal-framework/0.57.0/analytika-ios-universal-framework-0.57.0.zip'

pod 'OneClickCheckout', :http => "https://careempublic.jfrog.io/artifactory/careem-cocopod-local/OneClickCheckout-iOS/1.2.0/OneClickCheckout.zip"

# .......

# Exclude `arm64` architecture for simulators.
post_install do |installer|
    # ....... other script

    installer.pods_project.targets.each do |target|
        target.build_configurations.each do |config|
          # Disable arm64 builds for the simulator
          config.build_settings['EXCLUDED_ARCHS[sdk=iphonesimulator*]'] = 'arm64'
        end
      end

  # ....... other script
  end
```
3. Exclude `arm64` for `Any iOS Simulator SDK` from your target as well as shown in the image `YourProject -> Target -> Build Settings -> Excluded Architecture`
![Excluded](screenshots/excluded.png)
4. Install dependencies now
```bash
# install pod dependencis
cd ios/

# then run
pod install
```
5. Let's add the wrappers and bridging required to use OneClickSDK. Right-click on your project name in Xcode and create a New Group with a name, just so we can have all the wrappers in one folder, i.e., 'OneClickCheckoutHelper'.
Rite click on folder and add Swift file with the name `OneClickButtonWrapper`. If you don't already have `YourProjectName-Bridging-Header.h` the it will ask you **Would you like to configure an Objective-C bridging header?** click on **Create Bridging Header**. Also create `OneClickEventEmitter.h` and `OneClickEventEmitter.m` for emitter and also create bridge for React native `OneClickButtonWrapperBridge.m`. Replace bellow code in each class or copy it from demo app.
![swift](screenshots/swift.png)
![bridgingHeader](screenshots/bridgingHeader.png)
```swift
// OneClickButtonWrapper.swift
import React
import OneClickCheckout

@objc(OneClickButtonWrapper)
class OneClickButtonWrapper: RCTViewManager {
  // Reference to the OneClickButtonView instance
  private var buttonView: OneClickButtonView?
  
  private var cb: ((Result<String, Error>) -> Void)?
  
  private var customEventEmitter: OneClickEventEmitter? {
    let bridge = RCTBridge.current()
    let eventEmitter = bridge?.module(for: OneClickEventEmitter.self) as? OneClickEventEmitter
    return eventEmitter
  }
  
  override func view() -> UIView! {
    buttonView = OneClickButtonView()
    return buttonView
  }
  
  // Expose a method to configure the button from JavaScript
  @objc func handleFetchInvoiceResult(_ invoiceId: String) {
    print("Invoice ID \(invoiceId)")
    self.cb?(.success(invoiceId))
  }
  
  @objc func configure(
    _ clientId: String,
    redirectUri: String,
    buttonStyle: NSDictionary,
    environment: String
  ) {
    guard let buttonView = buttonView else { return }
    
    let rootViewController = RCTPresentedViewController()
    guard let currentViewController = rootViewController ?? (UIApplication.shared.connectedScenes.first as? UIWindowScene)?.windows.first?.rootViewController else {
      return
    }
    
    // Convert buttonStyle NSDictionary to a Swift struct
    //    let style = CareemButtonStyle(dictionary: buttonStyle)
    let style = CareemButtonStyle(dict: buttonStyle)
    
    // Convert environment string to the corresponding enum value
    guard let environmentEnum = Environment(rawValue: environment) else {
      return
    }
    
    // Create a callback function for fetchInvoiceCallback
    let fetchInvoiceCallbackBlock: (@escaping (Result<String, Error>) -> Void) -> Void = { [weak self] resultCallback in
      guard let self else { return }
      // Perform the necessary operations and invoke the resultCallback
      // with the appropriate Result value
      // ...
      self.cb = resultCallback
      self.customEventEmitter?.sendFetchInvoiceCallbackEvent()
    }
    
    // Create a callback function for onComplete
    let onCompleteBlock: (TransactionStatus) -> Void = { [weak self] transactionStatus in
      guard let self else { return }
      self.sendOnCompleteCallbackEvent(status: transactionStatus)
    }
    
    DispatchQueue.main.async {
      buttonView.configure(
        viewController: currentViewController,
        clientId: clientId,
        redirectUri: redirectUri,
        buttonStyle: style,
        environment: environmentEnum,
        fetchInvoiceCallback: fetchInvoiceCallbackBlock,
        onComplete: onCompleteBlock
      )
    }
  }
  
  func sendOnCompleteCallbackEvent(status: TransactionStatus) {
    let eventData: [String: Any] = [
      "status": status.value,
    ]
    customEventEmitter?.send(onCompleteCallbackEvent: eventData)
  }
  
  // Register the module with React Native
  override static func moduleName() -> String! {
    return "OneClickButtonWrapper"
  }
  
  // Optionally, export any methods or constants required by your module
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc static func resumeAuthorizationFlow(url: NSURL) {
    // Implementation of your static function
    if let url = url as URL? {
      AuthenticateHandler.sharedInstance.resumeAuthorizationFlow(url: url)
    }
  }
}
```

```objective-c
// RNOneClickCheckoutDemo-Bridging-Header.h

#import "React/RCTBridgeModule.h"

// required only for UI Views
#import "React/RCTViewManager.h"
// required only for Event Emitters
#import "React/RCTEventEmitter.h"
// required for calling methods on ViewManagers
#import "React/RCTUIManager.h"

#import "OneClickEventEmitter.h" // Import the CustomEventEmitter header
```

```objective-c
// OneClickEventEmitter.h

#import <React/RCTEventEmitter.h>

@interface OneClickEventEmitter : RCTEventEmitter

- (void)sendFetchInvoiceCallbackEvent;
- (void)sendOnCompleteCallbackEvent: (NSDictionary *) body;

@end
```

```objective-c
// OneClickEventEmitter.m

#import "OneClickEventEmitter.h"

@implementation OneClickEventEmitter

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[@"OnCompleteCallback", @"OnFetchInvoiceCallback"];
}

- (void)startObserving {
  // Required override, but no implementation needed here
}

- (void)stopObserving {
  // Required override, but no implementation needed here
}

- (void)sendOnCompleteCallbackEvent: (NSDictionary *) body {
  [self sendEventWithName:@"OnCompleteCallback" body:body];
}

- (void)sendFetchInvoiceCallbackEvent {
  [self sendEventWithName:@"OnFetchInvoiceCallback" body:nil];
}

@end
```

```objective-c
// OneClickButtonWrapperBridge.m

#import "YourProjectName-Swift.h" // Import the Swift header replace YourProjectName with then name of your project.
#import <React/RCTViewManager.h>

@interface OneClickButtonWrapperBridge : RCTViewManager

@property (nonatomic, strong) OneClickButtonWrapper *buttonWrapper;

@end

@implementation OneClickButtonWrapperBridge

RCT_EXPORT_MODULE(OneClickButtonWrapper)

- (UIView *)view
{
  self.buttonWrapper = [[OneClickButtonWrapper alloc] init];
  return self.buttonWrapper.view;
}

RCT_EXPORT_METHOD(configureWithRef:(NSString *)clientId
                  redirectUri:(NSString *)redirectUri
                  buttonStyle:(NSDictionary *)buttonStyle
                  environment:(NSString *)environment) {
  dispatch_async(dispatch_get_main_queue(), ^{
    // Retrieve the UIView instance using the provided viewRef
    if (self.buttonWrapper) {
      [self.buttonWrapper configure:clientId
                                    redirectUri:redirectUri
                                    buttonStyle:buttonStyle
                                    environment:environment];
    } else {
      NSLog(@"Error: buttonWrapper instance not found.");
    }
  });
}

RCT_EXPORT_METHOD(handleFetchInvoiceResult:(NSString *)invoiceId) {
  dispatch_async(dispatch_get_main_queue(), ^{
    // Retrieve the UIView instance using the provided viewRef
    if (self.buttonWrapper) {
      [self.buttonWrapper handleFetchInvoiceResult:invoiceId];
    } else {
      NSLog(@"Error: buttonWrapper instance not found.");
    }
  });
}

@end
```

5. In `AppDelegate.mm` add following code.
```objective-c
// AppDelegate.mm
#import "YourProjectName-Swift.h" // Import the Swift header replace YourProjectName with then name of your project.
// ....
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  [OneClickButtonWrapper resumeAuthorizationFlowWithUrl:url];
  return  true;
}

```
6. Add `careem-connect` as LSApplicationQueriesSchemes and redirectUri as URL scheme in info.plist. Also add `Allow Arbitrary Loads` in `App Transport Security Settings` as shown in image.
![Info.plist](screenshots/info.png)
7. Now we need to create a `.js` wrapper on react native side that will use native code. Create `OneClickButtonWrapperComponent.js` fine on react native side. and copy the following code.
```javascript
import React, { useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { requireNativeComponent, NativeEventEmitter, NativeModules } from 'react-native';

const { OneClickButtonWrapper, OneClickEventEmitter } = NativeModules;

const OneClickButtonView = requireNativeComponent('OneClickButtonWrapper');

const OneClickButtonWrapperComponent = ({
  clientId,
  redirectUri,
  buttonStyle,
  environment,
  fetchInvoiceId,
  handleComplete,
  ...props
}) => {
  const oneClickButtonRef = useRef(null);

  const configureButton = () => {    
    OneClickButtonWrapper.configureWithRef(
      clientId,
      redirectUri,
      buttonStyle,
      environment
    );
  };

  const handleFetchInvoiceCallback = async () => {
    console.log("handle fetchInvoiceCallback --");
  
    try {
      const invoiceId = await fetchInvoiceId();
      if (invoiceId) {
        handleFetchInvoiceResult(invoiceId);
      } else {
        // Handle the case where the API response is empty or an error occurred.
        console.error("Unable to fetch invoice ID.");
      }
    } catch (error) {
      // Handle any errors that occur during the API call.
      console.error("API call error:", error);
      handleFetchInvoiceResult('');
    }
  };

  const handleFetchInvoiceResult = (invoiceId) => {
    // Logic for handling fetch invoice
    OneClickButtonWrapper.handleFetchInvoiceResult(invoiceId)
  };
  const eventEmitterRef = useRef(null);

  const handleOnCompleteCallback = (event) => {
    const { status } = event;
    console.log('OnCompleteCallback status :', status);
    handleComplete(status)
  };


  useEffect(() => {
    eventEmitterRef.current = new NativeEventEmitter(OneClickEventEmitter);

    eventEmitterRef.current.addListener('OnCompleteCallback', handleOnCompleteCallback);
    eventEmitterRef.current.addListener('OnFetchInvoiceCallback', handleFetchInvoiceCallback);

    configureButton(); // Invoke configureButton when the component is mounted
    return () => {
        eventEmitterRef.current.removeListener('OnCompleteCallback', handleOnCompleteCallback);
        eventEmitterRef.current.removeListener('OnFetchInvoiceCallback', handleFetchInvoiceCallback);
    };
  }, []);

  return (
    <OneClickButtonView
      ref={oneClickButtonRef}
      style={styles.buttonContainer}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: 88, // Hieght of the button container is fix 88
    width: '95%', // Set the container width to the screen width
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OneClickButtonWrapperComponent;
```
8. Configuration of the button is required as follows to initialize the SDK correctly:
 - **clientId:** Client id of merchant (issued as part of onboarding by Careem)
 - **redirectUri:** Redirect uri, example com.your.app://careemcallback, use uri that when called by Careem will invoke your app.
 - **buttonStyle (optional):** Provide functionality to update button style, If not passed then it selects default value.
     - default value: CareemButtonStyle(style: CareemStyle.midnightBlue, buttonDescription: ButtonDescription.dark, cornerRadius: 28)
     - CareemStyle (.green, .white, .midnightBlue)
     - ButtonDescription (.dark, .light)
 - **environment:** Environment either sandbox or production.
 - **fetchInvoiceCallback:** The `fetchInvoiceCallback` is triggered when the user taps the 'One-Click Checkout' button. The merchant needs to generate an invoice and return it within this function.
  - **onComplete:** On complete callback which is called at the end of transaction with status (success, alreadyPaid, failed, cancelled, invalidInvoiceId(String)).
```javascript
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
    fetchInvoiceCallback={fetchInvoiceIdFromAPI} // Pass the function as a prop that return invoice id 
    onComplete={handleComplete} // Pass the handleComplete function as a prop that will receive final status of payment has 5 options: success / alreadyPaid / failed / cancelled / invalidInvoiceId 
  />

{/* Other components */}
const handleComplete = (status: string) => {
    // Logic for handling completion
    console.log("handle complete "+status)
};

const fetchInvoiceIdFromAPI = async () => {
    return "Return Invoice Id"
}
{/* Other components */}
```

## Congratulations! :tada:

You've successfully integerated OneClickCheckout SDK in your React Native App. :partying_face: