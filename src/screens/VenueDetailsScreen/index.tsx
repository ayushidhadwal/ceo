/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  I18nManager,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import {Card, Text} from 'react-native-paper';
import ResponsiveText from '../../component/ResponsiveText';
import {ImageLoad} from '../../services/generalservices';
import i18n from 'i18n-js';
import moment from 'moment-timezone';

const gap = 8;

const VenueDetailsScreen = ({navigation, route}: any) => {
  const {venue, title} = route.params;
  const [images, setImages] = useState(false);

  // console.log(JSON.stringify(venue, null, 2));

  useEffect(() => {
    const timer = setTimeout(() => {
      setImages(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const {width, height} = useWindowDimensions();

  const renderItem = ({item}: any) => {
    // console.log(JSON.stringify(item?.is_showing_card, null, 2));
    // console.log('ayushi', item.property_type.name_en);
    return (
      <View style={{marginBottom: 20, paddingHorizontal: 13}}>
        <Pressable
          onPress={() => {
            const allowedDates = item?.seats
              ?.filter(d => d.seats > 0)
              ?.map(d => d.date);

            navigation.navigate('PropertyDetailsScreen', {
              property: item,
              showedSeats: item.is_showing_seats,
              seats: item.seats,
              allowedDates,
              isCoWorkSpace:
                item.property_type?.name_en.toLowerCase() === 'co-work space' ||
                item.property_type?.name_ar === 'مساحة العمل المشترك',
            });
          }}>
          <Image
            style={styles.DetailsImage}
            source={{uri: item?.thumbnail_urls[0]?.image_url}}
          />
          <View
            style={{
              backgroundColor: 'rgba(0,0,0, 0.5)',
              position: 'absolute',
              // elevation:5,
              top: 30,
              // width: 170,
              height: 30,
              borderTopLeftRadius: 12,
              // borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
              elevation: 4,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 16,
                paddingRight: 6,
                paddingLeft: 6,
                color: '#fff',
                fontFamily: 'Inter-Regular',
                // paddingLeft: 5,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              }}>
              {item.property_type.name_en}
            </Text>
          </View>
          <View style={[styles.cardBar]}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.cardText, {width: width / 2, textAlign: 'left'}]}>
              {item?.name_en}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.distance,
                {width: (width - 48 - 48) / 2, textAlign: 'right'},
              ]}>
              {item?.price_text?.price_text_en}
            </Text>
          </View>
        </Pressable>
      </View>
    );
  };

  const [data, setData] = useState(venue.properties);

  const properties = venue.properties;
  console.log('properties', properties);
  useEffect(() => {
    const fdata = properties.filter((s: {seats: any[]; end: string}) => {
      // console.log('name', s.property_type.name_en.toLowerCase());
      if (
        s.property_type?.name_en.toLowerCase() === 'co-work space' ||
        s.property_type?.name_ar === 'مساحة العمل المشترك'
      ) {
        const endDate = moment(s.end, 'MM/DD/YYYY hh:mm A');
        // console.log(JSON.stringify(properties, null, 2));
        console.log('card', s?.is_showing_card);
        if (!s?.is_showing_card) {
          return false;
        }

        if (!endDate.isSameOrAfter(moment())) {
          return false;
        }

        if (s.seats.length > 0) {
          return !!s.seats.find(seat => {
            // console.log('dateseat: ', s.id, s.name_en, seat.date, seat);
            return (
              seat.seats > 0 &&
              moment(seat.date, 'YYYY-MM-DD')
                .endOf('day')
                .isSameOrAfter(moment().startOf('day'))
            );
          });
        } else {
          return false;
        }
      } else {
        return true;
      }
    });

    setData(fdata);
    // }
  }, [properties]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        ListHeaderComponent={() => (
          <>
            <Pressable
              style={{position: 'absolute', left: 14, top: 14, zIndex: 7}}
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                style={[
                  styles.backButton,
                  {
                    transform: [
                      {
                        scaleX: I18nManager.isRTL ? -1 : 1,
                      },
                    ],
                  },
                ]}
                source={require('../../assets/icons/Home/BackButton.png')}
              />
            </Pressable>
            <Card style={styles.cardStyle}>
              <ImageLoad
                url={venue.thumbnail_urls[0].image_url}
                style={styles.image}
              />

              <Card.Content style={{marginRight: 8}}>
                <ResponsiveText
                  text={venue.name_en}
                  color={'#000'}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  size={3}
                  weight={'Inter-Medium'}
                  style={styles.cardText}
                />
                <View style={styles.tabstructure}>
                  <Image
                    style={styles.locationIcon}
                    source={require('../../assets/icons/Home/location.png')}
                  />
                  <ResponsiveText
                    text={venue.location.name}
                    color={'#000'}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    size={2}
                    weight={'Inter-Medium'}
                    style={styles.cardLocationText}
                  />
                </View>
              </Card.Content>
            </Card>
          </>
        )}
        ListEmptyComponent={() => (
          <Text
            style={{
              fontSize: 16,
              paddingRight: 6,
              paddingLeft: 6,
              color: '#000',
              fontFamily: 'Inter-Regular',
              textAlign: 'center',
              marginVertical: 25,
            }}>
            {i18n.t('Cowork space are not Available')}
          </Text>
        )}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};
export default VenueDetailsScreen;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  cardBar: {
    backgroundColor: 'rgba(0,0,0, 0.6)',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    // height: 30,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'space-between',
  },
  DetailsImage: {
    height: 160,
    width: '100%',
    marginTop: 28,
    borderRadius: 12,
  },
  cardStructure: {
    paddingHorizontal: 13,
    marginTop: 28,
  },
  backButton: {
    height: 28,
    width: 28,
  },
  companyLogo: {
    position: 'absolute',
    right: 8,
    bottom: 55,
    borderWidth: 1,
    borderColor: 'white',
    elevation: 5,
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
  },
  locationIcon: {
    marginRight: 8,
    marginTop: 10,
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  distance: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EFB063',
    // marginRight: 5,
  },
  cardText: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Inter-Regular',
    // paddingLeft: 5,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    textAlign: 'left',
  },
  cardLocationText: {
    fontSize: 16,
    color: '#2A2A2A',
    fontFamily: 'Inter-Medium',
    marginTop: 10,
  },
  tabstructure: {
    flexDirection: 'row',
  },
  tabstructure1: {
    paddingHorizontal: gap / -2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  MeetingRooms: {
    backgroundColor: '#f9dfc1',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    // width: '50%',
    borderRadius: 8,
    marginTop: 20,
    marginHorizontal: gap / 2,
    flex: 1,
  },
  activeText: {
    color: 'white',
    fontSize: 12,
  },
  inactiveText: {
    color: 'black',
    fontSize: 12,
  },
  Offices: {
    backgroundColor: '#EFB063',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    // width: '50%',
    flex: 1,
    borderRadius: 8,
    marginTop: 20,
    marginHorizontal: gap / 2,
  },
  Container: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  image: {
    width: '100%',
    height: 250,
  },
  wraper: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardStyle: {
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    elevation: 5,
  },
  cardStyleList: {
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    elevation: 5,
    marginTop: 10,
  },
  text2: {
    color: '#000000',
    fontSize: 12,
  },
  icon: {
    height: 26,
    width: 26,
  },
  inactivetabs: {
    backgroundColor: '#f9dfc1',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: '32%',
    borderRadius: 8,
    marginTop: 20,
    marginRight: 10,
  },
  activetabs: {
    backgroundColor: '#EFB063',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: '32%',
    borderRadius: 8,
    marginTop: 20,
    marginRight: 10,
  },
});
