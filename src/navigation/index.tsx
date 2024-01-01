import {View, Text, I18nManager, NativeModules} from 'react-native';
import React, {useEffect, useState} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import DrawerNavigation from './Drawer';
import {useDispatch, useSelector} from 'react-redux';
// import I18n from '../language/il8n';
// import { I18n } from 'i18n-js';
// import {I18n} from 'i18n-js';
// import {I18n} from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import toggleLanguage, {changeLanguage} from '../store/redux/slices/langSlice';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {changeLang} from '../store/slice/langSlice';
import httpClient from '../hooks/useHttp';
import DeviceCountry, {
  TYPE_ANY,
  TYPE_TELEPHONY,
  TYPE_CONFIGURATION,
} from 'react-native-device-country';
import {setSelectedCountry} from '../store/slice/masterSlice';
import moment from 'moment-timezone';
// import '../language/I18n';

// const i18n = new I18n();

const RootNavigation = () => {
  const dispatch = useAppDispatch();

  const cId = useAppSelector(state => state.auth.data?.user?.country_id);

  const initializeConutry = async () => {
    let userCountry = await AsyncStorage.getItem('country');

    httpClient
      .get('/init')
      .then(res => {
        const userCon = res.data.data.countries.find(country => {
          if (userCountry) {
            userCountry = JSON.parse(userCountry);
            return +country?.id === +userCountry?.id;
          }

          return +country?.id === +cId;
        });

        if (Object.keys(userCon).length !== 0) {
          moment.tz.setDefault(userCon?.time_zone);
          dispatch(setSelectedCountry(userCon));
        }

        // dispatch(setSelectedCountry(res.data.data.countries));
      })
      .finally(() => {});
  };

  useEffect(() => {
    initializeConutry();
  }, []);

  return (
    // <NavigationContainer>
    <DrawerNavigation />
    // </NavigationContainer>
  );
};

export default RootNavigation;
