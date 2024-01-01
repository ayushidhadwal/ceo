import { StyleSheet } from 'react-native';
import Colors from '../../../../constants/Colors';

const styles = StyleSheet.create({
    button:{
        borderRadius:8,
        height:52,
        // backgroundColor:"yellow",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        paddingHorizontal:18,
        paddingVertical:14,
        


    },
    textSemiBold:{
        fontFamily:"Inter-Regular",
        fontWeight:"500",
        fontSize:20,
        lineHeight:24,
        color:Colors.black,
       
    },
    textBold:{
        fontFamily:"Inter-Regular",
        fontWeight:"700",
        fontSize:20,
        lineHeight:24,
        color:Colors.black,
    }
});

export default styles;