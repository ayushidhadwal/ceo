import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  I18nManager,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';
import {Dropdown} from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import DateTime from './component/DateTime';
import ResponsiveText from '../../component/ResponsiveText';
import {ImageLoad, showToast} from '../../services/generalservices';
import RangeCalender from './component/RangeCalender';
import BottomSheetComponent from '../../component/BottomSheetComponent';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {
  toggleSheet,
  toggleShowRegisterForm,
} from '../../store/slice/masterSlice';
import AuthForm from '../AuthenticationScreens';
import httpClient from '../../hooks/useHttp';
import i18n from '../../language/I18n';
import moment from 'moment-timezone';

const gap = 12;

const SeatsDropDown: FC<any> = ({
  noOfSeats,
  seats,
  isFocus,
  value,
  setIsFocus,
  setValue,
  isDisabled,
}) => {
  return (
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
      placeholderStyle={{
        fontFamily: 'Inter-Bold',
        fontSize: 20,
        textAlign: 'left',
        color: 'black',
      }}
      selectedTextStyle={{
        fontFamily: 'Inter',
        fontSize: 18,
        color: 'black',
        fontWeight: '400',
        textAlign: 'left',
      }}
      inputSearchStyle={{
        height: 40,
        fontSize: 16,
      }}
      disable={noOfSeats <= 0 || isDisabled}
      iconStyle={{height: 30, width: 30}}
      iconColor="#C46537"
      data={seats}
      search={false}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={
        !isFocus ? `${i18n.t('SelectSeat')}` : `${i18n.t('SelectSeat')}`
      }
      renderLeftIcon={() =>
        I18nManager.isRTL ? (
          <MaterialIcons name="keyboard-arrow-down" size={24} color="#C46537" />
        ) : null
      }
      renderRightIcon={() =>
        !I18nManager.isRTL ? (
          <MaterialIcons name="keyboard-arrow-down" size={24} color="#C46537" />
        ) : null
      }
      searchPlaceholder="Search..."
      value={value}
      onFocus={() => setIsFocus(true)}
      dropdownPosition={'top'}
      onBlur={() => setIsFocus(false)}
      onChange={item => {
        setValue(item.value);
        setIsFocus(false);
      }}
    />
  );
};

const PropertyDetailsScreen = ({navigation, route}) => {
  const {property, showedSeats, allowedDates, isCoWorkSpace} = route.params;
  const dispatch = useAppDispatch();
  const refRBSheet = useRef();

  const [seats, setSeats] = useState([]);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noOfSeats, setNoOfSeats] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalDays, setTotalDays] = useState(0);
  const [propertyPrice, setPropertyPrice] = useState(0);
  console.log(
    selectedDate,
    moment(selectedDate).isSame(moment().startOf('day')),
  );

  const open = () => {
    refRBSheet?.current?.open();
  };

  const {selectedCountry} = useAppSelector(state => state?.master);
  // console.log(selectedCountry);

  const getSeats = useCallback(() => {
    if (property?.is_seats_available && selectedDate !== null) {
      if (noOfSeats > 0) {
        let temp = [];
        for (let index = 0; index < parseInt(String(noOfSeats)); index++) {
          temp.push({label: (index + 1).toString(), value: index + 1});
        }
        setSeats(temp);
      }
    }
  }, [noOfSeats, property?.is_seats_available, selectedDate]);

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

  const goToCheckoutPropertyDetails = async () => {
    if (property?.is_seats_available) {
      open();
    } else {
      setIsLoading(true);
      httpClient
        .post('/book-now', {
          property_id: property.id,
          no_of_seats: value,
        })
        .then(res => {
          if (res.data.status === 'error') {
            showToast({msg: res.data?.msg, color: 'red'});
          } else {
            if (res.data.data !== null) {
              // check if user is logged in
              refRBSheet?.current?.close();
              navigation.navigate('CheckoutScreen', {
                booking_data: {
                  property_id: property.id,
                  start_date: null,
                  end_date: null,
                  time_slotes: [],
                  no_of_seats: value,
                },
                booking_details_data: res.data.data,
              });
            }
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  const {data}: any = useAppSelector(state => state?.auth);

  const proceedHandler = async () => {
    if (property?.is_seats_available) {
      // if (value !== null) {
      if (data.user) {
        open();
      } else {
        // Auth Flow
        dispatch(toggleShowRegisterForm(false));
        dispatch(toggleSheet({}));
      }
    } else {
      open();
    }
  };

  useEffect(() => {
    if (property?.price) {
      const numericPrice = parseFloat(property?.price.replace(/,/g, ''));
      setPropertyPrice(numericPrice);
    }
  }, [property?.price]);

  const bookingHandler = async () => {
    if (selectedDate != null && endDate != null) {
      if (value && value > 0) {
        if (data.user) {
          setIsLoading(true);
          // console.log('selectedDate', selectedDate);
          httpClient
            .post('/book-now', {
              property_id: property.id,
              start_date: selectedDate,
              end_date: endDate,
              no_of_seats: value,
              time_slotes: [],
            })
            .then(res => {
              if (res.data.data !== null) {
                setSelectedDate(null);
                setEndDate(null);

                // check if user is logged in
                if (res.data.status === 'success') {
                  // props.refRBSheet?.current?.close();
                  navigation.navigate('CheckoutScreen', {
                    booking_data: {
                      property_id: property.id,
                      start_date: selectedDate,
                      end_date: endDate,
                      time_slotes: [],
                      no_of_seats: value,
                    },
                    booking_details_data: res.data.data,
                  });
                } else {
                  showToast({msg: res.data.msg, color: 'red'});
                }
              }
            })
            .finally(() => {
              setIsLoading(false);
            });
        } else {
          // Auth Flow
          dispatch(toggleShowRegisterForm(false));
          dispatch(toggleSheet({}));
        }
      } else {
        showToast({msg: i18n.t('Select No Of Seats !!'), color: 'red'});
      }
    } else {
      showToast({msg: i18n.t('Select date !!'), color: 'red'});
    }
  };
  // @ts-ignore
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <View>
          <Pressable
            style={{position: 'absolute', left: 14, top: 14, zIndex: 7}}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              style={[
                styles.backButton,
                {
                  transform: [
                    {
                      scaleX: I18nManager.isRTL ? -1 : 1,
                    },
                  ],
                },
              ]}
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
            url={property?.thumbnail_urls[0]?.image_url}
          />
        </View>
        <View style={{paddingHorizontal: 16}}>
          <View style={styles.companyLogo}>
            <ResponsiveText
              text={property.name_en}
              ellipsizeMode="tail"
              numberOfLines={3}
              color={'#000'}
              size={3}
              weight={'Inter-Bold'}
              style={styles.cardText}
            />
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.DetailsCard}>
            <Text style={styles.Details}>{i18n.t('Details')}</Text>
            <Text style={styles.DetailsText}>{property.description_en}</Text>
          </View>
          {(property.property_type.name_en.toLowerCase() === 'co-work space' ||
            property.property_type.name_en === 'مساحة العمل المشترك') && (
            <Pressable
              onPress={() =>
                property?.seats?.length === 0
                  ? showToast({
                      msg: i18n.t(
                        'No slots available for this event .Please Choose another event.',
                      ),
                      color: 'red',
                    })
                  : proceedHandler()
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
                <Text style={styles.Details}>{i18n.t('SelectDate')}</Text>
              ) : (
                <Text style={styles.DetailsText}>{selectedDate}</Text>
              )}
              <Ionicons name="calendar" size={24} color="#C46537" />
            </Pressable>
          )}

          {property?.is_seats_available ? (
            <SeatsDropDown
              isDisabled={
                selectedDate
                  ? moment(selectedDate).isSame(moment().startOf('day')) &&
                    !showedSeats
                  : false
              }
              noOfSeats={noOfSeats}
              seats={seats}
              isFocus={isFocus}
              value={value}
              setIsFocus={setIsFocus}
              setValue={setValue}
            />
          ) : null}

          <View style={[styles.AmenitiesCard]}>
            <Text style={styles.Amenities}>{i18n.t('Amenities')}</Text>
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
      </ScrollView>
      <RBSheet
        animationType="none"
        ref={refRBSheet}
        openDuration={250}
        customStyles={{
          container: {
            padding: 20,
            borderRadius: 12,
            height: property?.is_timeslotes_available
              ? 650
              : property.property_type.name_en.toLowerCase() === 'office' ||
                property.property_type.name_en === 'مكتب'
              ? 480
              : 350,
          },
        }}>
        {property?.is_timeslotes_available ? (
          <DateTime
            property_id={property.id}
            price={property?.price}
            priceText={property?.price_text?.price_text_en}
            refRBSheet={refRBSheet}
            hourPrice={property?.hours_price}
          />
        ) : (
          <RangeCalender
            disabledDates={(d: string) => {
              if (isCoWorkSpace) {
                const isAvailable = allowedDates.find((dt: string) => {
                  return (
                    moment(dt).format('YYYY-MM-DD') ===
                    moment(d).format('YYYY-MM-DD')
                  );
                });

                return !isAvailable;
              }
            }}
            priceText={property?.price_text?.price_text_en}
            property_id={property.id}
            price={
              property.is_seats_available
                ? property?.price * parseInt(value?.toString())
                : property?.price
            }
            seats={property?.seats}
            goToCheckout={goToCheckoutPropertyDetails}
            allowRange={property.is_seats_available ? false : true}
            refRBSheet={refRBSheet}
            selectedStartDate={(val: any) => setSelectedDate(val)}
            selectedEndDate={(val: any) => setEndDate(val)}
            selectedTotalDays={(val: any) => setTotalDays(val)}
            propertyType={property.property_type}
            country={selectedCountry.title_en}
            code={selectedCountry.code_en}
          />
        )}
      </RBSheet>
      <View style={{justifyContent: 'flex-end'}}>
        {property.property_type.name_en.toLowerCase() === 'co-work space' ||
        property.property_type.name_en === 'مساحة العمل المشترك' ? (
          <Pressable onPress={bookingHandler} style={styles.button}>
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
                {value && value > 0
                  ? selectedCountry.title_en === 'Kuwait'
                    ? (propertyPrice * value).toFixed(3)
                    : (propertyPrice * value).toFixed(2)
                  : selectedCountry.title_en === 'Kuwait'
                  ? (0).toFixed(3)
                  : (0).toFixed(2)}{' '}
                {selectedCountry.code_en}
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
            </LinearGradient>
          </Pressable>
        ) : (
          <Pressable style={styles.button} onPress={() => proceedHandler()}>
            <LinearGradient
              colors={['#C46537', '#C46537', '#C46537', '#C46537', '#C46537']}
              start={{y: 0.0, x: 0.1}}
              end={{y: 0.0, x: 1.0}}
              style={{
                borderRadius: 8,
                alignItems: 'center',
                marginVertical: 26,
              }}>
              {isLoading ? (
                <View style={{marginVertical: 12}}>
                  <ActivityIndicator color={'#ffffff'} />
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
        )}
      </View>
      {property?.is_seats_available ? (
        <BottomSheetComponent>
          <AuthForm
            fromPage={'PropertyDetails'}
            goToCheckoutPropertyDetails={goToCheckoutPropertyDetails}
            goToCheckoutDateTime={() => {}}
          />
        </BottomSheetComponent>
      ) : null}
    </SafeAreaView>
  );
};
export default PropertyDetailsScreen;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  linearGradient: {
    borderRadius: 8,
    marginVertical: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
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
    textAlign: 'left',
    color: 'black',
  },
  DetailsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'left',
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
    marginTop: 15,
    marginBottom: 20,
    elevation: 5,
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
});
