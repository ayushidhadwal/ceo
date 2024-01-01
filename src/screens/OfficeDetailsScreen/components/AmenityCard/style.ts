import { StyleSheet } from 'react-native';
import Colors from '../../../../constants/Colors';

const styles = StyleSheet.create({
 iconCanvas:{
    height: 50,
    width: 50,
    borderRadius: 4,
    backgroundColor: Colors.primaryGolden,
    opacity: 0.5,
    // alignItems: 'center',
    // justifyContent: 'center',

 },
 label:{ 
    marginTop:8,
    fontSize:12,
    fontFamily:"Inter-Regular",
    textAlign:"center",
    fontWeight:"400",
    lineHeight:14.25,
    width:68,
    color:Colors.black,

    opacity:0.8
   },
   image:{height: 50, width: 50,color:Colors.black}
});

export default styles;