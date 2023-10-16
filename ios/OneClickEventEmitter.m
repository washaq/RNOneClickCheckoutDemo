//
//  OneClickEventEmitter.m
//  RNOneClickCheckoutDemo
//
//  Created by Muhammad Washaq Majeed on 16/10/2023.
//

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
