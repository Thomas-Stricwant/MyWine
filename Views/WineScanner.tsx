import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {BarCodeScannedCallback, BarCodeScanner} from 'expo-barcode-scanner';
import MyDatabase from "../Database/MyDatabase";
import CustomButton from "../Components/CustomButton/CustomButton";
import NumericInput from "react-native-numeric-input";

type Props = {
    navigation: any;
};

type Wine = {
    name: string;
    image: string;
    color: string;
    region: string;
    year: number;
    grape: string;
    code: string;
    quantity: number;
};
export default function WineScanner({navigation}: Props) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [wineData, setWineData] = useState("");
    const [scannedWines, setScannedWines] = React.useState<any>([]);
    const [suggestions, setSuggestions] = React.useState<any>([]);
    const [quantityToRemove, setQuantityToRemove] = React.useState(1);


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
            MyDatabase.getWineByBarcode(scannedData, (result: any[]) => {
                if (result === null) {
                    return;
                }
                setScannedWines(result);
            })
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        MyDatabase.getSuggestionByWine(scannedWines.country_id, scannedWines.region_id, scannedWines.colors, (resultSuggestion: any[]) => {
            console.log(resultSuggestion)
            setSuggestions(resultSuggestion);
        })
    }, [scannedWines])

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (!hasPermission) {
        return <Text>No access to camera</Text>;
    }

    const handleRemoveBottle = () => {
        MyDatabase.removeWineById(scannedWines.id, 1)
    }

    function removeWine(wineId: number, quantityToRemove: number) {
        MyDatabase.removeWineToDb(wineId, quantityToRemove);
        MyDatabase.getWineByBarcode(wineData, (result: any[]) => {
            if (result === null) {
                return;
            }
            setScannedWines(result);
        })
    }

    return (
        <View style={styles.container}>
            {!scanned && (
                <BarCodeScanner
                    onBarCodeScanned={handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
            )}
            {scannedWines.length !== 0 ? (
                <View style={styles.scannedContainer}>
                    <View style={styles.card}>
                        {scannedWines.images === "" ? (
                            <Image
                                source={require("../assets/vinrouge.png")}
                                style={styles.wineImg}
                            />
                        ) : (
                            <Image source={{uri: scannedWines.images}} style={styles.wineImg}/>
                        )}
                        <View style={styles.column}>
                            <Text style={styles.text}> Nom : {scannedWines.names}</Text>
                            <Text style={styles.text}> Robe : {scannedWines.colors}</Text>
                            <Text style={styles.text}> Région : {scannedWines.region_id}</Text>
                            <Text style={styles.text}> Année : {scannedWines.years}</Text>
                            <Text style={styles.text}> Cépage : {scannedWines.grapes}</Text>
                            <Text style={styles.text}> Quantité : {scannedWines.quantities}</Text>
                        </View>
                    </View>
                    <View style={styles.rowRemove}>
                        <Text>Quantité à enlever :</Text>
                        <NumericInput onChange={value => setQuantityToRemove(value)} minValue={1} rounded
                                      totalHeight={40} totalWidth={80}
                                      maxValue={scannedWines.quantities}
                                      rightButtonBackgroundColor='#c2a5a5'
                                      leftButtonBackgroundColor='#c2a5a5'></NumericInput>
                        <CustomButton
                            onPress={scannedWines.quantities > 0 ? () => removeWine(scannedWines.id, quantityToRemove) : () => console.log("quantité trop faible")}
                            text={"Enlever"}/>
                    </View>
                    <View style={styles.viewTitle}>
                        <Text style={styles.title}>
                            Pour ce vin nous vous proposons les plats suivants :
                        </Text>
                    </View>
                    <FlatList style={styles.flatList} data={suggestions} renderItem={({item}) => (
                        <View style={styles.viewSuggestion}>
                            <Text style={styles.text}>{item.name}</Text>
                        </View>

                    )}/>
                </View>

            ) : (<Text>Pas de vin avec ce code</Text>)
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    viewTitle: {
        paddingTop: 16,
    },
    title: {
        fontFamily: "Rajdhani_700Bold",
        fontSize: 18,
        textAlign: "center"
    },
    scannedContainer: {
        width: "100%",
        flex: 1,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    card: {
        width: '100%',
        backgroundColor: "#f6f6f6",
        borderRadius: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderColor: 'white',
        elevation: 2,
        gap: 20,
    },
    column: {
        display: "flex",
        flexDirection: "column",
    },
    columnQuantity: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "40%",
        gap: 16,
    },
    wineImg: {
        width: 100,
        height: 130,
        borderWidth: 0,
        borderRadius: 8,
        borderColor: "#A0251D"
    },
    text: {
        fontFamily: "Rajdhani_400Regular",
    },
    flatList: {
        width: "100%",
        flex: 1,
    },
    viewSuggestion: {
        paddingVertical: 5,
        alignSelf: "center"
    },
    rowRemove: {
        display: "flex",
        flexDirection: "row",
        gap: 16,
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    }
});
