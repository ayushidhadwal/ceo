import React, {useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import I18n from '../../../../language/I18n';
import styles from './style';

const DetailsDropdown = ({details, style}: {details: string; style?: {}}) => {
  const width = useWindowDimensions().width;

  const [showDropdown, setShowDropdown] = useState(false);

  // Animation setup //
  const animationController = useRef(new Animated.Value(0)).current;
  const toggleDropdown = () => {
    const config = {
      duration: 100,
      toValue: showDropdown ? 0 : 1,
      easing: Easing.linear,
    };
    Animated.timing(animationController, config).start();
    setShowDropdown(!showDropdown);
  };
  const chevronTransform = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg'],
  });
  // Animation setup Ends Here  //
  return (
    <View>
      <Pressable
        onPress={() => {
          toggleDropdown();
        }}
        style={[
          styles.dropDown,
          style,
          {
            width: width - 32,
            alignItems: showDropdown ? 'flex-start' : 'center',
            height: showDropdown ? 'auto' : 53,

            borderBottomLeftRadius: 10,

            borderBottomRightRadius: 10,
          },
        ]}>
        <View
          style={{
            height: 40,
            width: width - 56,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={[styles.inputLable, {marginTop: showDropdown ? 14 : 0}]}>
            {I18n.t('Details')}
          </Text>
          <Animated.View
            style={[
              {transform: [{rotateZ: chevronTransform}]},
              {marginTop: showDropdown ? 14 : 0},
            ]}>
            <Image
              source={require('../../../../assets/arrow-down-sign-to-navigate.png')}
              style={[{height: 20, width: 20}]}
            />
          </Animated.View>
        </View>
        {showDropdown && <Text style={styles.descriptionText}>{details}</Text>}
      </Pressable>
    </View>
  );
};

export default DetailsDropdown;
