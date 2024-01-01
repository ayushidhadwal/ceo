import {
  View,
  Text,
  ToastAndroid,
  BackHandler,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {WebView} from 'react-native-webview';

const PaymentScreen = ({navigation, route}: any) => {
  const {params} = route;
  const webViewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const onAndroidBackPress = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
      return true; // prevent default behavior (exit app)
    }
    return false;
  };
  const Toast = (msg: any) => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };
  useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
      return () => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onAndroidBackPress,
        );
      };
    }
  }, []);

  if (isLoading) {
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator />
    </View>;
  }
  return (
    <View style={{flex: 1}}>
      <WebView
        style={{flex: 1}}
        ref={webViewRef}
        source={{
          uri: params.paymentUrl,
        }}
        onLoadStart={syntheticEvent => {
          // update component to be aware of loading status
          const {nativeEvent} = syntheticEvent;

          //   if (nativeEvent && nativeEvent.url) {
          const path =
            nativeEvent.url.split('/')[nativeEvent.url.split('/').length - 1];
          // remove query string from url

          if (nativeEvent.url.split('/').length > 1) {
            if (path.match('payment-success')) {
              navigation.replace('BookingSuccessScreen', {
                bookingId: params.bookingId,
              });
            } else if (path.match('payment-faild')) {
              navigation.navigate('PaymentFailure',{
                bookingId: params.bookingId,
              });
            }
          }

          //   }
        }}
      />
    </View>
  );
};

export default PaymentScreen;
