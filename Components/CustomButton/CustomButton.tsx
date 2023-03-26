import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

type buttonProp = {
    onPress: () => void,
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
    },
    textButton: {
        color: 'white',
        fontFamily: "Rajdhani_700Bold",
    },
});
