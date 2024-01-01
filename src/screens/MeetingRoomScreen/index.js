import React, {useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';
import i18n from '../../language/I18n';
import GradientButton from '../../component/GradientButton';
import RBSheet from 'react-native-raw-bottom-sheet';
import DateTime from './component/DateTime';
const gap = 8;
import ResponsiveText from '../../component/ResponsiveText';
const MeetingRoom = ({navigation}) => {
  const refRBSheet = useRef();
  const open = () => {
    refRBSheet.current.open();
  };
  return (
    <>
      <ScrollView>
        <View>
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
          <View style={styles.rent}>
            <Text style={styles.rentText}>10 KD/Hour</Text>
          </View>
          <Image
            style={styles.image}
            source={require('../../assets/icons/Home/cardImage.png')}
          />
        </View>
        <View style={{paddingHorizontal: 16}}>
          <View style={styles.companyLogo}>
            <ResponsiveText
              text={'Al Hamra Real Estate'}
              color={'#000'}
              size={3}
              weight={'Inter-Bold'}
              style={styles.cardText}
            />
            <View style={styles.locatonStructure}>
              <Image
                style={styles.locationIcon}
                source={require('../../assets/icons/Home/location.png')}
              />
              <ResponsiveText
                text={'Al-Shuhada St, Al Kuwayt'}
                color={'#000'}
                size={2.2}
                weight={'Inter-Medium'}
                style={styles.cardLocationText}
              />
            </View>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.DetailsCard}>
            <Text style={styles.Details}>Details</Text>
            <Text style={styles.DetailsText}>
              Secure a sought-after workspace in Kuwait’s most iconic building,
              Al Hamra Tower. This spiralling 80-storey megastructure dominates
              the city skyline and enjoys worldwide recognition as a symbol of
              Kuwaiti national pride.
            </Text>
          </View>
          <View style={styles.AmenitiesCard}>
            <Text style={styles.Amenities}>Amenities</Text>
            <View style={styles.tabstructure}>
              <View style={styles.amenitiesCard}>
                <Image
                  style={styles.Icons}
                  source={require('../../assets/icons/MettingDetails/icon1.png')}
                />
                <Text style={styles.amenitiesText}> Car{'\n'} Parking</Text>
              </View>
              <View style={styles.amenitiesCard}>
                <Image
                  style={styles.Icons}
                  source={require('../../assets/icons/MettingDetails/icon1.png')}
                />
                <Text style={styles.amenitiesText}> Help{'\n'} Desk</Text>
              </View>
              <View>
                <Image
                  style={styles.Icons}
                  source={require('../../assets/icons/MettingDetails/icon1.png')}
                />
                <Text style={styles.amenitiesText}>24/7{'\n'}surveillance</Text>
              </View>
              <View style={styles.amenitiesCard}>
                <Image
                  style={styles.Icons}
                  source={require('../../assets/icons/MettingDetails/icon1.png')}
                />
                <Text style={styles.amenitiesText}>Business{'\n'}Lounge</Text>
              </View>
              <View style={styles.amenitiesCard}>
                <Image
                  style={styles.Icons}
                  source={require('../../assets/icons/MettingDetails/icon1.png')}
                />
                <Text style={styles.amenitiesText}> Breakout{'\n'}Areas</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <RBSheet
        ref={refRBSheet}
        height={600}
        openDuration={250}
        customStyles={{
          container: {
            padding: 20,
            borderRadius: 12,
          },
        }}>
        <DateTime />
      </RBSheet>
      <Pressable style={styles.button} onPress={() => open()}>
        <GradientButton />
      </Pressable>
    </>
  );
};
export default MeetingRoom;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  rentText: {
    color: 'black',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'white',
    fontFamily: 'Inter-SemiBold',
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 2,
    position: 'absolute',
  },
  rent: {
    zIndex: 3,
    top: 12,
    alignItems: 'center',
  },
  button: {
    borderColor: '#ece9e5',
    borderTopWidth: 3,
    marginHorizontal: 16,
  },
  amenitiesCard: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  locatonStructure: {
    flexDirection: 'row',
  },
  locationIcon: {
    marginVertical: 9,
    marginRight: 8,
    width: 20,
    height: 20,
  },
  amenitiesText: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#2A2A2A',
    marginLeft: 3,
  },
  Details: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: 'black',
  },
  DetailsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#2A2A2A',
  },
  companyLogo: {
    borderWidth: 1,
    borderColor: 'white',
    elevation: 5,
    borderRadius: 8,
    backgroundColor: 'white',
    marginTop: -30,
    width: '100%',
    paddingLeft: 20,
    marginBottom: 8,
  },
  DetailsCard: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    backgroundColor: 'white',
    padding: 12,
    marginTop: 20,
    marginBottom: 28,
    elevation: 5,
  },
  AmenitiesCard: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 12,
    marginTop: 20,
    marginBottom: 28,
    elevation: 5,
  },
  Amenities: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: 'black',
    marginLeft: 14,
  },
  image: {
    width: '100%',
    height: 250,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cardText: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'Inter-Medium',
    marginTop: 8,
  },

  tabstructure: {
    paddingHorizontal: gap / -2,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  Icons: {
    marginTop: 8,
    height: 50,
    width: 50,
    marginLeft: 10,
  },
  cardLocationText: {
    fontSize: 16,
    color: '#2A2A2A',
    fontFamily: 'Inter-Medium',
    marginVertical: 11,
  },
});
