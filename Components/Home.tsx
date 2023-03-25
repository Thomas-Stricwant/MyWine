import * as React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {useFonts} from 'expo-font';

import {Rajdhani_400Regular, Rajdhani_700Bold} from "@expo-google-fonts/rajdhani";


type Props = {
    navigation: any;
}

export default function Home({navigation}: Props) {
    let [fontsLoaded] = useFonts({
        Rajdhani_700Bold,
        Rajdhani_400Regular,
    });

    if (!fontsLoaded) {
        return null;
    }
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Home</Text>
            <Button
                title="Go to Wine"
                onPress={() => navigation.navigate('Mes vins')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontFamily: 'Rajdhani_700Bold',
    }
});