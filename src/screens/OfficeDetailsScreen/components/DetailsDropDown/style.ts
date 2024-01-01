import { StyleSheet } from "react-native";
import Colors from "../../../../constants/Colors";

const styles = StyleSheet.create({
    
    dropDown: {
        backgroundColor: 'white',
       
        elevation:4,

        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,

        marginHorizontal: 16,
        marginTop: 18,

        
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 12,
        paddingRight: 12,
    },
   
     inputLable: {
        fontSize: 20,
        lineHeight: 24.2,
        fontWeight: '700',
        color: Colors.black,
        fontFamily:'Inter-Regular',
        opacity:0.82
    },
    descriptionText:{
        marginTop:8,
        marginBottom:12,
        fontSize: 16,
        lineHeight: 19.36,
        fontWeight: '400',
        color: Colors.black,
        fontFamily:'Inter-Regular',
        opacity:0.8
    }
})
export default styles;