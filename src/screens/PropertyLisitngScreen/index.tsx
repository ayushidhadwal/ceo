import {View, Text, StyleSheet, FlatList} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import PartnerCard from '../../component/PartnerCard';
import {ImageLoad, showToast} from '../../services/generalservices';
import i18n from '../../language/I18n';
import moment from 'moment-timezone';

const filterSeats = data =>
  data.filter((item: any) => {
    return item.venues.find((venue: any) => {
      return venue.properties.find((s: {seats: any[]; end: string}) => {
        const endDate = moment(s.end, 'MM/DD/YYYY hh:mm A');
        if (endDate.isBefore(moment())) {
          return false;
        }
        if (s.seats.length > 0) {
          return !!s.seats.find(
            seat =>
              seat.seats > 0 &&
              moment(seat.date, 'YYYY-MM-DD')
                .endOf('day')
                .isSameOrAfter(moment().startOf('day')),
          );
        } else {
          return false;
        }
      });
    });
  });

const PropertyListingScreen = ({navigation, route}: any) => {
  const {data, title, countryIds} = route.params;
  const [list, setList] = useState(data);

  // console.log('Start', JSON.stringify(data, null, 2));

  // console.log('start');

  // setList(filterSeats);

  useEffect(() => {
    if (countryIds && countryIds?.length > 0) {
      const updatedList = data.filter((item: any) => {
        const areaCodes = item.area_id.filter(areaId =>
          countryIds.includes(Number(areaId)),
        );
        // console.log({areaCodes, res: areaCodes.length > 0});
        return areaCodes.length > 0;
      });
      // console.log(updatedList.length);

      if (
        title.toLowerCase() === 'co-work space' ||
        title === 'مساحة العمل المشترك'
      ) {
        const result = filterSeats(updatedList);
        setList(result);
      } else {
        setList(updatedList);
      }
    } else {
      setList([...data]);
    }
  }, [countryIds, data, title]);

  useEffect(() => {
    if (
      (!countryIds && title.toLowerCase() === 'co-work space') ||
      (!countryIds && title === 'مساحة العمل المشترك')
    ) {
      const result = filterSeats(data);
      setList(result);
      // console.log('filteredData', filteredData);
    }
  }, [countryIds, data, title]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title,
    });
  }, [navigation, title]);

  return list.length !== 0 ? (
    <FlatList
      ListEmptyComponent={() =>
        // <Text
        //   style={{
        //     fontSize: 16,
        //     paddingRight: 6,
        //     paddingLeft: 6,
        //     color: '#000',
        //     fontFamily: 'Inter-Regular',
        //     textAlign: 'center',
        //     marginVertical: 25,
        //   }}>
        {
          return title.toLowerCase() === 'Co-Work Space' ? (
            <Text>{i18n.t('Co-Work Space are not Available')}</Text>
          ) : title === 'مساحة العمل المشترك' ? (
            <Text>{i18n.t('Co-Work Space are not Available')}</Text>
          ) : title.toLowerCase() === 'Conference' ? (
            <Text>{i18n.t('Conference are not Available')}</Text>
          ) : title === 'مؤتمرات' ? (
            <Text>{i18n.t('Conference are not Available')}</Text>
          ) : title.toLowerCase() === 'Meeting Rooms' ? (
            <Text>{i18n.t('Meeting Rooms are not Available')}</Text>
          ) : title.toLowerCase() === 'غرف الإجتماعاn' ? (
            <Text>{i18n.t('Meeting Rooms are not Available')}</Text>
          ) : title.toLowerCase() === 'Office' ? (
            <Text>{i18n.t('Office are not Available')}</Text>
          ) : (
            title === 'مكتب' && (
              <Text>{i18n.t('Office are not Available')}</Text>
            )
          );
        }
      }
      ListFooterComponent={() => {
        return <View style={{height: 36}} />;
      }}
      style={{marginHorizontal: 16}}
      showsVerticalScrollIndicator={false}
      data={list}
      renderItem={partner => {
        // console.log(JSON.stringify(partner.item, null, 2));

        return (
          <View style={styles.cardStructure}>
            <PartnerCard
              name={partner.item.name_en}
              thumbnail_urls={partner.item.thumbnail_urls}
              logo_url={partner.item.logo_url}
              onPress={() => {
                if (partner.item.venues.length === 0) {
                  showToast({
                    msg: i18n.t('No venues present !!!'),
                    color: '#C46537',
                  });
                } else {
                  let partners = {...partner.item};
                  let venues = [...partner.item.venues];

                  if (countryIds && countryIds.length > 0) {
                    venues = venues.filter(c => {
                      const areaCodes = c.area_ids.filter(i =>
                        countryIds.includes(Number(i)),
                      );

                      return areaCodes.length > 0;
                    });
                  }

                  // if (
                  //   title.toLowerCase() === 'co-work space' ||
                  //   title === 'مساحة العمل المشترك'
                  // ) {
                  //   venues = venues.filter((venue: any) => {
                  //     return venue.properties.find(
                  //       (s: {seats: any[]; end: string}) => {
                  //         // console.log('seats', s.seats);
                  //         const endDate = moment(s.end, 'MM/DD/YYYY hh:mm A');
                  //         // console.log(s.end, endDate);
                  //
                  //         if (!endDate.isSameOrAfter(moment())) {
                  //           return false;
                  //         }
                  //         if (s.seats.length > 0) {
                  //           return !!s.seats.find(seat => {
                  //             console.log(seat);
                  //
                  //             return (
                  //               seat.seats > 0 &&
                  //               moment(seat.date, 'YYYY-MM-DD')
                  //                 .endOf('day')
                  //                 .isSameOrAfter(moment().startOf('day'))
                  //             );
                  //           });
                  //         } else {
                  //           return false;
                  //         }
                  //       },
                  //     );
                  //   });
                  // }

                  navigation.navigate('PartnerDetailsScreen', {
                    partner: {
                      ...partners,
                      venues: venues,
                    },
                    title,
                  });
                }
              }}
            />
          </View>
        );
      }}
    />
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
        style={{fontFamily: 'Inter-Regular', fontSize: 18, fontWeight: '500'}}>
        {i18n.t('NoProperty')}
      </Text>
    </View>
  );

  // <ScrollView style={{ marginHorizontal:16 }}>
  //   {data?.reverse().map(partner => {
  //     return (
  //       <View style={styles.cardStructure}>
  //         <PartnerCard
  //           name={partner.name_en}
  //           thumbnail_urls={partner.thumbnail_urls}
  //           logo_url={partner.logo_url}
  //           onPress={() => {
  //             navigation.navigate('PartnerDetailsScreen', {
  //               partner: partner,
  //             });
  //           }}
  //         />
  //       </View>
  //     );
  //   })}
  // </ScrollView>
};

export default PropertyListingScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  cardStructure: {
    marginTop: 28,
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
    marginTop: 8,
  },
  cardText: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'Inter-Medium',
    marginTop: 8,
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
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginVertical: 0,
    marginHorizontal: -8,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    paddingBottom: 2,
  },
  Container: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 10,
  },
  wraper: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginTop: 26,
  },
  cardStyle: {
    borderRadius: 12,
    elevation: 5,
  },

  icon: {
    height: 26,
    width: 26,
  },
  box: {
    paddingHorizontal: 8,
    flexBasis: '33.3%',
  },
  boxBig: {
    paddingHorizontal: 8,
    flexBasis: '50%',
  },
  boxInner: {
    // backgroundColor: 'primary.100',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    borderRadius: 8,
    padding: 8,
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
    backgroundColor: '#f9dfc1',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: '32%',
    borderRadius: 8,
    marginTop: 20,
    marginRight: 10,
  },
});
