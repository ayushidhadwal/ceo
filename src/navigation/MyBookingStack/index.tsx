import {View, Text, Image, Pressable, I18nManager} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MyBookings from '../../screens/MyBookings';
import BookingDetailsScreen from '../../screens/BookingDetailsScreen';
import I18n from '../../language/I18n';

const Stack = createStackNavigator();

const MyBookingsStack = ({navigation}: any) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        component={MyBookings}
        name="MyBookingsScreen"
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          title: I18n.t('MyBookings'),
          headerLeft: () => (
            <Pressable
              onPress={() => {
                navigation.navigate('HomeStack');
              }}>
              <Image
                source={require('../../assets/icons/OfficeDetailScreen/back.png')}
                style={{
                  height: 14,
                  width: 14,
                  marginLeft: 16,
                  transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
                }}
              />
            </Pressable>
          ),
        }}
        //   options={{ headerShown:true, }}
      />
      <Stack.Screen
        component={BookingDetailsScreen}
        name="BookingDetailsScreen"
      />
    </Stack.Navigator>
  );
};

export default MyBookingsStack;
