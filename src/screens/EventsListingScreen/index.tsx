import {View, Text, StyleSheet, Image, Pressable, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ImageLoad} from '../../services/generalservices';
import i18n from '../../language/I18n';
import moment from 'moment-timezone';
import PartnerCard from '../../component/PartnerCard';
import {Card} from 'react-native-paper';
import ResponsiveText from '../../component/ResponsiveText';
const gap = 8;

const filterSeats = data => {
  console.log(JSON.stringify(data));
  return data.filter((item: {seats: any[]; end: string}) => {
    const endDate = moment(item.end, 'MM/DD/YYYY hh:mm A');
    // console.log(JSON.stringify(endDate));
    // console.log(item.name_en, item.end, item.seats);

    // console.log('sdfgh', item?.is_showing_card);

    if (!item?.is_showing_card) {
      return false;
    }

    if (!endDate.isSameOrAfter(moment())) {
      return false;
    }

    if (item.seats.length > 0) {
      return !!item.seats.find(seat => {
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
  });
};

const EventsListingScreen = ({navigation, route}: any) => {
  const {data, title, filterIds, countryIds} = route.params;

  const [list, setList] = useState(data);

  useEffect(() => {
    if (filterIds && filterIds?.length > 0) {
      const updatedList = data.filter((item: any) =>
        filterIds.includes(Number(item.event_categorie_id)),
      );
      const result = filterSeats(updatedList);
      setList(result);
    }
  }, [data, filterIds]);

  useEffect(() => {
    if (countryIds && countryIds?.length > 0) {
      const updatedList = data.filter((item: any) => {
        return countryIds.includes(Number(item.area_id));
      });
      const result = filterSeats(updatedList);
      setList(result);
    }
  }, [countryIds, data]);

  useEffect(() => {
    if (!countryIds && !filterIds) {
      setList([...data]);
    }
  }, [countryIds, data, filterIds]);

  // console.log(' data', title, data);
  //
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     title: title,
  //   });
  // }, [navigation, title]);

  const renderItem = ({item}: any) => {
    return (
      <Pressable
        style={{marginTop: 20}}
        onPress={() => {
          const allowedDates = item?.seats
            .filter((d: {seats: number}) => d.seats > 0)
            .map((d: {date: any}) => d.date);
          navigation.navigate('EventDetailsScreen', {
            property: item,
            showedSeats: item.is_showing_seats,
            allowedDates,
          });
        }}>
        {/*<PartnerCard*/}
        {/*  // onPress={'sdfghj'}*/}
        {/*  name={item.name_en}*/}
        {/*  thumbnail_urls={'sderftgyhj'}*/}
        {/*  logo_url={item.thumbnail_urls[0].image_url}*/}
        {/*/>*/}
        <Card style={styles.cardStyle}>
          {/* <Card.Cover style={styles.image} source={require('../assets/icons/Home/cardImage.png')}/ > */}

          {Array.isArray(item.thumbnail_urls) ? (
            <ImageLoad
              url={item.thumbnail_urls[0].image_url}
              style={styles.image}
            />
          ) : (
            <ImageLoad url={item.thumbnail_urls} style={styles.image1} />
          )}

          {/* </Card.Cover> */}
          <View style={styles.companyLogo}>
            {/* <Image style={{  }} source={require('../assets/icons/Home/companyLogo.png')} /> */}
            <ImageLoad
              url={'asdfghj'}
              style={{height: 30, width: 30, borderRadius: 8}}
            />
          </View>
          <Card.Content style={{marginRight: 50}}>
            <ResponsiveText
              text={item.name_en}
              color={'#000'}
              ellipsizeMode="tail"
              numberOfLines={2}
              size={2.5}
              weight={'Inter-Medium'}
              style={styles.cardText}
            />
            <Text style={styles.distance}>{item.price_text.price_text_en}</Text>
          </Card.Content>
        </Card>
      </Pressable>
      // <Pressable
      //   onPress={() => {
      //     const allowedDates = item?.seats
      //       .filter(d => d.seats > 0)
      //       .map(d => d.date);
      //     navigation.navigate('EventDetailsScreen', {
      //       property: item,
      //       showedSeats: item.is_showing_seats,
      //       allowedDates,
      //     });
      //   }}>
      //   <Image
      //     style={styles.DetailsImage}
      //     source={{uri: item.thumbnail_urls[0].image_url}}
      //   />
      //
      //   <View style={styles.cardBar}>
      //     <Text style={styles.cardText}>{item.name_en}</Text>
      //     <Text style={styles.distance}>{item.price_text.price_text_en}</Text>
      //   </View>
      // </Pressable>
    );
  };

  useEffect(() => {
    if (!filterIds && !countryIds) {
      const filteredData = filterSeats(data);
      setList(filteredData);
    }
  }, [countryIds, data, filterIds]);

  return list.length !== 0 ? (
    <View style={{marginBottom: 20, paddingHorizontal: 13}}>
      <FlatList
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
            {i18n.t('Events are not Available')}
          </Text>
        )}
        data={list}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  ) : (
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
        {i18n.t('NoProperty')}
      </Text>
    </View>
  );
};

export default EventsListingScreen;
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
    height: 30,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    flexDirection: 'row',
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
    bottom: 35,
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
  distance: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EFB063',
    marginLeft: 5,
  },
  cardText: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Inter-Regular',
    paddingLeft: 5,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
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
    height: 190,
    // backgroundColor: 'green',
  },
  wraper: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // cardStyle: {
  //   borderBottomRightRadius: 12,
  //   borderBottomLeftRadius: 12,
  //   elevation: 5,
  // },
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
  cardStyle: {
    borderRadius: 12,
    elevation: 5,
    // backgroundColor: 'red',
  },
  image1: {
    width: '100%',
    height: 160,
    borderRadius: 10,
  },
});
