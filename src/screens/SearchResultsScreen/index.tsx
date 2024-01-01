import {
  View,
  Text,
  useWindowDimensions,
  Image,
  FlatList,
  ScrollView,
  I18nManager,
} from 'react-native';
import React, {useLayoutEffect} from 'react';
import Colors from '../../constants/Colors';
import {color} from 'react-native-reanimated';
import styles from './style';
import Card from './components/Card';
import offices from '../../data/offices';
import {Pressable} from 'react-native';
import I18n from '../../language/I18n';
const SearchedResultsScreen = ({navigation, route}: any) => {
  const width = useWindowDimensions().width;
  const {title, area, date} = route.params;
  // const sate
  useLayoutEffect(() => {
    navigation.setOptions({
      title: I18n.t(
        title == 'Select Type'
          ? 'SelectType'
          : title == 'Meeting rooms'
          ? 'MeetingRooms'
          : title,
      ),
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontFamily: 'Inter-Regular',
        fontWeight: '700',
        fontSize: 20,
        lineHeight: 24,
        color: Colors.darkBlack,
      },
    });
  }, [title]);
  return (
    <FlatList
      data={offices}
      ListHeaderComponent={() => (
        <View
          style={{
            height: 51,
            width: width - 36,
            backgroundColor: Colors.primaryGolden,
            marginHorizontal: 18,
            borderRadius: 8,
            marginVertical: 18,
            flexDirection: 'row',
            paddingHorizontal: 10,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              // width: width - 96,
              overflow: 'hidden',
              flex: 1,
              marginRight: 10,
            }}>
            <Text
              style={{
                fontFamily: 'Inter-Regular',
                fontWeight: '400',
                fontSize: 14,
                lineHeight: 16.94,
                color: Colors.black,
              }}>
              {I18n.t(
                title == 'Select Type'
                  ? 'SelectType'
                  : title == 'Meeting rooms'
                  ? 'MeetingRooms'
                  : title,
              )}
            </Text>
            <Image
              source={require('../../assets/icons/chevronRight.png')}
              style={{
                height: 24,
                width: 8,
                marginHorizontal: 6,
                transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
              }}></Image>
            <Text
              style={{
                fontFamily: 'Inter-Regular',
                fontWeight: '400',
                fontSize: 14,
                lineHeight: 16.94,
                color: Colors.black,
              }}>
              {date}
            </Text>
            <Image
              source={require('../../assets/icons/chevronRight.png')}
              style={{
                height: 24,
                width: 8,
                marginHorizontal: 6,
                transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
              }}></Image>

            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontFamily: 'Inter-Regular',
                fontWeight: '400',
                flexShrink: 1,
                fontSize: 14,
                lineHeight: 16.94,
                color: Colors.black,

                // marginHorizontal:20
              }}>
              {I18n.t(area == 'Select Area' ? 'SelectArea' : 'Area')}
            </Text>
          </View>
          {/* only show edit button in Offices and Meeting rooms */}
          {title !== 'Events' ? (
            <Pressable
              onPress={() => {
                navigation.navigate('HomeScreen');
              }}
              style={{
                height: 30,
                width: 30,
                backgroundColor: 'white',
                borderRadius: 4,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('../../assets/icons/edit.png')}
                style={{height: 18, width: 18, marginHorizontal: 8}}></Image>
            </Pressable>
          ) : null}
        </View>
      )}
      renderItem={office => (
        <Card
          office={office.item}
          title={title}
          keyExtractor={({item, index}: {item: any; index: any}) =>
            `key-${index}`
          }></Card>
      )}></FlatList>
  );
};

export default SearchedResultsScreen;
