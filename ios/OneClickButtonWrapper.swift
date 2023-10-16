//
//  OneClickButtonWrapper.swift
//  RNOneClickCheckoutDemo
//
//  Created by Muhammad Washaq Majeed on 16/10/2023.
//

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
