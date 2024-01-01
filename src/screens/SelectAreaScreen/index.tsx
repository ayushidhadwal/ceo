import {Divider} from 'native-base';
import React, {useLayoutEffect} from 'react';
import {
  FlatList,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Colors from '../../constants/Colors';
import CustomText from '../../constants/CustomText';

const SelectAreaScreen = ({navigation, route}: any) => {
  const {width, height} = useWindowDimensions();
  const {title, onSelect} = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontFamily: 'Inter-Regular',
        fontWeight: '700',
        fontSize: 20,
        lineHeight: 24,
        color: Colors.darkBlack,
      },
    });
  }, [title]);

  const placeList =
    title == 'Select Area'
      ? [
          'Kuwait city',

          'Daiya',
          'Dasma',
          'Sharq',
          'Shaab',
          'Shamiya',
          'Hawally',
          'Salmiya',
          'Khaitan',
          'Jeleeb Al-Shuyoukh',
          'Jahra',
          'fahaheel',
          'farwaniya',
        ]
      : ['Al Hamta Tower', 'Al John Tower', 'Tower', 'Creativity Tower'];
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        data={placeList}
        renderItem={item => (
          <Pressable
            onPress={() => {
              // set selected area in home screen
              onSelect(item.item);

              navigation.goBack();
            }}
            style={{height: 35, marginHorizontal: 16, marginTop: 16}}>
            <Text style={[CustomText[50020], {fontSize: 16, color: '#000000'}]}>
              {item.item}
            </Text>
            <Divider
              style={{
                marginTop: 16,
                backgroundColor: '#000000',
                opacity: 0.1,
              }}
            />
          </Pressable>
        )}
      />
    </View>
  );
};

export default SelectAreaScreen;
