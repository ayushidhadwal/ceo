import {StyleSheet} from 'react-native';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  detailCard: {
    marginHorizontal: 16,
    marginBottom: 26,
    borderRadius: 8,
    elevation: 4,

    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: Colors.white,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fontRegular: {
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19.36,
    color: Colors.black,
  },
  fontSemibold: {
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 19.36,
    color: Colors.darkBlack,
    opacity: 0.82,
    marginBottom: 5,
  },
});

export default styles;
