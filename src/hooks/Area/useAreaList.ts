import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import httpClient from '../useHttp';
import {showToast} from '../../services/generalservices';

export type areaType = {
  id: number;
  country_id: number;
  title_en: string;
  title_ar: string;
};

export const useAreaList = () => {
  const navigation = useNavigation();
  const [areaList, setAreaList] = useState<areaType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const getAreaList = () => {
    httpClient
      .get('/area')
      .then((response: any) => {
        if (response.data.status === 'success') {
          console.log('res', response?.data?.data.area);
          setAreaList(response.data?.data.area);
          setLoading(false);
        }
      })
      .catch((error: any) => {
        showToast({color: 'red.500', msg: error?.message});

        setLoading(false);
      });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getAreaList();
    });

    return unsubscribe;
  }, [navigation]);

  return {
    areaList,
    dataLoading: loading,
  };
};
