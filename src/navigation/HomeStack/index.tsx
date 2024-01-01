import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import Colors from '../../constants/Colors';
import BookingSuccessScreen from '../../screens/BookingSuccessScreen';
import CheckoutScreen from '../../screens/checkoutScreen';
import PartnerDetailsScreen from '../../screens/PartnerDetailsScreen';
import HomeScreen from '../../screens/HomeScreen';
import SearchedResultsScreen from '../../screens/SearchResultsScreen/index';
import SelectAreaScreen from '../../screens/SelectAreaScreen';
import Trail from '../../screens/Trail/Trail';
import CompanyOfficeScreen from '../../screens/CompanyOfficeScreen';
import OfficeFilterScreen from '../../screens/OfficeFilterScreen/Index';
import VenueDetailsScreen from '../../screens/VenueDetailsScreen';
import PropertyDetailsScreen from '../../screens/PropertyDetailsScreen';
import AppSplashScreen from '../../screens/SplashScreen';
import PropertyListingScreen from '../../screens/PropertyLisitngScreen';
import PaymentScreen from '../../screens/PaymentScreen';
import PaymentFailure from '../../screens/paymentFailure';
import EventsListingScreen from '../../screens/EventsListingScreen';
import EventDetailsScreen from '../../screens/EventsDetailsScreen';
import i18n from '../../language/I18n';
import {Pressable, Image, I18nManager, View, Text} from 'react-native';
import TypeScreen from '../../screens/TypeScreen';
import AgreementScreen from '../../screens/AgreementScreen';
import ProfileDetailsScreen from '../../screens/ProfileDetailsScreen/ProfileDetailsScreen/index';
import TrainerDetailsScreen from '../../screens/TrainerDetailsScreen';
import CountryScreen from '../../screens/CountryScreen/CountryScreen/index';
import PropertyScreen from '../../screens/PropertyScreen';
import UserSignatureScreen from '../../screens/UserSignatureScreen';
import Entypo from 'react-native-vector-icons/Entypo';
import AreaListScreen from '../../screens/AreaListScreen';
import EventScreen from '../../screens/EventCategoryScreen';

const Stack = createStackNavigator();

const HomeStack = ({navigation}: any) => {
  return (
    <Stack.Navigator
      initialRouteName="splash"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={AppSplashScreen} name="splash" />
      <Stack.Screen component={HomeScreen} name="HomeScreen" />
      <Stack.Screen
        component={PropertyDetailsScreen}
        name="PropertyDetailsScreen"
      />
      <Stack.Screen component={EventDetailsScreen} name="EventDetailsScreen" />
      <Stack.Screen component={OfficeFilterScreen} name="OfficeFilterScreen" />
      <Stack.Screen
        component={CompanyOfficeScreen}
        name="CompanyOfficeScreen"
        options={{
          headerShown: true,
          title: 'Offices',
          headerTitleStyle: {
            fontFamily: 'Inter-Bold',
            fontSize: 20,
          },
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        component={PartnerDetailsScreen}
        name="PartnerDetailsScreen"
      />
      <Stack.Screen component={Trail} name="Trail" />
      <Stack.Screen
        component={SelectAreaScreen}
        name="SelectAreaScreen"
        options={{
          headerShown: true,
          title: 'Select Area',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        component={SearchedResultsScreen}
        name="SearchedResultsScreen"
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen component={VenueDetailsScreen} name="VenueDetailsScreen" />
      <Stack.Screen
        component={PropertyListingScreen}
        name="PropertyListingScreen"
        options={({route: {params}}: any) => {
          return {
            headerShown: true,
            title: 'Offices',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'Inter-Regular',
              fontWeight: '700',
              fontSize: 20,
              lineHeight: 24,
              color: Colors.darkBlack,
            },
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Image
                  source={require('../../assets/icons/OfficeDetailScreen/back.png')}
                  style={{
                    height: 18,
                    width: 18,
                    marginLeft: 18,
                    transform: [
                      {rotate: I18nManager.isRTL ? '180deg' : '0deg'},
                    ],
                  }}
                />
              </Pressable>
            ),
            headerRight: () => (
              <Pressable
                onPress={() => {
                  if (
                    (params?.countryIds && params?.countryIds?.length > 0) ||
                    (params?.filterIds && params?.filterIds?.length > 0)
                  ) {
                    navigation.goBack();
                  }
                  navigation.navigate('AreaList', {
                    data: params?.data,
                    title: params?.title,
                    screenName: 'PropertyAreaList',
                  });
                }}>
                <Entypo
                  name="location-pin"
                  size={24}
                  color="black"
                  style={{marginRight: 12}}
                />
              </Pressable>
            ),
          };
        }}
      />
      <Stack.Screen
        component={EventsListingScreen}
        name="Event"
        options={({route: {params}}: any) => {
          return {
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitle: i18n.locale === 'en' ? 'Event' : 'حدث',

            headerTitleStyle: {
              fontFamily: 'Inter-Regular',
              fontWeight: '700',
              fontSize: 20,
              lineHeight: 24,
              color: Colors.darkBlack,
            },
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  navigation.navigate('HomeScreen');
                }}>
                <Image
                  source={require('../../assets/icons/OfficeDetailScreen/back.png')}
                  style={{
                    height: 14,
                    width: 14,
                    marginLeft: 16,
                    transform: [
                      {rotate: I18nManager.isRTL ? '180deg' : '0deg'},
                    ],
                  }}
                />
              </Pressable>
            ),
            headerRight: () => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Pressable
                  onPress={() => {
                    if (
                      (params?.countryIds && params?.countryIds?.length > 0) ||
                      (params?.filterIds && params?.filterIds?.length > 0)
                    ) {
                      navigation.goBack();
                    }
                    navigation.navigate('AreaList', {
                      data: params?.data,
                      title: params?.title,
                      screenName: 'EventAreaList',
                    });
                  }}>
                  <Entypo
                    name="location-pin"
                    size={28}
                    color="black"
                    style={{marginRight: 20}}
                  />
                </Pressable>
                <Pressable
                  onPress={() =>
                    navigation.navigate('EventList', {
                      data: params?.data,
                      title: params?.title,
                    })
                  }>
                  <Image
                    source={require('../../assets/icons/settings-sliders.png')}
                    style={{
                      height: 40,
                      width: 20,
                      resizeMode: 'contain',
                      marginRight: 15,
                    }}
                  />
                </Pressable>
              </View>
            ),
          };
        }}
      />
      <Stack.Screen
        component={TypeScreen}
        name={'Partner with us'}
        options={{
          headerShown: true,
          headerTitle: i18n.locale === 'en' ? 'Partner with us' : 'شريك معنا',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Inter-Regular',
            fontWeight: '700',
            fontSize: 20,
            lineHeight: 24,
            color: Colors.darkBlack,
          },
          headerLeft: () => (
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                source={require('../../assets/icons/OfficeDetailScreen/back.png')}
                style={{
                  height: 14,
                  width: 14,
                  marginLeft: 16,
                  transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
                }}
              />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        component={CountryScreen}
        name="Countries"
        options={{
          headerShown: true,
          headerTitle: i18n.locale === 'en' ? 'Countries' : 'بلدان',

          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Inter-Regular',
            fontWeight: '700',
            fontSize: 20,
            lineHeight: 24,
            color: Colors.darkBlack,
          },
          headerLeft: () => (
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                source={require('../../assets/icons/OfficeDetailScreen/back.png')}
                style={{
                  height: 14,
                  width: 14,
                  marginLeft: 16,
                  transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
                }}
              />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        component={PropertyScreen}
        name="Property Type"
        options={{
          headerShown: true,
          headerTitle: i18n.locale === 'en' ? 'Property Type' : 'نوع الملكية',

          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Inter-Regular',
            fontWeight: '700',
            fontSize: 20,
            lineHeight: 24,
            color: Colors.darkBlack,
          },
          headerLeft: () => (
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                source={require('../../assets/icons/OfficeDetailScreen/back.png')}
                style={{
                  height: 14,
                  width: 14,
                  marginLeft: 16,
                  transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
                }}
              />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        component={AgreementScreen}
        name="Agreement"
        options={{
          headerShown: true,
          headerTitle: i18n.locale === 'en' ? 'Agreement' : 'اتفاق',

          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Inter-Regular',
            fontWeight: '700',
            fontSize: 20,
            lineHeight: 24,
            color: Colors.darkBlack,
          },
          headerLeft: () => (
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                source={require('../../assets/icons/OfficeDetailScreen/back.png')}
                style={{
                  height: 14,
                  width: 14,
                  marginLeft: 16,
                  transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
                }}
              />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        component={UserSignatureScreen}
        name="Signature"
        options={{
          headerShown: true,
          headerTitle: i18n.locale === 'en' ? 'Signature' : 'إمضاء',

          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Inter-Regular',
            fontWeight: '700',
            fontSize: 20,
            lineHeight: 24,
            color: Colors.darkBlack,
          },
          headerLeft: () => (
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                source={require('../../assets/icons/OfficeDetailScreen/back.png')}
                style={{
                  height: 14,
                  width: 14,
                  marginLeft: 16,
                  transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
                }}
              />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        component={ProfileDetailsScreen}
        name="Profile Details"
        options={{
          headerShown: true,
          headerTitle:
            i18n.locale === 'en' ? 'Profile Details' : 'تفاصيل الملف الشخصي',

          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Inter-Regular',
            fontWeight: '700',
            fontSize: 20,
            lineHeight: 24,
            color: Colors.darkBlack,
          },
          headerLeft: () => (
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                source={require('../../assets/icons/OfficeDetailScreen/back.png')}
                style={{
                  height: 14,
                  width: 14,
                  marginLeft: 16,
                  transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
                }}
              />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        component={TrainerDetailsScreen}
        name="Trainer Details"
        options={{
          headerShown: true,
          headerTitle:
            i18n.locale === 'en' ? 'Trainer Details' : 'تفاصيل المدرب',

          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Inter-Regular',
            fontWeight: '700',
            fontSize: 20,
            lineHeight: 24,
            color: Colors.darkBlack,
          },
          headerLeft: () => (
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                source={require('../../assets/icons/OfficeDetailScreen/back.png')}
                style={{
                  height: 14,
                  width: 14,
                  marginLeft: 16,
                  transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
                }}
              />
            </Pressable>
          ),
        }}
      />

      {/* <Stack.Screen
        component={BookingDetailsScreen}
        name="BookingDetailsScreen"

      /> */}
      <Stack.Screen
        component={CheckoutScreen}
        name="CheckoutScreen"
        options={{
          headerShown: true,
          title: `${i18n.t('BookingDetails')}`,
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontFamily: 'Inter-Regular',
            fontWeight: '700',
            fontSize: 20,
            lineHeight: 24,
            color: Colors.darkBlack,
          },
          headerLeft: () => (
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                source={require('../../assets/icons/OfficeDetailScreen/back.png')}
                style={{
                  height: 18,
                  width: 18,
                  marginLeft: 18,
                  transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
                }}
              />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        component={PaymentScreen}
        name="PaymentScreen"
        options={{
          headerShown: false,
          title: `${i18n.t('BookingDetails')}`,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Inter-Regular',
            fontWeight: '700',
            fontSize: 20,
            lineHeight: 24,
            color: Colors.darkBlack,
          },
        }}
      />
      <Stack.Screen
        component={PaymentFailure}
        name="PaymentFailure"
        options={{
          headerShown: false,
          title: `${i18n.t('BookingDetails')}`,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Inter-Regular',
            fontWeight: '700',
            fontSize: 20,
            lineHeight: 24,
            color: Colors.darkBlack,
          },
        }}
      />
      <Stack.Screen
        component={BookingSuccessScreen}
        name="BookingSuccessScreen"
        options={{
          headerShown: true,
          title: `${i18n.t('BookingSuccessful')}`,
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontFamily: 'Inter-Regular',
            fontWeight: '700',
            fontSize: 20,
            lineHeight: 24,
            color: Colors.darkBlack,
          },
          headerLeft: () => (
            <Pressable
              onPress={() => {
                navigation.navigate('HomeScreen', {
                  paymentSuccess: Math.random().toString(),
                });
              }}>
              <Image
                source={require('../../assets/icons/OfficeDetailScreen/back.png')}
                style={{
                  height: 18,
                  width: 18,
                  marginLeft: 18,
                  transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
                }}
              />
            </Pressable>
          ),
          headerBackImage: () => null,
        }}
      />
      <Stack.Screen
        component={AreaListScreen}
        name="AreaList"
        options={{
          headerShown: true,
          // headerStyle: {
          //   backgroundColor: '#EFB063',
          // },
          title: `${i18n.t('Areas')}`,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Inter-Regular',
            fontWeight: '700',
            fontSize: 20,
            lineHeight: 24,
            color: '#C46537',
          },
          headerLeft: () => (
            <Pressable
              style={{marginLeft: 5}}
              onPress={() => {
                navigation.goBack();
              }}>
              <Entypo name="cross" size={24} color="black" />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              style={{
                backgroundColor: '#EFB063',
                marginRight: 15,
                padding: 7,
                borderRadius: 5,
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>Filter</Text>
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        component={EventScreen}
        name="EventList"
        options={{
          headerShown: true,
          title: `${i18n.t('Event Category')}`,

          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Inter-Regular',
            fontWeight: '700',
            fontSize: 20,
            lineHeight: 24,
            color: '#C46537',
          },
          headerLeft: () => (
            <Pressable
              style={{marginLeft: 5}}
              onPress={() => {
                navigation.goBack();
              }}>
              <Entypo name="cross" size={24} color="black" />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              style={{
                backgroundColor: '#EFB063',
                marginRight: 15,
                padding: 7,
                borderRadius: 5,
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                {i18n.t('Filter')}
              </Text>
            </Pressable>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
