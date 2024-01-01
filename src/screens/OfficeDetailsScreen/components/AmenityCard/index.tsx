import {View, Text, Image} from 'react-native';
import React from 'react';
import Colors from '../../../../constants/Colors';
import styles from './style';

interface AmenityProps {
  title: string;
  icon: string;
}

const AmeityCard = ({title, icon}: AmenityProps) => {
 
  return (
    <View style={{ width:68,alignItems:"center" }}>
     
      <View >
          <Image source={icon} style={styles.image} />
          </View>
      <Text style={styles.label} numberOfLines={2} ellipsizeMode='tail'>{title}</Text>
    </View>
  );
};

export default AmeityCard;
