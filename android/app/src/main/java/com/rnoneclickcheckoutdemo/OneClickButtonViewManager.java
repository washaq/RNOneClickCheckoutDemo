package com.rnoneclickcheckoutdemo;


import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.careem.oneclicksdk.startup.OneClickButtonInterface;
import com.careem.oneclicksdk.startup.OneClickCheckoutLayout;
import com.careem.oneclicksdk.startup.TransactionState;
import com.careem.oneclicksdk.utils.CareemButtonColor;
import com.careem.oneclicksdk.utils.CareemButtonShape;
import com.careem.oneclicksdk.utils.CareemButtonStyle;
import com.careem.oneclicksdk.utils.PaymentEnvironment;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.annotations.ReactPropGroup;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import kotlin.coroutines.Continuation;

public class OneClickButtonViewManager extends SimpleViewManager<OneClickCheckoutLayout> {

    public static final String REACT_CLASS = "OneClickButtonWrapper";
    private ThemedReactContext themedReactContext;

    private String clientId = null;
    private String environment = null;
    private String redirectUrl = null;

    private String buttonColor = "Green";

    private String buttonShape = "Rounded";

    private String invoiceId = "";


    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @NonNull
    @Override
    protected OneClickCheckoutLayout createViewInstance(@NonNull ThemedReactContext themedReactContext) {
        this.themedReactContext = themedReactContext;
        return new OneClickCheckoutLayout(themedReactContext.getReactApplicationContext().getCurrentActivity());
    }


    @ReactProp(name = "clientId")
    public void setClientId(OneClickCheckoutLayout oneClickButton, String clientId) {
        this.clientId = clientId;
        configureButton(oneClickButton);
    }

    @ReactProp(name = "environment")
    public void setEnvironment(OneClickCheckoutLayout oneClickButton, String environment) {
        this.environment = environment;
        configureButton(oneClickButton);
    }

    @ReactProp(name = "redirectUrl")
    public void setRedirectUrl(OneClickCheckoutLayout oneClickButton, String redirectUrl) {
        this.redirectUrl = redirectUrl;
        configureButton(oneClickButton);
    }

    @ReactProp(name = "buttonColor")
    public void setButtonColor(OneClickCheckoutLayout oneClickButton, String buttonColor) {
        this.buttonColor = buttonColor;
        configureButton(oneClickButton);
    }

    @ReactProp(name = "buttonShape")
    public void setButtonShape(OneClickCheckoutLayout oneClickButton, String buttonShape) {
        this.buttonShape = buttonShape;
        configureButton(oneClickButton);
    }

    @ReactProp(name = "invoiceId") // Add this line to define the prop
    public void setInvoiceId(OneClickCheckoutLayout oneClickButton, String invoiceId) {
        this.invoiceId = invoiceId;
        configureButton(oneClickButton);
    }

    private PaymentEnvironment parsePaymentEnvironment(String environment) {
        if ("STAGING".equals(environment)) {
            return PaymentEnvironment.STAGING;
        } else if ("LIVE".equals(environment)) {
            return PaymentEnvironment.LIVE;
        } else {
            // Handle invalid environment
            return PaymentEnvironment.STAGING; // Default to STAGING or handle accordingly
        }
    }

    private CareemButtonStyle parseButtonStyle(String color, String shape) {
        return new CareemButtonStyle(getButtonColor(color), getButtonShape(shape));
    }

    private CareemButtonColor getButtonColor(String color) {
        if ("Green".equals(color)) {
            return CareemButtonColor.Green;
        } else if ("MidNightBlue".equals(color)) {
            return CareemButtonColor.MidNightBlue;
        } else if ("White".equals(color)) {
            return CareemButtonColor.White;
        } else {
            return CareemButtonColor.Green;
        }
    }

    private CareemButtonShape getButtonShape(String shape) {
        if ("Rounded".equals(shape)) {
            return CareemButtonShape.Rounded;
        } else if ("Rectangle".equals(shape)) {
            return CareemButtonShape.Rectangle;
        } else if ("SemiRounded".equals(shape)) {
            return CareemButtonShape.SemiRounded;
        } else {
            return CareemButtonShape.Rounded;
        }
    }


    private void configureButton(OneClickCheckoutLayout oneClickButton) {
        if (clientId != null && environment != null && redirectUrl != null) {
            oneClickButton.configureButton(
                    new OneClickButtonInterface() {
                        @Nullable
                        @Override
                        public Object getInvoiceId(@NonNull Continuation<? super String> continuation) {
                            sendEvent("getInvoiceId", null);
                            return invoiceId;
                        }

                        @Override
                        public void onCompletePayment(@NonNull TransactionState transactionState, @NonNull String invoiceId) {
                            String state = "";
                            if (transactionState instanceof TransactionState.TransactionSuccess) {
                                state = "TransactionSuccess";
                            } else if (transactionState instanceof TransactionState.TransactionFailure) {
                                state = "TransactionFailure";
                            } else if (transactionState instanceof TransactionState.TransactionCancelled) {
                                state = "TransactionCancelled";
                            } else if (transactionState instanceof TransactionState.InvalidInvoice) {
                                state = "InvalidInvoice";
                            }
                            WritableMap params = Arguments.createMap();
                            params.putString("transactionState", state);
                            params.putString("invoiceId", invoiceId);
                            sendEvent("onCompletePayment", params);
                        }
                    },
                    clientId,
                    parsePaymentEnvironment(environment),
                    redirectUrl,
                    parseButtonStyle(buttonColor, buttonShape));
        }
    }

    private void sendEvent(String eventName, WritableMap params) {
        themedReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
}
