import * as React from 'react';
import {FlatList, Image, Modal, StyleSheet, Text, TextInput, View} from 'react-native';
import MyDatabase from "../Database/MyDatabase";
import CustomButton from "../Components/CustomButton/CustomButton";
import {AirbnbRating} from "react-native-ratings";
import Toast from 'react-native-root-toast';

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
    ratings: number;
    reviews: string;
}

export default function Reviews({navigation}: Props) {
    const [winesReviewed, setWinesReviewed] = React.useState<Wine[]>([]);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [wineSelected, setWineSelected] = React.useState({id: 0, name: "", review: "", rating: 0});
    const [starRating, setStarRating] = React.useState(2);
    const [textReview, setTextReview] = React.useState("");

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', (e: any) => {
            MyDatabase.getAllReviews((result: Wine[]) => {
                console.log("reviews: ", result);
                setWinesReviewed(result);
            });
        });

        return unsubscribe;
    }, [navigation, MyDatabase.addReviewToWine]);

    const updateReview = (id: number, name: string, review: string, rating: number) => {
        setWineSelected({id: id, name: name, review: review, rating: rating});
        setStarRating(rating);
        setTextReview(review);
        setModalVisible(true);

    }

    const handleReview = () => {
        MyDatabase.addReviewToWine(wineSelected.id, textReview, starRating);
        MyDatabase.getAllReviews((result: Wine[]) => {
            console.log("reviews: ", result);
            setWinesReviewed(result);
        });
        setModalVisible(false);
        Toast.show('Avis enregistré.', {
            duration: Toast.durations.SHORT,
        });
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
                <View style={styles.overlay}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Rédigez un avis sur le vin : {wineSelected.name}</Text>
                            <View>
                                <Text>Note sur le vin : </Text>
                                <View style={styles.stars}>
                                    <AirbnbRating
                                        count={5}
                                        reviews={["Mauvais", "Bof", "Bon", "Très bon", "Incroyable"]}
                                        defaultRating={wineSelected.rating}
                                        size={25}
                                        starContainerStyle={{gap: 8}}
                                        onFinishRating={(rating: number) => setStarRating(rating)}
                                    />
                                </View>
                            </View>
                            <View>
                                <TextInput editable
                                           style={styles.textArea}
                                           placeholder={wineSelected.review}
                                           multiline
                                           textAlignVertical={"top"}
                                           onChangeText={setTextReview}
                                           numberOfLines={5}/>
                            </View>
                            <View>
                                <CustomButton onPress={() => setModalVisible(!modalVisible)} text={"Fermer"}/>
                                <CustomButton onPress={handleReview} text={"Enregistrer l'avis"}/>
                            </View>

                        </View>
                    </View>
                </View>
            </Modal>
            {winesReviewed.length > 0 ? (
                <View style={styles.reviewContainer}>
                    <Text style={styles.title}>Vos avis</Text>
                    <FlatList
                        data={winesReviewed}
                        style={styles.flatList}
                        renderItem={({item}) => (
                            <View style={styles.item}>
                                {item.ratings !== null ? (
                                    <View style={styles.reviewCard}>
                                        {item.images === "" ? (
                                            <Image
                                                source={require("../assets/vinrouge.png")}
                                                style={styles.wineImg}
                                            />
                                        ) : (
                                            <Image
                                                source={{uri: item.images}}
                                                style={styles.wineImg}
                                            />
                                        )}
                                        <View style={styles.columnReview}>
                                            <View style={styles.updateReview}>
                                                <CustomButton
                                                    data-id={item.id}
                                                    onPress={() => updateReview(item.id, item.names, item.reviews, item.ratings)}
                                                    text={"Modifier l'avis"}
                                                />
                                            </View>
                                            <View style={styles.reviewText}>
                                                <AirbnbRating
                                                    showRating={false}
                                                    count={5}
                                                    defaultRating={item.ratings}
                                                    size={15}
                                                    isDisabled={true}
                                                    starContainerStyle={{gap: 0}}
                                                />
                                                <Text style={styles.text}> Note : {item.ratings}/5</Text>
                                                <Text style={styles.text}> Avis : {item.reviews}</Text>
                                            </View>
                                        </View>
                                    </View>
                                ) : null}
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            ) : (
                <View style={styles.noReviewContainer}>
                    <Text style={styles.title}>Vos avis</Text>
                    <View style={styles.columnNoReview}>
                        <Text style={styles.textCenter}>Vous n'avez pas encore redigé d'avis.</Text>
                        <Text style={styles.textCenter}>Vous les retrouverez tous ici une fois créés.</Text>
                        <Text style={styles.textCenter}>Appuyez sur le bouton et sélectionner un vin sur lequel vous
                            souhaitez
                            rédiger un
                            avis.</Text>
                    </View>
                    <CustomButton onPress={() => navigation.navigate('Mes vins', {screen: 'WineScreen'})}
                                  text={"Vers mes vins"}/>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    noReviewContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        paddingTop: 30,
        width: "100%",
        height: "100%"
    },
    reviewContainer: {
        width: '100%',
        height: '100%',
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

    container: {
        display: "flex",
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    title: {
        fontFamily: "Rajdhani_700Bold",
        fontSize: 20,
        paddingTop: 10,
        textAlign: "center"
    },
    flatList: {
        width: '100%',
        paddingHorizontal: 15,
        paddingBottom: 16
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
    reviewCard: {
        flex: 1,
        width: '100%',
        backgroundColor: "#f6f6f6",
        borderRadius: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
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
    reviewText: {
        paddingTop: 8,
        width: 200,
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
    textCenter: {
        fontFamily: "Rajdhani_400Regular",
        textAlign: "center",
    },
    columnReview: {
        display: "flex",
        flexDirection: "column",
    },
    columnNoReview: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "70%",
        gap: 8,
    },
    updateReview: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start"
    },
});