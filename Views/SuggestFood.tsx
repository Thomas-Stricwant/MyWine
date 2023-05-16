import * as React from 'react';
import {FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {DISHES_CATEGORIES} from "../Components/ExportedLists/ExportedLists";
import MyDatabase from "../Database/MyDatabase";

type Props = {
    navigation: any;
}


export default function SuggestFood({navigation}: Props) {
    const [wineByColor, setWineByColor] = React.useState<any[]>([])

    function handleCategoryPress(color: string) {
        MyDatabase.getWineByColor(color, (result: any[]) => {
            setWineByColor(result)
        })
    }

    return (
        <View style={styles.container}>
            <FlatList data={DISHES_CATEGORIES} style={styles.flatListCategories} horizontal={true} bounces={false}
                      renderItem={({item}) => (
                          <TouchableOpacity key={item.name} data-color={item.color}
                                            onPress={() => handleCategoryPress(item.color)}>
                              <View style={styles.cardContainer}>
                                  <ImageBackground resizeMode="cover"
                                                   source={item.img}
                                                   imageStyle={{borderRadius: 8, opacity: .5}}
                                                   style={styles.imgBackground}>
                                      <Text style={styles.categoryText}>{item.name}</Text>
                                  </ImageBackground>
                              </View>
                          </TouchableOpacity>
                      )}/>
            <View style={styles.listOfWine}>
                {wineByColor.length === 0 ? (
                    <View style={styles.viewNoWine}>
                        <Text style={styles.whiteText}>Vous n'avez pas encore de vin qui s'accorderait avec ce type de
                            plat</Text>
                    </View>
                ) : (
                    <FlatList data={wineByColor} style={styles.selectedList} renderItem={({item}) => (
                        <View style={styles.card}>
                            <View style={styles.rowInfo}>
                                {item.images === "" ?
                                    <Image source={require("../assets/vinrouge.png")} style={styles.wineImg}/> :
                                    <Image source={{uri: item.images}} style={styles.wineImg}/>}
                                <View style={styles.column}>
                                    <Text style={styles.wineName}>{item.names}</Text>
                                    <Text style={styles.wineYear}>{item?.years}</Text>
                                </View>
                            </View>
                        </View>
                    )}/>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#543b3b',
        height: "100%"
    },
    text: {
        fontFamily: 'Rajdhani_700Bold',
        textAlign: "center"
    },
    whiteText: {
        fontFamily: 'Rajdhani_400Regular',
        color: "white",
        textAlign: "center",
    },
    flatListCategories: {
        display: "flex",
        maxHeight: 220,
        paddingVertical: 10,
        flex: 1,
    },
    selectedList: {
        paddingHorizontal: 10,
        width: "100%",
        paddingBottom: 20
    },
    cardContainer: {
        width: 150,
        height: 200,
        flexDirection: "column",
        marginHorizontal: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        borderRadius: 8,
        elevation: 5,
    },
    imgBackground: {
        width: '100%',
        height: '100%',
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    categoryText: {
        fontSize: 25,
        fontFamily: 'Rajdhani_700Bold',
        color: "white",
        textShadowColor: "black",
        textShadowOffset: {width: -1, height: -1},
        textShadowRadius: 20
    },
    listOfWine: {
        height: "100%",
        flex: 1,
        borderTopWidth: 1,
        borderTopColor: "white",
        marginHorizontal: 10,
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
    card: {
        width: "100%",
        backgroundColor: "#f6f6f6",
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-evenly",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderColor: 'white',
        elevation: 2,
        marginVertical: 5,
    },
    wineImg: {
        width: 60,
        height: 80,
        resizeMode: "cover",
        borderRadius: 8,
    },
    rowInfo: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 16
    },
    column: {
        display: "flex",
        flex: 1,
        gap: 8,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    viewNoWine: {
        display: "flex",
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        paddingTop: 10
    },
});