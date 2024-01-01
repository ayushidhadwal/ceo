import {View, Text, useWindowDimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../constants/Colors';
import styles from './style';
import CustomText from '../../constants/CustomText';
import CustomButton from '../../constants/components/CustomButton';
import I18n from '../../language/I18n';
import httpClient from '../../hooks/useHttp';
import {ActivityIndicator} from 'react-native-paper';
import {HStack} from 'native-base';

const CheckoutScreen = ({navigation, route}: any) => {
  const {booking_details_data, booking_data} = route.params;
  // console.log('booking_details_data', booking_details_data);
  // console.log('booking_data', booking_data);
  const title = 'Meeting rooms';

  const {booking_details, payment_summary} = booking_details_data;

  const [isLoading, setIsLoading] = useState(false);
  const [paymentSummary, setPaymentSummary] = useState([]);
  // console.log(booking_details[0].value);

  useEffect(() => {
    if (
      booking_details.length > 0 &&
      (booking_details[0].value.toLowerCase() === 'meeting rooms' ||
        booking_details[0].value.toLowerCase() === 'conference' ||
        booking_details[0].value === 'غرف الإجتماعات' ||
        booking_details[0].value === 'مؤتمرات')
    ) {
      setPaymentSummary(() => {
        const myArray = [...payment_summary];
        const a = myArray.findIndex(
          m =>
            m.title.toLowerCase() === 'base price' ||
            m.title === 'السعر الأساسي',
        );
        // console.log('ayuhis', a);
        if (a > -1) {
          myArray.splice(a, 1);
        }
        return myArray;
      });
    } else {
      setPaymentSummary(payment_summary);
    }
  }, [booking_details, payment_summary]);

  const paymentHandler = async () => {
    // navigation.navigate('BookingSuccessScreen', {
    //   title: title,
    // });
    setIsLoading(true);
    if (!booking_data.no_of_seats) {
      delete booking_data.no_of_seats;
    }

    console.log(booking_data);

    httpClient
      .post('/checkout', booking_data)
      .then(res => {
        // showToast({msg:"Schedule Available",color:"green.600"})
        // setApplicationData(res.data.data);
        if (res.data.data !== null) {
          navigation.navigate('PaymentScreen', {
            paymentUrl: res.data.data?.payment_url,
            bookingId: res.data.data?.booking_id,
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // var bookingDetails = [];
  // var paymentSummary = [];

  // //converting booking details
  // Object.keys(booking_details_data.booking_details).forEach((key, index) => {
  //   console.log(key, index);
  //   bookingDetails.push({
  //     key: key,
  //     value: Object.values(booking_details_data.booking_details)[index],
  //   });
  // });

  //converting payment summary
  // Object.keys(booking_details_data.payment_summary).forEach((key, index) => {
  //   console.log(key, index);
  //   paymentSummary.push({
  //     key: key,
  //     value: Object.values(booking_details_data.payment_summary)[index],
  //   });
  // });

  // console.log(bookingDetails);
  // console.log(paymentSummary);

  // console.log(Array.isArray(bookingDetails[3].value));
  const width = useWindowDimensions().width;
  return (
    <View
      style={{
        justifyContent: 'space-between',
        flex: 1,
        backgroundColor: 'white',
      }}>
      {/* Top View */}
      <View style={{flex: 1}}>
        {/* Bookin Details */}
        <View
          style={[
            styles.detailCard,
            {
              width: width - 32,
              marginTop: 26,
              // height: title == 'Meeting rooms' || title == 'Events' ? 180 : 153,
            },
          ]}>
          <Text
            style={[
              CustomText[70020],
              {color: Colors.darkBlack, opacity: 0.82, marginBottom: 16},
            ]}>
            {I18n.t('BookingDetails')}
          </Text>

          {booking_details.map(detail => {
            // console.log(detail);
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
                      return <Text>{`${slot.title_en} `}</Text>;
                    })}
                  </View>
                ) : (
                  <Text style={styles.fontSemibold}>{detail.value}</Text>
                )}
              </View>
            );
          })}
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

          {paymentSummary.map(detail => {
            return (
              <HStack style={styles.detailRow}>
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
              </HStack>
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
      {/* Top View Ends Here*/}
      {/* Pay Now Button */}
      {isLoading ? (
        <View
          style={{
            backgroundColor: Colors.primaryGolden,
            height: 52,
            width: width - 32,
            borderRadius: 8,
            marginHorizontal: 16,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}>
          <ActivityIndicator color="white" />
        </View>
      ) : (
        <CustomButton
          onPress={paymentHandler}
          label="PayNow"
          style={{color: 'white'}}
        />
      )}

      {/* Pay Now Button Ends Here*/}
    </View>
  );
};

export default CheckoutScreen;
