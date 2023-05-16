import * as React from 'react';
import {FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import MyDatabase from '../Database/MyDatabase';
import CustomButton from "../Components/CustomButton/CustomButton";
import NumericInput from 'react-native-numeric-input';
import {AirbnbRating} from "react-native-ratings";
import Toast from "react-native-root-toast";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


type Props = {
    navigation: any;
};

interface Wine {
    id: number;
    names: string;
    images: string;
    colors: string;
    country_id: number;
    region_id: number;
    years: number;
    grapes: string;
    quantities: number;
    reviews: string;
    ratings: number;
}

const colorsTab = [
    "Rouge", "Rosé", "Blanc"
];

const countriesTab = [
    {
        name: "Belgique",
        id: 1,
    },
    {
        name: "France",
        id: 2,
    },
    {
        name: "Italie",
        id: 3,
    },
    {
        name: "Espagne",
        id: 4,
    }
];


export default function WineScreen({navigation}: Props) {
    const [wines, setWines] = React.useState<Wine[]>([]);
    const [winesTemp, setWinesTemp] = React.useState<Wine[]>([]);
    const [quantityToRemove, setQuantityToRemove] = React.useState(1);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [filterModalOpen, setFilterModalOpen] = React.useState(false);
    const [modalSuggestionVisible, setModalSuggestionVisible] = React.useState(false);
    const [wineSelected, setWineSelected] = React.useState({id: 0, name: ""});
    const [wineSuggestionSelected, setWineSuggestionSelected] = React.useState("");
    const [starRating, setStarRating] = React.useState(2);
    const [textReview, setTextReview] = React.useState("");
    const [suggestions, setSuggestions] = React.useState<any[]>([]);
    const [regionList, setRegionList] = React.useState<any[]>([]);

    const [filters, setFilter] = React.useState({
        colorFilter: "",
        countryFilter: 0,
        regionFilter: 0
    });

    const fetchWines = () => {
        MyDatabase.getAllWines((result: Wine[]) => {
            setWines(result);
            setWinesTemp(result);
        });
    }
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', (e: any) => {
            MyDatabase.getAllWines((result: Wine[]) => {
                setWines(result);
                setWinesTemp(result);
            });
            setFilter({
                colorFilter: "",
                countryFilter: 0,
                regionFilter: 0
            });
        });


        return unsubscribe;
    }, [navigation]);

    function removeWine(wineId: number, quantityToRemove: number) {
        MyDatabase.removeWineToDb(wineId, quantityToRemove);
        fetchWines();
        Toast.show(quantityToRemove + ' bouteille(s) enlevée(s).', {
            duration: Toast.durations.SHORT,
        });
    }

    const createReview = (id: number, name: string) => {
        setWineSelected({id: id, name: name});
        setModalVisible(true);
    }

    const handleReview = () => {
        MyDatabase.addReviewToWine(wineSelected.id, textReview, starRating);
        setModalVisible(false);
        Toast.show('Avis ajouté avec succès.', {
            duration: Toast.durations.SHORT,
        });
    }

    const handleDrop = () => {
        MyDatabase.dropDishesTable();
        MyDatabase.dropCountriesTable();
        MyDatabase.dropRegionsTable();
        MyDatabase.dropTable();
    }

    function handleSuggestion(name: string, country: number, region: number, color: string) {
        MyDatabase.getSuggestionByWine(country, region, color, (result: any[]) => {
            setSuggestions(result);
        })
        setWineSuggestionSelected(name);
        setModalSuggestionVisible(true);
    }

    const openFilterModal = () => {
        setFilterModalOpen(true);
    }

    function handleColorFilter(colorName: string) {

        if (filters.colorFilter === colorName) {
            setFilter({
                ...filters,
                colorFilter: ""
            })
            return;
        }

        setFilter({
            ...filters,
            colorFilter: colorName
        })
    }

    function handleCountryFilter(countryId: number) {
        if (filters.countryFilter === countryId) {
            setFilter({
                ...filters,
                countryFilter: 0,
            });
            setRegionList([]);
            return;
        }
        setFilter({
            ...filters,
            countryFilter: countryId,
        })
        MyDatabase.getAllRegionsByCountryId(countryId, result => {
            setRegionList(result);
        })
    }

    function handleRegionFilter(regionId: number) {
        if (filters.regionFilter === regionId) {
            setFilter({
                ...filters,
                regionFilter: 0
            })
            return;
        }

        setFilter({
            ...filters,
            regionFilter: regionId
        })
    }

    const handleResultFilter = () => {
        if (filters.colorFilter !== "" && filters.countryFilter === 0) {
            const filteredWines = wines.filter(wine => wine.colors === filters.colorFilter);
            setWinesTemp(filteredWines);
        } else if (filters.colorFilter !== "" && filters.countryFilter !== 0 && filters.regionFilter === 0) {
            const filteredWines = wines.filter(wine => wine.colors === filters.colorFilter && wine.country_id === filters.countryFilter);
            setWinesTemp(filteredWines);
        } else if (filters.colorFilter !== "" && filters.countryFilter !== 0 && filters.regionFilter !== 0) {
            const filteredWines = wines.filter(wine => wine.colors === filters.colorFilter && wine.country_id === filters.countryFilter && wine.region_id === filters.regionFilter);
            setWinesTemp(filteredWines);
        } else if (filters.colorFilter === "" && filters.countryFilter !== 0 && filters.regionFilter !== 0) {
            const filteredWines = wines.filter(wine => wine.country_id === filters.countryFilter && wine.region_id === filters.regionFilter);
            setWinesTemp(filteredWines);
        } else if (filters.colorFilter === "" && filters.countryFilter !== 0 && filters.regionFilter === 0) {
            const filteredWines = wines.filter(wine => wine.country_id === filters.countryFilter);
            setWinesTemp(filteredWines);
        } else if (filters.colorFilter === "" && filters.countryFilter === 0 && filters.regionFilter === 0) {
            setWinesTemp(wines);
        }
        setFilterModalOpen(false);
    }

    const handleResetFilter = () => {
        setFilter({
            colorFilter: "",
            countryFilter: 0,
            regionFilter: 0
        });
        setRegionList([]);
        setWinesTemp(wines);
    }

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.overlay}/>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Rédigez un avis sur le vin : {wineSelected.name}</Text>
                        <View>
                            <Text>Note sur le vin : </Text>
                            <View style={styles.stars}>
                                <AirbnbRating
                                    count={5}
                                    reviews={["Mauvais", "Bof", "Bon", "Très bon", "Incroyable"]}
                                    defaultRating={2}
                                    size={25}
                                    starContainerStyle={{gap: 8}}
                                    onFinishRating={(rating: number) => setStarRating(rating)}
                                />
                            </View>
                        </View>
                        <View>
                            <TextInput editable
                                       style={styles.textArea}
                                       placeholder={"Rédigez votre avis"}
                                       multiline
                                       textAlignVertical={"top"}
                                       onChangeText={setTextReview}
                                       numberOfLines={5}/>
                        </View>
                        <View style={styles.rowModalButton}>
                            <CustomButton onPress={handleReview} text={"Enregistrer l'avis"}/>
                            <CustomButton onPress={() => setModalVisible(!modalVisible)} text={"Fermer"}/>
                        </View>

                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalSuggestionVisible}
                onRequestClose={() => {
                    setModalSuggestionVisible(!modalSuggestionVisible);
                }}>
                <View style={styles.overlay}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text>Nous vous suggérons pour {wineSuggestionSelected} : </Text>
                            <View style={styles.stars}>
                                {suggestions.map((item, index) => (
                                    <Text key={index}>
                                        {item.name}
                                    </Text>
                                ))}
                            </View>
                            <View style={styles.rowModalButton}>
                                <CustomButton onPress={() => setModalSuggestionVisible(!modalSuggestionVisible)}
                                              text={"Fermer"}/>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={filterModalOpen}
                onRequestClose={() => {
                    setFilterModalOpen(!filterModalOpen);
                }}>
                <View style={styles.overlayMenu}>
                    <View style={styles.menuModal}>
                        <View style={styles.backgroundTitle}>
                            <Text style={styles.whiteText}>
                                Filtres
                            </Text>
                            <Text style={styles.whiteClose} onPress={handleResultFilter}>
                                X
                            </Text>
                        </View>
                        <View style={styles.menuModalView}>
                            <ScrollView style={styles.scrollFilter}>
                                <View style={styles.filterCategory}>
                                    <Text style={styles.subTitle}>Trier par robe :</Text>
                                    <View style={styles.rowButton}>
                                        {colorsTab.map((item) => (
                                            <TouchableOpacity
                                                key={item}
                                                onPress={() => handleColorFilter(item)}
                                                style={filters.colorFilter === item ? styles.selectedButton : styles.customButton}
                                                activeOpacity={0.8}>
                                                <Text
                                                    style={filters.colorFilter === item ? styles.selectedText : styles.textButton}>{item}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                                <View style={styles.filterCategory}>
                                    <Text style={styles.subTitle}>Trier par pays :</Text>
                                    <View style={styles.rowButton}>
                                        {countriesTab.map((item) => (
                                            <TouchableOpacity
                                                key={item.name}
                                                onPress={() => handleCountryFilter(item.id)}
                                                style={filters.countryFilter === item.id ? styles.selectedButton : styles.customButton}
                                                activeOpacity={0.8}>
                                                <Text
                                                    style={filters.countryFilter === item.id ? styles.selectedText : styles.textButton}>{item.name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                                <View style={styles.filterCategory}>
                                    <Text style={styles.subTitle}>Trier par région :</Text>
                                    <View style={styles.rowButton}>
                                        {regionList.length === 0 ? (
                                            <Text>Choisissez un pays</Text>) : (regionList.map((item, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => handleRegionFilter(item.id)}
                                                style={filters.regionFilter === item.id ? styles.selectedButton : styles.customButton}
                                                activeOpacity={0.8}>
                                                <Text
                                                    style={filters.regionFilter === item.id ? styles.selectedText : styles.textButton}>{item.name}</Text>
                                            </TouchableOpacity>
                                        )))}
                                    </View>
                                </View>
                                <View style={styles.closeButton}>
                                    <CustomButton onPress={handleResultFilter}
                                                  text={"Appliquer le(s) filtre(s)"}/>
                                    <CustomButton onPress={handleResetFilter}
                                                  text={"Réinitialiser"}/>
                                </View>
                            </ScrollView>

                        </View>
                    </View>
                </View>
            </Modal>
            <Text style={styles.title}>Liste de vos vins</Text>
            <View style={styles.rowModalButton}>
                <CustomButton onPress={() => {
                    navigation.navigate('Ajouter', {screen: 'Ajouter un vin'});
                }} text={'Ajouter un vin'}/>
                <CustomButton onPress={() => navigation.navigate('WineShare')} text={'Partager votre cave'}/>
                <TouchableOpacity onPress={() => navigation.navigate('WineScanner')}
                                  style={styles.scanButton}>
                    <Icon name="barcode-scan" size={24} color="white"/>
                </TouchableOpacity>
            </View>
            <CustomButton onPress={handleDrop} text={'drop la db'}/>
            <CustomButton onPress={openFilterModal} text={'Filtrer'}/>
            <FlatList
                data={winesTemp}
                style={styles.flatList}
                renderItem={({item}) => (
                    <View style={styles.item}>
                        {item.quantities > 0 ?
                            <View style={styles.card}>
                                <View style={styles.rowImgInfos}>
                                    {item.images === "" ?
                                        <Image source={require("../assets/vinrouge.png")} style={styles.wineImg}/> :
                                        <Image source={{uri: item.images}} style={styles.wineImg}/>}

                                    <View style={styles.rowCard}>
                                        <View style={styles.column}>
                                            <View>
                                                <Text style={styles.textBold}>Nom : </Text>
                                                <Text style={styles.text}>{item.names}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.textBold}>Robe : </Text>
                                                <Text style={styles.text}>{item.colors}</Text>
                                            </View>
                                            <View style={styles.textContainer}>
                                                <Text style={styles.textBold}>Pays : </Text>
                                                <Text style={styles.text}>{item.country_id}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.column}>
                                            <View style={styles.textContainer}>
                                                <Text style={styles.textBold}>Région : </Text>
                                                <Text style={styles.text} numberOfLines={1}>{item.region_id}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.textBold}>Année : </Text>
                                                <Text style={styles.text}>{item.years}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.textBold}>Quantité : </Text>
                                                <Text style={styles.text}>{item.quantities}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.columnCenter}>
                                    <View style={styles.rowButton}>
                                        {item.ratings === null ? (
                                            <CustomButton onPress={() => createReview(item.id, item.names)}
                                                          text={"Ajouter un avis"}/>) : null}
                                        <CustomButton
                                            onPress={() => handleSuggestion(item.names, item.country_id, item.region_id, item.colors)}
                                            text={"Suggestions"}/>
                                    </View>
                                    <View style={styles.columnCenter}>
                                        <Text style={styles.textBold}>Quantité à enlever :</Text>
                                        <View style={styles.rowButton}>
                                            <NumericInput onChange={value => setQuantityToRemove(value)}
                                                          minValue={1}
                                                          rounded
                                                          totalHeight={35} totalWidth={75}
                                                          maxValue={item.quantities}
                                                          rightButtonBackgroundColor='#c2a5a5'
                                                          leftButtonBackgroundColor='#c2a5a5'></NumericInput>
                                            <CustomButton
                                                onPress={item.quantities > 0 ? () => removeWine(item.id, quantityToRemove) : () => console.log("quantité trop faible")}
                                                text={"Enlever"}/>
                                        </View>
                                    </View>


                                </View>
                            </View>
                            : null
                        }
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
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    stars: {
        paddingBottom: 16,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    textArea: {
        paddingTop: 6,
        borderWidth: 1,
        width: 250,
        paddingHorizontal: 15,
        backgroundColor: "#F8F8F8",
        fontFamily: 'Rajdhani_700Bold',
        borderRadius: 4,
        borderColor: "#CBCBCB",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 2,
        marginBottom: 16,
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
    title: {
        fontFamily: "Rajdhani_700Bold",
        fontSize: 23,
        paddingVertical: 15,
    },
    subTitle: {
        fontFamily: "Rajdhani_700Bold",
        fontSize: 18,
        paddingBottom: 15,
    },
    backgroundTitle: {
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 8
    },
    rowModalButton: {
        display: "flex",
        flexDirection: "row",
        gap: 16
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
        flexDirection: "column",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderColor: 'white',
        elevation: 2,
        gap: 16,
    },
    column: {
        display: "flex",
        flexDirection: "column",
        gap: 8
    },
    rowCardButton: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    wineImg: {
        width: 100,
        height: 130,
        borderWidth: 0,
        borderRadius: 8,
        borderColor: "#A0251D"
    },
    textContainer: {
        display: "flex",
        flexDirection: "column",
    },
    text: {
        fontFamily: "Rajdhani_400Regular",
        flex: 1,
        width: 100,
    },
    textBold: {
        fontFamily: "Rajdhani_700Bold",
    },
    overlayMenu: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: "flex-end"
    },
    menuModal: {
        width: "100%",
        flex: 1,
        justifyContent: "flex-end"
    },
    menuModalView: {
        width: "100%",
        backgroundColor: "#fff",
        height: "70%",
        padding: 16,
        paddingTop: 8
    },
    scrollFilter: {
        display: "flex",
        flexDirection: "column",
        gap: 16
    },
    filterCategory: {
        paddingVertical: 8
    },
    customButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 8,
    },
    selectedButton: {
        backgroundColor: "#000",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderRadius: 8,
    },
    textButton: {
        color: 'black',
        fontFamily: "Rajdhani_700Bold",
    },
    selectedText: {
        color: 'white',
        fontFamily: "Rajdhani_700Bold",
    },
    rowButton: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    closeButton: {
        display: "flex",
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        paddingTop: 8,
    },
    whiteText: {
        color: "white",
        fontFamily: "Rajdhani_700Bold",
        fontSize: 20
    },
    whiteClose: {
        color: "white",
        fontFamily: "Rajdhani_700Bold",
        fontSize: 20,
        paddingLeft: 20,
        paddingRight: 5,
    },
    rowCard: {
        display: "flex",
        flexDirection: "row",
    },
    rowImgInfos: {
        display: "flex",
        flexDirection: "row",
        gap: 16
    },
    columnCenter: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8
    },
    scanButton: {
        display: "flex",
        justifyContent: "center",
        backgroundColor: '#853832',
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
});
