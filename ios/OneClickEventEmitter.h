//
//  OneClickEventEmitter.h
//  RNOneClickCheckoutDemo
//
//  Created by Muhammad Washaq Majeed on 16/10/2023.
//

#import <React/RCTEventEmitter.h>

@interface OneClickEventEmitter : RCTEventEmitter

- (void)sendFetchInvoiceCallbackEvent;
- (void)sendOnCompleteCallbackEvent: (NSDictionary *) body;

@end
