import React, {useEffect} from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeStack from '../HomeStack';
import CustomDrawer from './components';
import MyBookingsStack from '../MyBookingStack';
import {I18nManager, Image, Pressable} from 'react-native';
import AboutUs from '../../screens/AboutUsScreen';
import PrivacyPolicy from '../../screens/PrivacyPolicy';
import TermsAndConditions from '../../screens/TermsAndConditions';
import {useNavigation} from '@react-navigation/native';
import SettingsScreen from '../../screens/SettingsScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {changeLang} from '../../store/slice/langSlice';
import {setSelectedCountry} from '../../store/slice/masterSlice';
import i18n from '../../language/I18n';
import moment from 'moment-timezone';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  const dispatch = useAppDispatch();
  const {lang}: any = useAppSelector(state => state?.lang);
  const {data}: any = useAppSelector(state => state?.auth);

  const isLoggedIn = Object.keys(data).length !== 0;

  useEffect(() => {
    (async () => {
      let storedLocal = await AsyncStorage.getItem('local');

      if (storedLocal === null) {
        dispatch(changeLang('en'));
        i18n.locale = 'en';
        I18nManager.forceRTL(false);
      } else {
        dispatch(changeLang(storedLocal));
        if (storedLocal === 'ar') {
          i18n.locale = 'ar';
          I18nManager.forceRTL(true);
        }
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      let userCountry: unknown;
      userCountry = await AsyncStorage.getItem('country');

      if (userCountry) {
        const selectedCountry = JSON.parse(userCountry as string);
        moment.tz.setDefault(selectedCountry?.time_zone);
        dispatch(setSelectedCountry(selectedCountry));
      }
    })();
  }, [dispatch]);

  let height = 27;
  let width = 25;
  const navigation = useNavigation();

  return (
    <Drawer.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#C46537',
        drawerItemStyle: {
          borderTopRightRadius: 10,
          marginHorizontal: 0,
          borderRadius: 0,
          paddingHorizontal: 8,
          marginBottom: 0,
        },

        drawerStyle: {
          backgroundColor: 'transparent',
          borderTopRightRadius: 28,
          overflow: 'hidden',
        },
        drawerLabelStyle: {
          marginLeft: I18nManager.isRTL ? 0 : -12,
          fontFamily: 'Inter-Regular',
          fontWeight: '400',
          fontSize: 18,
          textAlign: 'left',
          lineHeight: 21.78,
          // color: '#000000',
        },
        drawerActiveTintColor: '#ffffff',
        drawerInactiveTintColor: '#000000',
      }}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          drawerLabel: I18nManager.isRTL ? 'الرئيسية' : 'Home',
          // drawerLabelStyle: {color: '#ffffff', fontSize: 20},
          drawerIcon: ({color, size}) => (
            <Image
              source={require('../../assets/icons/Drawer/home.png')}
              style={{height: 27, width: 25}}
            />
          ),
        }}
      />
      {isLoggedIn ? (
        <Drawer.Screen
          name="myBookings"
          component={MyBookingsStack}
          options={{
            // drawerItemStyle:{backgroundColor:"yellow",flex:1,width:"100%"},

            drawerLabel: I18nManager.isRTL ? 'حجوزاتي' : 'My Bookings',
            drawerIcon: ({color}) => (
              <Image
                source={require('../../assets/icons/Drawer/bookings.png')}
                style={{height: height, width: width}}
              />
            ),
          }}
        />
      ) : null}

      {isLoggedIn ? (
        <Drawer.Screen
          name="settings"
          component={SettingsScreen}
          options={{
            headerShown: true,
            title: I18nManager.isRTL ? 'إعدادات' : 'Settings',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  navigation.navigate('HomeStack');
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
            drawerLabel: I18nManager.isRTL ? 'إعدادات' : 'Settings',
            drawerIcon: ({color}) => (
              <Image
                source={require('../../assets/icons/Drawer/setting.png')}
                style={{height: 24, width: 24}}
              />
            ),
          }}
        />
      ) : null}

      <Drawer.Screen
        name="aboutUs"
        component={AboutUs}
        options={{
          headerShown: true,
          title: I18nManager.isRTL ? 'معلومات عنا' : 'About Us',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Pressable
              onPress={() => {
                navigation.navigate('HomeStack');
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
          drawerLabel: I18nManager.isRTL ? 'معلومات عنا' : 'About Us',
          drawerIcon: ({color}) => (
            <Image
              source={require('../../assets/icons/Drawer/aboutUs.png')}
              style={{height: 24, width: 24}}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="privacyPolicy"
        component={PrivacyPolicy}
        options={{
          headerShown: true,
          title: I18nManager.isRTL ? 'سياسة الخصوصية' : 'Privacy Policy',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Pressable
              onPress={() => {
                navigation.navigate('HomeStack');
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
          drawerLabel: I18nManager.isRTL ? 'سياسة الخصوصية' : 'Privacy Policy',
          drawerIcon: ({color}) => (
            <Image
              source={require('../../assets/icons/Drawer/policy.png')}
              style={{height: height, width: width}}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="termsAndConditions"
        component={TermsAndConditions}
        options={{
          headerShown: true,
          title: I18nManager.isRTL ? 'الأحكام والشروط' : 'Terms & Conditions',
          headerTitleAlign: 'center',
          drawerLabelStyle: {
            marginRight: -10,
            marginLeft: I18nManager.isRTL ? 0 : -12,
            fontFamily: 'Inter-Regular',
            fontWeight: '400',
            textAlign: 'left',
            fontSize: 18,
            lineHeight: 21.78,
            color: '#000000',
          },
          headerLeft: () => (
            <Pressable
              onPress={() => {
                navigation.navigate('HomeStack');
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
          drawerLabel: I18nManager.isRTL
            ? 'الأحكام والشروط'
            : 'Terms & Conditions',
          drawerIcon: ({color}) => (
            <Image
              source={require('../../assets/icons/Drawer/terms.png')}
              style={{height: height, width: width}}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
