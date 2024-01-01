import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import httpClient from '../useHttp';
import {showToast} from '../../services/generalservices';

export type eventCategoryType = {
  id: number;
  name_en: string;
  name_ar: string;
};

export const useEventList = () => {
  const navigation = useNavigation();
  const [eventCategoryList, setEventCategoryList] = useState<
    eventCategoryType[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const getEventCategoryList = () => {
    httpClient
      .get('/eventCategory')
      .then((response: any) => {
        console.log('res', response.data.data.eventCategory);
        if (response.data.status === 'success') {
          setEventCategoryList(response.data?.data.eventCategory);
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
      getEventCategoryList();
    });

    return unsubscribe;
  }, [navigation]);

  return {
    eventCategoryList,
    dataLoading: loading,
  };
};
