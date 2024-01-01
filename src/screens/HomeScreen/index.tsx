/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import Swiper from 'react-native-swiper';
import {SafeAreaView} from 'react-native-safe-area-context';

import AppBar from '../../component/AppBar';
import PartnerCard from '../../component/PartnerCard';
import httpClient from '../../hooks/useHttp';
import {ImageLoad} from '../../services/generalservices';
import I18n from '../../language/I18n';
import {HomePageSkeleton} from '../../services/generalservices';
import BottomSheetComponent from '../../component/BottomSheetComponent';
import MyAccountScreen from '../MyAccountScreen';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {setAppData} from '../../store/slice/masterSlice';
import moment from 'moment-timezone';

const HomeScreen = ({navigation, route}: any) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const [images, setImages] = useState(false);
  const {selectedCountry} = useAppSelector(state => state?.master);

  const getData = async () => {
    httpClient
      .get('/home')
      .then(res => {
        console.log('Home response is ', res);
        setApplicationData(res.data.data);
        dispatch(setAppData(res.data.data));
      })
      .finally(() => {
        setLoading(false);
        const timer = setTimeout(() => {
          setImages(true);
        }, 10);
        return () => clearTimeout(timer);
      });
  };

  useEffect(() => {
    setLoading(true);
    getData();
  }, [selectedCountry]);

  const paymentSuccess = route.params?.paymentSuccess;

  useEffect(() => {
    if (paymentSuccess) {
      setLoading(true);
      getData();
    }
  }, [paymentSuccess]);

  console.log(moment().tz(), moment().format('llll'));

  return loading ? (
    <HomePageSkeleton />
  ) : applicationData !== null ? (
    <SafeAreaView style={{flex: 1}}>
      <AppBar
        navigation={navigation}
        param={applicationData?.application_logo}
      />
      <FlatList
        ListFooterComponent={() => {
          return <View style={{height: 36}} />;
        }}
        showsVerticalScrollIndicator={false}
        style={styles.container}
        data={applicationData?.partners}
        ListHeaderComponent={() => {
          return (
            <View>
              {images ? (
                <View>
                  <Swiper
                    style={styles.wraper}
                    autoplay={true}
                    activeDot={
                      <View
                        style={{
                          backgroundColor: 'transparent',
                          borderColor: '#fff',
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          marginLeft: 3,
                          marginRight: 3,
                          borderWidth: 1,
                        }}
                      />
                    }
                    dot={
                      <View
                        style={{
                          backgroundColor: '#fff',
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          marginLeft: 3,
                          marginRight: 3,
                        }}
                      />
                    }
                    dotStyle={{marginBottom: 28}}>
                    {applicationData?.banners?.map(image => {
                      return (
                        <View key={image.id}>
                          <ImageLoad
                            url={image.image_url}
                            link={image.external_link}
                            style={{borderRadius: 10}}
                          />
                        </View>
                      );
                    })}
                  </Swiper>
                </View>
              ) : (
                <View style={styles.wraper} />
              )}
              {applicationData?.property_types.length > 0 && (
                <View style={styles.tabstructure1}>
                  {applicationData?.property_types.map(
                    (type: any, index: number) => {
                      return (
                        <Pressable
                          style={
                            applicationData?.property_types?.length === 5
                              ? [
                                  styles.cardFive,
                                  {
                                    flexBasis:
                                      index === 0 || index === 1
                                        ? '49%'
                                        : '32.5%',
                                  },
                                ]
                              : applicationData?.property_types?.length === 4
                              ? [
                                  styles.cardFour,
                                  {
                                    flexBasis:
                                      index === 0 || index === 1
                                        ? '49.3%'
                                        : '49.3%',
                                  },
                                ]
                              : applicationData?.property_types?.length === 3
                              ? [
                                  styles.cardThree,
                                  {
                                    flexBasis:
                                      index === 0 || index === 1
                                        ? '32%'
                                        : '33.5%',
                                  },
                                ]
                              : applicationData?.property_types?.length === 2
                              ? [
                                  styles.cardTwo,
                                  {
                                    flexBasis:
                                      index === 0 || index === 1
                                        ? '49%'
                                        : '32.5%',
                                  },
                                ]
                              : applicationData?.property_types?.length ===
                                  1 && [
                                  styles.cardOne,
                                  {
                                    flexBasis:
                                      index === 0 || index === 1
                                        ? '98%'
                                        : '32.5%',
                                  },
                                ]
                          }
                          key={type.id}
                          onPress={() => {
                            if (
                              type.name_en?.toLowerCase() === 'events' ||
                              type.name_en === 'الأحداث'
                            ) {
                              navigation.navigate('Event', {
                                data: type?.data,
                                title: type.name_en,
                              });
                            } else {
                              navigation.navigate('PropertyListingScreen', {
                                data: type?.data,
                                title: type.name_en,
                              });
                            }
                          }}>
                          <ImageLoad
                            url={type.images_url}
                            style={{height: 28, width: 28}}
                          />
                          <Text
                            style={{
                              fontSize: 10,
                              lineHeight: 20,
                              fontFamily: 'Inter-Medium',
                              color: '#ffffff',
                            }}>
                            {type.name_en}
                          </Text>
                        </Pressable>
                      );
                    },
                  )}
                </View>
              )}

              {applicationData?.admin !== undefined && (
                <PartnerCard
                  name={applicationData?.admin?.details?.name_en}
                  thumbnail_urls={
                    applicationData?.admin?.details?.thumbnail_urls[0].image_url
                  }
                  logo_url={applicationData?.admin?.details?.logo_url}
                  onPress={() => {
                    navigation.navigate('PartnerDetailsScreen', {
                      partner: applicationData?.admin?.details,
                    });
                  }}
                />
              )}
            </View>
          );
        }}
        renderItem={partner => {
          return (
            <View style={styles.cardStructure}>
              <PartnerCard
                name={partner.item.name_en}
                thumbnail_urls={partner.item.thumbnail_urls}
                logo_url={partner.item.logo_url}
                onPress={() => {
                  // console.log(JSON.stringify(partner, null, 2));
                  // console.log(properties.);

                  navigation.navigate('PartnerDetailsScreen', {
                    partner: partner.item,
                    title: 'all',
                  });
                }}
              />
            </View>
          );
        }}
        keyExtractor={partner => partner.id}
      />

      <BottomSheetComponent>
        <MyAccountScreen />
      </BottomSheetComponent>
    </SafeAreaView>
  ) : (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>{I18n.t('Something went wrong')}</Text>
    </View>
  );
};
export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 16,
    marginHorizontal: 16,
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
    // display: 'flex',
    // flexDirection: 'row',

    flexWrap: 'wrap',
    flexDirection: 'row',
    // marginBottom: 16,
    // marginHorizontal: -8,
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
  // box: {
  //   paddingHorizontal: 8,
  //   flexBasis: '33.3%',
  //   backgroundColor: '#C46537',
  //   //
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginTop: 8,
  //   borderRadius: 8,
  //   padding: 8,
  // },
  // boxBig: {
  //   paddingHorizontal: 8,
  //   flexBasis: '50%',
  //   backgroundColor: '#C46537',
  //   //
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginTop: 8,
  //   borderRadius: 8,
  //   padding: 8,
  // },
  boxInner: {
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
  cardFive: {
    backgroundColor: '#C46537',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginLeft: 2,
  },
  cardFour: {
    backgroundColor: '#C46537',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginLeft: 2,
  },
  cardThree: {
    backgroundColor: '#C46537',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginLeft: 2,
  },
  cardTwo: {
    backgroundColor: '#C46537',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginLeft: 2,
  },
  cardOne: {
    backgroundColor: '#C46537',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginLeft: 2,
  },
});
