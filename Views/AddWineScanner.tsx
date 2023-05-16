import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {BarCodeScannedCallback, BarCodeScanner} from 'expo-barcode-scanner';

type Props = {
    navigation: any;
};

export default function AddWineScanner({navigation}: Props) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [wineData, setWineData] = useState("");

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };
        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned: BarCodeScannedCallback = async (data) => {
        setScanned(true);
        try {
            const scannedData = data.data;
            setWineData(scannedData);
            navigation.navigate("AddWineForm", scannedData)
        } catch (error) {
            console.error(error);
        }
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            {!scanned && (
                <BarCodeScanner
                    onBarCodeScanned={handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
            )}
            {scanned && (
                <View>
                    <Button title={'Scan Again'} onPress={() => setScanned(false)}/>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
