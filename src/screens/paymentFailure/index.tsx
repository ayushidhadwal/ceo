import {
  View,
  Text,
  BackHandler,
  Platform,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Pressable} from 'native-base';
import i18n from '../../language/I18n';
import {ImageLoad} from '../../services/generalservices';
import {useNavigation} from '@react-navigation/native';
import httpClient from '../../hooks/useHttp';
import I18n from 'i18n-js';
import styles from './style';
import CustomText from '../../constants/CustomText';
import Colors from '../../constants/Colors';
import {ActivityIndicator} from 'react-native-paper';

const PaymentFailure = ({route}: any) => {
  const navigation = useNavigation();
  const {bookingId} = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const {width, height} = useWindowDimensions();
  const [booking_details, setBooking_details] = useState(null);
  const [ payment_summary, setPayment_summary] = useState(null);
  const onAndroidBackPress = () => {
    return false;
  };
  useEffect(() => {
    httpClient
      .get(`/booking-details/${bookingId}`)
      .then(res => {
        console.log('response of failure is ', res);
        // showToast({msg:"Schedule Available",color:"green.600"})
        // setApplicationData(res.data.data);
        // setBooking_details(res?.data?.data?.booking_details);
        // setPayment_summary(res?.data?.data?.payment_summary);
        if (res.data.data !== null) {
          setBooking_details(res.data.data?.booking_details);
          // setPayment_summary(res.data.data.payment_summary);
          // console.log('neha', res.data.data.payment_summary);
          if (
            res.data.data?.booking_details[0].value.toLowerCase() ===
              'meeting rooms' ||
            res.data.data?.booking_details[0].value.toLowerCase() ===
              'conference' ||
            res.data.data?.booking_details[0].value === 'غرف الإجتماعات' ||
            res.data.data?.booking_details[0].value === 'مؤتمرات'
          ) {
            setPayment_summary(() => {
              const myArray = [...res.data.data.payment_summary];
              const a = myArray.findIndex(
                m =>
                  m.title.toLowerCase() === 'base price' ||
                  m.title === 'السعر الأساسي',
              );
              if (a > -1) {
                myArray.splice(a, 1);
              }
              return myArray;
            });
          } else {
            setPayment_summary(res.data.data.payment_summary);
          }
          // setPayment_summary(a);
          // navigation.navigate('PaymentScreen', {
          //   paymentUrl: res.data.data?.payment_url,
          //   bookingId: res.data.data?.booking_id,
          // });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}>
        <ActivityIndicator color={'#C46537'} />
      </View>
    );
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}></View>
      <ImageLoad
        url={
          'https://demo.creativitykw.com/P168-CEO/P168-CEO-Backend/public/storage/images/7432005.png'
        }
        style={{
          height: 70,
          width: 70,
          borderRadius: 10,
          marginBottom: 8,
          marginTop: 24,
        }}></ImageLoad>
      <Text style={{fontSize: 18, fontWeight: 'bold'}}>
        {i18n.t('Payment Failure')}
      </Text>
      <ScrollView>
        {/* <View
          style={[
            styles.detailCard,
            {
              width: width - 32,
              marginTop: 26,
              // height:180,
            },
          ]}>
          <Text
            style={[
              CustomText[70020],
              {color: Colors.darkBlack, opacity: 0.82, marginBottom: 16},
            ]}>
            {I18n.t('BookingDetails')}
          </Text>

          {  booking_details?.map(detail => {
            return (
              <View style={styles.detailRow}>
                <Text style={styles.fontRegular}>{detail.title}</Text>

                {Array.isArray(detail.value) ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      width: width - 120,
                      flexWrap: 'wrap',
                      justifyContent: 'flex-end',
                    }}>
                    {detail.value?.map(slot => {
                      return <Text>{`${slot} `}</Text>;
                    })}
                  </View>
                ) : (
                  <Text style={styles.fontSemibold}>{detail.value}</Text>
                )}
              </View>
            );
          })}

          
        </View> */}
        {/* Bookin Details Ends Here */}

        {/* Payment Summary */}
        {/* <View style={[styles.detailCard, {width: width - 32}]}>
          <Text
            style={[
              CustomText[70020],
              {color: Colors.darkBlack, opacity: 0.82, marginBottom: 16},
            ]}>
            {I18n.t('PaymentSummary')}
          </Text>

          {payment_summary?.map(detail => {
            return (
              <View style={styles.detailRow}>
                <Text style={styles.fontRegular}>{detail.title}</Text>
                <Text style={styles.fontSemibold}>
                 
                  {detail.value}
                </Text>
              </View>
            );
          })}

        
        </View> */}
        {/* Payment summary Ends Here */}
      </ScrollView>
      <Pressable
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{name: 'HomeScreen'}],
          });
        }}>
        <Text
          style={{
            fontSize: 22,
            marginTop: 20,
            marginBottom: 20,
            textDecorationLine: 'underline',
          }}>
          {i18n.t('GoToHome')}
        </Text>
      </Pressable>
    </View>
  );
};

export default PaymentFailure;
