import React, {useEffect, useState} from 'react';
import {
  Alert,
  I18nManager,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Share,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Colors from '../../constants/Colors';
import CustomText from '../../constants/CustomText';
import I18n from '../../language/I18n';
import DetailsDropdown from '../OfficeDetailsScreen/components/DetailsDropDown';
import styles from './style';
import httpClient from '../../hooks/useHttp';
import {ActivityIndicator} from 'react-native-paper';
import {showToast} from '../../services/generalservices';
import i18n from 'i18n-js';
import {SafeAreaView} from 'react-native-safe-area-context';

import MapView, {Marker} from 'react-native-maps';
import {de} from 'react-native-paper-dates';

const BookingDetailsScreen = ({navigation, route}: any) => {
  const width = useWindowDimensions().width;
  // let title = 'Offices';
  const {details} = route.params;
  console.log('country', details?.country_id);
  console.log('booking', details?.booking_id);

  const [cancelLoading, setCancelLoading] = useState(false);
  const [paymentSummary, setPaymentSummary] = useState([]);

  const cancelBooking = async () => {
    setCancelLoading(true);
    httpClient
      .get(`/cancel-booking?id=${details?.booking_id}`)
      .then(res => {
        setCancelLoading(false);
        console.log('data', res?.data);
        if (res?.data.status === 'success') {
          showToast({msg: res?.data?.msg, color: 'green'});
          navigation.goBack();
        }
      })
      .finally(() => {
        setCancelLoading(false);
      });
  };
  // console.log('a', JSON.stringify(details.country_id));

  useEffect(() => {
    if (details?.details?.booking_details?.length > 0) {
      setPaymentSummary(() => {
        const [typeDetail] = details.details.booking_details;
        // console.log('typeDetail', typeDetail.value);

        const myArray = [...details.details.payment_summary];
        const allowedBasePrice = [
          'Office',
          'مكتب',
          'Co-Work Space',
          'مساحة العمل المشترك',
          'Events',
          'الأحداث',
        ];
        console.log(typeDetail.value);
        const a = myArray.findIndex(
          m =>
            (m.title.toLowerCase() === 'base price' ||
              m.title === 'السعر الأساسي') &&
            !allowedBasePrice.includes(typeDetail.value),
        );
        if (a > -1) {
          myArray.splice(a, 1);
        }
        return myArray;
      });
    }
  }, [details]);

  const onShare = async (type = 1) => {
    const {user_details} = details.details;

    try {
      let msg = `Dear ${user_details.name} ,\nWe are delighted to confirm your booking for ${details?.name_en} on ${details.details.booking_details[3].value} at ${details.details.booking_details?.[4]?.value[0]}. We look forward to providing you with a remarkable experience.\nBooking Details:\n•  Service/Event: ${details?.name_en}\n•  Date: ${details.details.booking_details[3].value}\n•  Time: ${details.details.booking_details?.[4]?.value[0]}\n•  Location: ${details?.location?.google_location} \nThank you for choosing our services. We are committed to ensuring your enjoyment and satisfaction. For assistance, reach out to us anytime.\nBest regards,\nQa3at\n+965 22432727,INFO@QA3AT.CO`;
      //\nPayment Information:\n•  Total Amount: ${details.details.payment_summary[3].value}\n•  Payment Method: ${details.details.payment_summary[0].value}\n•  Transaction ID: ${details.details.payment_summary[1].value}
      if (type === 2) {
        msg = `Dear ${user_details.name},\nWe are delighted to confirm your booking for ${details?.name_en} on ${details.details.booking_details[3].value} . We look forward to providing you with a remarkable experience.\nBooking Details:\n•  Service/Event: ${details?.name_en}\n•  Date: ${details.details.booking_details[3].value}\n•  Location: ${details?.location?.google_location}\nThank you for choosing our services. We are committed to ensuring your enjoyment and satisfaction. For assistance, reach out to us anytime.\nBest regards,\nQa3at\n+965 22432727,INFO@QA3AT.CO`;
      }
      //\nPayment Information:\n•  Total Amount: ${details.details.payment_summary[3].value}\n•  Payment Method: ${details.details.payment_summary[0].value}\n•  Transaction ID: ${details.details.payment_summary[1].value}
      console.log('msg', msg);

      await Share.share({
        message: msg,
      });
    } catch (error: any) {
      console.log(error.message);
      Alert.alert(error.message);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {/*<View style={[styles.root]}>*/}
      {/*  /!* Scroll View (Details Section) *!/*/}
      {/*  <View style={{flex: 1, width: '100%'}}>*/}
      <ScrollView>
        {/* Image And  office detail Card*/}
        <View style={{alignItems: 'center'}}>
          <Image
            source={{
              uri: details.thumbnail_urls[0].image_url,
            }}
            style={styles.image}
          />
          {/* Back Button */}
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              top: 18,
              left: 18,
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 28,
              height: 28,
              width: 28,
              backgroundColor: 'white',
            }}>
            <Image
              source={require('../../assets/icons/OfficeDetailScreen/back.png')}
              style={{
                height: 14,
                width: 14,
                transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
              }}
            />
          </Pressable>

          {/* detail Card */}
          <View style={[styles.detailCard, {width: width - 32, elevation: 4}]}>
            {/* Name */}
            {/* <Text style={styles.textBold}>{office.title}</Text> */}

            <View
              style={{
                width: width - 32 - 36,
                // flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginTop: 12,
              }}>
              <View style={{alignItems: 'center'}}>
                <Text
                  style={{
                    fontFamily: 'Inter-Regular',
                    fontStyle: 'normal',
                    fontWeight: '700',
                    fontSize: 20,
                    lineHeight: 19.36,
                    color: '#2a2a2a',
                    opacity: 0.8,
                    marginBottom: 5,
                  }}>
                  {details?.name_en}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 10,
                }}>
                <Image
                  style={{
                    marginRight: 10,
                    width: 20,
                    height: 20,
                    resizeMode: 'contain',
                  }}
                  source={require('../../assets/icons/Home/location.png')}
                />
                <Text
                  style={{
                    textAlign: 'left',
                    fontFamily: 'Inter-Regular',
                    fontStyle: 'normal',
                    fontWeight: '500',
                    fontSize: 16,
                    lineHeight: 19.36,
                    color: '#2a2a2a',
                    opacity: 0.8,
                    // marginBottom: 5,
                    flex: 1,
                  }}>
                  {/*{details?.location?.latitude}*/}
                  {/*{details?.location?.longitude}*/}
                  {details?.location?.name}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Image And  office detail Card Ends Here*/}

        {/* detail Dropdown*/}
        <DetailsDropdown details={details.description_en} />
        {/* detail Dropdown Ends Here */}
        {/* Amenities Section */}
        <View
          style={{
            marginTop: 28,
            width: '100%',
          }}>
          <Text style={[styles.textBold, {marginLeft: 16}]}>
            {I18n.t('Amenities')}
          </Text>

          <View
            style={{
              width: width - 32,

              flexDirection: 'row',
              alignItems: 'center',
              justifyContent:
                details.amenities.length < 4 ? 'flex-start' : 'space-between',
              marginTop: 12,
              marginLeft: 12,
            }}>
            {details.amenities.map(amenity => {
              return (
                <View
                  style={{
                    alignItems: 'center',
                    // justifyContent: 'space-around',
                    // backgroundColor:"red",
                    marginRight: 8,
                  }}>
                  <Image
                    style={{
                      marginTop: 8,
                      height: 50,
                      width: 50,
                      // marginLeft: 14,
                    }}
                    source={{uri: amenity.image_url}}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      alignSelf: 'center',
                      fontSize: 12,
                      fontFamily: 'Inter-Regular',
                      color: '#2A2A2A',
                      // marginLeft: 3,
                    }}>{`${amenity.name_en.split(' ')[0]} \n ${
                    amenity?.name_en?.split(' ')[1]
                  }`}</Text>
                </View>
              );
            })}
          </View>
        </View>
        <View
          style={{
            marginTop: 28,
            width: '100%',
          }}>
          <Text style={[styles.textBold, {marginLeft: 16}]}>Location</Text>
          <View style={{flexDirection: 'row', marginLeft: 16, marginTop: 10}}>
            <Image
              style={{
                marginRight: 10,
                width: 20,
                height: 20,
                resizeMode: 'contain',
              }}
              source={require('../../assets/icons/Home/location.png')}
            />
            <Text
              style={{
                textAlign: 'left',
                fontFamily: 'Inter-Regular',
                fontStyle: 'normal',
                fontWeight: '500',
                fontSize: 16,
                lineHeight: 19.36,
                color: '#2a2a2a',
                opacity: 0.8,
                // marginBottom: 5,
                flex: 1,
              }}>
              {details?.location?.name}
            </Text>
          </View>
          <Pressable
            onPress={() => Linking.openURL(details?.location?.google_location)}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 15,
              overflow: 'hidden',
              marginTop: 12,
              marginHorizontal: 12,
              width: '90%',
              height: 200,
              alignSelf: 'center',
            }}>
            <MapView
              style={{
                width: '100%',
                height: 200,
                marginTop: 10,
              }}
              zoomEnabled={false}
              zoomTapEnabled={false}
              scrollEnabled={false}
              rotateEnabled={false}
              showsCompass
              initialRegion={{
                latitude: Number(details?.location?.latitude),
                longitude: Number(details?.location?.longitude),
                latitudeDelta: 2.0922,
                longitudeDelta: 2.0421,
              }}>
              <Marker
                coordinate={{
                  latitude: Number(details?.location?.latitude),
                  longitude: Number(details?.location?.longitude),
                }}
              />
            </MapView>
          </Pressable>
        </View>

        {/* Bookin Details */}
        <View style={[styles.detailsCard, {width: width - 32, marginTop: 16}]}>
          <Text
            style={[
              CustomText[70020],
              {color: Colors.darkBlack, opacity: 0.82, marginBottom: 16},
            ]}>
            {I18n.t('BookingDetails')}
          </Text>

          {details?.details?.booking_details.map(detail => {
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
        </View>
        {/* Bookin Details Ends Here */}

        {/* Payment Summary */}
        <View style={[styles.detailsCard, {width: width - 32}]}>
          <Text
            style={[
              CustomText[70020],
              {color: Colors.darkBlack, opacity: 0.82, marginBottom: 16},
            ]}>
            {I18n.t('PaymentSummary')}
          </Text>

          {paymentSummary.map(detail => {
            return (
              <View style={styles.detailRow}>
                <Text style={styles.fontRegular}>{detail.title}</Text>
                <Text style={styles.fontSemibold}>{detail.value}</Text>
              </View>
            );
          })}
        </View>
        {/* Payment summary Ends Here */}
        {/* Book Now Button */}
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: '95%',
            alignSelf: 'center',
          }}>
          <View
            style={{
              backgroundColor: Colors.white,
              // height: 60,
              width: '45%',
              alignSelf: 'center',
              borderRadius: 10,
              marginHorizontal: 5,
              paddingHorizontal: 3,
              paddingVertical: 3,
            }}>
            <Pressable
              style={{flexDirection: 'row'}}
              onPress={() =>
                details.details.booking_details[0].value.toLowerCase() ===
                  'meeting rooms' ||
                details.details.booking_details[0].value.toLowerCase() ===
                  'conference' ||
                details.details.booking_details[0].value === 'غرف الإجتماعات' ||
                details.details.booking_details[0].value === 'مؤتمرات'
                  ? onShare(1)
                  : onShare(2)
              }>
              <Image
                source={require('../../../src/assets/share.png')}
                style={{height: 30, width: 30, alignSelf: 'center'}}
              />
              <Text
                style={{
                  color: 'black',
                  marginLeft: 2,
                  marginVertical: 8,
                  fontSize: 15,
                }}>
                {i18n.t('Share')}
              </Text>
            </Pressable>
          </View>
          <View
            style={{
              backgroundColor: Colors.white,
              // height: 60,
              width: '45%',
              alignSelf: 'center',
              borderRadius: 10,
              marginHorizontal: 5,
              paddingHorizontal: 3,
              paddingVertical: 3,
            }}>
            <Pressable
              style={{flexDirection: 'row'}}
              onPress={() =>
                Linking.openURL(
                  `https://demo.creativitykw.com/P168-CEO/P168-CEO-Backend/public/invoice/${details?.country_id}/${details?.id}`,
                )
              }>
              <Image
                source={require('../../../src/assets/invoice.png')}
                style={{height: 30, width: 30, alignSelf: 'center'}}
              />
              <Text
                style={{
                  color: 'black',
                  marginLeft: 2,
                  marginVertical: 8,
                  fontSize: 15,
                }}>
                {i18n.t('Download Invoice')}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Book Now Button Ends Here */}
      </ScrollView>
      <View
        style={{
          justifyContent: 'space-between',
          padding: 12,
        }}>
        <Pressable
          // onPress={cancelLoading ? null : cancelBooking}
          onPress={() =>
            Alert.alert(
              I18n.t('CancelBooking'),
              I18n.t('Are you sure you want to cancel your booking?'),
              [
                {
                  text: I18n.t('Yes'),
                  onPress: () => cancelBooking(),
                },
                {
                  text: I18n.t('No'),
                  style: 'cancel',
                },
              ],
            )
          }
          style={{
            borderRadius: 8,
            width: '100%',
            padding: '1%',
            backgroundColor: '#ff0000',
          }}>
          {cancelLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontFamily: 'Inter-Regular',
                fontWeight: '400',
                fontSize: 20,
                lineHeight: 24.4,
                marginVertical: 5,
              }}>
              {i18n.t('CancelBooking')}
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default BookingDetailsScreen;
