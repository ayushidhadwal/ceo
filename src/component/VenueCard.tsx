import React from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {Card} from 'react-native-paper';
import ResponsiveText from './ResponsiveText';
import {ImageLoad} from '../services/generalservices';
const gap = 8;
type props = {
  onPress: () => void;
  name: string;
  thumbnail_urls: string;
  location: any;
};
const VenueCard = ({onPress, name, thumbnail_urls, location}: props) => {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.cardStyle}>
        {/* <Card.Cover
          style={styles.image}
          source={require('../assets/icons/Home/cardImage2.png')}
        /> */}
        <ImageLoad url={thumbnail_urls[0].image_url} style={styles.image} />
        <Card.Content style={{marginRight: 8}}>
          <ResponsiveText
            ellipsizeMode="tail"
            numberOfLines={2}
            text={name}
            color={'#000'}
            size={2.5}
            weight={'Inter-Medium'}
            style={styles.cardText}
          />

          <View style={styles.tabstructure}>
            <Image
              style={styles.locationIcon}
              source={require('../assets/icons/Home/location.png')}
            />
            <ResponsiveText
              ellipsizeMode="tail"
              numberOfLines={1}
              text={location?.name}
              color={'#000'}
              size={2}
              weight={'Inter-Medium'}
              style={styles.cardLocationText}
            />
          </View>
        </Card.Content>
      </Card>
    </Pressable>
  );
};
export default VenueCard;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 18,
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
  Tabs: {
    backgroundColor: '#f9dfc1',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: '50%',
    borderRadius: 8,
    marginTop: 20,
    marginHorizontal: gap / 2,
    flex: 1,
  },
  text: {
    color: '#000000',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
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

  cardStyle: {
    borderRadius: 12,
    elevation: 5,
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
