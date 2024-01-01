import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  Text,
} from 'react-native';
import {Card} from 'react-native-paper';
import ResponsiveText from './ResponsiveText';
import {ImageLoad} from '../services/generalservices';
const gap = 8;
type props = {
  onPress: () => void;
  name: string;
  thumbnail_urls: string;
  logo_url: string;
};
const PartnerCard = ({onPress, name, thumbnail_urls, logo_url}: props) => {
  const {width, height} = useWindowDimensions();
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.cardStyle}>
        {/* <Card.Cover style={styles.image} source={require('../assets/icons/Home/cardImage.png')}/ > */}

        {Array.isArray(thumbnail_urls) ? (
          <ImageLoad
            url={thumbnail_urls[0].image_url}
            style={styles.image}/>
        ) : (
          <ImageLoad url={thumbnail_urls} style={styles.image}/>
        )}

        {/* </Card.Cover> */}
        <View style={styles.companyLogo}>
          {/* <Image style={{  }} source={require('../assets/icons/Home/companyLogo.png')} /> */}
          <ImageLoad
            url={logo_url}
            style={{height: 30, width: 30, borderRadius: 8}}/>
        </View>
        <Card.Content style={{marginRight: 50}}>
          <ResponsiveText
            text={name}
            color={'#000'}
            ellipsizeMode="tail"
            numberOfLines={2}
            size={2.5}
            weight={'Inter-Medium'}
            style={styles.cardText}
          />

          {/* <View style={styles.tabstructure}>
                        <Image style={styles.locationIcon} source={require('../assets/icons/Home/location.png')} />
                        <ResponsiveText
                            text={'Al-Shuhada St, Al Kuwayt'}
                            color={'#000'}
                            size={2}
                            weight={'Inter-Medium'}
                            style={styles.cardLocationText}
                        />
                    </View> */}
        </Card.Content>
      </Card>
    </Pressable>
  );
};
export default PartnerCard;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  companyLogo: {
    position: 'absolute',
    right: 8,
    top: 134,
    borderWidth: 1,
    borderColor: 'white',
    elevation: 5,
    borderRadius: 8,
    padding: 10,
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
