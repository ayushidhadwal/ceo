import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  I18nManager,
  SafeAreaView,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Dropdown} from 'react-native-element-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import {ActivityIndicator} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ResponsiveText from '../../component/ResponsiveText';
import {ImageLoad, showToast} from '../../services/generalservices';
import BottomSheetComponent from '../../component/BottomSheetComponent';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import AuthForm from '../AuthenticationScreens';
import httpClient from '../../hooks/useHttp';
import RangeCalender from '../PropertyDetailsScreen/component/RangeCalender';
import {
  toggleSheet,
  toggleShowRegisterForm,
} from '../../store/slice/masterSlice';
import moment from 'moment-timezone';
import i18n from '../../language/I18n';
import I18n from 'i18n-js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import I18n from 'i18n-js';

const gap = 8;

const EventDetailsScreen = ({navigation, route}) => {
  const {property, showedSeats, allowedDates} = route.params;
  const refRBSheet = useRef();
  const dispatch = useAppDispatch();

  const [noOfSeats, setNoOfSeats] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalDays, setTotalDays] = useState(0);

  const {data}: any = useAppSelector(state => state?.auth);

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [seats, setSeats] = useState([]);
  console.log(showedSeats);

  const open = () => {
    refRBSheet.current.open();
  };

  const getSeats = useCallback(() => {
    if (selectedDate !== null) {
      if (noOfSeats > 0) {
        let temp = [];
        for (let index = 0; index < parseInt(String(noOfSeats)); index++) {
          temp.push({label: (index + 1).toString(), value: index + 1});
        }
        setSeats(temp);
      }
    }
  }, [noOfSeats, selectedDate]);

  useEffect(() => {
    if (property?.seats?.length > 0) {
      const x = [...property?.seats];
      const i = x.findIndex(
        n =>
          moment(selectedDate)?.utc().format('YYYY-MM-DD') ===
          moment(n.date).utc().format('YYYY-MM-DD'),
      );
      if (i > -1) {
        setNoOfSeats(x[i].seats);
      }
      getSeats();
    }
  }, [getSeats, property?.seats, selectedDate]);

  const goToCheckout = async () => {
    if (selectedDate != null) {
      if (value && value > 0) {
        setIsLoading(true);
        // console.log('selectedDate', selectedDate, property.id, value);
        httpClient
          .post('/book-now', {
            event_id: property.id,
            no_of_seats: value,
            start_date: selectedDate,
            end_date: selectedDate,
          })
          .then(res => {
            // showToast({msg:"Schedule Available",color:"green.600"})
            // setApplicationData(res.data.data);
            if (res.data.data !== null) {
              navigation.navigate('CheckoutScreen', {
                booking_data: {
                  property_id: '',
                  start_date: selectedDate,
                  end_date: endDate,
                  time_slotes: [],
                  event_id: property.id,
                  no_of_seats: value,
                },
                booking_details_data: res.data.data,
              });
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        showToast({msg: i18n.t('Select No Of Seats !!'), color: 'red'});
      }
    } else {
      showToast({msg: i18n.t('Select date !!'), color: 'red'});
    }
  };

  const eventBookingHandler = async () => {
    // if (value !== null) {
    if (data.user) {
      // goToCheckout();
      open();
    } else {
      // Auth Flow
      refRBSheet.current.close();
      dispatch(toggleShowRegisterForm(false));
      dispatch(toggleSheet({}));
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Pressable
            style={{position: 'absolute', left: 14, top: 14, zIndex: 7}}
            onPress={() => {
              // const allowedDates = item.seats
              //   .filter(d => d.seats > 0)
              //   .map(d => d.date);
              navigation.goBack();
            }}>
            <Image
              style={
                I18nManager.isRTL
                  ? {transform: [{rotate: '180deg'}]}
                  : {transform: [{rotate: '0deg'}]}
              }
              source={require('../../assets/icons/Home/BackButton.png')}
            />
          </Pressable>
          <View style={styles.rent}>
            <Text style={styles.rentText}>
              {property.price_text.price_text_en}
            </Text>
          </View>

          <ImageLoad
            style={styles.image}
            url={property?.thumbnail_urls[0].image_url}
          />
        </View>
        <View style={{paddingHorizontal: 16}}>
          <View style={styles.companyLogo}>
            <ResponsiveText
              text={property.name_en}
              color={'#000'}
              size={3}
              weight={'Inter-Bold'}
              style={styles.cardText}
            />
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.DetailsCard}>
            <Text style={styles.Details}>{I18n.t('Details')}</Text>
            <Text style={styles.DetailsText}>{property.description_en}</Text>
          </View>
          <Pressable
            onPress={() =>
              property?.seats?.length === 0
                ? showToast({
                    msg: i18n.t(
                      'No slots available for this event .Please Choose another event.',
                    ),
                    color: 'red',
                  })
                : eventBookingHandler()
            }
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 8,
              backgroundColor: 'white',
              padding: 12,
              elevation: 5,
            }}>
            {!selectedDate ? (
              <Text style={styles.Details}>{I18n.t('SelectDate')}</Text>
            ) : (
              <Text style={styles.DetailsText}>{selectedDate}</Text>
            )}
            <Ionicons name="calendar" size={24} color="#C46537" />
          </Pressable>

          {property.is_seats_available ? (
            <Dropdown
              style={[
                {
                  borderWidth: 0,
                  fontFamily: 'Inter',
                  fontSize: 18,
                  color: 'black',
                  fontWeight: '400',
                  height: 53,
                  paddingHorizontal: 12,
                  // marginLeft: 14,
                  backgroundColor: 'white',
                  borderRadius: 6,

                  marginTop: 20,
                  // backgroundColor: 'white',
                  padding: 12,
                  elevation: 5,
                },
              ]}
              itemTextStyle={{
                fontSize: 18,
                color: 'black',
                fontWeight: '400',
              }}
              fontFamily={'Inter'}
              placeholderStyle={{
                fontFamily: 'Inter-Bold',
                fontSize: 20,
                textAlign: 'left',
                color: 'black',
                fontWeight: 'bold',
              }}
              selectedTextStyle={{
                // fontFamily: 'Inter',
                fontFamily: 'Inter-Bold',

                fontSize: 18,
                color: 'black',
                fontWeight: '400',
                textAlign: 'left',
              }}
              renderLeftIcon={() =>
                I18nManager.isRTL ? (
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={24}
                    color="#C46537"
                  />
                ) : null
              }
              renderRightIcon={() =>
                !I18nManager.isRTL ? (
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={24}
                    color="#C46537"
                  />
                ) : null
              }
              inputSearchStyle={{
                height: 40,
                fontSize: 16,
              }}
              iconStyle={{height: 30, width: 30}}
              iconColor="white"
              disable={
                (selectedDate
                  ? moment(selectedDate).isSame(moment().startOf('day')) &&
                    !showedSeats
                  : false) || noOfSeats <= 0
              }
              data={seats}
              search={false}
              maxHeight={300}
              labelField="label"
              valueField="value"
              // placeholder={!isFocus ? i18n.t('SelectSeat') : '...'}
              placeholder={
                !isFocus ? `${i18n.t('SelectSeat')}` : `${i18n.t('SelectSeat')}`
              }
              searchPlaceholder="Search..."
              value={value}
              dropdownPosition={'top'}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setValue(item.value);
                setIsFocus(false);
              }}
            />
          ) : null}
          <View style={styles.AmenitiesCard}>
            <Text style={styles.Amenities}>{I18n.t('Amenities')}</Text>
            <View
              style={{
                paddingHorizontal: 8,
                flexDirection: 'row',
                justifyContent:
                  property.amenities.length < 4 ? 'flex-start' : 'space-around',
              }}>
              {property.amenities.map(amenity => {
                return (
                  <View
                    style={{
                      alignItems: 'center',
                      marginRight: 8,
                    }}>
                    <Image
                      style={{
                        marginTop: 8,
                        height: 50,
                        width: 50,
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
                      }}>
                      {amenity.name_en}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <RBSheet
          ref={refRBSheet}
          // height={property?.is_timeslotes_available ? 650 : 300}
          openDuration={250}
          customStyles={{
            container: {
              padding: 20,
              borderRadius: 12,
              height: 400,
            },
          }}>
          <RangeCalender
            disabledDates={(d: string) => {
              const isAvailable = allowedDates.find((dt: string) => {
                return (
                  moment(dt).format('YYYY-MM-DD') ===
                  moment(d).format('YYYY-MM-DD')
                );
              });

              return !isAvailable;
            }}
            priceText={property?.price_text?.price_text_en}
            property_id={property.id}
            price={
              property.is_seats_available
                ? property?.price * parseInt(value?.toString())
                : property?.price
            }
            seats={property?.seats}
            // goToCheckout={goToCheckoutPropertyDetails}
            allowRange={false}
            refRBSheet={refRBSheet}
            selectedStartDate={(val: any) => setSelectedDate(val)}
            selectedEndDate={(val: any) => setEndDate(val)}
            selectedTotalDays={(val: any) => setTotalDays(val)}
          />
        </RBSheet>
      </ScrollView>

      <Pressable
        style={styles.button}
        onPress={isLoading ? null : () => goToCheckout()}>
        <LinearGradient
          colors={['#C46537', '#C46537', '#C46537', '#C46537', '#C46537']}
          start={{y: 0.0, x: 0.1}}
          end={{y: 0.0, x: 1.0}}
          style={styles.linearGradient}>
          {isLoading ? (
            <View style={{marginVertical: 12}}>
              <ActivityIndicator color="white" />
            </View>
          ) : (
            <Text
              style={{
                color: '#ffffff',
                marginVertical: 10,
                fontSize: 20,
                fontFamily: 'Inter-Bold',
              }}>
              {i18n.t('Proceed')}
            </Text>
          )}
        </LinearGradient>
      </Pressable>
      <BottomSheetComponent>
        <AuthForm fromPage={'PropertyDetails'} goToCheckout={goToCheckout} />
      </BottomSheetComponent>
    </SafeAreaView>
  );
};
export default EventDetailsScreen;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  linearGradient: {
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 26,
  },
  buttonText: {
    color: '#2A2A2A',
    marginVertical: 10,

    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  rentText: {
    color: 'black',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'white',
    fontFamily: 'Inter-SemiBold',
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 2,
    position: 'absolute',
  },
  rent: {
    zIndex: 3,
    top: 12,
    alignItems: 'center',
  },
  button: {
    borderColor: '#ece9e5',
    borderTopWidth: 3,
    marginHorizontal: 16,
  },
  amenitiesCard: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  locatonStructure: {
    flexDirection: 'row',
  },
  locationIcon: {
    marginVertical: 9,
    marginRight: 8,
  },
  amenitiesText: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#2A2A2A',
    marginLeft: 3,
  },
  Details: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: 'black',
  },
  DetailsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#2A2A2A',
  },
  companyLogo: {
    borderWidth: 1,
    borderColor: 'white',
    elevation: 5,
    borderRadius: 8,
    backgroundColor: 'white',
    marginTop: -30,
    width: '100%',
    paddingLeft: 10,
    marginBottom: 8,
  },
  DetailsCard: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    backgroundColor: 'white',
    padding: 12,
    marginTop: 20,
    marginBottom: 28,
    elevation: 5,
    alignItems: 'flex-start',
  },
  AmenitiesCard: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 12,
    marginTop: 20,
    marginBottom: 28,
    elevation: 5,
  },
  Amenities: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: 'black',
    marginLeft: 8,
    textAlign: 'left',
  },
  image: {
    width: '100%',
    height: 250,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cardText: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'Inter-Medium',
    padding: 6,
    textAlign: 'left',
  },

  tabstructure: {
    paddingHorizontal: gap / -2,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  Icons: {
    marginTop: 8,
    height: 50,
    width: 50,
    marginLeft: 10,
  },
  cardLocationText: {
    fontSize: 16,
    color: '#2A2A2A',
    fontFamily: 'Inter-Medium',
    marginVertical: 11,
  },
  dropdown: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 30,
    height: 30,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
