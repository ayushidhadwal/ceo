import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";


const styles = StyleSheet.create({
    detailCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 8,
        elevation: 4,
       
        paddingHorizontal: 12,
        paddingVertical: 18,
        backgroundColor: Colors.white,
    },

    detailRow: {
        flexDirection: 'row',
        flex: 1,
        marginTop:4,
        justifyContent: 'space-between'
    },
    fontRegular: {
        fontFamily: "Inter-Regular",
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 19.36,
        color:Colors.black
    },
    fontSemibold: {
        fontFamily: "Inter-Regular",
        fontWeight: "600",
        fontSize: 16,
        lineHeight: 19.36,
        color:Colors.darkBlack,
        opacity:0.82
    },
    
})

export default styles;