import {
  View,
  Text,
  Image,
  useWindowDimensions,
  Pressable,
  I18nManager,
} from 'react-native';
import React from 'react';
import Colors from '../../../../constants/Colors';
import styles from './style';
import {useNavigation} from '@react-navigation/native';

import I18n from '../../../../language/I18n';

const Card = ({office, title}: any) => {
  const width = useWindowDimensions().width;
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => {
        navigation.navigate('OfficeDetailsScreen', {
          title: title,
        });
      }}
      style={{
        height: 230,
        width: width - 36,
        marginHorizontal: 18,
        backgroundColor: Colors.white,
        borderRadius: 8,
        elevation: 4,
        marginBottom: 18,
      }}>
      <Image
        source={{
          uri: office.image,
        }}
        style={{
          height: 160,
          borderRadius: 8,
        }}></Image>
      <View
        style={{
          position: 'absolute',
          height: 'auto',
          width: 'auto',
          backgroundColor: Colors.white,
          borderRadius: 4,
          top: 16,
          left: 14,
        }}>
        <Text
          style={{
            fontFamily: 'Inter-Regular',
            fontWeight: '700',
            fontSize: 16,
            lineHeight: 19.36,
            marginHorizontal: 8,
            marginVertical: 6,
            color: Colors.black,
          }}>
          {office.price} {I18n.t('Kd')}/{I18n.t('Day')}
        </Text>
      </View>
      <Text
        style={{
          marginLeft: 14,
          marginTop: 8,
          fontFamily: 'Inter-Regular',
          fontWeight: '500',
          fontSize: 20,
          lineHeight: 24.2,
          // maxWidth: 250,
          // textAlign:'auto',

          color: Colors.darkBlack,
          opacity: 0.82,
        }}
        numberOfLines={1}>
        {I18nManager.isRTL ? 'أل حمرا طور' : office.title}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          marginLeft: 14,
          marginTop: 8,
          alignItems: 'center',
        }}>
        <Image
          source={require('../../../../assets/icons/OfficeDetailScreen/location.png')}
          style={{width: 20, height: 20}}
        />
        <Text style={[styles.location, {marginLeft: 8}]} numberOfLines={1}>
          {office.location}{' '}
        </Text>
      </View>
    </Pressable>
  );
};

export default Card;
