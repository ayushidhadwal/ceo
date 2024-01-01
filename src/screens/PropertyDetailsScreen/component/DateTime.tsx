/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import moment from 'moment-timezone';
import {ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {VStack} from 'native-base';
import CalendarPicker from 'react-native-calendar-picker';
import httpClient from '../../../hooks/useHttp';
import {ActivityIndicator} from 'react-native-paper';
import Colors from '../../../constants/Colors';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {
  toggleSheet,
  toggleShowRegisterForm,
} from '../../../store/slice/masterSlice';
import BottomSheetComponent from '../../../component/BottomSheetComponent';
import AuthForm from '../../AuthenticationScreens';
import i18n from '../../../language/I18n';
import {showToast} from '../../../services/generalservices';

const DateTime = (props: any) => {
  // const route = useNavigation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  // const {is_date_available, is_timeslotes_available} = route.params;
  const {selectedCountry} = useAppSelector(state => state?.master);

  const {data}: any = useAppSelector(state => state?.auth);
  const today = moment().format('YYYY-MM-DD');
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [isActive, setIsActive] = useState('');
  const [timeSlot, setTimeSlot] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [selectedSlots, setSelectedSlots] = useState([]);
  const [hourPriceArray, setHourPriceArray] = useState([]);
  const [targetHours, setTargetHours] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (props?.hourPrice?.length > 0) {
      setHourPriceArray([...props?.hourPrice]);
    }
  }, [props.hourPrice]);

  useEffect(() => {
    setHourPriceArray(prevArray => [
      ...prevArray,
      {hours: 0.5, price: props?.price},
    ]);
  }, [props]);

  useEffect(() => {
    if (selectedSlots.length > 0) {
      setTargetHours(selectedSlots.length / 2);
    } else {
      setTargetHours(0);
    }
  }, [selectedSlots]);

  useEffect(() => {
    let remainingHours = targetHours;
    let hourPrice = 0;

    if (hourPriceArray.length > 0) {
      const hourPriceArray1 = hourPriceArray.map(item => {
        return {
          hours: item.hours,
          price: parseFloat(item.price.replace(/,/g, '')),
        };
      });

      hourPriceArray1?.sort((a, b) => b?.hours - a?.hours);

      for (let i = 0; i < hourPriceArray1.length; i++) {
        const {hours, price} = hourPriceArray1[i];
        const hoursCount = Math.floor(remainingHours / hours);

        hourPrice += hoursCount * parseFloat(price);
        remainingHours -= hoursCount * hours;
      }

      if (selectedCountry.title_en === 'Kuwait') {
        setTotalPrice(hourPrice.toFixed(3));
      } else {
        setTotalPrice(hourPrice.toFixed(2));
      }
    }
  }, [hourPriceArray, selectedCountry.title_en, targetHours]);

  const handleClick = (item: any) => {
    if (timeSlot.length > 0) {
      let timeArray: any = [];
      timeArray = [...timeSlot];
      timeArray.forEach((e: any) => {
        if (e.id === item) {
          // console.log('check', e);
          if (!e.click) {
            // push slot to selected slot list
            setSelectedSlots([...selectedSlots, e]);
          } else {
            // remove slot from selected slot list
            var temp = [...selectedSlots];

            setSelectedSlots(
              temp.filter(slot => {
                return slot.id !== e.id;
              }),
            );
          }
          e.click = !e.click;
        }
        // else {
        //   e.click = false;
        // }
      });
      setTimeSlot(timeArray);
    }
    setIsActive(item);
  };

  const handleCalenderClick = (date, type) => {
    setSelectedSlots([]);
    setStartDate(date?.utc().format('YYYY-MM-DD'));
  };

  const getTimeSlots = async () => {
    setIsLoading(true);
    httpClient
      .post('/get-slots', {
        property_id: props.property_id,
        date: startDate,
      })
      .then(res => {
        // setApplicationData(res.data.data);
        let temp: {
          id: any;
          title_en: any;
          title_ar: any;
          value: any;
          click: boolean;
        }[] = [];
        res.data.data.available_slotes.forEach(
          (slot: {title_en: any; title_ar: any; value: any}) => {
            temp.push({
              id: slot.title_en,
              title_en: slot.title_en,
              title_ar: slot.title_ar,
              value: slot.value,
              click: false,
            });
          },
        );

        setTimeSlot(temp);
        setSelectedSlots([]);
      })
      .catch(e => {
        console.log(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const goToCheckoutDateTime = () => {
    setIsLoading(true);
    httpClient
      .post('/book-now', {
        property_id: props.property_id,
        start_date: startDate,
        end_date: startDate,
        time_slotes: selectedSlots,
      })
      .then(res => {
        if (res.data.data.is_check_schedule) {
          props.refRBSheet.current.close();

          navigation.navigate('CheckoutScreen', {
            booking_data: {
              property_id: props.property_id,
              start_date: startDate,
              end_date: startDate,
              time_slotes: selectedSlots,
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
    if (selectedSlots.length !== 0) {
      if (data.user) {
        setBtnLoading(true);
        httpClient
          .post('/book-now', {
            property_id: props.property_id,
            start_date: startDate,
            end_date: startDate,
            time_slotes: selectedSlots,
          })
          .then(res => {
            // showToast({msg:"Schedule Available",color:"green.600"})
            // setApplicationData(res.data.data);
            if (res.data.data) {
              // ToastAndroid.show(
              //   `${i18n.t('Schedule Available')}`,
              //   ToastAndroid.SHORT,
              // );
              // );
              // showToast({
              //   msg: `${i18n.t('Schedule Available')}`,
              //   color: 'green',
              // });

              // setStartDate(null);

              // check if user is logged in
              props.refRBSheet.current.close();

              // setStartDate(null);

              // check if user is logged in
              /// load false
              setBtnLoading(false);
              navigation.navigate('CheckoutScreen', {
                booking_data: {
                  property_id: props.property_id,
                  start_date: startDate,
                  end_date: startDate,
                  time_slotes: selectedSlots,
                },
                booking_details_data: res.data.data,
              });
            }
          });
      } else {
        // Auth Flow
        props.refRBSheet?.current?.close();
        dispatch(toggleShowRegisterForm(false));
        dispatch(toggleSheet({}));
      }
    } else {
      showToast({msg: i18n.t('Select Atleast one slot'), color: 'red'});
    }
  };

  useEffect(() => {
    getTimeSlots();
  }, [startDate]);

  return (
    <>
      <View>
        <CalendarPicker
          startFromMonday={true}
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
          textStyle={{fontSize: 15, fontFamily: 'Inter-Regular'}}
          allowRangeSelection={false}
          minDate={new Date()}
          maxDate={new Date(2023, new Date().getMonth() + 3, 3)}
          todayBackgroundColor="#edcdbe"
          selectedDayColor="#C46537"
          // selectedDayTextColor="#ffffff"
          selectedDayTextStyle={{fontWeight: '700', color: '#ffffff'}}
          onDateChange={handleCalenderClick}
        />
        {/* <Calendar
      markingType={'custom'}
      markedDates={{
        [today]: {
          selected: false,
          selectedColor: 'white',
          customStyles: {
            container: {
              borderRadius: 0,
            },
            text: {
              color: 'black',
              fontWeight: 'regular',
            },
          },
        },
        [startDate]: {
          selected: true,
          customStyles: {
            container: {
              borderRadius: 0,
            },
            text: {
              color: 'black',
              fontWeight: 'regular',
            },
          },
        },
      }}
      initialDate={today}
      current={startDate}
      minDate={'2012-09-10'}
      maxDate={'2080-09-30'}
      onDayPress={day => {
        //console.log('data', date);
        setStartDate(day.dateString);
      }}
      enableSwipeMonths={true}
      hideArrows={true}
      horizontal={true}
      pagingEnabled={true}
      pastScrollRange={50}
      futureScrollRange={50}
      scrollEnabled={true}
      theme={{
        textSectionTitleColor: '#000',
        selectedDayBackgroundColor: '#F7D7B1',
        textDayFontFamily: 'OpenSans-Regular',
        textMonthFontFamily: ' Inter-SemiBold',
        textDayHeaderFontFamily: 'Inter-Regular',
        textDayFontSize: 12,
        monthTextColor: '#000',
        textMonthFontSize: 18,
        textDayHeaderFontSize: 13,
        dotColor: '#F7D7B1',
        selectedDotColor: '#F7D7B1',
      }}
    /> */}

        <VStack>
          <Text style={styles.timeSlotStyle}>{i18n.t('TimeSlots')}</Text>
          {isLoading ? (
            <View
              style={{
                height: 160,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator color={Colors.primaryGolden} />
            </View>
          ) : (
            <ScrollView horizontal>
              <View style={styles.timeRow}>
                {timeSlot.map(item => (
                  <TouchableOpacity
                    key={item?.value}
                    style={
                      item.click ? styles.activeButton : styles.inactiveButton
                    }
                    onPress={() => handleClick(item?.id)}>
                    <Text
                      style={{
                        marginTop: 5,
                        paddingHorizontal: 17,
                        color: item.click ? '#ffffff' : '#2A2A2A',
                        fontSize: 20,
                        paddingBottom: 9,
                      }}>
                      {item.title_en}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
        </VStack>

        <Pressable
          onPress={btnLoading ? null : bookingHandler}
          style={{marginBottom: 50, opacity: btnLoading ? 0.5 : 1}}>
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
              {totalPrice} {selectedCountry.code_en}
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
      <BottomSheetComponent>
        <AuthForm
          fromPage={'DateTime'}
          goToCheckoutDateTime={goToCheckoutDateTime}
          goToCheckoutPropertyDetails={() => {}}
        />
      </BottomSheetComponent>
    </>
  );
};
export default DateTime;
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
    height: 160,
    flexWrap: 'wrap',
    // flexDirection: 'row',
  },
  activeButton: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#C46537',
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
    // marginLeft: 15,
    fontSize: 20,
    textAlign: 'left',
  },
});
