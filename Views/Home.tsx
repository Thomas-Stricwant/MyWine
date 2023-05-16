import * as React from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import MyDatabase from "../Database/MyDatabase";
import CustomButton from "../Components/CustomButton/CustomButton";


type Props = {
    navigation: any;
}

export default function Home({navigation}: Props) {
    const [randomWine, setRandomWine] = React.useState<any>([]);
    const [randomDish, setRandomDish] = React.useState<any>([]);
    const [suggestions, setSuggestions] = React.useState<any>([]);
    const [winesBySuggestion, setWinesBySuggestion] = React.useState<any>([]);

    function getRandomInt(length: number) {
        return Math.floor(Math.random() * length) + 1;
    }

    React.useEffect(() => {
        const fetchData = async () => {
            const length = await MyDatabase.getLength();
            const idRandom = getRandomInt(length);
            MyDatabase.getWineById(idRandom, (result: any[]) => {
                if (result === null || result.length === 0) {
                    return;
                }
                setRandomWine(result);
                // @ts-ignore
                MyDatabase.getSuggestionByWine(result.country_id, result.region_id, result.colors, (resultSuggestion: any[]) => {
                    setSuggestions(resultSuggestion);
                })
            });
            const dishesLength = await MyDatabase.getDishesLength()
            const idRandomDish = getRandomInt(dishesLength);
            MyDatabase.getDishesById(idRandomDish, (dishResult: any[]) => {
                if (dishResult === null || dishResult.length === 0) {
                    return;
                }
                setRandomDish(dishResult);
                // @ts-ignore
                MyDatabase.getWinesBySuggestion(dishResult.country_id, dishResult.region_id, dishResult.color, (resultWines: any[]) => {
                    console.log("result =", resultWines)
                    setWinesBySuggestion(resultWines);
                })
            })
        };

        const unsubscribe = navigation.addListener('focus', fetchData);
        return unsubscribe;
    }, [navigation]);


    return (
        <View style={styles.container}>
            {randomWine.id !== 0 ? (
                <View>
                    <Text style={styles.title}>Suggestion aléatoire selon vos vins</Text>
                    <View>
                        <View style={styles.card}>
                            <View style={styles.rowInfo}>
                                {randomWine?.images === "" ?
                                    <Image source={require("../assets/vinrouge.png")} style={styles.wineImg}/> :
                                    <Image source={{uri: randomWine?.images}} style={styles.wineImg}/>}
                                <View style={styles.column}>
                                    <Text style={styles.wineName}>{randomWine.names}</Text>
                                    <Text style={styles.wineYear}>{randomWine?.years}</Text>
                                    <Text style={styles.wineRegion}>{randomWine?.regions}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.flatListContainer}>
                        <Text style={styles.textBoldCenter}>Ce vin se marie bien en accompagnement de :</Text>
                        <FlatList style={styles.flatList} data={suggestions} renderItem={({item}) => (
                            <View style={styles.itemContainer}>
                                <Text style={styles.text}>{item.name}</Text>
                            </View>
                        )}/>
                    </View>
                    <View>
                        <Text style={styles.textBoldCenter}>Ou alors pourquoi n'essaieriez-vous pas :</Text>
                        <View style={styles.cardCenter}>
                            <Text style={styles.dishName}>{randomDish.name}</Text>
                        </View>
                        <View>
                            <FlatList style={styles.flatList} data={winesBySuggestion} renderItem={({item}) => (
                                <View style={styles.itemContainer}>
                                    <Text style={styles.text}>{item.names}</Text>
                                </View>
                            )}/>
                        </View>
                    </View>
                </View>) : (
                <View style={styles.noWineContainer}>
                    <Text style={styles.title}>Bienvenue sur MyWineCave</Text>
                    <Text style={styles.text}>Tout d'abord, ajoutez des vins à votre application, afin de pouvoir
                        immédiatement recevoir de
                        pouvoir profiter des différentes fonctionnalités de MyWineCave</Text>
                    <Text style={styles.textBoldCenter}>Commencez tout de suite en appuyant ici !</Text>
                    <CustomButton onPress={() => navigation.navigate('Ajouter', {screen: 'Ajouter un vin'})}
                                  text={"Ajouter un vin"}/>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    noWineContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        gap: 8
    },
    title: {
        fontFamily: "Rajdhani_700Bold",
        fontSize: 20,
        paddingTop: 10,
        paddingBottom: 15,
        textAlign: "center"
    },
    dishName: {
        fontFamily: "Rajdhani_700Bold",
        fontSize: 20,
        textAlign: "center",
    },
    wineName: {
        fontFamily: "Rajdhani_700Bold",
        fontSize: 20,
        textAlign: "center"
    },
    textBoldCenter: {
        fontFamily: "Rajdhani_700Bold",
        textAlign: "center",
        paddingVertical: 15
    },
    wineYear: {
        fontFamily: "Rajdhani_700Bold",
        fontSize: 16,
        textAlign: "center"
    },
    wineRegion: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: 'Rajdhani_400Regular',
    },
    text: {
        fontFamily: 'Rajdhani_400Regular',
    },
    card: {
        width: "100%",
        backgroundColor: "#f6f6f6",
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderColor: 'white',
        elevation: 2,
    },
    cardCenter: {
        width: "100%",
        backgroundColor: "#f6f6f6",
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderColor: 'white',
        elevation: 2,
        marginBottom: 15,
    },
    wineImg: {
        width: 120,
        height: 150,
        borderRadius: 8,
    },
    rowInfo: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        gap: 16,
    },
    column: {
        display: "flex",
        marginTop: 30,
        flex: 1,
        gap: 8,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    textBold: {
        fontFamily: "Rajdhani_700Bold",
    },
    flatList: {},
    viewSuggestion: {
        paddingTop: 10,
        alignSelf: "center"
    },
    flatListContainer: {
        height: 100,
    },
    itemContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
});