import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  I18nManager,
} from 'react-native';
import React, {useRef, useState} from 'react';

import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {ActivityIndicator, Drawer} from 'react-native-paper';

import CustomText from '../../../constants/CustomText';
import Colors from '../../../constants/Colors';
import BottomSheet from '@gorhom/bottom-sheet';

import {useSelector, useDispatch} from 'react-redux';

// import {toggleSheet} from '../../../store/redux/slices/actionSheetSlice';
// import I18n from '../../../language/I18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';

import SplashScreen from 'react-native-splash-screen';
import {
  setSelectedCountry,
  toggleSheet,
  toggleShowRegisterForm,
} from '../../../store/slice/masterSlice';
import {useAppSelector} from '../../../store/hooks';
import httpClient from '../../../hooks/useHttp';
import {auth} from '../../../store/slice/authSlice';
import {VStack} from 'native-base';
import {changeLang} from '../../../store/slice/langSlice';

import {showToast} from '../../../services/generalservices';

import i18n from '../../../language/I18n';
import moment from 'moment-timezone';

const CustomDrawer = (props: any) => {
  const dispatch = useDispatch();
  // const {t, i18n} = useTranslation();
  const {data}: any = useAppSelector(state => state?.auth);

  const {lang}: any = useAppSelector(state => state?.lang);

  const {appData, selectedCountry} = useAppSelector(state => state?.master);

  i18n.locale = lang;
  const isLoggedIn = Object.keys(data).length !== 0;

  const changeToEnglish = async () => {
    if (lang === 'en') {
      props.navigation.toggleDrawer();
      return null;
    }
    // dispatch(changeLang('en'));
    // i18n.locale = 'en';
    await AsyncStorage.setItem('local', 'en');
    I18nManager.forceRTL(false);
    SplashScreen.show();
    RNRestart.Restart();
  };

  const changeToArabic = async () => {
    if (lang === 'ar') {
      props.navigation.toggleDrawer();
      // setError('language is already Arabic.');

      return null;
    }

    // dispatch(changeLang('ar'));
    // i18n.locale = 'ar';
    await AsyncStorage.setItem('local', 'ar');
    I18nManager.forceRTL(true);
    SplashScreen.show();
    RNRestart.Restart();
  };

  const [loading, setLoading] = useState(false);

  const logoutHandler = async () => {
    setLoading(true);
    httpClient
      .get('/logout')
      .then(res => {
        if (res?.data.status === 'success') {
          showToast({msg: res?.data?.msg, color: 'green'});
        }
        dispatch(auth({}));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteAccountHandler = async () => {
    setLoading(true);
    httpClient
      .get('/logout')
      .then(res => {
        if (res?.data.status === 'success') {
          showToast({msg: res?.data?.msg, color: 'green'});
        }
        dispatch(auth({}));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // console.log('error', error);

  const bottomSheetRef = useRef<BottomSheet>(null);

  let height = 22;
  let width = 22;

  return (
    // <View style={{flex: 1, width: 300}}>
    <DrawerContentScrollView
      {...props}
      showsVerticalScrollIndicator={false}
      scrollToOverflowEnabled
      contentContainerStyle={{
        flex: 1,
        // width:500,
        elevation: 5,

        borderTopRightRadius: 28,
        // borderBottomRightRadius: 28,
        marginBottom: 0,
        marginTop: -10,
        backgroundColor: 'white',
      }}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        {/* Account Info */}
        {Object.keys(data).length === 0 ? (
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              marginTop: 22,
              marginBottom: 10,
              marginHorizontal: 2,
              alignItems: 'center',
            }}>
            <Pressable
              onPress={() => {
                // props.navigation.toggleDrawer();

                dispatch(toggleShowRegisterForm(true));
                dispatch(toggleSheet({}));
              }}
              style={{
                backgroundColor: '#C46537',
                borderRadius: 10,

                height: 48,
                width: '90%',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                elevation: 2,
              }}>
              <Image
                source={require('../../../assets/icons/user.png')}
                style={{height: 24, width: 24, marginRight: 15}}
                resizeMode="cover"
              />
              <Text style={[CustomText[40020], {color: '#fff'}]}>
                {i18n.t('CreateAccount')}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={{marginLeft: 16, marginTop: 20, marginBottom: 16}}>
            <Text
              style={[
                CustomText[50020],
                {color: '#000000', lineHeight: 21.78, fontWeight: '700'},
              ]}>
              {i18n.t('Hello')}
            </Text>
            <Text
              style={[
                CustomText[50020],
                {
                  color: '#000000',
                  fontSize: 18,
                  lineHeight: 21.78,
                  marginTop: 6,
                  textAlign: 'left',
                  marginRight: 8,
                },
              ]}>
              {data?.user?.name}
            </Text>
          </View>
        )}

        {/* Account Info Ends Here */}
        <DrawerItemList {...props} />
        {/* My account */}

        {isLoggedIn ? (
          <VStack>
            <Drawer.Item
              onPress={() => {
                // dispatch(toggleSheet({}));

                props.navigation.toggleDrawer();
                dispatch(toggleSheet({}));
                dispatch(toggleShowRegisterForm(false));
              }}
              label=""
              icon={() => (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../../assets/icons/Drawer/account.png')}
                    style={{
                      height: 26,
                      width: 24,
                      marginLeft: I18nManager.isRTL ? 0 : -3,
                    }}
                  />
                  <Text
                    style={[
                      CustomText[50020],
                      {
                        fontSize: 18,
                        color: '#000000',
                        marginLeft: I18nManager.isRTL ? 32 : 24,
                      },
                    ]}>
                    {i18n.t('MyAccount')}
                  </Text>
                </View>
              )}
            />
            <Drawer.Item
              label=""
              icon={() =>
                loading ? (
                  <View
                    style={{
                      width: 200,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <ActivityIndicator color={Colors.primaryGolden} />
                  </View>
                ) : (
                  <Pressable
                    onPress={logoutHandler}
                    style={{flexDirection: 'row'}}>
                    <Image
                      source={require('../../../assets/icons/Drawer/logout.png')}
                      style={{height: 24, width: 24}}
                    />
                    <Text
                      style={[
                        CustomText[50020],
                        {fontSize: 18, color: '#000000', marginLeft: 16},
                      ]}>
                      {i18n.t('Logout')}
                    </Text>
                  </Pressable>
                )
              }
            />
          </VStack>
        ) : null}

        {/* Countries list */}

        <View
          style={{
            marginTop: 20,
            marginLeft: 20,
            justifyContent: 'flex-start',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          {appData?.countries?.map((country, index) => {
            return (
              <Pressable
                onPress={async () => {
                  moment.tz.setDefault(country?.time_zone);

                  dispatch(setSelectedCountry(country));
                  await AsyncStorage.setItem(
                    'country',
                    JSON.stringify(country),
                  );
                  props.navigation.toggleDrawer();
                }}>
                <View key={country?.id}>
                  <View
                    style={{
                      opacity:
                        country?.title_en === selectedCountry?.title_en
                          ? 1.0
                          : 0.5,
                    }}>
                    <Image
                      source={{uri: country?.image_url}}
                      style={{
                        height: 40,
                        width: 40,
                        marginRight: 40,
                        marginBottom: 12,
                      }}
                    />
                  </View>

                  <Text
                    style={[
                      CustomText[40020],
                      {
                        color: '#000000',
                        fontSize: 16,
                        marginBottom: 28,
                        alignSelf: 'center',
                        marginRight: 36,
                        opacity:
                          country?.title_en === selectedCountry?.title_en
                            ? 1.0
                            : 0.5,
                      },
                    ]}>
                    {country?.country_code}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
        {/* Countries list Ends here */}
        {/* Language Selection Button */}
        <View style={{flexDirection: 'row', marginBottom: 8}}>
          <Pressable
            onPress={() => {
              // changeLanguageHandler('en');
              changeToEnglish();
            }}
            style={{
              backgroundColor: '#C46537',
              borderRadius: 10,
              height: 48,
              width: 120,
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 2,
              marginLeft: 15,
            }}>
            <Text style={[CustomText[40020], {color: '#ffffff'}]}>English</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              // changeLanguageHandler('ar');
              changeToArabic();
            }}
            style={{
              backgroundColor: '#C46537',
              borderRadius: 10,
              height: 48,
              width: 120,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 10,
              elevation: 2,
            }}>
            <Text style={[CustomText[40020], {color: '#ffffff'}]}>العربية</Text>
          </Pressable>
        </View>
        {/* Language Selection Button ends here */}
      </ScrollView>
    </DrawerContentScrollView>
    // {/* </View> */}
  );
};

export default CustomDrawer;
