import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import moment from 'moment-timezone';
import CalendarPicker from 'react-native-calendar-picker';
import {ActivityIndicator} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

import httpClient from '../../../hooks/useHttp';
import {showToast} from '../../../services/generalservices';
import AuthForm from '../../AuthenticationScreens';
import {
  toggleSheet,
  toggleShowRegisterForm,
} from '../../../store/slice/masterSlice';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import BottomSheetComponent from '../../../component/BottomSheetComponent';
// import i18n from '../../../language/I18n';
import {Pressable} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import i18n from 'i18n-js';
import Colors from '../../../constants/Colors';

const RangeCalender = (props: any) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const {data}: any = useAppSelector(state => state?.auth);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [price, setPrice] = useState(0);
  const [totalDays, setTotalDays] = useState(1);

  const handleCalenderClick = (date, type) => {
    if (type === 'END_DATE') {
      setEndDate(date?.utc().format('YYYY-MM-DD'));
      var date2 = moment(startDate);
      var date1 = moment(date?.utc().format('YYYY-MM-DD'));
      var days = date1.diff(date2, 'days');
      if (days > 0) {
        setTotalDays(days + 1);
        props.selectedTotalDays(days + 1);
      } else {
        setTotalDays(1);
        props.selectedTotalDays(1);
      }
      // console.log(days+1);
    } else {
      setStartDate(date?.utc().format('YYYY-MM-DD'));
      setEndDate(date?.utc().format('YYYY-MM-DD'));
      setTotalDays(1);
      if (props?.propertyType?.id !== 1) {
        props.selectedTotalDays(1);
        props.selectedStartDate(date?.utc().format('YYYY-MM-DD'));
        props.selectedEndDate(date?.utc().format('YYYY-MM-DD'));
        props.refRBSheet?.current?.close();
      }
    }
  };
  const dispatch = useAppDispatch();

  const goToCheckout = () => {
    setIsLoading(true);
    httpClient
      .post('/book-now', {
        property_id: props.property_id,
        start_date: startDate,
        end_date: endDate,
        time_slotes: [],
      })
      .then(res => {
        if (res.data.data !== null) {
          setStartDate(null);
          setEndDate(null);

          // check if user is logged in

          props.refRBSheet?.current?.close();
          navigation.navigate('CheckoutScreen', {
            booking_data: {
              property_id: props.property_id,
              start_date: startDate,
              end_date: startDate,
              no_of_seats: '',
              time_slotes: [],
            },
            booking_details_data: res.data.data,
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const bookingHandler = async () => {
    if (startDate != null && endDate != null) {
      if (data.user) {
        setBtnLoading(true);
        httpClient
          .post('/book-now', {
            property_id: props.property_id,
            start_date: startDate,
            end_date: endDate,
            no_of_seats: props?.seats,
            time_slotes: [],
          })
          .then(res => {
            if (res.data.data !== null) {
              setStartDate(null);
              setEndDate(null);

              // check if user is logged in
              if (res.data.status === 'success') {
                props.refRBSheet?.current?.close();
                setBtnLoading(false);

                navigation.navigate('CheckoutScreen', {
                  booking_data: {
                    property_id: props.property_id,
                    start_date: startDate,
                    end_date: endDate,
                    time_slotes: [],
                    no_of_seats: props?.seats,
                  },
                  booking_details_data: res.data.data,
                });
              } else {
                showToast({msg: res.data.msg, color: 'red'});
              }
            }
          });
      } else {
        // Auth Flow
        props.refRBSheet.current.close();

        dispatch(toggleShowRegisterForm(false));
        dispatch(toggleSheet({}));
      }
    }
    // else {
    //   showToast({msg: i18n.t('Select date !!'), color: 'red'});
    // }
  };

  useEffect(() => {
    console.log(props?.price);
    if (props?.price) {
      const numericPrice = parseFloat(String(props?.price)?.replace(/,/g, ''));
      setPrice(numericPrice);
    }
  }, [props?.price]);

  return (
    <>
      <View
        style={{
          // flex: 1,
          justifyContent:
            props?.propertyType?.id === 1 ? 'space-between' : 'center',
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontFamily: 'Inter-SemiBold',
            fontWeight: '600',
            fontSize: 18,
            // marginTop: 10,
            marginLeft: i18n.locale === 'en' ? 30 : 0,
            // backgroundColor: 'red',
          }}>
          {i18n.t('Select Date Range')}
        </Text>

        <View>
          {isLoading ? (
            <View
              style={{
                height: 340,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {/*<ActivityIndicator color={'#EFB063'} />*/}
            </View>
          ) : (
            <CalendarPicker
              startFromMonday={true}
              previousTitle={i18n.locale === 'en' ? 'Previous' : 'سابق'}
              nextTitle={i18n.locale === 'en' ? 'Next' : 'التالي'}
              previousTitleStyle={{color: 'black'}}
              nextTitleStyle={{color: 'black'}}
              yearTitleStyle={{
                fontSize: 16,
                fontFamily: 'Inter-Regular',
                fontWeight: '700',
              }}
              monthTitleStyle={{
                fontSize: 16,
                fontFamily: 'Inter-Regular',
                fontWeight: '700',
              }}
              textStyle={{
                fontSize: 15,
                fontFamily: 'Inter-Regular',
              }}
              allowRangeSelection={props.allowRange}
              minDate={new Date()}
              maxDate={new Date(2023, new Date().getMonth() + 3, 3)}
              todayBackgroundColor="#edcdbe"
              selectedDayColor="#C46537"
              // selectedDayTextColor="#ffffff"
              selectedDayTextStyle={{fontWeight: '700', color: '#ffffff'}}
              onDateChange={handleCalenderClick}
              disabledDates={props?.disabledDates}
            />
          )}
        </View>
        {props?.propertyType?.id === 1 && (
          <View style={{justifyContent: 'flex-end'}}>
            <Pressable
              onPress={btnLoading ? null : bookingHandler}
              style={{marginBottom: 50}}>
              <LinearGradient
                colors={['#C46537', '#C46537', '#C46537', '#C46537', '#C46537']}
                start={{y: 0.0, x: 0.1}}
                end={{y: 0.0, x: 1.0}}
                style={styles.linearGradient}>
                <Text
                  style={{
                    color: '#ffffff',
                    marginVertical: 10,
                    fontSize: 20,
                    fontFamily: 'Inter-Medium',
                  }}>
                  {props?.country === 'Kuwait'
                    ? `${(price * totalDays).toFixed(3)}`
                    : `${(price * totalDays).toFixed(2)}`}{' '}
                  {props.code}
                </Text>
                <Text
                  style={{
                    color: '#ffffff',
                    marginVertical: 10,
                    fontSize: 20,
                    fontFamily: 'Inter-Bold',
                  }}>
                  {i18n.t('BookNow')}
                </Text>
                {btnLoading && <ActivityIndicator color={Colors.white} />}
              </LinearGradient>
            </Pressable>
          </View>
        )}
      </View>
      <BottomSheetComponent>
        <AuthForm fromPage={'PropertyDetails'} goToCheckout={goToCheckout} />
      </BottomSheetComponent>
    </>

    // <AuthForm></AuthForm>
  );
};

export default RangeCalender;

const styles = StyleSheet.create({
  linearGradient: {
    borderRadius: 8,
    marginVertical: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
  },
  buttonTextKD: {
    color: '#2A2A2A',
    marginVertical: 10,
    fontSize: 20,
    fontFamily: 'Inter-Medium',
  },
  buttonText: {
    color: '#2A2A2A',
    marginVertical: 10,
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  timeRow: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  activeButton: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#F7D7B1',
  },
  inactiveButton: {
    borderColor: 'white',
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  time: {
    marginTop: 5,
    paddingHorizontal: 17,
    color: '#2A2A2A',
    fontSize: 20,
    paddingBottom: 9,
  },
  timeSlotStyle: {
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginTop: 10,
    marginLeft: 15,
    fontSize: 20,
  },
});
