import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TypeScreen from '../screens/TypeScreen';
import {ImageLoad} from '../services/generalservices';
import {useNavigation} from '@react-navigation/native';
const AppBar = (navigation: any, param: any) => {

  return (
    <View style={styles.Navbar}>
      <TouchableOpacity
        style={styles.icon}
        onPress={() => {
          navigation.navigation.toggleDrawer();
        }}>
        <Image
          source={require('../assets/icons/HomeScreen/menu.png')}
          style={{height: 24, width: 24}}
        />
      </TouchableOpacity>
      <ImageLoad url={navigation.param} style={{height: 50, width: 50}} />
      <Pressable
        onPress={() => navigation.navigation.navigate('Partner with us')}>
        <Image
          source={require('../assets/icons/briefcase.png')}
          style={{height: 24, width: 24}}
        />
      </Pressable>
    </View>
  );
};

export default AppBar;
const styles = StyleSheet.create({
  Image: {
    width: 99,
    height: 36.61,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 12,
  },
  name: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 20,
    color: '#000',
    fontFamily: 'Inter-SemiBold',
  },
  Navbar: {
    alignItems: 'center',
    backgroundColor: '#C46537',
    width: '100%',
    height: 72,
    paddingVertical: 4,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',

    elevation: 2,
    alignItems: 'center',
  },
  notifications: {
    position: 'absolute',
    right: 0,
    top: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginRight: 16,
    width: 70,
    height: 36,
    textAlign: 'right',
    borderColor: '#1540AC',
    borderWidth: 1,
    borderRadius: 28,
  },
  icon: {
    // position: 'absolute',
    // left: 0,
    // marginLeft: 10,
    // marginTop: 22,
  },
});
