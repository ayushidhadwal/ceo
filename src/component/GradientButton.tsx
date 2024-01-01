import React from 'react';
import {StyleSheet, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GradientButton = () => {
  return (
    <LinearGradient
      colors={['#C46537', '#C46537', '#C46537', '#C46537', '#C46537']}
      start={{y: 0.0, x: 0.1}}
      end={{y: 0.0, x: 1.0}}
      style={styles.linearGradient}>
      <Text
        style={{
          color: '#ffffff',
          marginVertical: 10,
          fontSize: 20,
          fontFamily: 'Inter-Bold',
        }}>
        Proceed
      </Text>
    </LinearGradient>
  );
};
export default GradientButton;
var styles = StyleSheet.create({
  linearGradient: {
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 26,
  },
  buttonText: {
    color: '#2A2A2A',
    marginVertical: 10,

    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
});
