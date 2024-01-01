import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  root: { justifyContent: 'space-between', flex: 1, backgroundColor: Colors.white },
  image: {
    height: 330,
    width: '100%',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },

  detailCard: {
    marginTop: -33,
    height: 106,

    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingTop: 9,
    paddingLeft: 18,
    paddingRight: 18,
    paddingBottom: 18,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 5
  },
  textBold: {
    fontFamily: "Inter-Regular",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: 20,
    lineHeight: 24,
    color: Colors.black,
    opacity: 0.82,
  },
  textSemiBold: {
    fontFamily: "Inter-Regular",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 19.36,
    color: Colors.darkBlack,
    opacity: 0.82,
  },
  textNormal: {
    fontFamily: "Inter-Regular",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19.36,
    color: Colors.black,
    opacity: 0.80,
    marginBottom: 5
  },

  bookNowButtonCard: {
    backgroundColor: Colors.white, height: 104, width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 10,
    justifyContent:"center",
    alignItems:"center",
  },
  location:{
    fontFamily: "Inter-Regular",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 19.36,
    color: Colors.black,
    opacity: 0.80,
    
  }

});

export default styles;