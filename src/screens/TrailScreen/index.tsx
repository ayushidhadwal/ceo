import React from 'react';
import {Text, TouchableOpacity, Image, View, StyleSheet} from 'react-native';
const gap = 8;
const TrailScreen = () => {
  return (
    <>
      <View style={styles.tabstructure1}>
        <TouchableOpacity style={styles.boxBig}>
          <View style={styles.boxInner}>
            <Image
              style={styles.icon}
              source={require('../../assets/icons/Home/icon1.png')}
            />
            <Text style={styles.text}>Offices</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boxBig}>
          <View style={styles.boxInner}>
            <Image
              style={styles.icon}
              source={require('../../assets/icons/Home/icon2.png')}
            />
            <Text style={styles.text}>Meeting Rooms</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}>
          <View style={styles.boxInner}>
            <Image
              style={styles.icon}
              source={require('../../assets/icons/Home/icon3.png')}
            />
            <Text style={styles.text}>Co-work Space</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}>
          <View style={styles.boxInner}>
            <Image
              style={styles.icon}
              source={require('../../assets/icons/Home/icon4.png')}
            />
            <Text style={styles.text}>Conference</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}>
          <View style={styles.boxInner}>
            <Image
              style={styles.icon}
              source={require('../../assets/icons/Home/icon5.png')}
            />
            <Text style={styles.text}>Events</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};
export default TrailScreen;
const styles = StyleSheet.create({
  text: {
    color: '#000000',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    paddingBottom:5
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
    backgroundColor: '#f9dfc1',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:8,
    borderRadius: 8,
 
  },
  tabstructure1: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginVertical: 0,
    marginHorizontal: -8,
  },
});
