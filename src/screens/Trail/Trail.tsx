import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
const gap = 8;
const Trail = () => {
    return (
        <View>
            <View style={styles.wrapper}>
                <View style={styles.box}>
                    <TouchableOpacity style={styles.box}>
                        <Image style={styles.icon} source={require('../../assets/icons/Home/icon3.png')} />
                        <Text style={styles.text2}>Co-work Space</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.box}>
                        <Image style={styles.icon} source={require('../../assets/icons/Home/icon3.png')} />
                        <Text style={styles.text2}>Co-work Space</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.box}>
                        <Image style={styles.icon} source={require('../../assets/icons/Home/icon3.png')} />
                        <Text style={styles.text2}>Co-work Space</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.box}>
                        <Image style={styles.icon} source={require('../../assets/icons/Home/icon3.png')} />
                        <Text style={styles.text2}>Co-work Space</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.box}>
                        <Image style={styles.icon} source={require('../../assets/icons/Home/icon3.png')} />
                        <Text style={styles.text2}>Co-work Space</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
export default Trail;
const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        margin: (gap / -2),
    },
    box: {
        height: 100,
        width: '100%',
        backgroundColor: '#EFB063',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,


    },
    'box:nth-child(1)': {
        flexBasis: ' 50%'
    },
    'box:nth-child(2)': {
        flexBasis: ' 50%'
    },
    'box:nth-child(3)': {
        flexBasis: ' 33.3%'
    },
    'box:nth-child(4)': {
        flexBasis: '33.3%'
    },
    'box:nth-child(5)': {
        flexBasis: ' 33.3%'
    },
    activetabs: {
        backgroundColor: '#EFB063',
        justifyContent: 'center',
        alignItems: 'center',

        borderRadius: 8,
        marginTop: 20,
        marginRight: 10

    },
    text2: {
        color: '#000000',
        fontSize: 12
    },
    icon: {
        height: 26,
        width: 26
    },
})