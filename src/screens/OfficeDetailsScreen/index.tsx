import {
  View,
  Text,
  ScrollView,
  Image,
  useWindowDimensions,
  Pressable,
  FlatList,
  Keyboard,
  I18nManager,
} from 'react-native';
import React, {useCallback, useRef, useMemo, useState} from 'react';
import Colors from '../../constants/Colors';
import styles from './style';
import office from '../../data/office';
import BookNowButton from './components/BookNowButton';
import AmeityCard from './components/AmenityCard';
import DetailsDropdown from './components/DetailsDropDown';
import BottomSheet from '@gorhom/bottom-sheet';
import AuthForm from '../AuthenticationScreens';
import Chip from './components/Chip';
import SelectDropdown from 'react-native-select-dropdown';
import {Actionsheet, Divider, useDisclose} from 'native-base';
import CustomText from '../../constants/CustomText';
import I18n from '../../language/I18n';

const useKeyboardBottomInset = () => {
  const [bottom, setBottom] = React.useState(0);
  const subscriptions = React.useRef([]);

  React.useEffect(() => {
    subscriptions.current = [
      Keyboard.addListener('keyboardDidHide', e => setBottom(0)),
      Keyboard.addListener('keyboardDidShow', e => {
        if (Platform.OS === 'android') {
          setBottom(e.endCoordinates.height);
        } else {
          setBottom(
            Math.max(e.startCoordinates.height, e.endCoordinates.height),
          );
        }
      }),
    ];

    return () => {
      subscriptions.current.forEach(subscription => {
        subscription.remove();
      });
    };
  }, [setBottom, subscriptions]);

  return bottom;
};

const OfficeDetailsScreen = ({navigation, route}: any) => {
  const bottomInset = useKeyboardBottomInset();
  // title i.e Metting Rooms or Offices

  const {title} = route.params;
  // console.log(title);

  const width = useWindowDimensions().width;

  // console.log(width);

  const [currentIndex, setCurrentIndex] = useState(-1);

  // Book now Button Handler
  const bookNowButtonHandler = () => {
    // console.log(selectedSlots);
    setCurrentIndex(1);
  };

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  // const snapPoints = useMemo(() => ['48%', '60%','85%'], []);
  const snapPoints = useMemo(() => [300, 380, 500], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const scrollToIndex = index => {
    setCurrentIndex(index);
  };

  const handleClosePress = () => {
    setSheetOpen(!sheetOpen);
  };

  /// time slot selection setup

  const slots = [
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
  ];

  const seats = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const [selectedSlots, setSelectedSlots] = useState([]);

  const selectionHandler = item => {
    selectedSlots.push(item);
  };

  const deselectionHandler = item => {
    setSelectedSlots(prevState =>
      prevState.filter(prevItem => prevItem !== item),
    );
  };

  // Time Slot Setup Ends here

  // const [position, setPosition] = React.useState('1');

  const [sheetOpen, setSheetOpen] = useState(false);

  const {isOpen, onOpen, onClose} = useDisclose();

  //Seat selectionSetup
  const [isSeatDropdownOpen, setIsSeatDropdownOpen] = useState(false);
  return (
    <View style={{flex: 1}}>
      <View style={[styles.root, {opacity: currentIndex >= 0 ? 0.5 : 1}]}>
        {/* Scroll View (Details Section) */}
        <View style={{flex: 1, width: '100%'}}>
          <ScrollView style={{flex: 1}}>
            {/* Image And  office detail Card*/}
            <View style={{alignItems: 'center'}}>
              <Image
                source={{
                  uri: office.image,
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
                    transform: [
                      {rotate: I18nManager.isRTL ? '180deg' : '0deg'},
                    ],
                  }}
                />
              </Pressable>
              {/* detail Card */}
              <View
                style={[
                  styles.detailCard,
                  {width: width - 32, elevation: currentIndex >= 0 ? 1 : 4},
                ]}>
                {/* Name */}
                <Text style={styles.textBold}>{office.title}</Text>

                {/* Price Floor Area */}
                <View
                  style={{
                    width: width - 32 - 36,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 12,
                  }}>
                  <View style={{alignItems: 'center'}}>
                    <Text style={styles.textNormal}>{I18n.t('Price')}</Text>
                    {title == 'Events' ? (
                      <Text style={styles.textSemiBold}>
                        {office.price} {I18n.t('Kd')}/{I18n.t('Seats')}
                      </Text>
                    ) : (
                      <Text style={styles.textSemiBold}>
                        {office.price}
                        {I18n.t('Kd')}/{I18n.t('Day')}
                      </Text>
                    )}
                  </View>
                  <View style={{alignItems: 'center'}}>
                    {title == 'Events' ? (
                      <Text style={styles.textNormal}>{I18n.t('Hall')}</Text>
                    ) : (
                      <Text style={styles.textNormal}>{I18n.t('Floor')}</Text>
                    )}

                    {title == 'Events' ? (
                      <Text style={styles.textSemiBold}>
                        {I18n.t('Conference')}
                      </Text>
                    ) : (
                      <Text style={styles.textSemiBold}>{office.floor}</Text>
                    )}
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <Text style={styles.textNormal}>{I18n.t('Area')}</Text>
                    <Text style={styles.textSemiBold}>{office.area}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Image And  office detail Card Ends Here*/}

            {/* detail Dropdown*/}
            <DetailsDropdown
              details={office.details}
              style={{elevation: currentIndex >= 0 ? 1 : 4}}
            />
            {/* detail Dropdown Ends Here */}
            {/* Amenities Section */}
            <View
              style={{
                marginTop: 28,
                width: '100%',

                alignItems: 'flex-start',
              }}>
              <Text style={[styles.textBold, {marginLeft: 16}]}>
                {I18n.t('Amenities')}
              </Text>
              <View
                style={{
                  width: width - 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 12,
                  marginLeft: 8,
                }}>
                {office.amenities.map(item => (
                  <AmeityCard icon={item.icon} title={item.title}></AmeityCard>
                ))}
              </View>
            </View>
            {/* Amenities Section Ends Here */}

            {/* Add Time Slots is Title is Meeting rooms */}
            {/* Times slots */}
            {title == 'Meeting rooms' ? (
              <View
                style={{
                  marginTop: 28,
                  width: '100%',

                  // alignItems: 'flex-start',
                }}>
                <Text
                  style={[
                    styles.textBold,
                    {marginLeft: 16, textAlign: 'left'},
                  ]}>
                  {I18n.t('TimeSlots')}
                </Text>

                {/* slots list */}

                <View style={{alignItems: 'center'}}>
                  <FlatList
                    keyExtractor={(item, index) => `key-${index}`}
                    data={slots}
                    style={{marginTop: 11, marginHorizontal: 16}}
                    // horizontal={true}
                    numColumns={4}
                    renderItem={item => (
                      <Chip
                        label={item.item}
                        selectLabelHandler={selectionHandler}
                        deselectLabelHandler={deselectionHandler}></Chip>
                    )}
                  />
                </View>

                {/* slots list ends here */}
              </View>
            ) : null}
            {/* Time Slots Ends Here */}

            {/* Select Seats is visible when  Title is Events */}
            {/* Select Seats */}
            {title == 'Events' ? (
              <View
                style={{
                  marginTop: 28,
                  width: '100%',

                  // alignItems: 'flex-start',
                }}>
                <Text
                  style={[
                    styles.textBold,
                    {marginLeft: 16, textAlign: 'left'},
                  ]}>
                  {I18n.t('Seats')}
                </Text>

                {/* seat selection drop down */}

                <Pressable
                  onPress={() => {
                    setIsSeatDropdownOpen(!isSeatDropdownOpen);
                  }}
                  style={{
                    height: 48,
                    width: width - 32,
                    marginHorizontal: 16,
                    backgroundColor: 'rgba(239, 176, 99, 0.5)',
                    borderTopLeftRadius: 6,
                    borderTopRightRadius: 6,
                    borderBottomRightRadius: isSeatDropdownOpen ? 0 : 6,
                    borderBottomLeftRadius: isSeatDropdownOpen ? 0 : 6,
                    marginTop: 6,
                    // opacity: 0.5,
                    paddingHorizontal: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[CustomText[40020], {color: 'black', fontSize: 18}]}>
                    {I18n.t('SelectSeat')}
                  </Text>
                  <Image
                    source={require('../../assets/icons/HomeScreen/chevron-down.png')}
                    style={{
                      height: 24,
                      width: 24,
                      transform: [
                        {rotate: isSeatDropdownOpen ? '-180deg' : '0deg'},
                      ],
                    }}
                  />
                </Pressable>
                {isSeatDropdownOpen ? (
                  <Pressable
                    onPress={() => {
                      setIsSeatDropdownOpen(!isSeatDropdownOpen);
                    }}
                    style={{
                      // height: 48,
                      width: width - 32,
                      marginHorizontal: 16,
                      backgroundColor: 'rgba(239, 176, 99, 0.5)',
                      borderBottomRightRadius: 6,
                      borderBottomLeftRadius: 6,
                      // marginTop: 6,
                      // opacity: 0.5,
                      paddingHorizontal: 12,
                      // flexDirection: 'row',
                      // justifyContent: 'space-between',
                      // alignItems: 'center',
                    }}>
                    <View>
                      <Text style={{marginBottom: 6}}>1</Text>
                      <Divider
                        style={{
                          backgroundColor: 'black',
                          opacity: 0.1,
                        }}
                      />
                    </View>

                    <View>
                      <Text style={{marginBottom: 6}}>2</Text>
                      <Divider
                        style={{
                          backgroundColor: 'black',
                          opacity: 0.1,
                        }}
                      />
                    </View>
                    <View>
                      <Text style={{marginBottom: 6}}>3</Text>
                      <Divider
                        style={{
                          backgroundColor: 'black',
                          opacity: 0.1,
                        }}
                      />
                    </View>
                    <View>
                      <Text style={{marginBottom: 6}}>4</Text>
                      <Divider
                        style={{
                          backgroundColor: 'black',
                          opacity: 0.1,
                        }}
                      />
                    </View>
                    <View>
                      <Text style={{marginBottom: 6}}>5</Text>
                      <Divider
                        style={{
                          backgroundColor: 'black',
                          opacity: 0.1,
                        }}
                      />
                    </View>
                  </Pressable>
                ) : null}

                {/* seat selection drop down ends here */}
              </View>
            ) : null}
            {/* { Select Seats Ends Here */}

            {/* Location */}
            <View
              style={{
                marginTop: 16,
                width: '100%',
              }}>
              <Text style={[styles.textBold, {marginLeft: 16}]}>
                {I18n.t('Location')}
              </Text>
              <View
                style={{flexDirection: 'row', marginLeft: 16, marginTop: 12}}>
                <Image
                  source={require('../../assets/icons/OfficeDetailScreen/location.png')}
                  style={{width: 20, height: 20}}
                />
                <Text style={[styles.location, {marginLeft: 8}]}>
                  {office.location}
                </Text>
              </View>
              <Image
                source={{
                  uri: 'https://developers.google.com/static/maps/images/landing/webgl.png',
                }}
                style={{
                  height: 172,
                  width: width - 32,
                  borderRadius: 8,
                  marginHorizontal: 16,
                  marginTop: 14,
                  marginBottom: 22,
                }}
              />
            </View>
            {/* Location Ends Here*/}
          </ScrollView>
        </View>
        {/* Scroll View (Details Section) Ends Here */}

        {/* Book Now Button */}
        <View style={styles.bookNowButtonCard}>
          <BookNowButton
            // onPress={bookNowButtonHandler}

            onPress={() => {
              // onOpen();
              setSheetOpen(!sheetOpen);
            }}
          />
        </View>
        {/* Book Now Button Ends Here */}
      </View>
      {/* Authentication screens */}
      {/* <BottomSheet
        ref={bottomSheetRef}
        index={currentIndex}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose>
        <View
          style={{
            flex: 1,
          }}>
          <AuthForm
            scrollToIndex={scrollToIndex}
            closeSheet={handleClosePress}
            currentIndex={currentIndex}
            title={title}
          />
        </View>
      </BottomSheet> */}
      <Actionsheet
        isOpen={sheetOpen}
        onClose={() => {
          setSheetOpen(!sheetOpen);
        }}>
        <Actionsheet.Content bottom={bottomInset}>
          <AuthForm
            scrollToIndex={scrollToIndex}
            closeSheet={handleClosePress}
            currentIndex={currentIndex}
            title={title}
          />
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
};

export default OfficeDetailsScreen;
