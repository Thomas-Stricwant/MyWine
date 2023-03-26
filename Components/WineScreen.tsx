import * as React from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import MyDatabase from '../Database/MyDatabase';
import CustomButton from "./CustomButton/CustomButton";
import NumericInput from 'react-native-numeric-input'


type Props = {
    navigation: any;
}

interface Wine {
    id: number;
    names: string;
    images: string;
    colors: string;
    regions: string;
    years: number;
    grapes: string;
    quantities: number;
}

export default function WineScreen({navigation}: Props) {
    const [wines, setWines] = React.useState<Wine[]>([]);
    const [quantityToRemove, setQuantityToRemove] = React.useState(1);

    React.useEffect(() => {
        fetchWines();
    }, []);

    const fetchWines = () => {
        MyDatabase.getAllWines((result: Wine[]) => {
            setWines(result);
        });
    }
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', (e: any) => {
            MyDatabase.getAllWines((result: Wine[]) => {
                console.log(result);
                setWines(result);
                console.log(result);
            });
        });

        return unsubscribe;
    }, [navigation]);

    function removeWine(wineId: number, quantityToRemove: number) {
        MyDatabase.removeWineToDb(wineId, quantityToRemove);
        fetchWines();
    }

    // @ts-ignore
    // @ts-ignore
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Liste de vos vins</Text>
            <CustomButton onPress={() => {
                navigation.navigate('Ajouter', {screen: 'Ajouter un vin'});
            }} text={'Ajouter un vin'}/>
            <CustomButton onPress={MyDatabase.dropTable} text={'drop la db'}/>
            <FlatList
                data={wines}
                style={styles.flatList}
                renderItem={({item}) => (
                    <View style={styles.item}>
                        <View style={styles.card}>
                            {item.images === "" ?
                                <Image source={require("../assets/vinrouge.png")} style={styles.wineImg}/> :
                                <Image source={{uri: item.images}} style={styles.wineImg}/>}
                            <View style={styles.column}>
                                <Text style={styles.text}> Nom : {item.names}</Text>
                                <Text style={styles.text}> Robe : {item.colors}</Text>
                                <Text style={styles.text}> Région : {item.regions}</Text>
                                <Text style={styles.text}> Année : {item.years}</Text>
                                <Text style={styles.text}> Cépage : {item.grapes}</Text>
                                <Text style={styles.text}> Quantité : {item.quantities}</Text>
                            </View>
                            <View style={styles.columnQuantity}>
                                <NumericInput onChange={value => setQuantityToRemove(value)} minValue={1} rounded
                                              totalHeight={40} totalWidth={80}
                                              maxValue={item.quantities}
                                              initValue={1}
                                              rightButtonBackgroundColor='#c2a5a5'
                                              leftButtonBackgroundColor='#c2a5a5'></NumericInput>
                                <CustomButton
                                    onPress={item.quantities > 0 ? () => removeWine(item.id, quantityToRemove) : () => console.log("quantité trop faible")}
                                    text={"Enlever"}/>
                            </View>

                        </View>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    input: {
        paddingHorizontal: 5,
        textAlign: "center",
        paddingVertical: 1,
        backgroundColor: "#ef6d6d",
        fontFamily: 'Rajdhani_700Bold',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#CBCBCB",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 2,
        margin: 10,
    },
    textButton: {
        color: 'white',
        fontFamily: "Rajdhani_400Regular",
    },
    title: {
        fontFamily: "Rajdhani_700Bold",
        fontSize: 23,
        paddingVertical: 15,
    },
    flatList: {
        width: '100%',
        paddingHorizontal: 15
    },
    item: {
        flex: 1,
        paddingVertical: 10,
        gap: 8,
        width: '100%',
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    card: {
        flex: 1,
        width: '100%',
        backgroundColor: "#f6f6f6",
        borderRadius: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderColor: 'white',
        elevation: 2,
        gap: 16,

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
});
