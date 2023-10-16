//
//  OneClickButtonWrapperBridge.m
//  RNOneClickCheckoutDemo
//
//  Created by Muhammad Washaq Majeed on 16/10/2023.
//

#import "RNOneClickCheckoutDemo-Swift.h" // Import the Swift header
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
