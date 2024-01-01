import {
  View,
  Text,
  Pressable,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import React from 'react';
import styles from './style';
import LinearGradient from 'react-native-linear-gradient';
import I18n from '../../../../language/I18n';

interface ButtonProps {
  onPress: () => void;
}

const BookNowButton = ({onPress}: ButtonProps) => {
  const width = useWindowDimensions().width;
  return (
    // <LinearGradient
    //   style={{borderRadius: 8}}
    //   colors={[
    //     'rgba(239, 176, 99, 1)',
    //     'rgba(239, 176, 99, 0.81)',
    //     'rgba(239, 176, 99, 0)',
    //   ]}
    //   start={{x: 0.6, y: 0.5}}
    //   end={{x: 0.4, y: 0.5}}
    //   locations={[0.4, 2, 1]}>
    <ImageBackground
      source={require('../../../../assets/icons/gradient.png')}
      resizeMode="stretch"
      style={{borderRadius: 8, height: 52, width: width - 32}}>
      <Pressable
        onPress={onPress}
        style={[
          {
            borderRadius: 8,
            height: 52,
            // backgroundColor:"yellow",
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 18,
            paddingVertical: 14,
          },
          {width: width - 32},
        ]}>
        <Text style={styles.textSemiBold}>70 {I18n.t("Kd")}</Text>
        <Text style={styles.textBold}>{I18n.t("BookNow")}</Text>
      </Pressable>
    </ImageBackground>
    // <View ></View>
    // </LinearGradient>
  );
};

export default BookNowButton;
