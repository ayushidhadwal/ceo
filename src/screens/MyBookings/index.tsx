import {View, TouchableOpacity, Text, useWindowDimensions} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Colors from '../../constants/Colors';
import CustomText from '../../constants/CustomText';
import UpcomingBookings from './components/UpcomingBookings/index';
import I18n from '../../language/I18n';
import ArchiveBookings from './components/ArchiveBookings';

const Tab = createMaterialTopTabNavigator();

function MyTabBar({state, descriptors, navigation, position}: any) {
  const width = useWindowDimensions().width;
  return (
    <View
      style={{
        flexDirection: 'row',
        height: 50,
        width: width - 104,
        marginHorizontal: 52,
        backgroundColor: Colors.primaryGolden,
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 18,
        marginBottom: 10,
      }}>
      {state.routes.map(
        (route: {key: string | number; name: any}, index: any) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({name: route.name, merge: true});
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                flex: 1,
                backgroundColor: isFocused ? '#C46537' : Colors.lightGray,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {/* <Animated.Text style={{opacity}}>{label}</Animated.Text> */}
              <Text
                style={[
                  CustomText[40020],
                  {
                    color: isFocused ? '#fff' : '#000',
                    opacity: isFocused ? 1 : 0.4,
                  },
                ]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        },
      )}
    </View>
  );
}

const MyBookings = () => {
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
        <Tab.Screen
          name={'Upcoming'}
          options={{title: I18n.t('Upcoming')}}
          component={UpcomingBookings}
        />
        <Tab.Screen
          name={'Archive'}
          options={{title: I18n.t('Archive')}}
          component={ArchiveBookings}
        />
      </Tab.Navigator>
    </View>
  );
};

export default MyBookings;
