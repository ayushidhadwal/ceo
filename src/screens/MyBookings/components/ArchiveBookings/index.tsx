import {View, Text, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import offices from '../../../../data/offices';
import BookingCard from '../Card';
import httpClient from '../../../../hooks/useHttp';
import {ActivityIndicator} from 'react-native-paper';

const ArchiveBookings = ({navigation}: any) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  console.log('archive bookings');

  const loadData = async () => {
    setLoading(true);
    httpClient
      .get('/checkout-get')
      .then(res => {
        setData(res.data.data?.archive);
      })
      .finally(() => {
        setLoading(false);
      })
      .catch(() => {});
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      loadData();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator color={'#C46537'} />
      </View>
    );
  }

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <FlatList
        data={data}
        renderItem={detail => <BookingCard office={detail.item} />}
      />
    </View>
  );
};

export default ArchiveBookings;
