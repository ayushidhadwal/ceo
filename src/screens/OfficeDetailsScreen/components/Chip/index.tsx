import {View, Text, Pressable} from 'react-native';
import React, {useState} from 'react';
import CustomText from '../../../../constants/CustomText';
import Colors from '../../../../constants/Colors';

const Chip = ({
  label,
  selectLabelHandler,
  deselectLabelHandler,
}: {
  label: string;
  selectLabelHandler: ({}) => void;
  deselectLabelHandler: ({}) => void;
}) => {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <Pressable
      onPress={() => {
        if (isSelected) {
          deselectLabelHandler(label);
        } else {
          selectLabelHandler(label);
        }
        setIsSelected(!isSelected);
      }}
      style={{
        height: 32,
        // width: 82,
        paddingHorizontal:11,
        marginRight:9,
        marginBottom:12,
        borderRadius:4,
        elevation:4,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor: isSelected ? '#F7D7B1' : '#ffffff',
      }}>
      <Text style={[CustomText[50020],{color:Colors.black}]}>{label}</Text>
    </Pressable>
  );
};

export default Chip;
