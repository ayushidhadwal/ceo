import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  View,
  Pressable,
  FlatList,
  I18nManager,
  SafeAreaView,
  Text,
} from 'react-native';
import {Card} from 'react-native-paper';

import ResponsiveText from '../../component/ResponsiveText';
import VenueCard from '../../component/VenueCard';
import {ImageLoad, showToast} from '../../services/generalservices';
import i18n from 'i18n-js';
import moment from 'moment-timezone';

const gap = 8;

const PartnerDetailsScreen = ({navigation, route}: any) => {
  const {partner, title} = route.params;
  const [data, setData] = useState(partner.venues);

  const venues = partner.venues;

  useEffect(() => {
    const fVenues = venues.filter((venue: any) => {
      // console.log(venue.properties.is_showing_card);
      return venue.properties.find((s: {seats: any[]; end: string}) => {
        if (
          s.property_type?.name_en.toLowerCase() === 'co-work space' ||
          s.property_type?.name_ar === 'مساحة العمل المشترك'
        ) {
          // console.log('seats', s.seats);
          const endDate = moment(s.end, 'MM/DD/YYYY hh:mm A');
          // console.log(s.end, endDate);

          if (!endDate.isSameOrAfter(moment())) {
            return false;
          }

          // console.log('screen: ', s.name_en, s.seats);

          if (s.seats.length > 0) {
            return !!s.seats.find(seat => {
              // console.log(s.name_en, seat.seats, seat.date);

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
    });
    setData(fVenues);
    // }
  }, [title, venues]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <FlatList
          ListEmptyComponent={<Text>NO data</Text>}
          ListFooterComponent={() => {
            return <View style={{height: 36}} />;
          }}
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
                {partner?.thumbnail_urls ? (
                  <ImageLoad
                    url={partner?.thumbnail_urls[0]?.image_url}
                    style={styles.image}
                  />
                ) : null}

                <View style={styles.companyLogo}>
                  <ImageLoad
                    url={partner?.logo_url}
                    style={{height: 30, width: 30}}
                  />
                </View>
                <Card.Content style={{marginRight: 50}}>
                  <ResponsiveText
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    text={partner.name_en}
                    color={'#000'}
                    size={3}
                    weight={'Inter-Medium'}
                    style={styles.cardText}
                  />
                </Card.Content>
              </Card>
            </>
          )}
          data={data}
          keyExtractor={venue => venue.id}
          renderItem={venue => {
            // console.log(JSON.stringify(venue?.item?.properties, null, 2));
            return (
              <View style={styles.cardStructure}>
                <VenueCard
                  name={venue.item.name_en}
                  thumbnail_urls={venue.item.thumbnail_urls}
                  location={venue.item.location}
                  onPress={() => {
                    if (venue?.item?.properties.length === 0) {
                      showToast({
                        msg: i18n.t('No properties present !!!'),
                        color: '#C46537',
                      });
                    } else {
                      console.log(title);
                    }
                    // console.log(venue.item);
                    // console.log(venue.item.name_en);

                    navigation.navigate('VenueDetailsScreen', {
                      venue: venue.item,
                      // showedCard: venue?.item?.properties.is_showing_card,
                    });
                  }}
                />
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};
export default PartnerDetailsScreen;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  cardStructure: {
    paddingHorizontal: 13,
    marginTop: 28,
  },
  backButton: {
    height: 30,
    width: 30,
  },
  companyLogo: {
    position: 'absolute',
    right: 8,
    top: 225,
    borderWidth: 1,
    borderColor: 'white',
    elevation: 5,
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
  },
  locationIcon: {
    marginRight: 8,
    marginTop: 8,
  },
  cardText: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'Inter-Medium',
    marginTop: 8,
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
