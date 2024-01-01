import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Card, Text} from 'react-native-paper';
import ResponsiveText from '../../component/ResponsiveText';
const gap = 8;

const OfficeFilterScreen = ({navigation}: any) => {
  const DATA = [
    {
      id: '1',
      title: 'Office-101',
    },
    {
      id: '2',
      title: 'Office-102',
    },
    {
      id: '3',
      title: 'Office-103',
    },
  ];
  const renderItem = ({item}: any) => {
    return (
      <Pressable>
        <Image
          style={styles.DetailsImage}
          source={require('../../assets/icons/OfficeDetails/Office1.png')}
        />
        <View style={styles.cardBar}>
          <Text style={styles.cardText}>{item.title}</Text>
          <Text style={styles.distance}>60 KD/Day</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <>
      <ScrollView>
        <Pressable
          style={{position: 'absolute', left: 14, top: 14, zIndex: 7}}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={styles.backButton}
            source={require('../../assets/icons/Home/BackButton.png')}
          />
        </Pressable>
        <Card style={styles.cardStyle}>
          <Card.Cover
            style={styles.image}
            source={require('../../assets/icons/Home/cardImage.png')}
          />
          <View style={styles.companyLogo}>
            <Image
              style={{height: 30, width: 30}}
              source={require('../../assets/icons/Home/companyLogo.png')}
            />
          </View>
          <Card.Content>
            <ResponsiveText
              text={'Al Hamra Real Estate Co.'}
              color={'#000'}
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
                text={'Al-Shuhada St, Al Kuwayt'}
                color={'#000'}
                size={2}
                weight={'Inter-Medium'}
                style={styles.cardLocationText}
              />
            </View>
          </Card.Content>
        </Card>
        <View style={{marginBottom: 20, paddingHorizontal: 13}}>
          <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      </ScrollView>
    </>
  );
};
export default OfficeFilterScreen;
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
  },
  distance: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EFB063',
    marginRight: 5,
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
