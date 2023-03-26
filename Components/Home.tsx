import * as React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';


type Props = {
    navigation: any;
}

export default function Home({navigation}: Props) {

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