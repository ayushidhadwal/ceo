import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  I18nManager,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomText from '../../constants/CustomText';
import httpClient from '../../hooks/useHttp';

const PrivacyPolicy = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  const getData = async () => {
    httpClient
      .get('/cms?key=2')
      .then(res => {
        setData(
          I18nManager.isRTL
            ? res.data.data?.cms?.description_ar
            : res.data.data?.cms?.description_en,
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}>
        <ActivityIndicator color={'#C46537'} />
      </View>
    );
  }
  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      {data === null ? (
        <Text
          style={[
            CustomText[40020],
            {
              color: '#000000',
              paddingVertical: 28,
              paddingHorizontal: 16,
              lineHeight: 24,
              fontSize: 16,
            },
          ]}>
          No data.
        </Text>
      ) : (
        <Text
          style={[
            CustomText[40020],
            {
              color: '#000000',
              paddingVertical: 28,
              paddingHorizontal: 16,
              lineHeight: 24,
              fontSize: 16,
            },
          ]}>
          {data}
        </Text>
      )}
    </ScrollView>
  );
};

export default PrivacyPolicy;
