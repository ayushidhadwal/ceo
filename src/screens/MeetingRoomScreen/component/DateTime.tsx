/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {CalendarList, Calendar} from 'react-native-calendars';
import moment from 'moment-timezone';
import {ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

const DateTime = () => {
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const today = moment().format('YYYY-MM-DD');
  const [isActive, setIsActive] = useState('');
  const [timeSlot, setTimeSlot] = useState([
    {id: '1', time: '10:00', click: false},
    {id: '2', time: '11:00', click: false},
    {id: '3', time: '12:00', click: false},
    {id: '4', time: '13:00', click: false},
    {id: '5', time: '14:00', click: false},
    {id: '6', time: '15:00', click: false},
    {id: '7', time: '16:00', click: false},
    {id: '8', time: '17:00', click: false},
    {id: '9', time: '18:00', click: false},
    {id: '10', time: '19:00', click: false},
    {id: '11', time: '20:00', click: false},
    {id: '12', time: '21:00', click: false},
  ]);

  const handleClick = (props: any) => {
    //console.log('props', props);
    if (timeSlot.length > 0) {
      let timeArray: any = [];
      timeArray = [...timeSlot];
      timeArray.forEach((e: any) => {
        if (e.id === props) {
          e.click = true;
        } else {
          e.click = false;
        }
        setTimeSlot(timeArray);
      });
    }
    setIsActive(props);
  };
  return (
    <ScrollView>
      <Calendar
        markingType={'custom'}
        markedDates={{
          [today]: {
            selected: false,
            selectedColor: 'white',
            customStyles: {
              container: {
                borderRadius: 0,
              },
              text: {
                color: 'black',
                fontWeight: 'regular',
              },
            },
          },
          [startDate]: {
            selected: true,
            customStyles: {
              container: {
                borderRadius: 0,
              },
              text: {
                color: 'black',
                fontWeight: 'regular',
              },
            },
          },
        }}
        initialDate={today}
        current={startDate}
        minDate={'2012-09-10'}
        maxDate={'2080-09-30'}
        onDayPress={day => {
          //console.log('data', date);
          setStartDate(day.dateString);
        }}
        enableSwipeMonths={true}
        hideArrows={true}
        horizontal={true}
        pagingEnabled={true}
        pastScrollRange={50}
        futureScrollRange={50}
        scrollEnabled={true}
        theme={{
          textSectionTitleColor: '#000',
          selectedDayBackgroundColor: '#F7D7B1',
          textDayFontFamily: 'OpenSans-Regular',
          textMonthFontFamily: ' Inter-SemiBold',
          textDayHeaderFontFamily: 'Inter-Regular',
          textDayFontSize: 12,
          monthTextColor: '#000',
          textMonthFontSize: 18,
          textDayHeaderFontSize: 13,
          dotColor: '#F7D7B1',
          selectedDotColor: '#F7D7B1',
        }}
      />
      <Text style={styles.timeSlotStyle}>Time Slot</Text>
      <View style={styles.timeRow}>
        {timeSlot.map(item => (
          <TouchableOpacity
            key={item?.id}
            style={item.click ? styles.activeButton : styles.inactiveButton}
            onPress={() => handleClick(item.id)}>
            <Text style={styles.time}>{item.time}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{marginBottom: 50}}>
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
              fontFamily: 'Inter-Medium',
            }}>
            30 KD
          </Text>
          <Text
            style={{
              color: '#ffffff',
              marginVertical: 10,
              fontSize: 20,
              fontFamily: 'Inter-Bold',
            }}>
            Book Now
          </Text>
        </LinearGradient>
      </View>
    </ScrollView>
  );
};
export default DateTime;
const styles = StyleSheet.create({
  linearGradient: {
    borderRadius: 8,
    marginVertical: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
  },
  buttonTextKD: {
    color: '#2A2A2A',
    marginVertical: 10,
    fontSize: 20,
    fontFamily: 'Inter-Medium',
  },
  buttonText: {
    color: '#2A2A2A',
    marginVertical: 10,
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  timeRow: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  activeButton: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#F7D7B1',
  },
  inactiveButton: {
    borderColor: 'white',
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  time: {
    marginTop: 5,
    paddingHorizontal: 17,
    color: '#2A2A2A',
    fontSize: 20,
    paddingBottom: 9,
  },
  timeSlotStyle: {
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginTop: 10,
    marginLeft: 15,
    fontSize: 20,
  },
});
