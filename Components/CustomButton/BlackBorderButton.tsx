import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

type buttonProp = {
    onPress: any,
    text: string,
}
export default function BlackBorderButton({onPress, text}: buttonProp) {

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
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 8,
    },
    textButton: {
        color: 'black',
        fontFamily: "Rajdhani_700Bold",
    },
});
