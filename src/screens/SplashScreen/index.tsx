import {View, Text, Image} from 'react-native';
import React, {useEffect} from 'react';
import LottieView from 'lottie-react-native';
import FastImage from 'react-native-fast-image';
import SplashScreen from 'react-native-splash-screen';

const AppSplashScreen = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'HomeScreen'}],
      });
    }, 4100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#c26334',
      }}>
      {/* <LottieView
        source={require('../../assets/splash.json')}
        autoPlay
        loop={false}
        onAnimationFinish={()=>{
          navigation.reset({
            index: 0,
            routes: [{name: 'HomeScreen'}],
          });
        }}
        style={{height: "100%", width: "100%"}}
      /> */}
      <FastImage
        source={require('../../assets/splash1.gif')}
        resizeMode={'contain'}
        // onLoadEnd={()=>{
        //   navigation.reset({
        //     index: 0,
        //     routes: [{name: 'HomeScreen'}],
        //   });
        // }}
        style={{height: '100%', width: '100%'}}></FastImage>
    </View>
  );
};

export default AppSplashScreen;
