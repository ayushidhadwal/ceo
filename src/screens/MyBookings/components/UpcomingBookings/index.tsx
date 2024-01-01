import {View, Text, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import offices from '../../../../data/offices';
import BookingCard from '../Card';
import httpClient from '../../../../hooks/useHttp';
import {ActivityIndicator} from 'react-native-paper';
import {ImageLoad, showToast} from '../../../../services/generalservices';
import {Colors} from '../../../../styles/Colors';
import i18n from 'i18n-js';

const UpcomingBookings = ({navigation}: any) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  console.log('upcoming bookings');

  // const loadData = async () => {
  //   setLoading(true);
  //   httpClient
  //     .get('/checkout-get')
  //     .then(res => {
  //       console.log(res.data);
  //       if (res.data.status === 'success') {
  //         // console.log('res.data.data', res.data.data.upcoming);
  //         // setData(res.data.data?.upcoming);
  //       }
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };
  //
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     loadData();
  //   });
  //   return unsubscribe;
  // }, [navigation]);

  const loadData = () => {
    httpClient
      .get('/checkout-get')
      .then((response: any) => {
        console.log(response.data);
        if (response.data.status === 'success') {
          console.log(response.data.data?.upcoming);
          setData(response.data.data?.upcoming);
          setLoading(false);
        }
      })
      .catch((error: any) => {
        console.log('error', error.message);
        showToast({color: 'red.500', msg: error?.message});
        setLoading(false);
      });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      {loading ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator color={Colors.primary} size={'small'} />
        </View>
      ) : data.length === 0 ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ImageLoad
            url={
              'https://demo.creativitykw.com/P168-CEO/P168-CEO-Backend/public/storage/images/7432005.png'
            }
            style={{
              height: 70,
              width: 70,
              borderRadius: 10,
              marginBottom: 8,
            }}
          />
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              fontSize: 18,
              fontWeight: '500',
            }}>
            {i18n.t("You Don't have Bookings")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={detail => <BookingCard office={detail.item} />}
        />
      )}
    </View>
  );
};

export default UpcomingBookings;
