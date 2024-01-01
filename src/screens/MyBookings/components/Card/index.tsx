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

const BookingCard = ({office}: any) => {
  const width = useWindowDimensions().width;
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => {
        navigation.navigate('BookingDetailsScreen', {details: office});
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
          uri: office?.thumbnail_urls[0]?.image_url,
        }}
        style={{
          height: 160,
          borderRadius: 8,
        }}
      />

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
          {office?.price_text?.price_text_en}
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
          maxWidth: 250,
          textAlign: 'left',
          color: Colors.darkBlack,
          opacity: 0.82,
        }}
        numberOfLines={1}>
        {office.name_en}
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
          style={{width: 20, height: 20, resizeMode: 'contain'}}
        />
        <Text
          style={[styles.location, {marginLeft: 8, width: 250}]}
          numberOfLines={1}>
          {office.location?.name}
        </Text>
      </View>
    </Pressable>
  );
};

export default BookingCard;
