import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import httpClient from './useHttp';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type partnerType = {
  id: number;
  name_en: string;
  name_ar: string;
  status: number;
};
type genderType = {id: number; name_en: string; name_ar: string};

export type countries = {
  id: number;
  title_en: string;
  title_ar: string;
  country_code: string;
  image_url: string;
  phone_code: string;
};

export type propertyTypeDTO = {
  id: number;
  name_en: string;
  name_ar: string;
  images_url: string;
};

export const useInit = () => {
  const navigation = useNavigation();

  const [partnerType, setPartnerType] = useState<partnerType[]>([]);
  const [genderType, setGenderType] = useState<genderType[]>([]);
  const [agreement, setAgreement] = useState('');
  const [countryList, setCountryList] = useState<countries[]>([]);
  const [propertyType, setPropertyType] = useState<propertyType[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const getInitList = () => {
    httpClient
      .get('/vendor-registration-init')
      .then((response: any) => {
        if (response.data.status === 'success') {
          setPartnerType(response.data?.data.partner_type);
          setGenderType(response.data?.data.Mr_Mrs);
          setAgreement(response.data?.data.agreement);
          setCountryList(response.data?.data.countries);
          setPropertyType(response.data?.data.property_types);
          setLoading(false);

          AsyncStorage.setItem(
            'COUNTRY_LIST',
            JSON.stringify(response.data?.data.countries),
          );
        }
      })
      .catch((error: any) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getInitList();
    });

    return unsubscribe;
  }, [navigation]);

  return {
    partnerType,
    genderType,
    agreement,
    countryList,
    propertyType,
    dataLoading: loading,
  };
};
