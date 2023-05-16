import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

type buttonProp = {
    onPress: any,
    text: string,
}
export default function CustomButton({onPress, text}: buttonProp) {

    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.customButton}
            activeOpacity={0.8}>
            <Text style={styles.textButton}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    customButton: {
        backgroundColor: '#853832',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    textButton: {
        color: 'white',
        fontFamily: "Rajdhani_700Bold",
    },
});
