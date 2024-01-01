import {
  View,
  Text,
  useWindowDimensions,
  Image,
  ScrollView,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomButton from '../../constants/components/CustomButton';
import styles from './style';
import Colors from '../../constants/Colors';
import CustomText from '../../constants/CustomText';
import I18n from '../../language/I18n';
import httpClient from '../../hooks/useHttp';
import {ActivityIndicator} from 'react-native-paper';
import i18n from 'i18n-js';

const BookingSuccessScreen = ({navigation, route}: any) => {
  const {bookingId} = route.params;
  // console.log(title);
  const [isLoading, setIsLoading] = useState(false);

  const {width, height} = useWindowDimensions();
  const [booking_details, setBooking_details] = useState(null);
  const [payment_summary, setPayment_summary] = useState(null);
  // const [paymentSummary, setPaymentSummary] = useState([]);
  // console.log(height);
  // console.log('payment_summary', payment_summary, 'qwerty', booking_details);

  // Device back Handler

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    setIsLoading(true);
    httpClient
      .get(`/booking-details/${bookingId}`)
      .then(res => {
        // showToast({msg:"Schedule Available",color:"green.600"})
        // setApplicationData(res.data.data);
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

    return () => backHandler.remove();
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
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: 'white',
      }}>
      <ScrollView>
        <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center'}}>
          <Image
            source={require('../../assets/successorange.png')}
            style={{
              height: height > 650 ? 140 : 40,
              width: height > 650 ? 150 : 40,
              marginTop: 16,
            }}
            resizeMode="contain"
          />

          <Text
            numberOfLines={2}
            style={[
              CustomText[70020],
              {
                color: Colors.darkBlack,
                opacity: 0.82,
                width: 250,
                marginTop: 16,
                textAlign: 'center',
              },
            ]}>
            {I18n.t('BookingSuccessText')}
          </Text>

          <View
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

            {booking_details?.map(detail => {
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
                      {detail.value.map(slot => {
                        return <Text>{`${slot} `}</Text>;
                      })}
                    </View>
                  ) : (
                    <Text style={styles.fontSemibold}>{detail.value}</Text>
                  )}
                </View>
              );
            })}

            {/* <View
            style={[
              {
                marginVertical: 12,
              },
              styles.detailRow,
            ]}>
            <Text style={styles.fontRegular}>{I18n.t('Date')}</Text>
            <Text style={styles.fontSemibold}>
              {title == 'Meeting rooms' || title == 'Events'
                ? '14/08/22'
                : '14/08/22 - 14/09/22'}
            </Text>
          </View> */}
            {/*  add time only when title is Meeting rooms */}

            {/* {title == 'Meeting rooms' || title == 'Events' ? (
            <View
              style={[
                {
                  marginBottom: 12,
                },
                styles.detailRow,
              ]}>
              <Text style={styles.fontRegular}>{I18n.t('Time')}</Text>
              <Text style={styles.fontSemibold}>
                {title == 'Events' ? '16:30' : '10:00, 11:00, 12:00'}
              </Text>
            </View>
          ) : null} */}
            {/* <View style={styles.detailRow}>
            <Text style={styles.fontRegular}>{I18n.t('Venue')}</Text>
            <Text style={styles.fontSemibold}>Al Hamra tower</Text>
          </View> */}
          </View>
          {/* Bookin Details Ends Here */}

          {/* Payment Summary */}
          <View style={[styles.detailCard, {width: width - 32}]}>
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
                    {/* {I18n.t(
                    title == 'Select Type'
                      ? 'SelectType'
                      : title == 'Meeting rooms'
                      ? 'MeetingRooms'
                      : title,
                  )} */}
                    {detail.value}
                  </Text>
                </View>
              );
            })}

            {/* <View style={styles.detailRow}>
            <Text style={styles.fontRegular}>{I18n.t('BasePrice')}</Text>
            <Text style={styles.fontSemibold}>60 {I18n.t('Kd')}</Text>
          </View> */}

            {/* <View style={styles.detailRow}>
            <Text style={styles.fontRegular}>{I18n.t('GrandTotal')}</Text>
            <Text style={[styles.fontSemibold, {fontWeight: '800'}]}>
              1800 {I18n.t('Kd')}
            </Text>
          </View> */}
          </View>
          {/* Payment summary Ends Here */}
        </View>
      </ScrollView>
      <CustomButton
        onPress={() => {
          navigation.navigate('HomeScreen', {
            paymentSuccess: Math.random().toString(),
          });
        }}
        label="GoToHome"
        style={{color: 'white'}}
      />
    </View>
  );
};

export default BookingSuccessScreen;
