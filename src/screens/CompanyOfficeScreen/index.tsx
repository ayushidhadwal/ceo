import {View} from 'native-base';
import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import VenueCard from '../../component/VenueCard';

const CompanyOfficeScreen = ({navigation}) => {
  return (
    <ScrollView style={styles.container}>
      <View style={{marginBottom: 50}}>
        <VenueCard />
        <View style={styles.cardStyle1}>
          <VenueCard
            onPress={() => {
              navigation.navigate('OfficeFilterScreen');
            }}
          />
        </View>
        <View style={styles.cardStyle}>
          <VenueCard />
        </View>
        <View style={styles.cardStyle}>
          <VenueCard />
        </View>
      </View>
    </ScrollView>
  );
};
export default CompanyOfficeScreen;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 28,
  },
  cardStyle1: {
    marginTop: 26,
  },
  cardStyle: {
    marginTop: 16,
  },
});
