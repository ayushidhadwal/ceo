import {Pressable, Text, useWindowDimensions} from 'react-native';
import React from 'react';
import Colors from '../../Colors';
import CustomText from '../../CustomText';
import I18n from '../../../language/I18n';

const CustomButton = ({
  onPress,
  label,
  style,
}: {
  onPress: () => void;
  label: string;
  style?: {};
}) => {
  const width = useWindowDimensions().width;
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: Colors.primaryGolden,
        height: 52,
        width: width - 32,
        borderRadius: 8,
        marginHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
      }}>
      <Text style={[CustomText[50020], {color: Colors.black}, style]}>
        {I18n.t(label)}
      </Text>
    </Pressable>
  );
};

export default CustomButton;
